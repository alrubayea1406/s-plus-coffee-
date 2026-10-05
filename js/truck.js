// Interactive 3D coffee truck for the hero section.
import * as THREE from "three";
import { RoundedBoxGeometry } from "../vendor/RoundedBoxGeometry.js";

const C = {
  cream: 0xf3e7d3, crema: 0xc8874a, brown: 0x3d2417, dark: 0x1b0f09,
  glass: 0x1d2a33, tire: 0x161210, steel: 0xb9b2aa, bulb: 0xffc777,
};

function canvasTexture(w, h, draw) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  draw(cv.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

const stripesTex = () => canvasTexture(512, 256, (g, w, h) => {
  const n = 8;
  for (let i = 0; i < n; i++) {
    g.fillStyle = i % 2 ? "#f6eddf" : "#c8874a";
    g.fillRect((i * w) / n, 0, w / n, h);
  }
  // scalloped edge
  g.globalCompositeOperation = "destination-out";
  for (let i = 0; i < n * 2; i++) {
    g.beginPath(); g.arc(((i + 0.5) * w) / (n * 2), h + 6, w / (n * 4), 0, Math.PI * 2); g.fill();
  }
});

export const logoTex = (bg = "#1b0f09", fg = "#e0a15e") => canvasTexture(512, 512, (g, w) => {
  g.fillStyle = bg; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 4, 0, Math.PI * 2); g.fill();
  g.strokeStyle = fg; g.lineWidth = 10; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 34, 0, Math.PI * 2); g.stroke();
  g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = "800 230px Fraunces, Georgia, serif"; g.fillText("S", w / 2 - 34, w / 2 + 6);
  g.font = "800 140px Fraunces, Georgia, serif"; g.fillText("+", w / 2 + 92, w / 2 - 52);
  g.font = "700 46px 'DM Sans', sans-serif"; g.fillText("COFFEE", w / 2, w / 2 + 150);
});

const bandTex = () => canvasTexture(2048, 200, (g, w, h) => {
  g.fillStyle = "#c8874a"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#1b0f09"; g.textBaseline = "middle"; g.textAlign = "center";
  g.font = "800 110px Fraunces, Georgia, serif";
  g.fillText("S+ COFFEE  ·  specialty coffee on wheels", w / 2, h / 2 + 6);
});

const menuBoardTex = () => canvasTexture(512, 256, (g, w, h) => {
  g.fillStyle = "#2b1a12"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#f6eddf"; g.font = "700 34px 'DM Sans', sans-serif"; g.textAlign = "left";
  ["SPANISH LATTE", "D-1 COFFEE", "COLD BREW", "KARAK CHAI"].forEach((t, i) => {
    g.fillText(t, 30, 52 + i * 52);
    g.fillStyle = "#e0a15e"; g.fillText("✦", w - 64, 52 + i * 52); g.fillStyle = "#f6eddf";
  });
});

export const softDot = () => canvasTexture(64, 64, (g) => {
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,.9)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
});

const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05, ...extra });

