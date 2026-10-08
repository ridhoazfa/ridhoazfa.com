/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: NEXBOT Spline 3D Native WebGL Controller & Viewport Tracker
 * Authorities: ui-ux-pro-max-skill (stacks/threejs.csv) · emilkowalski-skills
 * ============================================================================
 */

(function () {
  'use strict';

  const canvas = document.getElementById('spline-robot-canvas');
  if (!canvas) return;

  const SPLINE_RUNTIME_URL = 'https://cdn.spline.design/@splinetool/runtime@2.0.66/build/runtime.js';
  const SCENE_URL = 'assets/scene.splinecode';

  let appInstance = null;
  let isSceneActive = true;

  const hasPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  async function bootSplineRobot() {
    try {
      const { Application } = await import(SPLINE_RUNTIME_URL);
      appInstance = new Application(canvas);

      const resp = await fetch(SCENE_URL);
      if (!resp.ok) throw new Error(`HTTP error status ${resp.status}`);
      const buf = await resp.arrayBuffer();

      await appInstance.start(new Uint8Array(buf));

      // Enforce 100% transparent WebGL clear color (Zero rectangular box cutout)
      if (appInstance._renderer && typeof appInstance._renderer.setClearColor === 'function') {
        appInstance._renderer.setClearColor(0x000000, 0);
      }
      if (typeof appInstance.setBackgroundColor === 'function') {
        try { appInstance.setBackgroundColor('transparent'); } catch (_) {}
      }
      if (appInstance._scene) {
        appInstance._scene.background = null;
      }
      if (appInstance.scene) {
        appInstance.scene.background = null;
      }

      // Override Spline's internal Raycaster coordinate math (authoritative anti-sky bug fix)
      // Resolves normalized device coordinates (NDC) directly against canvas viewport rect,
      // completely eliminating scroll-offset desynchronization and +11.6 sky pitch locking.
      if (appInstance._eventManager && appInstance._eventManager.eventContext) {
        const ec = appInstance._eventManager.eventContext;
        ec.updateRaycaster = function (e) {
          const rect = canvas.getBoundingClientRect();
          if (!rect || rect.width <= 0 || rect.height <= 0) return;

          const cx = e.touches?.length ? e.touches[0].clientX : e.clientX;
          const cy = e.touches?.length ? e.touches[0].clientY : e.clientY;
          if (typeof cx !== 'number' || typeof cy !== 'number') return;

          // True viewport NDC centered on the robot physical eye level
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height * 0.48;

          let ndcX = (cx - centerX) / (rect.width / 2);
          let ndcY = -((cy - centerY) / (rect.height / 2));

          // Biological gaze limits:
          // Smooth horizontal tracking across entire viewport (-1.25 to +1.25)
          // Vertical clamping so head never pitches backwards into ceiling (-0.7 down to +0.35 up)
          ndcX = Math.max(-1.25, Math.min(1.25, ndcX));
          ndcY = Math.max(-0.7, Math.min(0.35, ndcY));

          this.pointerWorld = { x: ndcX, y: ndcY };
          this.pointerScreen = {
            x: (ndcX + 1) / 2,
            y: (ndcY + 1) / 2
          };
          this.raycaster.setFromCamera(this.pointerWorld, this.getCamera());
        };
      }

      window.__SPLINE_APP__ = appInstance;
      console.log('[NEXBOT 3D] WebGL Canvas mounted with alpha transparency and dynamic viewport tracking.');

      // Signal intro / loader controller that 3D scene is active
      window.dispatchEvent(new CustomEvent('ra-spline:ready'));

      // ────────────────────────────────────────────────────────────────────────
      // Whole-Viewport Pointer Tracking & Autonomous Idle-Decay Recentering
      // ────────────────────────────────────────────────────────────────────────
      if (hasPointerFine && !prefersReducedMotion) {
        window.addEventListener('pointermove', onGlobalPointerMove, { passive: true });
        document.addEventListener('pointerleave', onPointerLeave, { passive: true });
      }

      // ────────────────────────────────────────────────────────────────────────
      // GPU Preserver: IntersectionObserver (Ponytail Law)
      // Pauses rendering if architecture section is scrolled out of viewport
      // ────────────────────────────────────────────────────────────────────────
      const robotContainer = document.getElementById('architecture') || document.getElementById('orbit-stage-viewport') || document.getElementById('about');
      if (robotContainer && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isSceneActive = entry.isIntersecting;
            if (appInstance && typeof appInstance.play === 'function' && typeof appInstance.stop === 'function') {
              if (entry.isIntersecting) {
                appInstance.play();
                if (appInstance._renderer && typeof appInstance._renderer.setClearColor === 'function') {
                  appInstance._renderer.setClearColor(0x000000, 0);
                }
              } else {
                appInstance.stop();
                if (decayRafId) {
                  cancelAnimationFrame(decayRafId);
                  decayRafId = null;
                }
              }
            }
          });
        }, { threshold: 0.05 });
        observer.observe(robotContainer);
      }

      // Signal intro / loader controller that 3D scene is active
      window.dispatchEvent(new CustomEvent('ra-spline:ready'));

      window.__NEXBOT__ = {
        lookAtNode: dispatchCoords,
        resetGaze: returnToCenterSmooth,
        get app() { return appInstance; }
      };

    } catch (err) {
      console.warn('[NEXBOT 3D] Native WebGL boot failed, checking fallback:', err);
      // Notify loader to dismiss gracefully rather than hanging
      window.dispatchEvent(new CustomEvent('ra-spline:ready'));
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Orbital Node Gaze & Perspective Tracking (Runs Immediately on DOM Ready)
  // ──────────────────────────────────────────────────────────────────────────
  function initOrbitalInteractions() {
    const bubbleTextEl = document.getElementById('robot-bubble-text');
    const bubbleKickerEl = document.getElementById('bubble-kicker');
    const isIndonesian = document.documentElement.lang === 'id';

    const perspectives = {
      '1': {
        kicker: isIndonesian ? 'RIDHO AZFA · PERSPEKTIF 01' : 'RIDHO AZFA · PERSPECTIVE 01',
        text: isIndonesian
          ? 'Saya membangun aplikasi web full-stack dengan Next.js dan PostgreSQL, berfokus pada arsitektur bersih, kecepatan, dan pemodelan data yang andal.'
          : 'I build full-stack web applications with Next.js and PostgreSQL, focusing on clean architecture, speed, and reliable data modeling.'
      },
      '2': {
        kicker: isIndonesian ? 'RIDHO AZFA · PERSPEKTIF 02' : 'RIDHO AZFA · PERSPECTIVE 02',
        text: isIndonesian
          ? 'Saya menghubungkan alur percakapan dan model AI langsung ke backend API dan platform perpesanan seperti WhatsApp untuk mengotomasi alur kerja nyata.'
          : 'I connect conversational flows and AI models directly to backend APIs and messaging platforms like WhatsApp to automate real business workflows.'
      },
      '3': {
        kicker: isIndonesian ? 'RIDHO AZFA · PERSPEKTIF 03' : 'RIDHO AZFA · PERSPECTIVE 03',
        text: isIndonesian
          ? 'Grafis 3D interaktif dan shader WebGL yang dikalibrasi untuk berjalan mulus 60 FPS tanpa mengorbankan performa perangkat keras.'
          : 'Interactive 3D graphics and WebGL shaders calibrated for a consistent 60 FPS in the browser without GPU waste.'
      },
      '4': {
        kicker: isIndonesian ? 'RIDHO AZFA · PERSPEKTIF 04' : 'RIDHO AZFA · PERSPECTIVE 04',
        text: isIndonesian
          ? 'Fondasi infrastruktur praktis dari SMK TKJ: mengonfigurasi server Linux, firewall MikroTik, reverse proxy Caddy, dan container Docker.'
          : 'Practical infrastructure roots from vocational networking: configuring Linux servers, MikroTik firewalls, and Docker containers.'
      },
      '5': {
        kicker: isIndonesian ? 'RIDHO AZFA · PERSPEKTIF 05' : 'RIDHO AZFA · PERSPECTIVE 05',
        text: isIndonesian
          ? 'Integrasi sistem pembayaran produksi: Midtrans Snap untuk Indonesia dan Stripe untuk transaksi internasional dengan webhook idempoten.'
          : 'Production checkout integrations with Midtrans Snap for Indonesia and Stripe for international transactions with idempotent webhooks.'
      }
    };

    const defaultPerspective = {
      kicker: isIndonesian ? 'RIDHO AZFA · PERSPEKTIF' : 'RIDHO AZFA · PERSPECTIVE',
      text: isIndonesian
        ? 'Saya merancang sistem full-stack dan pengalaman web 3D interaktif. Arahkan kursor ke disiplin mana pun untuk melihat detail.'
        : 'I design full-stack systems and interactive 3D web experiences. Hover any discipline to inspect.'
    };

    function setBubble(kicker, text) {
      if (bubbleKickerEl) bubbleKickerEl.textContent = kicker;
      if (bubbleTextEl) {
        bubbleTextEl.style.opacity = '0';
        setTimeout(() => {
          bubbleTextEl.textContent = text;
          bubbleTextEl.style.opacity = '1';
        }, 90);
      }
    }

    const nodeCards = document.querySelectorAll('.orbital-node-card');
    nodeCards.forEach((card) => {
      function focusCard() {
        const nodeNum = card.getAttribute('data-node');
        if (perspectives[nodeNum]) {
          setBubble(perspectives[nodeNum].kicker, perspectives[nodeNum].text);
        }

        if (window.__CELESTIAL_3D__ && typeof window.__CELESTIAL_3D__.highlightNode === 'function') {
          window.__CELESTIAL_3D__.highlightNode(nodeNum);
        }

        if (canvas) {
          const rect = card.getBoundingClientRect();
          const targetX = rect.left + rect.width / 2;
          const targetY = rect.top + rect.height / 2;
          if (decayRafId) {
            cancelAnimationFrame(decayRafId);
            decayRafId = null;
          }
          isIdleAtCenter = false;
          dispatchCoords(targetX, targetY);
          clearTimeout(idleTimer);
        }
      }

      card.addEventListener('mouseenter', focusCard);
      card.addEventListener('focus', focusCard);

      card.addEventListener('mouseleave', () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(returnToCenterSmooth, IDLE_DELAY_MS);
        setBubble(defaultPerspective.kicker, defaultPerspective.text);
        if (window.__CELESTIAL_3D__ && typeof window.__CELESTIAL_3D__.unhighlightNode === 'function') {
          window.__CELESTIAL_3D__.unhighlightNode();
        }
      });
      card.addEventListener('blur', () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(returnToCenterSmooth, IDLE_DELAY_MS);
        setBubble(defaultPerspective.kicker, defaultPerspective.text);
        if (window.__CELESTIAL_3D__ && typeof window.__CELESTIAL_3D__.unhighlightNode === 'function') {
          window.__CELESTIAL_3D__.unhighlightNode();
        }
      });
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Autonomous Gaze Attention Engine
  // ──────────────────────────────────────────────────────────────────────────
  let idleTimer = null;
  let decayRafId = null;
  let rafPointerId = null;
  let pendingPointer = null;
  let lastPointer = { x: 0, y: 0 };
  let isIdleAtCenter = true;

  const IDLE_DELAY_MS = 1200;      // 1.2s biological gaze dwell threshold
  const DECAY_DURATION_MS = 800;   // 800ms cubic ease-out return

  function dispatchCoords(x, y) {
    if (!isSceneActive || !canvas) return;

    lastPointer.x = x;
    lastPointer.y = y;

    const synthEvent = new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
      pageX: x + window.scrollX,
      pageY: y + window.scrollY,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      buttons: 0,
      button: 0
    });

    canvas.dispatchEvent(synthEvent);
  }

  function returnToCenterSmooth() {
    if (!isSceneActive || isIdleAtCenter) return;
    if (decayRafId) cancelAnimationFrame(decayRafId);

    const rect = canvas.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;

    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height * 0.48;

    const startX = lastPointer.x || targetX;
    const startY = lastPointer.y || targetY;

    if (Math.hypot(targetX - startX, targetY - startY) < 3) {
      dispatchCoords(targetX, targetY);
      isIdleAtCenter = true;
      return;
    }

    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / DECAY_DURATION_MS);
      // Cubic ease-out curve: 1 - (1 - progress)^3
      const ease = 1 - Math.pow(1 - progress, 3);

      const curX = startX + (targetX - startX) * ease;
      const curY = startY + (targetY - startY) * ease;

      dispatchCoords(curX, curY);

      if (progress < 1) {
        decayRafId = requestAnimationFrame(tick);
      } else {
        decayRafId = null;
        isIdleAtCenter = true;
        const bubbleEl = document.getElementById('orbit-robot-bubble');
        if (bubbleEl) {
          bubbleEl.style.setProperty('--sway-x', '0px');
          bubbleEl.style.setProperty('--sway-y', '0px');
        }
      }
    }

    decayRafId = requestAnimationFrame(tick);
  }

  function onGlobalPointerMove(e) {
    if (!isSceneActive) return;

    // Interrupt any active recentering decay immediately
    if (decayRafId) {
      cancelAnimationFrame(decayRafId);
      decayRafId = null;
    }
    isIdleAtCenter = false;

    // Coalesce high-frequency mouse movements to display refresh rate (prevents 1000Hz mouse flood)
    pendingPointer = { x: e.clientX, y: e.clientY, isDirect: e.target === canvas };
    if (!rafPointerId) {
      rafPointerId = requestAnimationFrame(() => {
        if (pendingPointer) {
          if (!pendingPointer.isDirect) {
            dispatchCoords(pendingPointer.x, pendingPointer.y);
          } else {
            lastPointer.x = pendingPointer.x;
            lastPointer.y = pendingPointer.y;
          }

          // Subtle dynamic micro-sway for speech bubble anchored with 3D space
          const bubbleEl = document.getElementById('orbit-robot-bubble');
          if (bubbleEl) {
            const rect = canvas.getBoundingClientRect();
            if (rect && rect.width > 0) {
              const nx = Math.max(-1, Math.min(1, (pendingPointer.x - (rect.left + rect.width / 2)) / (window.innerWidth / 2)));
              const ny = Math.max(-1, Math.min(1, (pendingPointer.y - (rect.top + rect.height / 2)) / (window.innerHeight / 2)));
              bubbleEl.style.setProperty('--sway-x', (nx * 6).toFixed(2) + 'px');
              bubbleEl.style.setProperty('--sway-y', (ny * 4).toFixed(2) + 'px');
            }
          }

          pendingPointer = null;
        }
        rafPointerId = null;
      });
    }

    // Reset idle timer
    clearTimeout(idleTimer);
    idleTimer = setTimeout(returnToCenterSmooth, IDLE_DELAY_MS);
  }

  function onPointerLeave() {
    if (rafPointerId) {
      cancelAnimationFrame(rafPointerId);
      rafPointerId = null;
      pendingPointer = null;
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(returnToCenterSmooth, 400);
  }

  // Initialize orbital card & speech bubble interactions immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initOrbitalInteractions();
      bootSplineRobot();
    }, { once: true });
  } else {
    initOrbitalInteractions();
    bootSplineRobot();
  }

})();
