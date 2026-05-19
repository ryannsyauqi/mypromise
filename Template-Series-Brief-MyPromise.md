# Template Series Brief — MyPromise.id
**Untuk sesi vibe coding template undangan digital**
**Version:** 1.1 | May 2026

---

## Catatan Penting: Scope Dokumen Ini

**Dokumen ini adalah visual & template brief — bukan sistem brief.**

Sistem MyPromise (database, order management, checkout, admin dashboard, URL routing, field schema, RSVP storage, payment, dll) sudah dibangun dan tidak diatur ulang di sini. Brief ini hanya mengatur:
- Tampilan visual setiap template
- Struktur section dan urutan konten
- Typography, warna, animasi, dan feel per series
- Layout desktop dan mobile

**Saat vibe coding template, AI harus:**
- Mengikuti routing dan data structure yang sudah ada di sistem
- Membaca konten dari props atau data yang sudah di-pass dari sistem (field schema dari database)
- Tidak membuat sistem baru — template adalah komponen presentasi saja
- Conditional rendering untuk section opsional sudah dihandle via data yang masuk (jika field kosong, section tidak dirender)
- RSVP form, Google Calendar, countdown timer — gunakan komponen atau logic yang sudah ada di sistem, bukan buat ulang

---

## Prinsip Desain Global (Berlaku Semua Series)

### Foto adalah bintangnya
Setiap template dirancang untuk memaksimalkan foto prewedding pasangan. UI elements — typography, buttons, overlays — harus mendukung foto, bukan bersaing dengannya. Jika template terlihat bagus tanpa foto, desainnya terlalu ramai.

### Cover / Sampul — Wajib Ada di Setiap Template
**Setiap template harus dimulai dengan halaman Cover (sampul) sebelum konten undangan terbuka.**

Ini adalah layar pertama yang tamu lihat saat membuka link. Cover berfungsi sebagai "amplop digital" yang harus dibuka sebelum undangan terbaca.

**Struktur Cover:**
- Full-screen, menutupi seluruh viewport
- Foto hero pasangan sebagai background (full-bleed)
- Nama tamu ditampilkan ("Kepada Yth. [nama dari ?to= param]")
  — jika tidak ada ?to= param: tampilkan "Kepada Yth. Tamu Undangan"
- Nama pasangan (singkat: "Budi & Ayu")
- Tombol CTA: **"Buka Undangan"** — saat diklik, cover dismiss dengan animasi dan konten undangan terungkap
- Cover dismiss: animasi slide-up atau fade-out yang smooth (cover naik ke atas, undangan terungkap di bawahnya)
- Setelah dismiss: cover tidak muncul lagi selama sesi (gunakan sessionStorage flag)
- Musik: jika ada musik, autoplay dimulai saat tombol "Buka Undangan" diklik — ini adalah first user interaction yang valid untuk browser autoplay policy

**Visual Cover per Series:**
- Elegant: overlay gelap tipis, typography Cormorant centered, tombol outlined tipis
- Nusantara: overlay dengan subtle pattern motif, tombol dengan ornamen tipis
- Floral: floral elements di corners cover, tombol dengan leaf detail kecil

---

### Layout Desktop — Dua Panel (Semua Template)

Desktop menggunakan **two-panel fixed layout**. Mobile tetap sama seperti sekarang (single column full width).

```
Desktop layout (min-width: 1024px):

┌─────────────────────────────┬──────────────┐
│                             │              │
│   LEFT PANEL — 70% width    │  RIGHT PANEL │
│   position: fixed           │  30% width   │
│                             │              │
│   Foto hero full-height     │  Konten      │
│   Nama pasangan             │  undangan    │
│   Countdown timer           │  (scroll)    │
│   Nama tamu (Kepada Yth.)   │              │
│                             │  Sama persis │
│   Tidak scroll — always     │  dengan      │
│   visible                   │  mobile      │
│                             │              │
└─────────────────────────────┴──────────────┘
```

**Left panel (fixed, 70%):**
- Foto hero pasangan full-height, object-cover
- Overlay gelap atau warm sesuai series
- Nama pasangan besar di center atau bottom
- Countdown timer
- "Kepada Yth. [nama tamu]" di bagian atas atau bawah
- Tidak scroll — tetap di tempat saat konten kanan discroll

