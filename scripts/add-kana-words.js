const fs=require('node:fs');
const path='public/data/dictionary.json';
let data=JSON.parse(fs.readFileSync(path,'utf8')).filter(x=>x.category!=='kana-words');
// Keep these IDs stable; they are progress keys.
const extra=`かく|kaku|menulis
きく|kiku|mendengar; bertanya
あう|au|bertemu
いう|iu|berkata
うえ|ue|atas
いえ|ie|rumah
あお|ao|biru
あか|aka|merah
あき|aki|musim gugur
いけ|ike|kolam
かお|kao|wajah
かき|kaki|kesemek
かく|kaku|menulis
き|ki|pohon
ここ|koko|di sini
こえ|koe|suara
いく|iku|pergi
おおきい|ookii|besar
さく|saku|mekar
すき|suki|suka
すし|sushi|sushi
あさ|asa|pagi
そこ|soko|di situ
たかい|takai|tinggi; mahal
くち|kuchi|mulut
つくえ|tsukue|meja
ちかい|chikai|dekat
なか|naka|dalam; tengah
にく|niku|daging
はな|hana|bunga
ほし|hoshi|bintang
みみ|mimi|telinga
やま|yama|gunung
よる|yoru|malam
わたし|watashi|saya
ほん|hon|buku`;
const seen=new Set();
const entries=[...extra.split('\n').map(line=>{const [reading,romaji,meaning]=line.split('|');return {reading,romaji,meaning};}),...data.filter(x=>x.category==='vocabulary')];
for(const x of entries){const reading=x.reading;if(seen.has(reading))continue;seen.add(reading);data.push({id:'kana-word-'+reading,category:'kana-words',japanese:reading,reading,romaji:x.romaji,meaning:x.meaning});}
fs.writeFileSync(path,JSON.stringify(data,null,2));
console.log(`${seen.size} kana words ready`);
