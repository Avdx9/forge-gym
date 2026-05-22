/**
 * LUXE — Premium Salon & Barbershop
 * Three.js WebGL particle system + GSAP scroll storytelling
 */

import * as THREE from 'three';

/* ═══════════════════════════════════════════════════
   GLOBALS
   ═══════════════════════════════════════════════════ */

const canvas   = document.getElementById('webgl-canvas');
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
const preloader = document.getElementById('preloader');

let scrollY   = 0;
let mouse     = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };

/* ═══════════════════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════════════════ */

function runPreloader() {
  return new Promise(resolve => {
    const numEl   = document.getElementById('pre-num');
    const ringEl  = document.getElementById('ring-fill');
    const circum  = 2 * Math.PI * 52; // r=52

    let count = 0;
    const total = 100;

    const tick = setInterval(() => {
      count += Math.floor(Math.random() * 4) + 1;
      if (count > total) count = total;

      numEl.textContent = count;
      const offset = circum - (count / total) * circum;
      ringEl.style.strokeDashoffset = offset;

      if (count >= total) {
        clearInterval(tick);
        setTimeout(() => {
          gsap.to(preloader, {
            opacity: 0,
            scale: 0.97,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
              preloader.style.display = 'none';
              resolve();
            }
          });
        }, 400);
      }
    }, 25);
  });
}

/* ═══════════════════════════════════════════════════
   THREE.JS SCENE
   ═══════════════════════════════════════════════════ */

const scene    = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8);

/* ── PARTICLE COUNT ─────────────────────────────── */
const COUNT = 4500;

/* ── POSITION GENERATORS ────────────────────────── */

/** Shape A — Elegant spiral galaxy (hero) */
function makeSpiral() {
  const pos = new Float32Array(COUNT * 3);
  const arms = 3;
  for (let i = 0; i < COUNT; i++) {
    const t   = i / COUNT;
    const arm = i % arms;
    const r   = Math.pow(t, 0.6) * 6.5;
    const angle = t * Math.PI * 9 + (arm / arms) * Math.PI * 2;
    const spread = 0.22 * r;

    pos[i*3]   = Math.cos(angle) * r + (Math.random()-0.5) * spread;
    pos[i*3+1] = (Math.random()-0.5) * spread * 0.5;
    pos[i*3+2] = Math.sin(angle) * r + (Math.random()-0.5) * spread;
  }
  return pos;
}

/** Shape B — Concentric orbital rings (services) */
function makeOrbitals() {
  const pos = new Float32Array(COUNT * 3);
  const rings = 6;
  const perRing = Math.floor(COUNT / rings);
  for (let i = 0; i < COUNT; i++) {
    const ring = Math.min(Math.floor(i / perRing), rings - 1);
    const t    = (i % perRing) / perRing;
    const r    = 1.4 + ring * 0.9;
    const angle = t * Math.PI * 2 + ring * 0.3;

    // Tilt each ring differently
    const tiltX = (ring - 2.5) * 0.25;
    const tiltZ = ring * 0.1;

    pos[i*3]   = Math.cos(angle) * r + (Math.random()-0.5) * 0.18;
    pos[i*3+1] = Math.sin(angle) * Math.sin(tiltX + 0.5) * r + (Math.random()-0.5) * 0.15;
    pos[i*3+2] = Math.sin(angle) * Math.cos(tiltX + 0.5) * r + (Math.random()-0.5) * 0.18;
  }
  return pos;
}

/** Shape C — Wave terrain (about) */
function makeWave() {
  const pos  = new Float32Array(COUNT * 3);
  const cols = Math.floor(Math.sqrt(COUNT));
  for (let i = 0; i < COUNT; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x   = (col / cols - 0.5) * 11;
    const z   = (row / cols - 0.5) * 11;
    const y   = Math.sin(x * 0.7) * Math.cos(z * 0.5) * 0.6
              + Math.sin(x * 0.3 + z * 0.4) * 0.3;

    pos[i*3]   = x   + (Math.random()-0.5) * 0.12;
    pos[i*3+1] = y   - 1.4 + (Math.random()-0.5) * 0.08;
    pos[i*3+2] = z   + (Math.random()-0.5) * 0.12;
  }
  return pos;
}

