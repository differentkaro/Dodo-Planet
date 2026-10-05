/* Dodo Dash: a tiny endless runner that lives under the footer.
   Plain JavaScript and one <canvas>, no libraries. main.js only downloads this
   file when a visitor scrolls close to the footer, so it never slows a page down.
   Jump with Space / ↑ / click / tap (hold for a bigger jump). */
(() => {
  'use strict';
  const footer = document.querySelector('.site-footer');
  if (!footer || document.querySelector('.dash')) return;

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BEST_KEY = 'dp-dash-best';
  const C = {
    yellow: '#FFC700', brown: '#4F2C00', olive: '#8A7A42', green: '#30A962', cream: '#FFFBEF',
    red: '#E5462F', redDark: '#B8301D', orange: '#FF8A1F', dodo: '#F2A219', dodoIn: '#FFCB45', dodoEdge: '#B9600F',
  };

  // ---------------------------------------------------------------- styles
  const css = `
.dash{background:rgba(255,199,0,.5);padding:0 var(--gutter) 40px}
.site-footer:has(+ .dash) .footer-inner{padding-bottom:32px}
.dash-card{padding:32px 40px;border-radius:16px;background:linear-gradient(rgba(255,255,255,.5),rgba(255,255,255,.5)),linear-gradient(180deg,#FFF4CE 0%,#FFE691 100%)}
.dash-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
.dash-titles{display:flex;flex-direction:column;gap:8px}
.dash h2{font-size:32px;font-weight:700;line-height:1.2}
.dash h2 span{color:var(--green)}
.dash-sub{font-size:16px;line-height:1.5;color:var(--olive);max-width:560px}
.dash-scores{display:flex;gap:12px;flex:none}
.dash-pill{display:flex;flex-direction:column;align-items:center;min-width:96px;padding:10px 18px;border-radius:16px;background:rgba(79,44,0,.05)}
.dash-pill span{font-size:12px;line-height:17px;letter-spacing:.48px;color:var(--olive)}
.dash-pill b{display:inline-block;font-size:24px;line-height:1.2;font-weight:700;font-variant-numeric:tabular-nums}
.dash-stage{position:relative;margin-top:24px;height:clamp(200px,17vw,250px);border:2px solid rgba(79,44,0,.1);border-radius:16px;background:linear-gradient(180deg,#FFFDF6 0%,var(--cream) 100%);overflow:hidden;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
.dash-stage.is-playing{cursor:default;touch-action:none}
.dash-stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.dash-ui{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px;text-align:center;background:rgba(255,251,239,.74);transition:opacity .25s var(--ease)}
.dash-ui.is-cool .btn{pointer-events:none}
.dash-ui.is-off{opacity:0;visibility:hidden;pointer-events:none;transition:opacity .2s,visibility 0s .2s}
.dash-msg{font-size:22px;font-weight:700;line-height:1.2}
.dash-note{font-size:14px;line-height:1.4;color:var(--olive)}
.dash-note b{color:var(--brown);font-size:18px}
.dash-new{display:inline-block;margin-left:6px;padding:2px 10px;border-radius:1000px;background:var(--green);color:#fff;font-size:12px;font-weight:600;vertical-align:2px}
.dash-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.dash-actions .btn{padding:14px 26px;border-radius:18px;font-size:14px}
.dash-hint{margin-top:12px;font-size:12px;line-height:17px;color:var(--olive)}
.dash-k{display:inline-block;min-width:22px;padding:0 6px;border-radius:6px;background:rgba(79,44,0,.07);color:var(--brown);font-weight:600;text-align:center}
.dash-touch{display:none}
@media (pointer:coarse){.dash-touch{display:inline}.dash-keys{display:none}}
@media (max-width:767px){
.dash-card{padding:24px}
.dash-head{flex-direction:column;align-items:stretch;gap:16px}
.dash h2{font-size:24px;line-height:29px}
.dash-sub{font-size:14px}
.dash-pill{flex:1;flex-direction:row;justify-content:space-between;align-items:baseline;padding:10px 16px}
.dash-pill b{font-size:20px}
.dash-stage{margin-top:16px;height:auto;aspect-ratio:520/270}
.dash-ui{gap:8px;padding:8px}
.dash-msg{font-size:17px}
.dash-note{font-size:13px}.dash-note b{font-size:15px}
.dash-actions .btn{padding:11px 18px;border-radius:14px;font-size:13px}
}`;
  document.head.insertAdjacentHTML('beforeend', `<style id="dash-css">${css}</style>`);

  // ---------------------------------------------------------------- markup
  const orderLink = document.querySelector('a[data-order="whatsapp"]');
  const section = document.createElement('section');
  section.className = 'dash';
  section.setAttribute('aria-labelledby', 'dash-title');
  section.innerHTML = `
  <div class="dash-card">
    <div class="dash-head">
      <div class="dash-titles">
        <p class="fc-label">Mini game</p>
        <h2 id="dash-title">Dodo <span>Dash</span></h2>
        <p class="dash-sub">Help our rider grab the dodo on the way to you. Jump the peppers, cones and potholes.</p>
      </div>
      <div class="dash-scores">
        <div class="dash-pill"><span>Score</span><b data-score>0</b></div>
        <div class="dash-pill"><span>Best</span><b data-best>0</b></div>
      </div>
    </div>
    <div class="dash-stage" tabindex="0" aria-label="Dodo Dash game" aria-describedby="dash-hint">
      <canvas aria-hidden="true"></canvas>
      <div class="dash-ui" data-ui></div>
    </div>
    <p class="dash-hint" id="dash-hint">
      <span class="dash-keys"><span class="dash-k">Space</span> or <span class="dash-k">↑</span> to jump, hold for a bigger jump. <span class="dash-k">P</span> pauses.</span>
      <span class="dash-touch">Tap to jump, hold for a bigger jump.</span>
    </p>
    <p class="sr-only" aria-live="polite" data-live></p>
  </div>`;
  footer.after(section);

  const stage = section.querySelector('.dash-stage');
  const canvas = stage.querySelector('canvas');
  const ui = section.querySelector('[data-ui]');
  const scoreEl = section.querySelector('[data-score]');
  const bestEl = section.querySelector('[data-best]');
  const live = section.querySelector('[data-live]');
  const ctx = canvas.getContext('2d');

  const store = {
    get() { try { return +localStorage.getItem(BEST_KEY) || 0; } catch (e) { return 0; } },
    set(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* private mode */ } },
  };
  let best = store.get();
  bestEl.textContent = best;

  // ---------------------------------------------------------------- world
  // Everything is measured in "world units". The view is always at least
  // MIN_W units wide and 200 tall, so phones see enough road ahead.
  const MIN_W = 520, MIN_H = 200, RX = 72;
  const JUMP_V = 640, G_UP = 2150, G_CUT = 5200, G_DOWN = 2600;
  let W = MIN_W, HV = MIN_H, GROUND = MIN_H - 30, s = 1, dpr = 1;
  let speed0 = 340, speed = 340;

  let state = 'idle';            // idle | play | paused | crash | over
  let raf = 0, last = 0, t = 0, scroll = 0, score = 0, nextGap = 0, goldAt = 0, crashT = 0, hitBy = '';
  let obstacles = [], pickups = [], parts = [], floats = [];
  const rider = { h: 0, vy: 0, hold: false, air: false, tilt: 0, wheel: 0, puff: 0 };
  let buffer = 0, visible = false, started = false, overAt = 0;
  const cooling = () => state === 'over' && performance.now() - overAt < 700;

  const lerp = (a, b, k) => a + (b - a) * k;
  const rand = (a, b) => a + Math.random() * (b - a);

  function reset() {
    t = 0; scroll = 0; score = 0; crashT = 0; hitBy = '';
    obstacles = []; pickups = []; parts = []; floats = [];
    Object.assign(rider, { h: 0, vy: 0, hold: false, air: false, tilt: 0, puff: 0 });
    buffer = 0;
    speed = speed0;
    nextGap = speed * 1.2;
    goldAt = rand(12, 20);
    scoreEl.textContent = '0';
  }

  // ---------------------------------------------------------------- sizing
  const bg = document.createElement('canvas');
  const bgc = bg.getContext('2d');
  const BG_TEXT = 'For Dodo Lovers  ';
  let bgW = 600;

  function buildBackdrop() {
    const k = s * dpr;
    bgc.font = '700 64px Outfit, system-ui, sans-serif';
    bgW = Math.ceil(bgc.measureText(BG_TEXT).width);
    bg.width = Math.ceil(bgW * k);
    bg.height = Math.ceil(84 * k);
    bgc.setTransform(k, 0, 0, k, 0, 0);
    bgc.font = '700 64px Outfit, system-ui, sans-serif';
    bgc.textBaseline = 'middle';
    bgc.lineJoin = 'round';
    bgc.lineWidth = 1.6;
    bgc.strokeStyle = C.yellow;
    bgc.strokeText(BG_TEXT, 0, 42);
  }

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    s = Math.min(h / MIN_H, w / MIN_W);
    W = w / s; HV = h / s; GROUND = HV - 30;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    speed0 = 340 + Math.max(0, Math.min(90, (W - MIN_W) * 0.15));
    buildBackdrop();
    if (state !== 'play' && state !== 'crash') draw();
  }

  // ---------------------------------------------------------------- spawning
  const SPECS = { pepper: [24, 24], pepper2: [48, 24], cone: [26, 40], hole: [50, 0], hole2: [66, 0], combo: [60, 40] };

  function spawn() {
    const k = Math.min(1, (speed - speed0) / 380);
    const pool = ['pepper', 'cone', 'hole', 'pepper'];
    if (k > 0.2) pool.push('pepper2', 'hole2');
    if (k > 0.5) pool.push('combo', 'cone');
    const type = pool[(Math.random() * pool.length) | 0];
    const [w, h] = SPECS[type];
    const x = W + 30;
    obstacles.push({ type, x, w, h });

    // dodo over the obstacle, as a reward for jumping it
    const cx = x + w / 2;
    if (t > goldAt) {
      pickups.push({ x: cx, y: 132, gold: true, ph: Math.random() * 6 });
      goldAt = t + rand(14, 24);
    } else if (Math.random() < 0.6) {
      [[-34, 56], [0, 78], [34, 56]].forEach(([ox, oy]) => pickups.push({ x: cx + ox, y: oy, ph: Math.random() * 6 }));
    }

    const gapT = lerp(1.05, 0.66, k) + Math.random() * lerp(1.0, 0.55, k);
    nextGap = speed * gapT + w;

    // a row of dodo on the road in long gaps: free points for staying on the ground
    if (gapT > 1.25 && Math.random() < 0.6) {
      const start = x + w + speed * 0.55, n = 3 + ((Math.random() * 2) | 0);
      for (let i = 0; i < n; i++) pickups.push({ x: start + i * 26, y: 24, ph: i });
    }
  }

  // ---------------------------------------------------------------- physics
  function jump() {
    rider.air = true; rider.vy = JUMP_V; buffer = 0;
    if (!calm) for (let i = 0; i < 4; i++) parts.push({ x: RX - 16 + rand(-4, 8), y: 2, vx: rand(-90, -30), vy: rand(20, 70), life: 0.4, max: 0.4, r: rand(2, 4), c: 'rgba(79,44,0,.18)' });
  }
  function press() { rider.hold = true; if (!rider.air) jump(); else buffer = 0.12; }
  function release() { rider.hold = false; }

  function crash(type) {
    state = 'crash'; crashT = 0; hitBy = type;
    if (!calm) for (let i = 0; i < 10; i++) parts.push({ x: RX + 10, y: rand(10, 40), vx: rand(-160, 120), vy: rand(60, 260), life: 0.7, max: 0.7, r: rand(2, 4), c: i % 2 ? C.yellow : C.brown });
  }

  function collect(p) {
    p.dead = true;
    const pts = p.gold ? 5 : 1;
    score += pts;
    scoreEl.textContent = score;
    if (!calm && scoreEl.animate) scoreEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)', color: C.green }, { transform: 'scale(1)' }], { duration: 320, easing: 'ease-out' });
    floats.push({ x: p.x, y: p.y + 12, txt: `+${pts}`, life: 0.8, gold: !!p.gold });
    if (!calm) for (let i = 0; i < (p.gold ? 12 : 6); i++) {
      const a = (i / (p.gold ? 12 : 6)) * Math.PI * 2;
      parts.push({ x: p.x, y: p.y, vx: Math.cos(a) * 120, vy: Math.sin(a) * 120, life: 0.45, max: 0.45, r: 2.2, c: i % 2 ? C.yellow : C.green, g: 0 });
    }
  }

  function step(dt) {
    t += dt;
    if (state === 'crash') {
      crashT += dt;
      speed = Math.max(0, speed - speed * 6 * dt);
    } else {
      speed = Math.min(speed0 + 380, speed0 + 8 * t);
    }
    const dx = speed * dt;
    scroll += dx;

    // rider
    if (buffer > 0) { buffer -= dt; if (!rider.air && state === 'play') jump(); }
    if (rider.air) {
      const g = rider.vy > 0 ? (rider.hold ? G_UP : G_CUT) : G_DOWN;
      rider.vy -= g * dt;
      rider.h += rider.vy * dt;
      if (rider.h <= 0) {
        rider.h = 0; rider.vy = 0; rider.air = false;
        if (!calm) for (let i = 0; i < 3; i++) parts.push({ x: RX + rand(-20, 20), y: 1, vx: rand(-60, 60), vy: rand(20, 50), life: 0.35, max: 0.35, r: rand(2, 3.5), c: 'rgba(79,44,0,.16)' });
      }
    }
    const tiltTo = state === 'crash' ? 0 : rider.air ? (rider.vy > 0 ? -0.14 : 0.1) : 0;
    rider.tilt += (tiltTo - rider.tilt) * Math.min(1, dt * 12);
    rider.wheel += dx / 8;

    // exhaust puffs
    if (state === 'play' && !rider.air && !calm) {
      rider.puff -= dt;
      if (rider.puff <= 0) {
        rider.puff = 0.09;
        parts.push({ x: RX - 36, y: 12, vx: rand(-70, -40), vy: rand(10, 30), life: 0.5, max: 0.5, r: rand(2.5, 4), c: 'rgba(79,44,0,.12)', g: 0 });
      }
    }

    // world
    obstacles.forEach((o) => { o.x -= dx; });
    pickups.forEach((p) => { p.x -= dx; });
    obstacles = obstacles.filter((o) => o.x + o.w > -60);
    pickups = pickups.filter((p) => !p.dead && p.x > -40);
    if (state === 'play') {
      nextGap -= dx;
      if (nextGap <= 0) spawn();
    }

    // collisions (boxes are a little smaller than the drawings, to feel fair)
    if (state === 'play') {
      const left = RX - 22, right = RX + 18, bottom = rider.h;
      for (const o of obstacles) {
        if (o.type === 'hole' || o.type === 'hole2') {
          if (rider.h < 1) {
            const a = o.x + 9, b = o.x + o.w - 9;
            const rear = RX - 17, front = RX + 19;
            if ((rear > a && rear < b) || (front > a && front < b)) { crash(o.type); break; }
          }
        } else if (right > o.x + 4 && left < o.x + o.w - 4 && bottom < o.h - 4) { crash(o.type); break; }
      }
      for (const p of pickups) {
        if (!p.dead && p.x > RX - 32 && p.x < RX + 30 && p.y > rider.h - 6 && p.y < rider.h + 72) collect(p);
      }
    }

    // particles & floating points
    parts.forEach((p) => {
      p.life -= dt; p.x += (p.vx - speed * 0.25) * dt; p.y += p.vy * dt;
      p.vy -= (p.g ?? 500) * dt;
    });
    parts = parts.filter((p) => p.life > 0);
    floats.forEach((f) => { f.life -= dt; f.y += 40 * dt; f.x -= dx * 0.3; });
    floats = floats.filter((f) => f.life > 0);
  }

  // ---------------------------------------------------------------- drawing
  // y in the world is measured upwards from the road: Y(h) turns it into canvas y
  const Y = (h) => GROUND - h;

  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
  }

  function drawBackdrop() {
    const rows = [{ y: GROUND - 118, sp: 0.12, a: 0.3 }, { y: GROUND - 46, sp: 0.28, a: 0.5 }];
    rows.forEach((r, i) => {
      ctx.save();
      ctx.globalAlpha = r.a;
      ctx.translate(W / 2, r.y);
      ctx.rotate(-0.087);
      const off = calm ? 0 : -((scroll * r.sp + i * 140) % bgW);
      const span = W / 2 + 120;
      for (let x = -span - bgW + off; x < span; x += bgW) ctx.drawImage(bg, x, -42, bgW, 84);
      ctx.restore();
    });
  }

  function drawRoad() {
    ctx.fillStyle = 'rgba(79,44,0,.06)';
    ctx.fillRect(0, GROUND, W, HV - GROUND);
    ctx.fillStyle = C.brown;
    ctx.fillRect(0, GROUND - 1, W, 2.5);
    // lane dashes
    ctx.fillStyle = 'rgba(255,199,0,.9)';
    const off = scroll % 52;
    for (let x = -off; x < W; x += 52) { rrect(x, GROUND + 13, 24, 3.5, 2); ctx.fill(); }
  }

  function drawPepper(cx, base, phase) {
    ctx.save();
    ctx.translate(cx, Y(0) - 11);
    // heat lines
    if (!calm) {
      ctx.strokeStyle = 'rgba(229,70,47,.35)'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
      for (let i = -1; i <= 1; i += 2) {
        ctx.beginPath();
        const yy = -22 - ((t * 18 + phase) % 6);
        ctx.moveTo(i * 5, yy); ctx.quadraticCurveTo(i * 5 + 3, yy - 3, i * 5, yy - 6); ctx.quadraticCurveTo(i * 5 - 3, yy - 9, i * 5, yy - 12);
        ctx.stroke();
      }
    }
    // body: a wrinkly scotch bonnet (ata rodo)
    ctx.fillStyle = C.red;
    ctx.beginPath();
    ctx.moveTo(-11, -2);
    ctx.bezierCurveTo(-13, -12, -6, -14, 0, -11);
    ctx.bezierCurveTo(6, -14, 13, -12, 11, -2);
    ctx.bezierCurveTo(10, 9, 3, 11, 0, 9);
    ctx.bezierCurveTo(-3, 11, -10, 9, -11, -2);
    ctx.fill();
    ctx.fillStyle = C.redDark; ctx.globalAlpha = 0.35;
    ctx.beginPath(); ctx.ellipse(1, 5, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.55; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(-5, -6, 3, 1.8, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    // stem
    ctx.fillStyle = C.green;
    ctx.beginPath(); ctx.ellipse(0, -11, 6, 2.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.green; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(1, -18, 5, -19); ctx.stroke();
    ctx.restore();
  }

  function drawCone(x) {
    const b = Y(0);
    ctx.fillStyle = C.brown;
    rrect(x - 2, b - 5, 30, 5, 2); ctx.fill();
    ctx.fillStyle = C.orange;
    ctx.beginPath();
    ctx.moveTo(x + 2, b - 5); ctx.lineTo(x + 10, b - 40); ctx.quadraticCurveTo(x + 13, b - 43, x + 16, b - 40); ctx.lineTo(x + 24, b - 5); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFF4CE';
    ctx.beginPath();
    ctx.moveTo(x + 6.5, b - 20); ctx.lineTo(x + 8.6, b - 29); ctx.lineTo(x + 17.4, b - 29); ctx.lineTo(x + 19.5, b - 20); ctx.closePath();
    ctx.fill();
  }

  function drawHole(o) {
    const b = Y(0), cx = o.x + o.w / 2;
    ctx.fillStyle = C.cream;
    ctx.fillRect(o.x + 3, b - 1.5, o.w - 6, 4);
    ctx.fillStyle = 'rgba(79,44,0,.78)';
    ctx.beginPath(); ctx.ellipse(cx, b + 4, o.w / 2, 6.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(79,44,0,.95)';
    ctx.beginPath(); ctx.ellipse(cx + 2, b + 5.5, o.w / 2 - 7, 3.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(79,44,0,.55)'; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(o.x + 2, b + 3); ctx.lineTo(o.x - 6, b + 7); ctx.lineTo(o.x - 10, b + 6);
    ctx.moveTo(o.x + o.w - 2, b + 4); ctx.lineTo(o.x + o.w + 7, b + 9);
    ctx.stroke();
  }

  function drawObstacle(o, i) {
    if (o.type === 'pepper') drawPepper(o.x + 12, 0, i);
    else if (o.type === 'pepper2') { drawPepper(o.x + 12, 0, i); drawPepper(o.x + 36, 0, i + 3); }
    else if (o.type === 'cone') drawCone(o.x);
    else if (o.type === 'combo') { drawCone(o.x); drawPepper(o.x + 46, 0, i); }
    else drawHole(o);
  }

  function drawDodo(p) {
    const bob = calm ? 0 : Math.sin(t * 5 + p.ph) * 2;
    ctx.save();
    ctx.translate(p.x, Y(p.y) + bob);
    if (p.gold) {
      // a whole ripe plantain, worth 5
      const glow = 15 + (calm ? 0 : Math.sin(t * 6 + p.ph) * 2);
      ctx.fillStyle = 'rgba(255,199,0,.28)';
      ctx.beginPath(); ctx.arc(0, 0, glow, 0, Math.PI * 2); ctx.fill();
      ctx.rotate(-0.25);
      ctx.fillStyle = '#FFD43B'; ctx.strokeStyle = C.brown; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-15, -3); ctx.quadraticCurveTo(0, 15, 15, -5); ctx.quadraticCurveTo(0, 5, -15, -3);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.brown;
      ctx.beginPath(); ctx.arc(-15, -3, 2, 0, Math.PI * 2); ctx.arc(15, -5, 2, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.5;
      [[-6, 4], [2, 5], [8, 1]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 1.1, 0, Math.PI * 2); ctx.fill(); });
    } else {
      // a slice of fried dodo
      ctx.rotate(-0.5 + (calm ? 0 : Math.sin(t * 3 + p.ph) * 0.15));
      ctx.fillStyle = C.dodo; ctx.strokeStyle = C.dodoEdge; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.dodoIn;
      ctx.beginPath(); ctx.ellipse(-1, -1, 6.5, 3.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.dodoEdge; ctx.globalAlpha = 0.6;
      [[3, 1.5], [-3, 2], [5, -2]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2); ctx.fill(); });
    }
    ctx.restore();
  }

  function wheel(x, y, a) {
    ctx.fillStyle = C.brown;
    ctx.beginPath(); ctx.arc(x, y, 8.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,251,239,.75)'; ctx.lineWidth = 1.3; ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const k = a + (i * Math.PI * 2) / 3;
      ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(k) * 5.6, y + Math.sin(k) * 5.6);
    }
    ctx.stroke();
    ctx.fillStyle = C.yellow;
    ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
  }

  // The rider: our delivery scooter with a Dodo Planet box. Origin = road, centre of the bike.
  function drawRider() {
    const crashing = state === 'crash' || state === 'over';
    const k = Math.min(1, crashT / 0.55);
    const bob = !rider.air && state === 'play' && !calm ? Math.sin(t * 28) * 0.7 : 0;
    ctx.save();
    ctx.translate(RX, Y(rider.h) + bob);
    if (crashing) {
      ctx.translate(-10 * k, -Math.sin(k * Math.PI) * 26);
      ctx.rotate(-k * 1.35);
    } else ctx.rotate(rider.tilt);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // delivery box with the yellow dodo badge
    ctx.fillStyle = C.brown;
    rrect(-38, -54, 24, 22, 4); ctx.fill();
    ctx.fillStyle = C.yellow;
    ctx.beginPath(); ctx.arc(-26, -43, 6.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.dodo;
    ctx.save(); ctx.translate(-26, -43); ctx.rotate(-0.5);
    ctx.beginPath(); ctx.ellipse(0, 0, 3.8, 2.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.strokeStyle = C.brown; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(-30, -32); ctx.lineTo(-24, -27); ctx.stroke();

    // scooter body
    ctx.fillStyle = C.yellow; ctx.strokeStyle = C.brown; ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-31, -12);
    ctx.quadraticCurveTo(-33, -27, -20, -28);
    ctx.lineTo(-6, -28);
    ctx.quadraticCurveTo(-2, -28, -3, -20);
    ctx.lineTo(-2, -15);
    ctx.lineTo(11, -15);
    ctx.lineTo(15, -36);
    ctx.quadraticCurveTo(17, -40, 21, -38);
    ctx.lineTo(25, -14);
    ctx.quadraticCurveTo(25, -10, 21, -10);
    ctx.lineTo(-27, -10);
    ctx.quadraticCurveTo(-31, -10, -31, -12);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // seat
    ctx.fillStyle = C.brown;
    rrect(-25, -33, 19, 5.5, 2.75); ctx.fill();
    // front fork, handlebar, headlight
    ctx.strokeStyle = C.brown; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(20, -30); ctx.lineTo(20, -9); ctx.moveTo(17, -38); ctx.lineTo(13, -43); ctx.stroke();
    ctx.fillStyle = '#FFF4CE';
    ctx.beginPath(); ctx.arc(23.5, -31, 2.6, 0, Math.PI * 2); ctx.fill();

    // rider: leg, body, arm, helmet
    ctx.strokeStyle = C.brown; ctx.lineWidth = 5.5;
    ctx.beginPath(); ctx.moveTo(-11, -34); ctx.lineTo(1, -31); ctx.lineTo(4, -17); ctx.stroke();
    ctx.fillStyle = C.brown;
    rrect(1, -18, 9, 4, 2); ctx.fill();
    ctx.strokeStyle = C.green; ctx.lineWidth = 11.5;
    ctx.beginPath(); ctx.moveTo(-11, -36); ctx.lineTo(-6, -50); ctx.stroke();
    ctx.lineWidth = 4.2;
    ctx.beginPath(); ctx.moveTo(-5, -48); ctx.lineTo(4, -43); ctx.lineTo(12, -43); ctx.stroke();
    ctx.fillStyle = C.brown;
    ctx.beginPath(); ctx.arc(12.5, -43, 2.4, 0, Math.PI * 2); ctx.fill();
    // helmet
    ctx.fillStyle = C.yellow; ctx.strokeStyle = C.brown; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(-4, -61, 8.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.brown;
    rrect(-1, -64, 8.6, 5.4, 2.7); ctx.fill();
    ctx.fillStyle = 'rgba(255,251,239,.55)';
    rrect(2, -63, 3.2, 1.6, 0.8); ctx.fill();
    ctx.strokeStyle = C.green; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(-4, -61, 8.5, Math.PI * 1.08, Math.PI * 1.45); ctx.stroke();

    // wheels
    wheel(-17, -8.5, rider.wheel);
    wheel(19, -8.5, rider.wheel);
    ctx.restore();

    if (crashing) {
      // little stars after a bump
      ctx.fillStyle = C.yellow; ctx.strokeStyle = C.brown; ctx.lineWidth = 1.2;
      for (let i = 0; i < 3; i++) {
        const a = t * 4 + (i * Math.PI * 2) / 3;
        const x = RX - 18 + Math.cos(a) * 16, y = Y(rider.h) - 74 + Math.sin(a) * 5;
        star(x, y, 4.2);
      }
    }
  }

  function star(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  function draw() {
    ctx.setTransform(dpr * s, 0, 0, dpr * s, 0, 0);
    ctx.clearRect(0, 0, W, HV);
    if (state === 'crash' && !calm && crashT < 0.25) ctx.translate(rand(-2, 2) * (1 - crashT * 4), rand(-2, 2) * (1 - crashT * 4));
    drawBackdrop();
    drawRoad();
    obstacles.forEach(drawObstacle);
    pickups.forEach(drawDodo);
    drawRider();
    parts.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, Y(p.y), p.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.font = '700 15px Outfit, system-ui, sans-serif';
    ctx.textAlign = 'center';
    floats.forEach((f) => {
      ctx.globalAlpha = Math.min(1, f.life * 2.2);
      ctx.fillStyle = f.gold ? C.brown : C.green;
      ctx.fillText(f.txt, f.x, Y(f.y));
    });
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- loop
  function frame(now) {
    raf = 0;
    let dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    // small fixed steps keep jumps identical on 60, 90, 120 and 144 Hz screens
    const n = Math.max(1, Math.ceil(dt / (1 / 120)));
    for (let i = 0; i < n; i++) step(dt / n);
    draw();
    if (state === 'crash' && crashT > 0.75) return gameOver();
    if (state === 'play' || state === 'crash') raf = requestAnimationFrame(frame);
  }

  function run() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  // ---------------------------------------------------------------- screens
  const HIT_MSG = {
    pepper: 'Too hot! The pepper got you.',
    pepper2: 'Two peppers? That’s too hot.',
    cone: 'Bonk! Mind the cones.',
    combo: 'Pepper and a cone? Wahala!',
    hole: 'That Lagos pothole won this round.',
    hole2: 'That Lagos pothole won this round.',
  };

  function showUI(html, focusSel) {
    ui.innerHTML = html;
    ui.classList.remove('is-off');
    if (focusSel) ui.querySelector(focusSel)?.focus({ preventScroll: true });
  }
  function hideUI() { ui.classList.add('is-off'); }

  function idleScreen() {
    showUI(`<p class="dash-msg">Ready, rider?</p>
      <p class="dash-note">Grab the dodo. Jump the peppers, cones and potholes.</p>
      <div class="dash-actions"><button type="button" class="btn btn-primary" data-act="play">Start riding</button></div>`);
  }

  function gameOver() {
    stop();
    state = 'over';
    overAt = performance.now();
    ui.classList.add('is-cool');
    setTimeout(() => ui.classList.remove('is-cool'), 700);
    const isBest = score > best;
    if (isBest) { best = score; store.set(best); bestEl.textContent = best; }
    const order = orderLink ? `<a class="btn btn-soft" href="${orderLink.href}" target="_blank" rel="noopener">Order real dodo</a>` : '';
    showUI(`<p class="dash-msg">${HIT_MSG[hitBy] || 'Ouch!'}</p>
      <p class="dash-note">You grabbed <b>${score}</b> dodo${isBest && score > 0 ? '<span class="dash-new">New best!</span>' : ''}</p>
      <div class="dash-actions"><button type="button" class="btn btn-primary" data-act="play">Play again</button>${order}</div>`, '[data-act="play"]');
    live.textContent = `Game over. You grabbed ${score} dodo. Your best is ${best}.`;
    stage.classList.remove('is-playing');
    if (window.gtag) window.gtag('event', 'dodo_dash_over', { value: score });
  }

  function pause() {
    if (state !== 'play') return;
    stop();
    state = 'paused';
    rider.hold = false;
    stage.classList.remove('is-playing');
    showUI(`<p class="dash-msg">Paused</p>
      <div class="dash-actions"><button type="button" class="btn btn-primary" data-act="resume">Keep riding</button></div>`);
  }

  function begin() {
    if (state === 'paused') { state = 'play'; }
    else {
      reset();
      state = 'play';
      live.textContent = '';
      if (!started && window.gtag) window.gtag('event', 'dodo_dash_start');
      started = true;
    }
    hideUI();
    stage.classList.add('is-playing');
    stage.focus({ preventScroll: true });
    const r = stage.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) stage.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' });
    run();
  }

  // ---------------------------------------------------------------- input
  const JUMP = new Set(['Space', 'ArrowUp', 'KeyW']);
  const typing = (el) => el && el.closest && el.closest('input, textarea, select, [contenteditable="true"]');

  ui.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]');
    if (act && !cooling()) begin();
  });

  stage.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || e.target.closest('button, a')) return;
    if (state === 'play') { e.preventDefault(); press(); }
    else if (state === 'idle' || state === 'over' || state === 'paused') { e.preventDefault(); if (!cooling()) begin(); }
  });
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);

  window.addEventListener('keydown', (e) => {
    if (typing(e.target)) return;
    const here = section.contains(document.activeElement);
    if (state === 'play' && (e.code === 'KeyP' || e.code === 'Escape')) { pause(); return; }
    if (!JUMP.has(e.code)) {
      if (e.code === 'Enter' && here && e.target === stage && state !== 'play' && state !== 'crash') { e.preventDefault(); begin(); }
      return;
    }
    if (state === 'play' && (visible || here)) { e.preventDefault(); if (!e.repeat) press(); return; }
    if (here && !e.target.closest('button, a') && (state === 'idle' || state === 'over' || state === 'paused')) { e.preventDefault(); if (!cooling()) begin(); }
  });
  window.addEventListener('keyup', (e) => { if (JUMP.has(e.code)) release(); });

  // pause when the game scrolls away or the tab is hidden: saves battery too
  new IntersectionObserver(([en]) => {
    visible = en.intersectionRatio >= 0.5;
    if (!visible) pause();
  }, { threshold: [0, 0.5, 1] }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('blur', pause);

  // ---------------------------------------------------------------- start
  function attract() {
    // a still scene behind the start screen
    reset();
    obstacles = [{ type: 'pepper', x: Math.min(W * 0.62, 420), w: 24, h: 24 }];
    const cx = obstacles[0].x + 12;
    pickups = [[-34, 56], [0, 78], [34, 56]].map(([ox, oy], i) => ({ x: cx + ox, y: oy, ph: i }));
    if (W > 700) pickups.push({ x: W * 0.82, y: 112, gold: true, ph: 0 });
    draw();
  }

  new ResizeObserver(() => { resize(); if (state === 'idle') attract(); }).observe(stage);
  resize();
  attract();
  idleScreen();
  if (document.fonts) document.fonts.load('700 64px Outfit').then(() => { buildBackdrop(); if (state !== 'play' && state !== 'crash') draw(); });
})();
