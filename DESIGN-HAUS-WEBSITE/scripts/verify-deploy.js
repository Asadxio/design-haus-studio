const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://designhauss.com';

function request(urlPath, options = {}, retries = 3) {
  return new Promise((resolve, reject) => {
    const fullUrl = urlPath.startsWith('http') ? urlPath : `${baseUrl}${urlPath}`;
    const urlObj = new URL(fullUrl);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (DeployVerificationBot/2.0)',
        ...(options.headers || {})
      }
    };
    const req = https.request(urlObj, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => {
        if (!options.headOnly) data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => {
          request(urlPath, options, retries - 1).then(resolve).catch(reject);
        }, 500);
      } else {
        reject(err);
      }
    });
    req.setTimeout(15000, () => {
      req.destroy();
      if (retries > 0) {
        setTimeout(() => {
          request(urlPath, options, retries - 1).then(resolve).catch(reject);
        }, 500);
      } else {
        reject(new Error(`Timeout for ${fullUrl}`));
      }
    });
    req.end();
  });
}

async function runTests() {
  const results = {};
  console.log(`Starting automated verification on: ${baseUrl}\n`);

  // --- Check 1: /projects/dh-sacred-hsaq -> 200, no redirect ---
  try {
    const res1 = await request('/projects/dh-sacred-hsaq', { method: 'HEAD', headOnly: true });
    const pass = res1.statusCode === 200;
    results.check1 = {
      name: '/projects/dh-sacred-hsaq returns 200 directly',
      status: pass ? 'PASS' : 'FAIL',
      detail: `Status: ${res1.statusCode}`
    };
  } catch (e) {
    results.check1 = { name: '/projects/dh-sacred-hsaq', status: 'FAIL', detail: e.message };
  }

  // --- Check 2: /project-details?id=dh-sacred-hsaq and /project-details.html?id=dh-sacred-hsaq -> 301 without ?id= ---
  try {
    const res2a = await request('/project-details?id=dh-sacred-hsaq', { method: 'HEAD', headOnly: true });
    const res2b = await request('/project-details.html?id=dh-sacred-hsaq', { method: 'HEAD', headOnly: true });
    
    // STRICT check: Location must NOT contain '?id=' and must end with '/projects/dh-sacred-hsaq'
    const locA = res2a.headers.location || '';
    const locB = res2b.headers.location || '';
    const passA = res2a.statusCode === 301 && !locA.includes('?') && locA.endsWith('/projects/dh-sacred-hsaq');
    const passB = res2b.statusCode === 301 && !locB.includes('?') && locB.endsWith('/projects/dh-sacred-hsaq');

    results.check2 = {
      name: 'Project details query param redirects (301) WITHOUT ?id= query string',
      status: (passA && passB) ? 'PASS' : 'FAIL',
      detail: `/project-details -> ${res2a.statusCode} (${locA}), /project-details.html -> ${res2b.statusCode} (${locB})`
    };
  } catch (e) {
    results.check2 = { name: 'Project details 301', status: 'FAIL', detail: e.message };
  }

  // --- Check 3: All 90 /projects/<id> URLs -> 200 ---
  try {
    const projectsJsonPath = path.resolve(__dirname, '../assets/projects.json');
    const projectsData = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf8'));
    let passCount = 0;
    let failList = [];

    const batchSize = 10;
    for (let i = 0; i < projectsData.length; i += batchSize) {
      const slice = projectsData.slice(i, i + batchSize);
      await Promise.all(slice.map(async (p) => {
        try {
          const res = await request(`/projects/${p.id}`, { method: 'HEAD', headOnly: true });
          if (res.statusCode === 200) {
            passCount++;
          } else {
            failList.push({ id: p.id, status: res.statusCode });
          }
        } catch (err) {
          failList.push({ id: p.id, error: err.message });
        }
      }));
    }

    results.check3 = {
      name: 'All 90 /projects/<id> URLs return 200',
      status: (passCount === 90 && failList.length === 0) ? 'PASS' : 'FAIL',
      detail: `${passCount}/90 returned 200 OK${failList.length ? ` (Fails: ${JSON.stringify(failList)})` : ''}`
    };
  } catch (e) {
    results.check3 = { name: 'All 90 projects', status: 'FAIL', detail: e.message };
  }

  // --- Check 4: Sitemap all 95 URLs -> 200 ---
  try {
    const sitemapXml = await request('/sitemap.xml');
    const urls = [];
    const locRegex = /<loc>(https:\/\/designhauss\.com[^<]+)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(sitemapXml.body)) !== null) {
      urls.push(match[1]);
    }

    let sitemap200Count = 0;
    let sitemapFails = [];
    const batchSize = 10;
    for (let i = 0; i < urls.length; i += batchSize) {
      const slice = urls.slice(i, i + batchSize);
      await Promise.all(slice.map(async (u) => {
        const pathPart = new URL(u).pathname;
        try {
          const res = await request(pathPart, { method: 'HEAD', headOnly: true });
          if (res.statusCode === 200) {
            sitemap200Count++;
          } else {
            sitemapFails.push({ path: pathPart, status: res.statusCode });
          }
        } catch (err) {
          sitemapFails.push({ path: pathPart, error: err.message });
        }
      }));
    }

    results.check4 = {
      name: 'Sitemap all 95 URLs return 200',
      status: (sitemap200Count === 95 && sitemapFails.length === 0) ? 'PASS' : 'FAIL',
      detail: `${sitemap200Count}/${urls.length} URLs returned 200 OK${sitemapFails.length ? ` (Fails: ${JSON.stringify(sitemapFails)})` : ''}`
    };
  } catch (e) {
    results.check4 = { name: 'Sitemap 95 URLs', status: 'FAIL', detail: e.message };
  }

  // --- Check 5: /projects raw HTML (no JS) contains 90 card links ---
  try {
    const projectsHtml = await request('/projects');
    const cardLinkRegex = /href="\/projects\/([^"#\s]+)"/g;
    const foundSlugs = new Set();
    let m;
    while ((m = cardLinkRegex.exec(projectsHtml.body)) !== null) {
      foundSlugs.add(m[1]);
    }
    const pass = foundSlugs.size === 90;
    results.check5 = {
      name: '/projects raw HTML has 90 static card links',
      status: pass ? 'PASS' : 'FAIL',
      detail: `Found ${foundSlugs.size}/90 unique project links in raw HTML without JavaScript`
    };
  } catch (e) {
    results.check5 = { name: '/projects raw HTML cards', status: 'FAIL', detail: e.message };
  }

  // --- Check 6: Main pages + 3 random project pages canonical & absolute og:image (200) ---
  try {
    const testPages = [
      { path: '/', expectedCanonical: 'https://designhauss.com/' },
      { path: '/studio', expectedCanonical: 'https://designhauss.com/studio' },
      { path: '/services', expectedCanonical: 'https://designhauss.com/services' },
      { path: '/projects', expectedCanonical: 'https://designhauss.com/projects' },
      { path: '/contact', expectedCanonical: 'https://designhauss.com/contact' },
      { path: '/projects/dh-sacred-hsaq', expectedCanonical: 'https://designhauss.com/projects/dh-sacred-hsaq' },
      { path: '/projects/dh-ext-01', expectedCanonical: 'https://designhauss.com/projects/dh-ext-01' },
      { path: '/projects/dh-int-05', expectedCanonical: 'https://designhauss.com/projects/dh-int-05' }
    ];

    let allCanonicalPass = true;
    let allOgImagePass = true;
    const pageDetails = [];

    for (const tp of testPages) {
      const pageRes = await request(tp.path);
      const canonicalMatch = pageRes.body.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
      const ogImageMatch = pageRes.body.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);

      const canonicalFound = canonicalMatch ? canonicalMatch[1] : null;
      const canonicalOk = canonicalFound === tp.expectedCanonical;
      if (!canonicalOk) allCanonicalPass = false;

      const ogImageFound = ogImageMatch ? ogImageMatch[1] : null;
      let ogImageOk = false;
      let ogImageStatus = null;
      if (ogImageFound && ogImageFound.startsWith('https://designhauss.com/')) {
        const imgPath = new URL(ogImageFound).pathname;
        const imgRes = await request(imgPath, { method: 'HEAD', headOnly: true });
        ogImageStatus = imgRes.statusCode;
        ogImageOk = imgRes.statusCode === 200;
      }
      if (!ogImageOk) allOgImagePass = false;

      pageDetails.push({
        path: tp.path,
        canonical: canonicalFound,
        canonicalOk,
        ogImage: ogImageFound,
        ogImageStatus,
        ogImageOk
      });
    }

    results.check6 = {
      name: 'Canonicals designhauss.com & absolute og:image (200)',
      status: (allCanonicalPass && allOgImagePass) ? 'PASS' : 'FAIL',
      detail: `All 8 tested pages verified. Canonicals valid: ${allCanonicalPass}, og:images accessible: ${allOgImagePass}`
    };
  } catch (e) {
    results.check6 = { name: 'Canonicals & og:image', status: 'FAIL', detail: e.message };
  }

  // --- Check 7: /robots.txt and /sitemap.xml -> 200 ---
  try {
    const robotsRes = await request('/robots.txt');
    const sitemapRes = await request('/sitemap.xml', { method: 'HEAD', headOnly: true });
    const robotsOk = robotsRes.statusCode === 200 && robotsRes.body.includes('Sitemap: https://designhauss.com/sitemap.xml');
    const sitemapOk = sitemapRes.statusCode === 200;
    results.check7 = {
      name: '/robots.txt & /sitemap.xml return 200',
      status: (robotsOk && sitemapOk) ? 'PASS' : 'FAIL',
      detail: `/robots.txt: ${robotsRes.statusCode} (has sitemap link), /sitemap.xml: ${sitemapRes.statusCode}`
    };
  } catch (e) {
    results.check7 = { name: 'robots & sitemap', status: 'FAIL', detail: e.message };
  }

  // --- Check 8: Invalid URL -> 404 page with noindex ---
  try {
    const errRes = await request('/this-is-a-completely-invalid-nonexistent-url-404-test');
    const is404 = errRes.statusCode === 404;
    const hasNoindex = errRes.body.includes('<meta name="robots" content="noindex"') ||
                       (errRes.headers['x-robots-tag'] && errRes.headers['x-robots-tag'].includes('noindex'));
    results.check8 = {
      name: 'Invalid URL returns 404 with noindex',
      status: (is404 && hasNoindex) ? 'PASS' : 'FAIL',
      detail: `Status: ${errRes.statusCode}, Contains <meta name="robots" content="noindex">: ${errRes.body.includes('<meta name="robots" content="noindex"')}`
    };
  } catch (e) {
    results.check8 = { name: '404 page', status: 'FAIL', detail: e.message };
  }

  // --- Check 9: No page footer contains /admin link ---
  try {
    const checkPages = ['/', '/studio', '/services', '/projects', '/contact', '/projects/dh-sacred-hsaq'];
    let adminLinkFound = false;
    for (const cp of checkPages) {
      const res = await request(cp);
      if (/href=["'][^"']*admin[^"']*["']/i.test(res.body)) {
        adminLinkFound = true;
        break;
      }
    }
    results.check9 = {
      name: 'No /admin link in footer across pages',
      status: !adminLinkFound ? 'PASS' : 'FAIL',
      detail: adminLinkFound ? 'Admin link detected in one or more pages' : '0 pages contain admin links'
    };
  } catch (e) {
    results.check9 = { name: 'Admin link check', status: 'FAIL', detail: e.message };
  }

  // --- Check 10: /dh-pack/, /scripts/, /scratch/, /.git/ -> 404 ---
  try {
    const forbiddenPaths = ['/dh-pack/', '/scripts/', '/scratch/', '/.git/', '/supabase/'];
    let allBlocked = true;
    const forbiddenStatuses = {};
    for (const fp of forbiddenPaths) {
      const res = await request(fp);
      forbiddenStatuses[fp] = res.statusCode;
      if (res.statusCode !== 404) {
        allBlocked = false;
      }
    }
    results.check10 = {
      name: 'Internal dev directories return 404',
      status: allBlocked ? 'PASS' : 'FAIL',
      detail: Object.entries(forbiddenStatuses).map(([k, v]) => `${k}: ${v}`).join(', ')
    };
  } catch (e) {
    results.check10 = { name: 'Internal dirs 404', status: 'FAIL', detail: e.message };
  }

  // --- Check 11: No "netlify.app" or "2024–2026" text in pages ---
  try {
    const testPages = ['/', '/studio', '/services', '/projects', '/contact', '/projects/dh-sacred-hsaq', '/projects/dh-ext-01'];
    let netlifyAppFound = false;
    let defaultYearFound = false;
    const details = [];

    for (const tp of testPages) {
      const res = await request(tp);
      const bodyClean = res.body;
      const hasNetlify = /design-haus-studio\.netlify\.app/i.test(bodyClean);
      const hasYear = /2024[–-]2026/i.test(bodyClean);
      if (hasNetlify) netlifyAppFound = true;
      if (hasYear) defaultYearFound = true;
      details.push({ page: tp, hasNetlify, hasYear });
    }

    const pass = !netlifyAppFound && !defaultYearFound;
    results.check11 = {
      name: 'Zero "design-haus-studio.netlify.app" and zero "2024–2026" in pages',
      status: pass ? 'PASS' : 'FAIL',
      detail: `design-haus-studio.netlify.app found: ${netlifyAppFound}, 2024–2026 found: ${defaultYearFound}`
    };
  } catch (e) {
    results.check11 = { name: 'Netlify.app & Year check', status: 'FAIL', detail: e.message };
  }

  // --- Extra Check A: Canonical on / and /projects ---
  try {
    const homeRes = await request('/');
    const projRes = await request('/projects');
    const homeCan = homeRes.body.includes('<link rel="canonical" href="https://designhauss.com/">');
    const projCan = projRes.body.includes('<link rel="canonical" href="https://designhauss.com/projects">');
    results.checkA = {
      name: '(a) Canonical on / and /projects is https://designhauss.com/...',
      status: (homeCan && projCan) ? 'PASS' : 'FAIL',
      detail: `Home canonical: ${homeCan}, Projects canonical: ${projCan}`
    };
  } catch (e) {
    results.checkA = { name: '(a) Canonical check', status: 'FAIL', detail: e.message };
  }

  // --- Extra Check B: netlify.app -> 301 to designhauss.com ---
  try {
    const netlifyRes = await request('https://design-haus-studio.netlify.app/', { method: 'HEAD', headOnly: true });
    const is301 = netlifyRes.statusCode === 301 && netlifyRes.headers.location === 'https://designhauss.com/';
    results.checkB = {
      name: '(b) https://design-haus-studio.netlify.app/ 301 redirects to https://designhauss.com/',
      status: is301 ? 'PASS' : 'FAIL',
      detail: `Status: ${netlifyRes.statusCode}, Location: ${netlifyRes.headers.location}`
    };
  } catch (e) {
    results.checkB = { name: '(b) Netlify domain 301 check', status: 'FAIL', detail: e.message };
  }

  // --- Extra Check C: /admin loads with setup/login screen ---
  try {
    const adminRes = await request('/admin');
    const hasSetup = adminRes.body.includes('setupNotice') && adminRes.body.includes('Connect your studio database');
    const hasNoindex = adminRes.headers['x-robots-tag'] && adminRes.headers['x-robots-tag'].includes('noindex');
    results.checkC = {
      name: '(c) /admin loads setup/login screen with noindex headers',
      status: (adminRes.statusCode === 200 && hasSetup && hasNoindex) ? 'PASS' : 'FAIL',
      detail: `Status: ${adminRes.statusCode}, hasSetupNotice: ${hasSetup}, X-Robots-Tag: ${adminRes.headers['x-robots-tag']}`
    };
  } catch (e) {
    results.checkC = { name: '(c) Admin screen check', status: 'FAIL', detail: e.message };
  }

  // --- Extra Check D: Contact form structure and validation ---
  try {
    const contactRes = await request('/contact');
    const hasForm = contactRes.body.includes('id="enquiryForm"');
    const hasRequired = contactRes.body.includes('name="name" required') &&
                        contactRes.body.includes('name="phone" required') &&
                        contactRes.body.includes('name="service" required');
    const hasWaLink = contactRes.body.includes('wa.me/919036389529');
    results.checkD = {
      name: '(d) Contact form loads with proper input validation and WhatsApp action',
      status: (contactRes.statusCode === 200 && hasForm && hasRequired && hasWaLink) ? 'PASS' : 'FAIL',
      detail: `Status: ${contactRes.statusCode}, hasForm: ${hasForm}, hasRequiredFields: ${hasRequired}, hasWhatsAppAction: ${hasWaLink}`
    };
  } catch (e) {
    results.checkD = { name: '(d) Contact form validation check', status: 'FAIL', detail: e.message };
  }

  console.log('\n================ VERIFICATION RESULTS ================');
  for (const [key, val] of Object.entries(results)) {
    console.log(`[${val.status}] ${val.name} -> ${val.detail}`);
  }
  fs.writeFileSync(path.resolve(__dirname, '../../test-deploy-results.json'), JSON.stringify(results, null, 2));
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
