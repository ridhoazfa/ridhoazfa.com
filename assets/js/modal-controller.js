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
