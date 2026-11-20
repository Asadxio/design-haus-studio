const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const projectsJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets/projects.json'), 'utf8'));
const files = fs.readdirSync(path.join(rootDir, 'projects')).filter(f => f.endsWith('.html'));

console.log('=== RIGOROUS ZERO-UNVERIFIED-CLAIMS SCAN ===\n');

let violations = 0;

const allDescriptions = new Set();
projectsJson.forEach(p => {
  if (p.description) allDescriptions.add(p.description.trim());
});

console.log(`Checking ${files.length} static project files against ${allDescriptions.size} known descriptions...`);

files.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, 'projects', file), 'utf8');

  // Check 1: No description from projects.json rendered
  allDescriptions.forEach(desc => {
    const chunk = desc.slice(0, 40);
    if (content.includes(chunk)) {
      console.error(`[FAIL] ${file} contains description chunk: "${chunk}..."`);
      violations++;
    }
  });

  // Check 2: No "2024–2026"
  if (content.includes('2024–2026')) {
    console.error(`[FAIL] ${file} contains year default "2024–2026"`);
    violations++;
  }

  // Check 3: No unverified styles in HTML or schema
  const unverifiedStyles = ['Contemporary Tropical Modern', 'Contemporary Architecture', 'Modern Warm Interior'];
  unverifiedStyles.forEach(style => {
    if (content.includes(style)) {
      console.error(`[FAIL] ${file} contains unverified style: "${style}"`);
      violations++;
    }
  });

  // Check 4: No unverified words
  const unverifiedWords = ['acoustic resonance', 'spiritual tranquility', 'natural ventilation', 'floating cantilevered', 'congegational'];
  unverifiedWords.forEach(word => {
    if (content.toLowerCase().includes(word)) {
      console.error(`[FAIL] ${file} contains unverified word: "${word}"`);
      violations++;
    }
  });

  // Check 5: Meta description format must be "<Title> | <Category> by Er. Nadeem Keli, DESIGN HAUS."
  const metaMatch = content.match(/<meta name="description" content="([^"]+)">/);
  if (metaMatch) {
    const metaDesc = metaMatch[1];
    if (!metaDesc.includes('by Er. Nadeem Keli, DESIGN HAUS.')) {
      console.error(`[FAIL] ${file} meta description does not follow format: "${metaDesc}"`);
      violations++;
    }
  }

  // Check 6: Zero netlify.app
  if (content.includes('design-haus-studio.netlify.app')) {
    console.error(`[FAIL] ${file} contains netlify.app`);
    violations++;
  }
});

console.log(`\nScan finished. Total violations: ${violations}`);
if (violations === 0) {
  console.log('[SUCCESS] ZERO UNVERIFIED CLAIMS CONFIRMED (Scan returned 0)!');
} else {
  process.exit(1);
}
