const fs = require('node:fs');
let source = fs.readFileSync('public/app.js','utf8');
source = source.replace("sentences:'Kalimat'", "sentences:'Kalimat',grammar:'Contoh tata bahasa'");
source = source.replace("const inSelection=x=>!groupApplicable()||Study.matchesGroups(x,selectedGroups);", `// Word-script and kana-group filters are shared by quizzes, cards, and dictionary.
let wordScript = 'all';
try { wordScript = localStorage.getItem('kotoba-word-script') || 'all'; } catch {}
const inSelection = item => {
  const scriptMatches = category !== 'kana-words' || Study.matchesScript(item, wordScript);
  return scriptMatches && (!groupApplicable() || Study.matchesGroups(item, selectedGroups));
};
function scriptControls() {
  if (category !== 'kana-words') return '';
  return '<label class="control-label">Tulisan kata<select id="word-script">' +
    Object.entries({all:'Campuran hiragana & katakana',hiragana:'Kata hiragana',katakana:'Kata katakana'})
      .map(([key,label]) => '<option value="'+key+'" '+(wordScript===key?'selected':'')+'>'+label+'</option>').join('') + '</select></label>';
}
function scriptName() {
  if (category === 'hiragana' || (category === 'kana-words' && wordScript === 'hiragana')) return 'Hiragana';
  if (category === 'katakana' || (category === 'kana-words' && wordScript === 'katakana')) return 'Katakana';
  return 'Jepang';
}`);
source = source.replace("${category==='kana-words'?'Jawaban Jepang untuk materi ini selalu ditulis dalam kana.'", "${category==='kana-words'?'Kata ditampilkan sesuai pilihan tulisan di atas. Pilih Katakana lalu arah Katakana → Romaji untuk melatih bacaannya.'");
source = source.replace("${withDirection?`<select", "${scriptControls()}${withDirection?`<select");
source = source.replace('>Romaji → Jepang</option>', '>Romaji → ${scriptName()}</option>');
source = source.replace('>Jepang → Romaji</option>', '>${scriptName()} → Romaji</option>');
source = source.replace('>Jepang → Indonesia</option>', '>${scriptName()} → Indonesia</option>');
source = source.replace('function bindControls(cb){bindGroups(cb);', `function bindControls(cb){bindGroups(cb);
  if ($('#word-script')) $('#word-script').onchange = event => {
    wordScript = event.target.value;
    try { localStorage.setItem('kotoba-word-script', wordScript); } catch {}
    cb();
  };`);
source = source.replace("else if(page==='library')library();else progress();", "else if(page==='library')library();else if(page==='grammar')renderGrammar();else progress();");
source = source.replace("fetch('/data/dictionary.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{data=d;render();})", `// Load the editable learning data through Express routes.
Promise.all(['/api/dictionary', '/api/grammar'].map(async url => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Gagal memuat data');
  return response.json();
})).then(([dictionary, lessons]) => {
  grammarLessons = lessons;
  data = dictionary.concat(lessons.map(lesson => ({
    id: lesson.id, category: 'grammar', japanese: lesson.japanese,
    reading: lesson.reading, romaji: lesson.romaji, meaning: lesson.meaning,
  })));
  render();
})`);
fs.writeFileSync('public/app.js',source);
let html=fs.readFileSync('public/index.html','utf8');
html=html.replace('<button data-page="progress">','<button data-page="grammar">文 Partikel & kalimat</button><button data-page="progress">');
html=html.replace('<script src="/app.js"></script>','<script src="/grammar.js"></script><script src="/app.js"></script>');
fs.writeFileSync('public/index.html',html);
