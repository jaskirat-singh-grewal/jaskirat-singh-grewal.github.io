/**
 * particles-config.js
 * Handles: tsParticles background, nav glass-on-scroll, scroll-reveal.
 *
 * NOTE: The @tsparticles/confetti bundle does not ship the "links" connector
 * or "bubble" hover mode. We use the full tsParticles v3 bundle instead:
 *   https://cdn.jsdelivr.net/npm/tsparticles@3/tsparticles.bundle.min.js
 */

/* ── tsParticles background ─────────────────────────────────────────────── */
(function initParticles() {
  if (typeof tsParticles === 'undefined') {
    console.warn('[particles-config] tsParticles not loaded — skipping.');
    return;
  }

  tsParticles.load({
    id: 'tsparticles',
    options: {

      /* fullScreen: true → tsParticles manages a fixed canvas on <body> */
      fullScreen: { enable: true, zIndex: 0 },
      background:  { color: 'transparent' },
      fpsLimit: 60,

      particles: {
        number: {
          value: 70,
          density: { enable: true, width: 1200, height: 900 }
        },

        /* Mix of white, soft pink, soft purple */
        color: { value: ['#ffffff', '#e37682', '#5f4d93', '#c8b0e0'] },

        shape: {
          /* circle + 4-pointed star (diamond-like) */
          type: ['circle', 'star'],
          options: {
            star: { sides: 4, inset: 2 }
          }
        },

        opacity: {
          value: { min: 0.2, max: 0.55 },
          animation: {
            enable: true,
            speed: 0.6,
            minimumValue: 0.1,
            sync: false
          }
        },

        size: { value: { min: 1, max: 3.5 } },

        /* Connecting lines between nearby particles */
        links: {
          enable:   true,
          distance: 145,
          color:    '#9080be',
          opacity:  0.18,
          width:    1
        },

        move: {
          enable:    true,
          speed:     0.65,
          direction: 'none',
          random:    true,
          straight:  false,
          outModes:  { default: 'out' }
        }
      },

      interactivity: {
        /* Listen on window — canvas has pointer-events: none so this ensures
           hover detection still works across the whole page. */
        detectsOn: 'window',
        events: {
          onHover: { enable: true, mode: 'bubble' },
          resize:  { enable: true }
        },
        modes: {
          /* On hover: particles near cursor grow bigger and brighten */
          bubble: {
            distance: 130,
            size:     8,
            duration: 0.35,
            opacity:  1
          }
        }
      },

      detectRetina: true
    }
  }).catch(function(err) {
    console.warn('[particles-config] tsParticles error:', err);
  });
}());

/* ── Nav glass blur on scroll ───────────────────────────────────────────── */
(function initNavGlass() {
  var nav = document.getElementById('nav');
  if (!nav) return;

  var ticking = false;

  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(function() {
      if (window.scrollY > 60) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
      ticking = false;
    });
  }, { passive: true });
}());

/* ── Scroll reveal (IntersectionObserver) ───────────────────────────────── */
(function initScrollReveal() {
  if (typeof IntersectionObserver === 'undefined') return;

  /* Target inner elements — the Stellar template already handles the
     outer section fade via its .inactive / Scrollex system.             */
  var targets = document.querySelectorAll([
    '#first .features li',
    '#second .content',
    '#cta .major',
    '#footer section'
  ].join(', '));

  /* Hide and stagger */
  targets.forEach(function(el, i) {
    el.classList.add('sr-hidden');
    el.style.transitionDelay = (i % 4 * 0.12) + 's';
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('sr-hidden');
      entry.target.classList.add('sr-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(function(el) { observer.observe(el); });
}());
