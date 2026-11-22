(() => {
  const TRANSLATIONS = {
    en: {
      // Topline & Navigation
      topline_independent: "Independent Architecture & Design Studio",
      topline_location: "Bankapur · Savanur · Haveri, Karnataka",
      nav_studio: "Studio",
      nav_services: "Services",
      nav_projects: "Projects",
      nav_contact: "Contact",
      nav_cta: "Start a project ↗",
      brand_tagline: "DESIGNING SPACE, DEFINING STYLE",

      // Home Page
      hero_eyebrow: "Architecture · Construction · Interiors · Real Estate",
      hero_tagline: "Designing Space,<br><i>Defining Style.</i>",
      hero_explore_btn: "Explore Projects ↗",
      hero_discuss_btn: "Discuss Your Project ↗",
      hero_credentials: "Er. Nadeem Keli · 7 Years of Experience",
      hero_scroll: "Scroll to discover ↓",
      intro_meta: "01 — THE STUDIO",
      intro_title: "Architecture<br>with <i>presence.</i>",
      intro_sub: "Er. Nadeem Keli · Civil Engineer and Architect · 7 Years of Experience",
      intro_btn: "Discover The Studio ↗",
      feature_meta: "02 — SELECTED DESIGN",
      feature_title: "Make a<br><i>lasting</i><br>impression.",
      feature_desc: "Explore our curated collection of architectural elevations, luxury villas, and bespoke interiors.",
      feature_btn: "Explore Case Study ↗",
      services_meta: "03 — OUR EXPERTISE",
      services_title: "Every detail.<br><i>In its place.</i>",
      gallery_meta: "04 — SELECTED WORK",
      gallery_title: "Designed to<br><i>be experienced.</i>",
      gallery_all_btn: "View All Projects ↗",
      contact_meta: "05 — BEGIN A CONVERSATION",
      contact_title: "Let's shape<br><i>your space.</i>",
      contact_btn: "Get In Touch ↗",
      rf_channels: "Official Studio Channels",
      rf_bottom_rights: "DESIGN HAUS. All Rights Reserved.",
      rf_bottom_led: "Led by Er. Nadeem Keli · Civil Engineer & Architect",

      // Services Page
      services_kicker: "OUR ARCHITECTURAL EXPERTISE",
      services_hero_title: "Ideas into<br><em>environments.</em>",
      services_hero_desc: "Integrated architectural planning, technical drafting, structural design, immersive 3D visualization and turnkey construction shaped around the exact requirements of your site and lifestyle.",
      disciplines_kicker: "3D ARCHITECTURAL DISCIPLINES",
      disciplines_title: "Interactive Spatial Framework",
      disciplines_desc: "Explore our core architectural methodologies rendered in real-time 3D coordinate space. Select a discipline to inspect its massing, structural logic and technical layers.",
      serv_1_title: "Architecture & Building Planning",
      serv_1_desc: "Every landmark project begins with sound master planning. We develop architectural concepts, zoning, circulation flows and statutory compliance diagrams tailored precisely to site topography and sun orientation.",
      serv_2_title: "2D Floor Plans & 3D Elevation",
      serv_2_desc: "Experience the design with photorealistic lighting, material fidelity and proportional accuracy before laying a single brick. We provide complete 2D working drawings, cross-sections and cinematic 3D exterior elevations.",
      serv_3_title: "Interior Design & Renovation",
      serv_3_desc: "Interiors should harmonize effortlessly with the surrounding architecture. We design bespoke spatial layouts, false ceilings, ambient lighting schemes, premium material palettes and turnkey renovation concepts.",
      serv_4_title: "Construction & Turnkey Projects",
      serv_4_desc: "From excavation and structural concrete framing to premium plastering, stone masonry and finishes. We offer turnkey project coordination that brings conceptual drawings into enduring physical reality with uncompromising engineering rigor.",
      serv_5_title: "Estimation, Permissions & Site Supervision",
      serv_5_desc: "Accurate Bill of Quantities (BOQ), detailed material estimations, municipal building permission drawings and meticulous on-site structural inspections to guarantee building safety, code adherence and budget transparency.",
      serv_6_title: "Commercial Design & Real Estate Services",
      serv_6_desc: "Strategic architectural planning for commercial complexes, retail showrooms, layout plotting, land development and architectural advisory across the Bankapur, Savanur and Haveri regional growth corridors.",
      discuss_service: "Discuss this service ↗",

      // Studio Page
      studio_kicker: "THE PEOPLE & THINKING BEHIND THE WORK",
      studio_hero_title: "Design with<br><em>intention.</em>",
      studio_hero_desc: "A rigorous, thoughtful approach to residential and commercial architecture, interior spatial planning and the built environment.",
      story_kicker: "A STUDIO BUILT AROUND YOUR VISION",
      story_title: "Thoughtful design.<br><em>Grounded expertise.</em>",
      principles_kicker: "02 / WHAT GUIDES US",
      principles_title: "OUR CORE PRINCIPLES",
      principle_1_title: "Listen first.",
      principle_1_desc: "Every brief begins with understanding the people, site topography, climate, family habits and budget priorities behind it.",
      principle_2_title: "Think in detail.",
      principle_2_desc: "Exceptional architecture balances bold volumetric forms with the exact structural calculations and material choices that make it endure.",
      principle_3_title: "Stay connected.",
      principle_3_desc: "Hands-on engineering supervision and continuous site coordination carry the design intent cleanly from paper to completion.",
      process_title: "A clear path to<br><em>considered spaces.</em>",

      // Projects Page
      projects_kicker: "A CURATED DESIGN PORTFOLIO",
      projects_hero_title: "Selected<br><em>work.</em>",
      projects_hero_desc: "Original architectural concepts, structural elevations, modern villa plans and interior spatial studies designed by Er. Nadeem Keli.",
      filter_all: "All work",
      filter_exterior: "Architecture & Exterior",
      filter_sacred: "Sacred & Community",
      filter_interior: "Interior Design",
      filter_commercial: "Commercial & Layouts",

      // Project Details Page
      details_back: "← Back to Curated Portfolio",
      details_philosophy_kicker: "DESIGN PHILOSOPHY & SPATIAL STUDY",
      details_philosophy_title: "Architecture shaped by light,<br><em>massing and purpose.</em>",
      details_materials_title: "Architectural Details",
      details_discuss_btn: "Discuss A Brief Like This ↗",
      details_cta_title: "Begin with a thoughtful conversation.",
      details_cta_desc: "Consult with Er. Nadeem Keli on your residential, commercial or sacred architecture brief across Bankapur, Savanur, Haveri and North Karnataka.",
      details_prev: "← PREVIOUS STUDY",
      details_next: "NEXT STUDY →",
      details_all_btn: "ALL 90 PROJECTS",
      details_related_title: "Related Design Studies",

      // Contact Page
      contact_kicker: "EVERY LANDMARK PROJECT STARTS WITH A CONVERSATION",
      contact_hero_title: "Let's make<br>space for <em>great ideas.</em>",
      contact_hero_desc: "Tell us about your site, plot dimensions, architectural aspirations or renovation timeline. Er. Nadeem Keli and the studio team will review your brief and guide you on the next steps.",
      direct_access_label: "DIRECT STUDIO ACCESS",
      studio_address_label: "STUDIO ADDRESS",
      studio_address_val: "Mundgod Cross, Bankapur,<br>Karnataka, India",
      verified_social_label: "VERIFIED SOCIAL & REVIEWS",
      whatsapp_btn: "Message on WhatsApp ↗",
      form_title: "What are you<br><em>planning?</em>",
      form_desc: "Share a few details below. Your project brief is prepared and connects you directly to WhatsApp so you can discuss details in real-time with Er. Nadeem Keli.",
      form_privacy: "Your details are used only to respond to your enquiry.",
      form_lbl_name: "Your full name *",
      form_lbl_phone: "Phone / WhatsApp number *",
      form_lbl_email: "Email address (optional)",
      form_lbl_service: "Service required *",
      form_lbl_location: "Project location / site city",
      form_lbl_budget: "Approximate budget range (optional)",
      form_lbl_message: "Project vision & requirements",
      form_submit_btn: "Submit & Chat on WhatsApp ↗",
      form_opt_choose: "Choose an architectural discipline",
      form_opt_other: "Other Architectural Design",
      form_ph_name: "e.g. Anand Patil",
      form_ph_phone: "e.g. +91 98765 43210",
      form_ph_location: "e.g. Bankapur, Savanur, Haveri, Hubli...",
      form_ph_budget: "e.g. ₹25 - ₹40 Lakhs, ₹50 Lakhs - ₹1 Crore+",
      form_ph_message: "Plot dimensions, number of floors, desired architectural style, family requirements, timeline...",
      map_kicker: "FIND THE STUDIO",
      map_title: "Based in <em>Bankapur.</em>",
      map_sub: "Serving Savanur, Haveri and all surrounding Karnataka regions.",
      map_link: "View Google Profile & Reviews ↗",

      // Universal Footer
      footer_explore: "EXPLORE",
      footer_channels: "STUDIO PROFILES",
      footer_touch: "GET IN TOUCH",
      footer_talk: "Let's talk ↗",
      footer_mind: "HAVE A PROJECT IN MIND?",
      footer_rights: "DESIGN HAUS. ALL RIGHTS RESERVED.",
      footer_led: "LED BY ER. NADEEM KELI · CIVIL ENGINEER & ARCHITECT"
    },

    kn: {
      // Topline & Navigation
      topline_independent: "ಸ್ವತಂತ್ರ ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ವಿನ್ಯಾಸ ಸ್ಟುಡಿಯೋ",
      topline_location: "ಬಂಕಾಪುರ · ಸವಣೂರು · ಹಾವೇರಿ, ಕರ್ನಾಟಕ",
      nav_studio: "ಸ್ಟುಡಿಯೋ",
      nav_services: "ಸೇವೆಗಳು",
      nav_projects: "ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು",
      nav_contact: "ಸಂಪರ್ಕಿಸಿ",
      nav_cta: "ಪ್ರಾಜೆಕ್ಟ್ ಪ್ರಾರಂಭಿಸಿ ↗",
      brand_tagline: "ಸ್ಥಳದ ವಿನ್ಯಾಸ, ಶೈಲಿಯ ಪರಿಭಾಷೆ",

      // Home Page
      hero_eyebrow: "ವಾಸ್ತುಶಿಲ್ಪ · ಕಟ್ಟಡ ನಿರ್ಮಾಣ · ಒಳಾಂಗಣ ವಿನ್ಯಾಸ · ರಿಯಲ್ ಎಸ್ಟೇಟ್",
      hero_tagline: "ಸ್ಥಳದ ವಿನ್ಯಾಸ,<br><i>ಶೈಲಿಯ ಪರಿಭಾಷೆ.</i>",
      hero_explore_btn: "ಪ್ರಾಜೆಕ್ಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ ↗",
      hero_discuss_btn: "ನಿಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್ ಚರ್ಚಿಸಿ ↗",
      hero_credentials: "ಇಂ. ನದೀಮ್ ಕೇಳಿ · 7 ವರ್ಷಗಳ ವೃತ್ತಿಪರ ಅನುಭವ",
      hero_scroll: "ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗೆ ಕೆಳಗೆ ನೋಡಿ ↓",
      intro_meta: "01 — ನಮ್ಮ ಸ್ಟುಡಿಯೋ",
      intro_title: "ಘನತೆಯುಳ್ಳ<br><i>ವಾಸ್ತುಶಿಲ್ಪ.</i>",
      intro_sub: "ಇಂ. ನದೀಮ್ ಕೇಳಿ · ಸಿವಿಲ್ ಇಂಜಿನಿಯರ್ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪಿ · 7 ವರ್ಷಗಳ ಅನುಭವ",
      intro_btn: "ಸ್ಟುಡಿಯೋ ಪರಿಚಯ ತಿಳಿಯಿರಿ ↗",
      feature_meta: "02 — ಆಯ್ದ ವಿನ್ಯಾಸ",
      feature_title: "ಶಾಶ್ವತ ಪ್ರಭಾವ<br><i>ಬೀರುವ</i><br>ವಿನ್ಯಾಸ.",
      feature_desc: "DESIGN HAUS ನ ಮೂಲ ವಾಸ್ತುಶಿಲ್ಪ, ಸುಂದರ ಹೊರವಿನ್ಯಾಸ ಮತ್ತು ಒಳಾಂಗಣ ಪರಿಕಲ್ಪನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",
      feature_btn: "ವಿನ್ಯಾಸ ಅಧ್ಯಯನ ವೀಕ್ಷಿಸಿ ↗",
      services_meta: "03 — ನಮ್ಮ ಪರಿಣತಿ",
      services_title: "ಪ್ರತಿಯೊಂದು ಸೂಕ್ಷ್ಮ ವಿವರ.<br><i>ಪರಿಪೂರ್ಣ ಸ್ಥಾನದಲ್ಲಿ.</i>",
      gallery_meta: "04 — ಆಯ್ದ ಕಾರ್ಯಗಳು",
      gallery_title: "ಅನುಭವಿಸಲು<br><i>ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.</i>",
      gallery_all_btn: "ಎಲ್ಲಾ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ ↗",
      contact_meta: "05 — ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ",
      contact_title: "ನಿಮ್ಮ ಕನಸಿನ ಜಾಗವನ್ನು<br><i>ರೂಪಿಸೋಣ.</i>",
      contact_btn: "ಸಂಪರ್ಕಿಸಿ ↗",
      rf_channels: "ಅಧಿಕೃತ ಸ್ಟುಡಿಯೋ ಚಾನಲ್‌ಗಳು",
      rf_bottom_rights: "DESIGN HAUS. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
      rf_bottom_led: "ಇಂ. ನದೀಮ್ ಕೇಳಿ ಅವರ ನೇತೃತ್ವದಲ್ಲಿ · ಸಿವಿಲ್ ಇಂಜಿನಿಯರ್ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪಿ",

      // Services Page
      services_kicker: "ನಮ್ಮ ವಾಸ್ತುಶಿಲ್ಪ ಪರಿಣತಿ",
      services_hero_title: "ಕಲ್ಪನೆಗಳಿಗೆ<br><em>ವಾಸ್ತವ ರೂಪ.</em>",
      services_hero_desc: "ಸಮಗ್ರ ವಾಸ್ತುಶಿಲ್ಪ ಯೋಜನೆ, ತಾಂತ್ರಿಕ ನಕ್ಷೆಗಳು, ರಚನಾತ್ಮಕ ವಿನ್ಯಾಸ, ನೈಜ 3D ದೃಶ್ಯೀಕರಣ ಮತ್ತು ನಿಮ್ಮ ಜೀವನಶೈಲಿಗೆ ತಕ್ಕಂತೆ ನಿರ್ಮಾಣ.",
      disciplines_kicker: "3D ವಾಸ್ತುಶಿಲ್ಪ ವಿಭಾಗಗಳು",
      disciplines_title: "ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಸ್ಪೇಷಿಯಲ್ ಫ್ರೇಮ್‌ವರ್ಕ್",
      disciplines_desc: "ನೈಜ ಸಮಯದಲ್ಲಿ 3D ಕೋಆರ್ಡಿನೇಟ್‌ಗಳಲ್ಲಿ ನಮ್ಮ ವಾಸ್ತುಶಿಲ್ಪ ವಿನ್ಯಾಸ ಶೈಲಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ. ಮಾಸಿಂಗ್, ಸ್ಟ್ರಕ್ಚರ್ ಮತ್ತು ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      serv_1_title: "ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ಕಟ್ಟಡ ಯೋಜನೆ",
      serv_1_desc: "ಪ್ರತಿ ಮಹತ್ವದ ಯೋಜನೆಯು ಸ್ಪಷ್ಟ ಯೋಜನೆಯೊಂದಿಗೆ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ. ನಾವು ನಿವೇಶನದ ಸ್ಥಿತಿ, ಸೂರ್ಯನ ಬೆಳಕು ಮತ್ತು ಅಗತ್ಯಗಳಿಗೆ ತಕ್ಕಂತೆ ವಾಸ್ತುಶಿಲ್ಪ ನಕ್ಷೆಗಳನ್ನು ರಚಿಸುತ್ತೇವೆ.",
      serv_2_title: "2D ಮಹಡಿ ನಕ್ಷೆ ಮತ್ತು 3D ಎಲಿವೇಶನ್",
      serv_2_desc: "ನಿರ್ಮಾಣ ಆರಂಭವಾಗುವ ಮುನ್ನವೇ ಫೋಟೊರಿಯಲಿಸ್ಟಿಕ್ ಬೆಳಕು, ಮೆಟೀರಿಯಲ್ ವಿವರ ಮತ್ತು ನಿಖರ ಅನುಪಾತಗಳೊಂದಿಗೆ 2D ವರ್ಕಿಂಗ್ ಪ್ಲಾನ್ ಮತ್ತು 3D ಎಲಿವೇಶನ್ ಅನುಭವಿಸಿ.",
      serv_3_title: "ಒಳಾಂಗಣ ವಿನ್ಯಾಸ ಮತ್ತು ನವೀಕರಣ",
      serv_3_desc: "ಒಳಾಂಗಣವು ಸುತ್ತಲಿನ ವಾಸ್ತುಶಿಲ್ಪದೊಂದಿಗೆ ಸುಂದರವಾಗಿ ಹೊಂದಿಕೊಳ್ಳಬೇಕು. ನಾವು ಫಾಲ್ಸ್ ಸೀಲಿಂಗ್, ಲೈಟಿಂಗ್, ಪ್ರೀಮಿಯಂ ಮೆಟೀರಿಯಲ್ಸ್ ಮತ್ತು ನವೀಕರಣ ವಿನ್ಯಾಸಗಳನ್ನು ರೂಪಿಸುತ್ತೇವೆ.",
      serv_4_title: "ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಮತ್ತು ಟರ್ನ್‌ಕೀ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು",
      serv_4_desc: "ಪಾಯದಿಂದ ಹಿಡಿದು ಕಾಂಕ್ರೀಟ್ ಫ್ರೇಮ್, ಪ್ಲಾಸ್ಟರಿಂಗ್ ಮತ್ತು ಅಂತಿಮ ಫಿನಿಶಿಂಗ್‌ವರೆಗೆ ನಿಖರ ಇಂಜಿನಿಯರಿಂಗ್ ಮಾನದಂಡಗಳೊಂದಿಗೆ ಟರ್ನ್‌ಕೀ ನಿರ್ಮಾಣ ಒದಗಿಸುತ್ತೇವೆ.",
      serv_5_title: "ಅಂದಾಜು ಪಟ್ಟಿ, ಪರವಾನಗಿ ಮತ್ತು ಸೈಟ್ ಮೇಲ್ವಿಚಾರಣೆ",
      serv_5_desc: "ನಿಖರ ಮೆಟೀರಿಯಲ್ ಎಸ್ಟಿಮೇಷನ್ (BOQ), ಮುನ್ಸಿಪಲ್ ಕಟ್ಟಡ ಪರವಾನಗಿ ನಕ್ಷೆಗಳು ಮತ್ತು ಕಟ್ಟಡ ಸುರಕ್ಷತೆ ಕಾಪಾಡಲು ನಿರಂತರ ಸೈಟ್ ಇಂಜಿನಿಯರಿಂಗ್ ಪರಿಶೀಲನೆ.",
      serv_6_title: "ವಾಣಿಜ್ಯ ಕಟ್ಟಡ ವಿನ್ಯಾಸ ಮತ್ತು ರಿಯಲ್ ಎಸ್ಟೇಟ್",
      serv_6_desc: "ಬಂಕಾಪುರ, ಸವಣೂರು ಮತ್ತು ಹಾವೇರಿ ಪ್ರದೇಶಗಳಲ್ಲಿ ಕಮರ್ಷಿಯಲ್ ಕಾಂಪ್ಲೆಕ್ಸ್, ಮಳಿಗೆಗಳು, ಲೇಔಟ್ ಪ್ಲಾಟಿಂಗ್ ಮತ್ತು ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಸಲಹಾ ಸೇವೆಗಳು.",
      discuss_service: "ಈ ಸೇವೆಯ ಕುರಿತು ಚರ್ಚಿಸಿ ↗",

      // Studio Page
      studio_kicker: "ಕಾರ್ಯದ ಹಿಂದಿರುವ ಚಿಂತನೆ ಮತ್ತು ವ್ಯಕ್ತಿಗಳು",
      studio_hero_title: "ಸ್ಪಷ್ಟ ಉದ್ದೇಶದೊಂದಿಗೆ<br><em>ವಿನ್ಯಾಸ.</em>",
      studio_hero_desc: "ವಸತಿ ಮತ್ತು ವಾಣಿಜ್ಯ ವಾಸ್ತುಶಿಲ್ಪ, ಒಳಾಂಗಣ ಸ್ಥಳ ಯೋಜನೆ ಮತ್ತು ನಿರ್ಮಾಣಕ್ಕೆ ಗಂಭೀರ ಹಾಗೂ ಚಿಂತನಶೀಲ ವಿಧಾನ.",
      story_kicker: "ನಿಮ್ಮ ದೃಷ್ಟಿಕೋನದ ಸುತ್ತ ನಿರ್ಮಿತ ಸ್ಟುಡಿಯೋ",
      story_title: "ಚಿಂತನಶೀಲ ವಿನ್ಯಾಸ.<br><em>ದೃಢ ಪರಿಣತಿ.</em>",
      principles_kicker: "02 / ನಮ್ಮ ಮಾರ್ಗದರ್ಶಿ ಸೂತ್ರಗಳು",
      principles_title: "ನಮ್ಮ ಮುಖ್ಯ ತತ್ವಗಳು",
      principle_1_title: "ಮೊದಲು ಆಲಿಸಿ.",
      principle_1_desc: "ಪ್ರತಿ ಪ್ರಾಜೆಕ್ಟ್ ಆರಂಭವಾಗುವುದು ಗ್ರಾಹಕರ ಅಗತ್ಯ, ನಿವೇಶನ, ಹವಾಮಾನ ಮತ್ತು ಬಜೆಟ್ ಆದ್ಯತೆಗಳನ್ನು ಆಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದರೊಂದಿಗೆ.",
      principle_2_title: "ಸೂಕ್ಷ್ಮವಾಗಿ ಯೋಚಿಸಿ.",
      principle_2_desc: "ಉತ್ತಮ ವಾಸ್ತುಶಿಲ್ಪವು ಆಕರ್ಷಕ ಹೊರನೋಟದ ಜೊತೆಗೆ ದೀರ್ಘಕಾಲ ಬಾಳಿಕೆ ಬರುವ ನಿಖರ ಇಂಜಿನಿಯರಿಂಗ್ ಲೆಕ್ಕಾಚಾರಗಳನ್ನು ಸಮತೋಲನಗೊಳಿಸುತ್ತದೆ.",
      principle_3_title: "ನಿರಂತರ ಸಂಪರ್ಕದಲ್ಲಿರಿ.",
      principle_3_desc: "ಪ್ರತ್ಯಕ್ಷ ಸೈಟ್ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ನಿರಂತರ ಸಮನ್ವಯವು ನಕ್ಷೆಯ ಕಲ್ಪನೆಯನ್ನು ಸ್ಥಳದಲ್ಲಿ ನಿಖರವಾಗಿ ಸಾಕಾರಗೊಳಿಸುತ್ತದೆ.",
      process_title: "ಪರಿಪೂರ್ಣ ಸ್ಥಳಗಳಿಗೆ<br><em>ಸ್ಪಷ್ಟ ಹಾದಿ.</em>",

      // Projects Page
      projects_kicker: "ಕ್ಯುರೇಟೆಡ್ ವಿನ್ಯಾಸ ಪೋರ್ಟ್‌ಫೋಲಿಯೋ",
      projects_hero_title: "ಆಯ್ದ<br><em>ವಿನ್ಯಾಸಗಳು.</em>",
      projects_hero_desc: "ಇಂ. ನದೀಮ್ ಕೇಳಿ ಅವರ ಮೂಲ ವಾಸ್ತುಶಿಲ್ಪ ಪರಿಕಲ್ಪನೆಗಳು, 3D ಎಲಿವೇಶನ್‌ಗಳು, ಆಧುನಿಕ ವಿಲ್ಲಾ ಪ್ಲಾನ್‌ಗಳು ಮತ್ತು ಒಳಾಂಗಣ ಅಧ್ಯಯನಗಳು.",
      filter_all: "ಎಲ್ಲಾ ವಿನ್ಯಾಸಗಳು",
      filter_exterior: "ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ಹೊರವಿನ್ಯಾಸ",
      filter_sacred: "ಧಾರ್ಮಿಕ ಮತ್ತು ಸಮುದಾಯ",
      filter_interior: "ಒಳಾಂಗಣ ವಿನ್ಯಾಸ",
      filter_commercial: "ವಾಣಿಜ್ಯ ಮತ್ತು ಲೇಔಟ್‌ಗಳು",

      // Project Details Page
      details_back: "← ಪೋರ್ಟ್‌ಫೋಲಿಯೋಗೆ ಹಿಂತಿರುಗಿ",
      details_philosophy_kicker: "ವಿನ್ಯಾಸ ತತ್ವಶಾಸ್ತ್ರ ಮತ್ತು ಸ್ಥಳ ಅಧ್ಯಯನ",
      details_philosophy_title: "ಬೆಳಕು, ಮಾಸಿಂಗ್ ಮತ್ತು ಉದ್ದೇಶದಿಂದ<br><em>ರೂಪಿಸಲ್ಪಟ್ಟ ವಾಸ್ತುಶಿಲ್ಪ.</em>",
      details_materials_title: "ವಾಸ್ತುಶಿಲ್ಪದ ತಾಂತ್ರಿಕ ವಿವರಗಳು",
      details_discuss_btn: "ಇಂತಹ ವಿನ್ಯಾಸವನ್ನು ಚರ್ಚಿಸಿ ↗",
      details_cta_title: "ಚಿಂತನಶೀಲ ಸಮಾಲೋಚನೆಯೊಂದಿಗೆ ಆರಂಭಿಸಿ.",
      details_cta_desc: "ಬಂಕಾಪುರ, ಸವಣೂರು, ಹಾವೇರಿ ಮತ್ತು ಉತ್ತರ ಕರ್ನಾಟಕದಾದ್ಯಂತ ನಿಮ್ಮ ವಸತಿ ಅಥವಾ ವಾಣಿಜ್ಯ ಕಟ್ಟಡಕ್ಕೆ ಇಂ. ನದೀಮ್ ಕೇಳಿ ಅವರ ಸಲಹೆ ಪಡೆಯಿರಿ.",
      details_prev: "← ಹಿಂದಿನ ಅಧ್ಯಯನ",
      details_next: "ಮುಂದಿನ ಅಧ್ಯಯನ →",
      details_all_btn: "ಎಲ್ಲಾ 90 ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು",
      details_related_title: "ಸಂಬಂಧಿತ ವಿನ್ಯಾಸ ಅಧ್ಯಯನಗಳು",

      // Contact Page
      contact_kicker: "ಪ್ರತಿ ಮಹತ್ವದ ಪ್ರಾಜೆಕ್ಟ್ ಆರಂಭವಾಗುವುದು ಸಮಾಲೋಚನೆಯಿಂದ",
      contact_hero_title: "ಅದ್ಭುತ ಯೋಜನೆಗಳಿಗೆ<br>ಜಾಗ <em>ಮಾಡೋಣ.</em>",
      contact_hero_desc: "ನಿಮ್ಮ ನಿವೇಶನ, ಅಳತೆ, ವಾಸ್ತುಶಿಲ್ಪದ ಆಶಯ ಅಥವಾ ನವೀಕರಣದ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ. ಇಂ. ನದೀಮ್ ಕೇಳಿ ನಿಮ್ಮ ಯೋಜನೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತಾರೆ.",
      direct_access_label: "ಸ್ಟುಡಿಯೋ ನೇರ ಸಂಪರ್ಕ",
      studio_address_label: "ಸ್ಟುಡಿಯೋ ವಿಳಾಸ",
      studio_address_val: "ಮುಂಡಗೋಡ ಕ್ರಾಸ್, ಬಂಕಾಪುರ,<br>ಕರ್ನಾಟಕ, ಭಾರತ",
      verified_social_label: "ಅಧಿಕೃತ ಸೋಷಿಯಲ್ ಮತ್ತು ವಿಮರ್ಶೆಗಳು",
      whatsapp_btn: "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಸಂದೇಶ ಕಳುಹಿಸಿ ↗",
      form_title: "ನಿಮ್ಮ ಯೋಜನೆ<br><em>ಯಾವುದು?</em>",
      form_desc: "ಕೆಳಗಿನ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ. ನಿಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್ ವಿವರಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ ನೇರವಾಗಿ ಎರ್. ನದೀಮ್ ಕೆಲಿ ಅವರೊಂದಿಗೆ ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಚರ್ಚಿಸಲು ಸಂಪರ್ಕಿಸಲಾಗುತ್ತದೆ.",
      form_privacy: "ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಿಮ್ಮ ವಿಚಾರಣೆಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಲು ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ.",
      form_lbl_name: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು *",
      form_lbl_phone: "ಫೋನ್ / ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ *",
      form_lbl_email: "ಇಮೇಲ್ ವಿಳಾಸ (ಐಚ್ಛಿಕ)",
      form_lbl_service: "ಅಗತ್ಯವಿರುವ ಸೇವೆ *",
      form_lbl_location: "ಪ್ರಾಜೆಕ್ಟ್ ಸ್ಥಳ / ಊರು",
      form_lbl_budget: "ಅಂದಾಜು ಬಜೆಟ್ (ಐಚ್ಛಿಕ)",
      form_lbl_message: "ಪ್ರಾಜೆಕ್ಟ್ ವಿವರಗಳು ಮತ್ತು ಅಗತ್ಯತೆಗಳು",
      form_submit_btn: "ಸಲ್ಲಿಸಿ ಮತ್ತು ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಚರ್ಚಿಸಿ ↗",
      form_opt_choose: "ವಾಸ್ತುಶಿಲ್ಪ ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      form_opt_other: "ಇತರ ವಾಸ್ತುಶಿಲ್ಪ ವಿನ್ಯಾಸ",
      form_ph_name: "ಉದಾ. ಆನಂದ್ ಪಾಟೀಲ್",
      form_ph_phone: "ಉದಾ. +91 98765 43210",
      form_ph_location: "ಉದಾ. ಬಂಕಾಪುರ, ಸವಣೂರು, ಹಾವೇರಿ, ಹುಬ್ಬಳ್ಳಿ...",
      form_ph_budget: "ಉದಾ. ₹೨೫ - ₹೪೦ ಲಕ್ಷ, ₹೫೦ ಲಕ್ಷ - ₹೧ ಕೋಟಿ+",
      form_ph_message: "ನಿವೇಶನದ ಅಳತೆ, ಮಹಡಿಗಳ ಸಂಖ್ಯೆ, ಅಪೇಕ್ಷಿತ ವಿನ್ಯಾಸ ಶೈಲಿ, ಕುಟುಂಬದ ಅಗತ್ಯತೆಗಳು...",
      map_kicker: "ಸ್ಟುಡಿಯೋ ಸ್ಥಳ",
      map_title: "ನಮ್ಮ ಕಚೇರಿ <em>ಬಂಕಾಪುರದಲ್ಲಿದೆ.</em>",
      map_sub: "ಸವಣೂರು, ಹಾವೇರಿ ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಎಲ್ಲಾ ಕರ್ನಾಟಕ ಪ್ರದೇಶಗಳಿಗೆ ಸೇವೆ.",
      map_link: "ಗೂಗಲ್ ಪ್ರೊಫೈಲ್ ಮತ್ತು ವಿಮರ್ಶೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ ↗",

      // Universal Footer
      footer_explore: "ಅನ್ವೇಷಿಸಿ",
      footer_channels: "ಸ್ಟುಡಿಯೋ ಪ್ರೊಫೈಲ್‌ಗಳು",
      footer_touch: "ಸಂಪರ್ಕಿಸಿ",
      footer_talk: "ಚರ್ಚಿಸೋಣ ↗",
      footer_mind: "ಯಾವುದಾದರೂ ಪ್ರಾಜೆಕ್ಟ್ ಯೋಜಿಸುತ್ತಿದ್ದೀರಾ?",
      footer_rights: "DESIGN HAUS. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
      footer_led: "ಇಂ. ನದೀಮ್ ಕೇಳಿ ಅವರ ನೇತೃತ್ವದಲ್ಲಿ · ಸಿವಿಲ್ ಇಂಜಿನಿಯರ್ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪಿ"
    }
  };

  function getCurrentLanguage() {
    return localStorage.getItem('dh_lang') || 'en';
  }

  function applyLanguage(lang) {
    const activeLang = (lang === 'kn') ? 'kn' : 'en';
    localStorage.setItem('dh_lang', activeLang);
    document.documentElement.lang = activeLang;

    if (activeLang === 'kn') {
      document.body.classList.add('lang-kn');
    } else {
      document.body.classList.remove('lang-kn');
    }

    const dict = TRANSLATIONS[activeLang] || TRANSLATIONS.en;

    // Update text / html content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });

    // Update switcher buttons UI
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.dataset.lang;
      btn.classList.toggle('active', btnLang === activeLang);
      btn.setAttribute('aria-pressed', btnLang === activeLang ? 'true' : 'false');
    });
  }

  window.setLanguage = applyLanguage;
  window.getCurrentLanguage = getCurrentLanguage;

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Attach click listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        applyLanguage(btn.dataset.lang);
      });
    });

    // Apply saved language preference
    applyLanguage(getCurrentLanguage());
  });
})();
