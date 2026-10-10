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
        .fromTo('.eyebrow-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.05 })
        .fromTo('.hero-lanyard-stage-wrapper', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0.1)
        .fromTo('.hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.15)
        .fromTo('.hero-lead', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.3)
        .fromTo('.hero-channels-strip .hero-channel-pill', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.5 }, 0.45);
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

    // 4. Section 01: About Me & Engineering Principles (Profile Card, Story & Principles)
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

      if (document.querySelector('.odyssey-narrative-article')) {
        gsap.from('.odyssey-narrative-article', {
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
      }

      if (document.querySelector('.principles-bento-grid .principle-bento-card')) {
        gsap.from('.principles-bento-grid .principle-bento-card', {
          scrollTrigger: {
            trigger: '.principles-bento-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 25,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out'
        });
      }
    }

    // 4b. Section 02: Systems Architecture Orbit (Continuous Natural Scroll & Seamless Orbital Stage)
    const orbitSection = document.querySelector('.section-autonomous-orbit');
    if (orbitSection) {
      // Floating Header Entrance
      gsap.from('.orbit-stage-header', {
        scrollTrigger: {
          trigger: orbitSection,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        },
        y: -24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform'
      });

      // Dual 3D Canvases Smooth Reveal
      gsap.from('.celestial-3d-canvas', {
        scrollTrigger: {
          trigger: orbitSection,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        },
        opacity: 0,
        duration: 1.0,
        ease: 'power2.out'
      });

      // Center 3D Robot Anchor Grounded at Solar System Core
      gsap.from('.orbit-robot-anchor', {
        scrollTrigger: {
          trigger: orbitSection,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        },
        scale: 0.94,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out'
      });

      // Conversational Speech Bubble
      if (document.querySelector('.orbit-robot-bubble')) {
        gsap.from('.orbit-robot-bubble', {
          scrollTrigger: {
            trigger: orbitSection,
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true
          },
          scale: 0.88,
          opacity: 0,
          delay: 0.2,
          duration: 0.7,
          ease: 'back.out(1.4)'
        });
      }
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

      // 5b. React Bits SpotlightCard cursor illumination for Selected Work
      const ecosystemCards = document.querySelectorAll('.ecosystem-card');
      ecosystemCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--spotlight-x', `${x}px`);
          card.style.setProperty('--spotlight-y', `${y}px`);
        });
      });
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

    // 9. Interactive Cosmic Torch Cursor Lighting & React Bits Magnetic Buttons
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

      // 9b. React Bits Magnetic Buttons for Hero CTAs
      const magneticTargets = document.querySelectorAll('.btn-primary-hero, .btn-secondary-hero');
      magneticTargets.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (e.clientX - centerX) * 0.28;
          const deltaY = (e.clientY - centerY) * 0.28;
          btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate3d(0, 0, 0)';
          btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        btn.addEventListener('mouseenter', () => {
          btn.style.transition = 'none';
        });
      });
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
