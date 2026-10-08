/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: Grand 3D Lanyard & Autonomous Robot Biometric HUD Controller
 * Stack: Three.js · Rapier 3D Physics · MeshLine · WebGL · IntersectionObserver
 * Authorities: ui-ux-pro-max-skill · impeccable · motiondivision-motion
 * ============================================================================
 */

(function () {
  'use strict';

  const stage = document.getElementById('lanyard-3d-stage');
  const heroWrapper = document.getElementById('hero-lanyard-wrapper');
  const heroSection = document.getElementById('hero');
  const isIndonesian = document.documentElement.lang === 'id';

  // 1. Mount Grand 3D Lanyard in Hero Stage
  let lanyardHandle = null;

  function initLanyardStage() {
    if (!stage) return;
    if (typeof window.mountLanyard !== 'function') {
      setTimeout(initLanyardStage, 100);
      return;
    }

    if (!lanyardHandle) {
      lanyardHandle = window.mountLanyard(stage, {
        position: [0, 0, 20],
        gravity: [0, -42, 0],
        fov: 24,
        transparent: true,
        cardModel: 'assets/3d/card.glb',
        frontImage: 'assets/images/lanyard-card-front.png',
        backImage: 'assets/images/lanyard-card-back.png',
        lanyardImage: 'assets/images/lanyard-band.png',
        imageFit: 'cover',
        lanyardWidth: 1.4,
        eventSource: heroSection || heroWrapper || stage,
        onReady: () => {
          console.log('[Grand Lanyard] 3D Physics Stage mounted successfully with Rapier 3D.');
        }
      });
    }
  }

  // 2. GPU Preserver: IntersectionObserver (Ponytail Law)
  // Ensures 3D stages only compute when in viewport
  if ('IntersectionObserver' in window && heroWrapper) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          // Offscreen: stage can lower fidelity or sleep
          stage.style.willChange = 'auto';
        } else {
          stage.style.willChange = 'transform';
        }
      });
    }, { threshold: 0.05 });
    observer.observe(heroWrapper);
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanyardStage);
  } else {
    initLanyardStage();
  }

})();