/** Shape D — Sphere (booking CTA) */
function makeSphere() {
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const phi   = Math.acos(1 - 2*(i/COUNT));
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r     = 3.5 + (Math.random()-0.5)*0.6;
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.cos(phi);
    pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return pos;
}

const spiralPos   = makeSpiral();
const orbitalPos  = makeOrbitals();
const wavePos     = makeWave();
const spherePos   = makeSphere();

/* ── RANDOM ATTRIBUTES ──────────────────────────── */
const sizes   = new Float32Array(COUNT);
const randoms = new Float32Array(COUNT);
const colors  = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT; i++) {
  sizes[i]   = 0.5 + Math.random() * 2.5;
  randoms[i] = Math.random() * Math.PI * 2;

  // Gold-to-cream color spectrum
  const t = Math.random();
  if (t < 0.6) {
    // Gold
    colors[i*3]   = 0.788; // r
    colors[i*3+1] = 0.635; // g
    colors[i*3+2] = 0.153; // b
  } else if (t < 0.85) {
    // Lighter gold
    colors[i*3]   = 0.910;
    colors[i*3+1] = 0.752;
    colors[i*3+2] = 0.314;
  } else {
    // Cream
    colors[i*3]   = 0.961;
    colors[i*3+1] = 0.929;
    colors[i*3+2] = 0.863;
  }
}

/* ── GEOMETRY ───────────────────────────────────── */
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position',     new THREE.BufferAttribute(spiralPos.slice(), 3));
geometry.setAttribute('aTarget1',     new THREE.BufferAttribute(orbitalPos, 3));
geometry.setAttribute('aTarget2',     new THREE.BufferAttribute(wavePos, 3));
geometry.setAttribute('aTarget3',     new THREE.BufferAttribute(spherePos, 3));
geometry.setAttribute('aSize',        new THREE.BufferAttribute(sizes, 1));
geometry.setAttribute('aRandom',      new THREE.BufferAttribute(randoms, 1));
geometry.setAttribute('aColor',       new THREE.BufferAttribute(colors, 3));

/* ── SHADERS ────────────────────────────────────── */
const vertexShader = /* glsl */`
  attribute vec3  aTarget1;
  attribute vec3  aTarget2;
  attribute vec3  aTarget3;
  attribute float aSize;
  attribute float aRandom;
  attribute vec3  aColor;

  uniform float uTime;
  uniform float uMorph1;   // 0→1: spiral→orbital
  uniform float uMorph2;   // 0→1: orbital→wave
  uniform float uMorph3;   // 0→1: wave→sphere
  uniform float uPixelRatio;
  uniform vec2  uMouse;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Base = spiral
    vec3 pos = position;

    // Step 1: spiral → orbital
    pos = mix(pos, aTarget1, uMorph1);

    // Step 2: orbital → wave
    pos = mix(pos, aTarget2, uMorph2);

    // Step 3: wave → sphere
    pos = mix(pos, aTarget3, uMorph3);

    // Gentle floating oscillation
    float wave = sin(uTime * 0.35 + aRandom) * 0.06
               + cos(uTime * 0.22 + aRandom * 1.3) * 0.04;
    pos.y += wave;
    pos.x += cos(uTime * 0.18 + aRandom * 0.8) * 0.03;

    // Subtle mouse parallax
    pos.x += uMouse.x * 0.4 * (0.5 + aRandom * 0.5);
    pos.y += uMouse.y * 0.4 * (0.5 + aRandom * 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position     = projectionMatrix * mvPosition;

    // Size with distance attenuation
    gl_PointSize = aSize * uPixelRatio * (4.5 / -mvPosition.z);

    vColor = aColor;
    vAlpha = 0.7 + 0.3 * sin(uTime * 0.5 + aRandom * 3.0);
  }
`;

const fragmentShader = /* glsl */`
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Circular soft point
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = length(uv) * 2.0;

    float alpha = 1.0 - smoothstep(0.3, 1.0, dist);
    float glow  = 1.0 - smoothstep(0.0, 1.0, dist);

    vec3 col = mix(vColor * 2.2, vColor * 0.8, dist * 0.8);

    gl_FragColor = vec4(col, alpha * glow * vAlpha);
    if (gl_FragColor.a < 0.005) discard;
  }
`;

