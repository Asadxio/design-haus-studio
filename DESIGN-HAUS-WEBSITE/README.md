# DESIGN HAUS — Royal 3D Website

A multi-page static website for DESIGN HAUS by Er. Nadeem Keli. The homepage includes an interactive, smoothly rotating Three.js architectural massing model (drag to rotate). Inner-page hero banners include a decorative 3D architectural sculpture, and portfolio/service cards use subtle CSS 3D depth effects.

## Preview locally
Run a local web server from this folder (ES modules and WebGL require HTTP/HTTPS serving):

```bash
python -m http.server 8080
```
Open `http://localhost:8080`. Internet access is required for Google Fonts and the Three.js CDN. If WebGL is unavailable, the architectural photography remains as the visual fallback. The 3D scripts are defensive: they hide failed canvases rather than blocking the rest of the page.

## Pages
- `index.html` — Royal 3D homepage
- `studio.html` — Studio profile & philosophy
- `services.html` — Services & expertise
- `projects.html` — Curated design portfolio with filterable modal viewer
- `contact.html` — Contact form, direct WhatsApp link, and Google Maps embed
- `admin.html` — Admin UI starter for Supabase-driven project & enquiry management

## Brand Content & Official Channels
The authentic brand identity and verified social channels are:
- **Studio:** DESIGN HAUS (Led by Er. Nadeem Keli — 7 Years of Experience)
- **Tagline:** DESIGNING SPACE, DEFINING STYLE
- **Disciplines:** ARCHITECTURE | CONSTRUCTION | INTERIORS | REAL ESTATE
- **Location:** Mundgod Cross, Bankapur, Karnataka (serving Savanur and Haveri)
- **Phone / WhatsApp:** +91 90363 89529
- **Email:** nadeemkeli3938@gmail.com
- **Official Studio Instagram:** [@design_haus__](https://www.instagram.com/design_haus__)
- **Er. Nadeem Keli Instagram:** [@er.nadeem_keli](https://www.instagram.com/er.nadeem_keli)
- **Verified Google Business Profile & Reviews:** [DESIGN HAUS on Google](https://share.google/r7AWYi6I2VgOyxBWh)

## Comprehensive QA & Bug Fixes Completed
1. **Homepage Visibility Crash (`Identifier 'nav' has already been declared`)**:
   - Wrapped all scripts in IIFEs to prevent global lexical scope collisions between `site.js` and `royal.js`.
   - Restored the homepage `IntersectionObserver` so all homepage sections now display with smooth scroll reveals instead of remaining invisible.
2. **Missing CSS on Inner Pages**:
   - Migrated `.page-hero-3d`, 3D card perspective (`transform-style: preserve-3d`), and hover depth styles into `styles.css` so inner pages render the 3D banner sculpture and card tilts properly.
3. **Homepage 3D Rotation & Touch Controls**:
   - Fixed `architecture-3d.js` so dragging horizontally rotates the building smoothly along the Y-axis.
   - Added `touch-action: none;` to prevent touchscreen scroll gestures from cancelling 3D rotation on smartphones.
   - Added graceful fallback handling so model captions hide automatically if WebGL is unavailable.
4. **Inner Page 3D Sculpture Rotational Freeze**:
   - Fixed `site-3d.js` continuous rotation accumulator so the decorative sculpture spins full 360° without stalling at 20°.
5. **Contact Form Service Pre-selection**:
   - Fixed query parameter matching in `contact.js` with an explicit dictionary. All 6 service buttons from `services.html` now accurately pre-select the matching dropdown option.
6. **WhatsApp Popup Blocker Bypass**:
   - Replaced async `window.open()` with direct navigation and fallback link in `contact.js` to ensure browsers do not block the WhatsApp redirection.
7. **Portfolio Modal Filter Navigation**:
   - Updated `projects.js` so Next/Previous modal navigation steps through the currently active filtered collection rather than looping through all projects.
   - Added HTML sanitization (`esc()`) to prevent stored XSS from dynamic database titles.
8. **Admin Panel WhatsApp Link for Indian Numbers**:
   - Added automatic prefixing of country code `91` for 10-digit phone numbers in `admin.js` to prevent incorrect routing to Turkey (+90).
   - Added delete functionality for enquiry leads.
9. **Mobile Typography & Legibility**:
   - Replaced unreadable 6px/7px font sizes across `styles.css` and `royal.css` with legible 10px–12px minimums.
10. **Font Consistency**:
    - Connected `Cormorant Garamond` on all inner pages to ensure headers render with the intended serif typography.
11. **Icon & Code Hygiene**:
    - Replaced the asterisk `✳` character on all WhatsApp floating buttons with a crisp, official WhatsApp SVG logo.
    - Removed unused legacy `app.js` file.
    - Added CSS rules for `.image-missing`.

## Before public launch
1. Choose and register a domain after checking availability.
2. Configure Supabase URL and anon key in `config.js` (copy `config.example.js`).
3. Apply `supabase/schema.sql` in the Supabase SQL Editor.
4. Create the admin user in Supabase Authentication and insert their UUID into `public.admin_users`.
5. Deploy the folder to Vercel, Netlify, or another static host.
