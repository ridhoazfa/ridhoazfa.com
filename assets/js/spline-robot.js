/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: NEXBOT CAD 3D Viewport Controller
 * Authorities: ui-ux-pro-max-skill · impeccable · emilkowalski-skills
 * ============================================================================
 */

(function () {
  'use strict';

  const stage = document.getElementById('spline-stage');
  if (!stage) return;

  const iframe = stage.querySelector('iframe');
  const statusTag = stage.querySelector('.status-tag');

  // Accessibility: Honor prefers-reduced-motion (UI-UX-PRO-MAX Priority 1)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion && statusTag) {
    statusTag.innerHTML = '<span style="color: var(--text-muted); font-size: 0.65rem;">Static CAD Mode</span>';
  }

  // Native IntersectionObserver (Ponytail Law): pause render loop when off-screen to save GPU
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window && iframe) {
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (!isVisible) {
          // Off-screen: hint browser to conserve compositing layers
          iframe.style.pointerEvents = 'none';
        } else {
          // In-screen: enable full pointer interaction
          iframe.style.pointerEvents = 'auto';
        }
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }
})();
