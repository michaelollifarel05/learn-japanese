// The grammar screen: lessons, missing-particle practice, and a sentence builder.
// These functions use the shared data, escaping, and progress helpers in app.js.
let grammarLessons = [];
let selectedLessonId = 'grammar-wa';
let chosenTokens = [];
let tokenBank = [];
let gapAnswered = false;
let orderAnswered = false;

function grammarLesson() {
  return grammarLessons.find(lesson => lesson.id === selectedLessonId) || grammarLessons[0];
}

function recordGrammar(correct) {
  const lesson = grammarLesson();
  state.items[lesson.id] = Study.update(state.items[lesson.id], correct);
  state.days[day()] = (state.days[day()] || 0) + 1;
  save();
}

function renderGrammar() {
  const lesson = grammarLesson();
  if (!lesson) {
    app.innerHTML = '<h1>Pelajaran belum tersedia</h1>';
    return;
  }
  chosenTokens = [];
  gapAnswered = false;
  orderAnswered = false;
  // Shuffle indices, so identical chunks remain independently selectable.
  tokenBank = lesson.tokens.map((_, index) => index);
  for (let i = tokenBank.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tokenBank[i], tokenBank[j]] = [tokenBank[j], tokenBank[i]];
  }
  if (tokenBank.every((value,index) => value === index)) tokenBank.reverse();

  app.innerHTML = `
    <h1>Partikel & merangkai kalimat</h1>
    <p class="sub">Dari kata menjadi kalimat. Pahami polanya, lalu praktikkan sendiri.</p>
    <section class="panel">
      <h2>Mulai dari urutan sederhana</h2>
      <p>Bahasa Jepang biasanya menaruh kata kerja di akhir. Tentukan topik, tambahkan waktu atau tempat jika perlu, lalu objek dan kata kerja. Partikel ditempatkan <strong>setelah</strong> kata yang ditandainya.</p>
      <div class="pattern">私 は → 図書館 で → 本 を → 読みます</div>
      <p class="notice">watashi wa → toshokan de → hon o → yomimasu<br>Saya → di perpustakaan → buku → membaca.</p>
      <p class="notice">Topik sering dihilangkan jika sudah jelas. と dan も adalah partikel; そして dan でも dapat menghubungkan kalimat. Koleksi ini mengajarkan fondasi tata bahasa N5, bukan seluruh silabus.</p>
    </section>
    <div class="controls"><label class="control-label">Pilih pelajaran<select id="lesson-select">
      ${grammarLessons.map((item,index) => `<option value="${item.id}" ${lesson.id === item.id ? 'selected' : ''}>${index+1}. ${esc(item.title)}${state.items[item.id]?.attempts ? ' · sudah dilatih' : ''}</option>`).join('')}
    </select></label></div>
    <section class="panel">
      <span class="tag">PELAJARAN ${grammarLessons.indexOf(lesson)+1} / ${grammarLessons.length}</span>
      <h2>${esc(lesson.title)}</h2>
      <p>${esc(lesson.explanation)}</p>
      <div class="pattern">${esc(lesson.pattern)}</div>
      <h3>Contoh, bagian demi bagian</h3>
      <div class="sentence-parts">${lesson.tokens.map(token => `<span>${esc(token)}</span>`).join('')}<span>。</span></div>
      <p>${esc(lesson.reading)}<br><span class="muted">${esc(lesson.romaji)}</span><br>${esc(lesson.meaning)}</p>
      <button class="secondary" id="lesson-audio">♬ Dengarkan contoh</button>
    </section>
    <div class="two-col grammar-exercises">
      <section class="panel">
        <h2>1. Lengkapi kalimat</h2>
        <p class="notice">Isi bagian kosong sesuai pola ${esc(lesson.title)}. Jawaban kana/kanji atau romaji diterima. Beberapa kalimat memungkinkan pola lain; latihan ini meminta pola yang sedang dipelajari.</p>
        <p class="gap-sentence">${lesson.tokens.map((token,index) => index === lesson.gapIndex ? '<strong>［　？　］</strong>' : esc(token)).join('')}。</p>
        <form id="gap-form"><label for="gap-answer">Bagian yang hilang</label><input id="gap-answer" autocomplete="off" required placeholder="Misalnya: wa atau は"><div class="row"><button class="primary" id="gap-check">Periksa</button></div></form>
        <div class="feedback hidden" id="gap-feedback" role="status"></div>
      </section>
      <section class="panel">
        <h2>2. Susun kalimat</h2>
        <p>${esc(lesson.meaning)}</p>
        <p class="notice">Klik potongan sesuai urutan contoh yang dipelajari. Klik potongan di jawaban untuk mengembalikannya.</p>
        <div id="chosen-tokens" class="token-area" aria-label="Kalimat susunanmu"></div>
        <div id="token-bank" class="token-area" aria-label="Pilihan potongan kalimat"></div>
        <div class="row"><button class="primary" id="order-check">Periksa urutan</button><button class="secondary" id="order-reset">Ulangi</button></div>
        <div class="feedback hidden" id="order-feedback" role="status"></div>
      </section>
    </div>
    <div class="row"><button class="secondary" id="lesson-prev">← Sebelumnya</button><button class="primary" id="lesson-next">Pelajaran berikutnya →</button><button class="secondary" id="grammar-quiz">Latihan romaji contoh</button></div>
    <p class="notice">Jawaban latihan ini masuk ke progres harian dan kartu tata bahasa. Susun kalimat mengikuti contoh; aplikasi belum menilai semua kemungkinan kalimat bebas.</p>
    <p class="notice">Referensi belajar: <a href="https://www.irodori.jpf.go.jp/en/" target="_blank" rel="noreferrer">Irodori · The Japan Foundation</a> dan <a href="https://www.mlcjapanese.co.jp/img/file10.pdf" target="_blank" rel="noreferrer">MLC · Particles for beginners</a>. Penjelasan dan latihan Indonesia disusun untuk aplikasi ini.</p>`;

  $('#lesson-select').onchange = event => {
    selectedLessonId = event.target.value;
    renderGrammar();
  };
  $('#lesson-audio').onclick = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browser ini belum mendukung suara.');
      return;
    }
    speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(lesson.reading);
    speech.lang = 'ja-JP';
    speech.rate = .75;
    speechSynthesis.speak(speech);
  };
  $('#gap-form').onsubmit = event => {
    event.preventDefault();
    if (gapAnswered || !$('#gap-answer').value.trim()) return;
    gapAnswered = true;
    const correct = Study.checkGap($('#gap-answer').value, lesson);
    recordGrammar(correct);
    $('#gap-check').disabled = true;
    $('#gap-answer').readOnly = true;
    showGrammarFeedback('#gap-feedback', correct, `${lesson.answer} · ${lesson.answerRomaji}. ${lesson.explanation}`);
  };
  $('#order-check').onclick = () => {
    if (orderAnswered) return;
    if (chosenTokens.length !== lesson.tokens.length) {
      showGrammarFeedback('#order-feedback', false, 'Gunakan semua potongan dahulu.');
      return;
    }
    orderAnswered = true;
    const correct = Study.checkOrder(chosenTokens, lesson);
    recordGrammar(correct);
    $('#order-check').disabled = true;
    showGrammarFeedback('#order-feedback', correct, `Urutan contoh: ${lesson.japanese} · ${lesson.romaji}`);
    renderTokenBank();
  };
  $('#order-reset').onclick = () => {
    chosenTokens = [];
    orderAnswered = false;
    $('#order-check').disabled = false;
    $('#order-feedback').classList.add('hidden');
    renderTokenBank();
  };
  const lessonIndex = grammarLessons.indexOf(lesson);
  $('#lesson-prev').disabled = lessonIndex === 0;
  $('#lesson-next').disabled = lessonIndex === grammarLessons.length - 1;
  $('#lesson-prev').onclick = () => changeLesson(lessonIndex-1);
  $('#lesson-next').onclick = () => changeLesson(lessonIndex+1);
  $('#grammar-quiz').onclick = () => {
    category = 'grammar';
    direction = 'to-ro';
    review = false;
    go('quiz');
  };
  renderTokenBank();
}

