import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { profile } from './data.js';

const PH = 3.2, ASPECT = 0.75; // portrait height in world units, width/height ratio of the photo

const VS = /* glsl */ `
attribute vec3 aT; attribute vec3 aS; attribute vec2 aR; attribute float aB;
uniform float uF, uD, uTime, uPx, uMA; uniform vec2 uM;
varying float vB;
void main(){
  float f = clamp((uF - aR.x * .45) / .55, 0., 1.); f = f * f * (3. - 2. * f);
  vec3 p = mix(aS, aT, f);
  p.x += sin(uTime * .6 + aR.y * 6.28) * (1. - f) * .18;
  p.y += cos(uTime * .5 + aR.y * 6.28) * (1. - f) * .12;
  p.z += sin(uTime * .8 + aR.y * 40.) * .012;
  vec2 dm = p.xy - uM; float r = length(dm);
  float push = smoothstep(.55, 0., r) * uMA;
  p.xy += normalize(dm + 1e-4) * push * .35; p.z += push * .4;
  p.y += uD * (1.2 + aR.x * 2.); p.x += (aR.y - .5) * uD * 2.5; p.z += uD * 1.5 * (aR.x - .3);
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPx * (.9 + aR.x * 1.1) / -mv.z;
  vB = aB * (1. - uD * 1.2) * (.5 + .5 * f) * (.82 + .18 * sin(uTime * 2. + aR.y * 60.));
}`;
const FS = /* glsl */ `
varying float vB;
void main(){
  float d = length(gl_PointCoord - .5); if (d > .5) discard;
  float a = smoothstep(.5, .05, d);
  gl_FragColor = vec4(mix(vec3(.6, .7, .95), vec3(1.), vB), a * vB);
}`;

function loadPortrait(n) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const W = 210, H = Math.round((W * img.height) / img.width);
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d', { willReadFrequently: true });
      x.drawImage(img, 0, 0, W, H);
      const d = x.getImageData(0, 0, W, H).data;
      const lum = new Float32Array(W * H);
      for (let k = 0; k < W * H; k++) lum[k] = (0.2126 * d[k * 4] + 0.7152 * d[k * 4 + 1] + 0.0722 * d[k * 4 + 2]) / 255;
      const L = (i, j) => lum[Math.max(0, Math.min(H - 1, j)) * W + Math.max(0, Math.min(W - 1, i))];
      // Local contrast (unsharp mask): faces are mid-tones, so features only read if small differences are exaggerated.
      const blur = (src, r) => {
        const tmp = new Float32Array(W * H), out = new Float32Array(W * H);
        for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { let t = 0; for (let k = -r; k <= r; k++) t += src[j * W + Math.max(0, Math.min(W - 1, i + k))]; tmp[j * W + i] = t / (2 * r + 1); }
        for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { let t = 0; for (let k = -r; k <= r; k++) t += tmp[Math.max(0, Math.min(H - 1, j + k)) * W + i]; out[j * W + i] = t / (2 * r + 1); }
        return out;
      };
      const soft = blur(lum, 6);
      const px = [], cum = [];
      let tot = 0;
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
        const l = L(i, j);
        if (l > 0.93) continue; // plain studio background
        const g = Math.min(0.5, Math.abs(L(i + 1, j) - L(i - 1, j)) + Math.abs(L(i, j + 1) - L(i, j - 1)));
        // Hair and clothing are near-black, so brightness has a floor and edges are lifted to keep them visible.
        const b = Math.max(0.1, Math.min(1, 0.14 + 0.95 * Math.pow(l, 0.7) + 3.2 * (l - soft[j * W + i]) + g * 0.8));
        tot += 0.04 + b * b; // brighter areas get more particles, which is what makes the face read
        px.push([i, j, l, b]); cum.push(tot);
      }
      const T = new Float32Array(n * 3), B = new Float32Array(n);
      for (let k = 0; k < n; k++) {
        const r = Math.random() * tot; let lo = 0, hi = cum.length - 1;
        while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < r) lo = m + 1; else hi = m; }
        const [i, j, l, b] = px[lo];
        T[k * 3] = ((i + Math.random()) / W - 0.5) * PH * ASPECT;
        T[k * 3 + 1] = (0.5 - (j + Math.random()) / H) * PH;
        T[k * 3 + 2] = (l - 0.5) * 0.22 + (Math.random() - 0.5) * 0.04;
        B[k] = b;
      }
      resolve({ T, B });
    };
    img.src = '/portrait.jpg';
  });
}