/* ── MATERIAL ───────────────────────────────────── */
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime:        { value: 0 },
    uMorph1:      { value: 0 },
    uMorph2:      { value: 0 },
    uMorph3:      { value: 0 },
    uPixelRatio:  { value: renderer.getPixelRatio() },
    uMouse:       { value: new THREE.Vector2(0, 0) },
  },
  transparent: true,
  blending:    THREE.AdditiveBlending,
  depthWrite:  false,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

/* ── AMBIENT GLOW SPHERES ───────────────────────── */
function makeGlowSphere(r, color, pos) {
  const geo  = new THREE.SphereGeometry(r, 16, 16);
  const mat  = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.04 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...pos);
  scene.add(mesh);
  return mesh;
}
makeGlowSphere(2.0, 0xC9A227, [0, 0, 0]);
makeGlowSphere(1.2, 0xE8C050, [2, 1, -2]);

/* ═══════════════════════════════════════════════════
   LENIS SMOOTH SCROLL
   ═══════════════════════════════════════════════════ */

const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
});

lenis.on('scroll', ({ scroll }) => {
  scrollY = scroll;
});

function lenisRaf(time) {
  lenis.raf(time);
  requestAnimationFrame(lenisRaf);
}
requestAnimationFrame(lenisRaf);

/* ═══════════════════════════════════════════════════
   GSAP SCROLL ANIMATIONS
   ═══════════════════════════════════════════════════ */

function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Feed Lenis scroll into ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) lenis.scrollTo(value, { duration: 0 });
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top:0, left:0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.body.style.transform ? 'transform' : 'fixed'
  });

  /* ─ Camera Z on scroll ─ */
  ScrollTrigger.create({
    trigger: '#scroll-wrapper',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const p = self.progress;
      // Camera pulls back as you scroll
      camera.position.z = 8 + p * 4;
      camera.position.y = -p * 1.5;
    }
  });

  /* ─ Particle morph — hero → services ─ */
  ScrollTrigger.create({
    trigger: '#services',
    start: 'top 80%',
    end:   'center center',
    onUpdate: (self) => {
      material.uniforms.uMorph1.value = self.progress;
    }
  });

  /* ─ Particle morph — services → about (wave) ─ */
  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 70%',
    end:   'center center',
    onUpdate: (self) => {
      material.uniforms.uMorph2.value = self.progress;
    }
  });

  /* ─ Particle morph — back to sphere at booking ─ */
  ScrollTrigger.create({
    trigger: '#booking',
    start: 'top 70%',
    end:   'center center',
    onUpdate: (self) => {
      material.uniforms.uMorph3.value = self.progress;
    }
  });

  /* ─ Hero entrance ─ */
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.eyebrow', { opacity:1, y:0, duration:1, ease:'power3.out' })
    .to('.hero__word',  {
        y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: 'power3.out',
        onStart() { document.querySelectorAll('.hero__word').forEach(w => { w.style.opacity=0; w.style.transform='translateY(80px)'; }); }
      }, '-=0.4')
    .to('.hero__sub',   { opacity:1, y:0, duration:0.9, ease:'power3.out' }, '-=0.6')
    .to('.hero__cta',   { opacity:1, y:0, duration:0.9, ease:'power3.out' }, '-=0.6')
    .to('.chip',        { opacity:1, x:0, stagger:0.1, duration:0.8, ease:'power3.out' }, '-=0.4')
    .to('.hero__scroll-hint', { opacity:1, duration:0.6 }, '-=0.2');

  /* ─ Service cards ─ */
  ScrollTrigger.batch('.svc-card', {
    onEnter(els) {
      gsap.to(els, {
        opacity: 1, y: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out'
      });
    },
    start: 'top 88%'
  });

  /* ─ About stats counter ─ */
  ScrollTrigger.create({
    trigger: '.about__stats',
    start: 'top 80%',
    once: true,
    onEnter() {
      document.querySelectorAll('.stat__n').forEach(el => {
        const target = +el.dataset.target;
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString(); }
        });
      });
    }
  });

  /* ─ Process steps ─ */
  ScrollTrigger.batch('.process-step', {
    onEnter(els) {
      gsap.to(els, { opacity:1, y:0, stagger:0.12, duration:0.9, ease:'power3.out' });
    },
    start: 'top 88%'
  });

  /* ─ Testimonials ─ */
  ScrollTrigger.batch('.testi-card', {
    onEnter(els) {
      gsap.to(els, { opacity:1, y:0, stagger:0.15, duration:0.9, ease:'power3.out' });
    },
    start: 'top 85%'
  });

  /* ─ Section titles split reveal ─ */
  document.querySelectorAll('.section__title').forEach(el => {
    el.style.overflow = 'hidden';
    gsap.set(el, { opacity:0, y:40 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.to(el, { opacity:1, y:0, duration:1.1, ease:'power3.out' });
      }
    });
  });

  /* ─ Section labels ─ */
  document.querySelectorAll('.section__label').forEach(el => {
    gsap.set(el, { opacity:0, x:-20 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter() {
        gsap.to(el, { opacity:1, x:0, duration:0.7, ease:'power3.out' });
      }
    });
  });

  /* ─ About text ─ */
  document.querySelectorAll('.about__para').forEach((el, i) => {
    gsap.set(el, { opacity:0, y:30 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.to(el, { opacity:1, y:0, duration:0.9, ease:'power3.out', delay: i*0.1 });
      }
    });
  });

  /* ─ Booking title ─ */
  gsap.set('.booking__title', { opacity:0, y:50 });
  gsap.set('.booking__sub',   { opacity:0, y:30 });
  gsap.set('.booking__ctas',  { opacity:0, y:30 });
  ScrollTrigger.create({
    trigger: '.booking__content',
    start: 'top 70%',
    once: true,
    onEnter() {
      gsap.timeline()
        .to('.eyebrow', { opacity:1, y:0, duration:0.6 })
        .to('.booking__title', { opacity:1, y:0, duration:1, ease:'power3.out' }, '-=0.2')
        .to('.booking__sub',   { opacity:1, y:0, duration:0.8, ease:'power3.out' }, '-=0.5')
        .to('.booking__ctas',  { opacity:1, y:0, duration:0.8, ease:'power3.out' }, '-=0.4');
    }
  });

  ScrollTrigger.refresh();
}

