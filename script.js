/**
 * Himanshu Jangid — Potfolie
 * Interactive Atmospheric Engine: Starfield Canvas, Dynamic Altitude Scroll Spy & Theme Adaptation
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. STARFIELD CANVAS GENERATOR (For Space Tier)
  // =========================================================================
  const canvas = document.getElementById('stars-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const starCount = Math.floor((width * height) / 3800);
    const stars = [];

    class Star {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // initial spread
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * (height * 0.45); // Concentrate stars in space tier
        this.radius = Math.random() * 1.4 + 0.3;
        this.baseAlpha = Math.random() * 0.7 + 0.3;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.03 + 0.008;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update(time) {
        // Subtle twinkling sine wave
        this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.25;
        if (this.alpha < 0.1) this.alpha = 0.1;
        if (this.alpha > 1) this.alpha = 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    let time = 0;
    function renderStars() {
      // Clear starfield
      ctx.clearRect(0, 0, width, height);

      // Only draw stars if we are within range of the top space region
      if (window.scrollY < window.innerHeight * 1.5) {
        time++;
        stars.forEach(star => {
          star.update(time);
          star.draw();
        });
      }

      requestAnimationFrame(renderStars);
    }

    renderStars();
  }

  // =========================================================================
  // 2. DYNAMIC ALTITUDE THEME DETECTOR & SCROLL SPY
  // Automatically switches navbar styles:
  // - Space (Top) => White text, translucent glass
  // - Sky (Middle) => Dark text, readable sky pill
  // - Earth (Bottom) => Black text, crisp white pill
  // =========================================================================
  const header = document.getElementById('main-nav');
  const sections = [
    { id: 'space', element: document.getElementById('space'), theme: 'theme-space' },
    { id: 'sky', element: document.getElementById('sky'), theme: 'theme-sky' },
    { id: 'earth', element: document.getElementById('earth'), theme: 'theme-earth' }
  ];
  const navPills = document.querySelectorAll('.alt-link');

  function updateAltitudeTheme() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.38;
    let currentTheme = 'theme-space';
    let currentSectionId = 'space';

    sections.forEach(({ id, element, theme }) => {
      if (element) {
        const top = element.offsetTop;
        const height = element.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentTheme = theme;
          currentSectionId = id;
        }
      }
    });

    // Update Header class
    if (header) {
      header.classList.remove('theme-space', 'theme-sky', 'theme-earth');
      header.classList.add(currentTheme);
    }

    // Update active pill highlight
    navPills.forEach(pill => {
      if (pill.getAttribute('data-target') === currentSectionId) {
        pill.classList.add('active-pill');
      } else {
        pill.classList.remove('active-pill');
      }
    });
  }

  window.addEventListener('scroll', updateAltitudeTheme, { passive: true });
  updateAltitudeTheme(); // run once on initial load

  // =========================================================================
  // 3. SMOOTH NAVIGATION ANCHORS
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

});