**Right panel (scroll, 30%):**
- Semua section konten undangan — persis sama dengan mobile
- Scrollable secara independen
- Max-width mengikuti konten, tidak terlalu lebar
- Background sesuai series (cream, putih, dll)

**Mobile (hidden left panel):**
- Single column, full width
- Cover/sampul tetap ada
- Semua section stack vertical seperti biasa
- Left panel tidak muncul sama sekali

**Implementasi:**
```css
/* Desktop */
@media (min-width: 1024px) {
  .invitation-wrapper { display: flex; height: 100vh; }
  .left-panel { position: fixed; width: 70%; height: 100vh; }
  .right-panel { margin-left: 70%; width: 30%; min-height: 100vh; overflow-y: auto; }
}

/* Mobile */
@media (max-width: 1023px) {
  .left-panel { display: none; }
  .right-panel { width: 100%; margin-left: 0; }
}
```

---

### Mobile-first, always
90%+ tamu buka undangan dari WhatsApp di HP. Setiap keputusan desain dimulai dari layar 390px. Desktop layout adalah enhancement, bukan prioritas utama — tapi harus diimplementasi dengan benar karena menambah kesan premium saat preview di laptop.

### Performance adalah bagian dari kualitas
Semua foto di-serve dengan `next/image` yang sudah ada di sistem. Tidak ada template yang boleh terasa berat di koneksi 4G. Loading experience adalah bagian dari kesan pertama.

### Struktur Section Standar (Semua Template)
Urutan section konsisten — yang berbeda hanya visual treatment per series. Section ini di-render oleh template berdasarkan data yang di-pass dari sistem:

```
0. Cover / Sampul        ← WAJIB, layar pertama sebelum undangan terbuka
1. Opening               — bismillah / quote, animasi masuk setelah cover dismiss
2. Hero                  — full-bleed foto utama, nama pasangan, countdown timer
3. Couple                — foto groom + bride, nama lengkap, nama orang tua
4. Love Story (opsional) — hanya render jika data love_story tidak kosong
5. Acara                 — akad & resepsi, Google Calendar button
6. Maps                  — embed Google Maps dari maps_link field
7. Galeri                — grid foto, hanya render jika gallery_photos ada
8. Video (opsional)      — embed dari prewedding_video_url, skip jika kosong
9. RSVP & Wishes         — form + live wall ucapan tamu
10. Gift (opsional)      — rekening, hanya render jika bank_account diisi
11. Closing              — foto penutup, ucapan terima kasih
```

### Animasi & Interaksi Standar
- Cover dismiss: slide-up atau fade-out saat "Buka Undangan" diklik
- Musik: autoplay dimulai tepat saat cover dismiss (first interaction)
- Scroll reveal: fade + translateY per section saat masuk viewport
- Countdown: live ticking dari sistem, auto-hide setelah hari H
- RSVP: gunakan logic submit yang sudah ada di sistem, bukan buat ulang
- `?to=` param: dibaca dari URL, ditampilkan di cover dan hero

---

## Series 1 — Elegant Series

### Konsep
Timeless, bersih, sophisticated. Seperti undangan cetak mewah yang didigitalkan. Tidak mengikuti tren — justru menghindari tren agar tidak ketinggalan zaman. Pasangan yang memilih Elegant Series biasanya tidak perlu banyak bicara soal gaya — mereka tahu apa yang mereka mau dan itu adalah sesuatu yang klasik.

### Target Pasangan
Pasangan urban, 25–35 tahun, profesional, yang menginginkan sesuatu yang "tidak salah" — premium tanpa berlebihan, modern tanpa kehilangan kehangatan.

### Palet Warna
```
Background:  #FDFAF6  (warm off-white, bukan pure white)
Text utama:  #1A1A1A  (near-black, bukan pure black)
Text sekunder: #6B6459 (warm grey-brown)
Accent:      #C9A96E  (warm gold, bukan metallic)
Border/divider: #E8E0D4 (warm light grey)
Overlay foto:  rgba(20, 18, 15, 0.35) (warm dark overlay)
```

