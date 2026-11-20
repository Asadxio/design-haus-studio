const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const projectsPath = path.join(rootDir, 'assets', 'projects.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');

const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
const today = '2026-11-21';

const mainPages = [
  { url: 'https://designhauss.com/', priority: '1.0', changefreq: 'weekly' },
  { url: 'https://designhauss.com/studio', priority: '0.8', changefreq: 'monthly' },
  { url: 'https://designhauss.com/services', priority: '0.9', changefreq: 'weekly' },
  { url: 'https://designhauss.com/projects', priority: '0.9', changefreq: 'daily' },
  { url: 'https://designhauss.com/contact', priority: '0.8', changefreq: 'monthly' }
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

mainPages.forEach(p => {
  xml += `  <url>
    <loc>${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
});

projects.forEach(p => {
  xml += `  <url>
    <loc>https://designhauss.com/projects/${p.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
});

xml += `</urlset>\n`;

fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`Generated sitemap.xml with ${mainPages.length + projects.length} URLs in ${sitemapPath}`);
