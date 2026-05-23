'use client';
import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animId;
    let cleanFn;

    const init = async () => {
      const THREE = await import('three');
      const canvas = canvasRef.current;
      if (!canvas) return;

      const scene = new THREE.Scene();
      const W = window.innerWidth, H = window.innerHeight;
      const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
      camera.position.set(0, 0, 7);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      /* ── Double Helix ─────────────────── */
      const HELIX = 9000;
      const positions = new Float32Array(HELIX * 3);
      const aColors  = new Float32Array(HELIX * 3);
      const aSizes   = new Float32Array(HELIX);

      const TURNS = 7, HEIGHT = 10;

      for (let i = 0; i < HELIX; i++) {
        const i3 = i * 3;
        const strand = i % 3; // 0=teal, 1=rust, 2=connector scatter
        const t = i / HELIX;
        const angle = t * Math.PI * 2 * TURNS + (strand === 1 ? Math.PI : 0);
        const y = (t - 0.5) * HEIGHT;
        const radius = 1.6 + Math.sin(t * Math.PI) * 0.3;

        if (strand < 2) {
          const noise = Math.pow(Math.random(), 2) * 0.18;
          const na = Math.random() * Math.PI * 2;
          positions[i3]     = Math.cos(angle) * radius + Math.cos(na) * noise;
          positions[i3 + 1] = y + (Math.random() - 0.5) * 0.07;
          positions[i3 + 2] = Math.sin(angle) * radius + Math.sin(na) * noise;
        } else {
          // cross-connector scatter
          const ct = t * TURNS - Math.floor(t * TURNS);
          const ca = t * Math.PI * 2 * TURNS;
          const lerp = Math.random();
          positions[i3]     = Math.cos(ca) * radius * lerp + Math.cos(ca + Math.PI) * radius * (1 - lerp);
          positions[i3 + 1] = y + (Math.random() - 0.5) * 0.12;
          positions[i3 + 2] = Math.sin(ca) * radius * lerp + Math.sin(ca + Math.PI) * radius * (1 - lerp);
        }

        // Colors
        if (strand === 0) {
          // Teal: #0FA4AF = 15,164,175
          aColors[i3]     = 0.059 + Math.random() * 0.06;
          aColors[i3 + 1] = 0.643 + Math.random() * 0.12;
          aColors[i3 + 2] = 0.686 + Math.random() * 0.1;
          aSizes[i] = Math.random() * 2.2 + 0.9;
        } else if (strand === 1) {
          // Rust: #964734 = 150,71,52
          aColors[i3]     = 0.588 + Math.random() * 0.1;
          aColors[i3 + 1] = 0.278 + Math.random() * 0.05;
          aColors[i3 + 2] = 0.204 + Math.random() * 0.05;
          aSizes[i] = Math.random() * 2.2 + 0.9;
        } else {
          // Pale teal connectors
          aColors[i3]     = 0.686;
          aColors[i3 + 1] = 0.867;
          aColors[i3 + 2] = 0.898;
          aSizes[i] = Math.random() * 0.8 + 0.3;
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('aColor',   new THREE.BufferAttribute(aColors,   3));
      geo.setAttribute('aSize',    new THREE.BufferAttribute(aSizes,    1));

      const mat = new THREE.ShaderMaterial({
        blending: THREE.AdditiveBlending,
        depthWrite: false, transparent: true,
        vertexShader: `
          attribute vec3  aColor;
          attribute float aSize;
          varying   vec3  vColor;
          void main() {
            vColor = aColor;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (310.0 / -mv.z);
            gl_Position  = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float a = 1.0 - smoothstep(0.05, 0.5, d);
            a = pow(a, 1.6) * 0.92;
            gl_FragColor = vec4(vColor, a);
          }
        `,
      });

      const helix = new THREE.Points(geo, mat);
      scene.add(helix);

      /* ── Floating energy field ────────── */
      const FLOAT = 1200;
      const fPos = new Float32Array(FLOAT * 3);
      for (let i = 0; i < FLOAT; i++) {
        const i3 = i * 3;
        const r = 3.5 + Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        fPos[i3]     = r * Math.cos(theta) * Math.cos(phi);
        fPos[i3 + 1] = r * Math.sin(phi) * 1.5;
        fPos[i3 + 2] = r * Math.sin(theta) * Math.cos(phi);
      }
      const fGeo = new THREE.BufferGeometry();
      fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
      const fMat = new THREE.PointsMaterial({
        color: 0x0FA4AF, size: 0.015,
        blending: THREE.AdditiveBlending,
        depthWrite: false, transparent: true, opacity: 0.4,
      });
      const floaters = new THREE.Points(fGeo, fMat);
      scene.add(floaters);

      /* ── Mouse / scroll ───────────────── */
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      let scrollY = 0;

      const onMouse  = (e) => {
        mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 0.5;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.3;
      };
      const onScroll = () => { scrollY = window.scrollY; };
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('mousemove', onMouse);
      window.addEventListener('scroll',    onScroll, { passive: true });
      window.addEventListener('resize',    onResize);

      /* ── Render loop ──────────────────── */
      const clock = new THREE.Clock();
      const tick = () => {
        const t = clock.getElapsedTime();
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;

        helix.rotation.y = t * 0.12;
        helix.rotation.x = mouse.y * 0.25 + Math.sin(t * 0.08) * 0.06;
        helix.rotation.z = mouse.x * 0.15;

        floaters.rotation.y = t * 0.05;
        floaters.rotation.x = t * 0.02;

        // Scroll: zoom out & tilt to reveal full helix
        const targetZ = 7 + scrollY * 0.004;
        const targetX = scrollY * 0.0003;
        camera.position.z += (targetZ - camera.position.z) * 0.05;
        camera.position.y += (targetX - camera.position.y) * 0.05;

        renderer.render(scene, camera);
        animId = requestAnimationFrame(tick);
      };
      tick();

      cleanFn = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', onMouse);
        window.removeEventListener('scroll',    onScroll);
        window.removeEventListener('resize',    onResize);
        geo.dispose(); mat.dispose();
        fGeo.dispose(); fMat.dispose();
        renderer.dispose();
      };
    };

    init();
    return () => { if (cleanFn) cleanFn(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}