/* ═══════════════════════════════════════════════════
   HEADER SCROLL BEHAVIOUR
   ═══════════════════════════════════════════════════ */

const header = document.getElementById('header');
lenis.on('scroll', ({ scroll }) => {
  if (scroll > 80) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

/* ═══════════════════════════════════════════════════
   CURSOR
   ═══════════════════════════════════════════════════ */

let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  targetMouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
  targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

document.querySelectorAll('a, button, .btn-primary, .btn-ghost, .svc-card, .g-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

function updateCursor() {
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';

  followerX += (cursorX - followerX) * 0.09;
  followerY += (cursorY - followerY) * 0.09;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
}

/* ═══════════════════════════════════════════════════
   RENDER LOOP
   ═══════════════════════════════════════════════════ */

const clock = new THREE.Clock();

function render() {
  requestAnimationFrame(render);

  const t = clock.getElapsedTime();
  material.uniforms.uTime.value = t;

  // Smooth mouse lerp → shader
  mouse.x += (targetMouse.x - mouse.x) * 0.03;
  mouse.y += (targetMouse.y - mouse.y) * 0.03;
  material.uniforms.uMouse.value.set(mouse.x * 0.15, -mouse.y * 0.15);

  // Slow particle system rotation
  particles.rotation.y = t * 0.04;
  particles.rotation.x = Math.sin(t * 0.03) * 0.06;

  updateCursor();
  renderer.render(scene, camera);
}

/* ═══════════════════════════════════════════════════
   RESIZE
   ═══════════════════════════════════════════════════ */

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
  ScrollTrigger.refresh();
});

/* ═══════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════ */

async function init() {
  // Start render loop immediately (particles visible in preloader)
  render();

  // Set initial word positions for GSAP
  document.querySelectorAll('.hero__word').forEach(w => {
    w.style.opacity   = '0';
    w.style.transform = 'translateY(80px)';
    w.style.display   = 'block';
  });

  await runPreloader();
  initScrollAnimations();
}

init();
