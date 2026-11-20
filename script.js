/**
 * Himanshu Jangid — Potfolie
 * 4-Page Atmospheric Engine: Starfield Canvas & Dynamic Altitude Scroll Spy
 * PERFORMANCE-OPTIMIZED: Zero jank on mobile & laptop
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 0. DETECT MOBILE
  // =========================================================================
  const isMobile = window.innerWidth < 768;

  // =========================================================================
  // 1. STARFIELD CANVAS
  //    MOBILE: Canvas completely disabled — zero GPU bitmap, zero memory
  //    DESKTOP: 30fps-capped twinkle loop, pauses when scrolled past stars
  // =========================================================================
  const canvas = document.getElementById('stars-canvas');
  if (canvas && !isMobile) {
    // Desktop only — mobile skips canvas entirely for maximum performance
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 2.7);

    const starCount = Math.min(180, Math.floor((width * height) / 6000));
    const stars = [];

    class Star {
      constructor() {
        this.reset();
        this.originY = Math.random() * height;
        this.y = this.originY;
        this.calcAltitudeFade();
      }

      calcAltitudeFade() {
        const fadeStart = height * 0.44;
        const fadeEnd = height * 0.96;
        if (this.originY <= fadeStart) {
          this.altitudeFade = 1.0;
        } else if (this.originY >= fadeEnd) {
          this.altitudeFade = 0;
        } else {
          const ratio = (this.originY - fadeStart) / (fadeEnd - fadeStart);
          this.altitudeFade = Math.pow(1.0 - ratio, 1.6);
        }
      }

      reset() {
        this.originX = Math.random() * width;
        this.originY = Math.random() * height;
        this.x = this.originX;
        this.y = this.originY;
        this.radius = Math.random() * 1.4 + 0.4;
        this.baseAlpha = Math.random() * 0.75 + 0.25;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.02 + 0.008;
        this.twinkleOffset = Math.random() * Math.PI * 2;

        this.driftRadius = Math.random() * 2.5 + 0.8;
        this.driftSpeedX = Math.random() * 0.01 + 0.004;
        this.driftSpeedY = Math.random() * 0.01 + 0.004;
        this.driftPhaseX = Math.random() * Math.PI * 2;
        this.driftPhaseY = Math.random() * Math.PI * 2;

        this.calcAltitudeFade();
      }

      update(time) {
        this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.28;
        if (this.alpha < 0.1) this.alpha = 0.1;
        if (this.alpha > 1) this.alpha = 1;

        this.x = this.originX + Math.sin(time * this.driftSpeedX + this.driftPhaseX) * this.driftRadius;
        this.y = this.originY + Math.cos(time * this.driftSpeedY + this.driftPhaseY) * this.driftRadius;
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

    let time = 0;
    let resizeDebounce;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight * 2.7;
        stars.forEach(s => s.calcAltitudeFade());
      }, 300);
    }, { passive: true });

    let lastFrame = 0;
    let starsVisible = true;

    function renderStars(timestamp) {
      if (starsVisible && (!lastFrame || timestamp - lastFrame >= 33)) {
        lastFrame = timestamp;
        if (window.scrollY < window.innerHeight * 2.5) {
          ctx.clearRect(0, 0, width, height);
          time++;
          for (let i = 0; i < stars.length; i++) {
            stars[i].update(time);
            stars[i].draw();
          }
        } else {
          starsVisible = false;
        }
      }
      if (!starsVisible && window.scrollY < window.innerHeight * 2.5) {
        starsVisible = true;
      }
      requestAnimationFrame(renderStars);
    }
    requestAnimationFrame(renderStars);
  } else if (canvas && isMobile) {
    // MOBILE: Hide canvas entirely — zero memory, zero GPU bitmap
    canvas.style.display = 'none';
  }

  // =========================================================================
  // 2. DYNAMIC ALTITUDE THEME DETECTOR (with state guards)
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

  // Single rAF-throttled scroll handler
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
  // 3. SMOOTH NAVIGATION
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

  // =========================================================================
  // 3b. CONTENT STABILITY
  // =========================================================================
  document.querySelectorAll('.liquid-reveal').forEach(el => el.classList.add('revealed'));

  // =========================================================================
  // 4. PAUSE OFFSCREEN CSS ANIMATIONS (IntersectionObserver)
  //    Saves massive GPU/CPU by stopping satellites, clouds, and planes
  //    when they're scrolled out of view
  // =========================================================================
  if ('IntersectionObserver' in window) {
    const animContainers = document.querySelectorAll('.satellites-container, .sky-flight-system');
    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('anim-paused');
        } else {
          entry.target.classList.add('anim-paused');
        }
      });
    }, {
      rootMargin: '200px 0px', // start animations 200px before entering viewport
      threshold: 0
    });

    animContainers.forEach(c => animObserver.observe(c));
  }

  // =========================================================================
  // 5. AIRPLANE MODEL RANDOMIZER
  //    Uses visibility toggle instead of innerHTML replacement (zero DOM thrashing)
  // =========================================================================
  const plane1 = document.querySelector('.plane-stream-1');
  const plane2 = document.querySelector('.plane-stream-2');

  function randomizePlanePosition(planeEl, laneType) {
    if (!planeEl) return;
    if (laneType === 'upper') {
      const randomTop = (12 + Math.random() * 3).toFixed(1);
      planeEl.style.top = `${randomTop}%`;
    } else {
      const randomTop = (82 + Math.random() * 3).toFixed(1);
      planeEl.style.top = `${randomTop}%`;
    }
    // Calm, steady cruise pacing (46s to 52s)
    const randomDuration = (46 + Math.random() * 6).toFixed(1);
    planeEl.style.animationDuration = `${randomDuration}s`;
  }

  if (plane1) {
    randomizePlanePosition(plane1, 'upper');
    plane1.addEventListener('animationiteration', () => {
      randomizePlanePosition(plane1, 'upper');
    });
  }

  if (plane2) {
    randomizePlanePosition(plane2, 'lower');
    plane2.addEventListener('animationiteration', () => {
      randomizePlanePosition(plane2, 'lower');
    });
  }

});
