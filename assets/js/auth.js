/**
 * DRIVER ON HIRE SERVICE — AUTHENTICATION CLIENT SCRIPT
 * Manages Demo Login / Register, Password Visibility Toggle, Form Validation & Dashboard Redirect
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginTabBtn = document.querySelector('#loginTabBtn');
  const registerTabBtn = document.querySelector('#registerTabBtn');
  const loginForm = document.querySelector('#loginForm');
  const registerForm = document.querySelector('#registerForm');

  // Tab switching
  if (loginTabBtn && registerTabBtn && loginForm && registerForm) {
    loginTabBtn.addEventListener('click', () => {
      loginTabBtn.classList.add('active');
      registerTabBtn.classList.remove('active');
      loginForm.style.display = 'flex';
      registerForm.style.display = 'none';
    });

    registerTabBtn.addEventListener('click', () => {
      registerTabBtn.classList.add('active');
      loginTabBtn.classList.remove('active');
      loginForm.style.display = 'none';
      registerForm.style.display = 'flex';
    });
  }

  // Password Visibility Toggle
  const eyeShowSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  const eyeHideSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = eyeHideSvg;
          btn.setAttribute('aria-label', 'Hide password');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          input.type = 'password';
          btn.innerHTML = eyeShowSvg;
          btn.setAttribute('aria-label', 'Show password');
          btn.setAttribute('aria-pressed', 'false');
        }
      }
    });
  });

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('#loginEmail').value.trim();
      const password = document.querySelector('#loginPassword').value;

      if (!email || !password) {
        showToast('Please provide both email and password.', 'error');
        return;
      }

      if (password.length < 4) {
        showToast('Password must be at least 4 characters long.', 'error');
        return;
      }

      showToast('Authentication successful! Welcome back, Customer.', 'success');
      localStorage.setItem('doh_user', JSON.stringify({ email: email, name: email.split('@')[0] }));
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }

  // Register Form Submission
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#regName').value.trim();
      const email = document.querySelector('#regEmail').value.trim();
      const phone = document.querySelector('#regPhone').value.trim();
      const pass = document.querySelector('#regPass').value;
      const confirmPass = document.querySelector('#regConfirmPass').value;

      if (!name || !email || !phone || !pass) {
        showToast('Please complete all registration fields.', 'error');
        return;
      }

      if (pass !== confirmPass) {
        showToast('Passwords do not match. Please verify.', 'error');
        return;
      }

      showToast('Registration successful! Redirecting to your dashboard...', 'success');
      localStorage.setItem('doh_user', JSON.stringify({ email: email, name: name, phone: phone }));
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }

  // Google & Apple OAuth Demo Sign-In / Sign-Up
  document.querySelectorAll('.auth-social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-oauth') || 'Social';
      showToast(`${provider} authentication verified! Redirecting to dashboard...`, 'success');
      localStorage.setItem('doh_user', JSON.stringify({
        email: `${provider.toLowerCase()}.user@executive.com`,
        name: `${provider} Customer`
      }));
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 900);
    });
  });
});

