/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: Resilient HUD Navigation & Mobile Command Sheet Controller
 * Authorities: ui-ux-pro-max-skill (Priority 1: A11y & Touch) · impeccable v4.5.0
 * Note: Guaranteed unconditional execution. NEVER gated by reduced-motion.
 * ============================================================================
 */

(function () {
  'use strict';

  function initNavigation() {
    const nav = document.getElementById('hud-nav');
    const mobileToggle = document.getElementById('hud-mobile-toggle');
    const mobileDrawer = document.getElementById('hud-mobile-drawer');
    const mobileClose = document.getElementById('hud-mobile-close');
    const drawerLinks = document.querySelectorAll('.hud-mobile-drawer .drawer-link');

    // 1. Navbar Scroll State Controller (Compositor-Optimized & 120fps rAF Debouncing)
    if (nav) {
      let isScrolled = false;
      let rafPending = false;

      const updateScroll = () => {
        const currentY = window.scrollY;
        // Clean single threshold with immediate apex guard (zero lag)
        const shouldBeScrolled = currentY > 20;
        if (shouldBeScrolled !== isScrolled) {
          isScrolled = shouldBeScrolled;
          if (isScrolled) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
        }
        rafPending = false;
      };

      const handleScroll = () => {
        // Immediate apex guard: if at very top, don't wait for rAF tick to clear
        if (window.scrollY === 0 && isScrolled) {
          isScrolled = false;
          nav.classList.remove('scrolled');
        }

        if (!rafPending) {
          rafPending = true;
          window.requestAnimationFrame(updateScroll);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      updateScroll(); // Initial check on load
    }

    // 2. Mobile Navigation Command Sheet Controller
    if (mobileToggle && mobileDrawer) {
      // Ensure drawer is inert by default on boot
      mobileDrawer.setAttribute('inert', '');

      const openDrawer = () => {
        mobileDrawer.classList.add('active');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        mobileDrawer.removeAttribute('inert');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      };

      const closeDrawer = () => {
        mobileDrawer.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        mobileDrawer.setAttribute('inert', '');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };

      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileDrawer.classList.contains('active');
        if (isOpen) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });

      if (mobileClose) {
        mobileClose.addEventListener('click', (e) => {
          e.stopPropagation();
          closeDrawer();
        });
      }

      // Close on drawer link click
      drawerLinks.forEach((link) => {
        link.addEventListener('click', closeDrawer);
      });

      // Close on backdrop / outside click
      mobileDrawer.addEventListener('click', (e) => {
        if (e.target === mobileDrawer) {
          closeDrawer();
        }
      });

      // Accessibility: Close on Escape key press
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
          closeDrawer();
          mobileToggle.focus();
        }
      });
    }

    // 3. Clean-URL In-Page Smooth Scroll Controller (Zero #hash in Address Bar)
    function initCleanUrlNavigation() {
      document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();

          if (targetId === 'hero') {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            const nav = document.getElementById('hud-nav');
            const navHeight = nav ? nav.offsetHeight + 16 : 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: 'smooth'
            });
          }

          // Accessibility: shift focus without forcing browser scroll
          if (!targetElement.hasAttribute('tabindex')) {
            targetElement.setAttribute('tabindex', '-1');
          }
          targetElement.focus({ preventScroll: true });

          // Keep address bar pristine: silently strip any residual hash without page jump
          if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }
      });

      // Handle direct landing and external hash links silently
      function sanitizeHashAndScroll(targetId) {
        const id = targetId || (window.location.hash ? window.location.hash.substring(1) : '');
        if (!id) return;

        // Instantly sanitize address bar so no #hash lingers
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        const executeScroll = () => {
          const target = document.getElementById(id);
          if (target) {
            if (id === 'hero') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              const nav = document.getElementById('hud-nav');
              const navHeight = nav ? nav.offsetHeight + 16 : 80;
              const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
              window.scrollTo({ top: Math.max(0, targetPos), behavior: 'smooth' });
            }
          }
        };

        // If first-visit intro curtain is running, wait until intro sequence completes
        if (document.documentElement.classList.contains('ra-intro-active')) {
          window.addEventListener('ra-intro:done', () => {
            setTimeout(executeScroll, 120);
          }, { once: true });
        } else {
          setTimeout(executeScroll, 100);
        }
      }

      // Initial page load with hash
      if (window.location.hash) {
        sanitizeHashAndScroll();
      }

      // Same-document hash navigations
      window.addEventListener('hashchange', () => {
        sanitizeHashAndScroll();
      });
    }

    initCleanUrlNavigation();

    // 4. Commercial Websites Catalog Drawer Toggle
    const catalogBtn = document.getElementById('btn-expand-catalog');
    const catalogDrawer = document.getElementById('websites-catalog-drawer');
    if (catalogBtn && catalogDrawer) {
      catalogBtn.addEventListener('click', () => {
        const isExpanded = catalogBtn.getAttribute('aria-expanded') === 'true';
        catalogBtn.setAttribute('aria-expanded', String(!isExpanded));
        if (!isExpanded) {
          catalogDrawer.classList.add('is-open');
          catalogDrawer.removeAttribute('inert');
          setTimeout(() => {
            const rect = catalogDrawer.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
              catalogDrawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 60);
        } else {
          catalogDrawer.classList.remove('is-open');
          catalogDrawer.setAttribute('inert', '');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
