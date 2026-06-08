'use strict';

/* Disable browser scroll restoration — always start from top on load */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, behavior: 'instant' });

/* ── Projects data ── */
const PROJECTS = [
  {
    title:      "Tan Para Vos",
    desc:       "E-commerce de mates y macetas artesanales pintadas a mano. Catálogo interactivo con filtros, favoritos y canvas de personalización.",
    tags:       ["HTML", "CSS", "JavaScript"],
    img:        "img-tanparavos.png",
    url:        "#contacto",
    urlDisplay: "tanparavos",
    area:       "1 / 1 / 2 / 3"
  },
  {
    title:      "Club Casacas",
    desc:       "Tienda online de camisetas de fútbol vintage con colección filtrable y carrito interactivo.",
    tags:       ["HTML", "CSS", "JavaScript"],
    img:        "img-casacas.png",
    url:        "#contacto",
    urlDisplay: "clubcasacas",
    area:       "2 / 1 / 3 / 2"
  },
  {
    title:      "SoLu",
    desc:       "Sitio web para pastas artesanales sin TACC. Catálogo de productos, sección de pedidos y diseño cálido artesanal.",
    tags:       ["HTML", "CSS", "JavaScript"],
    img:        "img-solu.png",
    url:        "#contacto",
    urlDisplay: "solu",
    area:       "2 / 2 / 3 / 3"
  },
  {
    title:      "Malek Jewelry",
    desc:       "Landing page editorial para marca de accesorios. Diseño dark con tipografía dorada, slider de productos animado con GSAP y sección de promociones.",
    tags:       ["HTML", "CSS", "JavaScript", "GSAP"],
    img:        "img-malek.png",
    url:        "#contacto",
    urlDisplay: "malekjewelry",
    area:       "3 / 1 / 4 / 3"
  }
];

/* ── Mouse spotlight ── */
document.addEventListener('mousemove', e => {
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
});

