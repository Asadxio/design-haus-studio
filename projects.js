(() => {
  let activeFilter = 'all';
  let visibleCards = [];
  let currentViewerIndex = 0;

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

  function getCards() {
    if (!grid) return [];
    return Array.from(grid.querySelectorAll('.portfolio-card'));
  }

  function updateFilterCounts() {
    const cards = getCards();
    const total = cards.length;
    const ext = cards.filter(c => c.dataset.category === 'exterior').length;
    const sacred = cards.filter(c => c.dataset.category === 'sacred').length;
    const int = cards.filter(c => c.dataset.category === 'interior').length;
    const comm = cards.filter(c => c.dataset.category === 'commercial').length;

    const allSup = document.querySelector('[data-filter="all"] sup');
    const extSup = document.querySelector('[data-filter="exterior"] sup');
    const sacredSup = document.querySelector('[data-filter="sacred"] sup');
    const intSup = document.querySelector('[data-filter="interior"] sup');
    const commSup = document.querySelector('[data-filter="commercial"] sup');

    if (allSup) allSup.textContent = total;
    if (extSup) extSup.textContent = ext;
    if (sacredSup) sacredSup.textContent = sacred;
    if (intSup) intSup.textContent = int;
    if (commSup) commSup.textContent = comm;
  }

  function applyFilter(filterName) {
    activeFilter = filterName || 'all';
    const cards = getCards();

    visibleCards = [];
    cards.forEach(card => {
      const cat = card.dataset.category;
      const matches = (activeFilter === 'all' || cat === activeFilter);
      if (matches) {
        card.style.removeProperty('display');
        card.classList.remove('is-hidden');
        visibleCards.push(card);
      } else {
        card.style.setProperty('display', 'none', 'important');
        card.classList.add('is-hidden');
      }
    });

    const countEl = document.getElementById('resultCount');
    if (countEl) {
      countEl.textContent = `${visibleCards.length} CURATED STUDIES`;
    }

    // Active button state
    document.querySelectorAll('.portfolio-filters button').forEach(b => {
      b.classList.toggle('active', (b.dataset.filter || 'all') === activeFilter);
    });
  }

  function openViewer(cardIndex) {
    if (!visibleCards.length) return;
    currentViewerIndex = Math.max(0, Math.min(visibleCards.length - 1, cardIndex));
    const card = visibleCards[currentViewerIndex];
    if (!card) return;

    const overlay = card.querySelector('.card-overlay');
    const titleEl = card.querySelector('.card-title a');
    const imgSrc = overlay?.getAttribute('data-viewer-img') || card.querySelector('img')?.getAttribute('src');
    const title = titleEl ? titleEl.textContent : (overlay?.getAttribute('data-viewer-title') || 'DESIGN HAUS Project');
    const projectId = card.dataset.id;

    if (viewImg && imgSrc) {
      viewImg.src = imgSrc;
      viewImg.alt = title;
    }

    if (caption) {
      caption.innerHTML = `
        <span>${esc(title)} · DESIGN HAUS</span>
        ${projectId ? `<a href="/projects/${esc(projectId)}" style="margin-left:20px;color:#c6a46a;text-decoration:underline;">View Full Study ↗</a>` : ''}
      `;
    }

    if (viewer) {
      viewer.classList.add('open');
      viewer.removeAttribute('hidden');
      viewer.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeViewer() {
    if (viewer) {
      viewer.classList.remove('open');
      viewer.setAttribute('hidden', '');
      viewer.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  function step(dir) {
    if (!visibleCards.length) return;
    currentViewerIndex = (currentViewerIndex + dir + visibleCards.length) % visibleCards.length;
    openViewer(currentViewerIndex);
  }

  function init() {
    updateFilterCounts();

    // Check URL parameters for active category
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = (urlParams.get('category') || urlParams.get('filter') || '').toLowerCase();
    if (['exterior', 'sacred', 'interior', 'commercial'].includes(catParam)) {
      applyFilter(catParam);
    } else {
      applyFilter('all');
    }

    // Filter button event listeners
    document.querySelectorAll('.portfolio-filters button').forEach(b => {
      b.addEventListener('click', () => {
        applyFilter(b.dataset.filter || 'all');
      });
    });

    // Quick view overlay click
    if (grid) {
      grid.addEventListener('click', e => {
        const overlay = e.target.closest('.card-overlay');
        if (overlay) {
          e.preventDefault();
          e.stopPropagation();
          const card = overlay.closest('.portfolio-card');
          const idx = visibleCards.indexOf(card);
          if (idx !== -1) openViewer(idx);
        }
      });
    }

    // Modal viewer controls
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
