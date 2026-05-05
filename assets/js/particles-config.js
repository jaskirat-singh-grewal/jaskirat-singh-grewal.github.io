/**
 * particles-config.js — Constellation Network Background
 * Dark-mode multi-colored node network visualizing AI data flow.
 * tsParticles v3 (loaded via CDN bundle in index.html)
 */
(function() {
  if (typeof tsParticles === 'undefined') return;

  tsParticles.load('tsparticles', {
    fullScreen: { enable: true, zIndex: 0 },
    background: { color: '#0a0a0a' },
    fpsLimit: 60,

    particles: {
      number: {
        value: 70,
        density: { enable: true }
      },
      color: {
        value: ['#00FFFF', '#FF1493', '#FFD700']
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: { min: 0.3, max: 0.8 }
      },
      size: {
        value: { min: 1, max: 4 }
      },
      links: {
        enable: true,
        distance: 150,
        color: '#ffffff',
        opacity: 0.25,
        width: 1.2
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' }
      }
    },

    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: { enable: true, mode: 'repulse' },
        onClick: { enable: true, mode: 'push' }
      },
      modes: {
        repulse: { distance: 120, duration: 0.4, speed: 1 },
        push:   { quantity: 4 }
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
