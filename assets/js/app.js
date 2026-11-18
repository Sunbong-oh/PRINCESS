/* Princess Talk — game logic (vanilla JS, no build step) */
(function () {
  'use strict';

  /* ------------------------------ helpers ------------------------------ */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /* seeded RNG (mulberry32) so "today's story" is the same all day */
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    let t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffleWith(arr, rand) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function dayKey(d) {
    d = d || new Date();
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  /* ------------------------------ speech ------------------------------ */
  const synth = window.speechSynthesis;

  /* 낭독 속도: 아이가 단어를 몰라도 따라 들을 수 있게 아주 천천히, 또박또박 읽습니다.
     (기존 0.92 → 4살 0.68 / 6살 0.75 / 8살 0.82) 보기 낭독은 한 단어라 더 또렷하게 조금 더 느리게. */
  const LEVEL_RATE = { 4: 0.68, 6: 0.75, 8: 0.82 };
  function currentRate() { return LEVEL_RATE[state.level] || LEVEL_RATE[6]; }
  function optionRate() { return Math.max(0.6, Math.round((currentRate() - 0.04) * 100) / 100); }

  let voice = null;
  function loadVoices() {
    if (!synth) return;
    const voices = synth.getVoices() || [];
    if (!voices.length) return;
    const en = voices.filter((v) => /^en(-|$)/i.test(v.lang));
    const prefer = ['Google US English', 'Samantha', 'Karen', 'Microsoft Aria', 'Microsoft Zira', 'Google UK English Female', 'Moira'];
    for (const name of prefer) {
      const hit = en.find((v) => v.name && v.name.indexOf(name) !== -1);
      if (hit) { voice = hit; return; }
    }
    voice = en.find((v) => /female|woman/i.test(v.name)) || en[0] || voices[0];
  }
  if (synth) {
    loadVoices();
    if (typeof synth.onvoiceschanged !== 'undefined') synth.onvoiceschanged = loadVoices;
  }
  let speakTimer = null;
  let autoTimer = null;
  let speakSeq = 0;
  function clearPlaying() { $$('.is-playing').forEach((el) => el.classList.remove('is-playing')); }
  function speak(text, opts) {
    if (!synth || !text) return false;
    opts = opts || {};
    const my = ++speakSeq;
    try {
      clearTimeout(speakTimer);
      synth.cancel();
      clearPlaying();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      if (voice) u.voice = voice;
      u.rate = opts.rate || currentRate();
      u.pitch = opts.pitch || 1.08;
      u.volume = 1;
      const done = () => { if (my === speakSeq && opts.onend) opts.onend(); };
      u.onend = done;
      u.onerror = done;
      // some browsers drop the first utterance right after load
      speakTimer = setTimeout(() => { try { synth.speak(u); } catch (e) { done(); } }, 60);
      return true;
    } catch (e) { return false; }
  }
  function stopSpeak() {
    speakSeq += 1;
    clearTimeout(autoTimer);
    if (synth) { try { synth.cancel(); } catch (e) {} }
    clearTimeout(speakTimer);
    clearPlaying();
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recog = null;
  let listening = false;

  /* ------------------------------ answer matching ------------------------------ */
  const NUM = { 0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve' };
  const HOMOPHONE = { to: 'two', too: 'two', for: 'four', fore: 'four', tree: 'three', free: 'three', ate: 'eight', won: 'one', sx: 'six', ive: 'five' };

  function normalize(str) {
    let s = String(str || '').toLowerCase();
    s = s.replace(/[’‘`]/g, "'").replace(/'s\b/g, 's').replace(/[^a-z0-9'\s]/g, ' ');
    s = s.replace(/\b\d+\b/g, (m) => (NUM[m] !== undefined ? NUM[m] : m));
    return s.split(/\s+/).filter(Boolean).map((t) => HOMOPHONE[t] || t).join(' ');
  }
  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }
  function tokenMatches(token, key) {
    if (token === key) return true;
    if (key.length >= 3 && token.length > key.length && token.indexOf(key) === 0) return true; // cup ~ cups
    if (token.length >= 3 && key.length > token.length && key.indexOf(token) === 0) return true;
    if (key.length >= 4 && token.length >= 4) {
      const tol = Math.min(token.length, key.length) >= 7 ? 2 : 1;
      if (lev(token, key) <= tol) return true;
    }
    return false;
  }
  function isCorrect(spoken, level) {
    const tokens = normalize(spoken).split(' ').filter(Boolean);
    if (!tokens.length) return false;
    return level.keys.every((group) =>
      group.some((key) => tokens.some((tok) => tokenMatches(tok, normalize(key))))
    );
  }

  /* ------------------------------ state ------------------------------ */
  const state = {
    level: store.get('pt.level', 6),
    story: null,
    index: 0,
    earned: [],
    tries: 0,
    locked: false,
    answered: []
  };
  if (LEVELS.indexOf(state.level) === -1) state.level = 6;

  let stickers = store.get('pt.stickers', []);
  if (!Array.isArray(stickers)) stickers = [];

  /* ------------------------------ story picking ------------------------------ */
  function buildStory(princess, rand, label) {
    const items = rand ? shuffleWith(princess.items, rand) : shuffle(princess.items);
    return { princess: princess, items: items, label: label || '' };
  }
  function todaysStory() {
    const seed = hashStr('princess-talk-' + dayKey());
    const rand = rng(seed);
    const princess = PRINCESSES[Math.floor(rand() * PRINCESSES.length)];
    return buildStory(princess, rand, '오늘의 이야기');
  }
  function randomStory() {
    const pool = PRINCESSES.filter((p) => !state.story || p.id !== state.story.princess.id);
    const list = pool.length ? pool : PRINCESSES;
    const princess = list[Math.floor(Math.random() * list.length)];
    return buildStory(princess, rng((Math.random() * 4294967296) >>> 0), '새 이야기');
  }

  /* ------------------------------ screens ------------------------------ */
  function show(id) {
    $$('.screen').forEach((s) => s.classList.toggle('is-active', s.id === id));
    window.scrollTo(0, 0);
  }

  /* ------------------------------ home ------------------------------ */
  function renderStickers() {
    const list = $('#home-sticker-list');
    list.innerHTML = '';
    if (!stickers.length) {
      const e = document.createElement('span');
      e.className = 'empty';
      e.textContent = '아직 없어요 — 정답을 맞히면 모여요!';
      list.appendChild(e);
      return;
    }
    stickers.slice(-14).forEach((s) => {
      const el = document.createElement('span');
      el.textContent = s;
      list.appendChild(el);
    });
    if (stickers.length > 14) {
      const el = document.createElement('span');
      el.style.fontSize = '12px';
      el.style.color = '#a08bbd';
      el.textContent = '+' + (stickers.length - 14);
      list.appendChild(el);
    }
  }
  function renderLevels() {
    $$('.level-btn').forEach((b) => b.classList.toggle('is-on', Number(b.dataset.level) === state.level));
    $$('.mini-level').forEach((b) => b.classList.toggle('is-on', Number(b.dataset.level) === state.level));
  }
  function renderHome() {
    const story = todaysStory();
    $('#today-img').src = story.princess.items[0].img;
    $('#today-img').alt = story.princess.nameKo + ' ' + story.princess.name;
    $('#today-title').textContent = story.princess.nameKo + ' · ' + story.princess.title;
    $('#today-sub').textContent = story.princess.name + ' — ' + story.princess.titleKo;
    renderLevels();
    renderStickers();
  }

  /* ------------------------------ play ------------------------------ */
  function preload(story) {
    story.items.forEach((it) => { const im = new Image(); im.src = it.img; });
  }
  function startStory(story) {
    state.story = story;
    state.index = 0;
    state.earned = [];
    state.answered = [];
    preload(story);
    $('#play-title').textContent = story.princess.nameKo + ' · ' + story.princess.title;
    show('screen-play');
    renderLevels();
    renderQuestion();
  }
  function renderProgress() {
    $$('#progress span').forEach((s, i) => s.classList.toggle('done', i < state.index));
  }
  function currentItem() { return state.story.items[state.index]; }
  function currentQ() { return currentItem().q[state.level]; }

  function renderQuestion() {
    const item = currentItem();
    const q = currentQ();
    state.tries = 0;
    state.locked = false;
    renderProgress();

    const img = $('#scene-img');
    img.classList.add('is-loading');
    img.onload = () => img.classList.remove('is-loading');
    img.src = item.img;
    img.alt = state.story.princess.nameKo + ' — ' + item.scene;
    if (img.complete) img.classList.remove('is-loading');
    $('#scene-tag').textContent = item.scene;

    $('#q-text').textContent = q.text;
    $('#q-ko').textContent = q.ko || '';

    const box = $('#options');
    box.innerHTML = '';
    // 보기 순서도 매번 달라지게 (정답 위치를 외우지 않도록)
    shuffle(q.opts).forEach((opt, i) => {
      const row = document.createElement('div');
      row.className = 'opt-row';

      const b = document.createElement('button');
      b.className = 'opt';
      b.type = 'button';
      b.dataset.value = opt;
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.textContent = String.fromCharCode(65 + i);
      b.appendChild(dot);
      const t = document.createElement('span');
      t.className = 'opt-text';
      t.textContent = opt;
      b.appendChild(t);
      b.addEventListener('click', () => onTapOption(b, opt));

      // 🔊 보기 듣기: 정답을 고르지 않고 이 보기의 영어만 천천히 읽어줍니다.
      const hear = document.createElement('button');
      hear.className = 'opt-hear';
      hear.type = 'button';
      hear.dataset.say = opt;
      hear.title = opt + ' 듣기';
      hear.setAttribute('aria-label', opt + ' 듣기');
      const sp = document.createElement('span');
      sp.setAttribute('aria-hidden', 'true');
      sp.textContent = '🔊';
      hear.appendChild(sp);
      hear.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        hearOption(hear, opt);
      });

      row.appendChild(b);
      row.appendChild(hear);
      box.appendChild(row);
    });

    $('#mic-hint').classList.remove('is-hidden');
    $('#mic-hint').textContent = SR
      ? '🎤 를 누르고 영어로 말해보세요. 🔊 를 누르면 보기를 들려줘요.'
      : '마이크가 없어도 아래 단어를 눌러 정답을 고를 수 있어요. 🔊 로 보기를 들을 수 있어요.';
    const micBtn = $('#btn-mic');
    micBtn.style.display = SR ? '' : 'none';

    // auto read the question (사용자가 먼저 🔊를 누르면 이 예약은 취소됩니다)
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => { if (!$('#screen-play').classList.contains('is-active')) return; speak(q.text); }, 380);
  }

  function toast(msg, kind) {
    const el = $('#toast');
    el.textContent = msg;
    el.className = 'toast show' + (kind ? ' ' + kind : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.className = 'toast'; }, 1900);
  }

  function onTapOption(btn, value) {
    if (state.locked) return;
    const q = currentQ();
    const correct = normalize(value) === normalize(q.answer);
    if (correct) { win(btn); } else { miss(btn); }
  }

  /* 보기 하나만 천천히 읽어주기 (정답 선택·채점과는 무관) */
  function hearOption(btn, text) {
    clearTimeout(autoTimer);
    // 음성인식 중이면 TTS 소리를 마이크가 듣지 않도록 인식을 먼저 정리합니다.
    if (listening && recog) {
      try { recog.stop(); } catch (e) {}
      toast('🔊 보기를 들려줄게요', '');
    }
    // speak()는 시작할 때 이전 강조를 지우므로, 강조는 speak() 다음에 켭니다.
    const started = speak(text, {
      rate: optionRate(),
      onend: () => { if (btn) btn.classList.remove('is-playing'); }
    });
    if (started) {
      if (btn) btn.classList.add('is-playing');
    } else {
      toast('이 브라우저는 소리를 낼 수 없어요.', 'no');
    }
  }
  function miss(btn) {
    btn.classList.add('opt-no');
    state.tries += 1;
    if (state.tries >= 2) {
      state.locked = true;
      const q = currentQ();
      const target = $$('#options .opt').find((b) => normalize(b.dataset.value) === normalize(q.answer));
      if (target) target.classList.add('opt-ok');
      toast('This one! ⭐ ' + q.answer, 'ok');
      speak(q.answer);
      setTimeout(next, 2100);
    } else {
      toast('Try again! 다시 골라볼까요?', 'no');
    }
    setTimeout(() => btn.classList.remove('opt-no'), 700);
  }
  function win(btn) {
    if (state.locked) return;
    state.locked = true;
    if (btn) btn.classList.add('opt-ok');
    const q = currentQ();
    const sticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
    state.earned.push(sticker);
    stickers.push(sticker);
    store.set('pt.stickers', stickers);
    const praise = ['Great job!', 'Wonderful!', 'Well done!', 'Perfect!', 'You are amazing!'];
    toast(praise[Math.floor(Math.random() * praise.length)] + ' ' + sticker, 'ok');
    speak(q.answer);
    confetti();
    if (navigator.vibrate) { try { navigator.vibrate(30); } catch (e) {} }
    setTimeout(next, 1750);
  }
  function next() {
    stopSpeak();
    state.index += 1;
    if (state.index >= state.story.items.length) { finish(); return; }
    renderQuestion();
  }

  function finish() {
    renderStickers();
    $('#result-title').textContent = 'Wonderful!';
    $('#result-sub').textContent = state.story.princess.nameKo + ' 이야기를 모두 마쳤어요';
    const stars = $('#result-stars');
    stars.innerHTML = '';
    const n = Math.min(4, Math.max(1, state.earned.length));
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.textContent = '⭐';
      s.style.animationDelay = (i * 120) + 'ms';
      stars.appendChild(s);
    }
    const st = $('#result-stickers');
    st.innerHTML = '';
    state.earned.forEach((e) => { const s = document.createElement('span'); s.textContent = e; st.appendChild(s); });
    const img = $('#result-img');
    img.src = state.story.items[0].img;
    img.alt = state.story.princess.nameKo;
    show('screen-result');
    confetti(28);
    speak('Wonderful! You did it!');
  }

  /* ------------------------------ mic ------------------------------ */
  function initRecog() {
    if (!SR) return null;
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = true;
    r.maxAlternatives = 4;
    r.continuous = false;

    r.onstart = () => {
      listening = true;
      $('#btn-mic').classList.add('is-hot');
      toast('듣고 있어요… 영어로 말해보세요!', '');
    };
    r.onresult = (ev) => {
      const results = ev.results;
      const alts = [];
      let finalText = '';
      for (let i = ev.resultIndex; i < results.length; i++) {
        const res = results[i];
        for (let j = 0; j < res.length; j++) {
          if (res[j] && res[j].transcript) alts.push(res[j].transcript.trim());
        }
        if (res.isFinal && res[0]) finalText = res[0].transcript.trim();
      }
      if (!finalText) {
        const last = alts[alts.length - 1];
        if (last) $('#q-ko').textContent = '🗣 ' + last;
        return;
      }
      $('#q-ko').textContent = '🗣 ' + finalText;
      const q = currentQ();
      const said = alts.length ? alts : [finalText];
      const ok = said.some((t) => isCorrect(t, q)) || isCorrect(finalText, q);
      if (ok) {
        stopSpeak();
        const target = $$('#options .opt').find((b) => normalize(b.dataset.value) === normalize(q.answer));
        win(target || null);
      } else if (!state.locked) {
        state.tries += 1;
        if (state.tries >= 2) {
          state.locked = true;
          const t2 = $$('#options .opt').find((b) => normalize(b.dataset.value) === normalize(q.answer));
          if (t2) t2.classList.add('opt-ok');
          toast('This one! ⭐ ' + q.answer, 'ok');
          speak(q.answer);
          setTimeout(next, 2100);
        } else {
          toast('Close! 한 번 더 말해볼까요?', 'no');
        }
      }
    };
    r.onerror = (ev) => {
      listening = false;
      $('#btn-mic').classList.remove('is-hot');
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
        toast('마이크를 쓸 수 없어요. 단어를 눌러보세요.', 'no');
      } else if (ev.error === 'no-speech') {
        toast('잘 안 들렸어요. 다시 말해볼까요?', 'no');
      } else if (ev.error === 'aborted') {
        /* user stopped */
      } else {
        toast('다시 한 번 말해볼까요?', 'no');
      }
    };
    r.onend = () => {
      listening = false;
      $('#btn-mic').classList.remove('is-hot');
      if ($('#q-ko').textContent.indexOf('🗣') !== 0) {
        $('#q-ko').textContent = currentQ().ko || '';
      }
    };
    return r;
  }

  function startListening() {
    if (!SR) { toast('이 브라우저는 마이크를 지원하지 않아요.', 'no'); return; }
    if (listening) { try { recog.stop(); } catch (e) {} return; }
    if (!recog) recog = initRecog();
    clearTimeout(autoTimer);
    stopSpeak();
    const q = currentQ();
    $('#q-ko').textContent = q.ko || '';
    try { recog.start(); } catch (e) { try { recog.stop(); } catch (e2) {} }
  }

  /* ------------------------------ confetti ------------------------------ */
  const canvas = $('#fx');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let rafId = null;
  const COLORS = ['#ff8fc4', '#ffd166', '#8d68ff', '#63d2ff', '#7ef0b0', '#ffb3d9', '#fff1a8'];
  function sizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  function confetti(n) {
    n = n || 90;
    const W = window.innerWidth, H = window.innerHeight;
    for (let i = 0; i < n; i++) {
      particles.push({
        x: W * (0.5 + (Math.random() - 0.5) * 0.5),
        y: H * (0.38 + Math.random() * 0.12),
        vx: (Math.random() - 0.5) * 9,
        vy: -6 - Math.random() * 9,
        g: 0.22 + Math.random() * 0.12,
        size: 5 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        shape: Math.random() < 0.35 ? 'star' : 'rect'
      });
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }
  function starPath(s) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI / 2) * -1 + (i * 2 * Math.PI) / 5;
      const a2 = a + Math.PI / 5;
      ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
      ctx.lineTo(Math.cos(a2) * s * 0.45, Math.sin(a2) * s * 0.45);
    }
    ctx.closePath();
    ctx.fill();
  }
  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 60);
    particles.forEach((p) => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.006;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'star') { starPath(p.size); }
      else { ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); }
      ctx.restore();
    });
    if (particles.length) { rafId = requestAnimationFrame(tick); }
    else { rafId = null; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
  }

  /* ------------------------------ wiring ------------------------------ */
  function bind() {
    $$('.level-btn').forEach((b) => b.addEventListener('click', () => {
      state.level = Number(b.dataset.level);
      store.set('pt.level', state.level);
      renderLevels();
      // warm-up utterance inside a user gesture (needed on iOS)
      speak('Let us start!');
      if ($('#screen-play').classList.contains('is-active')) { stopSpeak(); renderQuestion(); }
    }));
    $$('.mini-level').forEach((b) => b.addEventListener('click', () => {
      const lv = Number(b.dataset.level);
      if (lv === state.level) return;
      state.level = lv;
      store.set('pt.level', state.level);
      renderLevels();
      if (state.story) renderQuestion();
    }));

    $('#btn-today').addEventListener('click', () => {
      stopSpeak();
      speak('Let us start!');
      startStory(todaysStory());
    });
    $('#btn-random').addEventListener('click', () => {
      stopSpeak();
      speak('Once upon a time!');
      startStory(randomStory());
    });
    $('#btn-hear').addEventListener('click', () => {
      if (!state.story) return;
      clearTimeout(autoTimer);
      if (listening && recog) { try { recog.stop(); } catch (e) {} }
      const hb = $('#btn-hear');
      const started = speak(currentQ().text, { onend: () => hb.classList.remove('is-playing') });
      if (started) hb.classList.add('is-playing');
    });
    $('#today-card').addEventListener('click', () => $('#btn-today').click());
    $('#btn-mic').addEventListener('click', startListening);
    $('#btn-quit').addEventListener('click', () => {
      stopSpeak();
      if (recog && listening) { try { recog.stop(); } catch (e) {} }
      show('screen-home');
      renderHome();
    });
    $('#btn-again').addEventListener('click', () => {
      const story = buildStory(state.story.princess, null, '다시 읽기');
      startStory(story);
    });
    $('#btn-new').addEventListener('click', () => startStory(randomStory()));

    document.addEventListener('visibilitychange', () => { if (document.hidden) stopSpeak(); });
  }

  /* ------------------------------ boot ------------------------------ */
  function boot() {
    renderHome();
    bind();
    // iOS unlock: speak an empty utterance on the first touch
    const unlock = () => {
      if (synth && !synth.speaking) { try { synth.resume(); } catch (e) {} }
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
    document.addEventListener('touchstart', unlock, { passive: true });
    document.addEventListener('click', unlock);
    window.addEventListener('pagehide', stopSpeak);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
