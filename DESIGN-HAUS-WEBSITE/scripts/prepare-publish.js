const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..', '..');
const srcDir = path.resolve(__dirname, '..');
const publishDir = path.resolve(rootDir, 'publish');
const zipPath = path.resolve(rootDir, 'publish.zip');

console.log('Root dir:', rootDir);
console.log('Source dir:', srcDir);
console.log('Publish dir:', publishDir);

// 1. Clean existing publish dir and zip
if (fs.existsSync(publishDir)) {
  fs.rmSync(publishDir, { recursive: true, force: true });
}
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}
fs.mkdirSync(publishDir, { recursive: true });

// 2. Define files and directories to copy
const allowedRootFiles = [
  '404.html',
  'admin.css',
  'admin.html',
  'admin.js',
  'architecture-3d.js',
  'config.example.js',
  'config.js',
  'contact-3d.js',
  'contact.html',
  'contact.js',
  'i18n.js',
  'index.html',
  'manifest.json',
  'monolith.css',
  'monolith.js',
  'netlify.toml',
  'project-details.html',
  'project-details.js',
  'projects.html',
  'projects.js',
  'robots.txt',
  'royal.css',
  'royal.js',
  'services-3d.js',
  'services.html',
  'site-3d.js',
  'site.js',
  'sitemap.xml',
  'studio-3d.js',
  'studio.html',
  'styles.css',
  '_headers',
  '_redirects'
];

for (const f of allowedRootFiles) {
  const src = path.join(srcDir, f);
  const dest = path.join(publishDir, f);
  if (!fs.existsSync(src)) {
    throw new Error(`Required file missing in source: ${f}`);
  }
  fs.copyFileSync(src, dest);
}

// Copy assets recursively
function copyDirRecursive(source, target) {
  fs.mkdirSync(target, { recursive: true });
  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      // Exclude any markdown or hidden files
      if (entry.name.endsWith('.md') || entry.name.startsWith('.')) {
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirRecursive(path.join(srcDir, 'assets'), path.join(publishDir, 'assets'));
copyDirRecursive(path.join(srcDir, 'projects'), path.join(publishDir, 'projects'));

// 3. Verify exclusions
function checkDisallowed(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    const name = item.name.toLowerCase();
    if (
      name === '.git' ||
      name === 'scratch' ||
      name === 'scripts' ||
      name === 'dh-pack' ||
      name === 'node_modules' ||
      name === 'supabase' ||
      name.endsWith('.md') ||
      name.endsWith('.env') ||
      name === '.gitignore'
    ) {
      throw new Error(`DISALLOWED item found in publish: ${full}`);
    }
    if (item.isDirectory()) {
      checkDisallowed(full);
    }
  }
}
checkDisallowed(publishDir);

// Count total files in publish
function listAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listAllFiles(full, fileList);
    } else {
      fileList.push(path.relative(publishDir, full).replace(/\\/g, '/'));
    }
  }
  return fileList;
}

const allFiles = listAllFiles(publishDir);
console.log(`Successfully prepared publish/ directory with ${allFiles.length} files.`);
console.log(`Projects count: ${fs.readdirSync(path.join(publishDir, 'projects')).length}`);

// Write file manifest
fs.writeFileSync(path.join(rootDir, 'publish-filelist.json'), JSON.stringify(allFiles, null, 2));

// 4. Create publish.zip via powershell Compress-Archive
console.log('Creating publish.zip...');
execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${publishDir}\\*' -DestinationPath '${zipPath}' -Force"`, {
  cwd: rootDir,
  stdio: 'inherit'
});

const zipStats = fs.statSync(zipPath);
console.log(`Created publish.zip: ${(zipStats.size / (1024 * 1024)).toFixed(2)} MB`);
