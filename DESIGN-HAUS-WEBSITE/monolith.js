(() => {
  // Mobile navigation toggle for Monolith theme (supports header toggle and first-screen toggle)
  const toggleBtns = document.querySelectorAll('.mono-menu-toggle, .fs-menu-btn');
  const nav = document.querySelector('.mono-nav');
  const headerEl = document.querySelector('.mono-header');

  if (toggleBtns.length && nav) {
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        if (headerEl) {
          headerEl.classList.toggle('menu-open', isOpen);
        }
        toggleBtns.forEach(b => {
          b.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          if (b.classList.contains('mono-menu-toggle')) {
            b.textContent = isOpen ? '✕' : '☰';
          }
        });
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    });

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        if (headerEl) {
          headerEl.classList.remove('menu-open');
        }
        toggleBtns.forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          if (b.classList.contains('mono-menu-toggle')) {
            b.textContent = '☰';
          }
        });
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for hero scroll cues (including first-screen triggers)
  const scrollCues = document.querySelectorAll('.mono-scroll-cue, .fs-card-peek, .fs-desk-explore');
  scrollCues.forEach(cue => {
    cue.addEventListener('click', (e) => {
      const targetId = cue.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Sticky header transition on home page (reveal when scrolled past first-screen)
  const firstScreen = document.getElementById('first-screen');
  const header = document.querySelector('.mono-header');
  if (firstScreen && header && document.body.classList.contains('home-page')) {
    const handleScroll = () => {
      const rect = firstScreen.getBoundingClientRect();
      if (rect.bottom <= 100) {
        header.classList.add('is-sticky-visible');
      } else {
        header.classList.remove('is-sticky-visible');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Motion: Lightweight IntersectionObserver scroll reveal (respects prefers-reduced-motion)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.mono-section, .portfolio-card, .service-detail, .mono-service-card, .mono-lab-card, .mono-lab-item, .faq-header, .mono-faq-item, .contact-card'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealTargets.forEach(el => {
      el.classList.add('reveal-on-scroll');
      revealObserver.observe(el);
    });
  }

  // Dynamic copyright year
  const yearEl = document.querySelector('#mono-year') || document.querySelector('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
