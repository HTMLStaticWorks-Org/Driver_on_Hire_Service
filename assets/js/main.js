/**
 * DRIVER ON HIRE SERVICE — MAIN CLIENT SCRIPT
 * Manages Navbar, Sidebar, Theme Toggle, RTL Toggle, Modal, and Animations
 */

(function () {
  'use strict';

  // --- Initialize Theme & RTL Preferences from LocalStorage ---
  const savedTheme = localStorage.getItem('doh_theme') || 'light';
  const savedDir = localStorage.getItem('doh_dir') || 'ltr';

  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('dir', savedDir);

  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initRtlToggle();
    initSidebar();
    initScrollHeader();
    initScrollReveal();
    initBookingModal();
    initQuickBookingStrips();
    initFaqAccordion();
    initContactMapHubs();
    initDriverProfileModal();
    initBackToTop();
    highlightActiveNav();
  });

  // --- Highlight Active Link Based on Current URL ---
  function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .sidebar-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- Theme Toggle Implementation (Light / Dark) ---
  function initThemeToggle() {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

    function updateThemeUI(theme) {
      themeButtons.forEach(btn => {
        const iconSpan = btn.querySelector('.theme-icon');
        const textSpan = btn.querySelector('.theme-text');
        if (theme === 'dark') {
          if (iconSpan) iconSpan.innerHTML = sunSvg;
          if (textSpan) textSpan.textContent = 'Light Mode';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.setAttribute('title', 'Switch to Light Mode');
        } else {
          if (iconSpan) iconSpan.innerHTML = moonSvg;
          if (textSpan) textSpan.textContent = 'Dark Mode';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.setAttribute('title', 'Switch to Dark Mode');
        }
      });
    }

    updateThemeUI(document.documentElement.getAttribute('data-theme') || 'light');

    themeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('doh_theme', next);
        updateThemeUI(next);
        showToast(next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
      });
    });
  }

  // --- RTL / LTR Toggle Implementation ---
  function initRtlToggle() {
    const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');

    function updateRtlUI(dir) {
      rtlButtons.forEach(btn => {
        const textSpan = btn.querySelector('.rtl-text');
        if (dir === 'rtl') {
          if (textSpan) textSpan.textContent = 'LTR';
          btn.setAttribute('aria-label', 'Switch to left to right layout');
          btn.setAttribute('title', 'Switch to LTR Layout');
        } else {
          if (textSpan) textSpan.textContent = 'RTL';
          btn.setAttribute('aria-label', 'Switch to right to left layout');
          btn.setAttribute('title', 'Switch to RTL Layout');
        }
      });
    }

    updateRtlUI(document.documentElement.getAttribute('dir') || 'ltr');

    rtlButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        document.documentElement.setAttribute('dir', next);
        localStorage.setItem('doh_dir', next);
        updateRtlUI(next);
        showToast(next === 'rtl' ? 'RTL layout enabled' : 'LTR layout enabled');
      });
    });
  }

  // --- Strict Reusable Responsive Sidebar ---
  function initSidebar() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const sidebar = document.querySelector('.site-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const closeBtn = document.querySelector('.sidebar-close-btn');

    if (!hamburgerBtn || !sidebar || !overlay) return;

    function openSidebar() {
      sidebar.classList.add('active');
      overlay.classList.add('active');
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (sidebar.classList.contains('active')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeSidebar();
      });
    }

    overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebar();
      }
    });
  }

  // --- Sticky Header Shadow on Scroll ---
  function initScrollHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --- Scroll Reveal Animations ---
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('active'));
    }
  }

  // --- Booking Modal Implementation ---
  function initBookingModal() {
    const modal = document.querySelector('#bookingModal');
    if (!modal) return;

    const openButtons = document.querySelectorAll('[data-open-modal="booking"]');
    const closeBtn = modal.querySelector('.modal-close-btn');
    const form = modal.querySelector('#bookingModalForm');
    const serviceSelect = modal.querySelector('#bookingModalService');
    const hoursInput = modal.querySelector('#bookingModalHours');
    const priceDisplay = modal.querySelector('#bookingModalEstimate');

    function calculateEstimate() {
      if (!priceDisplay) return;
      const service = serviceSelect ? serviceSelect.value : 'hourly';
      const hours = hoursInput ? parseInt(hoursInput.value, 10) || 4 : 4;
      let cost = 0;

      switch (service) {
        case 'hourly':
          cost = hours * 399;
          break;
        case 'half-day':
          cost = 1299 + Math.max(0, hours - 4) * 299;
          break;
        case 'full-day':
          cost = 2199 + Math.max(0, hours - 8) * 299;
          break;
        case 'outstation':
          cost = 2899 + Math.max(0, hours - 12) * 249;
          break;
        case 'airport':
          cost = 1499;
          break;
        case 'corporate':
          cost = hours * 449;
          break;
        default:
          cost = hours * 399;
      }
      priceDisplay.textContent = '₹' + cost.toLocaleString('en-IN');
    }

    if (serviceSelect) serviceSelect.addEventListener('change', calculateEstimate);
    if (hoursInput) hoursInput.addEventListener('input', calculateEstimate);

    function openModal(preselectedService) {
      if (preselectedService && serviceSelect) {
        serviceSelect.value = preselectedService;
      }
      calculateEstimate();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    openButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const srv = btn.getAttribute('data-service') || '';
        openModal(srv);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
        showToast('Booking request confirmed! A verified driver is being assigned.', 'success');
        form.reset();
      });
    }
  }

  // --- Quick Booking Strip Forms ---
  function initQuickBookingStrips() {
    const quickForms = document.querySelectorAll('.quick-booking-form');
    quickForms.forEach(f => {
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        const serviceVal = f.querySelector('[name="service"]')?.value || 'hourly';
        const pickupVal = f.querySelector('[name="pickup"]')?.value || '';
        const dateVal = f.querySelector('[name="date"]')?.value || '';
        const durationVal = f.querySelector('[name="duration"]')?.value || '';
        const modal = document.querySelector('#bookingModal');
        if (modal) {
          const sSelect = modal.querySelector('#bookingModalService');
          const pInput = modal.querySelector('#bookingModalPickup');
          const dInput = modal.querySelector('#bookingModalDate');
          const hInput = modal.querySelector('#bookingModalHours');
          if (sSelect) {
            sSelect.value = serviceVal;
            sSelect.dispatchEvent(new Event('change'));
          }
          if (pInput && pickupVal) pInput.value = pickupVal;
          if (dInput && dateVal) dInput.value = dateVal;
          if (hInput && durationVal) {
            hInput.value = durationVal;
            hInput.dispatchEvent(new Event('input'));
          }
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        } else {
          showToast('Finding the best available driver for your journey...');
          setTimeout(() => {
            window.location.href = 'drivers.html#driver-profiles';
          }, 1000);
        }
      });
    });
  }

  // --- FAQ Accordion Implementation ---
  function initFaqAccordion() {
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    if (!faqTriggers.length) return;

    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        const list = trigger.closest('.faq-list');
        if (!item) return;

        const isOpen = item.classList.contains('active');
        if (list) {
          list.querySelectorAll('.faq-item.active').forEach(openItem => {
            openItem.classList.remove('active');
            const btn = openItem.querySelector('.faq-trigger');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });
        }

        if (!isOpen) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // --- Interactive Contact Map Hub Switcher ---
  function initContactMapHubs() {
    const mapFrame = document.querySelector('#contactMapIframe');
    const hubButtons = document.querySelectorAll('.contact-hub-btn');
    if (!mapFrame || !hubButtons.length) return;

    const eyebrowEl = document.querySelector('#contactHubEyebrow');
    const titleEl = document.querySelector('#contactHubTitle');
    const addressEl = document.querySelector('#contactHubAddress');
    const zoneEl = document.querySelector('#contactHubZone');
    const slaEl = document.querySelector('#contactHubSla');
    const hoursEl = document.querySelector('#contactHubHours');
    const directionsEl = document.querySelector('#contactMapDirectionsLink');

    hubButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.hubQuery;
        if (!query) return;

        hubButtons.forEach(item => {
          item.classList.remove('active');
          item.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const encoded = encodeURIComponent(query);
        mapFrame.src = `https://maps.google.com/maps?q=${encoded}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
        mapFrame.title = `Driver on Hire Service Location Map — ${btn.dataset.hubTitle || query}`;

        if (eyebrowEl && btn.dataset.hubEyebrow) eyebrowEl.textContent = btn.dataset.hubEyebrow;
        if (titleEl && btn.dataset.hubTitle) titleEl.textContent = btn.dataset.hubTitle;
        if (addressEl && btn.dataset.hubAddress) addressEl.textContent = btn.dataset.hubAddress;
        if (zoneEl && btn.dataset.hubZone) zoneEl.textContent = btn.dataset.hubZone;
        if (slaEl && btn.dataset.hubSla) slaEl.textContent = btn.dataset.hubSla;
        if (hoursEl && btn.dataset.hubHours) hoursEl.textContent = btn.dataset.hubHours;
        if (directionsEl) {
          directionsEl.href = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
        }
      });
    });
  }

  // --- Driver Profile Preview Modal (Our Drivers Page) ---
  function initDriverProfileModal() {
    const viewButtons = document.querySelectorAll('[data-view-driver]');
    if (!viewButtons.length) return;

    let profileModal = document.querySelector('#driverProfileModal');
    if (!profileModal) {
      profileModal = document.createElement('div');
      profileModal.id = 'driverProfileModal';
      profileModal.className = 'modal-overlay';
      profileModal.setAttribute('role', 'dialog');
      profileModal.setAttribute('aria-modal', 'true');
      profileModal.setAttribute('aria-labelledby', 'driverProfileModalTitle');
      profileModal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-header">
            <div>
              <h3 id="driverProfileModalTitle" style="font-size:1.35rem; margin-block-end:4px;">Chauffeur Profile</h3>
              <p style="font-size:0.85rem; color:var(--text-muted);" id="driverProfileRole"></p>
            </div>
            <button type="button" class="modal-close-btn" aria-label="Close driver profile">&times;</button>
          </div>
          <div class="modal-body" style="display:flex; flex-direction:column; gap:18px;">
            <div style="display:flex; align-items:center; gap:16px;">
              <img id="driverProfileImg" src="" alt="" style="width:78px; height:78px; border-radius:14px; object-fit:cover; object-position:center 20%; border:2px solid var(--accent-primary); flex-shrink:0;">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="status-badge" id="driverProfileRating" style="color:var(--heading-color);"></span>
                <span class="status-badge" id="driverProfileStatus" style="color:var(--accent-emerald);"></span>
              </div>
            </div>
            <div id="driverProfileSpecs" style="background:var(--color-soft-green); border:1px solid var(--color-card-border); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; color:var(--text-main);"></div>
            <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:space-between; align-items:center; padding-top:6px;">
              <a href="#driver-vetting" id="driverProfileVettingLink" class="btn btn-outline btn-sm">View Vetting Standards</a>
              <button type="button" class="btn btn-primary btn-sm" id="driverProfileBookBtn">Book This Chauffeur</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(profileModal);

      const closeProfileModal = () => {
        profileModal.classList.remove('active');
        document.body.style.overflow = '';
      };

      profileModal.querySelector('.modal-close-btn')?.addEventListener('click', closeProfileModal);
      profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) closeProfileModal();
      });
      profileModal.querySelector('#driverProfileVettingLink')?.addEventListener('click', closeProfileModal);
      profileModal.querySelector('#driverProfileBookBtn')?.addEventListener('click', () => {
        closeProfileModal();
        const bookingModal = document.querySelector('#bookingModal');
        if (bookingModal) {
          bookingModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && profileModal.classList.contains('active')) closeProfileModal();
      });
    }

    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.premium-card');
        if (!card) return;
        const img = card.querySelector('.card-img-wrap img');
        const name = card.querySelector('.card-title')?.textContent?.trim() || 'Chauffeur';
        const role = card.querySelector('.card-body p')?.textContent?.trim() || '';
        const badge = card.querySelector('.card-badge')?.textContent?.trim() || '';
        const status = card.querySelector('.status-badge')?.textContent?.trim() || 'Available';
        const specs = [...card.querySelectorAll('.card-body ul li')].map(li => li.innerHTML);

        const titleEl = profileModal.querySelector('#driverProfileModalTitle');
        const roleEl = profileModal.querySelector('#driverProfileRole');
        const imgEl = profileModal.querySelector('#driverProfileImg');
        const ratingEl = profileModal.querySelector('#driverProfileRating');
        const statusEl = profileModal.querySelector('#driverProfileStatus');
        const specsEl = profileModal.querySelector('#driverProfileSpecs');
        const bookBtn = profileModal.querySelector('#driverProfileBookBtn');

        if (titleEl) titleEl.textContent = name;
        if (roleEl) roleEl.textContent = role;
        if (imgEl && img) {
          imgEl.src = img.getAttribute('src') || '';
          imgEl.alt = img.getAttribute('alt') || name;
        }
        if (ratingEl) ratingEl.textContent = badge;
        if (statusEl) statusEl.textContent = `Status: ${status}`;
        if (specsEl) {
          specsEl.innerHTML = specs.map(s => `<div>${s}</div>`).join('') + '<div><strong>Verification:</strong> RTO License, Police Cleared &amp; Defensive Driving Certified</div>';
        }
        if (bookBtn) bookBtn.textContent = `Book ${name}`;

        profileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  // --- Floating Back-to-Top Button (Shared Across All Pages) ---
  function initBackToTop() {
    if (document.querySelector('.back-to-top-btn')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll back to top');
    btn.setAttribute('title', 'Back to Top');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
    document.body.appendChild(btn);

    const dashContent = document.querySelector('.dash-content');

    function updateVisibility() {
      const scrollTop = Math.max(window.scrollY || 0, dashContent ? dashContent.scrollTop : 0);
      btn.classList.toggle('visible', scrollTop > 260);
    }

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    if (dashContent) {
      dashContent.addEventListener('scroll', updateVisibility, { passive: true });
    }

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (dashContent) {
        dashContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // --- Toast Notification Helper ---
  window.showToast = function (message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> <span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  };

})();