### Typography
```
Display / Nama pasangan: Cormorant Garamond — italic, light weight
                         Terasa seperti undangan cetak premium
Section heading:         Cormorant Garamond — regular
Body / detail info:      Jost — light, wide letter-spacing
Quote / bismillah:       Cormorant Garamond — italic, larger size
```

### Visual Karakteristik
- Layout: simetris, centered, generous white space
- Foto hero: full-bleed dengan warm dark overlay tipis, nama pasangan di center
- Divider antar section: thin gold line (1px) atau ornamen tipis minimalis
- Foto couple: dua foto individual berdampingan dengan oval atau rounded frame tipis
- Galeri: grid 3 kolom rapi, slight rounded corners, gap konsisten
- Tidak ada elemen dekoratif yang agresif — kalau ada ornamen, sangat subtle dan tipis

### Animasi
- Opening: fade in sangat pelan (1.5s), elegant, tidak terburu-buru
- Scroll reveal: fade + gentle rise (translateY 20px → 0), easing: ease-out
- Nama pasangan di hero: fade in dengan slight letter-spacing animation
- Tidak ada animasi yang "flashy" — semua smooth dan lambat

### Template dalam Series ini

#### Template 1 — **Aurel**
Paling clean dan minimal dari series. Background putih susu, foto hero full screen dengan overlay sangat tipis. Nama pasangan dalam Cormorant besar di tengah. Section-section bersih dengan banyak breathing room. Tidak ada ornamen sama sekali — murni tipografi dan foto.

*Cocok untuk:* Pasangan yang sangat minimalis, foto prewedding outdoor terang.

#### Template 2 — **Celeste**
Sedikit lebih dekoratif dari Aurel — ada thin gold line dividers dan subtle corner ornaments di section tertentu. Foto hero dengan rounded corner yang sangat besar (almost circular crop di beberapa section). Terasa seperti editorial majalah pernikahan premium.

*Cocok untuk:* Pasangan yang mau elegant tapi ada karakternya sedikit.

#### Template 3 — **Mirelle**
Paling "classic wedding" dari ketiganya — layout dua kolom di beberapa section (teks kiri, foto kanan atau sebaliknya). Ada subtle floral line art yang sangat tipis sebagai divider. Terasa paling dekat dengan undangan cetak mewah yang didigitalkan.

*Cocok untuk:* Pasangan yang suka feel wedding tradisional tapi dalam format digital.

### Instruksi untuk AI Vibe Coding — Elegant Series
```
Buat wedding invitation template dengan karakteristik berikut:
- Stack: Next.js, Tailwind CSS
- Font: import Cormorant Garamond (Google Fonts) untuk display,
        Jost untuk body text
- Color scheme: warm off-white background (#FDFAF6), near-black text (#1A1A1A),
                warm gold accent (#C9A96E)
- Semua foto menggunakan next/image dengan object-cover
- Foto hero: full viewport height, foto sebagai background dengan
             overlay rgba(20,18,15,0.35), nama pasangan centered dalam
             Cormorant Garamond italic large
- Scroll animations: IntersectionObserver, fade + translateY(20px to 0),
                     duration 800ms, easing ease-out, staggered per element
- Layout: centered, max-width 480px di mobile, 640px di desktop
- Tidak ada elemen yang ramai — minimal, breathing room besar
- Gold accent hanya untuk dividers (1px line) dan detail kecil
```

---

## Series 2 — Nusantara Series

### Konsep
Indonesia kontemporer — bukan batik klise atau warna merah-emas yang predictable. Ini interpretasi modern dari estetika Nusantara: motif geometris yang diambil dari tenun, ukiran, atau arsitektur tradisional, dipadukan dengan komposisi yang bersih dan modern. Terasa seperti brand fashion Indonesia premium yang bangga dengan identitasnya.

### Target Pasangan
Pasangan yang bangga dengan identitas budaya mereka, keluarga yang tradisional, atau pernikahan adat (Jawa, Sunda, Batak, Bugis, dll) yang ingin undangan digitalnya merepresentasikan nuansa tersebut dengan cara yang modern dan tidak kuno.

### Palet Warna

