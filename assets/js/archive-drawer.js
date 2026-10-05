/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: Declassified Vintage Vault Drawer & 24 Niche Matrix Filter
 * Authorities: ui-ux-pro-max-skill · motiondivision-motion · emilkowalski-skills
 * ============================================================================
 */

(function () {
  'use strict';

  function initArchiveAndFilters() {
    // 1. Declassified Vintage Vault Drawer Toggle
    const vaultTrigger = document.getElementById('vault-trigger');
    const vaultContent = document.getElementById('vault-content');

    if (vaultTrigger && vaultContent) {
      vaultTrigger.addEventListener('click', () => {
        const isOpen = vaultContent.classList.contains('open');
        const statusText = document.getElementById('vault-status-text');
        const isId = document.documentElement.lang === 'id';

        if (isOpen) {
          vaultContent.classList.remove('open');
          vaultTrigger.setAttribute('aria-expanded', 'false');
          if (statusText) statusText.textContent = isId ? 'BUKA ARSIP [EXPAND]' : 'TOGGLE ARCHIVE [EXPAND]';
        } else {
          vaultContent.classList.add('open');
          vaultTrigger.setAttribute('aria-expanded', 'true');
          if (statusText) statusText.textContent = isId ? 'TUTUP ARSIP [COLLAPSE]' : 'TOGGLE ARCHIVE [COLLAPSE]';
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

          const matchingCards = [];
          const nonMatchingCards = [];

          matrixCards.forEach((card) => {
            const cardCluster = card.getAttribute('data-cluster');
            if (cluster === 'all' || cardCluster === cluster) {
              matchingCards.push(card);
            } else {
              nonMatchingCards.push(card);
            }
          });

          // Prevent tween collisions on rapid user tab clicks
          if (typeof gsap !== 'undefined') {
            gsap.killTweensOf(matrixCards);

            gsap.to(nonMatchingCards, {
              opacity: 0,
              scale: 0.95,
              duration: 0.18,
              ease: 'power2.in',
              onComplete: () => {
                nonMatchingCards.forEach((c) => {
                  c.style.display = 'none';
                });
                matchingCards.forEach((c) => {
                  c.style.display = 'flex';
                  c.style.opacity = '0';
                  c.style.transform = 'scale(0.96)';
                });
                gsap.to(matchingCards, {
                  opacity: 1,
                  scale: 1,
                  duration: 0.3,
                  stagger: 0.025,
                  ease: 'power2.out'
                });
              }
            });
          } else {
            nonMatchingCards.forEach((c) => {
              c.style.display = 'none';
            });
            matchingCards.forEach((c) => {
              c.style.display = 'flex';
              c.style.opacity = '1';
              c.style.transform = 'scale(1)';
            });
          }
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArchiveAndFilters);
  } else {
    initArchiveAndFilters();
  }
})();
