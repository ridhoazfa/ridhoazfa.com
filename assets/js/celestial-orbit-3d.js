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

  const initW = section.clientWidth || window.innerWidth;
  const initH = section.clientHeight || window.innerHeight;

  let cachedSecW = initW;
  let cachedSecH = initH;

  const camera = new THREE.PerspectiveCamera(45, initW / initH, 0.1, 100);
  
  function getResponsiveCameraZ() {
    const w = window.innerWidth;
    if (w < 480) return 23.5;
    if (w < 768) return 19.5;
    if (w < 1180) return 17.5;
    return 15.5;
  }

  function getResponsiveCameraY() {
    const w = window.innerWidth;
    if (w < 480) return 2.2;
    if (w < 768) return 1.8;
    if (w < 1180) return 1.5;
    return 1.3;
  }
  
  camera.position.set(0, getResponsiveCameraY(), getResponsiveCameraZ());
  camera.lookAt(0, -0.48, 0);

  // High-Performance Three.js Texture Loader (Aditya-567 3D-Planets Synthesis)
  const textureLoader = new THREE.TextureLoader();

  // Dual WebGL Renderers for True 3D Depth Occlusion
  const rendererBack = new THREE.WebGLRenderer({
    canvas: canvasBack,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  rendererBack.setSize(initW, initH, false);
  rendererBack.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  rendererBack.outputColorSpace = THREE.SRGBColorSpace;

  let rendererFront = null;
  if (canvasFront) {
    rendererFront = new THREE.WebGLRenderer({
      canvas: canvasFront,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererFront.setSize(initW, initH, false);
    rendererFront.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    rendererFront.outputColorSpace = THREE.SRGBColorSpace;
  }

  // Dual-Scene Balanced Illumination (Astronomical Key Sun Light & Deep Space Cosmic Fill)
  const ambLightBack = new THREE.AmbientLight(0xdbeafe, 0.55);
  sceneBack.add(ambLightBack);
  const dirLightBack = new THREE.DirectionalLight(0xffffff, 2.4);
  dirLightBack.position.set(6, 14, 10);
  sceneBack.add(dirLightBack);

  const ambLightFront = new THREE.AmbientLight(0xdbeafe, 0.55);
  sceneFront.add(ambLightFront);
  const dirLightFront = new THREE.DirectionalLight(0xffffff, 2.4);
  dirLightFront.position.set(6, 14, 10);
  sceneFront.add(dirLightFront);

  let isSceneActive = true;
  let animFrameId = null;
  let hoveredPlanetId = null;

  const TILT_X = 0.16; // Flat oblique galactic disc inclination (~9.2 degrees) matching user sketch reference

  // ──────────────────────────────────────────────────────────────────────────
  // 1. TEN BESPOKE WORLDS DOSSIER (Photorealistic Textures, 3D Rings & Keplerian Physics)
  // Synthesized from Aditya-567/3D-Planets with Codaxiom Zero-Bloat Law
  // ──────────────────────────────────────────────────────────────────────────
  const WORLDS_DATA = [
    {
      id: '1',
      worldKey: 'TERRA',
      color: 0x38bdf8,
      hex: '#38bdf8',
      textureFile: 'earth_daymap.jpg',
      axialTilt: 23.5,
      spinSpeed: 0.010,
      nameEn: 'Full-Stack Web & SaaS Platforms',
      nameId: 'Platform Web & SaaS Full-Stack',
      kickerEn: 'WORLD // 01 · SAAS',
      kickerId: 'DUNIA // 01 · SAAS',
      statusEn: 'PRODUCTION VERIFIED',
      statusId: 'TERVERIFIKASI PRODUKSI',
      descEn: 'Multi-tenant web architectures engineered with Next.js App Router, TypeScript, and relational databases. Incorporates defensive data hydration, strict tenant isolation, and zero-downtime blue/green rollouts.',
      descId: 'Arsitektur web multi-tenant yang direkayasa dengan Next.js App Router, TypeScript, dan database relasional. Dilengkapi pertahanan hidrasi data, isolasi tenant yang ketat, dan rilis blue/green tanpa downtime.',
      stack: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Prisma ORM', 'Tailwind CSS', 'Docker'],
      a: 2.4,
      e: 0,
      omega: 0,
      incX: 0,
      incY: 0,
      speed: 0.4500,
      phase: 0.15,
      yBase: 0,
      size: 0.26,
      trackOpacity: 0.28
    },
    {
      id: '2',
      worldKey: 'INFERNO',
      color: 0xef4444,
      hex: '#ef4444',
      textureFile: 'marsmap.jpg',
      bumpFile: 'marsbump.jpg',
      bumpScale: 0.045,
      axialTilt: 25.2,
      spinSpeed: 0.0098,
      nameEn: 'Low-Level Linux Systems & Sockets',
      nameId: 'Sistem Linux Tingkat Rendah & Socket',
      kickerEn: 'WORLD // 02 · KERNEL',
      kickerId: 'DUNIA // 02 · KERNEL',
      statusEn: 'HIGH PERFORMANCE',
      statusId: 'PERFORMA TINGGI',
      descEn: 'Root-level infrastructure and hardware-adjacent networking. Hands-on mastery of Linux systemd units, MikroTik routers, reverse proxy routing, and memory-safe daemon services.',
      descId: 'Infrastruktur tingkat root dan rekayasa jaringan perangkat keras. Penguasaan unit systemd Linux, router MikroTik, routing reverse proxy Caddy, dan layanan daemon hemat memori.',
      stack: ['Ubuntu Server', 'systemd', 'Caddy Reverse Proxy', 'MikroTik RouterOS', 'Bash Scripting', 'TCP/IP Sockets'],
      a: 3.0,
      e: 0,
      omega: 0,
      incX: 0,
      incY: 0,
      speed: 0.3220,
      phase: 0.85,
      yBase: 0,
      size: 0.23,
      trackOpacity: 0.25
    },
    {
      id: '3',
      worldKey: 'TOON',
      color: 0xfbbf24,
      hex: '#fbbf24',
      textureFile: 'venusmap.jpg',
      bumpFile: 'venusbump.jpg',
      bumpScale: 0.035,
      atmosphereFile: 'venus_atmosphere.jpg',
      axialTilt: 177.3,
      spinSpeed: -0.004,
      nameEn: 'Human-Centered UX & Motion Systems',
      nameId: 'UX Berpusat pada Manusia & Animasi',
      kickerEn: 'WORLD // 03 · INTERACTION',
      kickerId: 'DUNIA // 03 · INTERAKSI',
      statusEn: 'HIGH CRAFT STANDARD',
      statusId: 'STANDAR KREATIF TINGGI',
      descEn: 'Tactile, playful, and responsive user experiences built with sovereign typography, zero-emoji vector laws, GSAP timelines, and accessible kinetic feedback.',
      descId: 'Pengalaman pengguna yang taktil, responsif, dan menyenangkan dengan tipografi berdaulat, aturan bebas emoji, timeline GSAP, dan umpan balik kinetik yang aksesibel.',
      stack: ['GSAP ScrollTrigger', 'CSS Kinetic Tokens', 'Fraunces & Inter', 'Font Awesome Pro', 'Web Accessibility (a11y)'],
      a: 3.6,
      e: 0,
      omega: 0,
      incX: 0,
      incY: 0,
      speed: 0.2449,
      phase: 1.55,
      yBase: 0,
      size: 0.24,
      trackOpacity: 0.25
    },
    {
      id: '4',
      worldKey: 'PRISM',
      color: 0x06b6d4,
      hex: '#06b6d4',
      textureFile: 'mercury.jpg',
      bumpFile: 'mercurybump.jpg',
      bumpScale: 0.040,
      axialTilt: 0.03,
      spinSpeed: 0.003,
      nameEn: 'Real-Time 3D, WebGL & Shader Labs',
      nameId: '3D Real-Time, WebGL & Shader Labs',
      kickerEn: 'WORLD // 04 · WEBGL',
      kickerId: 'DUNIA // 04 · WEBGL',
      statusEn: 'GPU ACCELERATED',
      statusId: 'AKSELERASI GPU',
      descEn: 'Interactive 3D viewports, custom Three.js geometries, PBR material lighting, and Rapier physics bridges engineered with zero GPU memory leaks and IntersectionObserver pausing.',
      descId: 'Viewport 3D interaktif, geometri Three.js kustom, pencahayaan material PBR, dan integrasi fisika Rapier tanpa kebocoran memori GPU serta jeda otomatis IntersectionObserver.',
      stack: ['Three.js', 'GLSL Custom Shaders', 'Spline 3D Runtime', 'Rapier Physics 3D', 'WebGL/WebGPU Pipelines'],
      a: 4.2,
      e: 0,
      omega: 0,
      incX: 0,
      incY: 0,
      speed: 0.1942,
      phase: 2.25,
      yBase: 0,
      size: 0.22,
      trackOpacity: 0.23
    },
    {
      id: '5',
      worldKey: 'COLOSSUS',
      color: 0xd97706,
      hex: '#d97706',
      textureFile: 'jupiter.jpg',
      axialTilt: 3.1,
      spinSpeed: 0.024,
      nameEn: 'Distributed Cloud Infrastructure & DevOps',
      nameId: 'Infrastruktur Cloud Terdistribusi & DevOps',
      kickerEn: 'WORLD // 05 · DEVOPS',
      kickerId: 'DUNIA // 05 · DEVOPS',
      statusEn: '99.9% UPTIME ARCHITECTURE',
      statusId: 'ARSITEKTUR UPTIME 99.9%',
      descEn: 'Containerized orchestration with Docker Compose, automated health monitors, cron schedulers, blue/green migration playbooks, and disaster recovery snapshots.',
      descId: 'Orkestrasi kontainer dengan Docker Compose, monitor kesehatan otomatis, penjadwal cron, panduan migrasi blue/green, dan snapshot pemulihan bencana berkala.',
      stack: ['Docker Compose', 'VPS Bare-Metal', 'Automated Health Watchdogs', 'Blue/Green Deployer', 'Disaster Recovery (DR)'],
      a: 5.8,
      e: 0,
      omega: 0,
      incX: 0,
      incY: 0,
      speed: 0.1209,
      phase: 2.95,
      yBase: 0,
      size: 0.38,
      trackOpacity: 0.24
    },
    {
      id: '6',
      worldKey: 'GLACIAL',
      color: 0xe0e7ff,
      hex: '#e0e7ff',
      textureFile: 'saturnmap.jpg',
      ringTextureFile: 'saturn_ring.png',
      hasRings: true,
      axialTilt: 26.7,
      spinSpeed: 0.020,
      nameEn: 'Security Hardening & Zero-Trust Defense',
      nameId: 'Pengerasan Keamanan & Pertahanan Zero-Trust',
      kickerEn: 'WORLD // 06 · SECURITY',
      kickerId: 'DUNIA // 06 · KEAMANAN',
      statusEn: 'IMMUTABLE HARBOR',
      statusId: 'BENTENG IMUTABEL',
      descEn: 'Multi-layer cybersecurity defense: JWT authentication with bcrypt salting, rate-limiting shields, SQL injection immunity via Prisma prepared statements, and payload sanitization.',
      descId: 'Pertahanan siber berlapis: otentikasi JWT dengan salt bcrypt, pembatas laju (rate limiting), imun terhadap injeksi SQL lewat prepared statement Prisma, dan sanitasi muatan data.',
      stack: ['JWT Token Defense', 'bcrypt Salting', 'OWASP Top 10 Mitigation', 'SQL Injection Immunity', 'Fail-Closed API Security'],
      a: 6.6,
      e: 0,
      omega: 0,
      incX: 0,
      incY: 0,
      speed: 0.0994,
      phase: 3.65,
      yBase: 0,
      size: 0.32,
      trackOpacity: 0.22
    },
    {
      id: '7',
      worldKey: 'DYNAMO',
      color: 0x38bdf8,
      hex: '#38bdf8',
      textureFile: 'uranus.jpg',
      ringTextureFile: 'uranus_ring.png',
      hasRings: true,
      axialTilt: 97.8,
      spinSpeed: 0.014,
      nameEn: 'Conversational AI & WhatsApp Systems',
      nameId: 'Sistem AI Percakapan & WhatsApp',
      kickerEn: 'WORLD // 07 · AI AGENTS',
      kickerId: 'DUNIA // 07 · AGEN AI',
      statusEn: 'AUTONOMOUS CLOSER',
      statusId: 'CLOSER OTONOM',
      descEn: 'Multi-turn conversational AI workflows, ledger-derived forever customer dossiers, cache-first prompt engineering, and Evolution API WhatsApp anti-ban Stealth Shield.',
      descId: 'Alur kerja AI percakapan multi-turn, memori pelanggan jangka panjang berbasis ledger, teknik prompt hemat token, dan Stealth Shield anti-ban WhatsApp Evolution API.',
      stack: ['Evolution API v2', 'DeepSeek LLM APIs', 'Stealth Shield Anti-Ban', 'Customer Dossier Memory', 'Webhooks Engine'],
      a: 7.4,
      e: 0,
      omega: 0,
      incX: 0,
      incY: 0,
      speed: 0.0837,
      phase: 4.35,
      yBase: 0,
      size: 0.27,
      trackOpacity: 0.22
    },
    {
      id: '8',
      worldKey: 'VERDANT',
      color: 0x10b981,
      hex: '#10b981',
      textureFile: 'neptune.jpg',
      axialTilt: 28.3,
      spinSpeed: 0.015,
      nameEn: 'Spatial WebGIS, GeoJSON & Mapping Pipelines',
      nameId: 'WebGIS Spasial, GeoJSON & Saluran Peta',
      kickerEn: 'WORLD // 08 · WEBGIS',
      kickerId: 'DUNIA // 08 · WEBGIS',
      statusEn: 'GEOSPATIAL VERIFIED',
      statusId: 'TERVERIFIKASI SPASIAL',
      descEn: 'Interactive geospatial pipelines mapping territorial zoning, polygon calculation, Leaflet/Mapbox integrations, and spatial relational data algorithms.',
      descId: 'Saluran data geospasial interaktif yang memetakan zonasi wilayah, kalkulasi poligon, integrasi Leaflet/Mapbox, dan algoritma relasional data spasial.',
      stack: ['Spatial GeoJSON', 'Leaflet.js', 'Turf.js Algorithms', 'PostGIS Geometries', 'Choropleth Visualizers'],
      a: 8.2,
      e: 0,
      omega: 0,
      incX: 0,
      incY: 0,
      speed: 0.0717,
      phase: 5.05,
      yBase: 0,
      size: 0.26,
      trackOpacity: 0.21
    },
    {
      id: '9',
      worldKey: 'VOID',
      color: 0x818cf8,
      hex: '#818cf8',
      textureFile: 'plutomap.jpg',
      bumpFile: 'plutobump2k.jpg',
      bumpScale: 0.050,
      axialTilt: 122.5,
      spinSpeed: 0.005,
      nameEn: 'Database Architecture & Cache Engineering',
      nameId: 'Arsitektur Database & Rekayasa Cache',
      kickerEn: 'WORLD // 09 · DATABASE',
      kickerId: 'DUNIA // 09 · DATABASE',
      statusEn: 'ATOMIC CONCURRENCY',
      statusId: 'KONKURENSI ATOMIK',
      descEn: 'Relational data modeling, schema indexing, foreign key integrity constraints, optimistic concurrency locks, and in-memory Redis caching layers.',
      descId: 'Pemodelan data relasional, pengindeksan skema, batasan integritas foreign key, penguncian konkurensi optimis, dan lapisan caching Redis in-memory.',
      stack: ['PostgreSQL 16', 'Redis Caching', 'Prisma Schema Migrations', 'Composite Indexes', 'ACID Transactions'],
      a: 9.0,
      e: 0,
      omega: 0,
      incX: 0,
      incY: 0,
      speed: 0.0623,
      phase: 5.75,
      yBase: 0,
      size: 0.21,
      trackOpacity: 0.20
    },
    {
      id: '10',
      worldKey: 'ARCOLOGY',
      color: 0xec4899,
      hex: '#ec4899',
      textureFile: 'earth_nightmap.jpg',
      isEmissiveGrid: true,
      axialTilt: 23.5,
      spinSpeed: 0.012,
      nameEn: 'Modular Payments & Idempotent Commerce',
      nameId: 'Sistem Pembayaran Modular & FinTech',
      kickerEn: 'WORLD // 10 · FINTECH',
      kickerId: 'DUNIA // 10 · FINTECH',
      statusEn: 'IDEMPOTENT CERTIFIED',
      statusId: 'TERSERTIFIKASI IDEMPOTEN',
      descEn: 'FinTech payment integrations with Midtrans Snap (Cards, QRIS, Virtual Accounts) and international Stripe BYO-keys. Idempotent webhook verification and tamper-proof invoices.',
      descId: 'Integrasi gerbang pembayaran FinTech dengan Midtrans Snap (Kartu, QRIS, Virtual Account) dan Stripe BYO-keys internasional. Verifikasi webhook yang sepenuhnya idempoten.',
      stack: ['Midtrans Snap SDK', 'Stripe API v2024', 'QRIS Dinamis', 'Bank Virtual Accounts', 'Signed Invoice Tokens'],
      a: 9.8,
      e: 0,
      omega: 0,
      incX: 0,
      incY: 0,
      speed: 0.05455,
      phase: 0.45,
      yBase: 0,
      size: 0.25,
      trackOpacity: 0.19
    }
  ];

  // Precompute constants for tilted coplanar circular orbit projection
  const COS_TILT_X = Math.cos(TILT_X);
  const SIN_TILT_X = Math.sin(TILT_X);

  // Calculate 3D circular tilted coordinates with 3D robot digital twin at (0, 0, 0)
  function getKeplerianOrbitalCoords(cfg, theta) {
    const x0 = Math.cos(theta) * cfg.a;
    const z0 = Math.sin(theta) * cfg.a;
    const y0 = cfg.yBase || 0;

    // Project onto common tilted galactic plane:
    const x = x0;
    const y = y0 * COS_TILT_X - z0 * SIN_TILT_X;
    const z = y0 * SIN_TILT_X + z0 * COS_TILT_X;

    return new THREE.Vector3(x, y, z);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 1B. 3D KEPLERIAN ORBIT TRACKS (Dual True 3D Layering: Back & Front)
  // ──────────────────────────────────────────────────────────────────────────
  const celestialTracksBack = new THREE.Group();
  sceneBack.add(celestialTracksBack);

  const celestialTracksFront = new THREE.Group();
  sceneFront.add(celestialTracksFront);

  // Helper: Create split circular orbit tracks (Front arc in front of robot, Back arc behind)
  // Since z = a * sin(theta) * COS_TILT_X, z >= 0 strictly when theta in [0, PI] (Front arc)
  // and z <= 0 strictly when theta in [PI, 2*PI] (Back arc).
  function createSplitKeplerianOrbitTracks(cfg) {
    const SEGMENTS = 128; // Silky smooth aerospace-grade curvature

    // Front arc: from theta = 0 to theta = Math.PI (where z >= 0)
    const frontPoints = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const th = (i / SEGMENTS) * Math.PI;
      frontPoints.push(getKeplerianOrbitalCoords(cfg, th));
    }

    const frontGeo = new THREE.BufferGeometry().setFromPoints(frontPoints);
    
    // 1. Continuous Base Guidance Rail (clean astronomical trajectory)
    const frontBaseMat = new THREE.LineBasicMaterial({
      color: cfg.color,
      transparent: true,
      opacity: Math.max((cfg.trackOpacity || 0.24) * 0.45, 0.12)
    });
    const frontBaseLine = new THREE.Line(frontGeo, frontBaseMat);
    celestialTracksFront.add(frontBaseLine);

    // 2. Superimposed Kinetic Telemetry Dashes
    const frontDashMat = new THREE.LineDashedMaterial({
      color: cfg.color,
      transparent: true,
      opacity: (cfg.trackOpacity || 0.24) * 0.90,
      dashSize: 0.35,
      gapSize: 0.22
    });
    const frontDashLine = new THREE.Line(frontGeo, frontDashMat);
    frontDashLine.computeLineDistances();
    celestialTracksFront.add(frontDashLine);

    // Back arc: from theta = Math.PI to theta = 2 * Math.PI (where z <= 0)
    const backPoints = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const th = Math.PI + (i / SEGMENTS) * Math.PI;
      backPoints.push(getKeplerianOrbitalCoords(cfg, th));
    }

    const backGeo = new THREE.BufferGeometry().setFromPoints(backPoints);

    // 1. Continuous Base Guidance Rail
    const backBaseMat = new THREE.LineBasicMaterial({
      color: cfg.color,
      transparent: true,
      opacity: Math.max((cfg.trackOpacity || 0.24) * 0.35, 0.09)
    });
    const backBaseLine = new THREE.Line(backGeo, backBaseMat);
    celestialTracksBack.add(backBaseLine);

    // 2. Superimposed Kinetic Telemetry Dashes
    const backDashMat = new THREE.LineDashedMaterial({
      color: cfg.color,
      transparent: true,
      opacity: (cfg.trackOpacity || 0.24) * 0.75,
      dashSize: 0.35,
      gapSize: 0.22
    });
    const backDashLine = new THREE.Line(backGeo, backDashMat);
    backDashLine.computeLineDistances();
    celestialTracksBack.add(backDashLine);
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
  sceneBack.add(particleField);


  // ──────────────────────────────────────────────────────────────────────────
  // 4. DUAL-CANVAS INSTANCED ASTEROID BELT (800 Stones, Flat Galactic Ring)
  // Synthesized from Aditya-567/3D-Planets with Ponytail Anti-Bloat Law
  // ──────────────────────────────────────────────────────────────────────────
  const ASTEROID_COUNT = 800;
  const asteroidGeo = new THREE.DodecahedronGeometry(0.026, 0);
  const asteroidMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.85,
    metalness: 0.15
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
    // Semi-major axis in asteroid belt region between Prism (4.2) and Colossus (5.8)
    const a = 4.7 + Math.random() * 0.60;
    // Thin vertical dispersion in common tilted plane
    const yOffset = (Math.random() - 0.5) * 0.10;
    // Circular orbital speed proportional to a^-1.5 matching Keplerian planetary constant
    const speed = (1.673 / Math.pow(a, 1.5)) * (0.94 + Math.random() * 0.12);
    const phase = Math.random() * Math.PI * 2;
    const scale = 0.40 + Math.random() * 0.75;
    const rotX = (Math.random() - 0.5) * 2;
    const rotY = (Math.random() - 0.5) * 2;

    asteroidData.push({
      a, yOffset, speed, phase, scale, rotX, rotY
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. MESH GENERATORS FOR 10 UNIQUE WORLDS & HIERARCHICAL MOONS
  // ──────────────────────────────────────────────────────────────────────────
  const planets = [];
  const clickableHitMeshes = [];

  // Helper: Delicate circular orbit path ring for planetary moons (clean non-additive astronomical guide)
  function createMoonOrbitRing(radius, color = 0x94a3b8, opacity = 0.12) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(48);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.12
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

  // Helper: Create PBR Textured Planet Sphere with Axial Tilt & Bump/Emissive Relief
  function createTexturedPlanetMesh(cfg, options = {}) {
    const sphereGeo = new THREE.SphereGeometry(cfg.size, 48, 48);
    const tex = textureLoader.load('assets/textures/planets/' + cfg.textureFile);
    tex.colorSpace = THREE.SRGBColorSpace;
    const maxAniso = rendererBack ? rendererBack.capabilities.getMaxAnisotropy() : 16;
    tex.anisotropy = Math.min(maxAniso, 16);

    const matParams = {
      map: tex,
      roughness: options.roughness !== undefined ? options.roughness : 0.72,
      metalness: options.metalness !== undefined ? options.metalness : 0.18
    };

    const bFile = options.bumpFile || cfg.bumpFile;
    if (bFile) {
      const bumpTex = textureLoader.load('assets/textures/planets/' + bFile);
      bumpTex.colorSpace = THREE.SRGBColorSpace;
      bumpTex.anisotropy = Math.min(maxAniso, 16);
      matParams.bumpMap = bumpTex;
      matParams.bumpScale = options.bumpScale || cfg.bumpScale || 0.04;
    }

    if (cfg.isEmissiveGrid || options.isEmissive) {
      matParams.emissiveMap = tex;
      matParams.emissive = new THREE.Color(options.emissiveColor || 0xffffff);
      matParams.emissiveIntensity = options.emissiveIntensity !== undefined ? options.emissiveIntensity : 0.45;
      matParams.roughness = 0.6;
    }

    const sphereMat = new THREE.MeshStandardMaterial(matParams);
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.rotation.z = THREE.MathUtils.degToRad(cfg.axialTilt || 15);
    return mesh;
  }

  // Helper: Create Textured Moon Mesh with Realistic Surface Textures (Aditya-567 3D-Planets Synthesis)
  function createTexturedMoonMesh(radius, textureFile, options = {}) {
    const geo = new THREE.SphereGeometry(radius, 24, 24);
    const tex = textureLoader.load('assets/textures/planets/' + textureFile);
    tex.colorSpace = THREE.SRGBColorSpace;
    const maxAniso = rendererBack ? rendererBack.capabilities.getMaxAnisotropy() : 16;
    tex.anisotropy = Math.min(maxAniso, 16);
    const matParams = {
      map: tex,
      roughness: options.roughness !== undefined ? options.roughness : 0.8,
      metalness: options.metalness !== undefined ? options.metalness : 0.1
    };
    if (options.bumpFile) {
      const bTex = textureLoader.load('assets/textures/planets/' + options.bumpFile);
      bTex.anisotropy = Math.min(maxAniso, 16);
      matParams.bumpMap = bTex;
      matParams.bumpScale = options.bumpScale || 0.03;
    }
    if (options.color) {
      matParams.color = new THREE.Color(options.color);
    }
    const mat = new THREE.MeshStandardMaterial(matParams);
    return new THREE.Mesh(geo, mat);
  }

  // Helper: Create True 3D Planetary Ring System with Radial UV Mapping (Aditya-567 3D Planets Synthesis)
  function createPlanetaryRing(innerRadius, outerRadius, ringFileName, opacity = 0.85, tiltX = Math.PI / 2.2, tiltY = 0) {
    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 128);
    const ringTex = textureLoader.load('assets/textures/planets/' + ringFileName);
    ringTex.colorSpace = THREE.SRGBColorSpace;
    const ringMat = new THREE.MeshStandardMaterial({
      map: ringTex,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
      roughness: 0.7,
      metalness: 0.1,
      depthWrite: false
    });

    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.sqrt(pos.getX(i) * pos.getX(i) + pos.getY(i) * pos.getY(i));
      const u = (r - innerRadius) / (outerRadius - innerRadius);
      uv.setXY(i, u, 0.5);
    }

    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = tiltX;
    if (tiltY) ringMesh.rotation.y = tiltY;
    return ringMesh;
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
      // WORLD 01: TERRA (Earth & Luna with Authentic Lunar Bump Map & Orbiter Alpha)
      case '1': {
        coreMesh = createTexturedPlanetMesh(cfg);
        planetGroup.add(coreMesh);

        // Moon Orbit Track Ring for Luna
        planetGroup.add(createMoonOrbitRing(0.38));

        // Moon System: Luna (Authentic NASA Lunar Map & Bump Relief)
        const lunaOrbitGroup = new THREE.Group();
        planetGroup.add(lunaOrbitGroup);
        const lunaMesh = createTexturedMoonMesh(0.068, 'moonmap.jpg', {
          bumpFile: 'moonbump.jpg',
          bumpScale: 0.035,
          roughness: 0.82
        });
        lunaMesh.position.set(0.38, 0.04, 0);
        lunaOrbitGroup.add(lunaMesh);
        dynamicRotators.push({ obj: lunaOrbitGroup, speedY: 1.8 });

        // Sub-Moon Orbit Track Ring for Orbiter Alpha
        lunaMesh.add(createMoonOrbitRing(0.12));

        // Sub-Moon System: Orbiter Alpha satellite with solar arrays
        const subOrbitGroup = new THREE.Group();
        lunaMesh.add(subOrbitGroup);
        const subMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.030, 0.020, 0.020),
          new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.25 })
        );
        const wingGeo = new THREE.PlaneGeometry(0.075, 0.020);
        const wingMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a, side: THREE.DoubleSide });
        subMesh.add(new THREE.Mesh(wingGeo, wingMat));
        subMesh.position.set(0.12, 0, 0);
        subOrbitGroup.add(subMesh);
        dynamicRotators.push({ obj: subOrbitGroup, speedY: 4.5 });
        break;
      }

      // WORLD 02: INFERNO (Mars with Craters, Valles Marineris Canyon & Phobos + Deimos Moons)
      case '2': {
        coreMesh = createTexturedPlanetMesh(cfg, { bumpFile: 'marsbump.jpg', bumpScale: 0.045, roughness: 0.82 });
        planetGroup.add(coreMesh);

        // Moon Orbit Track Ring for Phobos (inner moon)
        planetGroup.add(createMoonOrbitRing(0.32));

        // Moon 1: Phobos (Irregular cratered asteroid moon)
        const phobosGroup = new THREE.Group();
        planetGroup.add(phobosGroup);
        const phobosGeo = new THREE.DodecahedronGeometry(0.052, 1);
        const phobosTex = textureLoader.load('assets/textures/planets/moon.jpg');
        phobosTex.colorSpace = THREE.SRGBColorSpace;
        const phobosMesh = new THREE.Mesh(
          phobosGeo,
          new THREE.MeshStandardMaterial({ map: phobosTex, roughness: 0.88, color: 0xd97706 })
        );
        phobosMesh.position.set(0.32, 0.03, 0);
        phobosGroup.add(phobosMesh);
        dynamicRotators.push({ obj: phobosGroup, speedY: 2.6 });

        // Sub-Moon Orbit Track Ring around Phobos
        phobosMesh.add(createMoonOrbitRing(0.09, 0xfbbf24, 0.35));

        // Sub-Satellite: Spark Node
        const sparkGroup = new THREE.Group();
        phobosMesh.add(sparkGroup);
        const sparkMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.022, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
        );
        sparkMesh.position.set(0.09, 0, 0);
        sparkGroup.add(sparkMesh);
        dynamicRotators.push({ obj: sparkGroup, speedY: 5.5 });

        // Moon Orbit Track Ring for Deimos (outer moon)
        planetGroup.add(createMoonOrbitRing(0.44, 0xf97316, 0.22));

        // Moon 2: Deimos (Smooth dark textured moon)
        const deimosGroup = new THREE.Group();
        planetGroup.add(deimosGroup);
        const deimosMesh = createTexturedMoonMesh(0.038, 'moon.jpg', {
          roughness: 0.85,
          color: 0x9a3412
        });
        deimosMesh.position.set(0.44, -0.04, 0);
        deimosGroup.add(deimosMesh);
        dynamicRotators.push({ obj: deimosGroup, speedY: 1.4 });
        break;
      }

      // WORLD 03: TOON (Radiant Venus with Dense Sulfuric Cloud Deck & Playful Moons)
      case '3': {
        coreMesh = createTexturedPlanetMesh(cfg, { bumpFile: 'venusbump.jpg', bumpScale: 0.035, roughness: 0.72 });
        planetGroup.add(coreMesh);

        // Venus Atmospheric Cloud Deck Shell with Differential Rotation (Aditya-567 Synthesis)
        const cloudTex = textureLoader.load('assets/textures/planets/venus_atmosphere.jpg');
        cloudTex.colorSpace = THREE.SRGBColorSpace;
        const maxAniso = rendererBack ? rendererBack.capabilities.getMaxAnisotropy() : 16;
        cloudTex.anisotropy = Math.min(maxAniso, 16);
        const cloudGeo = new THREE.SphereGeometry(cfg.size * 1.018, 36, 36);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.38,
          roughness: 0.85
        });
        const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        planetGroup.add(cloudMesh);
        dynamicRotators.push({ obj: cloudMesh, speedY: 0.45 });

        // Moon Orbit Track Ring for Blobby
        planetGroup.add(createMoonOrbitRing(0.38));

        // Moon: Blobby (Companion Moon)
        const blobbyGroup = new THREE.Group();
        planetGroup.add(blobbyGroup);
        const blobbyMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.068, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.65 })
        );
        blobbyMesh.position.set(0.38, 0.06, 0);
        blobbyGroup.add(blobbyMesh);
        dynamicRotators.push({ obj: blobbyGroup, speedY: 1.6, speedX: 0.2 });

        // Sub-Moon Orbit Track Ring
        blobbyMesh.add(createMoonOrbitRing(0.11));

        // Sub-Moon: Doodle
        const doodleGroup = new THREE.Group();
        blobbyMesh.add(doodleGroup);
        const doodleMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.028, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7 })
        );
        doodleMesh.position.set(0.11, 0, 0);
        doodleGroup.add(doodleMesh);
        dynamicRotators.push({ obj: doodleGroup, speedY: 3.8 });
        break;
      }

      // WORLD 04: PRISM (Crystalline High-Res Mercury with Pure Surface Detail)
      case '4': {
        coreMesh = createTexturedPlanetMesh(cfg, { bumpFile: 'mercurybump.jpg', bumpScale: 0.040, roughness: 0.55, metalness: 0.25 });
        planetGroup.add(coreMesh);

        // Moon Orbit Track Ring for Shard
        planetGroup.add(createMoonOrbitRing(0.36));

        // Moon: Shard (Faceted Crystalline Octahedron)
        const shardGroup = new THREE.Group();
        planetGroup.add(shardGroup);
        const shardMesh = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.065),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25, metalness: 0.85 })
        );
        shardMesh.position.set(0.36, 0.04, 0);
        shardGroup.add(shardMesh);
        dynamicRotators.push({ obj: shardGroup, speedY: 2.2 });
        break;
      }

      // WORLD 05: COLOSSUS (Jupiter Gas Giant & The 4 Authentic Galilean Moons)
      case '5': {
        coreMesh = createTexturedPlanetMesh(cfg, { roughness: 0.62, metalness: 0.12 });
        planetGroup.add(coreMesh);

        // 1. IO (Volcanic Sulfur Moon - vivid yellow/orange JPL texture)
        planetGroup.add(createMoonOrbitRing(0.26));
        const ioGroup = new THREE.Group();
        planetGroup.add(ioGroup);
        const ioMesh = createTexturedMoonMesh(0.046, 'jupiterIo.jpg', { roughness: 0.75 });
        ioMesh.position.set(0.26, 0.02, 0);
        ioGroup.add(ioMesh);
        dynamicRotators.push({ obj: ioGroup, speedY: 3.2 });

        // 2. EUROPA (Fractured Ice World - smooth ice with reddish lineae)
        planetGroup.add(createMoonOrbitRing(0.33));
        const europaGroup = new THREE.Group();
        planetGroup.add(europaGroup);
        const europaMesh = createTexturedMoonMesh(0.042, 'jupiterEuropa.jpg', { roughness: 0.40, metalness: 0.25 });
        europaMesh.position.set(0.33, -0.02, 0);
        europaGroup.add(europaMesh);
        dynamicRotators.push({ obj: europaGroup, speedY: 2.4 });

        // 3. GANYMEDE (Solar System's Largest Moon - grooved cratered terrain)
        planetGroup.add(createMoonOrbitRing(0.41));
        const ganymedeGroup = new THREE.Group();
        planetGroup.add(ganymedeGroup);
        const ganymedeMesh = createTexturedMoonMesh(0.056, 'jupiterGanymede.jpg', { roughness: 0.80 });
        ganymedeMesh.position.set(0.41, 0.03, 0);
        ganymedeGroup.add(ganymedeMesh);
        dynamicRotators.push({ obj: ganymedeGroup, speedY: 1.7 });

        // 4. CALLISTO (Ancient Heavily Cratered Dark Icy Moon)
        planetGroup.add(createMoonOrbitRing(0.49));
        const callistoGroup = new THREE.Group();
        planetGroup.add(callistoGroup);
        const callistoMesh = createTexturedMoonMesh(0.052, 'jupiterCallisto.jpg', { roughness: 0.85 });
        callistoMesh.position.set(0.49, -0.03, 0);
        callistoGroup.add(callistoMesh);
        dynamicRotators.push({ obj: callistoGroup, speedY: 1.2 });
        break;
      }

      // WORLD 06: GLACIAL / SATURN (Photorealistic Saturn Texture, True 3D Rings & Titan/Enceladus)
      case '6': {
        coreMesh = createTexturedPlanetMesh(cfg, { roughness: 0.68, metalness: 0.15 });
        planetGroup.add(coreMesh);

        // SATURN 3D RINGS (Aditya-567 saturn_ring.png with radial UV mapping)
        const saturnRings = createPlanetaryRing(
          cfg.size * 1.30,
          cfg.size * 2.30,
          'saturn_ring.png',
          0.92,
          Math.PI / 2.2,
          THREE.MathUtils.degToRad(26.7)
        );
        planetGroup.add(saturnRings);

        // Moon Orbit Track Ring for Titan (dense golden atmosphere moon)
        planetGroup.add(createMoonOrbitRing(0.46));
        const titanGroup = new THREE.Group();
        planetGroup.add(titanGroup);
        const titanMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.054, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65, metalness: 0.1 })
        );
        titanMesh.position.set(0.46, 0.03, 0);
        titanGroup.add(titanMesh);
        dynamicRotators.push({ obj: titanGroup, speedY: 1.8 });

        // Moon Orbit Track Ring for Enceladus (pure bright reflective ice moon)
        planetGroup.add(createMoonOrbitRing(0.55));
        const enceladusGroup = new THREE.Group();
        planetGroup.add(enceladusGroup);
        const enceladusMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.036, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xf0f9ff, roughness: 0.15, metalness: 0.85 })
        );
        enceladusMesh.position.set(0.55, -0.03, 0);
        enceladusGroup.add(enceladusMesh);
        dynamicRotators.push({ obj: enceladusGroup, speedY: 2.7 });
        break;
      }

      // WORLD 07: DYNAMO / URANUS (Photorealistic Uranus Texture, Perpendicular Rings & Miranda/Ariel)
      case '7': {
        coreMesh = createTexturedPlanetMesh(cfg, { roughness: 0.65, metalness: 0.12 });
        planetGroup.add(coreMesh);

        // URANUS 3D RINGS (Aditya-567 uranus_ring.png with radial UV mapping)
        const uranusRings = createPlanetaryRing(
          cfg.size * 1.25,
          cfg.size * 1.95,
          'uranus_ring.png',
          0.80,
          Math.PI / 2.0,
          THREE.MathUtils.degToRad(85.0)
        );
        planetGroup.add(uranusRings);

        // Moon Orbit Track Ring for Miranda
        planetGroup.add(createMoonOrbitRing(0.38));
        const mirandaGroup = new THREE.Group();
        planetGroup.add(mirandaGroup);
        const mirandaMesh = createTexturedMoonMesh(0.042, 'moon.jpg', { color: 0xbae6fd, roughness: 0.82 });
        mirandaMesh.position.set(0.38, 0.03, 0);
        mirandaGroup.add(mirandaMesh);
        dynamicRotators.push({ obj: mirandaGroup, speedY: 2.4 });

        // Moon Orbit Track Ring for Ariel
        planetGroup.add(createMoonOrbitRing(0.48));
        const arielGroup = new THREE.Group();
        planetGroup.add(arielGroup);
        const arielMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.038, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.35, metalness: 0.45 })
        );
        arielMesh.position.set(0.48, -0.03, 0);
        arielGroup.add(arielMesh);
        dynamicRotators.push({ obj: arielGroup, speedY: 1.5 });
        break;
      }

      // WORLD 08: VERDANT / NEPTUNE (Deep Azure Neptune & Massive Retrograde Triton + Proteus)
      case '8': {
        coreMesh = createTexturedPlanetMesh(cfg, { roughness: 0.65, metalness: 0.15 });
        planetGroup.add(coreMesh);

        // Moon Orbit Track Ring for Triton (Massive retrograde cryo-volcanic moon)
        planetGroup.add(createMoonOrbitRing(0.42));
        const tritonGroup = new THREE.Group();
        planetGroup.add(tritonGroup);
        const tritonMesh = createTexturedMoonMesh(0.056, 'moonmap.jpg', {
          bumpFile: 'moonbump.jpg',
          bumpScale: 0.03,
          color: 0xd1fae5,
          roughness: 0.72
        });
        tritonMesh.position.set(0.42, 0.04, 0);
        tritonGroup.add(tritonMesh);
        // Retrograde orbit (speed < 0)
        dynamicRotators.push({ obj: tritonGroup, speedY: -1.8 });

        // Moon Orbit Track Ring for Proteus
        planetGroup.add(createMoonOrbitRing(0.52));
        const proteusGroup = new THREE.Group();
        planetGroup.add(proteusGroup);
        const proteusMesh = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.036, 0),
          new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.9 })
        );
        proteusMesh.position.set(0.52, -0.04, 0);
        proteusGroup.add(proteusMesh);
        dynamicRotators.push({ obj: proteusGroup, speedY: 2.2 });
        break;
      }

      // WORLD 09: VOID / PLUTO (High-Res Pluto with Plutobump2k & Binary Companion Charon + Hydra)
      case '9': {
        coreMesh = createTexturedPlanetMesh(cfg, { bumpFile: 'plutobump2k.jpg', bumpScale: 0.050, roughness: 0.85 });
        planetGroup.add(coreMesh);

        // Moon Orbit Track Ring for Charon
        planetGroup.add(createMoonOrbitRing(0.38));
        const charonGroup = new THREE.Group();
        planetGroup.add(charonGroup);
        const charonMesh = createTexturedMoonMesh(0.052, 'moon.jpg', {
          bumpFile: 'moonbump.jpg',
          bumpScale: 0.03,
          color: 0xc4b5fd,
          roughness: 0.80
        });
        charonMesh.position.set(0.38, 0.02, 0);
        charonGroup.add(charonMesh);
        dynamicRotators.push({ obj: charonGroup, speedY: 1.6 });

        // Moon Orbit Track Ring for Hydra
        planetGroup.add(createMoonOrbitRing(0.49));
        const hydraGroup = new THREE.Group();
        planetGroup.add(hydraGroup);
        const hydraMesh = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.028),
          new THREE.MeshStandardMaterial({ color: 0xede9fe, roughness: 0.2, metalness: 0.8 })
        );
        hydraMesh.position.set(0.49, -0.03, 0);
        hydraGroup.add(hydraMesh);
        dynamicRotators.push({ obj: hydraGroup, speedY: 2.8 });
        break;
      }

      // WORLD 10: ARCOLOGY (Earth Night Lights City Power Grid & Telecommunications Satellite Relays)
      case '10': {
        coreMesh = createTexturedPlanetMesh(cfg, { isEmissive: true, emissiveColor: 0xfde047, emissiveIntensity: 0.45 });
        planetGroup.add(coreMesh);

        // Orbit Track Ring for Relay-1 (FinTech Gateway Satellite)
        planetGroup.add(createMoonOrbitRing(0.38));
        const relay1Group = new THREE.Group();
        planetGroup.add(relay1Group);
        const relay1Mesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.036, 0.024, 0.024),
          new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 })
        );
        const r1WingGeo = new THREE.PlaneGeometry(0.09, 0.024);
        const r1WingMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide });
        relay1Mesh.add(new THREE.Mesh(r1WingGeo, r1WingMat));
        // Blinking LED beacon
        const r1Led = new THREE.Mesh(
          new THREE.SphereGeometry(0.012, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xef4444 })
        );
        r1Led.position.set(0, 0.02, 0);
        relay1Mesh.add(r1Led);
        relay1Mesh.position.set(0.38, 0.04, 0);
        relay1Group.add(relay1Mesh);
        dynamicRotators.push({ obj: relay1Group, speedY: 2.2 });

        // Orbit Track Ring for Relay-2 (Idempotent Ledger Node)
        planetGroup.add(createMoonOrbitRing(0.48));
        const relay2Group = new THREE.Group();
        planetGroup.add(relay2Group);
        const relay2Mesh = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.032),
          new THREE.MeshStandardMaterial({ color: 0x2dd4bf, metalness: 0.8, roughness: 0.25 })
        );
        relay2Mesh.position.set(0.48, -0.04, 0);
        relay2Group.add(relay2Mesh);
        dynamicRotators.push({ obj: relay2Group, speedY: 1.5 });
        break;
      }

      default:
        break;
    }

    // Initial placement into sceneBack
    sceneBack.add(planetGroup);

    planets.push({
      id: cfg.id,
      cfg: cfg,
      group: planetGroup,
      coreMesh: coreMesh,
      haloMesh: null,
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
  // 6. ANIMATION LOOP WITH TRUE 3D DEPTH OCCLUSION (Stationary Horizon Law)
  // Camera horizon is 100% locked so trajectory tracks never move on hover
  // ──────────────────────────────────────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    if (!isSceneActive) return;

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      // Cosmic background dust subtle rotation (tracks stay static)
      particleField.rotation.y = time * 0.035;

      // Camera Horizon Lock (Trajectory rings stay 100% stationary on mouse hover)
      camera.position.x = 0;
      camera.position.y = getResponsiveCameraY();
      camera.position.z = getResponsiveCameraZ();
      camera.lookAt(0, -0.48, 0);

      // Asteroid Belt Revolution on Locked Coplanar Tilted Disc (True 3D Dual-Canvas Occlusion)
      if (asteroidBeltBack && asteroidBeltFront && asteroidData.length > 0) {
        for (let i = 0; i < ASTEROID_COUNT; i++) {
          const ast = asteroidData[i];
          const theta = time * ast.speed + ast.phase;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);

          const x0 = cosT * ast.a;
          const z0 = sinT * ast.a;
          const y0 = ast.yOffset;

          const posX = x0;
          const posY = y0 * COS_TILT_X - z0 * SIN_TILT_X;
          const posZ = y0 * SIN_TILT_X + z0 * COS_TILT_X;

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

      // 10 Bespoke Worlds Revolution (Mathematically Locked to Trajectory Rings)
      planets.forEach((p) => {
        const theta = time * p.cfg.speed + p.cfg.phase;

        // Circular orbital coordinate calculation locked to trajectory ring
        const pos = getKeplerianOrbitalCoords(p.cfg, theta);
        p.group.position.copy(pos);

        // Planet Continuous Self-Spin on its tilted axis
        if (p.coreMesh) {
          p.coreMesh.rotation.y += (p.cfg.spinSpeed || 0.01);
        }

        // Self-spin and internal hierarchical moon rotation
        p.dynamicRotators.forEach((rot) => {
          if (rot.speedX) rot.obj.rotation.x = time * rot.speedX;
          if (rot.speedY) rot.obj.rotation.y = time * rot.speedY;
          if (rot.speedZ) rot.obj.rotation.z = time * rot.speedZ;
        });



        // Dynamic 3D Layering: Switch between Scene Back (behind robot) and Scene Front (in front of robot)
        if (rendererFront) {
          if (pos.z >= 0.0) {
            if (p.currentScene !== 'front') {
              sceneBack.remove(p.group);
              sceneFront.add(p.group);
              p.currentScene = 'front';
            }
          } else {
            if (p.currentScene !== 'back') {
              sceneFront.remove(p.group);
              sceneBack.add(p.group);
              p.currentScene = 'back';
            }
          }
        }

        // Smooth scale interpolation on hover
        p.group.scale.lerp(new THREE.Vector3(p.targetScale, p.targetScale, p.targetScale), 0.12);
      });

      // Update Screen-Space Position for Interactive Planet Micro-Bubbles (Zero-Reflow Cached Math)
      if (calloutPills.length > 0) {
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
            const x = (projV3.x * 0.5 + 0.5) * cachedSecW;
            const y = (-projV3.y * 0.5 + 0.5) * cachedSecH;

            pill.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
            if (pill.style.opacity !== '1') {
              pill.style.opacity = '1';
              pill.style.pointerEvents = 'auto';
            }
          } else {
            if (pill.style.opacity !== '0') {
              pill.style.opacity = '0';
              pill.style.pointerEvents = 'none';
            }
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
            p.targetScale = 1.32;
          } else {
            p.targetScale = 0.94;
          }
        });
      }
    } else {
      if (hoveredPlanetId !== null) {
        hoveredPlanetId = null;
        document.body.style.cursor = '';
        planets.forEach((p) => {
          p.targetScale = 1.0;
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
    get planetTrails() { return []; },
    get solarCorona() { return null; },
    get centralSunMesh() { return null; },
    get sceneBack() { return sceneBack; },
    get sceneFront() { return sceneFront; }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 10. RESPONSIVE RESIZE INVARIANT
  // ──────────────────────────────────────────────────────────────────────────
  function onResize() {
    const w = section.clientWidth || window.innerWidth;
    const h = section.clientHeight || window.innerHeight;

    cachedSecW = w;
    cachedSecH = h;

    camera.aspect = w / h;
    camera.position.z = getResponsiveCameraZ();
    camera.position.y = getResponsiveCameraY();
    camera.updateProjectionMatrix();
    camera.lookAt(0, -0.48, 0);

    rendererBack.setSize(w, h, false);
    rendererBack.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    if (rendererFront) {
      rendererFront.setSize(w, h, false);
      rendererFront.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
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
    }, { rootMargin: '100px 0px 100px 0px', threshold: 0.01 });

    observer.observe(section);
  }

  // Pre-compile WebGL shaders to eliminate initial scroll entry compilation freeze
  try {
    rendererBack.compile(sceneBack, camera);
    if (rendererFront) {
      rendererFront.compile(sceneFront, camera);
    }
  } catch (err) {
    console.warn('[CELESTIAL 3D] Shader pre-compilation skipped:', err);
  }

  // Start animation loop
  clock.start();
  animFrameId = requestAnimationFrame(animate);
  console.log('[CELESTIAL 3D] 10 Bespoke Worlds & Hierarchical Moons active on locked orbit plane.');

})();
