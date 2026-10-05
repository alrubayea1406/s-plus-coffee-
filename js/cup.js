// 3D drink viewer: a glass that fills with the drink's layers.
import * as THREE from "three";
import { RoundedBoxGeometry } from "../vendor/RoundedBoxGeometry.js";
import { logoTex, softDot } from "./truck.js";

const H = 2.6, R0 = 0.78, R1 = 1.04, BASE = 0.14;
const radiusAt = (y) => R0 + (R1 - R0) * (y / H);

export function initCup(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 3.2, 9.2);
  camera.lookAt(0, 1.3, 0);

  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a55, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 6, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const back = new THREE.DirectionalLight(0xffc28a, 1.4);
  back.position.set(-4, 3, -4);
  scene.add(back);

  const root = new THREE.Group();
  scene.add(root);

  // Wooden coaster + shadow catcher
  const coaster = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.5, 0.12, 64),
    new THREE.MeshStandardMaterial({ color: 0x8a5a35, roughness: 0.8 }));
  coaster.position.y = -0.06;
  coaster.receiveShadow = true;
  root.add(coaster);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.015, 8, 64), new THREE.MeshBasicMaterial({ color: 0xc8874a }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.005;
  root.add(ring);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(4, 48), new THREE.ShadowMaterial({ opacity: 0.18 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.12;
  floor.receiveShadow = true;
  scene.add(floor);

  // Glass
  const profile = [
    new THREE.Vector2(0, 0), new THREE.Vector2(R0 + 0.04, 0), new THREE.Vector2(R1 + 0.04, H),
    new THREE.Vector2(R1 + 0.07, H + 0.02), new THREE.Vector2(R1, H + 0.02), new THREE.Vector2(R0, BASE), new THREE.Vector2(0, BASE),
  ];
  const glass = new THREE.Mesh(new THREE.LatheGeometry(profile, 72), new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.22,
    clearcoat: 1, clearcoatRoughness: 0.05, side: THREE.DoubleSide, depthWrite: false,
  }));
  glass.renderOrder = 2;
  root.add(glass);
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.32, 40),
    new THREE.MeshBasicMaterial({ map: logoTex(), transparent: true, depthWrite: false }));
  logo.position.set(0, 1.25, radiusAt(1.25) + 0.05);
  logo.rotation.x = -Math.atan((R1 - R0) / H);
  logo.renderOrder = 3;
  root.add(logo);

  const drink = new THREE.Group();
  root.add(drink);

  const steamMat = new THREE.SpriteMaterial({ map: softDot(), color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
  let anim = { layers: [], ice: [], steam: [], toppings: [], t0: 0, top: BASE };

  function clear() {
    drink.traverse((o) => { if (o.isMesh || o.isSprite) { o.geometry?.dispose(); o.material?.dispose?.(); } });
    drink.clear();
    anim = { layers: [], ice: [], steam: [], toppings: [], t0: performance.now(), top: BASE };
  }

  function show(item) {
    clear();
    let y = BASE;
    const total = item.layers.reduce((a, l) => a + l.h, 0);
    const fill = Math.min(total, 0.9) / total; // never overflow the glass
    item.layers.forEach((l, i) => {
      const h = l.h * fill * (H - BASE);
      const geo = new THREE.CylinderGeometry(radiusAt(y + h) - 0.02, radiusAt(y) - 0.02, h, 64);
      geo.translate(0, h / 2, 0);
      const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: l.c, roughness: 0.35 }));
      m.position.y = y;
      m.scale.y = 0.0001;
      m.castShadow = true;
      drink.add(m);
      anim.layers.push({ mesh: m, delay: i * 0.45 });
      y += h;
    });
    anim.top = y;

    if (item.iced) {
      for (let i = 0; i < 5; i++) {
        const cube = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.42, 0.42, 3, 0.08), new THREE.MeshPhysicalMaterial({
          color: 0xeaf6fb, transparent: true, opacity: 0.55, roughness: 0.08, clearcoat: 1,
        }));
        const a = (i / 5) * Math.PI * 2 + Math.random();
        const r = radiusAt(y) * 0.45;
        cube.userData = { x: Math.cos(a) * r, z: Math.sin(a) * r, y: y - 0.1 - (i % 2) * 0.12, ph: Math.random() * 6 };
        cube.rotation.set(Math.random(), Math.random(), Math.random());
        cube.position.set(cube.userData.x, H + 2, cube.userData.z);
        drink.add(cube);
        anim.ice.push(cube);
      }
      const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, H + 0.6, 16),
        new THREE.MeshStandardMaterial({ color: 0xc8874a, roughness: 0.4 }));
      straw.position.set(0.35, (H + 0.6) / 2 + 0.1, -0.15);
      straw.rotation.z = -0.18;
      drink.add(straw);
    } else {
      for (let i = 0; i < 10; i++) {
        const s = new THREE.Sprite(steamMat.clone());
        s.userData.k = i / 10;
        drink.add(s);
        anim.steam.push(s);
      }
    }

    const top = (geo, color, n, spread = 0.75) => {
      for (let i = 0; i < n; i++) {
        const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: typeof color === "function" ? color(i) : color, roughness: 0.4 }));
        const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * radiusAt(y) * spread;
        m.userData = { x: Math.cos(a) * r, z: Math.sin(a) * r, y: y + 0.04 + Math.random() * 0.06 };
        m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        m.position.set(m.userData.x, H + 3, m.userData.z);
        drink.add(m);
        anim.toppings.push(m);
      }
    };
    const candy = ["#d7263d", "#1b998b", "#f4d35e", "#2e86ab", "#f46036", "#7c4a2d"];
    if (item.topping === "candy") top(new THREE.SphereGeometry(0.1, 16, 10).scale(1, 0.5, 1), (i) => candy[i % candy.length], 14);
    if (item.topping === "crumble") top(new THREE.DodecahedronGeometry(0.05), 0x8fae4a, 30);
    if (item.topping === "marshmallow") top(new THREE.CylinderGeometry(0.11, 0.11, 0.16, 14), 0xfffaf2, 9, 0.6);
    if (item.topping === "drizzle") {
      const pts = Array.from({ length: 80 }, (_, i) => {
        const a = i * 0.32, r = radiusAt(y) * (0.75 - i / 130);
        return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
      });
      const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, 0.03, 6),
        new THREE.MeshStandardMaterial({ color: 0xb8692a, roughness: 0.25 }));
      m.userData = { x: 0, z: 0, y: y + 0.03, drizzle: true };
      m.position.set(0, H + 3, 0);
      drink.add(m);
      anim.toppings.push(m);
    }
  }

  // Drag to rotate
  let rot = 0, vel = 0.006, dragging = false, lastX = 0;
  canvas.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    vel = (e.clientX - lastX) * 0.01;
    rot += vel;
    lastX = e.clientX;
  });
  const up = () => (dragging = false);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 0.9 ? 11 : 9.2;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);

  let running = false;
  const ease = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
  function tick(now) {
    if (!running) return;
    const t = (now - anim.t0) / 1000;
    if (!dragging) { vel += (0.006 - vel) * 0.03; rot += vel; }
    root.rotation.y = rot;

    anim.layers.forEach(({ mesh, delay }) => (mesh.scale.y = Math.max(0.0001, ease((t - delay) / 0.7))));
    const settle = anim.layers.length * 0.45 + 0.3;
    anim.ice.forEach((c, i) => {
      const u = c.userData, k = ease((t - settle - i * 0.08) / 0.6);
      c.position.set(u.x, THREE.MathUtils.lerp(H + 2, u.y + Math.sin(now / 700 + u.ph) * 0.03, k), u.z);
    });
    anim.toppings.forEach((m, i) => {
      const u = m.userData, k = ease((t - settle - 0.2 - i * 0.03) / 0.5);
      m.position.set(u.x, THREE.MathUtils.lerp(H + 3, u.y, k), u.z);
      if (!u.drizzle) m.rotation.y += 0.01;
    });
    anim.steam.forEach((s) => {
      const k = (s.userData.k + now / 3500) % 1;
      s.position.set(Math.sin(k * 6 + s.userData.k * 9) * 0.35, anim.top + 0.2 + k * 1.6, Math.cos(k * 4 + s.userData.k * 7) * 0.2);
      s.scale.setScalar(0.4 + k * 0.9);
      s.material.opacity = Math.sin(k * Math.PI) * 0.5 * ease((t - settle) / 0.8);
    });

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  return {
    open(item) { resize(); show(item); rot = -0.4; if (!running) { running = true; requestAnimationFrame(tick); } },
    close() { running = false; },
  };
}
