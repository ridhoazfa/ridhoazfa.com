/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: NEXBOT Spline 3D Character Runtime & Interaction Controller
 * Authorities: ui-ux-pro-max-skill (stacks/threejs.csv) · emilkowalski-skills
 * ============================================================================
 */

(function () {
  'use strict';

  // Watchdog timer (Ponytail Law)
  const watchdog = setTimeout(() => {
    // Clean timeout to drain event loop
  }, 25000);
  watchdog.unref();

  const container = document.getElementById('spline-stage');
  const fallback = document.getElementById('spline-fallback');
  const canvasTarget = document.getElementById('spline-canvas');

  if (!container) return;

  // Damped Cursor Tracking State
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let isHovering = false;

  window.addEventListener('resize', () => {
    windowHalf.x = window.innerWidth / 2;
    windowHalf.y = window.innerHeight / 2;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - windowHalf.x) / windowHalf.x;
    mouse.targetY = (e.clientY - windowHalf.y) / windowHalf.y;
    isHovering = true;
  });

  document.addEventListener('mouseleave', () => {
    mouse.targetX = 0;
    mouse.targetY = 0;
    isHovering = false;
  });

  // Inertia Animation Loop for Character Stage (Smooth Orbit Simulation)
  function renderFrame() {
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

    requestAnimationFrame(renderFrame);
  }

  requestAnimationFrame(renderFrame);

  // Spline Viewer Runtime Initializer
  // Supports loading published Spline scene: https://prod.spline.design/.../scene.splinecode
  const SPLINE_SCENE_URL = container.getAttribute('data-spline-scene') || '';

  if (SPLINE_SCENE_URL && window.SplineViewer) {
    const viewer = document.createElement('spline-viewer');
    viewer.setAttribute('url', SPLINE_SCENE_URL);
    viewer.setAttribute('loading-anim-type', 'none');
    viewer.style.width = '100%';
    viewer.style.height = '100%';
    viewer.style.position = 'relative';
    viewer.style.zIndex = '2';

    viewer.addEventListener('load', () => {
      if (fallback) {
        fallback.style.opacity = '0';
        setTimeout(() => { fallback.style.display = 'none'; }, 600);
      }
    });

    if (canvasTarget) {
      canvasTarget.appendChild(viewer);
    }
  }
})();
