document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Cursor glow (desktop only) ---------- */
  const glow = document.getElementById('cursorGlow');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (isFinePointer && glow) {
    window.addEventListener('mousemove', (e) => {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  /* ---------- Mobile nav toggle ---------- */
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
      burger.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  /* ---------- Scroll reveal via IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-reveal-delay') || 0;
        entry.target.style.setProperty('--delay', `${delay}ms`);
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated number counters ---------- */
  function formatNumber(value, format) {
    if (format === 'dot') {
      return Math.round(value).toLocaleString('pt-BR');
    }
    return Math.round(value).toString();
  }

  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const format = el.getAttribute('data-format');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (progress < 1) {
        const display = decimals > 0
          ? current.toFixed(decimals)
          : formatNumber(current, format);
        el.textContent = prefix + display + suffix;
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + formatNumber(target, format) + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  const statNumbers = document.querySelectorAll('.stat__number');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(el => countObserver.observe(el));

  /* ---------- Smooth anchor scroll (native handles most, fallback for older browsers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});