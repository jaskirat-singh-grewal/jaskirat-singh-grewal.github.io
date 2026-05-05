/**
 * particles-config.js
 * Handles: tsParticles background, nav glass-on-scroll, scroll-reveal.
 */

/* ── tsParticles background ─────────────────────────────────────────────── */
(function initParticles() {
  if (typeof tsParticles === 'undefined') {
    console.warn('[particles-config] tsParticles not loaded.');
    return;
  }

  tsParticles.load({
    id: 'tsparticles',
    options: {
      fullScreen: { enable: true, zIndex: 0 },
      background: { color: 'transparent' },
      fpsLimit: 60,

      particles: {
        number: {
          value: 50,
          density: { enable: true, width: 1200, height: 900 }
        },
        color: { value: ['#ffffff', '#ffd6e0', '#e37682', '#a78bfa', '#c4b5fd'] },
        shape: { type: ['circle', 'star', 'triangle'], options: { star: { sides: 4, inset: 2 } } },
        opacity: { value: { min: 0.3, max: 0.8 } },
        size: { value: { min: 2, max: 6 } },
        links: {
          enable: true,
          distance: 150,
          color: '#a78bfa',
          opacity: 0.25,
          width: 1.5
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' }
        }
      },

      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: { enable: true, mode: 'bubble' },
          resize: { enable: true }
        },
        modes: {
          bubble: {
            distance: 150,
            size: 12,
            duration: 0.4,
            opacity: 1
          }
        }
      },

      detectRetina: true
    }
  }).catch(function(err) {
    console.warn('[particles-config] error:', err);
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
      if (window.scrollY > 60) nav.classList.add('nav-scrolled');
      else nav.classList.remove('nav-scrolled');
      ticking = false;
    });
  }, { passive: true });
}());

/* ── Scroll reveal (IntersectionObserver) ───────────────────────────────── */
(function initScrollReveal() {
  if (typeof IntersectionObserver === 'undefined') return;
  var targets = document.querySelectorAll([
    '#first .features li',
    '#second .content',
    '#cta .major',
    '#footer section'
  ].join(', '));
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
