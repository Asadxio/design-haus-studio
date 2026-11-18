# 02: Content Pack (copy-paste ready)

Rules used: facts only from the live site. `[FILL]` = Nadeem must supply the real detail. No invented reviews, prices or numbers. Kannada lines need a native-speaker review before publishing.

---

## A. Home page upgrades

**Hero sub-line (under "Designing Space, Defining Style")**
EN: Architects, 3D elevation designers and turnkey builders in Bankapur, Savanur and Haveri.
KN: ಬಂಕಾಪುರ, ಸವಣೂರು ಮತ್ತು ಹಾವೇರಿಯಲ್ಲಿ ಮನೆ ನಕ್ಷೆ, 3D ಎಲಿವೇಶನ್, ಇಂಟೀರಿಯರ್ ಮತ್ತು ಸಂಪೂರ್ಣ ನಿರ್ಮಾಣ ಸೇವೆಗಳು.

**Trust bar (one line, under the hero)**
`7 years experience · Civil engineer-led · English & ಕನ್ನಡ · Design to site supervision · [FILL: number] projects designed`
(The site already says 7 years and ~90 designs; keep numbers consistent.)

**Primary buttons**
- "Chat on WhatsApp" (green, always visible on mobile as a sticky button)
- "Call +91 90363 89529"
- "Get a free consultation" `[confirm the offer is real before using "free"]`

**New home sections, in this order**
1. Hero + trust bar
2. "Who we help": Homeowners with a plot / Families renovating / Shop and complex owners / Mosque and community committees
3. Services (existing 6 cards)
4. Selected work (existing 3 cards + "View all 90 designs")
5. **How it works** (4 steps from the Studio page, with a time estimate per step `[FILL]`)
6. **Packages** (see C)
7. **What clients say** (real testimonials only, see 03 file for how to collect)
8. **FAQ** (see D)
9. **Where we work**: Bankapur, Savanur, Haveri, Shiggaon, Hangal, Byadgi `[confirm list]` (+ map)
10. Final CTA: "Send us your plot size on WhatsApp."

---

## B. Three local landing pages (each 400+ words, unique, with 2-3 real project images)

### B1. `/architect-in-bankapur`
- Title: `Architect & Building Designer in Bankapur | Design Haus`
- Meta: `House plans, 3D elevations, interiors and construction supervision at Mundgod Cross, Bankapur. Call or WhatsApp +91 90363 89529.`
- H1: Architecture and building design in Bankapur
- Outline: studio at Mundgod Cross (map) → what we design (homes, shops, masjid/community) → how a project runs (4 steps) → 3 local projects `[FILL names/photos]` → FAQ → CTA

### B2. `/architect-in-savanur`
- Title: `House Plan & 3D Elevation in Savanur | Design Haus`
- Meta: `Engineer-led house planning, 3D elevation, interiors and construction support for plots in Savanur. WhatsApp +91 90363 89529.`
- H1: House plans and 3D elevations for Savanur plots
- Outline: site visits in Savanur (travel from Bankapur) → what to bring → permission support → Savanur projects `[FILL]` → FAQ → CTA

### B3. `/architect-in-haveri`
- Title: `Architects & Building Designers in Haveri | Design Haus`
- Meta: `Residential and commercial design, estimation and site supervision across Haveri district. Studio at Bankapur, Karnataka.`
- H1: Architecture and construction support in Haveri district
- Outline: commercial complexes, showrooms, layouts, land development → BOQ & permissions → supervision → FAQ → CTA

(Same template can later be cloned for Shiggaon, Hangal, Byadgi, Hirekerur. Avoid copy-paste: change the town-specific paragraph, photos and FAQ each time.)

---

## C. Packages block (decide prices with Nadeem)
| | Starter | Complete Plan | Design + Build |
|---|---|---|---|
| For | Plot owners who need drawings | Owners who want approval and a build-ready set | Owners who want one team from design to handover |
| Includes | 2D floor plan, 3D elevation | Starter + structural coordination, BOQ, permission drawings | Complete Plan + turnkey construction with supervision |
| Price | `[FILL]` | `[FILL]` | `[FILL]` quote after site visit |
| Time | `[FILL]` | `[FILL]` | `[FILL]` |
Note: services listed here exist on the site today. Do not add anything Nadeem does not actually deliver.

---

## D. FAQ (also usable as FAQPage schema; keep answers identical on page and in JSON)

1. **What do I need to bring for the first meeting?** Your plot dimensions or sale deed copy, a few photos of the site, the direction the plot faces, your budget range and a list of rooms you need.
2. **Do you also help with building permission?** Yes. DESIGN HAUS prepares municipal building permission drawings and assists with the process. Requirements differ by local body, so we confirm them for your plot.
3. **Is structural design part of the service?** Yes. We engineer the column-beam framework, prepare material estimates (BOQ) and can supervise on site.
4. **Can you design and build?** Yes. We offer turnkey projects from excavation and RCC framing to finishing, and also design-only projects.
5. **Which areas do you serve?** Bankapur, Savanur, Haveri and nearby parts of Karnataka. `[FILL: confirm travel limits]`
6. **Do you work on renovations and interiors?** Yes: layouts, false ceilings, lighting schemes and material palettes, plus renovation of existing homes.
7. **Can we talk in Kannada?** Yes, the studio works in Kannada and English.
8. **How do I start?** Message us on WhatsApp at +91 90363 89529 with your plot size and location, or fill the enquiry form.

