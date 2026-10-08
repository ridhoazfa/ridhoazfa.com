/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA 3D PORTFOLIO
 * Component: Direct Contact Console (Interactive Contact Form)
 * Authorities: ui-ux-pro-max-skill · impeccable · emilkowalski-skills
 * ============================================================================
 */

(function () {
  'use strict';

  function initContactConsole() {
    const form = document.getElementById('contact-transmission-form');
    const nameInput = document.getElementById('tx-name');
    const emailInput = document.getElementById('tx-email');
    const messageInput = document.getElementById('tx-message');
    const charCounter = document.getElementById('tx-char-counter');
    const dispatchBtn = document.getElementById('tx-submit-btn');
    const statusBanner = document.getElementById('tx-status-banner');
    const copyEmailBtn = document.getElementById('btn-copy-email');

    // 1. Character Counter with Dynamic Limit
    const MAX_CHARS = 1000;
    if (messageInput && charCounter) {
      const updateCount = () => {
        const len = messageInput.value.length;
        charCounter.textContent = `${len} / ${MAX_CHARS}`;
        if (len > MAX_CHARS) {
          charCounter.style.color = '#ef4444';
        } else if (len > 800) {
          charCounter.style.color = '#f59e0b';
        } else {
          charCounter.style.color = 'var(--text-muted)';
        }
      };
      messageInput.addEventListener('input', updateCount);
      updateCount();
    }

    // 2. One-Click Email Copy Utility (Left Column)
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = 'ridho@codaxiom.com';
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(email);
          } else {
            const temp = document.createElement('textarea');
            temp.value = email;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
          }

          const originalHtml = copyEmailBtn.innerHTML;
          const isIndonesian = document.documentElement.lang === 'id';
          copyEmailBtn.innerHTML = `<i class="fas fa-check"></i> <span>${isIndonesian ? 'Tersalin!' : 'Copied!'}</span>`;
          copyEmailBtn.classList.add('copied');

          setTimeout(() => {
            copyEmailBtn.innerHTML = originalHtml;
            copyEmailBtn.classList.remove('copied');
          }, 2200);
        } catch (err) {
          console.warn('Clipboard copy failed:', err);
        }
      });
    }

    // 3. Form Submission & State Machine
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.tx-field-error').forEach(el => el.remove());
        form.classList.remove('form-error-shake');

        const name = (nameInput ? nameInput.value.trim() : '');
        const email = (emailInput ? emailInput.value.trim() : '');
        const message = (messageInput ? messageInput.value.trim() : '');

        const isIndonesian = document.documentElement.lang === 'id';

        // Validation
        let hasError = false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || name.length < 2) {
          showFieldError(nameInput, isIndonesian ? 'Harap masukkan nama lengkap (min 2 karakter)' : 'Please enter your name (min 2 characters)');
          hasError = true;
        }

        if (!email || !emailRegex.test(email)) {
          showFieldError(emailInput, isIndonesian ? 'Harap masukkan alamat email valid' : 'Please enter a valid email address');
          hasError = true;
        }

        if (!message || message.length < 5) {
          showFieldError(messageInput, isIndonesian ? 'Harap tuliskan pesan Anda (min 5 karakter)' : 'Please write your message (min 5 characters)');
          hasError = true;
        }

        if (hasError) {
          // Micro-interaction: Tactile shake on error (Emil Kowalski law)
          form.classList.add('form-error-shake');
          setTimeout(() => form.classList.remove('form-error-shake'), 400);
          return;
        }

        // Sending State
        const btnOriginalText = dispatchBtn.innerHTML;
        dispatchBtn.disabled = true;
        dispatchBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> <span>${isIndonesian ? 'Menyiapkan Email...' : 'Preparing Email...'}</span>`;

        await new Promise(r => setTimeout(r, 450));

        // Format formatted message payload
        const subject = `[Portfolio Inquiry] Message from ${name}`;
        const bodyContent = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n--\nSent from ridhoazfa.codaxiom.com Contact Form`;
        
        // Copy to clipboard for zero-loss guarantee
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(bodyContent);
          }
        } catch (clipErr) {
          console.warn('Clipboard write warning:', clipErr);
        }

        // Trigger mailto link
        const mailtoUrl = `mailto:ridho@codaxiom.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
        window.location.href = mailtoUrl;

        // Success State & Feedback Banner
        dispatchBtn.innerHTML = `<i class="fas fa-check"></i> <span>${isIndonesian ? 'Pesan Siap Dikirim!' : 'Message Ready!'}</span>`;
        dispatchBtn.classList.add('btn-success');

        if (statusBanner) {
          statusBanner.innerHTML = `
            <div class="tx-status-inner">
              <i class="fas fa-check-circle"></i>
              <div>
                <strong>${isIndonesian ? 'Aplikasi email dibuka & pesan tersalin ke clipboard!' : 'Email client opened & message copied to clipboard!'}</strong>
                <span>${isIndonesian ? 'Jika klien email tidak terbuka otomatis, Anda dapat menempel (paste) pesan ke ridho@codaxiom.com' : 'If your email app didn\'t open automatically, you can paste the copied payload directly to ridho@codaxiom.com'}</span>
              </div>
              <button type="button" class="tx-reset-btn" aria-label="Reset Form"><i class="fas fa-xmark"></i></button>
            </div>
          `;
          statusBanner.classList.add('active');

          const resetBtn = statusBanner.querySelector('.tx-reset-btn');
          if (resetBtn) {
            resetBtn.addEventListener('click', () => {
              statusBanner.classList.remove('active');
              form.reset();
              dispatchBtn.disabled = false;
              dispatchBtn.innerHTML = btnOriginalText;
              dispatchBtn.classList.remove('btn-success');
              if (charCounter) charCounter.textContent = `0 / ${MAX_CHARS}`;
            });
          }
        }

        // Auto reset button after 4 seconds
        setTimeout(() => {
          dispatchBtn.disabled = false;
          dispatchBtn.innerHTML = btnOriginalText;
          dispatchBtn.classList.remove('btn-success');
        }, 4000);
      });
    }

    function showFieldError(inputElement, msg) {
      if (!inputElement) return;
      const errorDiv = document.createElement('div');
      errorDiv.className = 'tx-field-error';
      errorDiv.innerHTML = `<i class="fas fa-circle-exclamation"></i> <span>${msg}</span>`;
      inputElement.parentNode.appendChild(errorDiv);
      inputElement.focus();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactConsole);
  } else {
    initContactConsole();
  }
})();
