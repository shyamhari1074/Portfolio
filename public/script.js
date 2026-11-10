(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  /* ============================================================
     SCROLL PROGRESS BAR
     ============================================================ */
  function initScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progressPercent = (scrollTop / docHeight) * 100;
          progress.style.transform = `scaleX(${progressPercent / 100})`;
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ============================================================
     SCROLL REVEAL (IntersectionObserver)
     ============================================================ */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ============================================================
     COUNTER ANIMATIONS
     ============================================================ */
  function initCounters() {
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-count]').forEach(el => {
        el.textContent = el.dataset.count + (el.dataset.suffix || '+');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        const finalValue = Number(target.dataset.count);
        const suffix = target.dataset.suffix || '+';
        const duration = 1500;
        const startTime = performance.now();

        function animate(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * finalValue);
          target.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        observer.unobserve(target);
      });
    }, { threshold: 0.6 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
  }

  /* ============================================================
     MAGNETIC BUTTONS
     ============================================================ */
  function initMagneticButtons() {
    if (prefersReducedMotion || isMobile) return;

    const buttons = document.querySelectorAll('.btn-primary, .btn-ghost');

    buttons.forEach(btn => {
      let rafId = null;
      let currentX = 0;
      let currentY = 0;

      function animate() {
        btn.style.transform = `translate(${currentX}px, ${currentY}px)`;
        rafId = requestAnimationFrame(animate);
      }

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        currentX = x * 0.15;
        currentY = y * 0.15;
        if (!rafId) animate();
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        currentX = 0;
        currentY = 0;
        btn.style.transform = 'translate(0, 0)';
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      }, { passive: true });
    });
  }

  /* ============================================================
     MOUSE SPOTLIGHT / GLOW
     ============================================================ */
  function initMouseSpotlight() {
    if (prefersReducedMotion || isMobile) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'mouse-spotlight';
    spotlight.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spotlight);

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    function animate() {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      spotlight.style.transform = `translate(${currentX}px, ${currentY}px)`;
      rafId = requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) animate();
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    }, { passive: true });

    document.addEventListener('mouseenter', () => {
      spotlight.style.opacity = '1';
    }, { passive: true });
  }

  /* ============================================================
     PARALLAX BACKGROUNDS
     ============================================================ */
  function initParallax() {
    if (prefersReducedMotion) return;

    const layers = document.querySelectorAll('.hero, [data-parallax]');
    if (!layers.length) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.parallax) || 0.3;
            const offset = scrollY * speed;
            layer.style.transform = `translate3d(0, ${offset}px, 0)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ============================================================
     STARFIELD / PARTICLE BACKGROUND (HERO)
     ============================================================ */
  function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    let stars = [];
    let animationId = null;

    function resize() {
      const rect = hero.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: Math.min(120, Math.floor(rect.width / 8)) }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random(),
        speed: Math.random() * 0.4 + 0.1,
        drift: (Math.random() - 0.5) * 0.3,
        hue: Math.random() > 0.5 ? 260 : 180
      }));
    }

    function draw() {
      if (prefersReducedMotion) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${s.a * 0.5})`;
          ctx.fill();
        });
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${s.a * 0.6})`;
        ctx.fill();

        s.y -= s.speed;
        s.x += s.drift;
        s.a = 0.3 + Math.sin(performance.now() * 0.0008 + s.x * 0.01) * 0.3;

        if (s.y < -2) { s.y = height + 2; s.x = Math.random() * width; }
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }

  /* ============================================================
     TICKER PAUSE ON HOVER
     ============================================================ */
  function initTickerPause() {
    const ticker = document.getElementById('ticker');
    if (!ticker) return;

    const container = ticker.parentElement;
    container.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    container.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }

  /* ============================================================
     HOVER TILT CARDS (3D effect)
     ============================================================ */
  function initHoverTilt() {
    if (prefersReducedMotion || isMobile) return;

    const cards = document.querySelectorAll('.proj-card, .svc-card, .exp-row, .stat-cell, .contact-item');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      }, { passive: true });
    });
  }

  /* ============================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /* ============================================================
     ACTIVE NAV HIGHLIGHT (if nav exists)
     ============================================================ */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav a[href^="#"], .footer-social a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  /* ============================================================
     INITIALIZATION
     ============================================================ */
  function init() {
    initScrollProgress();
    initScrollReveal();
    initCounters();
    initMagneticButtons();
    initMouseSpotlight();
    initParallax();
    initStarfield();
    initTickerPause();
    initHoverTilt();
    initSmoothScroll();
    initActiveNav();

    document.body.classList.add('js-loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      document.querySelectorAll('[data-count]').forEach(el => {
        el.textContent = el.dataset.count + (el.dataset.suffix || '+');
      });
      const spotlight = document.querySelector('.mouse-spotlight');
      if (spotlight) spotlight.remove();
    }
  });
})();