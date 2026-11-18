(() => {
  let allProjects = [];
  let filteredProjects = [];
  let currentFilteredIndex = 0;
  let activeFilter = 'all';

  const grid = document.getElementById('portfolioGrid');
  const viewer = document.getElementById('imageViewer');
  const viewImg = viewer?.querySelector('img');
  const caption = viewer?.querySelector('.viewer-caption');

  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  const cfg = window.DESIGN_HAUS_CONFIG;
  const db = (cfg && cfg.supabaseUrl && !cfg.supabaseUrl.includes('YOUR-PROJECT') &&
              cfg.supabaseAnonKey && !cfg.supabaseAnonKey.includes('YOUR_') && window.supabase)
              ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
              : null;

  async function init() {
    try {
      const local = await fetch('assets/projects.json').then(r => {
        if (!r.ok) throw new Error('Could not load local project collection');
        return r.json();
      });

      let live = [];
      if (db) {
        const { data, error } = await db.from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          live = data.map(p => ({
            ...p,
            image: p.image_url,
            filterGroup: p.category,
            source: 'studio'
          }));
        } else if (error) {
          console.warn('Live projects unavailable:', error.message);
        }
      }

      allProjects = [...live, ...local];

      // Auto-activate filter from URL parameter (e.g. projects.html?category=interior)
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category') || urlParams.get('filter');
      if (catParam) {
        const normalized = catParam.toLowerCase();
        if (['exterior', 'interior', 'commercial', 'residential', 'sacred', 'all'].includes(normalized)) {
          activeFilter = normalized;
          document.querySelectorAll('.portfolio-filters button').forEach(b => {
            b.classList.toggle('active', b.dataset.filter === normalized);
          });
        }
      }

      updateFilterCounts();
      render();
    } catch (e) {
      if (grid) {
        grid.innerHTML = '<p class="loading">Our portfolio is being updated. Please contact us to view selected work.</p>';
      }
      console.error(e);
    }
  }

  function updateFilterCounts() {
    const total = allProjects.length;
    const ext = allProjects.filter(p => p.category === 'exterior' || p.category === 'residential').length;
    const sacred = allProjects.filter(p => p.category === 'sacred').length;
    const int = allProjects.filter(p => p.category === 'interior').length;
    const comm = allProjects.filter(p => p.category === 'commercial').length;

    const allBtn = document.querySelector('[data-filter="all"] sup');
    const extBtn = document.querySelector('[data-filter="exterior"] sup');
    const sacredBtn = document.querySelector('[data-filter="sacred"] sup');
    const intBtn = document.querySelector('[data-filter="interior"] sup');
    const commBtn = document.querySelector('[data-filter="commercial"] sup');

    if (allBtn) allBtn.textContent = total;
    if (extBtn) extBtn.textContent = ext;
    if (sacredBtn) sacredBtn.textContent = sacred;
    if (intBtn) intBtn.textContent = int;
    if (commBtn) commBtn.textContent = comm;
  }

  function render() {
    filteredProjects = allProjects.filter(p => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'sacred') return p.category === 'sacred';
      if (activeFilter === 'exterior') return p.category === 'exterior' || p.category === 'residential';
      if (activeFilter === 'interior') return p.category === 'interior';
      if (activeFilter === 'commercial') return p.category === 'commercial';
      return p.category === activeFilter;
    });

    const countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = `${filteredProjects.length} CURATED STUDIES`;

    if (!grid) return;

    if (!filteredProjects.length) {
      grid.innerHTML = '<p class="empty" style="grid-column:1/-1;text-align:center;padding:50px 0;color:#8a8377;">No design studies found in this category.</p>';
      return;
    }

    grid.innerHTML = filteredProjects.map((p, i) => `
      <article class="portfolio-card" data-filtered-index="${i}">
        <div class="thumb" title="Click to enlarge" style="position:relative;">
          <img loading="lazy" src="${esc(p.image)}" alt="${esc(p.title)} — original design study by Er. Nadeem Keli">
          ${p.images && p.images.length > 1 ? `<span class="photo-count-badge">${p.images.length} Photos</span>` : ''}
        </div>
        <div class="card-meta">
          <small>${p.category === 'sacred' ? 'SACRED ARCHITECTURE' : (p.category === 'interior' ? 'INTERIOR ARCHITECTURE' : (p.category === 'commercial' ? 'COMMERCIAL DESIGN' : 'ARCHITECTURE &amp; EXTERIOR'))}</small>
          <h3><a href="project-details.html?id=${esc(p.id || p.slug)}" style="color:inherit;">${esc(p.title)}</a></h3>
          <div class="card-actions">
            <a href="project-details.html?id=${esc(p.id || p.slug)}" class="card-detail-link">Case Study ↗</a>
          </div>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.portfolio-card .thumb').forEach(el => {
      el.addEventListener('click', (e) => {
        const card = el.closest('.portfolio-card');
        if (card) openViewer(+card.dataset.filteredIndex);
      });
    });
  }

  function openViewer(filteredIndex) {
    if (!filteredProjects.length) return;
    currentFilteredIndex = Math.max(0, Math.min(filteredProjects.length - 1, filteredIndex));
    const p = filteredProjects[currentFilteredIndex];
    if (!p) return;

    if (viewImg) {
      viewImg.src = p.image;
      viewImg.alt = p.title;
    }
    if (caption) {
      caption.innerHTML = `
        <span>${esc(p.title)} · DESIGN HAUS</span>
        <a href="project-details.html?id=${esc(p.id || p.slug)}" style="margin-left:20px;color:#c6a46a;text-decoration:underline;">View Full Study ↗</a>
      `;
    }
    if (viewer) {
      viewer.classList.add('open');
      viewer.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeViewer() {
    if (viewer) {
      viewer.classList.remove('open');
      viewer.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  function step(dir) {
    if (!filteredProjects.length) return;
    currentFilteredIndex = (currentFilteredIndex + dir + filteredProjects.length) % filteredProjects.length;
    openViewer(currentFilteredIndex);
  }

  // Filter click handlers
  document.querySelectorAll('.portfolio-filters button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.portfolio-filters button').forEach(x => x.classList.toggle('active', x === b));
      activeFilter = b.dataset.filter || 'all';
      render();
    });
  });

  // Viewer controls
  if (viewer) {
    viewer.querySelector('.viewer-close')?.addEventListener('click', closeViewer);
    viewer.querySelector('.viewer-prev')?.addEventListener('click', () => step(-1));
    viewer.querySelector('.viewer-next')?.addEventListener('click', () => step(1));
    viewer.addEventListener('click', e => {
      if (e.target === viewer) closeViewer();
    });
  }

  document.addEventListener('keydown', e => {
    if (!viewer || !viewer.classList.contains('open')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  init();
})();
