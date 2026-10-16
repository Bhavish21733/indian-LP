/**
 * Master Ganesh - Astrologer Psychic & Spiritual Healer
 * Interactive Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header on Scroll
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
      const icon = mobileToggle.querySelector('svg');
      if (icon) {
        icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
      }
    };

    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
      const icon = mobileToggle.querySelector('svg');
      if (icon) {
        if (isOpen) {
          icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
        } else {
          icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
        }
      }
    });

    const mobileNavClose = document.getElementById('mobile-nav-close');
    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', closeMenu);
    }

    // Close mobile menu when clicking any nav link or drawer action
    document.querySelectorAll('.nav-link, .mobile-drawer-btn').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close when resized back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // 3. Problem Solver Tabs
  const tabButtons = document.querySelectorAll('.problem-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other FAQs for clean accordion feel
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
            otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('open');
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // 5. Back to Top Smooth Scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Consultation Booking Form -> Direct WhatsApp with Predefined Message + Lead Backup
  const bookingForm = document.getElementById('consultation-form');
  const formStatusMsg = document.getElementById('form-status-msg');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('btn-submit-form') || bookingForm.querySelector('.btn-submit-form');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Opening WhatsApp...</span>';
        submitBtn.disabled = true;
      }

      const formData = new FormData(bookingForm);
      const name = (formData.get('name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const service = (formData.get('service') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      // Format Predefined WhatsApp message
      const waText = 
`Hello Master Ganesh, I would like to schedule a private Vedic consultation.

*Name:* ${name || 'Confidential Client'}
*Phone:* ${phone || 'Not Provided'}
*Primary Concern:* ${service || 'General Spiritual Consultation'}
*Details:* ${message || 'Please contact me for a confidential reading.'}`;

      const waUrl = `https://wa.me/18642856983?text=${encodeURIComponent(waText)}`;

      // Background asynchronous Netlify lead submission
      try {
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        }).catch(() => {});
      } catch (err) {}

      if (formStatusMsg) {
        formStatusMsg.className = 'form-status-msg success';
        formStatusMsg.innerHTML = '🙏 <strong>Connecting to WhatsApp...</strong> If chat did not open automatically, <a href="' + waUrl + '" target="_blank" rel="noopener noreferrer" style="color:#FFF;text-decoration:underline;font-weight:700;">Click Here to Chat Directly</a>.';
      }

      // Redirect / open WhatsApp directly
      setTimeout(() => {
        const opened = window.open(waUrl, '_blank');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          window.location.href = waUrl;
        }
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 300);
    });
  }

  // 7. Testimonials Auto-Scroll Carousel (Single Horizontal Row, 3 Cards on Desktop, 1 Card on Mobile)
  const track = document.getElementById('testimonials-track');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoScrollInterval = null;
    let isUserInteracting = false;

    const getVisibleCards = () => {
      if (window.innerWidth > 1080) return 3;
      if (window.innerWidth > 768) return 2;
      return 1;
    };

    const getMaxIndex = () => {
      const visible = getVisibleCards();
      return Math.max(0, cards.length - visible);
    };

    const scrollToIndex = (idx) => {
      if (!track || !cards[idx]) return;
      const targetCard = cards[idx];
      track.scrollTo({
        left: targetCard.offsetLeft - track.offsetLeft,
        behavior: 'smooth'
      });
      currentIndex = idx;
    };

    const advanceSlide = () => {
      if (!isUserInteracting && cards.length > 1) {
        const maxIdx = getMaxIndex();
        if (currentIndex >= maxIdx) {
          currentIndex = 0;
        } else {
          currentIndex += 1;
        }
        scrollToIndex(currentIndex);
      }
    };

    const startTimer = () => {
      stopTimer();
      autoScrollInterval = setInterval(advanceSlide, 3800);
    };

    const stopTimer = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };

    startTimer();

    // Pause on touch or mouse interaction
    track.addEventListener('touchstart', () => {
      isUserInteracting = true;
      stopTimer();
    }, { passive: true });

    track.addEventListener('touchend', () => {
      setTimeout(() => {
        isUserInteracting = false;
        startTimer();
      }, 2500);
    }, { passive: true });

    track.addEventListener('mouseenter', () => {
      isUserInteracting = true;
      stopTimer();
    });

    track.addEventListener('mouseleave', () => {
      isUserInteracting = false;
      startTimer();
    });

    // Detect manual swipe/scroll index update
    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPos = track.scrollLeft;
        const visible = getVisibleCards();
        const cardWidth = cards[0] ? cards[0].offsetWidth : (track.clientWidth / visible);
        const activeIdx = Math.round(scrollPos / cardWidth);
        const maxIdx = getMaxIndex();
        if (activeIdx >= 0 && activeIdx <= maxIdx) {
          currentIndex = activeIdx;
        }
      }, 100);
    }, { passive: true });

    // Reset position on window resize
    window.addEventListener('resize', () => {
      scrollToIndex(0);
    });
  }

  // 8. Dynamic Current Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 9. Scroll Reveal Animations Throughout Site
  const initScrollReveal = () => {
    const revealTargets = [
      '.section-header',
      '.service-card',
      '.problem-card',
      '.gallery-card',
      '.trust-strip',
      '.emergency-shield-card',
      '.about-text',
      '.about-image-card',
      '.palm-analysis-box',
      '.faq-item',
      '.location-info-card',
      '.map-wrapper',
      '.footer-col'
    ];

    document.querySelectorAll(revealTargets.join(', ')).forEach((el) => {
      if (!el.classList.contains('reveal-on-scroll') && !el.closest('#hero')) {
        el.classList.add('reveal-on-scroll');
      }
    });

    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  };

  initScrollReveal();

  // 10. 60% Scroll Popup Modal (Direct WhatsApp Lead Capture)
  const popupModal = document.getElementById('scroll-popup-modal');
  const popupCloseBtn = document.getElementById('popup-close-btn');
  const popupOverlay = document.getElementById('popup-overlay');
  const popupForm = document.getElementById('popup-lead-form');

  let popupShown = false;
  try {
    if (sessionStorage.getItem('ganeshPopupDismissed') === 'true') {
      popupShown = true;
    }
  } catch (e) {}

  const openPopup = () => {
    if (!popupModal || popupShown) return;
    popupShown = true;
    popupModal.classList.add('active');
    popupModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    if (!popupModal) return;
    popupModal.classList.remove('active');
    popupModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    try {
      sessionStorage.setItem('ganeshPopupDismissed', 'true');
    } catch (e) {}
  };

  if (popupCloseBtn) popupCloseBtn.addEventListener('click', closePopup);
  if (popupOverlay) popupOverlay.addEventListener('click', closePopup);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupModal?.classList.contains('active')) {
      closePopup();
    }
  });

  // Calculate 60% scroll position
  window.addEventListener('scroll', () => {
    if (popupShown) return;
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal > 0) {
      const scrollPercent = (window.scrollY / scrollTotal) * 100;
      if (scrollPercent >= 60) {
        openPopup();
      }
    }
  }, { passive: true });

  // Handle Popup Form Submit -> WhatsApp
  if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-popup-submit');
      const originalHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Connecting to WhatsApp...</span>';
        submitBtn.disabled = true;
      }

      const formData = new FormData(popupForm);
      const name = (formData.get('name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const service = (formData.get('service') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      const waText = 
`Hello Master Ganesh, I would like to schedule a private Vedic consultation.

*Name:* ${name || 'Confidential Client'}
*Phone:* ${phone || 'Not Provided'}
*Service Needed:* ${service || 'General Spiritual Consultation'}
*Details:* ${message || 'Please contact me for assistance.'}`;

      const waUrl = `https://wa.me/18642856983?text=${encodeURIComponent(waText)}`;

      // Background asynchronous Netlify lead submission
      try {
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        }).catch(() => {});
      } catch (err) {}

      setTimeout(() => {
        const opened = window.open(waUrl, '_blank');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          window.location.href = waUrl;
        }
        closePopup();
        if (submitBtn) {
          submitBtn.innerHTML = originalHtml;
          submitBtn.disabled = false;
        }
      }, 300);
    });
  }
});