#### Variant A — Jawa Modern (Earth & Gold)
```
Background:   #F5F0E8  (warm parchment)
Text utama:   #2C1810  (deep warm brown)
Text sekunder: #7A5C3A (medium warm brown)
Accent 1:     #B8860B  (dark goldenrod — bukan metallic)
Accent 2:     #8B4513  (saddle brown)
Pattern color: rgba(184, 134, 11, 0.12) (gold pattern overlay, subtle)
```

#### Variant B — Modern Nusantara (Teal & Terracotta)
```
Background:   #FAFAF8  (near white)
Text utama:   #1C2B2B  (deep teal-black)
Text sekunder: #4A6060 (muted teal)
Accent 1:     #2D7D6F  (deep teal)
Accent 2:     #C4622D  (terracotta)
Pattern:      Geometric motif dari tenun, teal opacity 8%
```

### Typography
```
Display / Nama pasangan: Playfair Display — italic atau
                         Libre Baskerville — untuk feel yang lebih klasik
Section heading:         Playfair Display — regular
Body:                    Plus Jakarta Sans — karya tipografer Indonesia,
                         sangat appropriate untuk series ini
Quote / ayat:            Playfair Display — italic
```

### Visual Karakteristik
- Motif geometris dari inspirasi tenun/ukiran sebagai subtle pattern overlay atau border
- Motif tidak mendominasi — digunakan sebagai frame, border section, atau background texture yang sangat tipis
- Ornamen traditional yang disederhanakan menjadi garis-garis geometris
- Foto tetap jadi bintang — motif hanya sebagai "frame" budaya
- Bisa ada ayat Al-Quran (untuk pasangan Muslim) dalam Arabic calligraphy style yang elegan

### Template dalam Series ini

#### Template 1 — **Saka**
Terinspirasi dari arsitektur Jawa — garis-garis horizontal yang kuat, ornamen kawung yang disederhanakan menjadi geometris modern. Palet earth tone dan gold. Terasa seperti hotel heritage Jawa yang modern.

*Cocok untuk:* Pernikahan adat Jawa, keluarga tradisional, palet warna earth tone.

#### Template 2 — **Tirta**
Terinspirasi dari tenun ikat dan motif air — lebih fluid, pattern yang berulang halus sebagai background texture. Palet teal dan terracotta. Lebih kontemporer dari Saka, cocok untuk pasangan yang modern tapi mau ada nuansa budaya.

*Cocok untuk:* Pasangan modern yang ingin sentuhan budaya, pernikahan dengan tema garden atau outdoor.

#### Template 3 — **Wulan**
Paling feminine dari ketiganya — terinspirasi dari batik parang yang disederhanakan menjadi diagonal line pattern yang sangat subtle. Palet rose gold dan cream. Nama "Wulan" (bulan dalam bahasa Jawa) merepresentasikan keanggunan dan cahaya.

*Cocok untuk:* Pernikahan Sunda atau Jawa dengan nuansa feminine, pasangan yang mau nusantara tapi tetap lembut.

### Instruksi untuk AI Vibe Coding — Nusantara Series
```
Buat wedding invitation template dengan karakteristik berikut:
- Stack: Next.js, Tailwind CSS
- Font: import Playfair Display (Google Fonts) untuk display,
        Plus Jakarta Sans untuk body
- Color scheme: warm parchment background (#F5F0E8), deep warm brown text,
                gold accent (#B8860B)
- Pattern: buat SVG pattern geometris terinspirasi kawung atau tenun,
           gunakan sebagai background overlay dengan opacity 8-12%
           di section tertentu (bukan semua section)
- Foto hero: full-bleed dengan overlay warm brown gelap,
             nama pasangan dengan Playfair Display italic
- Border/divider: thin line dengan motif geometris SVG kecil di tengahnya
- Ornamen: corner ornaments geometris (bukan floral) di beberapa section
- Layout: tetap centered mobile-first, max 480px
- Animasi: scroll reveal yang sedikit lebih "grand" dari Elegant —
           fade + scale(0.98 to 1), duration 1000ms
```

---

## Series 3 — Floral Series

### Konsep
Botanical, organic, lush — tapi bukan floral yang generik dan klise. Ini seperti editorial garden wedding di majalah Kinfolk atau Vogue Wedding. Bunga dan daun hadir sebagai elemen dekoratif yang terasa natural dan segar, bukan artificial dan cheesy. Foto prewedding tetap utama — floral elements berfungsi sebagai "taman" yang membingkai foto.

