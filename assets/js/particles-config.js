/**
 * particles-config.js — Interactive particle background
 * Colors chosen for high contrast against the pink-purple gradient.
 */
(function() {
  if (typeof tsParticles === 'undefined') return;

  tsParticles.load('tsparticles', {
    fullScreen: { enable: true, zIndex: 0 },
    background: { color: 'transparent' },
    fpsLimit: 60,

    particles: {
      number: { value: 60, density: { enable: true } },
      color: { value: ['#ffffff', '#e0e0e0', '#ffd700', '#f0e6ff', '#ffb6c1'] },
      shape: { type: ['circle', 'star'], options: { star: { sides: 4, inset: 2 } } },
      opacity: { value: { min: 0.4, max: 1 } },
      size: { value: { min: 2, max: 6 } },
      links: {
        enable: true,
        distance: 150,
        color: '#ffffff',
        opacity: 0.15,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: 'none',
        random: true,
        outModes: { default: 'out' }
      }
    },

    interactivity: {
      detectsOn: 'window',
      events: { onHover: { enable: true, mode: 'bubble' } },
      modes: {
        bubble: {
          distance: 150,
          size: 14,
          duration: 0.4,
          opacity: 1
        }
      }
    },

    detectRetina: true
  });
}());

/* ── Nav glass on scroll ──────────────────────────── */
(function() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      nav.classList.toggle('nav-scrolled', window.scrollY > 60);
      ticking = false;
    });
  }, { passive: true });
}());

/* ── Scroll reveal ────────────────────────────────── */
(function() {
  if (typeof IntersectionObserver === 'undefined') return;
  var targets = document.querySelectorAll('#first .features li, #second .content, #cta .major, #footer section');
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
  }, { threshold: 0.15 });
  targets.forEach(function(el) { observer.observe(el); });
}());
