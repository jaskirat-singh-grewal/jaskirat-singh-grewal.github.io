/**
 * constellation-network.js — Pure vanilla particle constellation background
 * Zero dependencies. Dark-mode multi-colored node network with interactivity.
 * Colors: cyan #00FFFF, hot pink #FF1493, gold #FFD700
 */
(function() {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════
     Configuration — tweak these knobs to change the network behavior
     ═══════════════════════════════════════════════════════════════════════ */
  var CONFIG = {
    particleCount: 70,
    colors:         ['#00FFFF', '#FF1493', '#FFD700'],
    minSize:        1,
    maxSize:        4,
    speed:          1.2,
    linkDistance:   150,
    linkColor:      'rgba(255, 255, 255, 0.25)',
    linkWidth:      1.2,
    repulseDistance: 0,       // disabled — cursor attracts lines, not repulse
    repulseStrength: 0,
    cursorLinkDistance: 120,  // distance at which cursor connects to particles
    pushCount:      4,
    fps:            60
  };

  /* ═══════════════════════════════════════════════════════════════════════
     Particle class — one node in the constellation
     ═══════════════════════════════════════════════════════════════════════ */
  function Particle(canvas) {
    this.canvas = canvas;
    this.reset(true);
  }

  Particle.prototype.reset = function(randomPos) {
    if (randomPos) {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
    }
    this.vx = (Math.random() - 0.5) * CONFIG.speed * 2;
    this.vy = (Math.random() - 0.5) * CONFIG.speed * 2;
    this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
    this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    this.opacity = 0.3 + Math.random() * 0.5;
  };

  Particle.prototype.update = function(mouse) {
    /* ── Apply velocity ──────────────────────────────────────────────── */
    this.x += this.vx;
    this.y += this.vy;

    /* ── Velocity damping ────────────────────────────────────────────── */
    this.vx *= 0.995;
    this.vy *= 0.995;

    /* ── Toroidal wrap (Pac-Man edges) ───────────────────────────────── */
    if (this.x < -10) this.x = this.canvas.width + 10;
    if (this.x > this.canvas.width + 10) this.x = -10;
    if (this.y < -10) this.y = this.canvas.height + 10;
    if (this.y > this.canvas.height + 10) this.y = -10;
  };

  Particle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  /* ═══════════════════════════════════════════════════════════════════════
     Main constellation engine
     ═══════════════════════════════════════════════════════════════════════ */
  function Constellation() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: null, y: null, active: false };
    this.animationId = null;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / CONFIG.fps;
    this.init();
  }

  Constellation.prototype.init = function() {
    /* ── Create full-screen canvas ──────────────────────────────────── */
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'constellation-canvas';
    this.canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    document.body.insertBefore(this.canvas, document.body.firstChild);
    this.ctx = this.canvas.getContext('2d');

    /* ── Size canvas ────────────────────────────────────────────────── */
    this.resize();
    window.addEventListener('resize', this.resize.bind(this), { passive: true });

    /* ── Create particles ───────────────────────────────────────────── */
    for (var i = 0; i < CONFIG.particleCount; i++) {
      this.particles.push(new Particle(this.canvas));
    }

    /* ── Mouse tracking ─────────────────────────────────────────────── */
    var self = this;
    document.addEventListener('mousemove', function(e) {
      self.mouse.x = e.clientX;
      self.mouse.y = e.clientY;
      self.mouse.active = true;
    }, { passive: true });

    document.addEventListener('mouseleave', function() {
      self.mouse.active = false;
    });

    /* ── Click to push particles ────────────────────────────────────── */
    document.addEventListener('click', function(e) {
      var added = 0;
      for (var i = 0; i < CONFIG.pushCount; i++) {
        var p = new Particle(self.canvas);
        p.x = e.clientX;
        p.y = e.clientY;
        self.particles.push(p);
        added++;
      }
      /* Trim if too many */
      while (self.particles.length > CONFIG.particleCount * 2) {
        self.particles.shift();
      }
    });

    /* ── Start render loop ──────────────────────────────────────────── */
    this.animate();
  };

  Constellation.prototype.resize = function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  Constellation.prototype.animate = function(timestamp) {
    var self = this;
    this.animationId = requestAnimationFrame(function(ts) { self.animate(ts); });

    /* Frame rate cap */
    if (!timestamp) timestamp = performance.now();
    var elapsed = timestamp - this.lastFrameTime;
    if (elapsed < this.frameInterval) return;
    this.lastFrameTime = timestamp - (elapsed % this.frameInterval);

    /* ── Clear ──────────────────────────────────────────────────────── */
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /* ── Update + draw particles ────────────────────────────────────── */
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.mouse);
      this.particles[i].draw(this.ctx);
    }

    /* ── Draw links ─────────────────────────────────────────────────── */
    this.ctx.strokeStyle = CONFIG.linkColor;
    this.ctx.lineWidth = CONFIG.linkWidth;
    for (var a = 0; a < this.particles.length; a++) {
      for (var b = a + 1; b < this.particles.length; b++) {
        var pa = this.particles[a];
        var pb = this.particles[b];
        var dx = pa.x - pb.x;
        var dy = pa.y - pb.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.linkDistance) {
          this.ctx.globalAlpha = (1 - dist / CONFIG.linkDistance) * 0.25;
          this.ctx.beginPath();
          this.ctx.moveTo(pa.x, pa.y);
          this.ctx.lineTo(pb.x, pb.y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;

    /* ── Cursor tether ───────────────────────────────────────────────── */
    if (this.mouse.active) {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      this.ctx.lineWidth = 1.5;
      for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        var dx = p.x - this.mouse.x;
        var dy = p.y - this.mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.cursorLinkDistance) {
          this.ctx.globalAlpha = (1 - dist / CONFIG.cursorLinkDistance) * 0.45;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }
      this.ctx.globalAlpha = 1;
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════
     Boot
     ═══════════════════════════════════════════════════════════════════════ */
  new Constellation();
}());

/* ── Nav glass on scroll ────────────────────────────────────────────────── */
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

/* ── Scroll reveal ──────────────────────────────────────────────────────── */
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
