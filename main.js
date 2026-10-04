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

  // ---- Google Analytics: paste your Measurement ID (looks like 'G-XXXXXXXXXX') to switch it on.
  //      It only loads after the visitor taps "Okay" on the small cookie notice.
  const GA_ID = 'G-1064VXYMYD';
  const CONSENT_KEY = 'dp-analytics';
  const store = {
    get() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) { /* private mode */ } },
  };
  const loadGA = () => {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.append(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  };
  if (GA_ID) {
    const choice = store.get();
    if (choice === 'yes') loadGA();
    else if (choice !== 'no') {
      const box = document.createElement('div');
      box.className = 'consent';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-label', 'Cookie notice');
      box.innerHTML = '<p>We use Google Analytics cookies to see which pages people enjoy, so we can make the site better. <a href="/privacy.html">Learn more</a></p><div><button class="btn btn-primary" data-c="yes">Okay</button><button class="btn btn-soft" data-c="no">No thanks</button></div>';
      box.addEventListener('click', (e) => {
        const c = e.target.closest('[data-c]')?.dataset.c;
        if (!c) return;
        store.set(c);
        if (c === 'yes') loadGA();
        box.remove();
      });
      document.body.append(box);
    }
  }
  document.querySelectorAll('[data-reset-consent]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    try { localStorage.removeItem(CONSENT_KEY); } catch (err) { /* ignore */ }
    location.reload();
  }));

  // ---- Placeholder links (no page yet) shouldn't jump to the top of the page
  document.querySelectorAll('a[href="#"]:not([data-order])').forEach((a) => {
    a.setAttribute('aria-disabled', 'true');
    a.addEventListener('click', (e) => e.preventDefault());
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
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    };
    const nav = prev.parentElement;
    const max = () => track.scrollWidth - track.clientWidth - 2;
    const update = () => { nav.hidden = max() <= 0; }; // every story fits on screen: arrows aren't needed
    // Both arrows always look active (as in Figma): at either end they wrap around
    prev.addEventListener('click', () => {
      if (track.scrollLeft <= 2) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      else track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      if (track.scrollLeft >= max()) track.scrollTo({ left: 0, behavior: 'smooth' });
      else track.scrollBy({ left: step(), behavior: 'smooth' });
    });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  // ---- Menu page filter chips (All / New / Classics)
  const chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => { const on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on); });
    document.querySelectorAll('.menu-grid .dish').forEach((d) => { d.hidden = f !== 'all' && d.dataset.cat !== f; });
  }));

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
    const plates = document.querySelectorAll('.hero-plate, .plate-m');
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
