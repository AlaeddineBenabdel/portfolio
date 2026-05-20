/* ============================================
   PORTFOLIO — script.js
   Alaeddine Benabdelmoumene
   ============================================ */

// ─── DÉTECTION TOUCH ──────────────────────────
const isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;

// ─── CURSEUR CUSTOM (desktop uniquement) ──────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (!isTouchDevice()) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  function bindCursorHover() {
    document.querySelectorAll('button, a, .back-btn, .chip, .skill-tag').forEach(el => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = '1';

      el.addEventListener('mouseenter', () => {
        cursorFollower.style.width = '60px';
        cursorFollower.style.height = '60px';
        cursorFollower.style.borderColor = 'rgba(255,107,53,0.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursorFollower.style.width = '36px';
        cursorFollower.style.height = '36px';
        cursorFollower.style.borderColor = 'rgba(255,107,53,0.5)';
      });
    });
  }
} else {
  // Sur mobile, on cache les curseurs
  if (cursor) cursor.style.display = 'none';
  if (cursorFollower) cursorFollower.style.display = 'none';

  // Stub vide pour éviter les erreurs
  function bindCursorHover() {}
}

// ─── NAVIGATION ENTRE PAGES ───────────────────
const pages = document.querySelectorAll('.page');

function goTo(pageId) {
  pages.forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  const target = document.getElementById(pageId);
  if (!target) return;

  target.style.display = 'flex';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.add('active');
      if (!isTouchDevice()) bindCursorHover();
      initCardTilt();
    });
  });

  if (pageId === 'page-hero') {
    document.body.classList.remove('scroll-enabled');
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    document.body.classList.add('scroll-enabled');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

// ─── INITIALISATION ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  goTo('page-hero');
  initParticles();
  if (!isTouchDevice()) bindCursorHover();
});

// ─── PARTICULES LÉGÈRES EN FOND ───────────────
function initParticles() {
  const hero = document.getElementById('page-hero');
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.35;
  `;
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#ff6b35', '#ff3cac', '#2b86c5', '#784ba0'];
  // Moins de particules sur mobile pour économiser la batterie
  const count = isTouchDevice() ? 30 : 60;

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    };
  }

  const particles = Array.from({ length: count }, createParticle);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── EFFET TILT SUR LES CARTES (desktop only) ─
function initCardTilt() {
  if (isTouchDevice()) return;

  const cards = document.querySelectorAll('.project-card, .contact-card, .stat-card');
  cards.forEach(card => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = '1';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── ANIMATION DES CHIFFRES STATS ─────────────
function animateCount(el, target) {
  let start = 0;
  const duration = 1500;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const aboutPage = document.getElementById('page-about');
const aboutObserver = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    if (m.target.classList.contains('active')) {
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach(el => {
        const val = el.textContent.trim();
        if (val === '60') animateCount(el, 60);
      });
    }
  });
});
aboutObserver.observe(aboutPage, { attributes: true, attributeFilter: ['class'] });

// ─── NAVIGATION CLAVIER ───────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    goTo('page-hero');
  }
});
