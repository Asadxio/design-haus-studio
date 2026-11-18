import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(() => {
  const container = document.querySelector('.page-hero-studio');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'page-hero-3d';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
    camera.position.set(7.5, 5.2, 9.5);
    camera.lookAt(0, 1.0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x000000, 0);

    // Warm architectural illumination
    scene.add(new THREE.HemisphereLight(0xf5e8d2, 0x141410, 2.2));
    const dir = new THREE.DirectionalLight(0xe5c38c, 3.4);
    dir.position.set(6, 8, 7);
    scene.add(dir);

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    // Luxury materials
    const gold = new THREE.MeshStandardMaterial({ color: 0xc6a46a, metalness: 0.88, roughness: 0.22 });
    const stone = new THREE.MeshStandardMaterial({ color: 0xb7ad9c, metalness: 0.22, roughness: 0.45, transparent: true, opacity: 0.85 });
    const wireMat = new THREE.LineBasicMaterial({ color: 0xc6a46a, transparent: true, opacity: 0.55 });

    const disposables = [];

    const addSolid = (w, h, d, x, y, z, mat) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      disposables.push(geo);
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      sculpture.add(m);
      return m;
    };

    const addWireframe = (w, h, d, x, y, z) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const edges = new THREE.EdgesGeometry(geo);
      disposables.push(geo, edges);
      const line = new THREE.LineSegments(edges, wireMat);
      line.position.set(x, y, z);
      sculpture.add(line);
      return line;
    };

    // Layered floating volumes, cantilevers & wireframe drafting lines
    addSolid(3.8, 0.16, 2.8, 0, -0.1, 0, gold);
    addSolid(2.6, 1.85, 2.2, -0.35, 0.92, 0, stone);
    addWireframe(2.9, 1.95, 2.4, -0.35, 0.92, 0); // Precision wireframe overlay

    addSolid(2.9, 0.12, 2.5, 0.55, 1.88, -0.1, gold);
    addSolid(2.2, 1.3, 2.1, 0.55, 2.6, -0.1, stone);
    addWireframe(2.35, 1.4, 2.25, 0.55, 2.6, -0.1);

    addSolid(2.4, 0.1, 2.3, 0.55, 3.28, -0.1, gold);

    // Slim architectural portals
    addSolid(0.09, 3.3, 0.1, -1.95, 1.58, 1.25, gold);
    addSolid(0.09, 3.3, 0.1, 0.48, 1.58, 1.25, gold);
    addSolid(2.52, 0.09, 0.1, -0.73, 3.22, 1.25, gold);

    // Floating orbit ring
    const ringGeo = new THREE.TorusGeometry(3.3, 0.012, 8, 140);
    disposables.push(ringGeo);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xc6a46a, transparent: true, opacity: 0.65 }));
    ring.rotation.x = Math.PI / 2.25;
    ring.position.y = -0.15;
    sculpture.add(ring);

    // Architectural ground drafting grid
    const floor = new THREE.GridHelper(8, 24, 0xc6a46a, 0x423826);
    floor.position.y = -0.22;
    floor.material.transparent = true;
    floor.material.opacity = 0.28;
    scene.add(floor);

    let targetTiltX = 0, targetTiltY = 0;
    let currentTiltX = 0, currentTiltY = 0;
    let spinAngle = 0;

    container.addEventListener('pointermove', (e) => {
      const r = container.getBoundingClientRect();
      if (!r.width || !r.height) return;
      targetTiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.32;
      targetTiltX = ((e.clientY - r.top) / r.height - 0.5) * -0.18;
    });

    container.addEventListener('pointerleave', () => {
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
      new ResizeObserver(resize).observe(container);
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
      ring.rotation.z += 0.0012;

      renderer.render(scene, camera);
    };
    tick();

    window.addEventListener('pagehide', () => {
      cancelAnimationFrame(raf);
      disposables.forEach(d => d.dispose());
      gold.dispose();
      stone.dispose();
      wireMat.dispose();
      renderer.dispose();
    }, { once: true });
  } catch (err) {
    canvas.remove();
    console.warn('Studio 3D unavailable; visual fallback active.', err);
  }
})();
