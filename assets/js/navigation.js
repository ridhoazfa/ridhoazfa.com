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

    // 1. Navbar Scroll State Controller (with Dual-Threshold Hysteresis & 60fps rAF Debouncing)
    if (nav) {
      let isScrolled = false;
      let rafPending = false;

      const updateScroll = () => {
        const currentY = window.scrollY;
        // Dual-threshold hysteresis: activate at > 48px, deactivate at < 18px
        if (!isScrolled && currentY > 48) {
          isScrolled = true;
          nav.classList.add('scrolled');
        } else if (isScrolled && currentY < 18) {
          isScrolled = false;
          nav.classList.remove('scrolled');
        }
        rafPending = false;
      };

      const handleScroll = () => {
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
