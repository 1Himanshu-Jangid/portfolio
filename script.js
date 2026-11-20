/**
 * Himanshu Jangid — Potfolie
 * 4-Page Atmospheric Engine: Starfield Canvas & Dynamic Altitude Scroll Spy
 * Ultra-Smooth 60/120 FPS Performance for Mobile & Laptop
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 0. DEVICE DETECTION
  // =========================================================================
  const isMobile = window.innerWidth < 768;

  // =========================================================================
  // 1. STARFIELD CANVAS
  //    MOBILE: Static crisp star rendering (zero CPU/GPU loop overhead)
  //    DESKTOP: Silky smooth 60/120fps requestAnimationFrame loop
  // =========================================================================
  const canvas = document.getElementById('stars-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = Math.round(window.innerHeight * 2.5));

    const starCount = isMobile ? 36 : Math.min(140, Math.floor((width * height) / 7000));
    const stars = [];

    class Star {
      constructor() {
        this.reset();
        this.originY = Math.random() * height;
        this.y = this.originY;
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

      reset() {
        this.originX = Math.random() * width;
        this.originY = Math.random() * height;
        this.x = this.originX;
        this.y = this.originY;
        this.radius = Math.random() * 1.3 + 0.5;
        this.baseAlpha = Math.random() * 0.7 + 0.3;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.015 + 0.006;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.driftRadius = Math.random() * 2.0 + 0.5;
        this.driftSpeed = Math.random() * 0.008 + 0.003;
        this.driftPhase = Math.random() * Math.PI * 2;
        this.calcAltitudeFade();
      }

      update(time) {
        this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.25;
        if (this.alpha < 0.1) this.alpha = 0.1;
        if (this.alpha > 1) this.alpha = 1;
        this.x = this.originX + Math.sin(time * this.driftSpeed + this.driftPhase) * this.driftRadius;
        this.y = this.originY + Math.cos(time * this.driftSpeed + this.driftPhase) * this.driftRadius;
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

    if (isMobile) {
      // MOBILE: Draw once statically — ZERO ongoing CPU/GPU loop
      const drawStaticStars = () => {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < stars.length; i++) {
          stars[i].draw();
        }
      };
      drawStaticStars();

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = Math.round(window.innerHeight * 2.5);
          stars.forEach(s => s.reset());
          drawStaticStars();
        }, 250);
      }, { passive: true });

    } else {
      // DESKTOP: Native fluid requestAnimationFrame loop
      let time = 0;
      let isVisible = true;

      const renderStars = () => {
        if (isVisible) {
          ctx.clearRect(0, 0, width, height);
          time++;
          for (let i = 0; i < stars.length; i++) {
            stars[i].update(time);
            stars[i].draw();
          }
        }
        requestAnimationFrame(renderStars);
      };
      requestAnimationFrame(renderStars);

      // Pause rendering when scrolled past the stars region
      window.addEventListener('scroll', () => {
        const shouldBeVisible = window.scrollY < window.innerHeight * 2.4;
        if (shouldBeVisible !== isVisible) {
          isVisible = shouldBeVisible;
        }
      }, { passive: true });

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