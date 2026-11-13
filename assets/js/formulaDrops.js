// formulaDrops.js
(function () {
  'use strict';
  const CFG = window.FORMULA_DROPS;
  if (!CFG || !CFG.anchors) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX = CFG.maxOnScreen || 2;
  const G = 1500;                 // gravidade em px/s^2
  const items = [];
  const anchors = [];

  // Os SVG das fórmulas vêm pré-renderizados em formulaSvgs.js (gerado por _tools/build-formulas.mjs),
  // por isso o browser não descarrega o MathJax.
  const SVGS = window.FORMULA_SVGS || {};
  function makeSvg(tex) {
    const markup = SVGS[tex];
    if (!markup) { console.warn('[formulaDrops] fórmula não pré-renderizada', tex); return null; }
    const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
    const svg = doc.documentElement;
    return svg && svg.nodeName === 'svg' ? document.importNode(svg, true) : null;
  }

  // Envolve a primeira ocorrência exata de `phrase` dentro de `scope` num span.fd-a
  function wrapPhrase(scope, phrase) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const i = node.nodeValue.indexOf(phrase);
      if (i < 0) continue;
      const mid = node.splitText(i);
      mid.splitText(phrase.length);
      const span = document.createElement('span');
      span.className = 'fd-a';
      mid.parentNode.replaceChild(span, mid);
      span.appendChild(mid);
      return span;
    }
    return null;
  }

  function buildAnchors() {
    for (const c of CFG.anchors) {
      let el = null;
      for (const scope of document.querySelectorAll(c.scope)) {
        el = c.trigger === 'typed' ? scope : wrapPhrase(scope, c.phrase);
        if (el) break;
      }
      if (!el) { console.warn('[formulaDrops] âncora não encontrada', c.scope, c.phrase || ''); continue; }
      anchors.push({ el, cfg: c, turn: 0, item: null, visible: false });
    }
  }

  function target(a, el) {
    const r = a.el.getBoundingClientRect();
    // por omissão a fórmula assenta mesmo no topo das letras da palavra (proporcional ao tamanho do texto),
    // para ficar longe da linha de cima
    const gap = a.cfg.gap !== undefined ? a.cfg.gap : -0.1 * (parseFloat(getComputedStyle(a.el).fontSize) || 16);
    const vw = document.documentElement.clientWidth;
    const w = el.offsetWidth;
    // não deixa a fórmula sair do ecrã (telemóveis)
    const x = Math.max(4, Math.min(vw - w - 4, r.left + window.scrollX + r.width / 2 - w / 2));
    return { x, y: r.top + window.scrollY - el.offsetHeight - gap };
  }

  function drop(a, tex) {
    const svg = makeSvg(tex);
    if (!svg) return;
    const el = document.createElement('div');
    el.className = 'fd-f';
    el.setAttribute('aria-hidden', 'true');
    if (a.cfg.color) el.style.color = a.cfg.color;
    if (a.cfg.size) el.style.fontSize = a.cfg.size;
    el.appendChild(svg);
    document.body.appendChild(el);
    const t = target(a, el);
    const it = {
      a, el,
      x: t.x + (Math.random() - 0.5) * 40,
      y: window.scrollY - el.offsetHeight - 30,     // logo acima do topo do ecrã
      vy: 0, rot: (Math.random() - 0.5) * 12, vrot: 0,
      op: 0, state: 'fall', born: performance.now()
    };
    if (reduce) { it.x = t.x; it.y = t.y; it.rot = 0; it.op = 1; it.state = 'rest'; land(a, false); }
    a.item = it;
    items.push(it);
  }

  function nextTex(a) { const l = a.cfg.tex; return l[a.turn++ % l.length]; }

  function land(a, bump) {
    if (!a.cfg.noHighlight) a.el.classList.add('fd-hit');
    if (bump && a.el.animate && a.cfg.trigger !== 'typed') {
      a.el.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(2.5px)' }, { transform: 'translateY(0)' }],
        { duration: 420, easing: 'cubic-bezier(.3,.7,.4,1)' });
    }
  }

  function leave(it) { if (it.state !== 'leave') { it.state = 'leave'; it.a.el.classList.remove('fd-hit'); } }

  // Agendador das âncoras automáticas, um evento de cada vez
  function tick() {
    if (document.hidden) return;
    const on = items.filter(i => i.state !== 'leave');
    // as fórmulas que ainda estão a desvanecer também contam, para nunca haver mais de MAX visíveis (a do hero não conta)
    const shown = items.filter(i => i.a.cfg.trigger !== 'typed');
    const free = anchors.filter(a => a.cfg.trigger === 'auto' && a.visible && !a.item);
    if (shown.length < MAX && free.length) {
      const a = free[Math.floor(Math.random() * free.length)];
      drop(a, nextTex(a));
    } else {
      const resting = on.filter(i => i.state === 'rest' && i.a.cfg.trigger === 'auto')
                        .sort((p, q) => p.born - q.born);
      if (resting.length) leave(resting[0]);
    }
  }

  function wireHover(a) {
    let timer = null;
    a.el.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      if (!a.item || a.item.state === 'leave') drop(a, nextTex(a));
    });
    a.el.addEventListener('mouseleave', () => {
      timer = setTimeout(() => { if (a.item) leave(a.item); }, 1200);
    });
  }

  function wireTyped(a) {
    let lastWord = '';
    let t = null;
    const check = () => {
      const word = a.el.textContent.trim();
      if (word === lastWord) return;
      lastWord = word;
      if (a.item) leave(a.item);
      const tex = a.cfg.map[word];
      if (tex) setTimeout(() => drop(a, tex), a.item ? 350 : 0);
    };
    new MutationObserver(() => { clearTimeout(t); t = setTimeout(check, 180); })
      .observe(a.el, { childList: true, characterData: true, subtree: true });
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      if (it.state === 'fall') {
        const t = target(it.a, it.el);
        it.vy += G * dt;
        it.y += it.vy * dt;
        it.x += (t.x - it.x) * Math.min(1, dt * 3);
        // só aparece nos últimos 90 px da queda, para não riscar as linhas por onde passa
        const pr = Math.max(0, Math.min(1, 1 - (t.y - it.y) / 90));
        it.op = pr * pr;
        if (it.y >= t.y) {
          it.y = t.y;
          if (it.vy > 160) { it.vy = -Math.min(it.vy * 0.12, 110); it.op = 1; land(it.a, true); it.vrot += it.rot * -8; }
          else { it.vy = 0; it.op = 1; it.state = 'rest'; }
        }
      } else if (it.state === 'rest') {
        const t = target(it.a, it.el);       // acompanha reflow e resize
        it.x = t.x; it.y = t.y;
      } else {
        it.op -= dt * 1.4;
        if (it.op <= 0) {
          it.el.remove();
          items.splice(i, 1);
          if (it.a.item === it) it.a.item = null;
          continue;
        }
      }
      // inclinação inicial que estabiliza como uma mola amortecida
      it.vrot += (-60 * it.rot - 9 * it.vrot) * dt;
      it.rot += it.vrot * dt;
      it.el.style.opacity = it.op;
      it.el.style.transform = 'translate(' + it.x + 'px,' + it.y + 'px) rotate(' + it.rot + 'deg)';
    }
    requestAnimationFrame(frame);
  }

  function init() {
    buildAnchors();
    if (!anchors.length) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      const a = anchors.find(x => x.el === e.target);
      if (a) a.visible = e.isIntersecting;
    }), { rootMargin: '-60px 0px -40px 0px' });
    anchors.forEach(a => {
      io.observe(a.el);
      if (a.cfg.trigger === 'hover') wireHover(a);
      if (a.cfg.trigger === 'typed') wireTyped(a);
    });
    requestAnimationFrame(frame);
    setTimeout(tick, 600);
    setInterval(tick, CFG.intervalMs || 2600);
  }

  // Só arranca depois de a página carregar, para não atrasar o primeiro render
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
