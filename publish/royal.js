(() => {
  // Mobile navigation for royal theme
  const menu = document.querySelector('.royal-menu-button');
  const royalNav = document.querySelector('.royal-nav');
  if (menu && royalNav) {
    menu.addEventListener('click', () => {
      const isOpen = royalNav.classList.toggle('open');
      menu.textContent = isOpen ? '×' : '☰';
      menu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    royalNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        royalNav.classList.remove('open');
        menu.textContent = '☰';
        menu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Dynamic copyright year
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll reveal with fallback
  const revealSections = document.querySelectorAll('.royal-intro, .royal-feature, .royal-services, .royal-gallery, .royal-contact');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealSections.forEach(el => io.observe(el));
  } else {
    revealSections.forEach(el => el.classList.add('in-view'));
  }
})();