### Target Pasangan
Pasangan yang wedding theme-nya garden, outdoor, atau rustic. Pasangan yang suka estetika natural, earth-friendly, botanical. Perempuan yang memilih sendiri undangannya (karena series ini paling feminine dari ketiganya).

### Palet Warna

#### Variant A — Garden Romantic (Blush & Sage)
```
Background:   #FAF7F4  (warm cream white)
Text utama:   #2D2420  (deep warm dark)
Text sekunder: #7D6B5E (warm brown-grey)
Accent 1:     #C17B8C  (dusty rose / mauve)
Accent 2:     #6B8C6B  (sage green)
Accent 3:     #D4A96A  (warm gold)
Floral color: dusty rose, sage, soft terracotta — tidak pernah bright
```

#### Variant B — Botanical Dark (Forest & Cream)
```
Background:   #1C2420  (deep forest green-black)
Text utama:   #F5F0E8  (warm cream)
Text sekunder: #B8A898 (warm light grey)
Accent:       #8FBC8F  (light sage)
Accent 2:     #D4A96A  (gold)
Floral color: cream, sage, gold — pada background gelap
(ini Floral yang moody — untuk pasangan yang mau floral tapi dark)
```

### Typography
```
Display / Nama pasangan: Cormorant Garamond — italic, light
                         ATAU Bodoni Moda — untuk feel yang lebih fashion
Section heading:         Cormorant Garamond
Body:                    DM Sans — clean, modern, kontras dengan display
Floral label / caption:  Cormorant Garamond — small italic
```

### Visual Karakteristik
- Elemen floral: watercolor-style botanical illustrations atau SVG floral yang organic
- Bunga dan daun muncul sebagai: corner decorations, section dividers, frame foto
- Tidak semua section penuh floral — ada breathing room di antara elemen dekoratif
- Foto tetap full-bleed di hero — floral hanya hadir di pinggir atau di bawah foto
- Tekstur kertas subtle sebagai background (noise texture CSS atau SVG filter)
- Warna floral tidak pernah bright/saturated — selalu dusty, muted, organic

### Template dalam Series ini

#### Template 1 — **Jasmine**
Paling light dan airy — background cream, floral elements blush dan sage di corners dan dividers. Foto hero dengan floral frame di bagian bawah. Typography Cormorant yang feminine. Terasa seperti halaman majalah pernikahan outdoor yang cerah.

*Cocok untuk:* Garden wedding, outdoor, foto prewedding di alam terbuka, palet pastel.

#### Template 2 — **Fern**
Lebih botanical dan earthy — dominan daun hijau sage daripada bunga. Earthy tones, tekstur lebih terasa. Layout sedikit lebih editorial dengan beberapa asymmetric element. Terasa seperti eco-luxury wedding.

*Cocok untuk:* Pasangan yang earthy, nature-forward, outdoor rustic.

#### Template 3 — **Dahlia**
Floral yang dark dan moody — menggunakan Variant B (Forest & Cream). Bunga-bunga cream dan sage di atas background deep forest green. Ini Floral yang edgy dan tidak biasa. Foto prewedding tampil sangat dramatis di atas background gelap dengan floral accent.

*Cocok untuk:* Pasangan yang mau floral tapi tidak biasa, foto prewedding indoor atau dramatic.

### Instruksi untuk AI Vibe Coding — Floral Series
```
Buat wedding invitation template dengan karakteristik berikut:
- Stack: Next.js, Tailwind CSS
- Font: import Cormorant Garamond + DM Sans dari Google Fonts
- Color scheme (Jasmine): warm cream (#FAF7F4), dusty rose accent (#C17B8C),
                          sage green (#6B8C6B)
- Floral elements: gunakan SVG botanical illustrations — bisa dari
                   inline SVG atau import sebagai komponen React.
                   Posisi: absolute, di corners section, sebagai divider.
                   Opacity: 0.6-0.85, tidak pernah full opacity.
                   Warna: muted, dusty, organic — bukan bright
- Background texture: tambahkan subtle noise texture via CSS filter
                      atau SVG feTurbulence untuk feel kertas organik
- Foto hero: full-bleed, overlay ringan (untuk Jasmine: warm cream overlay
             opacity 0.15 di bottom untuk text legibility)
- Layout: centered, sedikit lebih narrow (max 420px) untuk feel intimate
- Galeri: masonry atau grid dengan gap yang organic, slight rotation
          pada beberapa foto (-1deg, 1deg) untuk feel candid
- Animasi: scroll reveal dengan slight rotation — element masuk dengan
           rotate(2deg to 0) + fade, terasa organic dan natural
```

