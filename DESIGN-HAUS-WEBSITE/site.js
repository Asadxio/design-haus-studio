(() => {
  // Mobile navigation for inner pages
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Graceful fallback for broken image links
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.classList.add('image-missing');
      img.setAttribute('alt', (img.getAttribute('alt') || 'Image') + ' (unavailable)');
    }, { once: true });
  });

  // Dynamic copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // High-intent conversion tracking (WhatsApp, Calls, Emails)
  document.addEventListener('click', e => {
    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const h = a.getAttribute('href') || '';
    if (typeof window.gtag === 'function') {
      if (h.includes('wa.me/')) window.gtag('event', 'click_whatsapp', { link_url: h });
      else if (h.startsWith('tel:')) window.gtag('event', 'click_call', { link_url: h });
      else if (h.startsWith('mailto:')) window.gtag('event', 'click_email', { link_url: h });
    }
  });
})();
