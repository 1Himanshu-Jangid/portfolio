/**
 * Himanshu Jangid — Potfolie
 * 4-Page Atmospheric Engine: Starfield Canvas & Dynamic Altitude Scroll Spy
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. STARFIELD CANVAS GENERATOR (Space & Stratosphere with Altitude Fade)
  // Highly optimized for all devices (Mobile & Desktop) to prevent stutter/glitch
  // =========================================================================
  const canvas = document.getElementById('stars-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 2.7);

    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 65 : Math.min(260, Math.floor((width * height) / 4500));
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

        this.driftRadius = Math.random() * 3.0 + 1.0;
        this.driftSpeedX = Math.random() * 0.012 + 0.005;
        this.driftSpeedY = Math.random() * 0.012 + 0.005;
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

    let resizeDebounce;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight * 2.7;
        stars.forEach(s => s.calcAltitudeFade());
      }, 200);
    }, { passive: true });

    let time = 0;
    function renderStars() {
      // Only execute canvas redraw when Space/SKIT are visible to conserve battery & GPU
      if (window.scrollY < window.innerHeight * 2.5) {
        ctx.clearRect(0, 0, width, height);
        time++;
        for (let i = 0; i < stars.length; i++) {
          stars[i].update(time);
          stars[i].draw();
        }
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
  window.addEventListener('resize', cacheSectionOffsets, { passive: true });

  function updateAltitudeTheme() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;
    let currentTheme = 'theme-space';
    let currentSectionId = 'space';

    for (let i = 0; i < sectionOffsets.length; i++) {
      const { id, theme, top, height } = sectionOffsets[i];
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentTheme = theme;
        currentSectionId = id;
        break;
      }
    }

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

  // High-performance passive scroll spy with requestAnimationFrame (Zero layout thrashing)
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

  // =========================================================================
  // 3b. CONTENT STABILITY (All elements immediately stable, zero scroll flash)
  // =========================================================================
  document.querySelectorAll('.liquid-reveal').forEach(el => el.classList.add('revealed'));

  // =========================================================================
  // 4. DYNAMIC RANDOM AIRPLANE SYSTEM (ORIGINAL FIRST TIME DESIGN)
  // Clean, sleek twin-wing aerodynamic airliners from the initial build.
  // Smoothly alternates models on every continuous flight iteration.
  // =========================================================================
  const AIRPLANE_MODELS = [
    // Model 0: Commercial Twin-Jet Airliner (Original First Design from initial build)
    `<svg width="95" height="40" viewBox="0 0 95 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="plane-clean filter drop-shadow-md">
      <!-- Fuselage -->
      <path d="M12 20 C18 17, 70 17, 85 19 C92 20, 95 21, 95 21 C95 21, 92 22, 85 23 C70 25, 18 25, 12 22 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8"/>
      <!-- Main Wings -->
      <path d="M42 21 L30 5 L44 5 L60 21 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="0.8"/>
      <path d="M42 21 L30 37 L44 37 L60 21 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.8"/>
      <!-- Tail Wing -->
      <path d="M14 21 L6 8 L18 8 L24 21 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.8"/>
      <!-- Cockpit Windows -->
      <path d="M88 19.5 L91 20.2 L88 20.8 Z" fill="#0284c7"/>
      <!-- Passenger Window Dots -->
      <circle cx="45" cy="20.5" r="0.9" fill="#0284c7"/>
      <circle cx="50" cy="20.5" r="0.9" fill="#0284c7"/>
      <circle cx="55" cy="20.5" r="0.9" fill="#0284c7"/>
      <circle cx="60" cy="20.5" r="0.9" fill="#0284c7"/>
      <circle cx="65" cy="20.5" r="0.9" fill="#0284c7"/>
      <circle cx="70" cy="20.5" r="0.9" fill="#0284c7"/>
    </svg>`,

    // Model 1: Executive High-Altitude Jet (Original First Design from initial build)
    `<svg width="76" height="32" viewBox="0 0 70 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="plane-clean filter drop-shadow-md">
      <!-- Fuselage -->
      <path d="M8 15 C15 13, 50 13, 62 14.5 C68 15, 70 15.5, 70 15.5 C70 15.5, 68 16, 62 16.5 C50 18, 15 18, 8 16 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8"/>
      <!-- Swept Wings -->
      <path d="M30 15 L20 4 L30 4 L45 15 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.8"/>
      <path d="M30 15 L20 26 L30 26 L45 15 Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.8"/>
      <!-- Tail -->
      <path d="M10 15 L3 6 L12 6 L18 15 Z" fill="#38bdf8"/>
      <!-- Cockpit -->
      <path d="M63 14.8 L66 15.2 L63 15.6 Z" fill="#0284c7"/>
    </svg>`,

    // Model 2: Atmospheric Twin-Wing Jet (Original First Design 3)
    `<svg width="68" height="28" viewBox="0 0 45 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="plane-clean filter drop-shadow-md">
      <!-- Fuselage -->
      <path d="M5 10 C10 8.5, 32 8.5, 40 9.5 C44 10, 45 10, 45 10 C45 10, 44 10.5, 40 11 C32 12, 10 12, 5 10.5 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="0.6"/>
      <!-- Wings -->
      <path d="M18 10 L12 2 L18 2 L28 10 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="0.6"/>
      <path d="M18 10 L12 18 L18 18 L28 10 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.6"/>
      <!-- Tail -->
      <path d="M8 10 L4 4 L9 4 L12 10 Z" fill="#38bdf8"/>
    </svg>`
  ];

  const plane1 = document.querySelector('.plane-stream-1');
  const plane2 = document.querySelector('.plane-stream-2');

  let lastModel1 = -1;
  let lastModel2 = -1;

  function randomizePlane(planeEl, laneType) {
    if (!planeEl) return;

    // Smoothly alternate between pure white passenger airliner and pure white jet
    let newIndex;
    const lastIndex = laneType === 'upper' ? lastModel1 : lastModel2;
    if (lastIndex === -1) {
      newIndex = laneType === 'upper' ? 0 : 1;
    } else {
      newIndex = (lastIndex + 1) % AIRPLANE_MODELS.length;
    }

    if (laneType === 'upper') {
      lastModel1 = newIndex;
      // Randomize altitude within safe upper empty corridor (12% to 15%)
      const randomTop = (12 + Math.random() * 3).toFixed(1);
      planeEl.style.top = `${randomTop}%`;
    } else {
      lastModel2 = newIndex;
      // Randomize altitude within safe lower empty corridor (82% to 85%)
      const randomTop = (82 + Math.random() * 3).toFixed(1);
      planeEl.style.top = `${randomTop}%`;
    }

    // Apply the newly chosen model
    planeEl.innerHTML = AIRPLANE_MODELS[newIndex];

    // Calm, steady flight cruise pacing (46s to 52s)
    const randomDuration = (46 + Math.random() * 6).toFixed(1);
    planeEl.style.animationDuration = `${randomDuration}s`;
  }

  // Initialize both airplanes with different models immediately on load
  if (plane1) {
    randomizePlane(plane1, 'upper');
    plane1.addEventListener('animationiteration', () => {
      randomizePlane(plane1, 'upper');
    });
  }

  if (plane2) {
    randomizePlane(plane2, 'lower');
    plane2.addEventListener('animationiteration', () => {
      randomizePlane(plane2, 'lower');
    });
  }

});
