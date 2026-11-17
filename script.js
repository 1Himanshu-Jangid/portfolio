/**
 * Himanshu Jangid — Potfolie
 * 4-Page Atmospheric Engine: Starfield Canvas & Dynamic Altitude Scroll Spy
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. STARFIELD CANVAS GENERATOR (Space & Stratosphere with Smooth Altitude Fade)
  // Stars drift on their place and fade smoothly down to Flight Altitude (270vh)
  // =========================================================================
  const canvas = document.getElementById('stars-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 2.7); // Covers Space & SKIT down to Flight Altitude

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight * 2.7;
    });

    const starCount = Math.floor((width * height) / 3600);
    const stars = [];

    class Star {
      constructor() {
        this.reset();
        this.originY = Math.random() * height;
        this.y = this.originY;
        this.calcAltitudeFade();
      }

      calcAltitudeFade() {
        // Space (0 to 120vh): 100% full brightness
        // Descending through SKIT to Flight Altitude (120vh to 260vh): smooth atmospheric fade out
        const fadeStart = height * 0.44; // ~120vh
        const fadeEnd = height * 0.96;   // ~260vh right above Flight Altitude
        if (this.originY <= fadeStart) {
          this.altitudeFade = 1.0;
        } else if (this.originY >= fadeEnd) {
          this.altitudeFade = 0;
        } else {
          const ratio = (this.originY - fadeStart) / (fadeEnd - fadeStart);
          this.altitudeFade = Math.pow(1.0 - ratio, 1.6); // Smooth non-linear atmospheric diffusion
        }
      }

      reset() {
        this.originX = Math.random() * width;
        this.originY = Math.random() * height;
        this.x = this.originX;
        this.y = this.originY;
        this.radius = Math.random() * 1.5 + 0.35;
        this.baseAlpha = Math.random() * 0.75 + 0.25;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.025 + 0.008;
        this.twinkleOffset = Math.random() * Math.PI * 2;

        // Micro-motion: stars gently drift and breathe in their place a little bit
        this.driftRadius = Math.random() * 3.5 + 1.2; // 1.2px to 4.7px drift
        this.driftSpeedX = Math.random() * 0.015 + 0.006;
        this.driftSpeedY = Math.random() * 0.015 + 0.006;
        this.driftPhaseX = Math.random() * Math.PI * 2;
        this.driftPhaseY = Math.random() * Math.PI * 2;

        this.calcAltitudeFade();
      }

      update(time) {
        // Twinkling brightness
        this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.3;
        if (this.alpha < 0.1) this.alpha = 0.1;
        if (this.alpha > 1) this.alpha = 1;

        // Gentle floating micro-motion on their place
        this.x = this.originX + Math.sin(time * this.driftSpeedX + this.driftPhaseX) * this.driftRadius;
        this.y = this.originY + Math.cos(time * this.driftSpeedY + this.driftPhaseY) * this.driftRadius;
      }

      draw() {
        const finalAlpha = this.alpha * this.altitudeFade;
        if (finalAlpha > 0.015) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    let time = 0;
    function renderStars() {
      ctx.clearRect(0, 0, width, height);

      // Render stars through Space and SKIT while descending toward Flight Altitude
      if (window.scrollY < window.innerHeight * 2.9) {
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
