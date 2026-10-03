/* Dodo Planet — tiny, dependency-free interactions */
(() => {
  // ---- Ordering links: change these two lines to update every button on the site
  const WHATSAPP_NUMBER = '2348032107954';
  const GLOVO_URL = 'https://glovoapp.com/ng/en/'; // TODO: replace with the Dodo Planet store link on Glovo

  const waLink = (text) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  document.querySelectorAll('[data-order]').forEach((a) => {
    a.href = a.dataset.order === 'glovo' ? GLOVO_URL : waLink('Hi Dodo Planet! I would like to place an order.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // ---- "Send us a message" form → opens WhatsApp with the typed message
  const form = document.getElementById('message-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = form.message.value.trim();
    if (!msg) return;
    window.open(waLink(msg), '_blank', 'noopener');
    form.reset();
  });

  // ---- Stories slider arrows
  const track = document.querySelector('.story-track');
  const [prev, next] = document.querySelectorAll('.story-nav .round-btn');
  if (track && prev && next) {
    const step = () => {
      const card = track.querySelector('.story');
      return card ? card.getBoundingClientRect().width + 24 : track.clientWidth;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Reveal on scroll (staggered per row of the menu)
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.querySelectorAll('.menu-grid .dish').forEach((el, i) => {
      el.style.setProperty('--d', `${(i % 3) * 0.08}s`);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  // ---- Hero plate turns gently as you scroll (GPU transform only)
  if (!reduceMotion) {
    const plates = document.querySelectorAll('.hero-plate, .hero-plate-m');
    let ticking = false;
    const spin = () => {
      const y = Math.min(window.scrollY, 1200);
      plates.forEach((p) => p.style.setProperty('--rot', `${-30 + y * 0.02}deg`));
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(spin); }
    }, { passive: true });
  }
})();
