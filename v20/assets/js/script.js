const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveal
const revealItems = $$('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealItems.forEach((item) => revealObserver.observe(item));

// Cursor glow
const cursorGlow = $('.cursor-glow');
if (cursorGlow && !prefersReducedMotion) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.opacity = '1';
    cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });
}

// Magnetic buttons and logo
if (!prefersReducedMotion) {
  $$('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// Tilt cards
if (!prefersReducedMotion) {
  $$('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 9}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// Particle canvas for hero motion graphics
const canvas = $('#particleCanvas');
const ctx = canvas?.getContext('2d');
let particles = [];
let width = 0;
let height = 0;
let rafId = null;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.max(42, Math.floor(width / 24));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 2.2 + 0.8,
    alpha: Math.random() * 0.45 + 0.18
  }));
}

function drawParticles() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha})`;
    ctx.fill();

    for (let j = index + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - dist / 120) * 0.12})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  rafId = requestAnimationFrame(drawParticles);
}

if (canvas && ctx && !prefersReducedMotion) {
  resizeCanvas();
  drawParticles();
  window.addEventListener('resize', resizeCanvas);
} else if (canvas) {
  canvas.style.display = 'none';
}

// Hero video parallax
const heroVideo = $('.hero-video');
const heroVisual = $('.hero-visual');
if (!prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroVideo) heroVideo.style.transform = `scale(1.1) translateY(${y * 0.08}px)`;
    if (heroVisual) heroVisual.style.transform = `translateY(${y * -0.04}px)`;
  }, { passive: true });
}

window.addEventListener('beforeunload', () => {
  if (rafId) cancelAnimationFrame(rafId);
});
