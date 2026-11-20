/**
 * Himanshu Jangid — Potfolie
 * 4-Page Atmospheric Engine: Dynamic Starfield, Cosmic Drift & Altitude Scroll Spy
 * Silky-Smooth 60/120 FPS Performance for Mobile & Laptop
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 0. DEVICE DETECTION
  // =========================================================================
  const isMobile = window.innerWidth < 768;

  // =========================================================================
  // 1. DYNAMIC STARFIELD & METEOR ENGINE (Mobile & Desktop)
  //    - Stars continuously drift through deep space with sinusoidal twinkling
  //    - Shooting stars (meteors) streak across the sky periodically
  //    - 60/120fps hardware-accelerated canvas loop
  // =========================================================================
  const canvas = document.getElementById('stars-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = Math.round(window.innerHeight * 2.5));

    // Balanced star density for optimal 60/120fps
    const starCount = isMobile ? 45 : Math.min(130, Math.floor((width * height) / 7500));
    const stars = [];

    class Star {
      constructor() {
        this.originX = Math.random() * width;
        this.originY = Math.random() * (height * 0.95);
        this.x = this.originX;
        this.y = this.originY;
        this.radius = Math.random() * 1.3 + 0.45;
        this.baseAlpha = Math.random() * 0.65 + 0.35;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.02 + 0.008;
        this.twinkleOffset = Math.random() * Math.PI * 2;

        // Subtle micro-motion around its own place (NO falling like snow)
        this.swayRadiusX = Math.random() * 4.0 + 1.5;
        this.swayRadiusY = Math.random() * 3.5 + 1.2;
        this.swaySpeedX = Math.random() * 0.014 + 0.005;
        this.swaySpeedY = Math.random() * 0.014 + 0.005;
        this.phaseX = Math.random() * Math.PI * 2;
        this.phaseY = Math.random() * Math.PI * 2;

        this.calcAltitudeFade();
      }

      calcAltitudeFade() {
        const fadeStart = height * 0.45;
        const fadeEnd = height * 0.95;
        if (this.originY <= fadeStart) {
          this.altitudeFade = 1.0;
        } else if (this.originY >= fadeEnd) {
          this.altitudeFade = 0;
        } else {
          const ratio = (this.originY - fadeStart) / (fadeEnd - fadeStart);
          this.altitudeFade = Math.pow(1.0 - ratio, 1.5);
        }
      }

      update(time) {
        // Dynamic sinusoidal twinkling
        this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.28;
        if (this.alpha < 0.1) this.alpha = 0.1;
        if (this.alpha > 1) this.alpha = 1;

        // Gentle swaying on its own coordinate (hovering like real stars)
        this.x = this.originX + Math.sin(time * this.swaySpeedX + this.phaseX) * this.swayRadiusX;
        this.y = this.originY + Math.cos(time * this.swaySpeedY + this.phaseY) * this.swayRadiusY;
      }

      draw() {
        const finalAlpha = this.alpha * this.altitudeFade;
        if (finalAlpha > 0.02) {
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

    // Occasional shooting star / meteor
    class ShootingStar {
      constructor() {
        this.active = false;
        this.reset();
      }

      reset() {
        this.active = false;
        this.x = Math.random() * (width * 0.75) + width * 0.1;
        this.y = Math.random() * (height * 0.35);
        this.length = Math.random() * 70 + 45;
        this.speed = Math.random() * 6 + 5.5;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.25;
        this.dx = Math.cos(this.angle) * this.speed;
        this.dy = Math.sin(this.angle) * this.speed;
        this.alpha = 1.0;
        this.fade = Math.random() * 0.016 + 0.012;
      }

      spawn() {
        this.reset();
        this.active = true;
      }

      update() {
        if (!this.active) return;
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= this.fade;
        if (this.alpha <= 0 || this.y > height * 0.45 || this.x > width) {
          this.active = false;
        }
      }

      draw() {
        if (!this.active || this.alpha <= 0) return;
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.7, `rgba(186, 230, 253, ${this.alpha * 0.6})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${this.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    const shootingStar = new ShootingStar();
    let meteorTimer = 0;

    // Fluid requestAnimationFrame loop for BOTH mobile and desktop
    let time = 0;
    let isVisible = true;

    function renderStarfield() {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);
        time++;

        // Update and draw drifting stars
        for (let i = 0; i < stars.length; i++) {
          stars[i].update(time);
          stars[i].draw();
        }

        // Periodically trigger a shooting star (every ~6-9 seconds)
        meteorTimer++;
        if (!shootingStar.active && meteorTimer > 380 && Math.random() < 0.03) {
          shootingStar.spawn();
          meteorTimer = 0;
        }

        if (shootingStar.active) {
          shootingStar.update();
          shootingStar.draw();
        }
      }
      requestAnimationFrame(renderStarfield);
    }
    requestAnimationFrame(renderStarfield);

    // Smart pause only when scrolled deep into Earth section (saves battery)
    window.addEventListener('scroll', () => {
      const shouldBeVisible = window.scrollY < window.innerHeight * 2.8;
      if (shouldBeVisible !== isVisible) {
        isVisible = shouldBeVisible;
      }
    }, { passive: true });

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = Math.round(window.innerHeight * 2.5);
        stars.forEach(s => s.calcAltitudeFade());
      }, 250);
    }, { passive: true });
  }

  // =========================================================================
  // 2. DYNAMIC ALTITUDE THEME DETECTOR (Lightweight Scroll Spy)
  // =========================================================================
  const header = document.getElementById('main-nav');
  const sections = [
    { id: 'space', element: document.getElementById('space'), theme: 'theme-space' },
    { id: 'skit', element: document.getElementById('skit'), theme: 'theme-skit' },
    { id: 'sky', element: document.getElementById('sky'), theme: 'theme-sky' },
    { id: 'earth', element: document.getElementById('earth'), theme: 'theme-earth' }
  ];
  const navPills = document.querySelectorAll('.alt-link');

  let sectionOffsets = [];
  function cacheSectionOffsets() {
    sectionOffsets = sections.map(({ id, element, theme }) => ({
      id,
      theme,
      top: element ? element.offsetTop : 0,
      height: element ? element.offsetHeight : 0
    }));
  }
  cacheSectionOffsets();

  let resizeOffsetDebounce;
  window.addEventListener('resize', () => {
    clearTimeout(resizeOffsetDebounce);
    resizeOffsetDebounce = setTimeout(cacheSectionOffsets, 200);
  }, { passive: true });

  let activeTheme = '';
  let activeSectionId = '';

  function updateAltitudeTheme() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;
    let targetTheme = 'theme-space';
    let targetSectionId = 'space';

    for (let i = 0; i < sectionOffsets.length; i++) {
      const { id, theme, top, height } = sectionOffsets[i];
      if (scrollPosition >= top && scrollPosition < top + height) {
        targetTheme = theme;
        targetSectionId = id;
        break;
      }
    }

    if (targetTheme !== activeTheme) {
      activeTheme = targetTheme;
      if (header) {
        header.classList.remove('theme-space', 'theme-skit', 'theme-sky', 'theme-earth');
        header.classList.add(activeTheme);
      }
    }

    if (targetSectionId !== activeSectionId) {
      activeSectionId = targetSectionId;
      navPills.forEach(pill => {
        if (pill.getAttribute('data-target') === activeSectionId) {
          pill.classList.add('active-pill');
        } else {
          pill.classList.remove('active-pill');
        }
      });
    }
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateAltitudeTheme();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  updateAltitudeTheme();

  // =========================================================================
  // 3. SMOOTH NAVIGATION (Programmatic only — zero interference with touch)
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Ensure all liquid-reveal elements are visible
  document.querySelectorAll('.liquid-reveal').forEach(el => el.classList.add('revealed'));

});