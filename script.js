/**
 * Himanshu Jangid — Potfolie
 * 4-Page Atmospheric Engine: Starfield Canvas & Dynamic Altitude Scroll Spy
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. STARFIELD CANVAS GENERATOR (For Dark Blue to Black Space Tier)
  // =========================================================================
  const canvas = document.getElementById('stars-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 1.2);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight * 1.2;
    });

    const starCount = Math.floor((width * height) / 3400);
    const stars = [];

    class Star {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.4 + 0.3;
        this.baseAlpha = Math.random() * 0.75 + 0.25;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.03 + 0.008;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.28;
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
      ctx.clearRect(0, 0, width, height);

      // Only draw stars if near the space tier
      if (window.scrollY < window.innerHeight * 1.4) {
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
  // 2. DYNAMIC 4-TIER ALTITUDE THEME DETECTOR
  // Automatically switches header classes across the 4 pages:
  // - Space (Top) => theme-space (white text)
  // - SKIT (Middle-upper) => theme-skit (white text / ice blue)
  // - Sky (Middle-lower) => theme-sky (dark navy text)
  // - Earth (Bottom) => theme-earth (pure black text)
  // =========================================================================
  const header = document.getElementById('main-nav');
  const sections = [
    { id: 'space', element: document.getElementById('space'), theme: 'theme-space' },
    { id: 'skit', element: document.getElementById('skit'), theme: 'theme-skit' },
    { id: 'sky', element: document.getElementById('sky'), theme: 'theme-sky' },
    { id: 'earth', element: document.getElementById('earth'), theme: 'theme-earth' }
  ];
  const navPills = document.querySelectorAll('.alt-link');

  function updateAltitudeTheme() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;
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

    if (header) {
      header.classList.remove('theme-space', 'theme-skit', 'theme-sky', 'theme-earth');
      header.classList.add(currentTheme);
    }

    navPills.forEach(pill => {
      if (pill.getAttribute('data-target') === currentSectionId) {
        pill.classList.add('active-pill');
      } else {
        pill.classList.remove('active-pill');
      }
    });
  }

  window.addEventListener('scroll', updateAltitudeTheme, { passive: true });
  updateAltitudeTheme();

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
