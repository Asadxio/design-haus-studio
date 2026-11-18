# 01: Developer Fixes (in priority order)

Observed on the live site: pages are hosted on Netlify, every page's canonical points to `design-haus-studio.netlify.app`, `og:image` is a relative path, the footer links to `/admin`, and the projects page showed filters but no project cards in the raw HTML.

## 1. Canonical + OG URLs (CRITICAL)
Find every hardcoded netlify URL and replace.

```bash
# run in the site folder; review with git diff / backup first
grep -rl "design-haus-studio.netlify.app" . | xargs sed -i 's#https://design-haus-studio.netlify.app/#https://designhauss.com/#g'
# remove .html from canonicals
sed -i -E 's#(rel="canonical" href="https://designhauss.com/[a-z-]+)\.html"#\1"#' *.html
sed -i 's#https://designhauss.com/index"#https://designhauss.com/"#' index.html
# make og:image absolute
sed -i -E 's#(property="og:image" content=")assets/#\1https://designhauss.com/assets/#' *.html
```
Then add `_redirects` so anyone (and Google) landing on the netlify.app address is sent to the real domain. After deploy: Search Console, URL Inspection, confirm "User-declared canonical" = designhauss.com.

## 2. Hide /admin
- Remove the footer link on all pages.
- Add `Disallow: /admin` (in `robots.txt`) and `X-Robots-Tag: noindex` (in `_headers`), both included.
- Make sure the admin page requires real authentication (Netlify Identity, or a server-side check). A hidden URL is not security.

## 3. Make the 90 projects crawlable
The projects page only exposed filter labels in static HTML; cards appear to be rendered by JavaScript. Googlebot renders JS but slowly and unreliably for big lists.

Best fix: generate static HTML cards at build time from your projects data. Pseudo-script (adapt field names to your data file):

```js
// prerender-projects.js  ->  node prerender-projects.js
const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('assets/data/projects.json', 'utf8')); // <- your data file
const card = p => `
<a class="project-card" href="/project-details?id=${p.id}" data-category="${p.category}">
  <img src="/${p.cover}" alt="${p.title} - design by DESIGN HAUS, Bankapur" width="800" height="600" loading="lazy">
  <span>${p.title}</span>
</a>`;
const html = projects.map(card).join('\n');
const page = fs.readFileSync('projects.html', 'utf8')
  .replace(/<!--PROJECTS-->[\s\S]*<!--\/PROJECTS-->/, `<!--PROJECTS-->\n${html}\n<!--/PROJECTS-->`);
fs.writeFileSync('projects.html', page);
```
Put `<!--PROJECTS--><!--/PROJECTS-->` where the grid is. Keep your JS filtering, but let it hide/show the existing cards instead of creating them.

Also add an ItemList JSON-LD on `/projects` listing the project URLs.

## 4. Give each project its own page identity
`/project-details?id=...` must have a unique `<title>`, description, canonical and og:image per project (template in `head-snippets.html`). Add visible facts for each project: type, location (town), plot size/built-up area, year, scope (design only / design + build), 3-5 images, and a "Discuss a similar project" WhatsApp button prefilled with the project name. Optional: friendly URLs through the rewrites in `_redirects`.

Fix the counter: All = 90 but categories sum to 87 (52 + 5 + 26 + 4).

## 5. Speed on cheap phones (3D hero)
Your audience is mostly mid/low-end Android on 4G. The interactive 3D hero and the 3D services section are the likeliest cause of slow loads. Test first: PageSpeed Insights (mobile), then apply:

```js
// Load the 3D scene only when it is visible AND the device can handle it
const el = document.querySelector('#hero-3d');
const lowEnd = navigator.deviceMemory && navigator.deviceMemory <= 4;
const saveData = navigator.connection && navigator.connection.saveData;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (lowEnd || saveData || reduced) {
  el.classList.add('static-fallback');            // show a poster image (hero poster .webp)
} else {
  new IntersectionObserver(async (entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    const { initScene } = await import('/assets/js/scene.js');   // dynamic import = not in first load
    initScene(el, { maxPixelRatio: 1.5 });
  }, { rootMargin: '200px' }).observe(el);
}
// Inside the scene: stop requestAnimationFrame when the canvas is off-screen or the tab is hidden.
```
Also: give the hero image `fetchpriority="high"` and no `loading="lazy"`, give all other images `loading="lazy"` plus `width`/`height`, load fonts with `font-display: swap` and `<link rel="preconnect">`, keep the 3D library self-hosted and minified. Target: LCP under 2.5 s, CLS under 0.1 on mobile.

## 6. Enquiry form hardening
- Add a hidden honeypot field and basic rate limit (spam).
- If `window.open` to WhatsApp is blocked or WhatsApp is absent, show a success message with the phone number and a "Call now" button.
- Fire `generate_lead` in GA4 after the lead is saved (snippet in `head-snippets.html`).
- Make Phone required (it is) and validate 10-digit Indian numbers.

## 7. Language and Kannada SEO
- Set `<html lang="en">`; wrap Kannada blocks with `lang="kn"`.
- The EN / ಕನ್ನಡ toggle: if it only swaps text via JS on the same URL, Google cannot index the Kannada version. Create real Kannada URLs (`/kn/`, `/kn/services` ...) and link both ways:
```html
<link rel="alternate" hreflang="en" href="https://designhauss.com/">
<link rel="alternate" hreflang="kn" href="https://designhauss.com/kn/">
<link rel="alternate" hreflang="x-default" href="https://designhauss.com/">
```
Have a native Kannada speaker review all translations.

## 8. Accessibility and polish
- Visible keyboard focus on all links/buttons; check text contrast on grey-on-black captions.
- `aria-label` on the 3D canvas ("Interactive 3D model of a building form") and a way to skip it.
- Descriptive alt text already exists; keep it per project (include town/typology).
- Add a custom 404 page with links to Services and Contact.

## 9. Verification checklist (after deploy)
- [ ] `curl -I https://design-haus-studio.netlify.app/` returns 301 to designhauss.com
- [ ] View-source of each page shows canonical on designhauss.com with no `.html`
- [ ] Rich Results Test passes for the LocalBusiness/ProfessionalService JSON
- [ ] Facebook Sharing Debugger shows the OG image for `/` and `/services`
- [ ] Search Console: sitemap "Success", 0 coverage errors, `/admin` not indexed
- [ ] PageSpeed mobile: Performance 80+, LCP < 2.5 s
- [ ] Form: submit test lead, appears in studio system, GA4 `generate_lead` fires, WhatsApp opens
