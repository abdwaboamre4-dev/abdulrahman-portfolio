/* =========================================================
   ABDULRAHMAN ABU AMER — PORTFOLIO SCRIPT
   Vanilla JS, no dependencies
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initParticleNetwork();
  initNavbar();
  initTypingAnimation();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initBackToTop();
  initContactForm();
  initFooterYear();
  initScrollProgress();
  initCursorGlow();
  initTiltCards();
  initMagneticButtons();
  initRippleButtons();
});

/* ---------- Loading Screen ---------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 500);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('is-hidden'), 3000);
}

/* ---------- Neural Network Particle Background ---------- */
function initParticleNetwork() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles, dpr;
  const CONFIG = {
    density: 14000,   // lower = more particles
    maxDistance: 130,
    speed: 0.25,
    color: '56, 189, 248',
    lineOpacity: 0.12,
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.width = window.innerWidth * dpr;
    height = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const count = Math.min(110, Math.floor((window.innerWidth * window.innerHeight) / CONFIG.density));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.speed * dpr,
      vy: (Math.random() - 0.5) * CONFIG.speed * dpr,
      r: (Math.random() * 1.4 + 0.6) * dpr,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color}, 0.75)`;
      ctx.fill();
    }

    const maxDist = CONFIG.maxDistance * dpr;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * CONFIG.lineOpacity;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${CONFIG.color}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!prefersReducedMotion) requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  step();
}

/* ---------- Navbar: scroll state, mobile toggle, active link ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 30);

    let current = sections[0]?.id;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) current = section.id;
    });
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Typing Animation ---------- */
function initTypingAnimation() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = ['Computer Science Student', 'AI Enthusiast', 'Digital Marketing Specialist'];
  const TYPE_SPEED = 65;
  const DELETE_SPEED = 35;
  const PAUSE = 1500;

  let phraseIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const phrase = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        return setTimeout(tick, PAUSE);
      }
      return setTimeout(tick, TYPE_SPEED);
    }

    charIndex--;
    el.textContent = phrase.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      return setTimeout(tick, 300);
    }
    setTimeout(tick, DELETE_SPEED);
  }

  tick();
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-reveal-delay');
        if (delay) entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach((item) => observer.observe(item));
}

/* ---------- Animated Counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach((c) => observer.observe(c));
}

/* ---------- Skill Progress Bars ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  bars.forEach((bar) => {
    const skill = bar.getAttribute('data-skill');
    const level = bar.getAttribute('data-level') || 0;

    bar.innerHTML = `
      <div class="skill-bar-head">
        <span>${skill}</span>
        <strong>${level}%</strong>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" style="width:0%"></div>
      </div>
    `;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-bar-fill');
        const level = entry.target.getAttribute('data-level');
        requestAnimationFrame(() => { fill.style.width = `${level}%`; });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach((bar) => observer.observe(bar));
}

/* ---------- Back To Top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 480);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !subject || !message) {
      note.textContent = 'Please fill in every field before sending.';
      note.style.color = '#f87171';
      return;
    }
    if (!emailPattern.test(email)) {
      note.textContent = 'Please enter a valid email address.';
      note.style.color = '#f87171';
      return;
    }

    // No backend attached — open the visitor's email client with a pre-filled message.
    const mailto = `mailto:abdwaboamre4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `${message}\n\n— ${name} (${email})`
    )}`;
    window.location.href = mailto;

    note.textContent = 'Opening your email client to send this message...';
    note.style.color = '#38bdf8';
    form.reset();
  });
}

/* ---------- Footer Year ---------- */
function initFooterYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- Scroll Progress Bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---------- Cursor Glow (desktop only) ---------- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  let active = false;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!active) { active = true; glow.classList.add('is-active'); }
  });
  window.addEventListener('mouseleave', () => glow.classList.remove('is-active'));

  function render() {
    curX += (targetX - curX) * 0.12;
    curY += (targetY - curY) * 0.12;
    glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  render();
}

/* ---------- 3D Tilt on Cards ---------- */
function initTiltCards() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach((card) => {
    const strength = card.hasAttribute('data-tilt-sm') ? 6 : 10;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- Magnetic Buttons ---------- */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('[data-magnetic]');
  if (!buttons.length) return;
  if (window.matchMedia('(hover: none)').matches) return;

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ---------- Ripple Effect on Buttons ---------- */
function initRippleButtons() {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'btn__ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
}
