/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: 3D Celestial Solar System with 10 Bespoke Worlds & Hierarchical Moons
 * Stack: Three.js WebGL · Parametric Orbital Physics · React-Bits Cosmic Dust
 * Authorities: ui-ux-pro-max-skill · impeccable (Experience Mode) · threejs · ponytail
 * ============================================================================
 */

(function () {
  'use strict';

  const canvasBack = document.getElementById('celestial-3d-canvas-back');
  const canvasFront = document.getElementById('celestial-3d-canvas-front');
  const section = document.getElementById('architecture');

  if (!canvasBack || !section || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scene & Camera Configuration: Locked Horizon (Zero Wobble Law)
  const sceneBack = new THREE.Scene();
  const sceneFront = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  
  function getResponsiveCameraZ() {
    const w = window.innerWidth;
    if (w < 480) return 17.5;
    if (w < 768) return 14.5;
    if (w < 1180) return 12.0;
    return 10.2;
  }
  
  camera.position.set(0, 0, getResponsiveCameraZ());
  camera.lookAt(0, 0, 0);

  // Dual WebGL Renderers for True 3D Depth Occlusion
  const rendererBack = new THREE.WebGLRenderer({
    canvas: canvasBack,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  rendererBack.setSize(window.innerWidth, window.innerHeight);
  rendererBack.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  rendererBack.outputColorSpace = THREE.SRGBColorSpace;

  let rendererFront = null;
  if (canvasFront) {
    rendererFront = new THREE.WebGLRenderer({
      canvas: canvasFront,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererFront.setSize(window.innerWidth, window.innerHeight);
    rendererFront.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererFront.outputColorSpace = THREE.SRGBColorSpace;
  }

  // Dual-Scene Balanced Illumination
  const ambLightBack = new THREE.AmbientLight(0xffffff, 1.4);
  sceneBack.add(ambLightBack);
  const dirLightBack = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLightBack.position.set(5, 12, 8);
  sceneBack.add(dirLightBack);

  const ambLightFront = new THREE.AmbientLight(0xffffff, 1.4);
  sceneFront.add(ambLightFront);
  const dirLightFront = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLightFront.position.set(5, 12, 8);
  sceneFront.add(dirLightFront);

  let isSceneActive = true;
  let animFrameId = null;
  let hoveredPlanetId = null;

  const TILT_X = 0.48; // Orbital plane base inclination angle (27.5 degrees)

  // ──────────────────────────────────────────────────────────────────────────
  // 1. TEN BESPOKE WORLDS DOSSIER (Keplerian Orbital Dynamics & Bilingual Data)
  // ──────────────────────────────────────────────────────────────────────────
  const WORLDS_DATA = [
    {
      id: '1',
      worldKey: 'TERRA',
      color: 0x38bdf8,
      hex: '#38bdf8',
      nameEn: 'Full-Stack Web & SaaS Platforms',
      nameId: 'Platform Web & SaaS Full-Stack',
      kickerEn: 'WORLD // 01 · SAAS',
      kickerId: 'DUNIA // 01 · SAAS',
      statusEn: 'PRODUCTION VERIFIED',
      statusId: 'TERVERIFIKASI PRODUKSI',
      descEn: 'Multi-tenant web architectures engineered with Next.js App Router, TypeScript, and relational databases. Incorporates defensive data hydration, strict tenant isolation, and zero-downtime blue/green rollouts.',
      descId: 'Arsitektur web multi-tenant yang direkayasa dengan Next.js App Router, TypeScript, dan database relasional. Dilengkapi pertahanan hidrasi data, isolasi tenant yang ketat, dan rilis blue/green tanpa downtime.',
      stack: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Prisma ORM', 'Tailwind CSS', 'Docker'],
      a: 3.6,
      e: 0.08,
      omega: 0.35,
      incX: 0.02,
      incY: 0.04,
      speed: 0.351, // 2.4 / (3.6 ^ 1.5)
      phase: 0.15,
      yBase: 0.06,
      size: 0.28,
      trackOpacity: 0.28
    },
    {
      id: '2',
      worldKey: 'INFERNO',
      color: 0xef4444,
      hex: '#ef4444',
      nameEn: 'Low-Level Linux Systems & Sockets',
      nameId: 'Sistem Linux Tingkat Rendah & Socket',
      kickerEn: 'WORLD // 02 · KERNEL',
      kickerId: 'DUNIA // 02 · KERNEL',
      statusEn: 'HIGH PERFORMANCE',
      statusId: 'PERFORMA TINGGI',
      descEn: 'Root-level infrastructure and hardware-adjacent networking. Hands-on mastery of Linux systemd units, MikroTik routers, reverse proxy routing, and memory-safe daemon services.',
      descId: 'Infrastruktur tingkat root dan rekayasa jaringan perangkat keras. Penguasaan unit systemd Linux, router MikroTik, routing reverse proxy Caddy, dan layanan daemon hemat memori.',
      stack: ['Ubuntu Server', 'systemd', 'Caddy Reverse Proxy', 'MikroTik RouterOS', 'Bash Scripting', 'TCP/IP Sockets'],
      a: 4.4,
      e: 0.14,
      omega: 1.25,
      incX: -0.04,
      incY: -0.05,
      speed: 0.260, // 2.4 / (4.4 ^ 1.5)
      phase: 0.85,
      yBase: 0.10,
      size: 0.30,
      trackOpacity: 0.24
    },
    {
      id: '3',
      worldKey: 'TOON',
      color: 0xfbbf24,
      hex: '#fbbf24',
      nameEn: 'Human-Centered UX & Motion Systems',
      nameId: 'UX Berpusat pada Manusia & Animasi',
      kickerEn: 'WORLD // 03 · INTERACTION',
      kickerId: 'DUNIA // 03 · INTERAKSI',
      statusEn: 'HIGH CRAFT STANDARD',
      statusId: 'STANDAR KREATIF TINGGI',
      descEn: 'Tactile, playful, and responsive user experiences built with sovereign typography, zero-emoji vector laws, GSAP timelines, and accessible kinetic feedback.',
      descId: 'Pengalaman pengguna yang taktil, responsif, dan menyenangkan dengan tipografi berdaulat, aturan bebas emoji, timeline GSAP, dan umpan balik kinetik yang aksesibel.',
      stack: ['GSAP ScrollTrigger', 'CSS Kinetic Tokens', 'Fraunces & Inter', 'Font Awesome Pro', 'Web Accessibility (a11y)'],
      a: 5.2,
      e: 0.07,
      omega: 2.10,
      incX: 0.03,
      incY: 0.05,
      speed: 0.202, // 2.4 / (5.2 ^ 1.5)
      phase: 1.55,
      yBase: -0.06,
      size: 0.32,
      trackOpacity: 0.25
    },
    {
      id: '4',
      worldKey: 'PRISM',
      color: 0x06b6d4,
      hex: '#06b6d4',
      nameEn: 'Real-Time 3D, WebGL & Shader Labs',
      nameId: '3D Real-Time, WebGL & Shader Labs',
      kickerEn: 'WORLD // 04 · WEBGL',
      kickerId: 'DUNIA // 04 · WEBGL',
      statusEn: 'GPU ACCELERATED',
      statusId: 'AKSELERASI GPU',
      descEn: 'Interactive 3D viewports, custom Three.js geometries, PBR material lighting, and Rapier physics bridges engineered with zero GPU memory leaks and IntersectionObserver pausing.',
      descId: 'Viewport 3D interaktif, geometri Three.js kustom, pencahayaan material PBR, dan integrasi fisika Rapier tanpa kebocoran memori GPU serta jeda otomatis IntersectionObserver.',
      stack: ['Three.js', 'GLSL Custom Shaders', 'Spline 3D Runtime', 'Rapier Physics 3D', 'WebGL/WebGPU Pipelines'],
      a: 6.0,
      e: 0.12,
      omega: 3.14,
      incX: -0.02,
      incY: -0.04,
      speed: 0.163, // 2.4 / (6.0 ^ 1.5)
      phase: 2.25,
      yBase: 0.08,
      size: 0.28,
      trackOpacity: 0.23
    },
    {
      id: '5',
      worldKey: 'COLOSSUS',
      color: 0xd97706,
      hex: '#d97706',
      nameEn: 'Distributed Cloud Infrastructure & DevOps',
      nameId: 'Infrastruktur Cloud Terdistribusi & DevOps',
      kickerEn: 'WORLD // 05 · DEVOPS',
      kickerId: 'DUNIA // 05 · DEVOPS',
      statusEn: '99.9% UPTIME ARCHITECTURE',
      statusId: 'ARSITEKTUR UPTIME 99.9%',
      descEn: 'Containerized orchestration with Docker Compose, automated health monitors, cron schedulers, blue/green migration playbooks, and disaster recovery snapshots.',
      descId: 'Orkestrasi kontainer dengan Docker Compose, monitor kesehatan otomatis, penjadwal cron, panduan migrasi blue/green, dan snapshot pemulihan bencana berkala.',
      stack: ['Docker Compose', 'VPS Bare-Metal', 'Automated Health Watchdogs', 'Blue/Green Deployer', 'Disaster Recovery (DR)'],
      a: 8.0,
      e: 0.06,
      omega: 4.20,
      incX: 0.01,
      incY: 0.02,
      speed: 0.106, // 2.4 / (8.0 ^ 1.5)
      phase: 2.95,
      yBase: -0.10,
      size: 0.40,
      trackOpacity: 0.24
    },
    {
      id: '6',
      worldKey: 'GLACIAL',
      color: 0x38bdf8,
      hex: '#38bdf8',
      nameEn: 'Security Hardening & Zero-Trust Defense',
      nameId: 'Pengerasan Keamanan & Pertahanan Zero-Trust',
      kickerEn: 'WORLD // 06 · SECURITY',
      kickerId: 'DUNIA // 06 · KEAMANAN',
      statusEn: 'IMMUTABLE HARBOR',
      statusId: 'BENTENG IMUTABEL',
      descEn: 'Multi-layer cybersecurity defense: JWT authentication with bcrypt salting, rate-limiting shields, SQL injection immunity via Prisma prepared statements, and payload sanitization.',
      descId: 'Pertahanan siber berlapis: otentikasi JWT dengan salt bcrypt, pembatas laju (rate limiting), imun terhadap injeksi SQL lewat prepared statement Prisma, dan sanitasi muatan data.',
      stack: ['JWT Token Defense', 'bcrypt Salting', 'OWASP Top 10 Mitigation', 'SQL Injection Immunity', 'Fail-Closed API Security'],
      a: 9.0,
      e: 0.10,
      omega: 5.15,
      incX: -0.03,
      incY: -0.05,
      speed: 0.089, // 2.4 / (9.0 ^ 1.5)
      phase: 3.65,
      yBase: 0.11,
      size: 0.28,
      trackOpacity: 0.22
    },
    {
      id: '7',
      worldKey: 'DYNAMO',
      color: 0xf59e0b,
      hex: '#f59e0b',
      nameEn: 'Conversational AI & WhatsApp Systems',
      nameId: 'Sistem AI Percakapan & WhatsApp',
      kickerEn: 'WORLD // 07 · AI AGENTS',
      kickerId: 'DUNIA // 07 · AGEN AI',
      statusEn: 'AUTONOMOUS CLOSER',
      statusId: 'CLOSER OTONOM',
      descEn: 'Multi-turn conversational AI workflows, ledger-derived forever customer dossiers, cache-first prompt engineering, and Evolution API WhatsApp anti-ban Stealth Shield.',
      descId: 'Alur kerja AI percakapan multi-turn, memori pelanggan jangka panjang berbasis ledger, teknik prompt hemat token, dan Stealth Shield anti-ban WhatsApp Evolution API.',
      stack: ['Evolution API v2', 'DeepSeek LLM APIs', 'Stealth Shield Anti-Ban', 'Customer Dossier Memory', 'Webhooks Engine'],
      a: 10.1,
      e: 0.15,
      omega: 0.95,
      incX: 0.04,
      incY: 0.06,
      speed: 0.075, // 2.4 / (10.1 ^ 1.5)
      phase: 4.35,
      yBase: -0.08,
      size: 0.30,
      trackOpacity: 0.24
    },
    {
      id: '8',
      worldKey: 'VERDANT',
      color: 0x10b981,
      hex: '#10b981',
      nameEn: 'Spatial WebGIS, GeoJSON & Mapping Pipelines',
      nameId: 'WebGIS Spasial, GeoJSON & Saluran Peta',
      kickerEn: 'WORLD // 08 · WEBGIS',
      kickerId: 'DUNIA // 08 · WEBGIS',
      statusEn: 'GEOSPATIAL VERIFIED',
      statusId: 'TERVERIFIKASI SPASIAL',
      descEn: 'Interactive geospatial pipelines mapping territorial zoning, polygon calculation, Leaflet/Mapbox integrations, and spatial relational data algorithms.',
      descId: 'Saluran data geospasial interaktif yang memetakan zonasi wilayah, kalkulasi poligon, integrasi Leaflet/Mapbox, dan algoritma relasional data spasial.',
      stack: ['Spatial GeoJSON', 'Leaflet.js', 'Turf.js Algorithms', 'PostGIS Geometries', 'Choropleth Visualizers'],
      a: 11.2,
      e: 0.08,
      omega: 2.45,
      incX: -0.02,
      incY: -0.03,
      speed: 0.064, // 2.4 / (11.2 ^ 1.5)
      phase: 5.05,
      yBase: 0.09,
      size: 0.29,
      trackOpacity: 0.21
    },
    {
      id: '9',
      worldKey: 'VOID',
      color: 0x818cf8,
      hex: '#818cf8',
      nameEn: 'Database Architecture & Cache Engineering',
      nameId: 'Arsitektur Database & Rekayasa Cache',
      kickerEn: 'WORLD // 09 · DATABASE',
      kickerId: 'DUNIA // 09 · DATABASE',
      statusEn: 'ATOMIC CONCURRENCY',
      statusId: 'KONKURENSI ATOMIK',
      descEn: 'Relational data modeling, schema indexing, foreign key integrity constraints, optimistic concurrency locks, and in-memory Redis caching layers.',
      descId: 'Pemodelan data relasional, pengindeksan skema, batasan integritas foreign key, penguncian konkurensi optimis, dan lapisan caching Redis in-memory.',
      stack: ['PostgreSQL 16', 'Redis Caching', 'Prisma Schema Migrations', 'Composite Indexes', 'ACID Transactions'],
      a: 12.3,
      e: 0.13,
      omega: 3.80,
      incX: 0.03,
      incY: 0.05,
      speed: 0.056, // 2.4 / (12.3 ^ 1.5)
      phase: 5.75,
      yBase: -0.12,
      size: 0.28,
      trackOpacity: 0.20
    },
    {
      id: '10',
      worldKey: 'ARCOLOGY',
      color: 0xec4899,
      hex: '#ec4899',
      nameEn: 'Modular Payments & Idempotent Commerce',
      nameId: 'Sistem Pembayaran Modular & FinTech',
      kickerEn: 'WORLD // 10 · FINTECH',
      kickerId: 'DUNIA // 10 · FINTECH',
      statusEn: 'IDEMPOTENT CERTIFIED',
      statusId: 'TERSERTIFIKASI IDEMPOTEN',
      descEn: 'FinTech payment integrations with Midtrans Snap (Cards, QRIS, Virtual Accounts) and international Stripe BYO-keys. Idempotent webhook verification and tamper-proof invoices.',
      descId: 'Integrasi gerbang pembayaran FinTech dengan Midtrans Snap (Kartu, QRIS, Virtual Account) dan Stripe BYO-keys internasional. Verifikasi webhook yang sepenuhnya idempoten.',
      stack: ['Midtrans Snap SDK', 'Stripe API v2024', 'QRIS Dinamis', 'Bank Virtual Accounts', 'Signed Invoice Tokens'],
      a: 13.5,
      e: 0.09,
      omega: 5.30,
      incX: -0.02,
      incY: -0.04,
      speed: 0.048, // 2.4 / (13.5 ^ 1.5)
      phase: 0.45,
      yBase: 0.07,
      size: 0.29,
      trackOpacity: 0.19
    }
  ];

  // Precompute Keplerian orbital constants for every world
  WORLDS_DATA.forEach((w) => {
    const e = w.e || 0.08;
    w.sqrt1MinusE2 = Math.sqrt(Math.max(0.01, 1 - e * e));
    w.b = w.a * w.sqrt1MinusE2;
    w.c = w.a * e;
    w.cosOmega = Math.cos(w.omega || 0);
    w.sinOmega = Math.sin(w.omega || 0);
    w.cosIncY = Math.cos(w.incY || 0);
    w.sinIncY = Math.sin(w.incY || 0);
    w.cosTiltX = Math.cos(TILT_X + (w.incX || 0));
    w.sinTiltX = Math.sin(TILT_X + (w.incX || 0));
  });

  // Calculate 3D Keplerian coordinates with primary robot digital twin situated at the ellipse focus (0, 0, 0)
  function getKeplerianOrbitalCoords(cfg, theta) {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    // Elliptical coordinates with focus at origin (0, 0, 0)
    const x0 = cosT * cfg.a - cfg.c;
    const z0 = sinT * cfg.b;
    const y0 = cfg.yBase || 0;

    // Rotate in orbital plane by argument of periapsis omega
    const x1 = x0 * cfg.cosOmega - z0 * cfg.sinOmega;
    const z1 = x0 * cfg.sinOmega + z0 * cfg.cosOmega;

    // Rotate around Y by individual yaw inclination incY
    const x2 = x1 * cfg.cosIncY + z1 * cfg.sinIncY;
    const z2 = -x1 * cfg.sinIncY + z1 * cfg.cosIncY;

    // Rotate around X by overall orbital inclination (TILT_X + incX)
    const x = x2;
    const y = y0 * cfg.cosTiltX - z2 * cfg.sinTiltX;
    const z = y0 * cfg.sinTiltX + z2 * cfg.cosTiltX;

    return new THREE.Vector3(x, y, z);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 1B. 3D KEPLERIAN ORBIT TRACKS (Dual True 3D Layering: Back & Front)
  // ──────────────────────────────────────────────────────────────────────────
  const celestialTracksBack = new THREE.Group();
  sceneBack.add(celestialTracksBack);

  const celestialTracksFront = new THREE.Group();
  sceneFront.add(celestialTracksFront);

  // Helper: Find exact zero-crossing angles where orbit intersects the robot plane (z = 0)
  function getOrbitalZeroCrossings(cfg) {
    const STEPS = 72;
    let prevTheta = 0;
    let prevZ = getKeplerianOrbitalCoords(cfg, 0).z;
    let thetaRise = null;
    let thetaFall = null;

    for (let i = 1; i <= STEPS; i++) {
      const curTheta = (i / STEPS) * Math.PI * 2;
      const curZ = getKeplerianOrbitalCoords(cfg, curTheta).z;

      if (prevZ <= 0 && curZ > 0 && thetaRise === null) {
        let lo = prevTheta, hi = curTheta;
        for (let iter = 0; iter < 12; iter++) {
          const mid = (lo + hi) * 0.5;
          if (getKeplerianOrbitalCoords(cfg, mid).z > 0) hi = mid;
          else lo = mid;
        }
        thetaRise = (lo + hi) * 0.5;
      } else if (prevZ >= 0 && curZ < 0 && thetaFall === null) {
        let lo = prevTheta, hi = curTheta;
        for (let iter = 0; iter < 12; iter++) {
          const mid = (lo + hi) * 0.5;
          if (getKeplerianOrbitalCoords(cfg, mid).z < 0) hi = mid;
          else lo = mid;
        }
        thetaFall = (lo + hi) * 0.5;
      }

      prevTheta = curTheta;
      prevZ = curZ;
    }

    if (thetaRise === null) thetaRise = 0;
    if (thetaFall === null) thetaFall = Math.PI;

    return { thetaRise, thetaFall };
  }

  // Helper: Create split Keplerian elliptical orbit tracks (Front arc in front of robot, Back arc behind)
  function createSplitKeplerianOrbitTracks(cfg) {
    const { thetaRise, thetaFall } = getOrbitalZeroCrossings(cfg);
    const SEGMENTS = 72;

    // Front arc: from thetaRise to thetaFall (where z >= 0)
    let frontSpan = thetaFall - thetaRise;
    if (frontSpan <= 0) frontSpan += Math.PI * 2;

    const frontPoints = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const th = thetaRise + (i / SEGMENTS) * frontSpan;
      frontPoints.push(getKeplerianOrbitalCoords(cfg, th));
    }

    const frontGeo = new THREE.BufferGeometry().setFromPoints(frontPoints);
    const frontMat = new THREE.LineDashedMaterial({
      color: cfg.color,
      transparent: true,
      opacity: cfg.trackOpacity || 0.22,
      dashSize: 0.22,
      gapSize: 0.16,
      blending: THREE.AdditiveBlending
    });
    const frontLine = new THREE.Line(frontGeo, frontMat);
    frontLine.computeLineDistances();
    celestialTracksFront.add(frontLine);

    // Back arc: from thetaFall to thetaRise (where z <= 0)
    let backSpan = thetaRise - thetaFall;
    if (backSpan <= 0) backSpan += Math.PI * 2;

    const backPoints = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const th = thetaFall + (i / SEGMENTS) * backSpan;
      backPoints.push(getKeplerianOrbitalCoords(cfg, th));
    }

    const backGeo = new THREE.BufferGeometry().setFromPoints(backPoints);
    const backMat = new THREE.LineDashedMaterial({
      color: cfg.color,
      transparent: true,
      opacity: (cfg.trackOpacity || 0.22) * 0.85,
      dashSize: 0.22,
      gapSize: 0.16,
      blending: THREE.AdditiveBlending
    });
    const backLine = new THREE.Line(backGeo, backMat);
    backLine.computeLineDistances();
    celestialTracksBack.add(backLine);
  }

  // Generate 10 Keplerian Orbit Track Rings matching the exact world paths
  WORLDS_DATA.forEach((cfg) => {
    createSplitKeplerianOrbitTracks(cfg);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 2. COSMIC DUST & DEEP SPACE GALAXY PARTICLES (React-Bits Galaxy Inspiration)
  // ──────────────────────────────────────────────────────────────────────────
  const particleCount = 260;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const cyanCol = new THREE.Color(0x38bdf8);
  const violetCol = new THREE.Color(0xc084fc);
  const emeraldCol = new THREE.Color(0x34d399);
  const amberCol = new THREE.Color(0xfbbf24);

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 2.6 + Math.random() * 7.2;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r * 0.46;
    const y = (Math.random() - 0.5) * 3.6;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    const rand = Math.random();
    const col = rand < 0.35 ? cyanCol : rand < 0.65 ? violetCol : rand < 0.85 ? emeraldCol : amberCol;
    particleColors[i * 3] = col.r;
    particleColors[i * 3 + 1] = col.g;
    particleColors[i * 3 + 2] = col.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const particleField = new THREE.Points(particleGeo, particleMat);
  celestialTracksBack.add(particleField);

  // ──────────────────────────────────────────────────────────────────────────
  // 3. COSMIC SPACE NEBULA CLOUD AT ROBOT BASE (Dark Astronomy Glow)
  // ──────────────────────────────────────────────────────────────────────────
  const nebulaParticleCount = 160;
  const nebulaGeo = new THREE.BufferGeometry();
  const nebulaPositions = new Float32Array(nebulaParticleCount * 3);
  const nebulaColors = new Float32Array(nebulaParticleCount * 3);

  const deepNavyCol = new THREE.Color(0x0f172a);
  const cosmicCyanCol = new THREE.Color(0x0284c7);
  const cosmicIndigoCol = new THREE.Color(0x4338ca);

  for (let i = 0; i < nebulaParticleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 2.8;
    const x = Math.cos(angle) * r;
    const y = -1.2 - Math.random() * 1.3;
    const z = Math.sin(angle) * r * 0.55;

    nebulaPositions[i * 3] = x;
    nebulaPositions[i * 3 + 1] = y;
    nebulaPositions[i * 3 + 2] = z;

    const rand = Math.random();
    const col = rand < 0.5 ? cosmicCyanCol : rand < 0.85 ? cosmicIndigoCol : deepNavyCol;
    nebulaColors[i * 3] = col.r;
    nebulaColors[i * 3 + 1] = col.g;
    nebulaColors[i * 3 + 2] = col.b;
  }

  nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
  nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

  const nebulaMat = new THREE.PointsMaterial({
    size: 0.24,
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });

  const nebulaCloud = new THREE.Points(nebulaGeo, nebulaMat);
  nebulaCloud.position.set(0, 0, 0);
  sceneBack.add(nebulaCloud);

  // ──────────────────────────────────────────────────────────────────────────
  // 3B. CENTRAL SOLAR CORONA RADIANT AURA (Behind 3D Robot Digital Twin)
  // Procedural gradient canvas texture (0 KB external download, Ponytail law)
  // ──────────────────────────────────────────────────────────────────────────
  const coronaCanvas = document.createElement('canvas');
  coronaCanvas.width = 256;
  coronaCanvas.height = 256;
  const coronaCtx = coronaCanvas.getContext('2d');
  const coronaGrad = coronaCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
  coronaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
  coronaGrad.addColorStop(0.25, 'rgba(251, 191, 36, 0.28)');
  coronaGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.10)');
  coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  coronaCtx.fillStyle = coronaGrad;
  coronaCtx.fillRect(0, 0, 256, 256);

  const coronaTex = new THREE.CanvasTexture(coronaCanvas);
  const coronaGeo = new THREE.PlaneGeometry(3.8, 3.8);
  const coronaMat = new THREE.MeshBasicMaterial({
    map: coronaTex,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const solarCorona = new THREE.Mesh(coronaGeo, coronaMat);
  solarCorona.position.set(0, 0, -0.22);
  sceneBack.add(solarCorona);

  // ──────────────────────────────────────────────────────────────────────────
  // 3C. DUAL-CANVAS INSTANCED ASTEROID BELT (800 Stones, True 3D Layering)
  // Synthesized from Aditya-567/3D-Planets with Ponytail Anti-Bloat Law
  // ──────────────────────────────────────────────────────────────────────────
  const ASTEROID_COUNT = 800;
  const asteroidGeo = new THREE.DodecahedronGeometry(0.038, 0);
  const asteroidMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.82,
    metalness: 0.18
  });

  const asteroidBeltBack = new THREE.InstancedMesh(asteroidGeo, asteroidMat, ASTEROID_COUNT);
  asteroidBeltBack.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  sceneBack.add(asteroidBeltBack);

  const asteroidBeltFront = new THREE.InstancedMesh(asteroidGeo, asteroidMat, ASTEROID_COUNT);
  asteroidBeltFront.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  sceneFront.add(asteroidBeltFront);

  const asteroidData = [];
  const dummyMatrix = new THREE.Object3D();
  const dummyHiddenMatrix = new THREE.Matrix4().makeScale(0, 0, 0);

  for (let i = 0; i < ASTEROID_COUNT; i++) {
    // Semi-major axis in asteroid belt region between Prism (6.0) and Colossus (8.0)
    const a = 6.6 + Math.random() * 1.15;
    // Keplerian orbital eccentricity: 0.04 to 0.14
    const e = 0.04 + Math.random() * 0.10;
    // Argument of periapsis (random orientation in orbital plane)
    const omega = Math.random() * Math.PI * 2;
    // Slight inclination pitch jitter around TILT_X (-0.04 to +0.04 rad)
    const incX = (Math.random() - 0.5) * 0.08;
    // Slight inclination yaw jitter (-0.05 to +0.05 rad)
    const incY = (Math.random() - 0.5) * 0.10;
    // Vertical Gaussian-like dispersion for true 3D toroidal belt thickness
    const yOffset = (Math.random() + Math.random() + Math.random() - 1.5) * 0.24;
    // Keplerian speed proportional to a^-1.5
    const speed = (2.4 / Math.pow(a, 1.5)) * (0.92 + Math.random() * 0.16);
    const phase = Math.random() * Math.PI * 2;
    const scale = 0.45 + Math.random() * 0.85;
    const rotX = (Math.random() - 0.5) * 2;
    const rotY = (Math.random() - 0.5) * 2;

    const sqrt1MinusE2 = Math.sqrt(Math.max(0.01, 1 - e * e));
    const b = a * sqrt1MinusE2;
    const c = a * e;
    const cosOmega = Math.cos(omega);
    const sinOmega = Math.sin(omega);
    const cosIncY = Math.cos(incY);
    const sinIncY = Math.sin(incY);
    const cosTiltX = Math.cos(TILT_X + incX);
    const sinTiltX = Math.sin(TILT_X + incX);

    asteroidData.push({
      a, b, c, e, omega, incX, incY, yOffset, speed, phase, scale, rotX, rotY,
      cosOmega, sinOmega, cosIncY, sinIncY, cosTiltX, sinTiltX
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. MESH GENERATORS FOR 10 UNIQUE WORLDS & HIERARCHICAL MOONS
  // ──────────────────────────────────────────────────────────────────────────
  const planets = [];
  const clickableHitMeshes = [];

  // Helper: Delicate circular orbit path ring for planetary moons (Aditya 3D Planets synthesis)
  function createMoonOrbitRing(radius, color = 0x38bdf8, opacity = 0.22) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(48);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Line(geo, mat);
    ring.rotation.x = -Math.PI / 2; // Flat on equatorial orbital plane
    return ring;
  }

  // Helper: Procedural Atmospheric Fresnel Rim Glow Shader (Aditya-567 3D Planets synthesis)
  function createAtmosphereShader(colorHex, intensity = 1.1, power = 2.4) {
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uPower;
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, -vPositionNormal)), uPower);
        gl_FragColor = vec4(uColor, fresnel * uIntensity);
      }
    `;
    return new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(colorHex) },
        uIntensity: { value: intensity },
        uPower: { value: power }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
  }

  WORLDS_DATA.forEach((cfg) => {
    const planetGroup = new THREE.Group();

    // Secondary animated groups
    const dynamicRotators = [];

    // Invisible Hit Target Sphere for Forgiving Raycast Pointer Clicks
    const hitGeo = new THREE.SphereGeometry(Math.max(cfg.size * 2.2, 0.52), 16, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.userData = { planetId: cfg.id };
    planetGroup.add(hitMesh);
    clickableHitMeshes.push(hitMesh);

    // BESPOKE WORLD VISUAL SHAPING:
    let coreMesh;
    let haloMesh;

    switch (cfg.id) {
      // WORLD 01: TERRA (Earth & Luna & Sub-Satellite)
      case '1': {
        const sphereGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0x1d4ed8,
          roughness: 0.5,
          metalness: 0.2
        });
        coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
        planetGroup.add(coreMesh);

        // Continental Green Clusters Overlay
        const landGeo = new THREE.IcosahedronGeometry(cfg.size * 1.01, 2);
        const landMat = new THREE.MeshBasicMaterial({
          color: 0x10b981,
          wireframe: true,
          transparent: true,
          opacity: 0.55
        });
        const landMesh = new THREE.Mesh(landGeo, landMat);
        planetGroup.add(landMesh);
        dynamicRotators.push({ obj: landMesh, speedX: 0.1, speedY: 0.3 });

        // Atmosphere Halo
        const haloGeo = new THREE.SphereGeometry(cfg.size * 1.35, 24, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending
        });
        haloMesh = new THREE.Mesh(haloGeo, haloMat);
        planetGroup.add(haloMesh);

        // Moon Orbit Track Rings (Aditya 3D Planets Feature)
        planetGroup.add(createMoonOrbitRing(0.65, 0x38bdf8, 0.25));

        // Moon System: Luna
        const lunaOrbitGroup = new THREE.Group();
        planetGroup.add(lunaOrbitGroup);
        const lunaMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 })
        );
        lunaMesh.position.set(0.65, 0.1, 0);
        lunaOrbitGroup.add(lunaMesh);
        dynamicRotators.push({ obj: lunaOrbitGroup, speedY: 1.8 });

        // Sub-Moon Orbit Track Ring
        lunaMesh.add(createMoonOrbitRing(0.18, 0xfacc15, 0.35));

        // Sub-Moon System: Orbiter Alpha orbiting Luna ("one orbiting another")
        const subOrbitGroup = new THREE.Group();
        lunaMesh.add(subOrbitGroup);
        const subMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.035, 0.035, 0.035),
          new THREE.MeshBasicMaterial({ color: 0xfacc15 })
        );
        subMesh.position.set(0.18, 0, 0);
        subOrbitGroup.add(subMesh);
        dynamicRotators.push({ obj: subOrbitGroup, speedY: 4.5 });
        break;
      }

      // WORLD 02: INFERNO (Volcanic Lava World with Ember Moon)
      case '2': {
        const sphereGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0x450a0a,
          roughness: 0.85,
          metalness: 0.15
        });
        coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
        planetGroup.add(coreMesh);

        // Magma Fissures
        const lavaGeo = new THREE.IcosahedronGeometry(cfg.size * 1.02, 2);
        const lavaMat = new THREE.MeshBasicMaterial({
          color: 0xf97316,
          wireframe: true,
          blending: THREE.AdditiveBlending
        });
        const lavaMesh = new THREE.Mesh(lavaGeo, lavaMat);
        planetGroup.add(lavaMesh);
        dynamicRotators.push({ obj: lavaMesh, speedY: -0.4 });

        // Heat Corona Halo
        const haloGeo = new THREE.SphereGeometry(cfg.size * 1.4, 24, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xdc2626,
          transparent: true,
          opacity: 0.40,
          blending: THREE.AdditiveBlending
        });
        haloMesh = new THREE.Mesh(haloGeo, haloMat);
        planetGroup.add(haloMesh);

        // Moon Orbit Track Ring
        planetGroup.add(createMoonOrbitRing(0.62, 0xef4444, 0.25));

        // Moon: Pyre
        const pyreGroup = new THREE.Group();
        planetGroup.add(pyreGroup);
        const pyreMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
        );
        pyreMesh.position.set(0.62, -0.08, 0);
        pyreGroup.add(pyreMesh);
        dynamicRotators.push({ obj: pyreGroup, speedY: 2.1 });

        // Sub-Moon Orbit Track Ring
        pyreMesh.add(createMoonOrbitRing(0.17, 0xfbbf24, 0.35));

        // Sub-Moon: Brimstone spark orbiting Pyre
        const brimstoneGroup = new THREE.Group();
        pyreMesh.add(brimstoneGroup);
        const brimstoneMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
        );
        brimstoneMesh.position.set(0.17, 0, 0);
        brimstoneGroup.add(brimstoneMesh);
        dynamicRotators.push({ obj: brimstoneGroup, speedY: 5.2 });
        break;
      }

      // WORLD 03: TOON (Cel-Shaded Cartoonish Toy Planet)
      case '3': {
        const sphereGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
        const sphereMat = new THREE.MeshToonMaterial({
          color: 0xfbbf24
        });
        coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
        planetGroup.add(coreMesh);

        // Cartoon Torus Ring
        const ringGeo = new THREE.TorusGeometry(cfg.size * 1.45, 0.035, 12, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 3;
        planetGroup.add(ringMesh);
        dynamicRotators.push({ obj: ringMesh, speedZ: 0.8 });

        // Moon Orbit Track Ring
        planetGroup.add(createMoonOrbitRing(0.68, 0x34d399, 0.25));

        // Moon: Blobby (Mint cartoon sphere)
        const blobbyGroup = new THREE.Group();
        planetGroup.add(blobbyGroup);
        const blobbyMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 16, 16),
          new THREE.MeshToonMaterial({ color: 0x34d399 })
        );
        blobbyMesh.position.set(0.68, 0.12, 0);
        blobbyGroup.add(blobbyMesh);
        dynamicRotators.push({ obj: blobbyGroup, speedY: 1.6, speedX: 0.2 });

        // Sub-Moon Orbit Track Ring
        blobbyMesh.add(createMoonOrbitRing(0.20, 0xf472b6, 0.35));

        // Sub-Moon: Doodle (Pink cartoon dot orbiting Blobby)
        const doodleGroup = new THREE.Group();
        blobbyMesh.add(doodleGroup);
        const doodleMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 12, 12),
          new THREE.MeshToonMaterial({ color: 0xf472b6 })
        );
        doodleMesh.position.set(0.20, 0, 0);
        doodleGroup.add(doodleMesh);
        dynamicRotators.push({ obj: doodleGroup, speedY: 3.8 });
        break;
      }

      // WORLD 04: PRISM (Crystalline Neon Wireframe WebGL)
      case '4': {
        const coreGeo = new THREE.IcosahedronGeometry(cfg.size, 1);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0xa855f7,
          roughness: 0.2,
          metalness: 0.8,
          transparent: true,
          opacity: 0.75
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        planetGroup.add(coreMesh);

        // Outer Neon Cyan Cage
        const cageGeo = new THREE.IcosahedronGeometry(cfg.size * 1.15, 1);
        const cageMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4,
          wireframe: true,
          blending: THREE.AdditiveBlending
        });
        const cageMesh = new THREE.Mesh(cageGeo, cageMat);
        planetGroup.add(cageMesh);
        dynamicRotators.push({ obj: cageMesh, speedX: 0.4, speedY: 0.6 });

        // Moon Orbit Track Ring
        planetGroup.add(createMoonOrbitRing(0.64, 0x06b6d4, 0.25));

        // Moon: Shard (Octahedron crystal)
        const shardGroup = new THREE.Group();
        planetGroup.add(shardGroup);
        const shardMesh = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.08),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true })
        );
        shardMesh.position.set(0.64, 0.05, 0);
        shardGroup.add(shardMesh);
        dynamicRotators.push({ obj: shardGroup, speedY: 2.2 });

        // Sub-Moon Orbit Track Ring
        shardMesh.add(createMoonOrbitRing(0.18, 0xe879f9, 0.35));

        // Sub-Moon: Fragment (Tetrahedron shard orbiting Shard)
        const fragGroup = new THREE.Group();
        shardMesh.add(fragGroup);
        const fragMesh = new THREE.Mesh(
          new THREE.TetrahedronGeometry(0.035),
          new THREE.MeshBasicMaterial({ color: 0xe879f9 })
        );
        fragMesh.position.set(0.18, 0, 0);
        fragGroup.add(fragMesh);
        dynamicRotators.push({ obj: fragGroup, speedZ: 4.8 });
        break;
      }

      // WORLD 05: COLOSSUS (Banded Gas Giant with 3 Shepherd Moons)
      case '5': {
        const sphereGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0xd97706,
          roughness: 0.6,
          metalness: 0.1
        });
        coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
        planetGroup.add(coreMesh);

        // Giant Double Ring System
        const ringGeo = new THREE.RingGeometry(cfg.size * 1.35, cfg.size * 2.3, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xfde68a,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.6;
        planetGroup.add(ringMesh);

        // Moon Orbit Track Ring for Aegis
        planetGroup.add(createMoonOrbitRing(0.50, 0xca8a04, 0.25));

        // Shepherd Moon 1: Aegis (Inside Ring Gap)
        const aegisGroup = new THREE.Group();
        planetGroup.add(aegisGroup);
        const aegisMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.7 })
        );
        aegisMesh.position.set(0.50, 0, 0);
        aegisGroup.add(aegisMesh);
        dynamicRotators.push({ obj: aegisGroup, speedY: 2.4 });

        // Sub-Moon Orbit Track Ring
        aegisMesh.add(createMoonOrbitRing(0.17, 0xc084fc, 0.35));

        // Sub-Moon of Aegis: Titan-V
        const titanGroup = new THREE.Group();
        aegisMesh.add(titanGroup);
        const titanMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.032, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xc084fc })
        );
        titanMesh.position.set(0.17, 0, 0);
        titanGroup.add(titanMesh);
        dynamicRotators.push({ obj: titanGroup, speedY: 5.2 });

        // Moon Orbit Track Ring for Phobos-X
        planetGroup.add(createMoonOrbitRing(1.15, 0xd97706, 0.20));

        // Shepherd Moon 2: Phobos-X (Outer orbit)
        const phobosGroup = new THREE.Group();
        planetGroup.add(phobosGroup);
        const phobosMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 })
        );
        phobosMesh.position.set(1.15, -0.1, 0);
        phobosGroup.add(phobosMesh);
        dynamicRotators.push({ obj: phobosGroup, speedY: 1.2 });
        break;
      }

      // WORLD 06: GLACIAL (Frosted Specular Ice World)
      case '6': {
        const sphereGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          roughness: 0.1,
          metalness: 0.85
        });
        coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
        planetGroup.add(coreMesh);

        // Ice Halo
        const haloGeo = new THREE.SphereGeometry(cfg.size * 1.35, 24, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xa5f3fc,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending
        });
        haloMesh = new THREE.Mesh(haloGeo, haloMat);
        planetGroup.add(haloMesh);

        // Moon Orbit Track Ring
        planetGroup.add(createMoonOrbitRing(0.60, 0x38bdf8, 0.25));

        // Moon: Frost (Pale icy pearl)
        const frostGroup = new THREE.Group();
        planetGroup.add(frostGroup);
        const frostMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.2, metalness: 0.8 })
        );
        frostMesh.position.set(0.60, 0.08, 0);
        frostGroup.add(frostMesh);
        dynamicRotators.push({ obj: frostGroup, speedY: 1.9 });

        // Sub-Moon Orbit Track Ring
        frostMesh.add(createMoonOrbitRing(0.16, 0xa5f3fc, 0.35));

        // Sub-Moon: Hail (Diamond ice fleck orbiting Frost)
        const hailGroup = new THREE.Group();
        frostMesh.add(hailGroup);
        const hailMesh = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.03),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        hailMesh.position.set(0.16, 0, 0);
        hailGroup.add(hailMesh);
        dynamicRotators.push({ obj: hailGroup, speedY: 4.4 });
        break;
      }

      // WORLD 07: DYNAMO (Blazing Plasma Core with Pulsing Corona)
      case '7': {
        const sphereGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b
        });
        coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
        planetGroup.add(coreMesh);

        // Corona Solar Flare Mesh
        const coronaGeo = new THREE.SphereGeometry(cfg.size * 1.32, 24, 24);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending
        });
        haloMesh = new THREE.Mesh(coronaGeo, coronaMat);
        planetGroup.add(haloMesh);

        // Moon Orbit Track Ring
        planetGroup.add(createMoonOrbitRing(0.62, 0xf59e0b, 0.25));

        // Moon: Corona Spark
        const sparkGroup = new THREE.Group();
        planetGroup.add(sparkGroup);
        const sparkMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xd97706 })
        );
        sparkMesh.position.set(0.62, -0.06, 0);
        sparkGroup.add(sparkMesh);
        dynamicRotators.push({ obj: sparkGroup, speedY: 2.6 });

        // Sub-Moon Orbit Track Ring
        sparkMesh.add(createMoonOrbitRing(0.18, 0xfef08a, 0.35));

        // Sub-Moon: Solar Flare satellite
        const flareGroup = new THREE.Group();
        sparkMesh.add(flareGroup);
        const flareMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        flareMesh.position.set(0.18, 0, 0);
        flareGroup.add(flareMesh);
        dynamicRotators.push({ obj: flareGroup, speedY: 5.5 });
        break;
      }

      // WORLD 08: VERDANT (Emerald Biome Oasis with Resonant Moons)
      case '8': {
        const sphereGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0x059669,
          roughness: 0.5,
          metalness: 0.2
        });
        coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
        planetGroup.add(coreMesh);

        // Atmosphere Halo
        const haloGeo = new THREE.SphereGeometry(cfg.size * 1.35, 24, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0x34d399,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending
        });
        haloMesh = new THREE.Mesh(haloGeo, haloMat);
        planetGroup.add(haloMesh);

        // Moon Orbit Track Ring
        planetGroup.add(createMoonOrbitRing(0.65, 0x10b981, 0.25));

        // Moon 1: Castor (Moss green)
        const castorGroup = new THREE.Group();
        planetGroup.add(castorGroup);
        const castorMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 })
        );
        castorMesh.position.set(0.65, 0.1, 0);
        castorGroup.add(castorMesh);
        dynamicRotators.push({ obj: castorGroup, speedY: 1.7 });

        // Sub-Moon Orbit Track Ring
        castorMesh.add(createMoonOrbitRing(0.20, 0xa7f3d0, 0.35));

        // Sub-Moon 2: Pollux (Lime orb orbiting Castor)
        const polluxGroup = new THREE.Group();
        castorMesh.add(polluxGroup);
        const polluxMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xa7f3d0 })
        );
        polluxMesh.position.set(0.20, 0, 0);
        polluxGroup.add(polluxMesh);
        dynamicRotators.push({ obj: polluxGroup, speedY: 4.0 });
        break;
      }

      // WORLD 09: VOID (Obsidian Event Horizon with Lensing Accretion Disk)
      case '9': {
        const sphereGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: 0x09090b
        });
        coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
        planetGroup.add(coreMesh);

        // Accretion Disk Lensing Ring
        const ringGeo = new THREE.RingGeometry(cfg.size * 1.35, cfg.size * 2.2, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x6366f1,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        planetGroup.add(ringMesh);
        dynamicRotators.push({ obj: ringMesh, speedZ: -0.9 });

        // Moon Orbit Track Ring
        planetGroup.add(createMoonOrbitRing(0.64, 0x6366f1, 0.25));

        // Moon: Eclipse (Dark violet stealth sphere)
        const eclipseGroup = new THREE.Group();
        planetGroup.add(eclipseGroup);
        const eclipseMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x4c1d95, roughness: 0.4 })
        );
        eclipseMesh.position.set(0.64, 0, 0);
        eclipseGroup.add(eclipseMesh);
        dynamicRotators.push({ obj: eclipseGroup, speedY: 1.5 });

        // Sub-Moon Orbit Track Ring
        eclipseMesh.add(createMoonOrbitRing(0.18, 0x38bdf8, 0.35));

        // Sub-Moon: Singularity micro-orb
        const singGroup = new THREE.Group();
        eclipseMesh.add(singGroup);
        const singMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        singMesh.position.set(0.18, 0, 0);
        singGroup.add(singMesh);
        dynamicRotators.push({ obj: singGroup, speedY: 4.2 });
        break;
      }

      // WORLD 10: ARCOLOGY (Cyberpunk Synthwave Grid World)
      case '10': {
        const sphereGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0x2e1065,
          roughness: 0.4,
          metalness: 0.6
        });
        coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
        planetGroup.add(coreMesh);

        // Neon Grid Wireframe
        const gridGeo = new THREE.SphereGeometry(cfg.size * 1.02, 16, 16);
        const gridMat = new THREE.MeshBasicMaterial({
          color: 0xec4899,
          wireframe: true,
          blending: THREE.AdditiveBlending
        });
        const gridMesh = new THREE.Mesh(gridGeo, gridMat);
        planetGroup.add(gridMesh);
        dynamicRotators.push({ obj: gridMesh, speedY: 0.35 });

        // Glowing Equator Ring
        const ringGeo = new THREE.RingGeometry(cfg.size * 1.25, cfg.size * 1.38, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        planetGroup.add(ringMesh);

        // Moon Orbit Track Ring
        planetGroup.add(createMoonOrbitRing(0.62, 0xf43f5e, 0.25));

        // Moon: Beacon (Hot-pink data orb)
        const beaconGroup = new THREE.Group();
        planetGroup.add(beaconGroup);
        const beaconMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xf43f5e })
        );
        beaconMesh.position.set(0.62, 0.08, 0);
        beaconGroup.add(beaconMesh);
        dynamicRotators.push({ obj: beaconGroup, speedY: 2.1 });

        // Sub-Moon Orbit Track Ring
        beaconMesh.add(createMoonOrbitRing(0.18, 0x2dd4bf, 0.35));

        // Sub-Moon: Relay satellite
        const relayGroup = new THREE.Group();
        beaconMesh.add(relayGroup);
        const relayMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x2dd4bf })
        );
        relayMesh.position.set(0.18, 0, 0);
        relayGroup.add(relayMesh);
        dynamicRotators.push({ obj: relayGroup, speedY: 4.6 });
        break;
      }

      default:
        break;
    }

    // Default Atmosphere Fresnel Glow Aura (Aditya-567 3D Planets synthesis)
    if (!haloMesh) {
      const auraGeo = new THREE.SphereGeometry(cfg.size * 1.30, 24, 24);
      const auraMat = createAtmosphereShader(cfg.color, 1.1, 2.4);
      haloMesh = new THREE.Mesh(auraGeo, auraMat);
      planetGroup.add(haloMesh);
    }

    // Initial placement into sceneBack
    sceneBack.add(planetGroup);

    planets.push({
      id: cfg.id,
      cfg: cfg,
      group: planetGroup,
      coreMesh: coreMesh,
      haloMesh: haloMesh,
      dynamicRotators: dynamicRotators,
      hitMesh: hitMesh,
      baseScale: 1.0,
      targetScale: 1.0,
      a: cfg.a,
      speed: cfg.speed,
      phase: cfg.phase,
      inclination: cfg.inclination,
      yBase: cfg.yBase,
      currentScene: 'back'
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5B. PLANETARY ORBIT MOTION TRAILS (Aditya-567 Fading Particle / Line Trails)
  // ──────────────────────────────────────────────────────────────────────────
  const TRAIL_SEGMENTS = 22;
  const planetTrails = [];

  WORLDS_DATA.forEach((cfg) => {
    const trailGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(TRAIL_SEGMENTS * 3);
    const colors = new Float32Array(TRAIL_SEGMENTS * 3);

    const baseCol = new THREE.Color(cfg.color);

    for (let j = 0; j < TRAIL_SEGMENTS; j++) {
      // Alpha falls off quadratically toward tail (smooth gradient trail)
      const alpha = Math.pow(j / (TRAIL_SEGMENTS - 1), 2.2) * 0.75;
      colors[j * 3] = baseCol.r * alpha;
      colors[j * 3 + 1] = baseCol.g * alpha;
      colors[j * 3 + 2] = baseCol.b * alpha;
    }

    trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const trailMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const trailLine = new THREE.Line(trailGeo, trailMat);
    sceneBack.add(trailLine);

    planetTrails.push({
      id: cfg.id,
      line: trailLine,
      geo: trailGeo,
      posAttr: trailGeo.getAttribute('position')
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5C. SCREEN-SPACE PROJECTED PLANET MICRO-BUBBLES (.planet-callout-pill)
  // Playful wordless cyber glyphs (><, ^.^, etc.) inviting visitor clicks
  // ──────────────────────────────────────────────────────────────────────────
  const calloutPills = Array.from(document.querySelectorAll('.planet-callout-pill'));
  calloutPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pid = pill.getAttribute('data-planet-id');
      if (pid) openPlanetHUD(pid);
    });
  });

  const projV3 = new THREE.Vector3();

  // ──────────────────────────────────────────────────────────────────────────
  // 6. ANIMATION LOOP WITH TRUE 3D DEPTH OCCLUSION (Zero Camera Wobble)
  // ──────────────────────────────────────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    if (!isSceneActive) return;

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      // Slow ambient celestial system drift
      celestialTracksBack.rotation.y = time * 0.02;
      celestialTracksFront.rotation.y = time * 0.02;
      particleField.rotation.y = time * 0.035;
      nebulaCloud.rotation.y = -time * 0.015;

      // Solar Corona Soft Radiant Pulsing
      if (solarCorona) {
        solarCorona.scale.setScalar(1.0 + Math.sin(time * 2.2) * 0.05);
        solarCorona.rotation.z = time * 0.04;
      }

      // Keplerian Asteroid Belt Revolution with True 3D Dual-Canvas Occlusion
      if (asteroidBeltBack && asteroidBeltFront && asteroidData.length > 0) {
        for (let i = 0; i < ASTEROID_COUNT; i++) {
          const ast = asteroidData[i];
          const theta = time * ast.speed + ast.phase;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);

          // Focus at origin (0, 0, 0)
          const x0 = cosT * ast.a - ast.c;
          const z0 = sinT * ast.b;
          const y0 = ast.yOffset;

          // Rotate by omega in orbital plane
          const x1 = x0 * ast.cosOmega - z0 * ast.sinOmega;
          const z1 = x0 * ast.sinOmega + z0 * ast.cosOmega;

          // Rotate by incY
          const x2 = x1 * ast.cosIncY + z1 * ast.sinIncY;
          const z2 = -x1 * ast.sinIncY + z1 * ast.cosIncY;

          // Rotate by (TILT_X + incX)
          const posX = x2;
          const posY = y0 * ast.cosTiltX - z2 * ast.sinTiltX;
          const posZ = y0 * ast.sinTiltX + z2 * ast.cosTiltX;

          dummyMatrix.position.set(posX, posY, posZ);
          dummyMatrix.rotation.x = time * ast.rotX;
          dummyMatrix.rotation.y = time * ast.rotY;
          dummyMatrix.scale.setScalar(ast.scale);
          dummyMatrix.updateMatrix();

          // True 3D depth split across robot digital twin plane (Z = 0)
          if (posZ >= 0) {
            asteroidBeltFront.setMatrixAt(i, dummyMatrix.matrix);
            asteroidBeltBack.setMatrixAt(i, dummyHiddenMatrix);
          } else {
            asteroidBeltBack.setMatrixAt(i, dummyMatrix.matrix);
            asteroidBeltFront.setMatrixAt(i, dummyHiddenMatrix);
          }
        }
        asteroidBeltBack.instanceMatrix.needsUpdate = true;
        asteroidBeltFront.instanceMatrix.needsUpdate = true;
      }

      // Keplerian Planetary Continuous Revolution & Fading Motion Trails
      planets.forEach((p, idx) => {
        const theta = time * p.cfg.speed + p.cfg.phase;

        // Keplerian orbital coordinate calculation with robot focus at (0, 0, 0)
        const pos = getKeplerianOrbitalCoords(p.cfg, theta);
        p.group.position.copy(pos);

        // Update Motion Trail behind planet
        const trail = planetTrails[idx];
        if (trail) {
          const posArray = trail.posAttr.array;
          const trailSpan = 0.32; // trailing arc in radians
          for (let j = 0; j < TRAIL_SEGMENTS; j++) {
            const t = theta - (1 - j / (TRAIL_SEGMENTS - 1)) * trailSpan;
            const tPos = getKeplerianOrbitalCoords(p.cfg, t);

            posArray[j * 3] = tPos.x;
            posArray[j * 3 + 1] = tPos.y;
            posArray[j * 3 + 2] = tPos.z;
          }
          trail.posAttr.needsUpdate = true;
        }

        // Self-spin and internal hierarchical moon rotation
        p.dynamicRotators.forEach((rot) => {
          if (rot.speedX) rot.obj.rotation.x = time * rot.speedX;
          if (rot.speedY) rot.obj.rotation.y = time * rot.speedY;
          if (rot.speedZ) rot.obj.rotation.z = time * rot.speedZ;
        });

        // Pulsing Solar Corona for World 07
        if (p.id === '7' && p.haloMesh) {
          const pulseScale = 1.0 + Math.sin(time * 3.5) * 0.08;
          p.haloMesh.scale.set(pulseScale, pulseScale, pulseScale);
        }

        // Dynamic 3D Layering: Switch between Scene Back (behind robot) and Scene Front (in front of robot)
        if (rendererFront) {
          if (pos.z >= 0.05) {
            if (p.currentScene !== 'front') {
              sceneBack.remove(p.group);
              sceneFront.add(p.group);
              p.currentScene = 'front';
            }
            if (trail && trail.currentScene !== 'front') {
              sceneBack.remove(trail.line);
              sceneFront.add(trail.line);
              trail.currentScene = 'front';
            }
          } else {
            if (p.currentScene !== 'back') {
              sceneFront.remove(p.group);
              sceneBack.add(p.group);
              p.currentScene = 'back';
            }
            if (trail && trail.currentScene !== 'back') {
              sceneFront.remove(trail.line);
              sceneBack.add(trail.line);
              trail.currentScene = 'back';
            }
          }
        }

        // Smooth scale interpolation on hover
        p.group.scale.lerp(new THREE.Vector3(p.targetScale, p.targetScale, p.targetScale), 0.12);
      });

      // Update Screen-Space Position for Interactive Planet Micro-Bubbles
      if (calloutPills.length > 0) {
        const secRect = section.getBoundingClientRect();
        const secW = secRect.width;
        const secH = secRect.height;

        planets.forEach((p) => {
          const pill = calloutPills.find(el => el.getAttribute('data-planet-id') === p.id);
          if (!pill) return;

          p.group.getWorldPosition(projV3);
          const worldZ = projV3.z;
          projV3.y += (p.cfg.size * 1.5 + 0.35);

          projV3.project(camera);

          const isInFrontOfCamera = projV3.z < 1.0;
          const isBehindRobot = worldZ < -0.25;

          if (isInFrontOfCamera && !isBehindRobot && Math.abs(projV3.x) <= 1.05 && Math.abs(projV3.y) <= 1.05) {
            const x = (projV3.x * 0.5 + 0.5) * secW;
            const y = (-projV3.y * 0.5 + 0.5) * secH;

            pill.style.setProperty('--pill-x', `${x}px`);
            pill.style.setProperty('--pill-y', `${y}px`);
            pill.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
            pill.style.opacity = '1';
            pill.style.pointerEvents = 'auto';
          } else {
            pill.style.opacity = '0';
            pill.style.pointerEvents = 'none';
          }
        });
      }
    }

    // Render Back Scene (behind 3D robot anchor)
    rendererBack.render(sceneBack, camera);

    // Render Front Scene (in front of 3D robot anchor)
    if (rendererFront) {
      rendererFront.render(sceneFront, camera);
    }

    animFrameId = requestAnimationFrame(animate);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. RAYCASTER POINTER CLICK & HOVER INSPECTOR
  // ──────────────────────────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const mouseNDC = new THREE.Vector2();

  function getRaycastIntersects(clientX, clientY) {
    const rect = section.getBoundingClientRect();
    if (clientY < rect.top || clientY > rect.bottom || clientX < rect.left || clientX > rect.right) {
      return null;
    }

    mouseNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouseNDC, camera);

    // Check hit targets in both front and back scenes
    const frontHits = raycaster.intersectObjects(
      clickableHitMeshes.filter(m => m.parent && m.parent.parent === sceneFront),
      false
    );
    if (frontHits.length > 0) return frontHits[0];

    const backHits = raycaster.intersectObjects(
      clickableHitMeshes.filter(m => m.parent && m.parent.parent === sceneBack),
      false
    );
    if (backHits.length > 0) return backHits[0];

    return null;
  }

  function onPointerMove(e) {
    if (!isSceneActive) return;
    const hit = getRaycastIntersects(e.clientX, e.clientY);

    if (hit && hit.object.userData.planetId) {
      const pid = hit.object.userData.planetId;
      if (hoveredPlanetId !== pid) {
        hoveredPlanetId = pid;
        document.body.style.cursor = 'pointer';
        planets.forEach((p) => {
          if (p.id === pid) {
            p.targetScale = 1.35;
            if (p.haloMesh) p.haloMesh.material.opacity = 0.65;
          } else {
            p.targetScale = 0.92;
            if (p.haloMesh) p.haloMesh.material.opacity = 0.20;
          }
        });
      }
    } else {
      if (hoveredPlanetId !== null) {
        hoveredPlanetId = null;
        document.body.style.cursor = '';
        planets.forEach((p) => {
          p.targetScale = 1.0;
          if (p.haloMesh) p.haloMesh.material.opacity = 0.35;
        });
      }
    }
  }

  function onSectionClick(e) {
    // If click is on close button or inside HUD panel, let HUD handle it
    if (e.target.closest('#planet-inspector-hud')) return;

    const hit = getRaycastIntersects(e.clientX, e.clientY);
    if (hit && hit.object.userData.planetId) {
      e.preventDefault();
      e.stopPropagation();
      openPlanetHUD(hit.object.userData.planetId);
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  section.addEventListener('click', onSectionClick);

  // ──────────────────────────────────────────────────────────────────────────
  // 8. TACTICAL HUD MODAL CONTROLLER (Bilingual Parity)
  // ──────────────────────────────────────────────────────────────────────────
  const hudModal = document.getElementById('planet-inspector-hud');
  const hudBackdrop = document.getElementById('hud-backdrop');
  const hudCloseBtn = document.getElementById('hud-close-btn');
  const hudOrb = document.getElementById('hud-planet-orb');
  const hudKicker = document.getElementById('hud-planet-kicker');
  const hudBadge = document.getElementById('hud-planet-badge');
  const hudTitle = document.getElementById('hud-planet-title');
  const hudDesc = document.getElementById('hud-planet-desc');
  const hudPills = document.getElementById('hud-spec-pills');

  function openPlanetHUD(planetId) {
    const world = WORLDS_DATA.find(w => w.id === String(planetId));
    if (!world || !hudModal) return;

    const isId = document.documentElement.lang === 'id' || window.location.pathname.includes('-id');

    if (hudOrb) {
      hudOrb.style.background = world.hex;
      hudOrb.style.boxShadow = `0 0 16px ${world.hex}, inset 0 0 4px #ffffff`;
    }

    if (hudKicker) hudKicker.textContent = isId ? world.kickerId : world.kickerEn;
    if (hudBadge) {
      hudBadge.textContent = isId ? world.statusId : world.statusEn;
      hudBadge.style.color = world.hex;
      hudBadge.style.borderColor = `${world.hex}55`;
      hudBadge.style.background = `${world.hex}18`;
    }

    if (hudTitle) hudTitle.textContent = isId ? world.nameId : world.nameEn;
    if (hudDesc) hudDesc.textContent = isId ? world.descId : world.descEn;

    if (hudPills) {
      hudPills.innerHTML = '';
      world.stack.forEach((tech) => {
        const pill = document.createElement('span');
        pill.className = 'hud-tech-tag';
        pill.textContent = tech;
        hudPills.appendChild(pill);
      });
    }

    hudModal.classList.add('active');
    hudModal.setAttribute('aria-hidden', 'false');
  }

  function closePlanetHUD() {
    if (!hudModal) return;
    hudModal.classList.remove('active');
    hudModal.setAttribute('aria-hidden', 'true');
  }

  if (hudCloseBtn) hudCloseBtn.addEventListener('click', closePlanetHUD);
  if (hudBackdrop) hudBackdrop.addEventListener('click', closePlanetHUD);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hudModal && hudModal.classList.contains('active')) {
      closePlanetHUD();
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 9. PUBLIC INTERACTIVE CONTROLLER (API Parity)
  // ──────────────────────────────────────────────────────────────────────────
  window.__CELESTIAL_3D__ = {
    openHUD: openPlanetHUD,
    closeHUD: closePlanetHUD,
    inspectPlanet: openPlanetHUD,

    get camera() { return camera; },
    get planets() { return planets; },
    get worldsData() { return WORLDS_DATA; },
    get asteroidBelt() { return asteroidBeltFront || asteroidBeltBack; },
    get asteroidBeltBack() { return asteroidBeltBack; },
    get asteroidBeltFront() { return asteroidBeltFront; },
    get planetTrails() { return planetTrails; },
    get solarCorona() { return solarCorona; },
    get sceneBack() { return sceneBack; },
    get sceneFront() { return sceneFront; }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 10. RESPONSIVE RESIZE INVARIANT
  // ──────────────────────────────────────────────────────────────────────────
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    camera.aspect = w / h;
    camera.position.z = getResponsiveCameraZ();
    camera.updateProjectionMatrix();

    rendererBack.setSize(w, h);
    rendererBack.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (rendererFront) {
      rendererFront.setSize(w, h);
      rendererFront.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  window.addEventListener('resize', onResize);

  // ──────────────────────────────────────────────────────────────────────────
  // 11. GPU PRESERVER: INTERSECTION OBSERVER (PONYTAIL LAW)
  // ──────────────────────────────────────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isSceneActive = entry.isIntersecting;
        if (isSceneActive && !animFrameId) {
          clock.start();
          animFrameId = requestAnimationFrame(animate);
        } else if (!isSceneActive && animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
          clock.stop();
        }
      });
    }, { rootMargin: '250px 0px 250px 0px', threshold: 0.01 });

    observer.observe(section);
  }

  // Start animation loop
  clock.start();
  animFrameId = requestAnimationFrame(animate);
  console.log('[CELESTIAL 3D] 10 Bespoke Worlds & Hierarchical Moons active on locked orbit plane.');

})();