export default function Hero({ ctl, reduced }) {
  const wrap = useRef(), canvas = useRef();

  useEffect(() => {
    const el = wrap.current;
    const mobile = window.innerWidth < 768;
    const N = mobile ? 9000 : 24000, DUST = mobile ? 600 : 1400;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current, alpha: true, antialias: false, powerPreference: 'high-performance' });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50); cam.position.z = 6;
    const group = new THREE.Group(); scene.add(group);
    const U = () => ({ uF: { value: 0 }, uD: { value: 0 }, uTime: { value: 0 }, uPx: { value: 1 }, uMA: { value: 0 }, uM: { value: new THREE.Vector2(9, 9) } });
    const mk = (u) => new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const uP = U(), uS = U(); uS.uF.value = 1;
    const disposables = [];

    const build = (T, B, mat, scatter) => {
      const g = new THREE.BufferGeometry(), n = B.length;
      const S = new Float32Array(n * 3), R = new Float32Array(n * 2);
      for (let k = 0; k < n; k++) {
        S[k * 3] = (Math.random() - 0.5) * 9; S[k * 3 + 1] = (Math.random() - 0.5) * 6; S[k * 3 + 2] = (Math.random() - 0.5) * 4;
        R[k * 2] = Math.random(); R[k * 2 + 1] = Math.random();
      }
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      g.setAttribute('aT', new THREE.BufferAttribute(scatter ? S : T, 3));
      g.setAttribute('aS', new THREE.BufferAttribute(S, 3));
      g.setAttribute('aR', new THREE.BufferAttribute(R, 2));
      g.setAttribute('aB', new THREE.BufferAttribute(B, 1));
      const pts = new THREE.Points(g, mat); pts.frustumCulled = false; group.add(pts);
      disposables.push(g, mat);
    };
    // ambient dust: always formed, dim
    const dB = new Float32Array(DUST).map(() => 0.15 + Math.random() * 0.35);
    build(null, dB, mk(uS), true);

    let visH = 1, scale = 1, on = false, raf = 0, dead = false;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: 0 };

    const size = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
      visH = 2 * 6 * Math.tan((35 * Math.PI) / 360);
      const visW = visH * cam.aspect;
      scale = Math.min(1, (visW * 0.92) / (PH * ASPECT));
      group.scale.setScalar(scale);
      group.position.y = visH * 0.05;
      uP.uPx.value = uS.uPx.value = ((h * dpr) / visH) * 6 * 0.0092 * Math.max(scale, 0.6); // world size -> pixels
      draw(0);
    };

    const draw = (t) => {
      const sy = Math.min(1, Math.max(0, window.scrollY / (el.clientHeight * 0.9)));
      const disperse = sy * sy * (3 - 2 * sy);
      for (const u of [uP, uS]) { u.uTime.value = t; u.uD.value = disperse; }
      const t0 = ctl.current.t0; // wall-clock driven so it never stalls on a slow frame
      const x = reduced ? 1 : t0 == null ? 0 : Math.min(1, (performance.now() - t0) / 2800);
      uP.uF.value = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      pointer.x += (pointer.tx - pointer.x) * 0.06; pointer.y += (pointer.ty - pointer.y) * 0.06;
      group.rotation.y = pointer.x * 0.14; group.rotation.x = -pointer.y * 0.08;
      const visW = visH * cam.aspect;
      const m = new THREE.Vector2((pointer.tx * visW) / 2 / scale, ((pointer.ty * visH) / 2 - group.position.y) / scale);
      for (const u of [uP, uS]) { u.uM.value.copy(m); u.uMA.value += (pointer.active - u.uMA.value) * 0.1; }
      renderer.render(scene, cam);
      el.style.setProperty('--s', disperse.toFixed(3));
    };

    const loop = (ms) => { if (!on || dead) return; draw(ms / 1000); raf = requestAnimationFrame(loop); };
    const start = () => { if (!on && !reduced && !document.hidden) { on = true; raf = requestAnimationFrame(loop); } };
    const stop = () => { on = false; cancelAnimationFrame(raf); };

    const move = (e) => {
      const r = el.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.active = 1;
    };
    const leave = () => { pointer.active = 0; pointer.tx = pointer.ty = 0; };
    if (!reduced && window.matchMedia('(pointer: fine)').matches) { el.addEventListener('pointermove', move, { passive: true }); el.addEventListener('pointerleave', leave); }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(el);
    const ro = new ResizeObserver(size); ro.observe(el);
    const vis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', vis);
    const scrollDraw = () => { if (reduced) draw(0); };
    window.addEventListener('scroll', scrollDraw, { passive: true });

    loadPortrait(N).then(({ T, B }) => { if (!dead) { build(T, B, mk(uP), false); size(); start(); } });

    return () => {
      dead = true; stop(); io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', vis); window.removeEventListener('scroll', scrollDraw);
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave);
      disposables.forEach((d) => d.dispose()); renderer.dispose();
    };
  }, []);

  return (
    <section id="home" className="hero" ref={wrap}>
      <canvas ref={canvas} aria-hidden="true" />
      <div className="hero-copy">
        <h1 className="word">
          <span className="sr">{profile.name}, {profile.role} {profile.role2}</span>
          <span className="metal" aria-hidden="true">PORTFOLIO</span>
        </h1>
        <div className="hero-row">
          <div>
            <p className="who">SHYAM HARI</p>
            <p className="role">{profile.role} <em>{profile.role2}</em></p>
          </div>
          <div className="hero-actions">
            <a className="btn" href="#projects">Explore my work</a>
            <a className="btn ghost" href="#contact">Get in touch</a>
          </div>
        </div>
      </div>
    </section>
  );
}
