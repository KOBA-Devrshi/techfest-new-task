/**
 * TECHFEST 30.0 — THREE.JS UNIVERSE
 * 5 zone planets + scroll-driven camera + neon bloom + star field
 * GitHub Pages compatible (Three.js r128 from CDN)
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  /* ─── SETUP ─── */
  const canvas   = document.getElementById('universe');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);

  /* ─── ZONE PLANET DEFINITIONS ─── */
  // Each planet sits along the Z axis. Camera flies from z=0 toward -1400
  const ZONES = [
    { name: 'Hero',            z:   0,  color: 0x00f0ff, hex: '#00f0ff',  r: 0 },       // no planet at hero
    { name: 'AI Planet',       z: -240, color: 0x00f0ff, hex: '#00f0ff',  r: 28 },
    { name: 'Robotics Sphere', z: -480, color: 0xff4d6d, hex: '#ff4d6d',  r: 32 },
    { name: 'Space Hub',       z: -720, color: 0xf59e0b, hex: '#f59e0b',  r: 26 },
    { name: 'Startup City',    z: -960, color: 0x34d399, hex: '#34d399',  r: 30 },
    { name: 'Quantum Core',    z:-1200, color: 0xa78bfa, hex: '#a78bfa',  r: 34 },
  ];

  // Planets stored here after creation
  const planets = [];

  /* ─── HELPERS ─── */
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16)/255;
    const g = parseInt(hex.slice(3,5),16)/255;
    const b = parseInt(hex.slice(5,7),16)/255;
    return { r, g, b };
  }

  /* ─── STAR FIELD ─── */
  (function buildStars() {
    const COUNT  = 5000;
    const geo    = new THREE.BufferGeometry();
    const pos    = new Float32Array(COUNT * 3);
    const col    = new Float32Array(COUNT * 3);
    const sizes  = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 1400;
      pos[i*3+1] = (Math.random() - 0.5) * 800;
      pos[i*3+2] = Math.random() * -1600 + 100;

      // Tint stars cyan or white
      const t = Math.random();
      col[i*3]   = t > 0.9 ? 0.0 : 0.75;
      col[i*3+1] = t > 0.9 ? 0.9 : 0.85;
      col[i*3+2] = t > 0.9 ? 1.0 : 1.0;

      sizes[i] = Math.random() * 1.6 + 0.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.7, vertexColors: true,
      transparent: true, opacity: 0.85,
      sizeAttenuation: true,
    });

    scene.add(new THREE.Points(geo, mat));
  })();

  /* ─── NEBULA CLOUDS ─── */
  (function buildNebula() {
    const colors = [0x001a3a, 0x0a001a, 0x001a12, 0x1a000a];
    const zPositions = [-200, -500, -750, -1100];

    zPositions.forEach((zp, idx) => {
      const geo = new THREE.BufferGeometry();
      const count = 600;
      const pos   = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = 60 + Math.random() * 100;
        const a = Math.random() * Math.PI * 2;
        pos[i*3]   = Math.cos(a) * r * (0.5 + Math.random() * 0.5);
        pos[i*3+1] = Math.sin(a) * r * 0.4;
        pos[i*3+2] = zp + (Math.random() - 0.5) * 80;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        size: 2.5, color: colors[idx],
        transparent: true, opacity: 0.25, sizeAttenuation: true,
      });
      scene.add(new THREE.Points(geo, mat));
    });
  })();

  /* ─── BUILD PLANETS ─── */
  ZONES.forEach((z, idx) => {
    if (idx === 0) { planets.push(null); return; } // no planet for hero zone

    const group = new THREE.Group();
    group.position.set(
      (idx % 2 === 0 ? -40 : 40),   // alternate left/right like the HTML sections
      (Math.random() - 0.5) * 10,
      z.z
    );
    scene.add(group);

    const rgb = hexToRgb(z.hex);

    // ── Core sphere ──
    const coreGeo = new THREE.SphereGeometry(z.r, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: z.color, transparent: true, opacity: 0.15 });
    const core    = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // ── Wireframe over core ──
    const wireGeo = new THREE.IcosahedronGeometry(z.r, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: z.color, wireframe: true, transparent: true, opacity: 0.25 });
    group.add(new THREE.Mesh(wireGeo, wireMat));

    // ── Glow halo (large transparent sphere) ──
    const haloGeo = new THREE.SphereGeometry(z.r * 1.8, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({ color: z.color, transparent: true, opacity: 0.04, side: THREE.BackSide });
    group.add(new THREE.Mesh(haloGeo, haloMat));

    // ── Orbiting rings ──
    [1.55, 2.1, 2.7].forEach((scale, ri) => {
      const ringGeo = new THREE.TorusGeometry(z.r * scale, 0.5, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: z.color, transparent: true,
        opacity: 0.12 + ri * 0.04,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 4 + ri * 0.3;
      ring.rotation.z = ri * 0.5;
      ring.userData.rotSpeed = (ri % 2 === 0 ? 1 : -1) * (0.003 + ri * 0.001);
      group.add(ring);
    });

    // ── Orbiting satellite dots ──
    [0, Math.PI/2, Math.PI, Math.PI*1.5].forEach((startAngle, si) => {
      const dotGeo = new THREE.SphereGeometry(0.8, 6, 6);
      const dotMat = new THREE.MeshBasicMaterial({ color: z.color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      const orbitR = z.r * 2.2 + si * 4;
      dot.userData = {
        orbitR, orbitSpeed: 0.4 + si * 0.15,
        orbitAngle: startAngle,
        orbitTiltX: si * 0.4,
      };
      group.add(dot);
    });

    // ── Particle cloud around planet ──
    const pGeo = new THREE.BufferGeometry();
    const pCount = 300;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = z.r * 2 + Math.random() * z.r * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      pPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
      pPos[i*3+2] = r * Math.cos(phi);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: z.color, size: 0.5, transparent: true, opacity: 0.4 });
    group.add(new THREE.Points(pGeo, pMat));

    planets.push(group);
  });

  /* ─── NEON BLOOM PARTICLES (post-hero path lines) ─── */
  (function buildPathLines() {
    // Create faint connecting lines between planet positions
    for (let i = 1; i < ZONES.length - 1; i++) {
      const from = ZONES[i];
      const to   = ZONES[i+1];
      const points = [];
      for (let t = 0; t <= 1; t += 0.05) {
        points.push(new THREE.Vector3(
          THREE.MathUtils.lerp(from.x || (i%2===0?-40:40), to.x || ((i+1)%2===0?-40:40), t),
          0,
          THREE.MathUtils.lerp(from.z, to.z, t)
        ));
      }
      const geo  = new THREE.BufferGeometry().setFromPoints(points);
      const mat  = new THREE.LineBasicMaterial({ color: ZONES[i].color, transparent: true, opacity: 0.06 });
      scene.add(new THREE.Line(geo, mat));
    }
  })();

  /* ─── CAMERA PATH ─── */
  // Camera flies from z=120 to z=-1300 as user scrolls
  const CAM_START_Z  = 120;
  const CAM_END_Z    = -1300;
  const CAM_START_Y  = 0;

  camera.position.set(0, 0, CAM_START_Z);

  /* ─── MOUSE PARALLAX ─── */
  let mouseX = 0, mouseY = 0;
  let camTargetX = 0, camTargetY = 0;
  let camCurrentX = 0, camCurrentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ─── SCROLL TRACKING ─── */
  let scrollProgress = 0; // 0 → 1

  window.addEventListener('scroll', () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  });

  /* ─── RESIZE ─── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ─── ZONE TRACKING (for HUD + cursor colour) ─── */
  const zoneColors = ['#00f0ff', '#00f0ff', '#ff4d6d', '#f59e0b', '#34d399', '#a78bfa'];
  let lastZoneIdx = 0;

  function getCurrentZone() {
    // Map scroll 0→1 to zone index 0→5
    const raw = scrollProgress * (ZONES.length - 1);
    return Math.min(Math.floor(raw), ZONES.length - 1);
  }

  /* ─── ANIMATE ─── */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t   = clock.getElapsedTime();
    const dt  = clock.getDelta ? 0.016 : 0.016;

    // ── Camera z position driven by scroll ──
    const targetZ = CAM_START_Z + scrollProgress * (CAM_END_Z - CAM_START_Z);
    camera.position.z += (targetZ - camera.position.z) * 0.07;

    // ── Mouse parallax (subtle X/Y drift) ──
    camTargetX =  mouseX * 18;
    camTargetY = -mouseY * 10;
    camCurrentX += (camTargetX - camCurrentX) * 0.05;
    camCurrentY += (camTargetY - camCurrentY) * 0.05;
    camera.position.x += (camCurrentX - camera.position.x) * 0.06;
    camera.position.y += (camCurrentY - camera.position.y) * 0.06;

    // ── Camera always looks slightly forward (into the scene) ──
    camera.lookAt(new THREE.Vector3(camCurrentX * 0.2, camCurrentY * 0.2, camera.position.z - 200));

    // ── Animate planets ──
    planets.forEach((group, idx) => {
      if (!group) return;

      // Slow global rotation
      group.rotation.y = t * 0.08 * (idx % 2 === 0 ? 1 : -1);
      group.rotation.x = Math.sin(t * 0.04 + idx) * 0.05;

      // Float up and down
      group.position.y = Math.sin(t * 0.3 + idx * 1.2) * 6;

      // Animate rings
      group.children.forEach((child) => {
        if (child.userData.rotSpeed !== undefined) {
          child.rotation.z += child.userData.rotSpeed;
          child.rotation.y += child.userData.rotSpeed * 0.5;
        }
        // Orbital dots
        if (child.userData.orbitR !== undefined) {
          child.userData.orbitAngle += child.userData.orbitSpeed * 0.012;
          const a = child.userData.orbitAngle;
          const r = child.userData.orbitR;
          child.position.x = Math.cos(a) * r;
          child.position.y = Math.sin(a) * r * 0.25;
          child.position.z = Math.sin(a + child.userData.orbitTiltX) * r * 0.4;
        }
      });

      // Neon glow pulse: scale halo based on distance to camera
      const dist = Math.abs(camera.position.z - group.position.z);
      const proximity = Math.max(0, 1 - dist / 180); // 0→1 as camera approaches
      // Boost halo opacity when close
      const halo = group.children.find(c => c.geometry && c.geometry.type === 'SphereGeometry' && c.material.side === THREE.BackSide);
      if (halo) {
        halo.material.opacity = 0.04 + proximity * 0.12;
        halo.scale.setScalar(1 + proximity * 0.4 + Math.sin(t * 2) * 0.03 * proximity);
      }
    });

    // ── Update zone indicator ──
    const currentZone = getCurrentZone();
    if (currentZone !== lastZoneIdx) {
      lastZoneIdx = currentZone;
      // Update cursor colour
      const cDot  = document.getElementById('cursor-dot');
      const cRing = document.getElementById('cursor-ring');
      const col   = zoneColors[currentZone] || '#00f0ff';
      if (cDot)  cDot.style.background   = col;
      if (cRing) cRing.style.borderColor = col.replace(')', ', 0.4)').replace('rgb', 'rgba');
      // Update zone nav dot
      document.querySelectorAll('.zone-dot').forEach((d, i) => d.classList.toggle('active', i === currentZone));
    }

    renderer.render(scene, camera);
  }

  animate();

  /* ─── EXPOSE scroll progress for main.js HUD ─── */
  window._tfScrollProgress = () => scrollProgress;
  window._tfCurrentZone    = () => getCurrentZone();

})();
