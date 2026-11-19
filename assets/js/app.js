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
     (4살 0.68 / 6살 0.75 / 8살 0.82 유지) 보기 낭독은 조금 더 느리게. */
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
    state.opts.forEach((label, i) => {
      parts.push({ text: String.fromCharCode(65 + i) + '. ' + label, rate: optionRate(), gap: 480 });
    });
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
  /* localStorage에 '아직 안 푼 문항' 목록을 두고, 한 판에 10문제씩 꺼냅니다.
     선택한 공주의 미출제 문항을 먼저 채우고, 모자라면 다른 공주 문항으로 10문제를 맞춥니다.
     50문항을 다 풀면 목록이 처음으로 돌아가 다시 순환합니다. */
  function loadPool() {
    const ids = allIds();
    const known = {};
    ids.forEach((id) => { known[id] = true; });
    let pool = store.get('pt.pool', null);
    if (!Array.isArray(pool)) pool = ids.slice();
    const seen = {};
    pool = pool.filter((id) => known[id] && !seen[id] && (seen[id] = true));
    return pool;
  }
  function savePool(pool) { store.set('pt.pool', pool); }

  function pickRound(princess, rand) {
    const rnd = rand || Math.random;
    const pool = loadPool();
    const taken = [];
    const used = {};
    const push = (id) => {
      if (taken.length >= ROUND_SIZE || used[id] || !BY_ID[id]) return;
      used[id] = true;
      taken.push(id);
    };
    // 1) 고른 공주의 미출제 문항 먼저
    shuffleWith(pool.filter((id) => BY_ID[id].princess.id === princess.id), rnd).forEach(push);
    // 2) 모자라면 다른 공주의 미출제 문항으로 채움
    shuffleWith(pool, rnd).forEach(push);
    // 3) 풀에 남은 문항이 10개보다 적으면 풀을 새로 채워 10문제를 꼭 맞춤
    let source = pool;
    if (taken.length < ROUND_SIZE) {
      source = allIds();
      shuffleWith(source, rnd).forEach(push);
    }
    const next = source.filter((id) => !used[id]);
    savePool(next.length ? next : allIds());
    return shuffleWith(taken, rnd).map((id) => BY_ID[id]);
  }

  function buildStory(princess, rand, label) {
    return { princess: princess, items: pickRound(princess, rand), label: label || '' };
  }
  /* 오늘의 공주는 날짜로 정해집니다 (홈 화면에서는 문항을 꺼내지 않습니다). */
  function todaysPrincess() {
    const seed = hashStr('princess-talk-' + dayKey());
    return PRINCESSES[Math.floor(rng(seed)() * PRINCESSES.length)];
  }
  function todaysStory() {
    const seed = hashStr('princess-talk-' + dayKey());
    return buildStory(todaysPrincess(), rng(seed), '오늘의 이야기');
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
  function renderPoolInfo() {
    const el = $('#pool-info');
    if (!el) return;
    const left = loadPool().length;
    el.textContent = '이야기 ' + ALL.length + '문항 · 한 판 ' + ROUND_SIZE + '문제 · 아직 안 푼 문항 ' + left + '개';
  }
  function renderHome() {
    const princess = todaysPrincess();
    $('#today-img').src = princess.items[0].img;
    $('#today-img').alt = princess.nameKo + ' ' + princess.name;
    $('#today-title').textContent = princess.nameKo + ' · ' + princess.title;
    $('#today-sub').textContent = princess.name + ' — ' + princess.titleKo;
    renderLevels();
    renderStickers();
    renderPoolInfo();
  }

  /* ------------------------------ play ------------------------------ */
  function preload(story) {
    story.items.forEach((it) => { const im = new Image(); im.src = it.img; });
  }
  function roundTitle(story) {
    const ids = [];
    story.items.forEach((it) => { if (ids.indexOf(it.princess.id) === -1) ids.push(it.princess.id); });
    if (ids.length <= 1) return story.princess.nameKo + ' · ' + story.princess.title;
    return story.princess.nameKo + '와 친구들 · ' + ROUND_SIZE + '문제';
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
  function currentQ() { return currentItem().q[state.level]; }

  function renderQuestion() {
    const item = currentItem();
    const q = currentQ();
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

    $('#mic-hint').classList.remove('is-hidden');
    $('#mic-hint').textContent = SR
      ? '보기를 한 번 누르면 들려주고, 한 번 더 누르면 정답이에요. 🎤 로 말해도 좋아요!'
      : '보기를 한 번 누르면 들려주고, 한 번 더 누르면 정답이에요.';
    const micBtn = $('#btn-mic');
    micBtn.style.display = SR ? '' : 'none';

    // 질문을 읽고, 잠깐 쉬었다가 A·B·C 보기를 차례로 읽어줍니다.
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
    if (listening && recog) { try { recog.stop(); } catch (e) {} }   // 마이크가 소리를 먹지 않게 먼저 멈춤
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
        cancelRead();
        const target = $$('#options .opt').find((b) => sameAnswer(b.dataset.value, q.answer));
        win(target || null);
      } else if (!state.locked) {
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
      }
    };
    r.onerror = (ev) => {
      listening = false;
      $('#btn-mic').classList.remove('is-hot');
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
        toast('마이크를 쓸 수 없어요. 보기를 눌러보세요.', 'no');
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
    cancelRead();
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

    $('#btn-today').addEventListener('click', () => {
      cancelRead();
      speak('Let us start!');
      startStory(todaysStory());
    });
    $('#btn-random').addEventListener('click', () => {
      cancelRead();
      speak('Once upon a time!');
      startStory(randomStory());
    });
    $('#btn-hear').addEventListener('click', () => {
      if (!state.story) return;
      if (listening && recog) { try { recog.stop(); } catch (e) {} }
      readQuestionAndOptions();     // 질문 + A·B·C 보기를 다시 읽어줍니다
    });
    $('#today-card').addEventListener('click', () => $('#btn-today').click());
    $('#btn-mic').addEventListener('click', startListening);
    $('#btn-quit').addEventListener('click', () => {
      cancelRead();
      if (recog && listening) { try { recog.stop(); } catch (e) {} }
      show('screen-home');
      renderHome();
    });
    $('#btn-again').addEventListener('click', () => {
      startStory(buildStory(state.story.princess, null, '다시 읽기'));
    });
    $('#btn-new').addEventListener('click', () => startStory(randomStory()));

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
