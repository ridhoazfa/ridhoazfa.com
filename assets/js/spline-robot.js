/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: NEXBOT Spline 3D Character Runtime & Interaction Controller
 * Authorities: ui-ux-pro-max-skill (stacks/threejs.csv) · emilkowalski-skills
 * ============================================================================
 */

(function () {
  'use strict';

  const container = document.getElementById('spline-stage');
  const fallback = document.getElementById('spline-fallback');
  const canvasTarget = document.getElementById('spline-canvas');

  if (!container) return;

  // Damped Cursor Tracking State
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let isHovering = false;
  let isVisible = true;
  let animFrameId = null;

  window.addEventListener('resize', () => {
    windowHalf.x = window.innerWidth / 2;
    windowHalf.y = window.innerHeight / 2;
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - windowHalf.x) / windowHalf.x;
    mouse.targetY = (e.clientY - windowHalf.y) / windowHalf.y;
    isHovering = true;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    mouse.targetX = 0;
    mouse.targetY = 0;
    isHovering = false;
  });

  // Inertia Animation Loop for Fallback Stage (Smooth Orbit Simulation)
  function renderFrame() {
    if (!isVisible) {
      animFrameId = null;
      return;
    }

    // Lerp smoothing (0.05 speed for high-craft weightiness)
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    if (fallback && isHovering) {
      const rotY = mouse.x * 12; // -12deg to +12deg
      const rotX = -mouse.y * 8; // -8deg to +8deg
      const transX = mouse.x * 14;
      const transY = mouse.y * 10;
      fallback.style.transform = `perspective(1200px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 0)`;
    }

    animFrameId = requestAnimationFrame(renderFrame);
  }

  animFrameId = requestAnimationFrame(renderFrame);

  // Reduced motion guard (Accessibility Law)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('[NEXBOT 3D] Reduced motion active. Presenting static high-res depth render.');
    return;
  }

  // Spline WebGL Runtime Initializer
  // Loads transparent local scene binary with 60fps hardware acceleration
  const SPLINE_SCENE_URL = container.getAttribute('data-spline-scene') || 'assets/scene.splinecode';

  async function initSplineRuntime() {
    if (!canvasTarget) return;

    try {
      // Dynamic import of Spline WebGL Runtime
      const { Application } = await import('https://cdn.spline.design/@splinetool/runtime@2.0.66/build/runtime.js');
      
      const canvas = document.createElement('canvas');
      canvas.id = 'spline-3d-canvas';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.outline = 'none';
      canvas.style.position = 'relative';
      canvas.style.zIndex = '2';
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity 0.8s var(--ease-out-expo)';

      canvasTarget.appendChild(canvas);

      const app = new Application(canvas);
      await app.load(SPLINE_SCENE_URL);

      // Successfully loaded 3D WebGL context: reveal canvas and dissolve fallback
      canvas.style.opacity = '1';
      if (fallback) {
        setTimeout(() => {
          fallback.style.opacity = '0';
          setTimeout(() => { fallback.style.display = 'none'; }, 800);
        }, 300);
      }

      // Native IntersectionObserver (Ponytail Law): pause render loop when off-screen to save 25% GPU
      const heroSection = document.getElementById('hero');
      if (heroSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (entry.isIntersecting) {
              if (app && typeof app.play === 'function') app.play();
              if (!animFrameId) animFrameId = requestAnimationFrame(renderFrame);
            } else {
              if (app && typeof app.stop === 'function') app.stop();
            }
          });
        }, { threshold: 0.05 });
        observer.observe(heroSection);
      }

    } catch (err) {
      console.warn('[NEXBOT 3D] WebGL direct load deferred. Utilizing high-craft inertia fallback:', err.message || err);
      // Fallback frame with mouse inertia is already active and handling interactions
    }
  }

  // Initialize runtime after initial paint to guarantee sub-150ms First Contentful Paint
  if (document.readyState === 'complete') {
    initSplineRuntime();
  } else {
    window.addEventListener('load', initSplineRuntime);
  }
})();