function changeLesson(index) {
  if (!grammarLessons[index]) return;
  selectedLessonId = grammarLessons[index].id;
  renderGrammar();
}

function showGrammarFeedback(selector, correct, message) {
  const feedback = $(selector);
  feedback.className = 'feedback' + (correct ? '' : ' bad');
  feedback.innerHTML = `<strong>${correct ? 'Benar! 🌱' : 'Belum tepat.'}</strong><br>${esc(message)}`;
}

function renderTokenBank() {
  const lesson = grammarLesson();
  $('#chosen-tokens').innerHTML = chosenTokens.length
    ? chosenTokens.map((index,position) => `<button class="secondary" data-remove="${position}" ${orderAnswered?'disabled':''}>${esc(lesson.tokens[index])}</button>`).join('')
    : '<span class="notice">Kalimatmu akan muncul di sini…</span>';
  $('#token-bank').innerHTML = tokenBank.filter(index => !chosenTokens.includes(index)).map(index => `<button class="secondary" data-token="${index}" ${orderAnswered?'disabled':''}>${esc(lesson.tokens[index])}</button>`).join('');
  document.querySelectorAll('[data-token]').forEach(button => {
    button.onclick = () => {
      chosenTokens.push(Number(button.dataset.token));
      renderTokenBank();
    };
  });
  document.querySelectorAll('[data-remove]').forEach(button => {
    button.onclick = () => {
      chosenTokens.splice(Number(button.dataset.remove), 1);
      renderTokenBank();
    };
  });
}
