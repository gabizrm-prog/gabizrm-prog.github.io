// ===== Typing effect =====
const roles = [
  'Automação com Python',
  'Dados & Painéis',
  'Desenvolvimento Front-end',
  'Estudante de Gestão de TI',
];
const typed = document.getElementById('typed');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  typed.textContent = roles[0];
} else {
  let r = 0, i = 0, deleting = false;
  (function tick() {
    const word = roles[r];
    typed.textContent = word.slice(0, i);
    if (!deleting && i === word.length) { deleting = true; return setTimeout(tick, 1800); }
    if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; }
    i += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 35 : 75);
  })();
}

// ===== Nav: scroll state, progress bar, active link =====
const nav = document.getElementById('nav');
const progress = document.querySelector('.progress');
const links = [...document.querySelectorAll('.nav__links a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

  let current = null;
  sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id; });
  links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Mobile menu =====
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
links.forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// ===== Reveal on scroll (with stagger inside grids) =====
document.querySelectorAll('.skills, .projects, .stats, .timeline').forEach(group => {
  [...group.querySelectorAll(':scope > .reveal')].forEach((el, idx) => el.style.setProperty('--d', idx * 0.08 + 's'));
});

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-visible');
    io.unobserve(e.target);
    e.target.querySelectorAll('[data-count]').forEach(countUp);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Counters =====
function countUp(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const start = performance.now(), dur = 1400;
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
    if (p < 1) requestAnimationFrame(step);
  })(start);
}

// ===== Project filters =====
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.toggle('is-active', b === btn));
  const f = btn.dataset.filter;
  projects.forEach(p => p.classList.toggle('is-hidden', f !== 'all' && p.dataset.cat !== f));
}));

// ===== Cursor glow + card spotlight =====
const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
}, { passive: true });
document.querySelectorAll('.skill').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', e.clientX - r.left + 'px');
    card.style.setProperty('--my', e.clientY - r.top + 'px');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
