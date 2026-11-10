const {test}=require('node:test');
const assert=require('node:assert/strict');
const Study=require('../public/core');
const data=require('../public/data/dictionary.json');
test('vowels and K select kaku and kiku but exclude unlearned rows',()=>{
 const words=data.filter(x=>x.category==='kana-words'&&Study.matchesGroups(x,['vowels','k']));
 assert.ok(words.some(x=>x.romaji==='kaku'&&x.japanese==='かく'));
 assert.ok(words.some(x=>x.romaji==='kiku'&&x.japanese==='きく'));
 assert.ok(!words.some(x=>x.romaji==='sushi'||x.romaji==='neko'));
 assert.ok(words.every(x=>/^[あいうえおかきくけこ]+$/.test(x.reading)));
});
test('vowels alone, empty selection, and all groups behave distinctly',()=>{
 assert.ok(Study.matchesGroups({reading:'あう'},['vowels']));
 assert.ok(!Study.matchesGroups({reading:'かう'},['vowels']));
 assert.ok(!Study.matchesGroups({reading:'あ'},[]));
 assert.ok(Study.matchesGroups({reading:'がっこう'},null));
});
test('katakana uses the equivalent rows, with explicit special sounds',()=>{
 assert.ok(Study.matchesGroups({reading:'カキクケコ'},['k']));
 assert.ok(!Study.matchesGroups({reading:'ガ'},['k']));
 assert.ok(Study.matchesGroups({reading:'ガ'},['g']));
 assert.ok(!Study.matchesGroups({reading:'きゃ'},['k','y']));
 assert.ok(Study.matchesGroups({reading:'きゃ'},['k','small']));
 assert.ok(!Study.matchesGroups({reading:'がっこう'},['g','k','vowels']));
 assert.ok(Study.matchesGroups({reading:'がっこう'},['g','k','vowels','double']));
 assert.ok(!Study.matchesGroups({reading:'コーヒー'},['k','h']));
 assert.ok(Study.matchesGroups({reading:'コーヒー'},['k','h','long']));
 assert.ok(!Study.matchesGroups({reading:'かん'},['k','n']));
 assert.ok(Study.matchesGroups({reading:'かん'},['k','nn']));
});
test('all kana cards map to a selectable group and all word IDs are stable',()=>{
 for(const item of data.filter(x=>['hiragana','katakana','kana-words'].includes(x.category)))assert.ok(Study.matchesGroups(item,Object.keys(Study.groups)),item.id);
 const words=data.filter(x=>x.category==='kana-words');
 assert.equal(new Set(words.map(x=>x.reading)).size,words.length);
 assert.ok(words.every(x=>x.id==='kana-word-'+x.reading));
});
