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

  // =========================================================================
  // 4. DYNAMIC RANDOM AIRPLANE SYSTEM
  // Randomizes airplane model, flight altitude corridor, and cruise pacing
  // on every pass so the sky features varied, unpredictable airplanes!
  // =========================================================================
  const AIRPLANE_MODELS = [
    // Model 1: Flagship Commercial Airliner (Two-Tone Royal Blue & White - Image 3)
    `<svg width="116" height="46" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="plane-clean filter drop-shadow-md">
      <rect x="46" y="29" width="14" height="6" rx="3" fill="#1e40af"/>
      <ellipse cx="60" cy="32" rx="1.4" ry="3" fill="#f8fafc"/>
      <path d="M 6 24 L 22 24 L 18 26.5 L 4 26.5 Z" fill="#2563eb"/>
      <path d="M 14 24 L 34 6 L 22 6 L 9 24 Z" fill="#2563eb"/>
      <path d="M 18 10.5 L 30 10.5" stroke="#ffffff" stroke-width="0.9" opacity="0.9"/>
      <path d="M 12 24 C 16 17, 28 15, 48 15 L 85 15 C 100 15, 110 19, 114 24 L 12 24 Z" fill="#ffffff"/>
      <path d="M 12 24 L 114 24 C 110 28.5, 100 31, 85 31 L 38 31 C 24 31, 16 27.5, 12 24 Z" fill="#2563eb"/>
      <path d="M 108 20.5 C 111 22.5, 111 25.5, 108 27.5" stroke="#cbd5e1" stroke-width="0.6" fill="none"/>
      <path d="M 98 17.5 L 106 20.5 L 105 24 L 97 22 Z" fill="#0f172a"/>
      <path d="M 99 18.5 L 104 20.5" stroke="#38bdf8" stroke-width="0.75"/>
      <rect x="89" y="17" width="5.5" height="11.5" rx="1.5" stroke="#1d4ed8" stroke-width="0.75" fill="none"/>
      <rect x="27" y="17" width="5.5" height="11.5" rx="1.5" stroke="#1d4ed8" stroke-width="0.75" fill="none"/>
      <rect x="38" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="44.5" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="51" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="57.5" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="64" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="70.5" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="77" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="83.5" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <path d="M 48 25 L 70 25 L 46 38 L 35 38 Z" fill="#1d4ed8"/>
      <path d="M 50 25 L 70 25 L 56 32 L 42 32 Z" fill="#3b82f6"/>
      <rect x="56" y="29.5" width="2.5" height="3.5" fill="#64748b"/>
      <rect x="50" y="31.5" width="18" height="8.5" rx="4.25" fill="#2563eb"/>
      <ellipse cx="68" cy="35.75" rx="1.8" ry="4.25" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.5"/>
      <ellipse cx="68" cy="35.75" rx="1" ry="2.5" fill="#0f172a"/>
      <circle cx="68" cy="35.75" r="0.45" fill="#cbd5e1"/>
    </svg>`,

    // Model 2: Executive Corporate Business Jet (Image 1)
    `<svg width="112" height="42" viewBox="0 0 114 44" fill="none" xmlns="http://www.w3.org/2000/svg" class="plane-clean filter drop-shadow-md">
      <rect x="24" y="15" width="16" height="7" rx="3.5" fill="#0369a1"/>
      <ellipse cx="40" cy="18.5" rx="1.4" ry="3.5" fill="#f8fafc"/>
      <ellipse cx="40" cy="18.5" rx="0.8" ry="2" fill="#0f172a"/>
      <path d="M 12 24 L 32 8 L 22 8 L 8 24 Z" fill="#0284c7"/>
      <path d="M 6 24 L 18 24 L 15 26 L 4 26 Z" fill="#0369a1"/>
      <path d="M 10 24 C 14 18, 25 16, 48 16 L 82 16 C 96 16, 106 20, 110 24 L 10 24 Z" fill="#ffffff"/>
      <path d="M 10 24 L 110 24 C 106 28, 96 30, 82 30 L 36 30 C 22 30, 14 27, 10 24 Z" fill="#0284c7"/>
      <path d="M 94 18 C 98 18, 104 21, 104 23.5 L 92 23.5 L 92 20 Z" fill="#0f172a"/>
      <path d="M 94 19 C 97 19, 101 21, 102 22.5" stroke="#38bdf8" stroke-width="0.75"/>
      <circle cx="44" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="51" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="58" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="65" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="72" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="79" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="86" cy="21.5" r="2.2" fill="#0f172a"/>
      <path d="M 52 24 L 68 24 L 46 37 L 38 37 Z" fill="#0284c7"/>
      <path d="M 38 37 L 36 33 L 40 37 Z" fill="#38bdf8"/>
    </svg>`,

    // Model 3: Modern Regional Twin-Jet Cruiser (Image 2)
    `<svg width="114" height="44" viewBox="0 0 118 46" fill="none" xmlns="http://www.w3.org/2000/svg" class="plane-clean filter drop-shadow-md">
      <rect x="45" y="28" width="13" height="5.5" rx="2.75" fill="#1e3a8a"/>
      <ellipse cx="58" cy="30.75" rx="1.3" ry="2.75" fill="#f8fafc"/>
      <path d="M 6 23 L 20 23 L 17 25.5 L 4 25.5 Z" fill="#0284c7"/>
      <path d="M 12 23 L 30 7 L 20 7 L 8 23 Z" fill="#0ea5e9"/>
      <path d="M 16 11 L 26 11" stroke="#ffffff" stroke-width="0.8" opacity="0.9"/>
      <path d="M 10 23 C 14 17, 26 15, 46 15 L 82 15 C 96 15, 106 19, 110 23 L 10 23 Z" fill="#ffffff"/>
      <path d="M 10 23 L 110 23 C 107 27, 98 29.5, 84 29.5 L 36 29.5 C 22 29.5, 14 26.5, 10 23 Z" fill="#0284c7"/>
      <rect x="18" y="22" width="88" height="2" fill="#38bdf8"/>
      <path d="M 94 17 L 102 19.5 L 101 23 L 93 21 Z" fill="#0f172a"/>
      <path d="M 95 18 L 100 19.5" stroke="#bae6fd" stroke-width="0.7"/>
      <rect x="36" y="18.5" width="3" height="4.5" rx="1.5" fill="#0f172a"/>
      <rect x="42" y="18.5" width="3" height="4.5" rx="1.5" fill="#0f172a"/>
      <rect x="48" y="18.5" width="3" height="4.5" rx="1.5" fill="#0f172a"/>
      <rect x="54" y="18.5" width="3" height="4.5" rx="1.5" fill="#0f172a"/>
      <rect x="60" y="18.5" width="3" height="4.5" rx="1.5" fill="#0f172a"/>
      <rect x="66" y="18.5" width="3" height="4.5" rx="1.5" fill="#0f172a"/>
      <rect x="72" y="18.5" width="3" height="4.5" rx="1.5" fill="#0f172a"/>
      <rect x="78" y="18.5" width="3" height="4.5" rx="1.5" fill="#0f172a"/>
      <rect x="84" y="18.5" width="3" height="4.5" rx="1.5" fill="#0f172a"/>
      <path d="M 46 24 L 66 24 L 44 36 L 34 36 Z" fill="#0284c7"/>
      <path d="M 34 36 L 32 32 L 35 36 Z" fill="#38bdf8"/>
      <rect x="54" y="28.5" width="2" height="3" fill="#64748b"/>
      <rect x="48" y="30.5" width="16" height="7.5" rx="3.75" fill="#0284c7"/>
      <ellipse cx="64" cy="34.25" rx="1.6" ry="3.75" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.5"/>
      <ellipse cx="64" cy="34.25" rx="0.9" ry="2.2" fill="#0f172a"/>
    </svg>`
  ];

  const plane1 = document.querySelector('.plane-stream-1');
  const plane2 = document.querySelector('.plane-stream-2');

  let lastModel1 = -1;
  let lastModel2 = -1;

  function randomizePlane(planeEl, laneType) {
    if (!planeEl) return;

    // Pick a new random model different from the previous one
    let newIndex;
    const lastIndex = laneType === 'upper' ? lastModel1 : lastModel2;
    do {
      newIndex = Math.floor(Math.random() * AIRPLANE_MODELS.length);
    } while (AIRPLANE_MODELS.length > 1 && newIndex === lastIndex);

    if (laneType === 'upper') {
      lastModel1 = newIndex;
      // Randomize altitude within safe upper empty corridor (11% to 17%)
      const randomTop = (11 + Math.random() * 5.5).toFixed(1);
      planeEl.style.top = `${randomTop}%`;
    } else {
      lastModel2 = newIndex;
      // Randomize altitude within safe lower empty corridor (81% to 86%)
      const randomTop = (81 + Math.random() * 4.5).toFixed(1);
      planeEl.style.top = `${randomTop}%`;
    }

    // Apply the newly chosen model
    planeEl.innerHTML = AIRPLANE_MODELS[newIndex];

    // Slightly randomize duration (44s to 52s) for organic flight rhythm
    const randomDuration = (44 + Math.random() * 8).toFixed(1);
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
