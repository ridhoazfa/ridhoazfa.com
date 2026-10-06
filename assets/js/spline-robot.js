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
      console.log('[NEXBOT 3D] WebGL Canvas mounted with local binary.');

      // Signal intro / loader controller that 3D scene is active
      window.dispatchEvent(new CustomEvent('ra-spline:ready'));

      // ────────────────────────────────────────────────────────────────────────
      // Whole-Viewport Pointer Tracking (Screen-Wide Gaze Direction)
      // ────────────────────────────────────────────────────────────────────────
      if (hasPointerFine && !prefersReducedMotion) {
        window.addEventListener('pointermove', onGlobalPointerMove, { passive: true });
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

  function onGlobalPointerMove(e) {
    if (!isSceneActive || e.target === canvas) return;

    // Dispatch synthetic PointerEvent with viewport coordinates directly to canvas
    const synthEvent = new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pageX: e.pageX,
      pageY: e.pageY,
      pointerId: e.pointerId || 1,
      pointerType: e.pointerType || 'mouse',
      isPrimary: true,
      buttons: e.buttons,
      button: e.button
    });

    canvas.dispatchEvent(synthEvent);
  }

  // Defer boot to idle or after DOMContentLoaded to ensure zero LCP competition
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootSplineRobot, { once: true });
  } else {
    bootSplineRobot();
  }

})();
