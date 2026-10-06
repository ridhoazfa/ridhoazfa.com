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
      if (typeof appInstance.setBackgroundColor === 'function') {
        appInstance.setBackgroundColor('#04060C');
      }
      window.__SPLINE_APP__ = appInstance;
      console.log('[NEXBOT 3D] WebGL Canvas mounted with local binary and #04060C void background.');

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
      // Pauses rendering if hero is scrolled out of viewport
      // ────────────────────────────────────────────────────────────────────────
      const heroSection = document.getElementById('hero');
      if (heroSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isSceneActive = entry.isIntersecting;
            if (appInstance && typeof appInstance.play === 'function' && typeof appInstance.stop === 'function') {
              if (entry.isIntersecting) {
                appInstance.play();
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
        observer.observe(heroSection);
      }

    } catch (err) {
      console.warn('[NEXBOT 3D] Native WebGL boot failed, checking fallback:', err);
      // Notify loader to dismiss gracefully rather than hanging
      window.dispatchEvent(new CustomEvent('ra-spline:ready'));
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Autonomous Gaze Attention Engine
  // ──────────────────────────────────────────────────────────────────────────
  let idleTimer = null;
  let decayRafId = null;
  let lastPointer = { x: 0, y: 0 };
  let isIdleAtCenter = true;

  const IDLE_DELAY_MS = 1200;      // 1.2s biological gaze dwell threshold
  const DECAY_DURATION_MS = 800;   // 800ms cubic ease-out return

  function dispatchCoords(x, y) {
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
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    const startX = lastPointer.x;
    const startY = lastPointer.y;

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
      }
    }

    decayRafId = requestAnimationFrame(tick);
  }

  function onGlobalPointerMove(e) {
    if (!isSceneActive || e.target === canvas) return;

    // Interrupt any active recentering decay immediately
    if (decayRafId) {
      cancelAnimationFrame(decayRafId);
      decayRafId = null;
    }
    isIdleAtCenter = false;

    // Dispatch live cursor coordinates
    dispatchCoords(e.clientX, e.clientY);

    // Reset idle timer
    clearTimeout(idleTimer);
    idleTimer = setTimeout(returnToCenterSmooth, IDLE_DELAY_MS);
  }

  function onPointerLeave() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(returnToCenterSmooth, 400);
  }

  // Defer boot to idle or after DOMContentLoaded to ensure zero LCP competition
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootSplineRobot, { once: true });
  } else {
    bootSplineRobot();
  }

})();
