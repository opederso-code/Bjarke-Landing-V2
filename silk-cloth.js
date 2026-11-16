(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function init() {
    if (typeof THREE === 'undefined') return;

    const heroEl = document.querySelector('.hero');
    const silkEl = document.querySelector('.hero__silk');
    if (!heroEl || !silkEl) return;

    // Stop the CSS drift animation so the element sits at a stable position
    silkEl.style.animation = 'none';

    let SW = silkEl.offsetWidth;
    let SH = silkEl.offsetHeight;
    if (!SW || !SH) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(SW, SH);

    const cnv = renderer.domElement;
    // Insert canvas as first child of silkEl so it sits beneath the ::after overlay
    cnv.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:0;';
    silkEl.insertBefore(cnv, silkEl.firstChild);

    // ── Camera ────────────────────────────────────────────────────────────────
    const fov = 60;
    function camDist(h) { return h / (2 * Math.tan((fov * Math.PI) / 360)); }
    const camera = new THREE.PerspectiveCamera(fov, SW / SH, 1, camDist(SH) * 10);
    camera.position.z = camDist(SH);

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Cloth geometry ────────────────────────────────────────────────────────
    const SEGS_X = 80;
    const SEGS_Y = 52;
    const geo = new THREE.PlaneGeometry(SW, SH, SEGS_X, SEGS_Y);
    const posAttr = geo.attributes.position;
    const N = posAttr.count;
    const posArr = posAttr.array; // direct Float32Array — faster than getX/setZ

    // Cache vertex XY — these never change
    const vxArr = new Float32Array(N);
    const vyArr = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      vxArr[i] = posArr[i * 3];
      vyArr[i] = posArr[i * 3 + 1];
    }

    // Per-vertex spring state
    const velZ = new Float32Array(N);
    const curZ = new Float32Array(N);

    // ── Texture + material ────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/images/silk.webp', function (t) {
      // Simulate background-size: cover
      const imgAspect   = t.image.width / t.image.height;
      const planeAspect = SW / SH;
      if (imgAspect > planeAspect) {
        t.repeat.set(planeAspect / imgAspect, 1);
        t.offset.set((1 - planeAspect / imgAspect) / 2, 0);
      } else {
        t.repeat.set(1, imgAspect / planeAspect);
        t.offset.set(0, (1 - imgAspect / planeAspect) / 2);
      }
      t.needsUpdate = true;
      silkEl.style.backgroundImage = 'none';
    });
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;

    const mat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: tex } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vNorm;
        void main() {
          vUv         = uv;
          vNorm       = normalMatrix * normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        varying vec2 vUv;
        varying vec3 vNorm;
        void main() {
          vec3  albedo = texture2D(uMap, vUv).rgb;
          vec3  n      = normalize(vNorm);
          vec3  light  = normalize(vec3(0.5, 0.85, 1.0));
          vec3  view   = vec3(0.0, 0.0, 1.0);
          vec3  h      = normalize(light + view);
          float diff   = clamp(dot(n, light), 0.0, 1.0);
          float spec   = pow(clamp(dot(n, h), 0.0, 1.0), 22.0) * 0.48;
          vec3  warm   = vec3(0.914, 0.890, 0.839);
          vec3  col    = mix(albedo * (0.70 + diff * 0.30) + spec, warm, 0.18);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // ── Pointer tracking — coords relative to silkEl's actual bounds ──────────
    const ptr = { gx: 0, gy: 0, on: false };
    let ptrTimer;

    function onMove(cx, cy) {
      const r = silkEl.getBoundingClientRect();
      ptr.gx  = (cx - r.left) - SW / 2;
      ptr.gy  = -((cy - r.top) - SH / 2);
      ptr.on  = true;
      clearTimeout(ptrTimer);
      ptrTimer = setTimeout(function () { ptr.on = false; }, 200);
    }

    heroEl.addEventListener('mousemove',  function (e) { onMove(e.clientX, e.clientY); }, { passive: true });
    heroEl.addEventListener('touchmove',  function (e) { onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    heroEl.addEventListener('mouseleave', function ()  { ptr.on = false; }, { passive: true });

    // ── Spring constants ──────────────────────────────────────────────────────
    const R     = Math.min(SW, SH) * 0.12;
    const R2    = R * R;
    const DEPTH = 52;
    const STIFF = 0.065;
    const DAMP  = 0.87;

    // ── Render loop ───────────────────────────────────────────────────────────
    let maxVel = 0;

    function tick() {
      requestAnimationFrame(tick);

      if (!ptr.on && maxVel < 0.008) {
        renderer.render(scene, camera);
        return;
      }

      maxVel = 0;

      for (let i = 0; i < N; i++) {
        let target = 0;

        if (ptr.on) {
          const dx = vxArr[i] - ptr.gx;
          const dy = vyArr[i] - ptr.gy;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const t = 1.0 - Math.sqrt(d2) / R;
            target  = -DEPTH * t * t;
          }
        }

        const force = (target - curZ[i]) * STIFF;
        velZ[i]     = velZ[i] * DAMP + force;
        curZ[i]    += velZ[i];
        posArr[i * 3 + 2] = curZ[i];

        const av = Math.abs(velZ[i]);
        if (av > maxVel) maxVel = av;
      }

      posAttr.needsUpdate = true;
      geo.computeVertexNormals();
      renderer.render(scene, camera);
    }

    tick();

    // ── Resize ────────────────────────────────────────────────────────────────
    window.addEventListener('resize', function () {
      SW = silkEl.offsetWidth;
      SH = silkEl.offsetHeight;
      camera.aspect = SW / SH;
      camera.position.z = camDist(SH);
      camera.updateProjectionMatrix();
      renderer.setSize(SW, SH);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
