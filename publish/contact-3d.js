import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(() => {
  const container = document.querySelector('.contact-hero');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'contact-hero-3d';
  canvas.setAttribute('aria-hidden', 'true');
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  container.prepend(canvas);

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.HemisphereLight(0xf5e8d2, 0x141410, 2.0));
    const dir = new THREE.DirectionalLight(0xe5c38c, 2.8);
    dir.position.set(4, 8, 6);
    scene.add(dir);

    const group = new THREE.Group();
    scene.add(group);

    // Architectural geometric wireframe canopy
    const wireMat = new THREE.LineBasicMaterial({ color: 0xc6a46a, transparent: true, opacity: 0.35 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc6a46a, metalness: 0.85, roughness: 0.25, transparent: true, opacity: 0.7 });

    for (let i = 0; i < 6; i++) {
      const geo = new THREE.IcosahedronGeometry(1.6 + i * 0.45, 0);
      const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geo), wireMat);
      wire.position.set((i - 2.5) * 1.8, Math.sin(i) * 0.5, (i - 2.5) * 0.4);
      group.add(wire);
    }

    const ringGeo = new THREE.TorusGeometry(5.2, 0.015, 8, 120);
    const ring = new THREE.Mesh(ringGeo, goldMat);
    ring.rotation.x = Math.PI / 2.4;
    group.add(ring);

    let targetX = 0, targetY = 0;
    container.addEventListener('pointermove', e => {
      const r = container.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.3;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * -0.2;
    });

    const resize = () => {
      const r = container.getBoundingClientRect();
      if (!r.width || !r.height) return;
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container);
    resize();

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      group.rotation.y += 0.001;
      group.rotation.x += (targetY - group.rotation.x) * 0.03;
      group.rotation.y += (targetX - group.rotation.y) * 0.03;
      ring.rotation.z += 0.0015;
      renderer.render(scene, camera);
    };
    tick();

    window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
  } catch (e) {
    canvas.remove();
  }
})();