function buildTruck() {
  const truck = new THREE.Group();
  const shadowy = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };

  // Box body
  const body = shadowy(new THREE.Mesh(new RoundedBoxGeometry(5, 2.6, 2.3, 6, 0.22), std(C.cream)));
  body.position.set(-0.4, 1.75, 0);
  truck.add(body);

  const band = new THREE.Mesh(new RoundedBoxGeometry(5.04, 0.62, 2.34, 4, 0.12), std(C.crema));
  band.position.set(-0.4, 0.86, 0);
  truck.add(band);

  // Wordmark band (both sides)
  const bandMat = new THREE.MeshStandardMaterial({ map: bandTex(), roughness: 0.6 });
  [1, -1].forEach((s) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 0.33), bandMat);
    p.position.set(0.1, 0.88, s * 1.175);
    if (s < 0) p.rotation.y = Math.PI;
    truck.add(p);
  });

  const roof = shadowy(new THREE.Mesh(new RoundedBoxGeometry(5.1, 0.16, 2.4, 3, 0.07), std(C.brown)));
  roof.position.set(-0.4, 3.08, 0);
  truck.add(roof);

  // Cab
  const cab = shadowy(new THREE.Mesh(new RoundedBoxGeometry(1.45, 1.95, 2.2, 6, 0.3), std(C.cream)));
  cab.position.set(2.75, 1.42, 0);
  truck.add(cab);
  const cabBand = new THREE.Mesh(new RoundedBoxGeometry(1.49, 0.62, 2.24, 4, 0.12), std(C.crema));
  cabBand.position.set(2.75, 0.86, 0);
  truck.add(cabBand);

  const glassMat = std(0x45606e, { roughness: 0.1, metalness: 0.3, emissive: 0x1d2a33, emissiveIntensity: 0.6 });
  const windshield = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.75, 1.9, 2, 0.03), glassMat);
  windshield.position.set(3.47, 1.92, 0);
  truck.add(windshield);
  [1, -1].forEach((s) => {
    const w = new THREE.Mesh(new RoundedBoxGeometry(0.85, 0.7, 0.05, 2, 0.02), glassMat);
    w.position.set(2.85, 1.92, s * 1.1);
    truck.add(w);
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.06, 20),
      std(0xfff6dd, { emissive: 0xffe3a3, emissiveIntensity: 1.2 }));
    lamp.rotation.z = Math.PI / 2;
    lamp.position.set(3.49, 0.92, s * 0.78);
    truck.add(lamp);
  });
  const grille = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.32, 1.0, 2, 0.02), std(C.brown));
  grille.position.set(3.49, 0.95, 0);
  truck.add(grille);
  const bumper = shadowy(new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.2, 2.3, 3, 0.08), std(C.steel, { metalness: 0.7, roughness: 0.3 })));
  bumper.position.set(3.5, 0.5, 0);
  truck.add(bumper);

  // Serving window (+z side)
  const win = new THREE.Group();
  win.position.set(-0.6, 2.0, 1.16);
  truck.add(win);
  const opening = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.0), new THREE.MeshBasicMaterial({ color: 0x2a160b }));
  opening.position.z = 0.002;
  win.add(opening);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.9),
    new THREE.MeshBasicMaterial({ color: 0xffb35c, transparent: true, opacity: 0 }));
  glow.position.z = 0.004;
  win.add(glow);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55), new THREE.MeshBasicMaterial({ map: menuBoardTex() }));
  board.position.set(0.55, 0.12, 0.006);
  win.add(board);
  const machine = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.42, 0.1, 2, 0.04), std(C.steel, { metalness: 0.8, roughness: 0.25 }));
  machine.position.set(-0.6, -0.25, 0.06);
  win.add(machine);
  const frameMat = std(C.brown);
  [[0, 0.52, 2.8, 0.08], [0, -0.52, 2.8, 0.08], [-1.36, 0, 0.08, 1.12], [1.36, 0, 0.08, 1.12]].forEach(([x, y, w, h]) => {
    const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), frameMat);
    f.position.set(x, y, 0.03);
    win.add(f);
  });
  const counter = shadowy(new THREE.Mesh(new RoundedBoxGeometry(2.9, 0.07, 0.5, 2, 0.03), std(C.brown)));
  counter.position.set(0, -0.56, 0.25);
  win.add(counter);

  // Awning, hinged at the top of the window
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.56, 0.04);
  win.add(hinge);
  const awning = shadowy(new THREE.Mesh(new THREE.BoxGeometry(2.95, 1.12, 0.05),
    new THREE.MeshStandardMaterial({ map: stripesTex(), roughness: 0.7, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide })));
  awning.position.set(0, -0.56, 0.03);
  hinge.add(awning);

  // Logo badge
  const logoMat = new THREE.MeshStandardMaterial({ map: logoTex(), transparent: true, roughness: 0.5 });
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.55, 48), logoMat);
  logo.position.set(1.35, 2.0, 1.157);
  truck.add(logo);
  const logoBack = new THREE.Mesh(new THREE.CircleGeometry(0.9, 48), logoMat);
  logoBack.position.set(-0.4, 2.0, -1.157);
  logoBack.rotation.y = Math.PI;
  truck.add(logoBack);

  // String lights along the roof edge
  const bulbs = [];
  const bulbGeo = new THREE.SphereGeometry(0.055, 12, 8);
  for (let i = 0; i < 16; i++) {
    const t = i / 15;
    const x = -2.75 + t * 4.7;
    const sag = Math.sin(((t * 4) % 1) * Math.PI) * 0.12;
    const m = new THREE.Mesh(bulbGeo, new THREE.MeshStandardMaterial({ color: C.bulb, emissive: C.bulb, emissiveIntensity: 1.5 }));
    m.position.set(x, 2.93 - sag, 1.2);
    m.userData.phase = Math.random() * 10;
    bulbs.push(m);
    truck.add(m);
  }

  // Giant cup on the roof
  const cup = new THREE.Group();
  cup.position.set(-0.4, 3.16, 0);
  truck.add(cup);
  const cupBody = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.45, 1.35, 40), std(0xfbf7f0)));
  cupBody.position.y = 0.68;
  cup.add(cupBody);
  const sleeveTex = logoTex("#3d2417", "#f6eddf");
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.53, 0.5, 40, 1, true),
    new THREE.MeshStandardMaterial({ color: C.brown, roughness: 0.8 }));
  sleeve.position.y = 0.62;
  sleeve.scale.setScalar(1.02);
  cup.add(sleeve);
  const sleeveLogo = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), new THREE.MeshBasicMaterial({ map: sleeveTex, transparent: true }));
  sleeveLogo.position.set(0, 0.62, 0.585);
  sleeveLogo.rotation.x = -0.09;
  cup.add(sleeveLogo);
  const lid = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.12, 40), std(C.dark)));
  lid.position.y = 1.4;
  cup.add(lid);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), std(C.dark));
  dome.scale.y = 0.35;
  dome.position.y = 1.45;
  cup.add(dome);

  // Wheels
  const wheels = [];
  const tireGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.32, 28);
  const hubGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.34, 6);
  [[-2.15, 1], [-2.15, -1], [2.6, 1], [2.6, -1]].forEach(([x, s]) => {
    const w = new THREE.Group();
    w.position.set(x, 0.46, s * 1.02);
    const tire = shadowy(new THREE.Mesh(tireGeo, std(C.tire, { roughness: 0.9 })));
    tire.rotation.x = Math.PI / 2;
    const hub = new THREE.Mesh(hubGeo, std(C.steel, { metalness: 0.8, roughness: 0.3 }));
    hub.rotation.x = Math.PI / 2;
    w.add(tire, hub);
    wheels.push(w);
    truck.add(w);
  });

  return { truck, hinge, glow, bulbs, cup, wheels, body: [body, cab, band, cabBand, roof] };
}

