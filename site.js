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

  // Footer quick inquiry handler (Rugged Monolith-inspired clean inquiry form -> WhatsApp)
  window.dhFooterInquiry = function (event, form) {
    if (event) event.preventDefault();
    if (!form) return false;
    const input = form.querySelector('input');
    const val = (input && input.value ? input.value : '').trim();
    if (!val) {
      if (input) {
        input.focus();
        input.style.borderColor = '#d8a454';
      }
      return false;
    }
    const text = encodeURIComponent(`Hello DESIGN HAUS, I would like to inquire about your design services. Contact: ${val}`);
    window.open(`https://wa.me/919036389529?text=${text}`, '_blank', 'noopener');
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = 'Sent ↗';
      setTimeout(() => { btn.textContent = orig; }, 2200);
    }
    if (input) input.value = '';
    return false;
  };
})();