/* ── Interactive particle canvas ── */
function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COUNT        = 85;
  const CONNECT_DIST = 130;
  const MOUSE_RADIUS = 160;
  const MOUSE_FORCE  = 0.9;

  let W, H;
  const mouse = { x: -9999, y: -9999 };

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.4 + 0.4;
      // Alternate between mint and pink with low probability of pink
      this.isPink = Math.random() < 0.12;
      this.baseAlpha = Math.random() * 0.35 + 0.1;
      this.alpha = this.baseAlpha;
    }

    update() {
      const dx   = this.x - mouse.x;
      const dy   = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_FORCE;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
        // Brighten near mouse
        this.alpha = Math.min(this.baseAlpha * 3, 0.9);
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.04;
      }

      this.vx *= 0.965;
      this.vy *= 0.965;
      this.x  += this.vx;
      this.y  += this.vy;

      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      const color = this.isPink
        ? `rgba(255,71,133,${this.alpha})`
        : `rgba(79,255,176,${this.alpha})`;
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  let particles;

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= CONNECT_DIST) continue;

        const t = 1 - dist / CONNECT_DIST;
        // Check if either particle is near mouse for glow
        const nearMouse =
          Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y) < MOUSE_RADIUS ||
          Math.hypot(particles[j].x - mouse.x, particles[j].y - mouse.y) < MOUSE_RADIUS;

        const alpha = nearMouse ? t * 0.45 : t * 0.14;

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,255,176,${alpha})`;
        ctx.lineWidth   = nearMouse ? 1 : 0.6;
        ctx.stroke();
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  loop();
}

/* ── Live Buenos Aires time (next to nav badge) ── */
function initBuenosAiresTime() {
  const el = document.getElementById('navLocation');
  if (!el) return;

  function update() {
    const time = new Date().toLocaleTimeString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    el.textContent = `Buenos Aires · ${time}`;
  }

  update();
  setInterval(update, 30000);
}

/* ── Scramble decode reveal ── */
function scrambleReveal(el, finalText, staggerMs = 85) {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const isPunct = c => !/[A-Z]/i.test(c);

  el.textContent = '';
  const spans = finalText.split('').map(ch => {
    const s = document.createElement('span');
    s.style.cssText = 'display:inline-block';
    s.textContent = isPunct(ch) ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
    el.appendChild(s);
    return s;
  });

  let resolved = 0;
  const tick = setInterval(() => {
    finalText.split('').forEach((ch, i) => {
      if (i < resolved || isPunct(ch)) return;
      spans[i].textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
    });
  }, 42);

  return new Promise(resolve => {
    let done = 0;
    finalText.split('').forEach((ch, i) => {
      setTimeout(() => {
        spans[i].textContent = ch;
        resolved = Math.max(resolved, i + 1);
        if (++done === finalText.length) {
          clearInterval(tick);
          resolve();
        }
      }, i * staggerMs + 120);
    });
  });
}

async function initHero() {
  const l1 = document.getElementById('hn1');
  const l2 = document.getElementById('hn2');
  if (!l1 || !l2) return;

  l1.textContent = '';
  l2.textContent = '';

  await Promise.all([
    scrambleReveal(l1, 'BAUTISTA', 88),
    scrambleReveal(l2, 'KAHR.',    105)
  ]);
}

/* ── Count-up animation ── */
function countUp(el, target) {
  const start = performance.now();
  const dur   = 1400;
  function step(now) {
    const p     = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* ── Magnetic button effect ── */
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const x  = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y  = (e.clientY - r.top  - r.height / 2) * 0.28;
      el.style.transition = 'none';
      el.style.transform  = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1)';
      el.style.transform  = '';
    });
  });
}

/* ── 3D tilt + polish shine + image parallax ── */
function initTilt() {
  document.querySelectorAll('.tilt').forEach(card => {
    const shine = card.querySelector('.pcard-shine');
    const img   = card.querySelector('.pcard-img img');

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.35s, border-color 0.35s';
      if (img) img.style.transition = 'transform 0.65s var(--ease-expo), filter 0.5s';
    });

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5; // -0.5 → 0.5
      const y  = (e.clientY - r.top)  / r.height - 0.5;

      // 3D tilt
      card.style.transform = `perspective(1100px) rotateX(${y * -7}deg) rotateY(${x * 7}deg) translateZ(8px)`;

      // Shine: position as % within card
      if (shine) {
        shine.style.setProperty('--sx', ((x + 0.5) * 100).toFixed(1) + '%');
        shine.style.setProperty('--sy', ((y + 0.5) * 100).toFixed(1) + '%');
      }

      // Image parallax: moves opposite to cursor (peek-through-window)
      if (img) {
        const ox = (50 - x * 12).toFixed(2);
        const oy = (50 - y * 12).toFixed(2);
        img.style.objectPosition = `${ox}% ${oy}%`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s, border-color 0.35s';
      card.style.transform  = '';

      // Spring image back to center
      if (img) {
        img.style.transition = 'transform 0.65s var(--ease-expo), filter 0.5s, object-position 0.7s var(--ease-expo)';
        img.style.objectPosition = '50% 50%';
        setTimeout(() => { if (img) img.style.transition = ''; }, 700);
      }

      setTimeout(() => { card.style.transition = 'box-shadow 0.35s, border-color 0.35s'; }, 600);
    });
  });
}

/* ── Avatar split effect ── */
function initLogoSplit() {
  const wrap = document.getElementById('avatarSplit');
  if (!wrap) return;

  const bk   = wrap.querySelector('.ls-bk');
  const wd   = wrap.querySelector('.ls-wd');
  const line = wrap.querySelector('.ls-line');
  const SKEW = 0.14;
  let currentX = null;
  let animFrame = null;

  function update(x) {
    currentX = x;
    const W  = wrap.offsetWidth;
    const H  = wrap.offsetHeight;
    const sk = W * SKEW;
    bk.style.clipPath = `polygon(0 0, ${x + sk}px 0, ${x - sk}px ${H}px, 0 ${H}px)`;
    wd.style.clipPath = `polygon(${x + sk}px 0, ${W * 3}px 0, ${W * 3}px ${H}px, ${x - sk}px ${H}px)`;
    line.style.left   = x + 'px';
  }

  function cancelAnim() {
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  }

  function reset() {
    bk.style.clipPath  = '';
    wd.style.clipPath  = 'inset(0 0 0 100%)';
    line.style.left    = '100%';
    line.style.opacity = '';
    currentX = null;
  }

  function animateTo(targetX, fadeOut, onDone) {
    cancelAnim();
    const W         = wrap.offsetWidth;
    const startX    = currentX !== null ? currentX : W;
    const startTime = performance.now();
    const duration  = 460;
    if (fadeOut) line.style.opacity = '0.75';

    function tick(now) {
      const t     = Math.min((now - startTime) / duration, 1);
      const ease  = 1 - Math.pow(1 - t, 3);
      update(startX + (targetX - startX) * ease);
      if (fadeOut) line.style.opacity = String(0.75 * (1 - ease));
      if (t < 1) { animFrame = requestAnimationFrame(tick); }
      else        { animFrame = null; if (onDone) onDone(); }
    }
    animFrame = requestAnimationFrame(tick);
  }

  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (isTouch) {
    /* ── MOBILE: tap toggle ── */
    let toggled = false;

    wrap.addEventListener('touchend', e => {
      e.preventDefault();
      const W = wrap.offsetWidth;
      if (!toggled) {
        wrap.classList.add('revealed');
        animateTo(W * 0.12, false, () => { line.style.opacity = '0'; });
        toggled = true;
      } else {
        wrap.classList.remove('revealed');
        animateTo(W, true, reset);
        toggled = false;
      }
    }, { passive: false });

  } else {
    /* ── DESKTOP: mouse drag ── */
    wrap.addEventListener('mouseenter', () => {
      cancelAnim();
      line.style.opacity = '';
      wrap.classList.add('revealed');
    });
    wrap.addEventListener('mousemove', e => {
      cancelAnim();
      const r = wrap.getBoundingClientRect();
      update(e.clientX - r.left);
    });
    wrap.addEventListener('mouseleave', () => {
      wrap.classList.remove('revealed');
      if (currentX === null) return;
      animateTo(wrap.offsetWidth, true, reset);
    });
  }
}

/* ── Scroll reveal ── */
const srObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    srObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observeSR(root = document) {
  root.querySelectorAll('.sr').forEach(el => srObserver.observe(el));
}

/* ── Render projects ── */
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((p, i) => `
    <div class="pcard-wrap tilt sr" style="--d:${i + 2}; grid-area: ${p.area}">
      <article class="pcard">
        <div class="pcard-img">
          <img src="${p.img}" alt="${p.title}" loading="lazy">
        </div>
        <div class="pcard-browser" aria-hidden="true">
          <div class="pcard-dots">
            <span class="pd-dot pd-r"></span>
            <span class="pd-dot pd-y"></span>
            <span class="pd-dot pd-g"></span>
          </div>
          <div class="pcard-url">${p.urlDisplay}</div>
        </div>
        <div class="pcard-overlay">
          <div class="pcard-tags">
            ${p.tags.map(t => `<span class="ptag">${t}</span>`).join('')}
          </div>
          <h3 class="pcard-title">${p.title}</h3>
          <p class="pcard-desc">${p.desc}</p>
          <a href="${p.url}" class="pcard-link">Ver proyecto →</a>
        </div>
        <div class="pcard-shine"></div>
      </article>
    </div>
  `).join('');

  observeSR(grid);
  initTilt();
}

/* ── Nav scroll behavior ── */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile menu ── */
const mobileMenu = document.getElementById('mobileMenu');
const burger     = document.getElementById('navBurger');

function closeMobileMenu() {
  if (!mobileMenu || !burger) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (burger) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });
}

/* ── About count-up ── */
function initCountUp() {
  const section = document.querySelector('.about-section');
  if (!section) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      section.querySelectorAll('.astat-num').forEach(el => {
        countUp(el, parseInt(el.dataset.target, 10));
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  obs.observe(section);
}

/* ── Nav active section tracking ── */
function initNavActive() {
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = document.querySelectorAll('.nl');

  function setActive(id) {
    navLinks.forEach(nl => {
      nl.classList.toggle('active', nl.getAttribute('href') === '#' + id);
    });
  }

  // Use scroll position to find the section closest to top of viewport
  function onScroll() {
    let current = '';
    sections.forEach(s => {
      const top = s.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.45) current = s.id;
    });
    setActive(current);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Glitch effect on hero name ── */
function initGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  function trigger() {
    name.classList.add('glitching');
    setTimeout(() => name.classList.remove('glitching'), 130);
    setTimeout(trigger, 6000 + Math.random() * 5000);
  }

  setTimeout(trigger, 4500);
}

/* ── Scroll progress bar (JS fallback) ── */
function initScrollProgress() {
  if (CSS.supports('animation-timeline', 'scroll()')) return;
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${window.scrollY / total})`;
  }, { passive: true });
}

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initScrollProgress();
  initNav();
  initLogoSplit();
  initNavActive();
  initBuenosAiresTime();
  renderProjects();
  observeSR();
  initMagnetic();
  initCountUp();

  if (!reducedMotion) {
    initCanvas();
    initGlitch();
  }
});