---

## Checklist Sebelum Template Dianggap Selesai

Setiap template harus melewati checklist ini sebelum masuk ke sistem:

### Visual
- [ ] Terlihat bagus dengan foto prewedding berkualitas tinggi
- [ ] Terlihat acceptable dengan foto yang kurang ideal (test dengan foto biasa)
- [ ] Nama pasangan terbaca jelas di atas foto hero
- [ ] Semua teks body terbaca dengan kontras yang cukup
- [ ] Tidak ada elemen yang "bertabrakan" secara visual

### Responsif
- [ ] Sempurna di iPhone SE (375px) — layar terkecil yang umum
- [ ] Bagus di iPhone 14 (390px) — standar
- [ ] Acceptable di iPad (768px)
- [ ] Tidak aneh di desktop (tapi bukan prioritas)

### Fungsional
- [ ] Countdown timer berjalan dan akurat
- [ ] `?to=` parameter menampilkan nama dengan benar
- [ ] Jika tidak ada `?to=` param, fallback ke "Tamu Undangan"
- [ ] RSVP form submit tanpa reload
- [ ] Google Calendar link generate dengan benar
- [ ] Musik autoplay on first interaction, ada tombol play/pause
- [ ] Video embed hanya muncul jika URL video diisi
- [ ] Love Story section hanya muncul jika konten diisi
- [ ] Gift section hanya muncul jika rekening diisi
- [ ] Maps embed load dengan benar

### Performance
- [ ] Lighthouse mobile score > 80
- [ ] Foto di-serve via next/image
- [ ] Tidak ada layout shift saat foto load (gunakan aspect-ratio placeholder)
- [ ] Font loading tidak menyebabkan FOUT yang noticeable

### Demo
- [ ] Ada stock prewedding photo yang berkualitas sebagai placeholder
  (ambil dari Unsplash: search "prewedding couple Indonesia")
- [ ] Semua field terisi dengan data dummy yang realistic
  (nama Indonesia asli, tanggal, venue nyata)
- [ ] Demo URL aktif dan bisa dibuka: mypromise.id/demo/[template-slug]

---

## Naming Convention & Slugs

| Series | Template | Slug | Status |
|---|---|---|---|
| Elegant | Aurel | `aurel` | — |
| Elegant | Celeste | `celeste` | — |
| Elegant | Mirelle | `mirelle` | — |
| Nusantara | Saka | `saka` | — |
| Nusantara | Tirta | `tirta` | — |
| Nusantara | Wulan | `wulan` | — |
| Floral | Jasmine | `jasmine` | — |
| Floral | Fern | `fern` | — |
| Floral | Dahlia | `dahlia` | — |

**Demo URLs:**
```
mypromise.id/demo/aurel
mypromise.id/demo/celeste
mypromise.id/demo/mirelle
mypromise.id/demo/saka
mypromise.id/demo/tirta
mypromise.id/demo/wulan
mypromise.id/demo/jasmine
mypromise.id/demo/fern
mypromise.id/demo/dahlia
```

---

## Cara Pakai Dokumen Ini di Sesi Vibe Coding

1. Buka Claude Code atau Cursor
2. Paste section yang relevan (misal: seluruh bagian "Series 1 — Elegant Series")
3. Tambahkan: *"Buat template pertama dari series ini yaitu [nama template]. Gunakan instruksi di bagian 'Instruksi untuk AI Vibe Coding' sebagai panduan teknis. Ikuti checklist sebelum dianggap selesai."*
4. Build satu template sampai selesai sebelum pindah ke template berikutnya
5. Test dengan foto prewedding dari Unsplash sebagai placeholder
6. Setelah selesai, update status di Naming Convention & Slugs table

*Satu sesi = satu template. Jangan coba build dua template sekaligus.*
