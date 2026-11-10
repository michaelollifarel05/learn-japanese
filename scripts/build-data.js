const fs = require('node:fs');
const rows = `a i u e o|あいうえお|アイウエオ
ka ki ku ke ko|かきくけこ|カキクケコ
sa shi su se so|さしすせそ|サシスセソ
ta chi tsu te to|たちつてと|タチツテト
na ni nu ne no|なにぬねの|ナニヌネノ
ha hi fu he ho|はひふへほ|ハヒフヘホ
ma mi mu me mo|まみむめも|マミムメモ
ya yu yo|やゆよ|ヤユヨ
ra ri ru re ro|らりるれろ|ラリルレロ
wa wo n|わをん|ワヲン
ga gi gu ge go|がぎぐげご|ガギグゲゴ
za ji zu ze zo|ざじずぜぞ|ザジズゼゾ
da ji zu de do|だぢづでど|ダヂヅデド
ba bi bu be bo|ばびぶべぼ|バビブベボ
pa pi pu pe po|ぱぴぷぺぽ|パピプペポ
kya kyu kyo|きゃ きゅ きょ|キャ キュ キョ
sha shu sho|しゃ しゅ しょ|シャ シュ ショ
cha chu cho|ちゃ ちゅ ちょ|チャ チュ チョ
nya nyu nyo|にゃ にゅ にょ|ニャ ニュ ニョ
hya hyu hyo|ひゃ ひゅ ひょ|ヒャ ヒュ ヒョ
mya myu myo|みゃ みゅ みょ|ミャ ミュ ミョ
rya ryu ryo|りゃ りゅ りょ|リャ リュ リョ
gya gyu gyo|ぎゃ ぎゅ ぎょ|ギャ ギュ ギョ
ja ju jo|じゃ じゅ じょ|ジャ ジュ ジョ
bya byu byo|びゃ びゅ びょ|ビャ ビュ ビョ
pya pyu pyo|ぴゃ ぴゅ ぴょ|ピャ ピュ ピョ`;
const items=[];
for(const row of rows.split('\n')){const [r,h,k]=row.split('|');const hs=h.includes(' ')?h.split(' '):[...h];const ks=k.includes(' ')?k.split(' '):[...k];r.split(' ').forEach((romaji,i)=>{for(const [category,japanese] of [['hiragana',hs[i]],['katakana',ks[i]]])items.push({id:`${category}-${items.length}`,category,japanese,reading:japanese,romaji,meaning:'Bunyi '+romaji});});}
const kanji=`一|いち|ichi|satu
二|に|ni|dua
三|さん|san|tiga
四|よん|yon|empat
五|ご|go|lima
六|ろく|roku|enam
七|なな|nana|tujuh
八|はち|hachi|delapan
九|きゅう|kyuu|sembilan
十|じゅう|juu|sepuluh
百|ひゃく|hyaku|seratus
千|せん|sen|seribu
万|まん|man|sepuluh ribu
円|えん|en|yen
日|ひ|hi|hari; matahari
月|つき|tsuki|bulan
火|ひ|hi|api
水|みず|mizu|air
木|き|ki|pohon
金|かね|kane|uang
土|つち|tsuchi|tanah
人|ひと|hito|orang
男|おとこ|otoko|laki-laki
女|おんな|onna|perempuan
子|こ|ko|anak
山|やま|yama|gunung
川|かわ|kawa|sungai
田|た|ta|sawah
口|くち|kuchi|mulut
目|め|me|mata
耳|みみ|mimi|telinga
手|て|te|tangan
足|あし|ashi|kaki
力|ちから|chikara|kekuatan
父|ちち|chichi|ayah (sendiri)
母|はは|haha|ibu (sendiri)
先|さき|saki|sebelumnya; depan
生|せい|sei|kehidupan (bacaan dalam 学生)
学|がく|gaku|belajar (bacaan dalam 学生)
校|こう|kou|sekolah (bacaan dalam 学校)
友|とも|tomo|teman
本|ほん|hon|buku
名|な|na|nama
年|とし|toshi|tahun
時|とき|toki|waktu
分|ふん|fun|menit
半|はん|han|setengah
今|いま|ima|sekarang
何|なに|nani|apa
上|うえ|ue|atas
下|した|shita|bawah
中|なか|naka|dalam; tengah
外|そと|soto|luar
右|みぎ|migi|kanan
左|ひだり|hidari|kiri
前|まえ|mae|depan; sebelum
後|あと|ato|setelah
北|きた|kita|utara
南|みなみ|minami|selatan
東|ひがし|higashi|timur
西|にし|nishi|barat
大|だい|dai|besar (bacaan dalam 大学)
小|しょう|shou|kecil (bacaan dalam 小学校)
高|たかい|takai|tinggi; mahal (高い)
安|やすい|yasui|murah (安い)
新|あたらしい|atarashii|baru (新しい)
古|ふるい|furui|lama (古い)
長|ながい|nagai|panjang (長い)
多|おおい|ooi|banyak (多い)
少|すくない|sukunai|sedikit (少ない)
白|しろ|shiro|putih
天|てん|ten|langit
気|き|ki|semangat; suasana
雨|あめ|ame|hujan
電|でん|den|listrik (bacaan dalam 電車)
車|くるま|kuruma|mobil
駅|えき|eki|stasiun
道|みち|michi|jalan
国|くに|kuni|negara
語|ご|go|bahasa (akhiran)
話|はなし|hanashi|cerita
読|よむ|yomu|membaca (読む)
書|かく|kaku|menulis (書く)
聞|きく|kiku|mendengar (聞く)
見|みる|miru|melihat (見る)
行|いく|iku|pergi (行く)
来|くる|kuru|datang (来る)
帰|かえる|kaeru|pulang (帰る)
食|たべる|taberu|makan (食べる)
飲|のむ|nomu|minum (飲む)
買|かう|kau|membeli (買う)
休|やすむ|yasumu|beristirahat (休む)
会|あう|au|bertemu (会う)
社|しゃ|sha|perusahaan (bacaan dalam 会社)
店|みせ|mise|toko
毎|まい|mai|setiap
週|しゅう|shuu|minggu
午|ご|go|tengah hari (bacaan dalam 午前)
間|あいだ|aida|antara
入|はいる|hairu|masuk (入る)
出|でる|deru|keluar (出る)
立|たつ|tatsu|berdiri (立つ)
花|はな|hana|bunga
魚|さかな|sakana|ikan`;
const vocabulary=`ねこ|ねこ|neko|kucing
いぬ|いぬ|inu|anjing
おはよう|おはよう|ohayou|selamat pagi
ありがとう|ありがとう|arigatou|terima kasih
先生|せんせい|sensei|guru
学生|がくせい|gakusei|pelajar
学校|がっこう|gakkou|sekolah
日本|にほん|nihon|Jepang
日本語|にほんご|nihongo|bahasa Jepang
今日|きょう|kyou|hari ini
明日|あした|ashita|besok
昨日|きのう|kinou|kemarin
友達|ともだち|tomodachi|teman
電車|でんしゃ|densha|kereta
電話|でんわ|denwa|telepon
会社|かいしゃ|kaisha|perusahaan
病院|びょういん|byouin|rumah sakit
銀行|ぎんこう|ginkou|bank
図書館|としょかん|toshokan|perpustakaan
名前|なまえ|namae|nama
時間|じかん|jikan|waktu
朝|あさ|asa|pagi
夜|よる|yoru|malam
食べる|たべる|taberu|makan
飲む|のむ|nomu|minum
読む|よむ|yomu|membaca
書く|かく|kaku|menulis
行く|いく|iku|pergi
来る|くる|kuru|datang
帰る|かえる|kaeru|pulang
大きい|おおきい|ookii|besar
小さい|ちいさい|chiisai|kecil
好き|すき|suki|suka
おいしい|おいしい|oishii|enak
パン|パン|pan|roti
コーヒー|コーヒー|koohii|kopi
テレビ|テレビ|terebi|televisi
ラジオ|ラジオ|rajio|radio
タクシー|タクシー|takushii|taksi
バス|バス|basu|bus
ホテル|ホテル|hoteru|hotel
レストラン|レストラン|resutoran|restoran
カメラ|カメラ|kamera|kamera
コンピューター|コンピューター|konpyuutaa|komputer
スーパー|スーパー|suupaa|supermarket
アイスクリーム|アイスクリーム|aisukuriimu|es krim`;
const sentences=`私は学生です。|わたしはがくせいです。|watashi wa gakusei desu|Saya seorang pelajar.
毎日、日本語を勉強します。|まいにち、にほんごをべんきょうします。|mainichi nihongo o benkyou shimasu|Saya belajar bahasa Jepang setiap hari.
水を飲みます。|みずをのみます。|mizu o nomimasu|Saya minum air.
学校に行きます。|がっこうにいきます。|gakkou ni ikimasu|Saya pergi ke sekolah.
これは私の本です。|これはわたしのほんです。|kore wa watashi no hon desu|Ini buku saya.
猫がいます。|ねこがいます。|neko ga imasu|Ada kucing.
パンを食べます。|パンをたべます。|pan o tabemasu|Saya makan roti.
コーヒーが好きです。|コーヒーがすきです。|koohii ga suki desu|Saya suka kopi.
駅はどこですか。|えきはどこですか。|eki wa doko desu ka|Di mana stasiun?
今日は暑いです。|きょうはあついです。|kyou wa atsui desu|Hari ini panas.
明日、友達に会います。|あした、ともだちにあいます。|ashita tomodachi ni aimasu|Besok saya bertemu teman.
テレビを見ます。|テレビをみます。|terebi o mimasu|Saya menonton televisi.
バスで帰ります。|バスでかえります。|basu de kaerimasu|Saya pulang dengan bus.
七時に起きます。|しちじにおきます。|shichiji ni okimasu|Saya bangun pukul tujuh.
この花はきれいです。|このはなはきれいです。|kono hana wa kirei desu|Bunga ini indah.
図書館で本を読みます。|としょかんでほんをよみます。|toshokan de hon o yomimasu|Saya membaca buku di perpustakaan.`;
for(const [category,source] of [['kanji',kanji],['vocabulary',vocabulary],['sentences',sentences]])source.split('\n').forEach((line,i)=>{const [japanese,reading,romaji,meaning]=line.split('|');items.push({id:category+'-'+i,category,japanese,reading,romaji,meaning});});
fs.mkdirSync('public/data',{recursive:true});fs.writeFileSync('public/data/dictionary.json',JSON.stringify(items,null,2));console.log(`${items.length} learning items written`);
require('./add-kana-words');
