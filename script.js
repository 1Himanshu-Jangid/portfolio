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
  // 4. DYNAMIC RANDOM AIRPLANE SYSTEM (PURE WHITE AIRPLANES & WHITE JETS)
  // Clean, minimalist pure white commercial airliners and executive jets.
  // Alternates models smoothly on every continuous flight iteration.
  // =========================================================================
  const AIRPLANE_MODELS = [
    // Model 0: Pure White Commercial Passenger Airplane
    `<svg width="116" height="46" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="plane-clean filter drop-shadow-md">
      <!-- Far Turbofan Engine (Pure White) -->
      <rect x="46" y="29" width="14" height="6" rx="3" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
      <ellipse cx="60" cy="32" rx="1.4" ry="3" fill="#ffffff"/>
      
      <!-- Horizontal Stabilizer (Pure White) -->
      <path d="M 6 24 L 22 24 L 18 26.5 L 4 26.5 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.5"/>
      
      <!-- Swept Vertical Stabilizer Tail Fin (Pure White) -->
      <path d="M 14 24 L 34 6 L 22 6 L 9 24 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.5"/>
      <path d="M 17 11 L 28 11" stroke="#e2e8f0" stroke-width="0.8"/>

      <!-- Fuselage Body (Crisp Pure White) -->
      <path d="M 12 24 C 16 16, 28 14.5, 48 14.5 L 85 14.5 C 100 14.5, 110 18.5, 114 24 C 110 29.5, 100 32.5, 85 32.5 L 38 32.5 C 24 32.5, 16 28.5, 12 24 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.6"/>

      <!-- Subtle Aerodynamic Contour -->
      <path d="M 16 24.5 L 110 24.5" stroke="#f1f5f9" stroke-width="1"/>

      <!-- Nose Radome Seam -->
      <path d="M 108 20.5 C 111 22.5, 111 25.5, 108 27.5" stroke="#cbd5e1" stroke-width="0.6" fill="none"/>

      <!-- Cockpit Windshield (Dark Aviator Visor with Glare) -->
      <path d="M 98 17.5 L 106 20.5 L 105 24 L 97 22 Z" fill="#0f172a"/>
      <path d="M 99 18.5 L 104 20.5" stroke="#38bdf8" stroke-width="0.75"/>

      <!-- Forward & Aft Passenger Doors -->
      <rect x="89" y="17" width="5.5" height="11.5" rx="1.5" stroke="#94a3b8" stroke-width="0.75" fill="none"/>
      <rect x="27" y="17" width="5.5" height="11.5" rx="1.5" stroke="#94a3b8" stroke-width="0.75" fill="none"/>

      <!-- Passenger Cabin Windows -->
      <rect x="38" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="44.5" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="51" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="57.5" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="64" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="70.5" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="77" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>
      <rect x="83.5" y="19.5" width="3.2" height="5" rx="1.6" fill="#0f172a"/>

      <!-- Swept Low Wing (Pure White) -->
      <path d="M 48 25 L 70 25 L 46 38 L 35 38 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.6"/>
      <path d="M 50 25 L 70 25 L 56 32 L 42 32 Z" fill="#f8fafc"/>

      <!-- Near Jet Turbofan Engine (Pure White) -->
      <rect x="56" y="29.5" width="2.5" height="3.5" fill="#94a3b8"/>
      <rect x="50" y="31.5" width="18" height="8.5" rx="4.25" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.6"/>
      <ellipse cx="68" cy="35.75" rx="1.8" ry="4.25" fill="#ffffff" stroke="#94a3b8" stroke-width="0.6"/>
      <ellipse cx="68" cy="35.75" rx="1" ry="2.5" fill="#0f172a"/>
      <circle cx="68" cy="35.75" r="0.45" fill="#cbd5e1"/>
    </svg>`,

    // Model 1: Pure White Executive Jet
    `<svg width="112" height="42" viewBox="0 0 114 44" fill="none" xmlns="http://www.w3.org/2000/svg" class="plane-clean filter drop-shadow-md">
      <!-- Rear Mounted Twin Turbofans (Pure White) -->
      <rect x="24" y="15" width="16" height="7" rx="3.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.6"/>
      <ellipse cx="40" cy="18.5" rx="1.4" ry="3.5" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.5"/>
      <ellipse cx="40" cy="18.5" rx="0.8" ry="2" fill="#0f172a"/>
      
      <!-- Swept Vertical Tail Fin (Pure White) -->
      <path d="M 12 24 L 32 8 L 22 8 L 8 24 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.6"/>
      <path d="M 6 24 L 18 24 L 15 26 L 4 26 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.5"/>

      <!-- Fuselage Body (Pure White) -->
      <path d="M 10 24 C 14 17.5, 25 15.5, 48 15.5 L 82 15.5 C 96 15.5, 106 19.5, 110 24 C 106 28.5, 96 31.5, 82 31.5 L 36 31.5 C 22 31.5, 14 28, 10 24 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.6"/>

      <!-- Sleek Curved Cockpit Visor -->
      <path d="M 94 17.5 C 98 17.5, 104 20.5, 104 23 L 92 23 L 92 19.5 Z" fill="#0f172a"/>
      <path d="M 94 18.5 C 97 18.5, 101 20.5, 102 22" stroke="#38bdf8" stroke-width="0.75"/>

      <!-- Executive Dark Porthole Windows -->
      <circle cx="44" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="51" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="58" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="65" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="72" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="79" cy="21.5" r="2.2" fill="#0f172a"/>
      <circle cx="86" cy="21.5" r="2.2" fill="#0f172a"/>

      <!-- Swept Delta Wing (Pure White) -->
      <path d="M 52 24 L 68 24 L 46 37 L 38 37 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.6"/>
      <path d="M 38 37 L 36 33 L 40 37 Z" fill="#e2e8f0"/>
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
