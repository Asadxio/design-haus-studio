import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// Lightweight, decorative architectural sculpture for inner-page hero banners.
const hero = document.querySelector('.page-hero');
if (hero) {
  const canvas = document.createElement('canvas');
  canvas.className = 'page-hero-3d';
  canvas.setAttribute('aria-hidden', 'true');
  hero.appendChild(canvas);

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
    camera.position.set(7, 5, 9);
    camera.lookAt(0, 1.1, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.HemisphereLight(0xf5e5c5, 0x17130d, 2.1));
    const light = new THREE.DirectionalLight(0xe4c38a, 3.2);
    light.position.set(5, 8, 6);
    scene.add(light);

    const gold = new THREE.MeshStandardMaterial({ color: 0xc7a66c, metalness: 0.88, roughness: 0.23 });
    const stone = new THREE.MeshStandardMaterial({
      color: 0xb6ad9d,
      metalness: 0.25,
      roughness: 0.4,
      transparent: true,
      opacity: 0.82
    });

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const addBox = (w, h, d, x, y, z, mat) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      sculpture.add(m);
      return m;
    };

    // Layered floating volumes, cantilevers and gold frames
    addBox(3.7, 0.16, 2.7, 0, -0.1, 0, gold);
    addBox(2.55, 1.8, 2.15, -0.35, 0.9, 0, stone);
    addBox(2.8, 0.12, 2.4, 0.55, 1.85, -0.1, gold);
    addBox(2.15, 1.25, 2.0, 0.55, 2.55, -0.1, stone);
    addBox(2.35, 0.1, 2.2, 0.55, 3.23, -0.1, gold);
    addBox(0.09, 3.25, 0.1, -1.9, 1.55, 1.2, gold);
    addBox(0.09, 3.25, 0.1, 0.45, 1.55, 1.2, gold);
    addBox(2.45, 0.09, 0.1, -0.72, 3.13, 1.2, gold);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.25, 0.012, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0xc7a66c, transparent: true, opacity: 0.6 })
    );
    ring.rotation.x = Math.PI / 2.25;
    ring.position.y = -0.15;
    sculpture.add(ring);

    const floor = new THREE.GridHelper(8, 24, 0x92774c, 0x51432d);
    floor.position.y = -0.22;
    floor.material.transparent = true;
    floor.material.opacity = 0.22;
    scene.add(floor);

    let targetTiltX = 0, targetTiltY = 0;
    let currentTiltX = 0, currentTiltY = 0;
    let spinAngle = 0;

    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      if (!r.width || !r.height) return;
      targetTiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.28;
      targetTiltX = ((e.clientY - r.top) / r.height - 0.5) * -0.15;
    });

    hero.addEventListener('pointerleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
    });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };

    if ('ResizeObserver' in window) {
      new ResizeObserver(resize).observe(hero);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;

      spinAngle += 0.0016; // Continuous full 360 rotation without stall
      currentTiltY += (targetTiltY - currentTiltY) * 0.05;
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;

      sculpture.rotation.y = spinAngle + currentTiltY;
      sculpture.rotation.x = currentTiltX;
      ring.rotation.z += 0.001;

      renderer.render(scene, camera);
    };
    tick();

    window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
  } catch (err) {
    canvas.remove();
    console.warn('Decorative 3D unavailable; hero image remains visible.', err);
  }
}

// Gentle real CSS-3D tilt on project cards; disabled for touch/reduced-motion users.
if (matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.portfolio-card, .service-detail, .principle-grid article');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(1200px) rotateX(${(-y * 3.2).toFixed(2)}deg) rotateY(${(x * 3.2).toFixed(2)}deg) translateY(-3px)`;
  });

  document.addEventListener('pointerout', (e) => {
    const card = e.target.closest('.portfolio-card, .service-detail, .principle-grid article');
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = '';
    }
  });
}
