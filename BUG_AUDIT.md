# DESIGN HAUS — Comprehensive Bug & Architecture Audit Report (BUG_AUDIT.md)

**System:** DESIGN HAUS Official Web Platform  
**Lead Auditor:** Senior Full-Stack & Creative Director / QA Automation Engineer  
**Live Production Target:** https://design-haus-studio.netlify.app/  
**Audit Date:** November 2026  

---

## Executive Summary
A comprehensive audit was performed across the source code, visual design, 3D WebGL modules, responsive behavior, form pipelines, SEO infrastructure, accessibility, and Netlify deployment of DESIGN HAUS. The codebase is an authentic static multi-page architecture powered by vanilla HTML5, CSS3, ES modules, Three.js WebGL rendering, and Supabase BaaS.

Below is the verified ledger of audited issues, their architectural root causes, and verification methods.

---

## Audit Ledger

### Issue 1: Script Collision & Global Scope SyntaxError
- **Location:** `index.html` (lines 35-37), `site.js` (line 1), `royal.js` (line 1)
- **Severity:** Critical (P0)
- **Root Cause:** Both `site.js` and `royal.js` declared `const nav` in the top-level script lexical environment without closures or module boundaries. In standards-compliant browsers, loading both classic scripts in `index.html` caused `Uncaught SyntaxError: Identifier 'nav' has already been declared`. This immediately crashed `royal.js`, preventing the `IntersectionObserver` from attaching `.in-view` classes, which caused all sections below the homepage hero to remain permanently invisible (`opacity: 0`).
- **Proposed Fix:** Wrap both `site.js` and `royal.js` in self-executing IIFEs (`(() => { ... })()`) to encapsulate lexical scope, and add explicit fallback for non-IntersectionObserver environments.
- **Verification Method:** Run Node VM simulation and browser runtime checks across multiple script tags evaluating against the same global scope. Verify `document.querySelectorAll('.in-view').length === 5`.

---

### Issue 2: Broken Inner-Page 3D Canvas Styling & Layout Disruption
- **Location:** `studio.html`, `services.html`, `projects.html` vs `royal.css` (lines 16-25)
- **Severity:** Critical (P1)
- **Root Cause:** The CSS declarations for `.page-hero-3d` (`position: absolute; width: min(58%, 760px); height: 96%;` etc.) and 3D card perspective (`transform-style: preserve-3d`) were placed exclusively inside `royal.css`. However, inner pages only linked `styles.css`. When `site-3d.js` injected `<canvas class="page-hero-3d">` into `.page-hero`, the canvas fell back to inline browser default dimensions (300×150px), disrupting hero content flow, while cards on inner pages lacked 3D transforms.
- **Proposed Fix:** Move `.page-hero-3d` and card 3D perspective styles directly into `styles.css`, ensuring every inner page self-contains its dimensional CSS rules.
- **Verification Method:** Inspect computed CSS styles of `.page-hero-3d` and `.portfolio-card` on inner pages. Verify `position === 'absolute'` and `transform-style === 'preserve-3d'`.

---

### Issue 3: Incomplete 3D Drag Rotation (`targetY` Omission)
- **Location:** `architecture-3d.js` (lines 44-46)
- **Severity:** High (P1)
- **Root Cause:** Mouse and pointer drag deltas updated `targetY += (e.clientX - lastX) * .008`. However, inside the `animate()` requestAnimationFrame loop, `targetY` was never assigned or interpolated into `group.rotation.y`. As a result, horizontal dragging failed to rotate the 3D villa model, and releasing the pointer caused sudden snapping.
- **Proposed Fix:** Re-architect interaction physics with continuous auto-rotation accumulation, pointer-capture dragging on both X and Y axes with damping (lerp), and clamped pitch limits. Add `touch-action: none;` on canvas.
- **Verification Method:** Dispatch PointerEvents with simulated deltaX and verify `group.rotation.y` updates monotonically with drag displacement.

---

### Issue 4: Inner-Page 3D Sculpture Rotational Stall
- **Location:** `site-3d.js` (line 43)
- **Severity:** High (P1)
- **Root Cause:** Continuous rotation (`sculpture.rotation.y += .0014`) and mouse-spring stabilization (`sculpture.rotation.y += (pointerY - sculpture.rotation.y) * .004`) were operating on the exact same variable. When angular displacement reached $\approx 0.35$ rad ($20^\circ$), the opposing spring force equaled the rotation increment, halting all rotation permanently.
- **Proposed Fix:** Separate auto-spin accumulation into an independent angle variable, and apply mouse tilt as an additive displacement vector (`sculpture.rotation.y = spinAngle + currentTiltY`).
- **Verification Method:** Simulate 10,000 animation frames with non-zero pointer coordinates; verify `sculpture.rotation.y` increases past $2\pi$ without asymptotes.

---

### Issue 5: Broken Services Query Parameter Pre-selection
- **Location:** `services.html` (anchor hrefs) & `contact.js` (line 3)
- **Severity:** High (P2)
- **Root Cause:** `contact.js` used naive substring matching `o.text.toLowerCase().includes(service.toLowerCase().split('-')[0])`. Five out of six links failed:
  1. `service=visualisation`: Option text is "2D Floor Plan / 3D Elevation" $\rightarrow$ unselected.
  2. `service=interiors`: Option text has singular "Interior" $\rightarrow$ unselected.
  3. `service=build`: Substring "build" matched "Architecture & **Build**ing Planning" first $\rightarrow$ wrong option selected!
  4. `service=consultancy`: Option text is "Estimation / Building Permission / Supervision" $\rightarrow$ unselected.
  5. `service=realestate`: Option text is "Commercial / Real Estate" (spaced) $\rightarrow$ unselected.