function makeBean() {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 12), std(0x4a2615, { roughness: 0.35 }));
  b.scale.set(1, 0.68, 1.35);
  const crease = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.22, 4, 8), std(0x1a0b05));
  crease.rotation.x = Math.PI / 2;
  crease.scale.set(1, 1, 0.5);
  crease.position.y = 0.084;
  g.add(b, crease);
  return g;
}

export function initTruck(canvas, { onFirstInteract } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xffe9cf, 0x2a1810, 1.1));
  const sun = new THREE.DirectionalLight(0xffe0b8, 2.4);
  sun.position.set(5, 9, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
  sun.shadow.radius = 6;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xff9a4d, 1.6);
  rim.position.set(-6, 4, -6);
  scene.add(rim);

  const stage = new THREE.Group();
  scene.add(stage);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 64), new THREE.ShadowMaterial({ opacity: 0.38 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  stage.add(ground);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(4.4, 64),
    new THREE.MeshBasicMaterial({ map: softDot(), color: 0xc8874a, transparent: true, opacity: 0.35, depthWrite: false }));
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = 0.01;
  stage.add(pool);

  const parts = buildTruck();
  const spinner = new THREE.Group(); // user rotation
  const driver = new THREE.Group(); // drive-in offset
  spinner.add(driver);
  driver.add(parts.truck);
  parts.truck.position.x = -0.3;
  stage.add(spinner);

  const windowLight = new THREE.PointLight(0xffa64d, 0, 4, 1.5);
  windowLight.position.set(-0.6, 2.0, 1.8);
  parts.truck.add(windowLight);

  // Steam above the roof cup
  const steamMat = new THREE.SpriteMaterial({ map: softDot(), color: 0xfff3e6, transparent: true, opacity: 0, depthWrite: false });
  const steam = Array.from({ length: 14 }, (_, i) => {
    const s = new THREE.Sprite(steamMat.clone());
    s.userData.t = i / 14;
    parts.cup.add(s);
    return s;
  });

  // Floating beans
  const beans = Array.from({ length: 26 }, () => {
    const b = makeBean();
    const r = 3.2 + Math.random() * 3.2;
    const a = Math.random() * Math.PI * 2;
    b.userData = { r, a, y: 0.8 + Math.random() * 4.5, sp: 0.04 + Math.random() * 0.08, rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.02) };
    b.scale.setScalar(0.7 + Math.random() * 1.0);
    stage.add(b);
    return b;
  });

  // Cups that pop out of the window when the truck is tapped
  const popCups = [];
  function popCup() {
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.38, 20), std(0xfbf7f0));
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.145, 0.14, 20), std(C.crema));
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.175, 0.05, 20), std(C.dark));
    l.position.y = 0.21;
    g.add(c, s, l);
    g.position.set(-0.6 + (Math.random() - 0.5) * 1.6, 1.7, 1.4);
    g.userData = { v: new THREE.Vector3((Math.random() - 0.5) * 2, 4 + Math.random() * 1.5, 2.2 + Math.random()), life: 0, spin: (Math.random() - 0.5) * 8 };
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    parts.truck.add(g);
    popCups.push(g);
  }

  // ── State & interaction ──────────────────────────
  const state = {
    rotY: -0.5, targetRotY: -0.5, vel: 0, dragging: false, lastX: 0, downX: 0, downY: 0,
    idleAt: 0, mouseX: 0, mouseY: 0, awningOpen: false, awning: 0, scroll: 0, drive: 1, interacted: false,
  };
  const BASE_ROT = -0.5;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  canvas.addEventListener("pointerdown", (e) => {
    state.dragging = true; state.lastX = e.clientX; state.downX = e.clientX; state.downY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    state.mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
    state.mouseY = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (!state.dragging) return;
    const dx = e.clientX - state.lastX;
    state.lastX = e.clientX;
    state.targetRotY += dx * 0.009;
    state.vel = dx * 0.009;
    state.idleAt = performance.now();
  });
  const end = (e) => {
    if (!state.dragging) return;
    state.dragging = false;
    state.idleAt = performance.now();
    const moved = Math.hypot(e.clientX - state.downX, e.clientY - state.downY);
    if (moved < 6) {
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.intersectObject(parts.truck, true).length) {
        if (!state.awningOpen) state.awningOpen = true;
        else popCup();
      }
    }
    if (!state.interacted) { state.interacted = true; onFirstInteract?.(); }
  };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
  canvas.addEventListener("pointerleave", () => { state.mouseX = 0; state.mouseY = 0; });

  // Hover cursor feedback
  canvas.addEventListener("pointermove", (e) => {
    if (state.dragging) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    canvas.style.cursor = raycaster.intersectObject(parts.truck, true).length ? "pointer" : "grab";
  });

  // ── Layout ───────────────────────────────────────
  let layout = { x: 0, y: 0, s: 1 };
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const wide = camera.aspect > 1.05;
    camera.position.set(0, wide ? 3.4 : 3.8, wide ? 15 : 19);
    camera.lookAt(0, wide ? 1.7 : 3.4, 0);
    camera.updateProjectionMatrix();
    layout = wide
      ? { x: Math.min(3.8, 1.6 + (camera.aspect - 1) * 2.4), y: 0, s: 1 }
      : { x: -0.2, y: -1.0, s: 0.62 };
    stage.position.set(layout.x, layout.y, 0);
    stage.scale.setScalar(layout.s);
  }
  window.addEventListener("resize", resize);
  resize();

  // ── Loop ─────────────────────────────────────────
  const clock = new THREE.Clock();
  let running = true, start = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function tick() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const since = (performance.now() - start) / 1000;

    // Drive-in intro
    const driveT = Math.min(since / 2.4, 1);
    const prevDrive = state.drive;
    state.drive = 1 - easeOut(driveT);
    driver.position.x = state.drive * 14;
    const rolled = (prevDrive - state.drive) * 14;
    parts.wheels.forEach((w) => (w.rotation.z -= rolled / 0.46));
    if (driveT >= 1 && since > 2.7 && !state.awningOpen && !state.interacted) state.awningOpen = true;

    // Rotation: inertia while free, drift home when idle
    if (!state.dragging) {
      state.targetRotY += state.vel;
      state.vel *= 0.92;
      if (performance.now() - state.idleAt > 3500) {
        const home = BASE_ROT + Math.sin(t * 0.25) * 0.18;
        state.targetRotY += (home - state.targetRotY) * 0.015;
      }
    }
    state.rotY += (state.targetRotY - state.rotY) * Math.min(1, dt * 8);
    spinner.rotation.y = state.rotY + state.scroll * 0.6;
    spinner.rotation.x = state.mouseY * 0.04;
    stage.position.y = layout.y - state.scroll * 1.2;

    // Idle engine bob
    parts.truck.position.y = Math.sin(t * 9) * 0.008 * (driveT >= 1 ? 1 : 3);

    // Awning
    state.awning += ((state.awningOpen ? 1 : 0) - state.awning) * Math.min(1, dt * 4);
    parts.hinge.rotation.x = -1.42 * state.awning;
    parts.glow.material.opacity = 0.25 * state.awning;
    windowLight.intensity = 6 * state.awning;

    // Bulbs flicker
    parts.bulbs.forEach((b) => (b.material.emissiveIntensity = 1.2 + Math.sin(t * 3 + b.userData.phase) * 0.35));

    // Steam
    steam.forEach((s) => {
      const k = (s.userData.t + t * 0.18) % 1;
      s.position.set(Math.sin(k * 7 + s.userData.t * 20) * 0.18, 1.6 + k * 1.8, Math.cos(k * 5) * 0.1);
      s.scale.setScalar(0.25 + k * 0.9);
      s.material.opacity = Math.sin(k * Math.PI) * 0.45;
    });

    // Beans orbit
    beans.forEach((b) => {
      const u = b.userData;
      u.a += u.sp * dt;
      b.position.set(Math.cos(u.a) * u.r, u.y + Math.sin(t + u.r) * 0.3, Math.sin(u.a) * u.r * 0.5 - 2.2);
      b.rotation.x += u.rot.x; b.rotation.y += u.rot.y; b.rotation.z += u.rot.z;
    });

    // Popped cups
    for (let i = popCups.length - 1; i >= 0; i--) {
      const c = popCups[i], u = c.userData;
      u.life += dt;
      u.v.y -= 9.8 * dt;
      c.position.addScaledVector(u.v, dt);
      c.rotation.z += u.spin * dt;
      if (c.position.y < 0.2) { c.position.y = 0.2; u.v.y *= -0.35; u.v.x *= 0.7; u.v.z *= 0.7; u.spin *= 0.6; }
      if (u.life > 4) {
        c.scale.multiplyScalar(0.9);
        if (c.scale.x < 0.02) { parts.truck.remove(c); popCups.splice(i, 1); }
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  // Pause when the hero is off screen
  new IntersectionObserver(([e]) => {
    const was = running;
    running = e.isIntersecting;
    if (running && !was) { clock.getDelta(); requestAnimationFrame(tick); }
  }).observe(canvas);

  requestAnimationFrame(tick);

  return {
    setScroll(p) { state.scroll = p; },
  };
}
