(() => {
  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  function setMeta(selector, attr, value) {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      if (selector.startsWith('meta[property=')) {
        const prop = selector.match(/property="([^"]+)"/)?.[1];
        if (prop) el.setAttribute('property', prop);
      } else if (selector.startsWith('meta[name=')) {
        const name = selector.match(/name="([^"]+)"/)?.[1];
        if (name) el.setAttribute('name', name);
      }
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  }

  function setCanonical(url) {
    let can = document.querySelector('link[rel="canonical"]');
    if (!can) {
      can = document.createElement('link');
      can.setAttribute('rel', 'canonical');
      document.head.appendChild(can);
    }
    can.setAttribute('href', url);
  }

  async function loadProjectDetails() {
    try {
      let res;
      try {
        res = await fetch('/assets/projects.json');
      } catch (e) {
        res = await fetch('assets/projects.json');
      }
      if (!res || !res.ok) {
        res = await fetch('assets/projects.json');
      }
      if (!res.ok) throw new Error('Could not load portfolio collection');
      const allProjects = await res.json();

      const params = new URLSearchParams(window.location.search);
      const rawId = (params.get('id') || params.get('slug') || '').trim().replace(/\/+$/, '');

      let current = allProjects.find(p => p.id === rawId || p.slug === rawId);
      if (!current) {
        current = allProjects[0]; // Graceful fallback
      }

      // 1. Dynamic SEO & Canonical Metadata
      const canonicalUrl = `https://designhauss.com/project-details?id=${encodeURIComponent(current.id)}`;
      setCanonical(canonicalUrl);

      let categoryBadge = 'Architecture & Exterior';
      if (current.category === 'sacred') categoryBadge = 'Sacred Architecture';
      else if (current.category === 'interior') categoryBadge = 'Interior Architecture';
      else if (current.category === 'commercial') categoryBadge = 'Commercial Architecture';

      const metaDesc = `${current.title} | ${categoryBadge} by Er. Nadeem Keli, DESIGN HAUS.`;
      const pageTitle = `${current.title} | DESIGN HAUS Presentation`;
      document.title = pageTitle;

      const rawCoverImg = (current.image || 'assets/brand/og-default.jpg').replace(/^\/+/, '');
      const ogImgUrl = `https://designhauss.com/${rawCoverImg}`;

      setMeta('meta[name="description"]', 'content', metaDesc);
      setMeta('meta[property="og:title"]', 'content', `${current.title} | DESIGN HAUS`);
      setMeta('meta[property="og:description"]', 'content', metaDesc);
      setMeta('meta[property="og:url"]', 'content', canonicalUrl);
      setMeta('meta[property="og:image"]', 'content', ogImgUrl);
      setMeta('meta[name="twitter:title"]', 'content', `${current.title} | DESIGN HAUS`);
      setMeta('meta[name="twitter:description"]', 'content', metaDesc);
      setMeta('meta[name="twitter:image"]', 'content', ogImgUrl);

      // 2. Headings & Badges
      const titleEl = document.getElementById('projectTitle');
      if (titleEl) titleEl.textContent = current.title;

      const badgeCat = document.getElementById('badgeCategory');
      if (badgeCat) {
        badgeCat.textContent = categoryBadge;
      }

      const badgeTypology = document.getElementById('badgeTypology');
      if (badgeTypology) {
        badgeTypology.style.display = 'none';
      }

      const leadSnippet = document.getElementById('projectLeadSnippet');
      if (leadSnippet) {
        leadSnippet.textContent = '';
        leadSnippet.style.display = 'none';
      }

      // 3. Main Visual
      const mainImg = document.getElementById('projectMainImg');
      if (mainImg) {
        mainImg.src = current.image;
        mainImg.alt = `${current.title} — Architectural design by Er. Nadeem Keli, DESIGN HAUS`;
      }

      // 4. Multi-image documentation & execution gallery
      const multiGallerySec = document.getElementById('multiGallerySection');
      const multiGalleryGrid = document.getElementById('multiGalleryGrid');
      if (multiGallerySec && multiGalleryGrid) {
        if (current.images && Array.isArray(current.images) && current.images.length > 1) {
          multiGallerySec.style.display = 'block';
          multiGalleryGrid.innerHTML = current.images.map((imgUrl, i) => `
            <div class="multi-gallery-item" data-img="${esc(imgUrl)}" title="Click to view perspective">
              <img loading="lazy" src="${esc(imgUrl)}" alt="${esc(current.title)} - view ${i + 1}">
              <span class="multi-gallery-badge">View ${i + 1}</span>
            </div>
          `).join('');

          multiGalleryGrid.querySelectorAll('.multi-gallery-item').forEach(item => {
            item.addEventListener('click', () => {
              const targetSrc = item.dataset.img;
              if (mainImg && targetSrc) {
                mainImg.style.opacity = '0.4';
                mainImg.src = targetSrc;
                setTimeout(() => { mainImg.style.opacity = '1'; }, 180);
                mainImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            });
          });
        } else {
          multiGallerySec.style.display = 'none';
          multiGalleryGrid.innerHTML = '';
        }
      }

      // 5. Specs Grid (Location and unverified fields omitted)
      const specsGrid = document.getElementById('specsGrid');
      if (specsGrid) {
        specsGrid.style.display = 'none';
      }

      // 6. Narrative (Descriptions hidden until verified by Nadeem)
      const descEl = document.getElementById('projectDesc');
      if (descEl) {
        descEl.textContent = '';
        descEl.style.display = 'none';
      }
      const narrativeSec = document.querySelector('.project-narrative');
      if (narrativeSec) {
        narrativeSec.style.display = 'none';
      }

      // 7. Materials & Specs (Hidden until verified)
      const matCard = document.getElementById('materialsCard');
      if (matCard) {
        matCard.style.display = 'none';
      }

      // 8. Previous & Next Study Pagination (Circular loop through all projects, clean URLs)
      const currentIndex = allProjects.findIndex(p => p.id === current.id || p.slug === current.id);
      if (currentIndex !== -1) {
        const prevIndex = (currentIndex - 1 + allProjects.length) % allProjects.length;
        const nextIndex = (currentIndex + 1) % allProjects.length;
        const prevP = allProjects[prevIndex];
        const nextP = allProjects[nextIndex];

        const prevLink = document.getElementById('prevStudyLink');
        const prevTitle = document.getElementById('prevStudyTitle');
        if (prevLink && prevP) {
          prevLink.href = `project-details?id=${encodeURIComponent(prevP.id)}`;
          prevLink.setAttribute('aria-label', `Previous project: ${prevP.title}`);
          if (prevTitle) prevTitle.textContent = prevP.title;
        }

        const nextLink = document.getElementById('nextStudyLink');
        const nextTitle = document.getElementById('nextStudyTitle');
        if (nextLink && nextP) {
          nextLink.href = `project-details?id=${encodeURIComponent(nextP.id)}`;
          nextLink.setAttribute('aria-label', `Next project: ${nextP.title}`);
          if (nextTitle) nextTitle.textContent = nextP.title;
        }
      }

      // 9. Pre-select button in CTA
      const discussBtn = document.getElementById('discussThisBtn');
      if (discussBtn) {
        const serviceParam = current.category === 'interior' ? 'interiors' : 'architecture';
        discussBtn.href = `contact?service=${serviceParam}&project=${encodeURIComponent(current.title)}`;
      }

      // 10. Related Projects (Crawlable <a> links, clean URLs)
      const relatedGrid = document.getElementById('relatedGrid');
      if (relatedGrid) {
        const related = allProjects
          .filter(p => p.id !== current.id && (p.category === current.category || p.filterGroup === current.filterGroup))
          .slice(0, 3);

        relatedGrid.innerHTML = related.map(r => `
          <article class="portfolio-card" onclick="window.location.href='project-details?id=${encodeURIComponent(r.id)}'">
            <a href="project-details?id=${encodeURIComponent(r.id)}" style="display:block;text-decoration:none;color:inherit;">
              <div class="thumb">
                <img loading="lazy" src="${esc(r.image)}" alt="${esc(r.title)} — DESIGN HAUS">
              </div>
              <small>${r.category === 'interior' ? 'INTERIOR ARCHITECTURE' : (r.category === 'sacred' ? 'SACRED ARCHITECTURE' : (r.category === 'commercial' ? 'COMMERCIAL ARCHITECTURE' : 'ARCHITECTURE &amp; EXTERIOR'))}</small>
              <h3>${esc(r.title)}</h3>
            </a>
          </article>
        `).join('');
      }
    } catch (err) {
      console.error('Error loading project details:', err);
    }
  }

  // Execute immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjectDetails);
  } else {
    loadProjectDetails();
  }
})();
