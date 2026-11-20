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

      const locText = current.town || current.location || 'Bankapur, Karnataka';
      const typeText = current.typology || (current.category ? current.category.charAt(0).toUpperCase() + current.category.slice(1) : 'Architecture');
      let metaDesc = `${current.title} — ${typeText} in ${locText} by Er. Nadeem Keli, DESIGN HAUS.`;
      if (metaDesc.length > 158) {
        metaDesc = metaDesc.slice(0, 155) + '...';
      }

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
        if (current.category === 'sacred') badgeCat.textContent = 'Sacred Architecture';
        else if (current.category === 'interior') badgeCat.textContent = 'Interior Architecture';
        else if (current.category === 'commercial') badgeCat.textContent = 'Commercial Architecture';
        else badgeCat.textContent = 'Architecture & Exterior';
      }

      const badgeTypology = document.getElementById('badgeTypology');
      if (badgeTypology) {
        badgeTypology.textContent = current.typology || 'Architectural Study';
      }

      const leadSnippet = document.getElementById('projectLeadSnippet');
      if (leadSnippet) {
        const parts = [];
        if (current.typology) parts.push(current.typology);
        else if (current.category) parts.push(current.category.toUpperCase());
        if (current.town || current.location) parts.push(current.town || current.location);
        if (current.author) parts.push(current.author);
        leadSnippet.textContent = parts.join(' · ');
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

      // 5. Specs Grid (Optional fields: town, plotSize, builtUpArea, year, scope - never show empty/placeholder)
      const specsGrid = document.getElementById('specsGrid');
      if (specsGrid) {
        const specItems = [];

        specItems.push({
          label: 'Architect & Lead',
          value: current.author || 'Er. Nadeem Keli'
        });

        const locationVal = current.town || current.location;
        if (locationVal) {
          specItems.push({
            label: current.town ? 'Location / Town' : 'Location / Context',
            value: locationVal
          });
        }

        let disciplineVal = current.typology;
        if (!disciplineVal) {
          if (current.category === 'sacred') disciplineVal = 'Mosque & Community Architecture';
          else if (current.category === 'interior') disciplineVal = 'Interior Architecture & Renovation';
          else if (current.category === 'commercial') disciplineVal = 'Commercial Architecture & Engineering';
          else disciplineVal = 'Architecture, 2D Plans & 3D Elevation';
        }
        if (disciplineVal) {
          specItems.push({
            label: 'Discipline',
            value: disciplineVal
          });
        }

        if (current.status) {
          specItems.push({
            label: 'Project Phase',
            value: current.status
          });
        }

        if (current.year && current.year !== '2024–2026') {
          specItems.push({
            label: 'Year',
            value: current.year
          });
        }

        const plotSizeVal = current.plotSize || current.specs?.plotSize;
        if (plotSizeVal) {
          specItems.push({
            label: 'Plot Size',
            value: plotSizeVal
          });
        }

        const builtUpVal = current.builtUpArea || current.specs?.builtUpArea;
        if (builtUpVal) {
          specItems.push({
            label: 'Built-up Area',
            value: builtUpVal
          });
        }

        const scopeVal = current.scope || current.specs?.scope;
        if (scopeVal) {
          specItems.push({
            label: 'Project Scope',
            value: scopeVal
          });
        }

        specsGrid.innerHTML = specItems.map(item => `
          <div class="project-spec-item">
            <span>${esc(item.label)}</span>
            <strong>${esc(item.value)}</strong>
          </div>
        `).join('');
      }

      // 6. Narrative (Strictly real project description, zero invented paragraphs)
      const descEl = document.getElementById('projectDesc');
      if (descEl) {
        descEl.textContent = current.description || '';
      }

      const secEl = document.getElementById('projectDescSecondary');
      if (secEl) {
        secEl.remove();
      }

      // 7. Materials & Specs (Show only if genuine data exists in current.specs)
      const matCard = document.getElementById('materialsCard');
      const matList = document.getElementById('materialsList');
      if (matList) {
        let items = [];
        if (current.specs?.keyMaterials && Array.isArray(current.specs.keyMaterials) && current.specs.keyMaterials.length > 0) {
          items = current.specs.keyMaterials;
        } else if (current.specs?.palette && Array.isArray(current.specs.palette) && current.specs.palette.length > 0) {
          items = current.specs.palette;
        }

        if (items.length > 0) {
          matList.innerHTML = items.map(m => `<li>${esc(m)}</li>`).join('');
          if (matCard) matCard.style.display = 'block';
        } else {
          matList.innerHTML = '';
          if (matCard) matCard.style.display = 'none';
        }
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
