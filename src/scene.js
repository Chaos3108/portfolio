import * as THREE from 'three';

// ---- Settings you can tweak ----
const ACCENT = '#C6F432';   // wireframe, ring and light color
const SPIN = 1;             // rotation speed multiplier (0 = still)
const PARTICLES = 1800;     // number of background particles

const el = document.getElementById('hero-gl');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function makePoints(n) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 5 + Math.random() * 4.5; // keep particles in front of the camera
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
    pos[i * 3 + 2] = r * Math.cos(p);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ color: 0x9aa3ae, size: 0.04, transparent: true, opacity: 0.7 });
  return new THREE.Points(g, m);
}

function init() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return; // No WebGL: the page still works, just without the 3D scene.
  }
  const accent = new THREE.Color(ACCENT);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(el.clientWidth, el.clientHeight);
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b0d10, 8, 24);
  const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 10);

  const group = new THREE.Group();
  scene.add(group);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1, 1),
    new THREE.MeshStandardMaterial({ color: 0x151a21, roughness: 0.35, metalness: 0.8, flatShading: true })
  );
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.35, 1),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.55 })
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.1, 0.015, 8, 160),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.6 })
  );
  ring.rotation.x = Math.PI / 2.4;
  group.add(core, wire, ring);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.PointLight(accent, 60, 30);
  light.position.set(4, 3, 6);
  scene.add(light);
  const rim = new THREE.DirectionalLight(0x6b8aff, 1.2);
  rim.position.set(-5, -2, -3);
  scene.add(rim);

  const points = makePoints(PARTICLES);
  scene.add(points);

  const placeGroup = (w) => {
    // Shape sits to the right on wide screens, tucked into the top corner on phones.
    const wide = w > 900;
    group.position.set(wide ? 3.9 : 1.9, wide ? 0 : 4.6, 0);
    group.scale.setScalar(wide ? 0.85 : 0.6);
  };
  placeGroup(el.clientWidth);

  let mx = 0, my = 0;
  window.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    my = ((e.clientY - r.top) / r.height) * 2 - 1;
  }, { passive: true });

  new ResizeObserver(() => {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    placeGroup(w);
  }).observe(el);

  // Pause rendering when the hero is off screen to save battery.
  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(el);

  const spin = reduceMotion ? 0 : SPIN;
  const clock = new THREE.Clock();
  const tick = () => {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    group.rotation.y += 0.004 * spin;
    wire.rotation.x = t * 0.15 * spin;
    ring.rotation.z = t * 0.2 * spin;
    points.rotation.y = t * 0.02 * spin;
    group.rotation.x += (my * 0.4 - group.rotation.x) * 0.05;
    camera.position.x += (mx * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-my * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    wire.scale.setScalar(1 + Math.sin(t * 1.4) * 0.03 * (spin ? 1 : 0));
    renderer.render(scene, camera);
  };
  tick();
}

if (el) init();
