/**
 * Portfolio - Tailwind CSS Version
 * Clean, minimal JavaScript for modern portfolio
 */

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('text-white', 'bg-white/10')
        navbarlink.classList.remove('text-gray-400')
      } else {
        navbarlink.classList.remove('text-white', 'bg-white/10')
        navbarlink.classList.add('text-gray-400')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button - Tailwind visibility classes
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.remove('opacity-0', 'invisible')
        backtotop.classList.add('opacity-100', 'visible')
      } else {
        backtotop.classList.add('opacity-0', 'invisible')
        backtotop.classList.remove('opacity-100', 'visible')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle - Tailwind transform classes
   */
  const header = select('#header')
  const mobileNavToggle = select('.mobile-nav-toggle')
  const navBackdrop = select('#nav-backdrop')

  const openMobileNav = () => {
    if (header) {
      header.classList.add('translate-x-0')
      header.classList.remove('-translate-x-full')
    }
    if (navBackdrop) {
      navBackdrop.classList.remove('opacity-0', 'invisible')
      navBackdrop.classList.add('opacity-100', 'visible')
    }
    if (mobileNavToggle) {
      const icon = mobileNavToggle.querySelector('svg')
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />'
      }
    }
  }

  const closeMobileNav = () => {
    if (header) {
      header.classList.remove('translate-x-0')
      header.classList.add('-translate-x-full')
    }
    if (navBackdrop) {
      navBackdrop.classList.add('opacity-0', 'invisible')
      navBackdrop.classList.remove('opacity-100', 'visible')
    }
    if (mobileNavToggle) {
      const icon = mobileNavToggle.querySelector('svg')
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />'
      }
    }
  }

  on('click', '.mobile-nav-toggle', function(e) {
    const isOpen = header && !header.classList.contains('-translate-x-full')
    if (isOpen) {
      closeMobileNav()
    } else {
      openMobileNav()
    }
  })

  // Close nav when clicking backdrop
  on('click', '#nav-backdrop', function(e) {
    closeMobileNav()
  })

  /**
   * Close mobile nav on link click
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      // Close mobile nav if open
      if (header && !header.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
        closeMobileNav()
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 2500,
      startDelay: 500
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter - only on desktop
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    let portfolioFilters = select('#portfolio-flters li', true);
    let portfolioIsotope = null;

    // Only initialize Isotope on larger screens
    const initIsotope = () => {
      if (window.innerWidth >= 768 && portfolioContainer && !portfolioIsotope) {
        portfolioIsotope = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item',
          layoutMode: 'fitRows',
          percentPosition: true,
          fitRows: {
            gutter: 8
          },
          horizontalOrder: true
        });

        let portfolioImages = select('.portfolio-container img', true);
        portfolioImages.forEach(img => {
          if (img.complete) {
            portfolioIsotope.layout();
            AOS.refresh();
          } else {
            img.addEventListener('load', () => {
              if (portfolioIsotope) portfolioIsotope.layout();
              AOS.refresh();
            });
          }
        });
      }
    };

    // Destroy Isotope on mobile
    const destroyIsotope = () => {
      if (portfolioIsotope) {
        portfolioIsotope.destroy();
        portfolioIsotope = null;
      }
    };

    // Initialize based on screen size
    if (window.innerWidth >= 768) {
      initIsotope();
    }

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 768) {
          initIsotope();
        } else {
          destroyIsotope();
        }
      }, 250);
    });

    // Filter click handler
    on('click', '#portfolio-flters li', function(e) {
      e.preventDefault();
      portfolioFilters.forEach(function(el) {
        el.classList.remove('filter-active');
      });
      this.classList.add('filter-active');

      if (portfolioIsotope) {
        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      } else {
        // Manual filter on mobile using CSS
        const filter = this.getAttribute('data-filter');
        const items = select('.portfolio-item', true);
        items.forEach(item => {
          if (filter === '*' || item.classList.contains(filter.replace('.', ''))) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      }
    }, true);

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  if (select('.portfolio-details-slider')) {
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  }

  /**
   * Testimonials slider
   */
  if (select('.testimonials-slider')) {
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },

        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 600,
      easing: 'ease-out',
      once: true,
      mirror: false,
      offset: 50
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  /**
   * Theme toggle functionality - Tailwind dark mode
   */
  const themeToggleBtn = select('#theme-toggle');
  const sunIcon = select('#sun-icon');
  const moonIcon = select('#moon-icon');

  const applyTheme = (mode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');
    }
  };

  // Check for saved theme or system preference
  let savedTheme = localStorage.getItem('theme');
  if (!savedTheme) {
    savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      savedTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(savedTheme);
      localStorage.setItem('theme', savedTheme);
    });
  }

})()