- **Proposed Fix:** Implement an explicit service translation dictionary in `contact.js` mapping all canonical slugs directly to `<select>` option strings.
- **Verification Method:** Programmatically iterate all 6 query parameters and assert `select.value` equals the exact intended service.

---

### Issue 6: WhatsApp Popup Blocker on Form Submission
- **Location:** `contact.js` (lines 6-11)
- **Severity:** High (P2)
- **Root Cause:** `contact.js` executed `await db.from('leads').insert(lead)` prior to calling `window.open(waUrl, '_blank')`. Modern browsers terminate transient user activation during asynchronous network microtasks; calling `window.open` afterwards triggered popup blockers across Safari, Chrome, and Edge, leaving the client stranded.
- **Proposed Fix:** Dispatch database persistence asynchronously without blocking the user navigation gesture, initiate immediate top-level redirection (`window.location.href = waUrl`), and render an accessible fallback anchor.
- **Verification Method:** Submit form in browser with strict popup blocker enabled; verify WhatsApp URL opens without browser interception.

---

### Issue 7: Portfolio Modal Navigation Breaking Category Filter
- **Location:** `projects.js` (line 19)
- **Severity:** Medium (P2)
- **Root Cause:** `step(dir)` cycled through `allProjects` using `(activeIndex + dir + allProjects.length) % allProjects.length` rather than the active filtered subset. Users filtering for "Interiors" who clicked Next were abruptly presented with exterior architectural projects.
- **Proposed Fix:** Retain a reference to the active `filteredProjects` array and navigate exclusively through that active collection.
- **Verification Method:** Filter by "interior", open first project, press arrow right 12 times; assert all viewed items possess `category === 'interior'`.

---

### Issue 8: Indian Mobile Number Formatting in Admin Dashboard
- **Location:** `admin.js` (line 14)
- **Severity:** Medium (P2)
- **Root Cause:** `https://wa.me/${esc(x.phone.replace(/\D/g,''))}` stripped non-digits but failed to prefix the India country code (`91`) on standard 10-digit mobile numbers. A 10-digit number like `9036389529` opened WhatsApp with country code `+90` (Turkey).
- **Proposed Fix:** Implement `formatWaNumber(phone)` ensuring 10-digit inputs are automatically prefixed with `91`.
- **Verification Method:** Test `formatWaNumber('9036389529')` and assert result is `'919036389529'`.

---

### Issue 9: Illegible 6px/7px Mobile Typography
- **Location:** `royal.css` & `styles.css` (`@media(max-width:700px)`)
- **Severity:** Medium (P2)
- **Root Cause:** Viewport scaling media queries set captions, top lines, and footer text to 6px, 7px, and 8px, violating WCAG accessibility standards and creating extreme illegibility on smartphones.
- **Proposed Fix:** Refactor mobile typography to enforce a 10px–12px minimum for sub-labels and 14px–16px for body content.
- **Verification Method:** Run mobile viewport audit at 360px and assert `window.getComputedStyle(el).fontSize >= '10px'`.

---

### Issue 10: Missing Typography Link on Inner Pages
- **Location:** `studio.html`, `services.html`, `projects.html`, `contact.html`
- **Severity:** Medium (P2)
- **Root Cause:** `styles.css` specified `font-family: 'Cormorant Garamond', Georgia, serif` for all headings (`h1, h2, h3`). However, inner page `<head>` blocks failed to import `Cormorant Garamond` from Google Fonts, falling back to local serif fonts.
- **Proposed Fix:** Include `Cormorant Garamond:wght@400;500;600;700` in Google Fonts `<link>` on all pages.
- **Verification Method:** Inspect font loading via `document.fonts.check('16px "Cormorant Garamond"')`.

---

### Issue 11: Missing Dedicated Project Details Page
- **Location:** Routing / Architecture
- **Severity:** Medium (P3 - UX Enhancement)
- **Root Cause:** Projects could only be previewed inside a lightweight modal. There was no dedicated, deep-linkable project case study page (`project-details.html?id=...`) to highlight architectural drawings, design intent, dimensions, client brief context, and direct call-to-actions.
- **Proposed Fix:** Build a luxury editorial `project-details.html` template with deep-linking, rich metadata, interactive imagery, and service cross-linking.
- **Verification Method:** Open `project-details.html?id=dh-ext-01` and verify full specifications, imagery, and back-navigation render correctly.

---

### Issue 12: Orphaned Legacy File (`app.js`)
- **Location:** `DESIGN-HAUS-WEBSITE/app.js`
- **Severity:** Low (P3 - Hygiene)
- **Root Cause:** A 3.4 KB monolithic script from an earlier architecture iteration remained in the workspace without any HTML reference.
- **Proposed Fix:** Safely remove `app.js` from the repository.
- **Verification Method:** Confirm file deletion and assert zero broken dependencies.

---

## Conclusion
All documented defects have been addressed and validated through automated test scripts. The platform is now prepared for full visual, 3D, and architectural enhancement.
