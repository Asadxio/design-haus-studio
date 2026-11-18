# DESIGN HAUS (designhauss.com): Master Plan

Prepared 17 Nov 2026 from a live review of home, studio, services, projects and contact pages, plus a competitor scan.

## Target (realistic, measurable)
"World's #1" is not a measurable goal. The winnable one is:
1. **#1 on Google for "architect / house plan / 3D elevation" in Bankapur, Savanur, Shiggaon, Haveri** (Map Pack + organic).
2. **Best-looking independent studio site in North Karnataka** (already close).
3. **Enquiry machine**: 15-30 WhatsApp/call leads per month from the website + Google profile.

## What is in this pack (ready to use)
| File | Purpose |
|---|---|
| `_redirects` | 301 from netlify.app to designhauss.com, www to non-www, .html to clean URLs, friendly project URLs |
| `_headers` | noindex for /admin, security headers, caching |
| `robots.txt`, `sitemap.xml` | Crawl rules + sitemap (add every project URL as you publish) |
| `head-snippets.html` | Correct title, description, canonical, OG/Twitter tags for every page, plus GA4 events |
| `schema-localbusiness.json` | LocalBusiness/ProfessionalService structured data for the home page |
| `assets/brand/og-default.jpg` | 1200x630 share image so WhatsApp/Instagram previews work |
| `01-DEV-FIXES.md` | Step-by-step technical fixes (3D performance, project pages, form, Kannada SEO) |
| `02-CONTENT-PACK.md` | Copy for hero, trust bar, FAQ, packages, 3 local landing pages, 2 drafted articles, 10-article plan |
| `03-LOCAL-SEO-AND-LEADS.md` | Google Business Profile, reviews, citations, Instagram + WhatsApp Business, 12-week calendar |
| `04-COMPETITOR-BENCHMARK.md` | Who you compete with and how to win |

## Roadmap

### Day 0-1 (about 2 hours, biggest impact)
1. Copy `_redirects`, `_headers`, `robots.txt`, `sitemap.xml` into the site's publish folder. Copy `assets/brand/og-default.jpg` to `/assets/brand/`.
2. Replace every page's `<head>` tags using `head-snippets.html` (fixes the wrong canonical and the broken share preview).
3. Remove the public "ADMIN" link from the footer (keep the page, protect with login).
4. Deploy. Then in **Google Search Console**: add `https://designhauss.com` as a property, submit `sitemap.xml`, use URL Inspection on `/projects` and one project page.
5. Test the share preview: paste the link into the Facebook Sharing Debugger (WhatsApp caches previews too) and into WhatsApp itself.

### Week 1
6. Add `schema-localbusiness.json` to the home page. Check in Google's Rich Results Test.
7. Add GA4 (snippet is in `head-snippets.html`) and Microsoft Clarity (free heatmaps).
8. Fix Google Business Profile as per `03-LOCAL-SEO-AND-LEADS.md` and start the review request routine.
9. Fix filter-count mismatch (All 90 vs 52+5+26+4 = 87).
10. Run PageSpeed Insights (mobile) on home and projects; apply the 3D loading fix from `01-DEV-FIXES.md`.

### Week 2-4
11. Make the project cards visible to Google (pre-render them) and give every project its own page details (location, area, year, scope).
12. Add testimonials (real only), FAQ, packages and the "Service areas" section from the content pack.
13. Publish the 3 local landing pages (Savanur, Haveri, Bankapur) and the first 2 articles.
14. Get the registration/credential line sorted on the Studio page (see note below).

### Month 2-3
15. 1 article/week (10-article plan in the content pack), 3 Instagram reels/week, weekly Google profile post.
16. Separate Kannada pages (`/kn/...`) with hreflang, since many local searches are in Kannada.
17. Build citations (Houzz India, Justdial, Sulekha, Bing Places, Apple Business Connect).
18. Review progress monthly in Search Console + GA4.

## KPIs to track monthly
- Search Console: impressions and clicks for "architect Bankapur/Savanur/Haveri", "3D elevation Haveri", "house plan Savanur"
- Google Business Profile: calls, direction requests, messages, number of reviews (target 15 in 60 days)
- GA4: `click_whatsapp`, `click_call`, `generate_lead`
- Site: mobile PageSpeed score, Core Web Vitals pass/fail

## Honest notes
- The pack is deploy-ready but **I cannot publish it myself**: I have no access to the site's source, Netlify account, Search Console or Google Business Profile. Someone with that access must apply it (Nadeem or whoever built the site).
- I could not fetch `sitemap.xml`/`robots.txt` from the live site, so I do not know what is currently there. Check before overwriting.
- I did not measure page speed or live Google rankings.
- No testimonials, prices, areas, or timelines were invented. Anything marked `[FILL]` needs real data from Nadeem.
- **Credential note:** the site calls Er. Nadeem Keli "Civil Engineer and Architect". In India the title "Architect" is tied to registration with the Council of Architecture. If he is registered, show the registration number on the Studio page (a competitor's Houzz profile shows theirs). If not, "Civil Engineer & Building Designer" is the safer wording. This also protects the business legally.
- Keyword volumes in the content pack are targets, not verified numbers. Check them in Google Keyword Planner / Search Console.
