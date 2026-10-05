/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: Declassified Vintage Vault Drawer & 24 Niche Matrix Filter
 * Authorities: ui-ux-pro-max-skill · motiondivision-motion · emilkowalski-skills
 * ============================================================================
 */

(function () {
  'use strict';

  // Watchdog timer (Ponytail Law)
  const watchdog = setTimeout(() => {}, 25000);
  watchdog.unref();

  window.addEventListener('DOMContentLoaded', () => {
    // 1. Declassified Vintage Vault Drawer Toggle
    const vaultTrigger = document.getElementById('vault-trigger');
    const vaultContent = document.getElementById('vault-content');
    const vaultIcon = document.getElementById('vault-icon');

    if (vaultTrigger && vaultContent) {
      vaultTrigger.addEventListener('click', () => {
        const isOpen = vaultContent.classList.contains('open');
        if (isOpen) {
          vaultContent.classList.remove('open');
          if (vaultIcon) vaultIcon.className = 'fas fa-chevron-down';
          vaultTrigger.setAttribute('aria-expanded', 'false');
        } else {
          vaultContent.classList.add('open');
          if (vaultIcon) vaultIcon.className = 'fas fa-chevron-up';
          vaultTrigger.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // 2. 24 Niche Web Matrix Cluster Filter
    const filterButtons = document.querySelectorAll('.matrix-filter-bar .filter-btn');
    const matrixCards = document.querySelectorAll('.matrix-grid .matrix-card');

    if (filterButtons.length && matrixCards.length) {
      filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          // Remove active from all
          filterButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const cluster = btn.getAttribute('data-cluster') || 'all';

          matrixCards.forEach((card) => {
            const cardCluster = card.getAttribute('data-cluster');
            if (cluster === 'all' || cardCluster === cluster) {
              card.style.display = 'flex';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            } else {
              card.style.display = 'none';
              card.style.opacity = '0';
              card.style.transform = 'scale(0.96)';
            }
          });
        });
      });
    }
  });
})();
