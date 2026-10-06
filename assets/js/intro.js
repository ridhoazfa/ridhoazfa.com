/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: First-Visit Monogram Handoff Intro & 3D Viewport Loader
 * Authorities: ui-ux-pro-max-skill · impeccable · emilkowalski-skills
 * ============================================================================
 */

(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────────────────────
  // 1. First-Visit Sovereign Intro ("Monogram Handoff")
  // ──────────────────────────────────────────────────────────────────────────
  const curtain = document.getElementById('ra-intro-curtain');
  const introMonogram = document.getElementById('ra-intro-monogram');
  const lineFill = document.getElementById('ra-intro-line-fill');
  const isIntroActive = document.documentElement.classList.contains('ra-intro-active');

  function completeIntro() {
    if (!curtain || curtain.dataset.completed === 'true') return;
    curtain.dataset.completed = 'true';

    try {
      sessionStorage.setItem('ra_intro_seen', '1');
    } catch (e) {}

    // Find destination target monogram in the top-left navigation
    const targetMonogram = document.querySelector('.hud-brand .hud-monogram');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (introMonogram && targetMonogram && !prefersReducedMotion && typeof introMonogram.animate === 'function') {
      const srcRect = introMonogram.getBoundingClientRect();
      const destRect = targetMonogram.getBoundingClientRect();

      // Only perform spatial FLIP flight if target is visible and laid out
      if (destRect.width > 0 && destRect.height > 0) {
        const deltaX = destRect.left - srcRect.left;
        const deltaY = destRect.top - srcRect.top;
        const scale = destRect.width / srcRect.width;

        // Native WAAPI animation for the monogram
        introMonogram.animate([
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
          { transform: `translate3d(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`, opacity: 0.95 }
        ], {
          duration: 650,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards'
        });
      }
    }

    // Curtain reveal transition
    curtain.style.transition = 'opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), clip-path 650ms cubic-bezier(0.16, 1, 0.3, 1)';
    curtain.style.clipPath = 'inset(0 0 100% 0)';
    curtain.style.opacity = '0';

    setTimeout(() => {
      document.documentElement.classList.remove('ra-intro-active');
      if (curtain.parentNode) {
        curtain.style.display = 'none';
      }
      window.dispatchEvent(new CustomEvent('ra-intro:done'));
    }, 600);
  }

  if (isIntroActive && curtain) {
    let progress = 10;
    if (lineFill) lineFill.style.width = '10%';

    function setProgress(val) {
      if (val > progress && lineFill) {
        progress = val;
        lineFill.style.width = `${progress}%`;
      }
    }

    // Progress updates based on real browser readiness milestones
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setProgress(50), { once: true });
    } else {
      setProgress(50);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setProgress(85)).catch(() => {});
    }

    // Minimum display pacing (850ms) for high-craft editorial cadence
    const minTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(completeIntro, 180);
    }, 850);

    // Hard cap watchdog (1600ms) guarantee
    const maxWatchdog = setTimeout(() => {
      setProgress(100);
      completeIntro();
    }, 1600);

    // User-initiated early skip handlers (click, keydown, touch, wheel)
    function onSkip() {
      clearTimeout(minTimer);
      clearTimeout(maxWatchdog);
      setProgress(100);
      completeIntro();
      cleanupListeners();
    }

    function cleanupListeners() {
      window.removeEventListener('keydown', onSkip);
      window.removeEventListener('click', onSkip);
      window.removeEventListener('touchstart', onSkip);
      window.removeEventListener('wheel', onSkip);
    }

    window.addEventListener('keydown', onSkip, { once: true });
    window.addEventListener('click', onSkip, { once: true });
    window.addEventListener('touchstart', onSkip, { once: true, passive: true });
    window.addEventListener('wheel', onSkip, { once: true, passive: true });

  } else {
    // If intro was already seen, reduced motion is active, or not configured: dispatch immediately
    if (curtain) curtain.style.display = 'none';
    window.dispatchEvent(new CustomEvent('ra-intro:done'));
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. 3D CAD Viewport Loader (Covers Spline WebGL 3-6s initial mount)
  // ──────────────────────────────────────────────────────────────────────────
  function initViewportLoader() {
    const canvas = document.getElementById('spline-robot-canvas');
    const iframe = document.getElementById('spline-robot-iframe');
    const loader = document.getElementById('cad-viewport-loader');
    const viewportFrame = document.getElementById('cad-viewport-frame');

    if ((!canvas && !iframe) || !loader) return;

    let dismissed = false;
    function dismissLoader() {
      if (dismissed) return;
      dismissed = true;

      // Allow 700ms for Spline canvas to finish initial WebGL frame render after boot
      setTimeout(() => {
        loader.style.transition = 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)';
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';

        if (viewportFrame) {
          viewportFrame.setAttribute('aria-busy', 'false');
        }

        setTimeout(() => {
          loader.style.display = 'none';
        }, 520);
      }, 700);
    }

    // Attach to native canvas custom event and iframe load event
    window.addEventListener('ra-spline:ready', dismissLoader, { once: true });
    if (iframe) iframe.addEventListener('load', dismissLoader, { once: true });

    // Safety fallback: dismiss after 8s if event is suppressed
    setTimeout(dismissLoader, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewportLoader, { once: true });
  } else {
    initViewportLoader();
  }

})();
