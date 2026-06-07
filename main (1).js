/**
 * TECHFEST 30.0 — MAIN.JS
 * Cursor · HUD · Scroll reveal · Counters · Tabs · Filter · Form
 */

(function () {
  'use strict';

  /* ════════════════════════════════════════
     CURSOR
  ════════════════════════════════════════ */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  (function moveCursor() {
    requestAnimationFrame(moveCursor);
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  })();

  document.querySelectorAll('a, button, input, select, textarea, .zevent, .zone-dot').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
  });

  /* ════════════════════════════════════════
     SCROLL PROGRESS BAR
  ════════════════════════════════════════ */
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    if (progressBar) progressBar.style.width = pct + '%';
  });

  /* ════════════════════════════════════════
     NAV SCROLL CLASS
  ════════════════════════════════════════ */
  const topnav = document.getElementById('topnav');
  window.addEventListener('scroll', () => {
    if (topnav) topnav.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ════════════════════════════════════════
     MOBILE NAV
  ════════════════════════════════════════ */
  const burger = document.getElementById('burger');
  const mnav   = document.getElementById('mnav');
  const mclose = document.getElementById('mnav-close');

  if (burger) burger.addEventListener('click', () => mnav.classList.toggle('open'));
  if (mclose) mclose.addEventListener('click', () => mnav.classList.remove('open'));

  window.closeMnav = () => { if (mnav) mnav.classList.remove('open'); };

  /* ════════════════════════════════════════
     HUD UPDATER
  ════════════════════════════════════════ */
  const hudZone   = document.getElementById('hud-zone');
  const hudCoords = document.getElementById('hud-coords');
  const hudPct    = document.getElementById('hud-scroll-pct');

  const zoneNames = [
    'ORBIT · ENTRY SEQUENCE',
    'AI PLANET · SECTOR 01',
    'ROBOTICS SPHERE · SECTOR 02',
    'SPACE HUB · SECTOR 03',
    'STARTUP CITY · SECTOR 04',
    'QUANTUM CORE · SECTOR 05',
  ];
  let lastZone = -1;

  function updateHUD() {
    const pct     = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
    const zoneIdx = typeof window._tfCurrentZone === 'function' ? window._tfCurrentZone() : 0;

    if (hudPct)    hudPct.textContent    = Math.round(pct * 100) + '%';
    if (hudCoords) hudCoords.textContent =
      (pct * 90 - 45).toFixed(4) + ' · ' + (pct * 180 - 90).toFixed(4);

    if (hudZone && zoneIdx !== lastZone) {
      lastZone = zoneIdx;
      hudZone.textContent = zoneNames[zoneIdx] || zoneNames[0];
    }
  }
  window.addEventListener('scroll', updateHUD);
  updateHUD();

  /* ════════════════════════════════════════
     ZONE NAV DOT CLICK → SMOOTH SCROLL
  ════════════════════════════════════════ */
  const zoneTargets = ['#home', '#ai-planet', '#robotics-sphere', '#space-hub', '#startup-city', '#quantum-core'];
  document.querySelectorAll('.zone-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const target = document.querySelector(zoneTargets[i]);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ════════════════════════════════════════
     SCROLL REVEAL  [data-ani]
  ════════════════════════════════════════ */
  const aniEls = document.querySelectorAll('[data-ani]');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-ani]'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('vis'), idx * 100);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  aniEls.forEach(el => revealObs.observe(el));

  /* ════════════════════════════════════════
     SCROLL REVEAL  [data-scroll-reveal]  (used in showcase section)
  ════════════════════════════════════════ */
  // Re-use same observer pattern for data-scroll-reveal if they exist in future
  document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .75s cubic-bezier(0.16,1,0.3,1), transform .75s cubic-bezier(0.16,1,0.3,1)';
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });

  /* ════════════════════════════════════════
     HERO TITLE STAGGER (runs on load)
  ════════════════════════════════════════ */
  (function heroAnimate() {
    const spans = document.querySelectorAll('.hero-title span');
    spans.forEach((span, i) => {
      span.style.opacity = '0';
      span.style.transform = 'translateY(60px) skewY(4deg)';
      span.style.display = 'block';
      span.style.transition = 'opacity .9s cubic-bezier(0.16,1,0.3,1), transform .9s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0) skewY(0)';
      }, 300 + i * 160);
    });

    const els = document.querySelectorAll('.hero-overtitle, .hero-sub, .hero-ctas, .hero-stats, .scroll-cue');
    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .7s cubic-bezier(0.16,1,0.3,1), transform .7s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 160);
    });
  })();

  /* ════════════════════════════════════════
     COUNTER ANIMATIONS
  ════════════════════════════════════════ */
  const counterEls = document.querySelectorAll('[data-count]');

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const target  = parseFloat(el.dataset.count);
      const pfx     = el.dataset.pfx  || '';
      const sfx     = el.dataset.sfx  || '';
      const dur     = 1800;
      const start   = performance.now();

      (function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        const val      = ease * target;
        el.textContent = pfx + (target < 10 ? val.toFixed(1) : Math.floor(val).toLocaleString()) + sfx;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = pfx + target + sfx;
      })(performance.now());

      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObs.observe(el));

  /* ════════════════════════════════════════
     3D TILT ON ZONE EVENTS
  ════════════════════════════════════════ */
  document.querySelectorAll('.zevent').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      card.style.transform = `perspective(400px) rotateX(${-dy * 5}deg) rotateY(${dx * 6}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });

  /* ════════════════════════════════════════
     SCHEDULE TABS
  ════════════════════════════════════════ */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.dataset.day;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.schedule__panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.querySelector(`[data-day-panel="${day}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  /* ════════════════════════════════════════
     EVENT FILTER BUTTONS
  ════════════════════════════════════════ */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.ecard').forEach(card => {
        const cat = card.dataset.category || '';
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.classList.remove('hidden');
        } else {
          card.style.display = 'none';
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ════════════════════════════════════════
     REGISTER FORM
  ════════════════════════════════════════ */
  const regForm    = document.getElementById('reg-form');
  const regSuccess = document.getElementById('reg-success');

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = regForm.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;
      btn.innerHTML = 'Processing...';
      btn.disabled  = true;

      setTimeout(() => {
        regForm.style.display = 'none';
        if (regSuccess) regSuccess.classList.add('show');
      }, 1400);
    });
  }

  /* ════════════════════════════════════════
     SMOOTH SCROLL FOR ALL #HASH LINKS
  ════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ════════════════════════════════════════
     PLANET VISUAL MOUSE INTERACTION (CSS planets)
  ════════════════════════════════════════ */
  document.querySelectorAll('.planet-ring-container').forEach(container => {
    container.addEventListener('mousemove', (e) => {
      const r  = container.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      container.style.transform = `rotateX(${dy * -12}deg) rotateY(${dx * 14}deg)`;
      container.style.transformStyle = 'preserve-3d';
    });
    container.addEventListener('mouseleave', () => {
      container.style.transform = '';
      container.style.transition = 'transform .6s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => container.style.transition = '', 600);
    });
  });

  /* ════════════════════════════════════════
     CONSOLE EASTER EGG
  ════════════════════════════════════════ */
  console.log(
    '%cTECHFEST 30.0',
    'color:#00f0ff;font-family:monospace;font-size:18px;font-weight:bold;letter-spacing:4px;'
  );
  console.log('%cIgnite The Future · IIT Bombay · Nov 14–16, 2025', 'color:#3a5270;font-family:monospace;font-size:11px;');

})();
