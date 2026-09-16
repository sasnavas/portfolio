document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.menu');
  const siteHeader = document.querySelector('.site-header');

  if (navToggle && menu) {
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      menu.classList.toggle('open');
    });
  }

  // Close menu when clicking a link
  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (menu) menu.classList.remove('open');
    });
  });

  // --- Scroll Tracking & Header ---
  const rocket = document.querySelector('.rocket');
  const siteBg = document.querySelector('.site-bg');
  const toTopBtn = document.querySelector('.to-top');
  
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Header condensation
    if (currentScrollY > 50) {
      siteHeader.classList.add('condensed');
    } else {
      siteHeader.classList.remove('condensed');
    }

    // Scroll progress for rocket position
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (currentScrollY / documentHeight) * 100;
    const invertedPercent = Math.max(0, Math.min(100, 100 - scrollPercent));
    
    if (rocket) {
      rocket.style.top = `${invertedPercent}%`;
      
      // Scroll direction
      if (currentScrollY > lastScrollY) {
        rocket.classList.add('direction-down');
        rocket.classList.remove('direction-up');
      } else if (currentScrollY < lastScrollY) {
        rocket.classList.add('direction-up');
        rocket.classList.remove('direction-down');
      }
    }

    // To Top button visibility
    if (toTopBtn) {
      if (currentScrollY > 200) {
        toTopBtn.style.display = 'block';
      } else {
        toTopBtn.style.display = 'none';
      }
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // To Top functionality
  if (toTopBtn) {
    toTopBtn.style.display = 'none'; // Initial state
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Section Observer (Active Menu & Background Mode) ---
  const sections = document.querySelectorAll('section[id]');
  const menuLinks = document.querySelectorAll('.menu a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update active menu link
        menuLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });

        // Update Background Mode
        if (siteBg) {
          siteBg.className = `site-bg ${id}-mode sections-mode`;
          if (id === 'home') {
            siteBg.classList.remove('sections-mode');
          }
        }

        // Update rocket data-section
        if (rocket) {
          rocket.setAttribute('data-section', id);
        }
      }
    });
  }, { threshold: 0.3, rootMargin: '-10% 0px -50% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

  // --- Reveal Animations Observer ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));
  
  // Custom delayed reveals for grids
  const staggeredContainers = document.querySelectorAll('.staggered-grid');
  staggeredContainers.forEach(container => {
    const items = container.querySelectorAll('.stagger-item');
    items.forEach((item, index) => {
      // Add delay classes (1, 2, 3)
      item.classList.add(`animate-delay-${(index % 3) + 1}`);
      revealObserver.observe(item);
    });
  });

  // --- Contact Form Handling (Basic) ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      btn.innerText = 'Sending...';
      btn.disabled = true;
      
      // Simulate sending
      setTimeout(() => {
        btn.innerText = 'Message Sent!';
        btn.style.background = '#25D366';
        contactForm.reset();
        
        setTimeout(() => {
          btn.innerText = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }
});
