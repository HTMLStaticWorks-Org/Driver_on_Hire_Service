/**
 * DRIVER ON HIRE SERVICE — CUSTOMER DASHBOARD SCRIPT
 * Manages Dashboard Tab Navigation, Live Price Estimation, Demo Booking Flow & Table Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check user session
  const storedUser = localStorage.getItem('doh_user');
  if (storedUser) {
    try {
      const u = JSON.parse(storedUser);
      const userNameEls = document.querySelectorAll('.dynamic-user-name');
      userNameEls.forEach(el => el.textContent = u.name || 'Customer');
    } catch (e) {}
  }

  // Dashboard Mobile/Tablet Sidebar Drawer (<= 1024px)
  const dashHamburgerBtn = document.querySelector('.dash-hamburger-btn');
  const dashSidebar = document.querySelector('#dashSidebarDrawer');
  const dashOverlay = document.querySelector('.dash-sidebar-overlay');
  const dashCloseBtn = document.querySelector('.dash-drawer-close');

  function openDashDrawer() {
    if (!dashSidebar || !dashOverlay || !dashHamburgerBtn) return;
    dashSidebar.classList.add('active');
    dashOverlay.classList.add('active');
    dashHamburgerBtn.classList.add('active');
    dashHamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDashDrawer() {
    if (!dashSidebar || !dashOverlay || !dashHamburgerBtn) return;
    dashSidebar.classList.remove('active');
    dashOverlay.classList.remove('active');
    dashHamburgerBtn.classList.remove('active');
    dashHamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (dashHamburgerBtn && dashSidebar && dashOverlay) {
    dashHamburgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (dashSidebar.classList.contains('active')) {
        closeDashDrawer();
      } else {
        openDashDrawer();
      }
    });

    if (dashCloseBtn) {
      dashCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeDashDrawer();
      });
    }

    dashOverlay.addEventListener('click', closeDashDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dashSidebar.classList.contains('active')) {
        closeDashDrawer();
      }
    });

    window.matchMedia('(min-width: 1025px)').addEventListener('change', (mq) => {
      if (mq.matches) closeDashDrawer();
    });
  }

  // Dashboard Sidebar & Mobile Tab Switching
  const menuItems = document.querySelectorAll('.dash-menu-item, .dash-mobile-tab-btn');
  const panes = document.querySelectorAll('.dash-pane');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPaneId = item.getAttribute('data-pane');
      if (!targetPaneId) return;

      closeDashDrawer();

      // Handle Logout
      if (targetPaneId === 'logout') {
        localStorage.removeItem('doh_user');
        showToast('You have been logged out securely.');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
        return;
      }

      // Update active states
      menuItems.forEach(i => {
        if (i.getAttribute('data-pane') === targetPaneId) {
          i.classList.add('active');
        } else {
          i.classList.remove('active');
        }
      });

      panes.forEach(pane => {
        if (pane.id === targetPaneId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Live Price Calculation in "Book a Driver" Pane
  const dashService = document.querySelector('#dashBookService');
  const dashHours = document.querySelector('#dashBookHours');
  const dashEstPrice = document.querySelector('#dashEstPrice');
  const dashBookingForm = document.querySelector('#dashBookingForm');

  function calculateDashEstimate() {
    if (!dashEstPrice) return;
    const service = dashService ? dashService.value : 'hourly';
    const hours = dashHours ? parseInt(dashHours.value, 10) || 4 : 4;
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
    dashEstPrice.textContent = '₹' + cost.toLocaleString('en-IN');
  }

  if (dashService) dashService.addEventListener('change', calculateDashEstimate);
  if (dashHours) dashHours.addEventListener('input', calculateDashEstimate);
  calculateDashEstimate();

  // Booking Form Submission Inside Dashboard
  if (dashBookingForm) {
    dashBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const serviceText = dashService.options[dashService.selectedIndex].text;
      const pickup = document.querySelector('#dashBookPickup').value || 'Current City Location';
      const date = document.querySelector('#dashBookDate').value || new Date().toISOString().split('T')[0];
      const hours = dashHours ? dashHours.value : '4';
      const price = dashEstPrice.textContent;
      const newBookingId = 'DOH-' + Math.floor(1000 + Math.random() * 9000);

      // Add to bookings table
      const bookingsTable = document.querySelector('#myBookingsTableBody');
      if (bookingsTable) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>#${newBookingId}</strong></td>
          <td>${date}</td>
          <td>${serviceText}</td>
          <td>Assigned (Rajesh V.)</td>
          <td><span class="status-pill status-confirmed">Confirmed</span></td>
          <td>${hours} Hours</td>
          <td><strong>${price}</strong></td>
        `;
        bookingsTable.prepend(row);
      }

      // Increment stats
      const totalBookingsStat = document.querySelector('#totalBookingsCount');
      if (totalBookingsStat) {
        const cur = parseInt(totalBookingsStat.textContent, 10) || 12;
        totalBookingsStat.textContent = cur + 1;
      }

      showToast(`🎉 Booking #${newBookingId} confirmed! Driver allocated.`, 'success');
      dashBookingForm.reset();
      calculateDashEstimate();

      // Switch to My Bookings tab
      setTimeout(() => {
        const bookingsMenuBtn = document.querySelector('[data-pane="my-bookings"]');
        if (bookingsMenuBtn) bookingsMenuBtn.click();
      }, 1200);
    });
  }
});

