/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: GSAP ScrollTrigger Bi-Directional Choreography Engine
 * Authorities: gsap-skills (scrolltrigger, timeline) · impeccable (anti-slop)
 * ============================================================================
 */

(function () {
  'use strict';

  // Reduced motion guard: if visitor prefers reduced motion, skip GSAP timelines
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Motion] Reduced motion preferred. Static rendering active.');
    return;
  }

  function initScrollChoreography() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[Motion] GSAP or ScrollTrigger not loaded. Using static layout.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // 1. Cosmic Parallax Scrub (Deep Space Multi-Layer Dimension)
    if (document.querySelector('.space-stars-1')) {
      gsap.to('.space-stars-1', {
        y: -140,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });
    }

    if (document.querySelector('.space-stars-2')) {
      gsap.to('.space-stars-2', {
        y: -320,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5
        }
      });
    }

    if (document.querySelector('.space-nebula-mid')) {
      gsap.to('.space-nebula-mid', {
        y: -220,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2
        }
      });
    }

    // 2. Hero Stagger Entrance (Coordinated with Intro Handoff)
    function playHeroEntrance() {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .fromTo('.eyebrow-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.05 })
        .fromTo('.hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.35')
        .fromTo('.hero-lead', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.45')
        .fromTo('.hero-channels-strip .hero-channel-pill', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.6 }, '-=0.4')
        .fromTo('.cad-stage-wrapper', { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out' }, '-=0.6');
    }

    if (document.documentElement.classList.contains('ra-intro-active')) {
      window.addEventListener('ra-intro:done', playHeroEntrance, { once: true });
    } else {
      playHeroEntrance();
    }

    // 3. Section Titles & Badges Scroll Reveal
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

    // 4. Section 01: The Sovereign Blueprint (Dossier, Odyssey & Manifesto)
    if (document.querySelector('.about-grid-luxury')) {
      gsap.from('.architect-dossier-card', {
        scrollTrigger: {
          trigger: '.about-grid-luxury',
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        },
        x: -30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.odyssey-lead-card', {
        scrollTrigger: {
          trigger: '.about-grid-luxury',
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });

      gsap.from('.manifesto-grid .manifesto-card', {
        scrollTrigger: {
          trigger: '.about-grid-luxury',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        y: 25,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    // 5. Section 02: Selected Work Cards Stagger
    if (document.querySelector('.ecosystem-grid')) {
      gsap.fromTo('.ecosystem-card',
        { y: 35, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.ecosystem-grid',
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true
          },
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out'
        }
      );
    }

    // 6. Section 03: Credentials Trio Reveal (Academic, AWS, Languages)
    if (document.querySelector('.credentials-grid-trio')) {
      gsap.from('.credentials-grid-trio .credential-pillar-card', {
        scrollTrigger: {
          trigger: '.credentials-grid-trio',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out'
      });
    }

    // 7. Section 04: Technical Arsenal Stack Grid Reveal
    if (document.querySelector('.stack-grid')) {
      gsap.from('.stack-category-card', {
        scrollTrigger: {
          trigger: '.stack-grid',
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    // 8. Giant Editorial Wordmark ("Ridho Azfa") Parallax Rise
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

    // 9. Interactive Cosmic Torch Cursor Lighting
    const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (hasPointer) {
      let rafTorch = null;
      window.addEventListener('pointermove', (e) => {
        if (rafTorch) return;
        rafTorch = requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
          rafTorch = null;
        });
      }, { passive: true });
    }

    // 10. Floating Speech Bubble Interaction
    const speechBubble = document.getElementById('robot-speech-bubble');
    if (speechBubble) {
      speechBubble.addEventListener('click', (e) => {
        const contactTarget = document.getElementById('contact');
        if (contactTarget) {
          e.preventDefault();
          contactTarget.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollChoreography);
  } else {
    initScrollChoreography();
  }
})();
