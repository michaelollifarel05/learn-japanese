# Kotoba Garden

A local Node.js Japanese study app with an Indonesian interface. Requires Node.js 20 or later. No dependencies or account required.

```sh
npm start
```

Open http://localhost:3000. Use `npm test` for the answer-matching and review-scheduling tests. Set PORT to use a different local port.

If npm is unavailable, use `node server.js` to start and `node --test` to test.

## Docker

Start Docker Desktop (Linux containers), then run from this folder:

```sh
docker compose up --build -d
```

Open http://localhost:3000. Stop any existing local server on port 3000 first, or change the host port in compose.yaml (for example `127.0.0.1:3001:3000`). View status with `docker compose ps`, logs with `docker compose logs -f`, and stop with `docker compose down`. After code or dictionary edits, rerun the build command. The container runs as the non-root node user and includes a health check. No database or volume is required: progress remains in browser localStorage and survives container rebuilds when using the same browser and URL. Export a backup before changing the port or browser.

## Belajar per kelompok kana

Di Kuis, Flashcard, atau Kamus, pilih Hiragana, Katakana, atau **Kata dari kana pilihan**. Centang kelompok yang ingin dipelajari: Vokal, K, S, T, dan seterusnya. Tombol **Mulai: Vokal + K** langsung memilih dua kelompok awal. Kartu hanya tampil jika semua kana pada bacaannya termasuk kelompok pilihan. Pilihan ini tersimpan di browser dan dipakai bersama di ketiga halaman.

Contoh Vokal + K: `かく / kaku / menulis`, `きく / kiku / mendengar`, `かお / kao / wajah`, dan `いく / iku / pergi`. Materi kata memakai kana sebagai jawaban, sehingga kamu tidak harus menghafal kanji lebih dahulu. Gabungan kecil ゃゅょ, っ, ん, dan tanda panjang ー memiliki pilihan tersendiri. Pilih semua kelompok untuk membuka seluruh koleksi. Pilihan kelompok tidak membatasi materi Kanji, Kosakata umum, atau Kalimat.

## Learning

- Hiragana and katakana charts, including dakuten and combined sounds.
- 75 kana-only words filtered by selected kana groups, with Indonesian meanings.
- 104 beginner kanji, 46 vocabulary cards, and 16 simple sentences.
- Romaji → Japanese, Japanese → romaji, and Japanese → Indonesian quizzes and flashcards.
- Japanese speech playback when supported by the browser/device.
- Review scheduling, daily target, streak, accuracy, mastery, progress import/export.

Enable a Japanese keyboard/IME on your device to type Japanese answers. Romaji uses Hepburn-style readings, doubled vowels for long sounds, and spoken particles in sentences (wa/o/e). Standard si/ti/tu/hu/zi alternatives are accepted. Punctuation and spaces are ignored. Kanji have multiple readings: each card teaches a particular example reading, with context in its Indonesian hint. Shared readings accept alternative characters from the same category. Kana meaning quizzes test the sound label shown in the dictionary.

This is a curated N5 foundation, not an official or exhaustive JLPT syllabus. Kanji components marked with a parenthesized word show the reading in that word. Individual kanji can use a full word reading as indicated in the hint; type the displayed kanji alone for those character cards, and use the vocabulary cards to practice complete words.

## Data and privacy

Edit `public/data/dictionary.json` to change the dictionary. Preserve existing IDs to retain progress associations. `node scripts/build-data.js` regenerates the bundled dataset, including kana words, and overwrites manual dictionary changes. `scripts/add-kana-words.js` defines the extra beginner words and derives further kana words from the vocabulary. The file is served publicly by the local server.

Progress lives in localStorage in the current browser and origin, not on the Node server. Clearing browser data deletes it; use **Progres saya → Ekspor progres** for backups. Import replaces current progress after confirmation. Different browsers and ports have separate progress. Mastery is three consecutive correct answers, including self-rated flashcards. Streak counts local calendar days. This app is designed for one local user; no login or cloud sync.

Google Fonts are optional; system fonts work offline. Speech availability depends on installed Japanese voices. The local app binds to 127.0.0.1 by default. Docker sets HOST=0.0.0.0 inside the container and publishes only to host loopback through Compose.
