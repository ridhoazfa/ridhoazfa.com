/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: GSAP ScrollTrigger Bi-Directional Choreography Engine
 * Authorities: gsap-skills (scrolltrigger, timeline) · impeccable (anti-slop)
 * ============================================================================
 */

(function () {
  'use strict';

  // Watchdog timer (Ponytail Law)
  const watchdog = setTimeout(() => {}, 25000);
  watchdog.unref();

  // Reduced motion guard
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Motion] Reduced motion preferred. Static rendering mode enabled.');
    return;
  }

  window.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll state controller
    const nav = document.getElementById('hud-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[Motion] GSAP or ScrollTrigger not loaded. Using CSS transitions fallback.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Stagger Entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    heroTl
      .from('.eyebrow-badge', { y: 20, opacity: 0, duration: 0.7, delay: 0.2 })
      .from('.hero-title', { y: 35, opacity: 0, duration: 1.1 }, '-=0.4')
      .from('.hero-lead', { y: 25, opacity: 0, duration: 0.9 }, '-=0.7')
      .from('.hero-actions', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero-telemetry-strip .telemetry-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.8 }, '-=0.6')
      .from('.spline-stage-wrapper', { scale: 0.92, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=1');

    // 2. Section Titles & Badges Scroll Reveal
    gsap.utils.toArray('.section-head').forEach((head) => {
      gsap.from(head, {
        scrollTrigger: {
          trigger: head,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });
    });

    // 3. Section Blueprint: Founder Portrait & Philosophy Cards
    if (document.querySelector('.blueprint-grid')) {
      gsap.from('.architect-frame', {
        scrollTrigger: {
          trigger: '.blueprint-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        x: -30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.philosophy-card', {
        scrollTrigger: {
          trigger: '.blueprint-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        x: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // 4. Codaxiom Ecosystem Cards Stagger
    if (document.querySelector('.ecosystem-grid')) {
      gsap.from('.ecosystem-card', {
        scrollTrigger: {
          trigger: '.ecosystem-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        },
        y: 45,
        opacity: 0,
        stagger: 0.16,
        duration: 0.95,
        ease: 'power3.out'
      });
    }

    // 5. 24 Niche Web Matrix Cards Stagger
    if (document.querySelector('.matrix-grid')) {
      gsap.from('.matrix-card', {
        scrollTrigger: {
          trigger: '.matrix-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        stagger: 0.04,
        duration: 0.7,
        ease: 'power2.out'
      });
    }

    // 6. Giant Editorial Wordmark ("RIDHO AZFA") Parallax Rise
    const footerMark = document.querySelector('.portfolio-footer-mark');
    if (footerMark) {
      gsap.fromTo(footerMark, 
        { y: '35%', opacity: 0.6 },
        {
          scrollTrigger: {
            trigger: '.sovereign-footer',
            start: 'top 90%',
            end: 'bottom bottom',
            scrub: 1.2
          },
          y: '18%',
          opacity: 1,
          ease: 'none'
        }
      );
    }

    // 7. Mobile Navigation Drawer Controller (Early Phase PRD Hardening)
    const mobileToggle = document.getElementById('hud-mobile-toggle');
    const mobileDrawer = document.getElementById('hud-mobile-drawer');
    const mobileClose = document.getElementById('hud-mobile-close');
    const drawerLinks = document.querySelectorAll('.hud-mobile-drawer .drawer-link');

    if (mobileToggle && mobileDrawer) {
      const openDrawer = () => {
        mobileDrawer.classList.add('active');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      };

      const closeDrawer = () => {
        mobileDrawer.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };

      mobileToggle.addEventListener('click', openDrawer);
      if (mobileClose) mobileClose.addEventListener('click', closeDrawer);

      drawerLinks.forEach((link) => {
        link.addEventListener('click', closeDrawer);
      });
    }
  });
})();
