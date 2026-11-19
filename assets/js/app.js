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

  /* ------------------------------ 관사 ------------------------------ */
  /* 4살 아이는 "A ball"의 A를 단어의 일부로 헷갈려 합니다.
     보기·정답을 화면에 쓰고 읽어줄 때 앞의 A / An 은 떼어 냅니다. */
  function stripArticle(s) {
    return String(s == null ? '' : s).replace(/^\s*(?:a|an)\s+/i, '');
  }
  function sameAnswer(a, b) {
    return normalize(stripArticle(a)) === normalize(stripArticle(b));
  }

  /* ------------------------------ speech ------------------------------ */
  const synth = window.speechSynthesis;

  /* 낭독 속도: 아이가 단어를 몰라도 따라 들을 수 있게 아주 천천히, 또박또박 읽습니다.
     (4살 0.68 / 6살 0.75 / 8살 0.82 / 12살 0.90 유지) 보기 낭독은 조금 더 느리게. */
  const LEVEL_RATE = { 4: 0.68, 6: 0.75, 8: 0.82, 12: 0.90 };
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
      speakTimer = setTimeout(() => {
        if (my !== speakSeq) return;           // 취소된 발화는 소리 내지 않습니다
        try { synth.speak(u); } catch (e) { done(); }
      }, 60);
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

  /* 질문 → A·B·C 보기 순서로 이어 읽는 큐. 취소되면 즉시 멈춥니다. */
  let readSeq = 0;
  function cancelRead() {
    readSeq += 1;
    stopSpeak();
  }
  function readQuestionAndOptions() {
    readSeq += 1;
    const my = readSeq;
    stopSpeak();
    const q = currentQ();
    const parts = [{ text: q.text, rate: currentRate(), gap: 650 }];
    /* 12살은 보기가 없으니 질문만 읽습니다 (A·B·C 낭독 없음). */
    if (state.level !== 12) {
      state.opts.forEach((label, i) => {
        parts.push({ text: String.fromCharCode(65 + i) + '. ' + label, rate: optionRate(), gap: 480 });
      });
    }
    let k = 0;
    const step = () => {
      if (my !== readSeq) return;
      if (k >= parts.length) { clearPlaying(); return; }
      const p = parts[k++];
      const started = speak(p.text, {
        rate: p.rate,
        onend: () => { if (my !== readSeq) return; setTimeout(step, p.gap); }
      });
      if (!started) return;
      const hb = $('#btn-hear');
      if (hb) hb.classList.add('is-playing');
    };
    autoTimer = setTimeout(step, 400);
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recog = null;
  let listening = false;
  let lastSpoken = '';      // 이번 듣기에서 마지막으로 들린 말 — onend 폴백 채점용
  let graded = false;       // 이번 듣기에서 이미 채점했는지

  /* ------------------------------ answer matching ------------------------------ */
  const NUM = { 0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve' };
  const HOMOPHONE = { to: 'two', too: 'two', for: 'four', fore: 'four', tree: 'three', free: 'three', ate: 'eight', won: 'one', sx: 'six', ive: 'five' };
  const ARTICLES = { a: 1, an: 1, the: 1 };

  function normalize(str) {
    let s = String(str || '').toLowerCase();
    s = s.replace(/[’‘`]/g, "'").replace(/'s\b/g, 's').replace(/[^a-z0-9'\s]/g, ' ');
    s = s.replace(/\b\d+\b/g, (m) => (NUM[m] !== undefined ? NUM[m] : m));
    const tokens = s.split(/\s+/).filter(Boolean).map((t) => HOMOPHONE[t] || t);
    // 관사는 있든 없든 같은 답으로 봅니다 (a ball = ball)
    return tokens.filter((t) => !ARTICLES[t]).join(' ');
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

  /* ------------------------------ data index ------------------------------ */
  const ALL = [];
  PRINCESSES.forEach((p) => {
    p.items.forEach((it, i) => {
      ALL.push({ id: p.id + ':' + i, img: it.img, scene: it.scene, q: it.q, princess: p });
    });
  });
  const BY_ID = {};
  ALL.forEach((it) => { BY_ID[it.id] = it; });
  const ROUND_SIZE = 10;                    // 한 판(하루)에 10문제
  function allIds() { return ALL.map((it) => it.id); }

  /* ------------------------------ state ------------------------------ */
  const state = {
    level: store.get('pt.level', 6),
    story: null,
    index: 0,
    earned: [],
    tries: 0,
    locked: false,
    opts: [],        // 화면에 보이는 보기 (A, B, C 순서)
    selected: -1,    // 한 번 눌러 선택만 된 보기
    answered: []
  };
  if (LEVELS.indexOf(state.level) === -1) state.level = 6;

  let stickers = store.get('pt.stickers', []);
  if (!Array.isArray(stickers)) stickers = [];

  /* ------------------------------ 문항 풀 ------------------------------ */
  /* 공주마다 문항이 정확히 ROUND_SIZE(10)개씩 있습니다.
     한 판은 고른 공주 한 명의 10문항을 전부 섞어서 냅니다 — 다른 공주 문항은 섞지 않습니다.
     그래서 공주를 바꿔 가면 6명 × 10문항 = 60문항을 겹치지 않고 모두 풀 수 있습니다. */
  function pickRound(princess, rand) {
    const rnd = rand || Math.random;
    const mine = allIds().filter((id) => BY_ID[id].princess.id === princess.id);
    return shuffleWith(mine, rnd).slice(0, ROUND_SIZE).map((id) => BY_ID[id]);
  }

  function buildStory(princess, rand, label) {
    return { princess: princess, items: pickRound(princess, rand), label: label || '' };
  }
  /* 오늘의 공주는 날짜로 정해집니다 — 첫 화면 카드 중 한 장에만 ⭐ 오늘 추천 배지가 붙습니다. */
  function todaysPrincess() {
    const seed = hashStr('princess-talk-' + dayKey());
    return PRINCESSES[Math.floor(rng(seed)() * PRINCESSES.length)];
  }
  function randomStory(anyPrincess) {
    const pool = anyPrincess ? PRINCESSES : PRINCESSES.filter((p) => !state.story || p.id !== state.story.princess.id);
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
  function renderPoolInfo() {
    const el = $('#pool-info');
    if (!el) return;
    el.textContent = '공주별 ' + ROUND_SIZE + '문제씩 · 총 ' + ALL.length + '문항';
  }
  function renderHome() {
    renderPrincessCards();
    renderLevels();
    renderStickers();
    renderPoolInfo();
  }

  /* 첫 화면의 공주 6명 카드.
     · 대표 그림은 각 공주의 첫 장면(hero-*.webp)이고, object-fit:contain 이라 잘리지 않습니다.
     · 카드(그림 포함 전체)를 누르면 그 공주 10문제가 바로 시작됩니다.
     · 오늘의 공주 카드에만 ⭐ 오늘 추천 배지가 붙습니다. */
  function heroOf(p) { return p.items[0].img; }
  function cardNameOf(p) { return p.cardNameKo || p.nameKo; }
  function renderPrincessCards() {
    const grid = $('#princess-grid');
    if (!grid) return;
    const today = todaysPrincess();
    grid.innerHTML = '';
    PRINCESSES.forEach((p) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'princess-card' + (p.id === today.id ? ' is-today' : '');
      card.dataset.princess = p.id;
      if (card.style && typeof card.style.setProperty === 'function') card.style.setProperty('--pc', p.color);
      card.setAttribute('aria-label', cardNameOf(p) + ' ' + p.name + ' · 10문제 시작');
      card.setAttribute('title', p.nameKo + ' — ' + p.titleKo);

      if (p.id === today.id) {
        const badge = document.createElement('span');
        badge.className = 'pc-badge';
        badge.textContent = '⭐ 오늘 추천';
        card.appendChild(badge);
      }

      const art = document.createElement('span');
      art.className = 'pc-art';
      const img = document.createElement('img');
      img.src = heroOf(p);
      img.alt = cardNameOf(p) + ' ' + p.name;
      img.setAttribute('loading', 'eager');
      img.setAttribute('decoding', 'async');
      art.appendChild(img);
      card.appendChild(art);

      const ko = document.createElement('span');
      ko.className = 'pc-name';
      ko.textContent = cardNameOf(p);
      card.appendChild(ko);

      const en = document.createElement('span');
      en.className = 'pc-name-en';
      en.textContent = p.name;
      card.appendChild(en);

      card.addEventListener('click', () => startPrincess(p));
      grid.appendChild(card);
    });
  }

  /* 카드를 누르면 그 공주의 10문제가 바로 시작됩니다. */
  function startPrincess(princess) {
    cancelRead();
    if (listening) stopListening();
    speak('Let us start!');
    startStory(buildStory(princess, null, princess.nameKo));
  }

  /* ------------------------------ play ------------------------------ */
  function preload(story) {
    story.items.forEach((it) => { const im = new Image(); im.src = it.img; });
  }
  /* 한 판은 언제나 한 공주 이야기만 — 제목에도 그 공주 이름만 씁니다. */
  function roundTitle(story) {
    return story.princess.nameKo + ' · ' + ROUND_SIZE + '문제';
  }
  function buildProgress() {
    const p = $('#progress');
    if (!p) return;
    p.innerHTML = '';
    for (let i = 0; i < ROUND_SIZE; i++) p.appendChild(document.createElement('span'));
  }
  function startStory(story) {
    state.story = story;
    state.index = 0;
    state.earned = [];
    state.answered = [];
    state.selected = -1;
    preload(story);
    $('#play-title').textContent = roundTitle(story);
    show('screen-play');
    renderLevels();
    buildProgress();
    renderQuestion();
  }
  function renderProgress() {
    $$('#progress span').forEach((s, i) => s.classList.toggle('done', i < state.index));
  }
  function currentItem() { return state.story.items[state.index]; }
  /* 12살 문항은 따로 두지 않고 8살 문장을 그대로 씁니다 — 선택지 없이 바로 말하는 모드. */
  function currentQ() { const it = currentItem(); return it.q[state.level] || it.q[8]; }

  function renderQuestion() {
    const item = currentItem();
    const q = currentQ();
    /* 문제가 바뀌면 듣던 마이크와 그때의 말은 접어 둡니다 (이전 문제 말로 새 문제를 채점하지 않게) */
    if (listening) stopListening();
    lastSpoken = '';
    graded = false;
    state.tries = 0;
    state.locked = false;
    state.selected = -1;
    renderProgress();

    const img = $('#scene-img');
    img.classList.add('is-loading');
    img.onload = () => img.classList.remove('is-loading');
    img.src = item.img;
    img.alt = item.princess.nameKo + ' — ' + item.scene;
    if (img.complete) img.classList.remove('is-loading');
    $('#scene-tag').textContent = item.princess.nameKo + ' · ' + item.scene;

    $('#q-text').textContent = q.text;
    $('#q-ko').textContent = q.ko || '';

    const box = $('#options');
    box.innerHTML = '';
    // 보기 순서는 매번 섞고, 순서대로 A·B·C 이름을 붙입니다.
    state.opts = [];
    /* 12살 모드: 선택지를 없애고 아이가 영어로 바로 말하게 합니다. */
    const isFreeSpeak = (state.level === 12);
    if (isFreeSpeak) {
      box.classList.add('is-hidden');
    } else {
      box.classList.remove('is-hidden');
      shuffle(q.opts).forEach((raw, i) => {
        const value = stripArticle(raw);
        const b = document.createElement('button');
        b.className = 'opt';
        b.type = 'button';
        b.dataset.value = value;
        b.dataset.index = String(i);

        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.textContent = String.fromCharCode(65 + i);
        b.appendChild(dot);

        const t = document.createElement('span');
        t.className = 'opt-text';
        t.textContent = value;
        b.appendChild(t);

        // 보기 안의 🔊 — 버튼은 하나입니다. 한 번 누르면 읽어주고, 한 번 더 누르면 정답!
        const ear = document.createElement('span');
        ear.className = 'opt-ear';
        ear.setAttribute('aria-hidden', 'true');
        ear.textContent = '🔊';
        b.appendChild(ear);

        b.addEventListener('click', () => onTapOption(b, i));
        box.appendChild(b);
        state.opts.push(value);
      });
    }

    /* 💡 힌트는 12살에서만 보입니다. */
    const hintBtn = $('#btn-hint');
    if (hintBtn) hintBtn.classList.toggle('is-hidden', !isFreeSpeak);

    $('#mic-hint').classList.remove('is-hidden');
    if (isFreeSpeak) {
      $('#mic-hint').textContent = SR
        ? '선택지가 없어요! 🎤 말해보기를 눌러 영어로 바로 답해 보세요.'
        : '선택지가 없어요! 그림을 보고 영어로 바로 답해 보세요.';
    } else {
      $('#mic-hint').textContent = SR
        ? '보기를 한 번 누르면 들려주고, 한 번 더 누르면 정답이에요. 🎤 로 말해도 좋아요!'
        : '보기를 한 번 누르면 들려주고, 한 번 더 누르면 정답이에요.';
    }
    const micBtn = $('#btn-mic');
    micBtn.style.display = SR ? '' : 'none';

    // 질문을 읽고, 잠깐 쉬었다가 A·B·C 보기를 차례로 읽어줍니다 (12살은 질문만).
    readQuestionAndOptions();
  }

  function toast(msg, kind) {
    const el = $('#toast');
    el.textContent = msg;
    el.className = 'toast show' + (kind ? ' ' + kind : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.className = 'toast'; }, 1900);
  }

  /* 보기 하나: 첫 번째 탭 = 읽어주기 + 선택, 이미 선택된 보기를 다시 탭 = 정답 제출 */
  function onTapOption(btn, i) {
    if (state.locked) return;
    cancelRead();                                    // 이어 읽던 A·B·C는 멈춥니다
    if (listening) stopListening();                  // 마이크가 소리를 먹지 않게 먼저 멈춤
    if (state.selected === i) { grade(btn, i); return; }
    state.selected = i;
    $$('#options .opt').forEach((el) => el.classList.toggle('is-selected', el === btn));
    const started = speak(btn.dataset.value, {
      rate: optionRate(),
      onend: () => btn.classList.remove('is-playing')
    });
    if (started) btn.classList.add('is-playing');
  }

  function grade(btn, i) {
    const q = currentQ();
    if (sameAnswer(btn.dataset.value, q.answer)) win(btn);
    else miss(btn);
  }

  function miss(btn) {
    btn.classList.add('opt-no');
    state.tries += 1;
    if (state.tries >= 2) {
      state.locked = true;
      const q = currentQ();
      const target = $$('#options .opt').find((b) => sameAnswer(b.dataset.value, q.answer));
      if (target) target.classList.add('opt-ok');
      toast('This one! ⭐ ' + stripArticle(q.answer), 'ok');
      speak(stripArticle(q.answer));
      setTimeout(next, 2400);
    } else {
      toast('Try again! 다시 골라볼까요?', 'no');
      state.selected = -1;
      $$('#options .opt').forEach((el) => el.classList.remove('is-selected'));
      setTimeout(() => btn.classList.remove('opt-no'), 700);
    }
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
    speak(stripArticle(q.answer));
    confetti();
    if (navigator.vibrate) { try { navigator.vibrate(30); } catch (e) {} }
    setTimeout(next, 1750);
  }
  function next() {
    cancelRead();
    state.index += 1;
    if (state.index >= state.story.items.length) { finish(); return; }
    renderQuestion();
  }

  function finish() {
    renderStickers();
    renderPoolInfo();
    $('#result-title').textContent = 'Wonderful!';
    $('#result-sub').textContent = state.story.princess.nameKo + ' 이야기 ' + ROUND_SIZE + '문제를 모두 마쳤어요';
    const stars = $('#result-stars');
    stars.innerHTML = '';
    const n = Math.min(5, Math.max(1, Math.ceil(state.earned.length / 2)));
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
    img.src = state.story.princess.items[0].img;
    img.alt = state.story.princess.nameKo;
    show('screen-result');
    confetti(28);
    speak('Wonderful! You did it!');
  }

  /* ------------------------------ mic ------------------------------ */
  /* 안드로이드 Chrome은 음성인식이 isFinal 없이 onend로 끝나 버리거나,
     한 번 쓴 인식기를 다시 start() 하면 조용히 먹통이 됩니다. 그래서
       · 중간(interim) 결과라도 이미 정답이면 곧바로 멈추고 정답 처리하고,
       · 최종 결과 없이 onend가 오면 마지막으로 들린 말(lastSpoken)로 채점하며,
       · startListening()마다 인식기를 새로 만듭니다.
     recog.start()는 클릭 핸들러 안에서 곧바로, 동기로 부릅니다(모바일 제스처 정책). */

  /* 들린 말로 채점합니다. 최종 결과에서도, isFinal 없이 onend로 끝났을 때도 같은 규칙. */
  function gradeSpoken(spoken, alts, q) {
    if (!q || state.locked) return false;
    const said = alts && alts.length ? alts.slice() : [];
    if (spoken && said.indexOf(spoken) === -1) said.push(spoken);
    const ok = said.some((t) => isCorrect(t, q));
    if (spoken) $('#q-ko').textContent = '🗣 ' + spoken;
    if (ok) {
      cancelRead();
      const target = $$('#options .opt').find((b) => sameAnswer(b.dataset.value, q.answer));
      win(target || null);
      return true;
    }
    state.tries += 1;
    if (state.tries >= 2) {
      state.locked = true;
      const t2 = $$('#options .opt').find((b) => sameAnswer(b.dataset.value, q.answer));
      if (t2) t2.classList.add('opt-ok');
      toast('This one! ⭐ ' + stripArticle(q.answer), 'ok');
      speak(stripArticle(q.answer));
      setTimeout(next, 2400);
    } else {
      toast('Close! 한 번 더 말해볼까요?', 'no');
    }
    return false;
  }

  /* 진행 중인 인식기를 접습니다. 핸들러를 먼저 떼어 내므로 늦게 오는 onend가
     새 듣기나 화면을 건드리지 않습니다. */
  function stopListening() {
    const r = recog;
    recog = null;
    listening = false;
    graded = true;                      // 우리가 멈춘 경우는 onend 폴백 채점을 하지 않습니다
    const btn = $('#btn-mic');
    if (btn) btn.classList.remove('is-hot');
    if (!r) return;
    r.onstart = null;
    r.onresult = null;
    r.onerror = null;
    r.onend = null;
    try { r.abort(); } catch (e) { try { r.stop(); } catch (e2) {} }
  }

  function initRecog(sessQ) {
    if (!SR) return null;
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = true;
    r.maxAlternatives = 4;
    r.continuous = false;

    const current = () => recog === r;              // 지금 쓰는 인식기인지
    const sameQuestion = () => sessQ === currentQ(); // 그때의 문제가 아직 화면에 있는지

    r.onstart = () => {
      if (!current()) return;
      listening = true;
      const btn = $('#btn-mic');
      if (btn) btn.classList.add('is-hot');
      toast('듣고 있어요… 영어로 말해보세요!', '');
    };
    r.onresult = (ev) => {
      if (!current() || !sameQuestion() || state.locked) return;
      const results = (ev && ev.results) || [];
      const alts = [];
      let finalText = '';
      let interimText = '';
      for (let i = (ev && ev.resultIndex) || 0; i < results.length; i++) {
        const res = results[i];
        if (!res) continue;
        const n = res.length || 0;
        for (let j = 0; j < n; j++) {
          const t = res[j] && res[j].transcript ? String(res[j].transcript).trim() : '';
          if (t && alts.indexOf(t) === -1) alts.push(t);
        }
        const t0 = res[0] && res[0].transcript ? String(res[0].transcript).trim() : '';
        if (t0) { if (res.isFinal) finalText = t0; else interimText = t0; }
      }
      const spoken = finalText || interimText || (alts.length ? alts[alts.length - 1] : '');
      if (spoken) lastSpoken = spoken;

      /* ① 중간 결과라도 이미 정답이면 isFinal을 기다리지 않고 바로 정답 처리 */
      if (!graded && alts.some((t) => isCorrect(t, sessQ))) {
        graded = true;
        $('#q-ko').textContent = '🗣 ' + spoken;
        stopListening();
        gradeSpoken(spoken, alts, sessQ);
        return;
      }
      if (!finalText) {
        /* 아직 중간 결과 — 화면에만 보여 주고 계속 듣습니다 */
        if (spoken) $('#q-ko').textContent = '🗣 ' + spoken;
        return;
      }
      /* ② 최종 결과 — 채점하고 마이크를 닫습니다 */
      graded = true;
      stopListening();
      gradeSpoken(finalText, alts, sessQ);
    };
    r.onerror = (ev) => {
      const err = (ev && ev.error) || '';
      if (current()) {
        listening = false;
        const btn = $('#btn-mic');
        if (btn) btn.classList.remove('is-hot');
      }
      if (err === 'aborted') return;                 // 사용자가 멈춘 경우
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        graded = true;                               // 권한 오류 — 채점할 말이 없습니다
        toast('마이크 권한이 없어요. Chrome 앱에서 열거나 보기를 눌러보세요.', 'no');
        const hint = $('#mic-hint');
        if (hint) {
          hint.classList.remove('is-hidden');
          hint.textContent = '마이크를 열 수 없어요 — Chrome 앱에서 열거나 보기를 눌러보세요.';
        }
      } else if (err === 'no-speech') {
        toast('잘 안 들렸어요. 다시 말해볼까요?', 'no');
      } else if (err === 'network') {
        toast('인터넷 연결이 잠깐 끊겼어요. 다시 말해볼까요?', 'no');
      } else {
        toast('다시 한 번 말해볼까요?', 'no');
      }
    };
    r.onend = () => {
      const wasCurrent = current();
      if (wasCurrent) {
        listening = false;
        recog = null;
        const btn = $('#btn-mic');
        if (btn) btn.classList.remove('is-hot');
      }
      if (!wasCurrent || !sameQuestion()) return;    // 늦게 온 옛 인식기의 종료는 무시
      /* ③ isFinal 없이 끝났는데 마지막으로 들린 말이 남아 있으면 그것으로 채점 */
      if (!graded && !state.locked && lastSpoken) {
        graded = true;
        gradeSpoken(lastSpoken, [], sessQ);
        return;
      }
      const el = $('#q-ko');
      if (el && String(el.textContent).indexOf('🗣') !== 0) el.textContent = (sessQ && sessQ.ko) || '';
    };
    return r;
  }

  function startListening() {
    if (!SR) {
      toast('마이크 권한이 없어요. Chrome 앱에서 열거나 보기를 눌러보세요.', 'no');
      return;
    }
    if (listening) { stopListening(); return; }      // 한 번 더 누르면 끄기
    if (state.locked) return;
    /* 모바일 크롬은 한 번 쓴 인식기를 다시 start() 하면 조용히 먹통이 됩니다.
       이전 인식기는 접어 두고 매번 새로 만듭니다. */
    stopListening();
    cancelRead();
    const sessQ = currentQ();
    lastSpoken = '';
    graded = false;
    $('#q-ko').textContent = sessQ.ko || '';
    const r = initRecog(sessQ);
    if (!r) return;
    recog = r;
    /* start()는 클릭 핸들러 안에서 곧바로, 동기로 — 그래야 모바일에서 마이크가 열립니다. */
    try {
      r.start();
    } catch (e) {
      /* 이전 인식기가 아직 닫히는 중이면 한 번만 더 시도합니다 */
      recog = null;
      r.onstart = null; r.onresult = null; r.onerror = null; r.onend = null;
      try { r.abort(); } catch (e2) {}
      const r2 = initRecog(sessQ);
      recog = r2;
      lastSpoken = '';
      graded = false;
      try {
        r2.start();
      } catch (e3) {
        stopListening();
        toast('마이크를 열지 못했어요. 다시 눌러볼까요?', 'no');
      }
    }
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
      if ($('#screen-play').classList.contains('is-active')) { renderQuestion(); }
    }));
    $$('.mini-level').forEach((b) => b.addEventListener('click', () => {
      const lv = Number(b.dataset.level);
      if (lv === state.level) return;
      state.level = lv;
      store.set('pt.level', state.level);
      renderLevels();
      if (state.story) renderQuestion();
    }));

    $('#btn-random').addEventListener('click', () => {
      cancelRead();
      speak('Once upon a time!');
      startStory(randomStory(true));          // 첫 화면의 랜덤은 6명 중 누구든
    });
    $('#btn-hear').addEventListener('click', () => {
      if (!state.story) return;
      if (listening) stopListening();
      readQuestionAndOptions();     // 질문 + A·B·C 보기를 다시 읽어줍니다
    });
    $('#btn-mic').addEventListener('click', startListening);
    /* 💡 힌트 — 12살 모드에서만 보입니다. 정답 문장을 화면에 쓰지 않고 귀로 한 번 들려주고,
       방금 들린 문장을 아이가 영어로 말해 보게 합니다. */
    $('#btn-hint').addEventListener('click', () => {
      if (!state.story) return;
      if (state.locked) return;
      if (state.level !== 12) return;
      cancelRead();                    // 읽던 질문 낭독은 먼저 멈춥니다
      if (listening) stopListening();  // 마이크가 힌트 소리를 먹지 않게 먼저 멈춤
      const q = currentQ();
      const hb = $('#btn-hint');
      const started = speak(q.answer, {
        rate: 0.85,
        onend: () => { if (hb) hb.classList.remove('is-playing'); }
      });
      if (started && hb) hb.classList.add('is-playing');
      toast('힌트! 방금 들린 문장을 영어로 말해 보세요 💡', '');
    });
    $('#btn-quit').addEventListener('click', () => {
      cancelRead();
      if (listening) stopListening();
      show('screen-home');
      renderHome();
    });
    $('#btn-again').addEventListener('click', () => {
      startStory(buildStory(state.story.princess, null, '다시 읽기'));
    });
    $('#btn-new').addEventListener('click', () => startStory(randomStory()));
    $('#btn-home').addEventListener('click', () => {
      cancelRead();
      if (listening) stopListening();
      show('screen-home');
      renderHome();
    });

    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelRead(); });
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
