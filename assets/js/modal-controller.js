/**
 * Atelier Modal & Lightbox Controller (Vanilla JS)
 * Handles accessible dialog lifecycles for:
 * 1. Computer Olympiad Certificate Lightbox (#cert-lightbox-modal)
 * 2. Curriculum Vitae Interactive Viewer (#cv-viewer-modal)
 * 
 * Complies with UI-UX-PRO-MAX Priority 1 (Accessibility & Keyboard Nav)
 */

(function () {
  'use strict';

  let lastFocusedElement = null;

  function openModal(modalId, triggerEl) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    lastFocusedElement = triggerEl || document.activeElement;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modal.removeAttribute('inert');
    document.body.classList.add('modal-open');

    // Lazy hydrate any iframe or image data-src
    modal.querySelectorAll('iframe[data-src]').forEach((iframe) => {
      if (!iframe.src || iframe.src === 'about:blank') {
        iframe.src = iframe.getAttribute('data-src');
      }
    });

    // Focus close button or first interactive element
    const closeBtn = modal.querySelector('.modal-close-trigger') || modal.querySelector('button, a');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    }
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('inert', '');

    // Check if any other modal is still active
    const remainingActive = document.querySelector('.atelier-modal-overlay.active');
    if (!remainingActive) {
      document.body.classList.remove('modal-open');
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function initModals() {
    // 1. Bind Open Triggers
    document.querySelectorAll('[data-open-modal]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-open-modal');
        openModal(targetId, btn);
      });

      // Accessible Enter / Space trigger for non-buttons
      if (btn.tagName !== 'BUTTON' && btn.tagName !== 'A') {
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const targetId = btn.getAttribute('data-open-modal');
            openModal(targetId, btn);
          }
        });
      }
    });

    // 2. Bind Close Triggers & Backdrop Clicks
    document.querySelectorAll('.atelier-modal-overlay').forEach((modal) => {
      // Backdrop click
      const backdrop = modal.querySelector('.atelier-modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => closeModal(modal));
      }

      // Close buttons
      modal.querySelectorAll('[data-close-modal], .modal-close-trigger').forEach((closeBtn) => {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          closeModal(modal);
        });
      });
    });

    // 3. Global Escape Key Listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.atelier-modal-overlay.active');
        if (activeModal) {
          e.preventDefault();
          closeModal(activeModal);
        }
      }
    });

    // 4. Interactive Project Mockup Stage Navigation ([data-mockup-href])
    function triggerMockupHref(el) {
      const href = el.getAttribute('data-mockup-href');
      if (!href) return;
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = href;
        }
      } else {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    }

    document.querySelectorAll('[data-mockup-href]').forEach((stage) => {
      stage.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        e.preventDefault();
        triggerMockupHref(stage);
      });
      stage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerMockupHref(stage);
        }
      });
    });

    // 5. 1-Click Brand Email Copy & Toast ([data-copy-email])
    let toastTimer = null;
    function showGlobalToast(message) {
      const toast = document.getElementById('atelier-global-toast');
      const msgEl = document.getElementById('atelier-toast-msg');
      if (!toast) return;
      if (msgEl && message) msgEl.textContent = message;
      toast.classList.add('visible');
      toast.setAttribute('aria-hidden', 'false');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('visible');
        toast.setAttribute('aria-hidden', 'true');
      }, 2800);
    }

    document.querySelectorAll('[data-copy-email]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = btn.getAttribute('data-copy-email');
        if (!email) return;

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(email);
          } else {
            const ta = document.createElement('textarea');
            ta.value = email;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
        } catch (_) {}

        const isIndonesian = document.documentElement.lang === 'id';
        const labelEl = btn.querySelector('[data-copy-label]');
        if (labelEl) {
          const prevText = labelEl.getAttribute('data-orig-text') || labelEl.textContent;
          labelEl.setAttribute('data-orig-text', prevText);
          labelEl.textContent = isIndonesian ? 'Tersalin!' : 'Copied!';
          setTimeout(() => {
            labelEl.textContent = prevText;
          }, 2400);
        }

        showGlobalToast(
          isIndonesian
            ? `Email disalin: ${email}`
            : `Copied to clipboard: ${email}`
        );
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModals);
  } else {
    initModals();
  }

  // Export to window for programmatic control if needed
  window.__ATELIER_MODAL__ = {
    open: openModal,
    close: closeModal
  };
})();