FAQPage JSON-LD (place on `/services`; add a `<script type="application/ld+json">` wrapper):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"What do I need to bring for the first meeting?","acceptedAnswer":{"@type":"Answer","text":"Your plot dimensions or sale deed copy, a few photos of the site, the direction the plot faces, your budget range and a list of rooms you need."}},
    {"@type":"Question","name":"Do you also help with building permission?","acceptedAnswer":{"@type":"Answer","text":"Yes. DESIGN HAUS prepares municipal building permission drawings and assists with the process. Requirements differ by local body, so we confirm them for your plot."}},
    {"@type":"Question","name":"Is structural design part of the service?","acceptedAnswer":{"@type":"Answer","text":"Yes. We engineer the column-beam framework, prepare material estimates (BOQ) and can supervise on site."}},
    {"@type":"Question","name":"Can you design and build?","acceptedAnswer":{"@type":"Answer","text":"Yes. We offer turnkey projects from excavation and RCC framing to finishing, and also design-only projects."}}
  ]
}
```
(Google now shows FAQ rich results only for a limited set of sites, so treat this mainly as clear on-page content that helps visitors and AI search answers.)

---

## E. Two ready-to-publish articles

### Article 1: How to prepare before meeting an architect for your house plan
*Target: "how to plan a house before meeting an architect", "house plan Savanur". About 400 words.*

Building a house starts long before the first drawing. A little preparation helps your architect give you a better plan, a clearer estimate and a faster timeline.

**1. Know your plot.** Bring the sale deed or survey sketch, the exact dimensions, and the direction the plot faces. Take photos from all four sides, including the road, neighbouring buildings and any trees, wells or slopes. A site visit is always needed, but this gives a strong start.

**2. List your family's real needs.** Count bedrooms, bathrooms, parking, prayer space, kitchen type and storage. Think five years ahead: elders, children, a possible extra floor. A simple list beats a Pinterest board of 40 houses.

**3. Decide your budget range honestly.** Share a range, not a single figure. Design, structure, finishing and permission costs all affect what is possible. An honest range lets the architect suggest what to build now and what to leave for later.

**4. Collect 5-6 reference images.** Show elevations or rooms you like, and also ones you dislike. Two or three clear styles are enough.

**5. Ask about the full scope.** A pretty 3D elevation is only one step. Ask whether the work includes structural design, material estimation (BOQ), building permission drawings and site supervision, because these decide whether the house is safe, legal and within budget.

**6. Agree the process in writing.** Ask how many design revisions are included, how long each step takes, and what each stage costs.

At DESIGN HAUS in Bankapur, we start every project by listening, then analysing the site, then moving to concept, engineering and supervision. If you are planning a house in Bankapur, Savanur or Haveri, send your plot size and location on WhatsApp at +91 90363 89529 and we will tell you what to prepare.

### Article 2: Plan sanction checklist: documents to keep ready before applying
*Target: "building permission documents Karnataka", "plan approval Haveri". About 350 words. Keep this general; rules differ by local body.*

Every town or panchayat has its own rules for building permission, and they change over time. So the first step is always to ask your local office what applies to your plot. Even so, most owners end up needing a similar set of papers.

**Ownership proof.** Sale deed or registered title document and the latest tax receipts for the property.

**Land records.** The relevant land record or khata document for your plot, and a survey sketch with boundaries.

**Drawings.** Site plan, floor plans, elevations and sections prepared to the local body's format. Your architect or engineer prepares these.

**Identity and application papers.** Your ID, the application form, and any affidavit or undertaking the office asks for.

**Technical details.** Setbacks, built-up area and parking details that match the local rules for your plot size and use.

**Tips to avoid delays**
- Check the setbacks and height limits before you freeze the design.
- Keep names and plot numbers identical across all documents.
- Keep scanned copies and hard copies of everything.
- Ask your design team to confirm the checklist with the local office before submission.

DESIGN HAUS prepares municipal building permission drawings and assists clients in Bankapur, Savanur and Haveri. Ask us on WhatsApp (+91 90363 89529) and we will tell you what your specific plot needs.
`[Nadeem: verify this list against what Bankapur / Savanur / Haveri offices currently require before publishing.]`

---

## F. 10-article plan (one a week, each 600-900 words, internal links to Services + Contact)
1. How to prepare before meeting an architect (above)
2. Plan sanction checklist (above)
3. 3D elevation vs 2D plan: what you actually need
4. Vastu and modern design: how we balance both `[Nadeem's own view]`
5. What is a BOQ and why it protects your budget
6. Turnkey vs contractor-only: how to choose
7. Small plot, big design: ideas for compact plots
8. Planning a masjid or community building: space, light, acoustics
9. Renovation checklist before you break a wall
10. Shop and commercial complex layout basics for small towns

Each article: real example photo from the portfolio, one practical checklist, WhatsApp CTA, author box "Er. Nadeem Keli, 7 years".

---

## G. Tone and brand lines
- Keep: "Designing Space, Defining Style."
- Add a plain-language promise: "From plot to possession, one engineer-led team."
- Avoid empty claims such as "number one", "best in India". Specific proof (projects, reviews, years) converts better and is safer.
