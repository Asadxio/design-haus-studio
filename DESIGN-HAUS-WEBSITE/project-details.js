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

  async function loadProjectDetails() {
    try {
      const res = await fetch('assets/projects.json');
      if (!res.ok) throw new Error('Could not load portfolio collection');
      const allProjects = await res.json();

      const params = new URLSearchParams(window.location.search);
      const projectId = params.get('id') || params.get('slug');

      let current = allProjects.find(p => p.id === projectId || p.slug === projectId);
      if (!current) {
        current = allProjects[0]; // Graceful fallback
      }

      // Update Page Title
      document.title = `${current.title} | DESIGN HAUS Presentation`;

      // Update Headings & Badges
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

      // Main Visual
      const mainImg = document.getElementById('projectMainImg');
      if (mainImg) {
        mainImg.src = current.image;
        mainImg.alt = `${current.title} — Architectural design by Er. Nadeem Keli`;
      }

      // Multi-image documentation & execution gallery
      const multiGallerySec = document.getElementById('multiGallerySection');
      const multiGalleryGrid = document.getElementById('multiGalleryGrid');
      if (multiGallerySec && multiGalleryGrid) {
        if (current.images && current.images.length > 1) {
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
        }
      }

      // Specs
      const specLoc = document.getElementById('specLocation');
      if (specLoc) specLoc.textContent = current.location || 'Bankapur / Haveri, Karnataka';

      const specDis = document.getElementById('specDiscipline');
      if (specDis) {
        if (current.category === 'sacred') specDis.textContent = 'Mosque & Community Architecture';
        else if (current.category === 'interior') specDis.textContent = 'Interior Architecture & Renovation';
        else specDis.textContent = 'Architecture, 2D Plans & 3D Elevation';
      }

      const specStat = document.getElementById('specStatus');
      if (specStat) specStat.textContent = current.status || 'Original Design Concept Study';

      // Narrative
      const descEl = document.getElementById('projectDesc');
      if (descEl && current.description) {
        descEl.textContent = current.description;
      }

      // Materials & Specs
      const matList = document.getElementById('materialsList');
      if (matList) {
        let items = [];
        if (current.specs?.keyMaterials) {
          items = current.specs.keyMaterials;
        } else if (current.specs?.palette) {
          items = current.specs.palette;
        } else {
          items = ['Tectonic Concrete Plinth', 'Champagne Gold Louvers', 'Solar Glazing', 'Natural Travertine Finish'];
        }
        matList.innerHTML = items.map(m => `<li>${esc(m)}</li>`).join('');
      }

      // Previous & Next Study Pagination
      const currentIndex = allProjects.findIndex(p => p.id === current.id);
      if (currentIndex !== -1) {
        const prevP = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
        const nextP = allProjects[(currentIndex + 1) % allProjects.length];

        const prevLink = document.getElementById('prevStudyLink');
        const prevTitle = document.getElementById('prevStudyTitle');
        if (prevLink && prevP) {
          prevLink.href = `project-details.html?id=${prevP.id}`;
          if (prevTitle) prevTitle.textContent = prevP.title;
        }

        const nextLink = document.getElementById('nextStudyLink');
        const nextTitle = document.getElementById('nextStudyTitle');
        if (nextLink && nextP) {
          nextLink.href = `project-details.html?id=${nextP.id}`;
          if (nextTitle) nextTitle.textContent = nextP.title;
        }
      }

      // Pre-select button in CTA
      const discussBtn = document.getElementById('discussThisBtn');
      if (discussBtn) {
        const serviceParam = current.category === 'interior' ? 'interiors' : 'architecture';
        discussBtn.href = `contact.html?service=${serviceParam}&project=${encodeURIComponent(current.title)}`;
      }

      // Related Projects
      const relatedGrid = document.getElementById('relatedGrid');
      if (relatedGrid) {
        const related = allProjects
          .filter(p => p.id !== current.id && (p.category === current.category || p.filterGroup === current.filterGroup))
          .slice(0, 3);

        relatedGrid.innerHTML = related.map(r => `
          <article class="portfolio-card" onclick="window.location.href='project-details.html?id=${r.id}'">
            <div class="thumb">
              <img loading="lazy" src="${esc(r.image)}" alt="${esc(r.title)}">
            </div>
            <small>${r.category === 'interior' ? 'INTERIOR ARCHITECTURE' : 'ARCHITECTURE &amp; EXTERIOR'}</small>
            <h3>${esc(r.title)}</h3>
          </article>
        `).join('');
      }
    } catch (err) {
      console.error('Error loading project details:', err);
    }
  }

  loadProjectDetails();
})();
