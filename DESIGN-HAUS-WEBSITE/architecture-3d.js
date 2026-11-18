import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(() => {
  const canvas = document.querySelector('#architecture3d');
  if (!canvas) return;

  const wrap = canvas.closest('.hero-3d-wrap');

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x090909, 0.042);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(9.2, 6.4, 12.8);
  camera.lookAt(0, 0.65, 0);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    console.warn('DESIGN HAUS 3D WebGL unavailable; rendering high-resolution visual fallback.', err);
    if (wrap) wrap.classList.add('fallback-active');
    canvas.hidden = true;
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  const group = new THREE.Group();
  scene.add(group);

  // Lighting
  scene.add(new THREE.HemisphereLight(0xf2e8d3, 0x181814, 2.2));

  const keyLight = new THREE.DirectionalLight(0xffebd2, 4.2);
  keyLight.position.set(7, 10, 8);
  scene.add(keyLight);

  const goldRim = new THREE.PointLight(0xc6a46a, 28, 22);
  goldRim.position.set(-6, 3.5, -4);
  scene.add(goldRim);

  const interiorGlow = new THREE.PointLight(0xffb85c, 14, 8);
  interiorGlow.position.set(0.2, 1.2, 0.4);
  group.add(interiorGlow);

  // Materials
  const matGold = new THREE.MeshStandardMaterial({
    color: 0xc6a46a,
    metalness: 0.85,
    roughness: 0.22
  });

  const matStone = new THREE.MeshStandardMaterial({
    color: 0xb5ad9e,
    metalness: 0.18,
    roughness: 0.55
  });

  const matDark = new THREE.MeshStandardMaterial({
    color: 0x1f211c,
    metalness: 0.45,
    roughness: 0.38
  });

  const matTravertine = new THREE.MeshStandardMaterial({
    color: 0xd5cebe,
    metalness: 0.12,
    roughness: 0.62
  });

  const matGlass = new THREE.MeshPhysicalMaterial({
    color: 0x485854,
    metalness: 0.45,
    roughness: 0.08,
    transparent: true,
    opacity: 0.74,
    transmission: 0.2
  });

  const geometryTracker = [];
  function addBox(w, h, d, x, y, z, mat) {
    const geo = new THREE.BoxGeometry(w, h, d);
    geometryTracker.push(geo);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    group.add(m);
    return m;
  }

  function addSlab(w, d, x, y, z) {
    return addBox(w, 0.12, d, x, y, z, matGold);
  }

  // --- LUXURY ARCHITECTURAL VILLA MASSING ---
  // 1. Foundation & Floating Plinth
  addBox(7.6, 0.26, 5.6, 0, -1.22, 0, matDark);
  addSlab(7.8, 5.8, 0, -1.06, 0);

  // 2. Ground Level Main Pavilions
  addBox(3.6, 2.5, 2.8, -0.65, 0.18, 0, matTravertine);
  addBox(2.4, 1.6, 3.0, 0.85, 0.62, -0.1, matDark);

  // 3. Cantilevered Upper Level Volume
  addBox(3.2, 0.16, 3.2, 0.4, 1.54, -0.12, matGold);
  addBox(2.9, 1.52, 2.75, 0.4, 2.32, -0.18, matStone);
  addBox(3.1, 0.12, 2.95, 0.4, 3.12, -0.18, matGold);

  // 4. Glazed Curtain Walls & Ribbon Openings
  addBox(1.85, 1.58, 0.045, -0.5, 0.62, 1.42, matGlass);
  addBox(1.65, 1.28, 0.05, 0.9, 2.32, 1.22, matGlass);
  addBox(0.045, 1.58, 1.8, -2.48, 0.62, 0.35, matGlass);

  // 5. Architectural Vertical Gold Mullions
  for (const x of [-1.25, -0.5, 0.25]) {
    addBox(0.038, 1.56, 0.075, x, 0.62, 1.46, matGold);
  }
  addBox(0.045, 1.26, 0.075, 0.9, 2.32, 1.26, matGold);

  // 6. Grand Entrance Portal & Colonnade
  addBox(0.16, 2.45, 0.18, -2.15, 0.02, 1.46, matGold);
  addBox(0.16, 2.45, 0.18, -0.15, 0.02, 1.46, matGold);
  addBox(2.15, 0.14, 0.18, -1.15, 1.22, 1.46, matGold);

  // 7. Side Terrace & Sun-Shade Brise-Soleil Fins
  addBox(1.8, 1.42, 2.1, 2.35, -0.18, -0.22, matDark);
  addBox(2.0, 0.12, 2.3, 2.35, 0.58, -0.22, matGold);
  for (let i = 0; i < 5; i++) {
    addBox(0.055, 1.05, 0.075, 1.68 + i * 0.28, 0.92, 1.24, matGold);
  }

  // 8. Ground Architectural Rhythmic Louvre Fins
  for (let i = 0; i < 8; i++) {
    addBox(0.035, 0.58, 2.6, -3.2 + i * 0.18, -0.74, -0.05, matGold);
  }

  // 9. Floating Structural Axis Lines (Precision Drafting Geometry)
  const lineMat = new THREE.LineBasicMaterial({ color: 0xc6a46a, transparent: true, opacity: 0.65 });
  for (const x of [-3.55, 3.55]) {
    const pts = [new THREE.Vector3(x, -1.1, 0), new THREE.Vector3(x, 3.85, 0)];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    geometryTracker.push(lineGeo);
    const line = new THREE.Line(lineGeo, lineMat);
    group.add(line);
  }

  // 10. Floating Golden Orbit Ring
  const ringGeo = new THREE.TorusGeometry(4.35, 0.014, 12, 180);
  geometryTracker.push(ringGeo);
  const ring = new THREE.Mesh(
    ringGeo,
    new THREE.MeshBasicMaterial({ color: 0xc6a46a, transparent: true, opacity: 0.62 })
  );
  ring.rotation.x = Math.PI / 2.32;
  ring.position.y = -0.62;
  group.add(ring);

  // 11. Subtle Ambient Floor Disc
  const floorGeo = new THREE.CircleGeometry(5.8, 90);
  geometryTracker.push(floorGeo);
  const floor = new THREE.Mesh(
    floorGeo,
    new THREE.MeshBasicMaterial({ color: 0x090909, transparent: true, opacity: 0.52 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.36;
  scene.add(floor);

  // Interaction State
  let rotY = 0;
  let rotX = 0;
  let targetRotY = 0;
  let targetRotX = 0;
  let hoverTiltX = 0;
  let hoverTiltY = 0;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
  });

  const stopDrag = () => { isDragging = false; };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);

  canvas.addEventListener('pointermove', (e) => {
    if (isDragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      targetRotY += dx * 0.0075;
      targetRotX = Math.max(-0.45, Math.min(0.45, targetRotX + dy * 0.0045));
      lastX = e.clientX;
      lastY = e.clientY;
    } else {
      const r = canvas.getBoundingClientRect();
      if (r.width && r.height) {
        hoverTiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.22;
        hoverTiltX = ((e.clientY - r.top) / r.height - 0.5) * -0.12;
      }
    }
  });

  canvas.addEventListener('pointerleave', () => {
    if (!isDragging) {
      hoverTiltX = 0;
      hoverTiltY = 0;
    }
  });

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(Math.round(r.width), Math.round(r.height), false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0.65, 0);
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(canvas);
  } else {
    window.addEventListener('resize', resize);
  }
  resize();

  const clock = new THREE.Clock();
  let raf = 0;

  function animate() {
    raf = requestAnimationFrame(animate);
    if (document.hidden) return;
    const t = clock.getElapsedTime();

    if (!isDragging) {
      targetRotY += 0.0018; // Smooth continuous 360-degree rotation
      rotY += (targetRotY + hoverTiltY - rotY) * 0.055;
      rotX += (targetRotX + hoverTiltX - rotX) * 0.055;
    } else {
      rotY += (targetRotY - rotY) * 0.12;
      rotX += (targetRotX - rotX) * 0.12;
    }

    group.rotation.y = rotY;
    group.rotation.x = rotX;
    ring.rotation.z = t * 0.035;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(raf);
    geometryTracker.forEach(g => g.dispose());
    matGold.dispose();
    matStone.dispose();
    matDark.dispose();
    matGlass.dispose();
    matTravertine.dispose();
    renderer.dispose();
  }, { once: true });
})();
