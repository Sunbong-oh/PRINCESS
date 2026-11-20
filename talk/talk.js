/* Princess Talk — 일상 영어회화 game logic (vanilla JS, no build step)

   흐름: 공주가 예시 문장(ex)을 먼저 말하고 → 0.6초 쉬고 → 질문(q)을 던집니다.
   아이는 보기를 고르지 않고 자기 이야기를 영어로 말합니다.
   · ⭕ 맞았어요 : 언제 눌러도 칭찬 + 스티커 + 다음 문제 (마이크가 안 잡혀도 진행)
   · 💡 대답 예시 : 따라 말해 볼 수 있는 모범 대답(hint)을 화면에 보여주고 읽어 줍니다
   · 🎤 말해보기 : 말이 들려 주제에 맞는 표현이 잡히면 자동 통과
*/
(function () {
  'use strict';

  /* ------------------------------ helpers ------------------------------ */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function dayKey(d) {
    d = d || new Date();
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function normalize(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[.,!?;:"'“”‘’()]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  const PRAISES = ['Wonderful!', 'Great job!', 'You did it!', 'Lovely!', 'Amazing!', 'So good!'];
  const STICKERS = ['👑', '⭐', '💎', '🌸', '🦋', '🌟', '🎀', '🍓', '🍰', '🌈'];
  const LEVEL_RATE = { 4: 0.68, 6: 0.75, 8: 0.82, 12: 0.90 };

  const state = {
    level: 6,
    screen: 'home',
    round: [],
    index: 0,
    stickers: [],
    locked: false,
    hintOpen: false
  };

  function currentQ() {
    const cur = state.round[state.index];
    if (!cur) return null;
    return cur.item.lv[state.level] || cur.item.lv[6] || cur.item.lv[8];
  }
  function currentRound() { return state.round[state.index] || null; }
  function currentRate() { return LEVEL_RATE[state.level] || LEVEL_RATE[6]; }
  function topicOf(id) { return TALK_TOPICS.filter((t) => t.id === id)[0] || { ko: id, emoji: '💬', keys: [] }; }

  /* ------------------------------ speech ------------------------------ */
  const synth = window.speechSynthesis;
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
  let speakSeq = 0;
  function stopSpeak() {
    speakSeq += 1;
    if (synth) { try { synth.cancel(); } catch (e) {} }
    clearTimeout(speakTimer);
    $$('.is-playing').forEach((el) => el.classList.remove('is-playing'));
    $$('.is-speaking').forEach((el) => el.classList.remove('is-speaking'));
  }
  function speak(text, opts) {
    if (!synth || !text) return false;
    opts = opts || {};
    const my = ++speakSeq;
    try {
      clearTimeout(speakTimer);
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      if (voice) u.voice = voice;
      u.rate = opts.rate || currentRate();
      u.pitch = opts.pitch || 1.08;
      u.volume = 1;
      const done = () => { if (my === speakSeq && opts.onend) opts.onend(); };
      u.onend = done;
      u.onerror = done;
      /* some browsers drop the first utterance right after load */
      speakTimer = setTimeout(() => {
        if (my !== speakSeq) return;
        try { synth.speak(u); } catch (e) { done(); }
      }, 60);
      return true;
    } catch (e) { return false; }
  }

  /* 예시 → 0.6초 쉼 → 질문 */
  const GAP_MS = 600;
  let readSeq = 0;
  let gapTimer = null;
  function cancelRead() {
    readSeq += 1;
    clearTimeout(gapTimer);
    gapTimer = null;
    stopSpeak();
  }
  function readQuestion() {
    const q = currentQ();
    if (!q) return;
    readSeq += 1;
    const my = readSeq;
    stopSpeak();
    const exEl = $('#ex-bubble');
    const qEl = $('#q-text');
    if (exEl) exEl.classList.add('is-speaking');
    if (qEl) qEl.classList.remove('is-speaking');
    const onExEnd = () => {
      if (my !== readSeq) return;
      if (exEl) exEl.classList.remove('is-speaking');
      gapTimer = setTimeout(() => {
        if (my !== readSeq) return;
        if (qEl) qEl.classList.add('is-speaking');
        speak(q.q, {
          rate: currentRate(),
          onend: () => { if (my === readSeq && qEl) qEl.classList.remove('is-speaking'); }
        });
      }, GAP_MS);
    };
    if (!speak(q.ex, { rate: currentRate(), onend: onExEnd })) onExEnd();
  }

  /* ------------------------------ 한 판 고르기 ------------------------------ */
  function imgFor(princess, item) {
    const imgs = princess.imgs && princess.imgs.length ? princess.imgs : ['../assets/img/hero-sw.webp'];
    const h = hashStr(dayKey() + '|' + princess.id + '|' + item.id);
    return imgs[h % imgs.length];
  }

  /* 7가지 주제가 한 판에 골고루 들어가고, 아직 안 푼 문항이 먼저 나옵니다.
     (pt.talk.seen 에 푼 문항을 차례로 쌓아 두고, 다 풀면 가장 오래된 것부터 다시 씁니다.) */
  function pickRound() {
    const seen = (store.get('pt.talk.seen', []) || []).filter((x) => typeof x === 'string');
    const seenAt = (id) => seen.indexOf(id);
    const picked = [];

    shuffle(TALK_TOPICS.map((t) => t.id)).forEach((tid) => {
      const list = TALK_ITEMS.filter((i) => i.topic === tid);
      const fresh = shuffle(list.filter((i) => seenAt(i.id) < 0));
      const old = list.filter((i) => seenAt(i.id) >= 0).sort((a, b) => seenAt(a.id) - seenAt(b.id));
      const order = fresh.concat(old);
      if (order.length) picked.push(order[0]);
    });

    const rest = TALK_ITEMS.filter((i) => picked.indexOf(i) < 0);
    const fill = shuffle(rest.filter((i) => seenAt(i.id) < 0))
      .concat(rest.filter((i) => seenAt(i.id) >= 0).sort((a, b) => seenAt(a.id) - seenAt(b.id)));
    while (picked.length < 10 && fill.length) picked.push(fill.shift());

    const ordered = shuffle(picked);
    const princesses = shuffle(TALK_PRINCESSES.slice());
    const round = ordered.map((item, i) => {
      const princess = princesses[i % princesses.length];
      return { item: item, princess: princess, img: imgFor(princess, item) };
    });

    const next = seen.concat(round.map((r) => r.item.id));
    store.set('pt.talk.seen', next.slice(-240));
    return round;
  }

  /* ------------------------------ 화면 ------------------------------ */
  function show(id) {
    state.screen = id;
    $$('.screen').forEach((s) => s.classList.toggle('is-active', s.id === 'screen-' + id));
  }

  function renderStickers() {
    const list = $('#home-sticker-list');
    if (!list) return;
    list.textContent = '';
    if (!state.stickers.length) {
      const e = document.createElement('span');
      e.className = 'st-none';
      e.textContent = '아직 없어요 — 말하면 하나씩 모여요';
      list.appendChild(e);
      return;
    }
    state.stickers.slice(-10).forEach((s) => {
      const e = document.createElement('span');
      e.className = 'st';
      e.textContent = s;
      list.appendChild(e);
    });
  }

  function renderTopicChips() {
    const box = $('#topic-chips');
    if (!box) return;
    box.textContent = '';
    TALK_TOPICS.forEach((t) => {
      const e = document.createElement('span');
      e.className = 'topic-chip';
      e.textContent = t.emoji + ' ' + t.ko;
      box.appendChild(e);
    });
  }

  function renderLevels() {
    $$('.level-btn').forEach((b) => b.classList.toggle('is-on', Number(b.dataset.level) === state.level));
    $$('.mini-level').forEach((b) => b.classList.toggle('is-on', Number(b.dataset.level) === state.level));
  }

  function renderPoolInfo() {
    const el = $('#pool-info');
    if (el) el.textContent = '7가지 주제 · ' + TALK_ITEMS.length + '문항 · 하루 10문제 · ' + state.level + '살';
  }

  function renderHome() {
    renderTopicChips();
    renderLevels();
    renderPoolInfo();
    renderStickers();
  }

  function renderProgress() {
    $$('#progress span').forEach((s, i) => {
      s.classList.toggle('is-done', i < state.index);
      s.classList.toggle('is-now', i === state.index);
    });
    const t = $('#play-title');
    const cur = currentRound();
    if (t && cur) {
      const tp = topicOf(cur.item.topic);
      t.textContent = (state.index + 1) + '/10 · ' + tp.emoji + ' ' + tp.ko;
    }
  }

  function renderQuestion() {
    const cur = currentRound();
    const q = currentQ();
    if (!cur || !q) return;
    state.locked = false;
    state.hintOpen = false;

    const img = $('#talk-img');
    if (img) { img.src = cur.img; img.alt = cur.princess.ko; }
    const tag = $('#princess-tag');
    if (tag) tag.textContent = cur.princess.ko;
    const ex = $('#ex-text');
    if (ex) ex.textContent = '“' + q.ex + '”';
    const qEl = $('#q-text');
    if (qEl) qEl.textContent = q.q;
    const ko = $('#q-ko');
    if (ko) ko.textContent = q.ko;

    const hint = $('#hint-card');
    if (hint) hint.classList.add('is-hidden');
    const hintText = $('#hint-text');
    if (hintText) hintText.textContent = q.hint;
    const hintBtn = $('#btn-hint');
    if (hintBtn) hintBtn.classList.remove('is-on');

    renderProgress();
    renderLevels();
    readQuestion();
    warm();
  }

  /* 첫 소리를 조금 미리 데워 둡니다(모바일에서 첫 발화가 사라지는 경우 방지) */
  function warm() {
    if (!synth) return;
    try { if (!synth.speaking) synth.resume(); } catch (e) {}
  }

  /* ------------------------------ 칭찬·다음 ------------------------------ */
  let advanceTimer = null;
  function addSticker() {
    const st = STICKERS[Math.floor(Math.random() * STICKERS.length)];
    state.stickers = state.stickers.concat([st]).slice(-40);
    store.set('pt.talk.stickers', state.stickers);
    return st;
  }

  function toast(msg, kind) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast is-on' + (kind ? ' is-' + kind : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.className = 'toast'; }, 2200);
  }

  function win() {
    if (state.locked) return false;
    state.locked = true;
    stopListening();
    cancelRead();
    const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
    speak(praise, { rate: 0.95, pitch: 1.16 });
    const st = addSticker();
    toast(praise + ' ' + st, 'ok');
    confetti(28);
    const passBtn = $('#btn-pass');
    if (passBtn) passBtn.classList.add('is-win');
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(() => {
      if (passBtn) passBtn.classList.remove('is-win');
      next();
    }, 1150);
    return true;
  }

  function next() {
    if (state.index >= state.round.length - 1) { finish(); return; }
    state.index += 1;
    renderQuestion();
  }

  function finish() {
    cancelRead();
    stopListening();
    const stars = $('#result-stars');
    if (stars) {
      stars.textContent = '';
      for (let i = 0; i < state.round.length; i++) {
        const s = document.createElement('span');
        s.textContent = '⭐';
        s.style.animationDelay = (i * 60) + 'ms';
        stars.appendChild(s);
      }
    }
    const sub = $('#result-sub');
    if (sub) sub.textContent = state.round.length + '문제를 모두 영어로 이야기했어요!';
    const st = $('#result-stickers');
    if (st) {
      st.textContent = '';
      state.stickers.slice(-10).forEach((x) => {
        const e = document.createElement('span');
        e.textContent = x;
        st.appendChild(e);
      });
    }
    const last = state.round[state.round.length - 1];
    const rimg = $('#result-img');
    if (rimg && last) { rimg.src = last.img; rimg.alt = last.princess.ko; }
    confetti(60);
    speak('Wonderful! You did it!', { rate: 0.95, pitch: 1.12 });
    show('result');
  }

  function startRound(fresh) {
    if (fresh || !state.round.length) state.round = pickRound();
    state.index = 0;
    state.locked = false;
    show('play');
    renderQuestion();
  }

  function goHome() {
    cancelRead();
    stopListening();
    clearTimeout(advanceTimer);
    state.round = [];
    state.index = 0;
    show('home');
    renderHome();
  }

  /* ------------------------------ 마이크 ------------------------------ */
  /* 정답이 하나로 정해지지 않는 대화라, 들린 말에 그 주제의 핵심 표현이 있으면 통과시킵니다.
     (예: 좋아하는 것 → "I like ...", How many → 숫자, Where → in/at/near ...)
     잘 안 잡히거나 엉뚱하게 잡혀도 ⭕ 맞았어요로 언제든 넘어갈 수 있습니다. */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const LISTEN_MS = 8000;
  const SILENCE_MS = 1600;
  let recog = null;
  let listening = false;
  let sessRound = null;
  let sessText = '';
  let sessAlts = [];
  let listenTimer = null;
  let silenceTimer = null;
  let graded = false;

  function clearListenTimers() { clearTimeout(listenTimer); clearTimeout(silenceTimer); listenTimer = null; silenceTimer = null; }

  function saidTopic(text, round) {
    const cur = round || currentRound();
    if (!cur) return false;
    const words = normalize(text).split(' ').filter(Boolean);
    if (!words.length) return false;
    const keys = topicOf(cur.item.topic).keys || [];
    const keyHit = keys.some((k) => {
      if (k.indexOf(' ') >= 0) return normalize(text).indexOf(k) >= 0;
      return words.some((w) => w === k || (k.length >= 3 && w.indexOf(k) === 0));
    });
    if (keyHit) return true;
    /* 핵심 표현이 아니어도, 두 단어 이상 또박또박 말했으면 말한 것으로 봅니다. */
    return words.length >= 2;
  }

  function stopListening() {
    const r = recog;
    recog = null;
    listening = false;
    graded = true;
    clearListenTimers();
    const btn = $('#btn-mic');
    if (btn) btn.classList.remove('is-hot');
    if (!r) return;
    r.onstart = null;
    r.onresult = null;
    r.onerror = null;
    r.onend = null;
    try { r.abort(); } catch (e) { try { r.stop(); } catch (e2) {} }
  }

  function finishListening(sessQ) {
    if (graded) return;
    graded = true;
    clearListenTimers();
    const text = (sessText || '').trim();
    const alts = sessAlts.slice();
    stopListening();
    if (!sessQ || sessQ !== currentQ() || state.locked) return;
    if (!text && !alts.length) {
      toast('잘 안 들렸어요. 🎤를 누르고 크게 말해볼까요?', 'no');
      return;
    }
    const all = [text].concat(alts).filter(Boolean);
    const ko = $('#q-ko');
    if (ko) ko.textContent = '🗣 ' + (text || all[0]);
    if (all.some((t) => saidTopic(t, sessRound))) { win(); return; }
    toast('잘 들었어요! 이어서 말하거나 ⭕ 맞았어요를 눌러 주세요.', 'no');
  }

  function initRecog(sessQ) {
    if (!SR) return null;
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = true;
    r.maxAlternatives = 5;
    r.continuous = true;
    const current = () => recog === r;
    const sameQuestion = () => sessQ === currentQ();

    r.onstart = () => {
      if (!current()) return;
      listening = true;
      const btn = $('#btn-mic');
      if (btn) btn.classList.add('is-hot');
      toast('듣고 있어요… 영어로 말해보세요!', '');
      clearTimeout(listenTimer);
      listenTimer = setTimeout(() => { if (current()) finishListening(sessQ); }, LISTEN_MS);
    };
    r.onresult = (ev) => {
      if (!current() || !sameQuestion() || state.locked || graded) return;
      const results = (ev && ev.results) || [];
      const finals = [];
      let interim = '';
      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        if (!res) continue;
        const n = res.length || 0;
        for (let j = 0; j < n; j++) {
          const t = res[j] && res[j].transcript ? String(res[j].transcript).trim() : '';
          if (t && sessAlts.indexOf(t) === -1) sessAlts.push(t);
        }
        const t0 = res[0] && res[0].transcript ? String(res[0].transcript).trim() : '';
        if (!t0) continue;
        if (res.isFinal) { if (finals.indexOf(t0) === -1) finals.push(t0); }
        else interim = t0;
      }
      if (finals.length) sessText = finals.join(' ');
      const shown = (sessText + ' ' + interim).trim();
      if (shown) {
        const ko = $('#q-ko');
        if (ko) ko.textContent = '🗣 ' + shown;
      }
      const cands = [shown, sessText, interim].concat(sessAlts).filter(Boolean);
      if (cands.some((t) => saidTopic(t, sessRound))) {
        graded = true;
        clearListenTimers();
        stopListening();
        win();
        return;
      }
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => { if (current()) finishListening(sessQ); }, SILENCE_MS);
    };
    r.onerror = (ev) => {
      const err = (ev && ev.error) || '';
      if (err === 'aborted') return;
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        graded = true;
        clearListenTimers();
        listening = false;
        const btn = $('#btn-mic');
        if (btn) btn.classList.remove('is-hot');
        toast('마이크 권한이 없어요. Chrome 앱에서 열거나 ⭕ 맞았어요를 눌러 주세요.', 'no');
        const hint = $('#mic-hint');
        if (hint) hint.textContent = '마이크를 열 수 없어요 — ⭕ 맞았어요로 계속할 수 있어요.';
      } else if (err === 'network') {
        toast('인터넷 연결이 잠깐 끊겼어요. ⭕ 맞았어요로 계속할 수 있어요.', 'no');
      }
    };
    r.onend = () => {
      if (!current()) return;
      if (!graded && sameQuestion()) { finishListening(sessQ); return; }
      listening = false;
      recog = null;
      const btn = $('#btn-mic');
      if (btn) btn.classList.remove('is-hot');
    };
    return r;
  }

  function startListening() {
    if (!SR) {
      toast('이 브라우저에서는 마이크를 쓸 수 없어요. ⭕ 맞았어요를 눌러 주세요.', 'no');
      return;
    }
    if (listening) { stopListening(); return; }
    if (state.locked) return;
    stopListening();
    cancelRead();
    const sessQ = currentQ();
    sessRound = currentRound();
    sessText = '';
    sessAlts = [];
    clearListenTimers();
    graded = false;
    const ko = $('#q-ko');
    if (ko) ko.textContent = sessQ ? sessQ.ko : '';
    const r = initRecog(sessQ);
    if (!r) return;
    recog = r;
    try {
      r.start();
    } catch (e) {
      recog = null;
      r.onstart = null; r.onresult = null; r.onerror = null; r.onend = null;
      try { r.abort(); } catch (e2) {}
      const r2 = initRecog(sessQ);
      recog = r2;
      sessText = '';
      sessAlts = [];
      graded = false;
      try { r2.start(); } catch (e3) {
        stopListening();
        toast('마이크를 열지 못했어요. ⭕ 맞았어요로 계속할 수 있어요.', 'no');
      }
    }
  }

  /* ------------------------------ confetti ------------------------------ */
  const canvas = $('#fx');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  let particles = [];
  const COLORS = ['#ff8fc4', '#ffd166', '#8d68ff', '#63d2ff', '#7ef0b0', '#ffb3d9', '#fff1a8'];
  function sizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    if (ctx.setTransform) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function confetti(n) {
    if (!ctx) return;
    for (let i = 0; i < n; i++) {
      particles.push({
        x: window.innerWidth * (0.2 + Math.random() * 0.6),
        y: window.innerHeight * (0.32 + Math.random() * 0.12),
        vx: (Math.random() - 0.5) * 5,
        vy: -Math.random() * 7 - 2,
        g: 0.18 + Math.random() * 0.1,
        r: 3 + Math.random() * 5,
        a: Math.random() * Math.PI,
        va: (Math.random() - 0.5) * 0.3,
        c: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
    if (!confetti._running) { confetti._running = true; tick(); }
  }
  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.a += p.va; p.vx *= 0.995;
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.7);
      ctx.restore();
    });
    particles = particles.filter((p) => p.y < window.innerHeight + 40);
    if (particles.length) requestAnimationFrame(tick);
    else { ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); confetti._running = false; }
  }

  /* ------------------------------ bind ------------------------------ */
  function setLevel(lv) {
    lv = Number(lv);
    if (TALK_LEVELS.indexOf(lv) < 0) return;
    state.level = lv;
    store.set('pt.talk.level', lv);
    renderLevels();
    renderPoolInfo();
    if (state.screen === 'play') renderQuestion();
  }

  function bind() {
    $$('.level-btn').forEach((b) => b.addEventListener('click', () => setLevel(b.dataset.level)));
    $$('.mini-level').forEach((b) => b.addEventListener('click', () => setLevel(b.dataset.level)));

    const start = $('#btn-start');
    if (start) start.addEventListener('click', () => startRound(true));

    const quit = $('#btn-quit');
    if (quit) quit.addEventListener('click', goHome);

    const hear = $('#btn-hear');
    if (hear) hear.addEventListener('click', () => { readQuestion(); });

    const hint = $('#btn-hint');
    if (hint) hint.addEventListener('click', () => {
      const q = currentQ();
      if (!q) return;
      state.hintOpen = !state.hintOpen;
      const card = $('#hint-card');
      if (card) card.classList.toggle('is-hidden', !state.hintOpen);
      hint.classList.toggle('is-on', state.hintOpen);
      if (state.hintOpen) {
        const t = $('#hint-text');
        if (t) t.textContent = q.hint;
        cancelRead();
        speak(q.hint, { rate: Math.max(0.6, currentRate() - 0.03) });
      }
    });

    const mic = $('#btn-mic');
    if (mic) mic.addEventListener('click', startListening);

    const pass = $('#btn-pass');
    if (pass) pass.addEventListener('click', () => { if (!state.locked) win(); });

    const again = $('#btn-again');
    if (again) again.addEventListener('click', () => startRound(false));
    const anew = $('#btn-new');
    if (anew) anew.addEventListener('click', () => startRound(true));
    const home = $('#btn-home');
    if (home) home.addEventListener('click', goHome);

    window.addEventListener('resize', sizeCanvas);
  }

  function boot() {
    state.level = Number(store.get('pt.talk.level', 6)) || 6;
    if (TALK_LEVELS.indexOf(state.level) < 0) state.level = 6;
    state.stickers = (store.get('pt.talk.stickers', []) || []).filter((x) => typeof x === 'string').slice(-40);
    sizeCanvas();
    bind();
    renderHome();
    show('home');
    /* iOS/Android: 첫 터치에서 음성 잠금 해제 */
    document.addEventListener('touchstart', warm, { once: true });
  }

  window.__tt = {
    state: state,
    pickRound: pickRound,
    currentQ: currentQ,
    currentRound: currentRound,
    saidTopic: saidTopic,
    startRound: startRound,
    next: next,
    win: win,
    finish: finish,
    goHome: goHome,
    setLevel: setLevel,
    readQuestion: readQuestion,
    imgFor: imgFor,
    normalize: normalize,
    topicOf: topicOf,
    LEVEL_RATE: LEVEL_RATE
  };

  boot();
})();
