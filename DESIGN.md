---
name: Niaga
description: POS untuk stand food court, dengan papan harga gerobak dan tombol uang rupiah.
colors:
  putih: "#ffffff"
  abu: "#eef2f1"
  tinta: "#16302e"
  toska: "#0b7a75"
  kuning: "#ffc928"
  cabai: "#c62828"
  rp100: "#c2185b"
  rp50: "#1f5fae"
  rp20: "#23784a"
  rp10: "#7b3fa0"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "44px"
    lineHeight: 1.1
    fontWeight: 800
    fontFeature: "tnum"
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 800
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
  receipt:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    fontFeature: "tnum"
rounded:
  md: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button:
    backgroundColor: "{colors.putih}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "48px"
  button-primary:
    backgroundColor: "{colors.toska}"
    textColor: "{colors.putih}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "48px"
  button-danger:
    backgroundColor: "{colors.putih}"
    textColor: "{colors.cabai}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "48px"
  button-big:
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    height: "64px"
    width: "100%"
  input:
    backgroundColor: "{colors.putih}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "48px"
  price-board:
    backgroundColor: "{colors.kuning}"
    textColor: "{colors.tinta}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  cart-bar:
    backgroundColor: "{colors.kuning}"
    textColor: "{colors.tinta}"
    typography: "{typography.title}"
    height: "64px"
  product-tile:
    backgroundColor: "{colors.putih}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "12px"
    height: "96px"
  quick-cash-rp100:
    backgroundColor: "{colors.rp100}"
    textColor: "{colors.putih}"
    rounded: "{rounded.md}"
    height: "64px"
  quick-cash-rp50:
    backgroundColor: "{colors.rp50}"
    textColor: "{colors.putih}"
    rounded: "{rounded.md}"
    height: "64px"
  quick-cash-rp20:
    backgroundColor: "{colors.rp20}"
    textColor: "{colors.putih}"
    rounded: "{rounded.md}"
    height: "64px"
  quick-cash-rp10:
    backgroundColor: "{colors.rp10}"
    textColor: "{colors.putih}"
    rounded: "{rounded.md}"
    height: "64px"
  nav-item-active:
    backgroundColor: "{colors.toska}"
    textColor: "{colors.putih}"
    height: "64px"
---

# Design System: Niaga

## Overview

**Creative North Star: "Papan Harga Gerobak"**

Setiap elemen penting terbaca seperti papan harga yang dicat di gerobak: besar, datar, dan tegas, dengan satu label jelas. Rangka warnanya dari cat gerobak, yaitu badan toska, papan harga kuning, dan huruf merah cabai di atas putih. Warnanya rata dan kontrasnya tinggi supaya terbaca di layar terang, dengan antrean yang sedang menunggu.

Kepadatan rendah. Tap berikutnya selalu jadi elemen terbesar di layar. Tiap layar hanya punya satu elemen yang keras: di langkah bayar itu barisan tombol uang cepat, di tempat lain papan total kuning. Sisanya tenang: putih, garis 2px, teks tinta.

Warna uang kertas rupiah hanya muncul di tombol uang cepat. Kasir mengenali pecahan dari warnanya tanpa membaca, dan nominalnya tetap tertulis.

**Key Characteristics:**
- Warna rata, tanpa gradien, tanpa bayangan dekoratif.
- Pemisah dari isian warna dan border 2px, bukan dari bayangan.
- Tombol dan tile besar: minimal 48px, tombol utama dan uang cepat 64px.
- Angka rupiah selalu tabular dan rata kanan.
- Satu elemen keras per layar.

## Colors

Cat gerobak di atas putih: satu warna aksi, satu warna papan, satu warna bahaya, dan empat warna uang kertas yang dikurung di satu komponen.

### Primary
- **Toska Cat Gerobak** (`toska`): aksi utama, nav aktif, tautan, segmen terpilih, dan badge jumlah di tile produk. Teks putih di atasnya 5.2:1.

### Secondary
- **Kuning Papan Harga** (`kuning`): papan total, bar keranjang di HP, dan papan status Beranda. Selalu dengan teks `tinta`, tidak pernah teks putih.

### Tertiary
- **Merah Cabai** (`cabai`): bahaya saja, yaitu void, hapus, error, dan kurang bayar. Teks putih di atasnya 5.6:1.

### Neutral
- **Putih Kertas** (`putih`): latar halaman, kartu, dan tombol sekunder.
- **Abu Etalase** (`abu`): permukaan kedua, belang tabel, border kartu dan tile, latar halaman login.
- **Tinta Hijau Gelap** (`tinta`): teks, ikon, border tombol dan input, cincin fokus. Teks redup memakai campuran 70% tinta dengan putih.

### Uang Kertas (hanya tombol uang cepat)
- **Merah Muda Seratus Ribu** (`rp100`): Rp100.000. Sengaja lebih pink dari `cabai`.
- **Biru Lima Puluh Ribu** (`rp50`): Rp50.000.
- **Hijau Dua Puluh Ribu** (`rp20`): Rp20.000.
- **Ungu Sepuluh Ribu** (`rp10`): Rp10.000.

### Named Rules
**The Dompet Tertutup Rule.** Warna uang kertas tidak pernah keluar dari tombol uang cepat. Warna ini hardcoded di `payment.css` saja, bukan token `:root`.

**The Cabai Bersuara Rule.** Status bahaya selalu punya teks ("Kurang Rp5.000", "VOID"), tidak pernah warna saja, karena `cabai` dan `rp100` sama-sama merah.

**The Papan Kuning Rule.** Kuning adalah papan harga, bukan dekorasi. Pakai hanya untuk total, bar keranjang, dan papan status Beranda.

## Typography

**Font:** Plus Jakarta Sans (fallback `system-ui, sans-serif`), berat 500, 700, 800. Satu keluarga untuk semua peran.

**Character:** Sans geometris yang dibuat untuk identitas kota Jakarta. Tebal dan lugas, tidak ada berat tipis di bawah 500.

### Hierarchy
- **Display** (800, 44px, line-height 1.1): total di papan bayar. Wordmark login memakai 800 32px.
- **Headline** (800, 24px): judul halaman (`h1`).
- **Title** (800, 20px): judul bagian (`h2`), papan total, bar keranjang, tombol besar, kembalian.
- **Body** (500, 16px, line-height 1.4): teks umum, input, harga di tile produk. Nama produk di tile 20px.
- **Label** (700, 14px): label field, header tabel, item nav, teks meta.
- **Receipt** (500, 13px, tabular): isi struk 58 mm.

### Named Rules
**The Angka Rapi Rule.** Semua angka rupiah memakai `tabular-nums`. Di tabel dan keranjang, angka rata kanan dan tidak pernah terputus baris.

**The Kalimat Biasa Rule.** Sentence case di mana pun. Tidak ada label huruf kapital semua dan tidak ada eyebrow di atas judul.

## Layout

Dua perangkat utama: HP portrait (360–430px) dan tablet landscape (≥ 900px). Laptop ikut layout tablet. Satu breakpoint: `900px`.

- **HP:** navigasi bawah setinggi 64px dengan border atas tinta. Grid produk 2 kolom. Keranjang tersembunyi di balik bar kuning yang menempel di atas navigasi; tap bar membuka keranjang dan pembayaran sebagai sheet setinggi layar.
- **Tablet:** rail kiri 104px dengan wordmark dan nama user. Grid produk isi-otomatis (min 160px). Keranjang di kolom kanan tetap 360px; hanya daftar item yang scroll, jadi tombol Bayar selalu terlihat.
- **Halaman lain:** bingkai `.page` dengan padding 24px 16px (32px di tablet), lebar maksimal 1200px, rata kiri. `.split` memberi kolom samping 340px di tablet dan menumpuk di HP.
- **Spasi:** skala 4, 8, 12, 16, 24, 32. Gap antar-bagian 24px, antar-field 12px.
- Tabel ada di dalam `.table-wrap` yang scroll sendiri; halaman tidak pernah scroll horizontal.

## Elevation & Depth

Sistem ini rata sepenuhnya. Tidak ada `box-shadow`. Kedalaman datang dari tiga hal: isian warna (toska, kuning, abu), border 2px (`tinta` untuk kontrol, `abu` untuk kartu dan tile), dan posisi tetap (nav, bar keranjang, sheet) dengan border pemisah.

### Named Rules
**The Cat Rata Rule.** Tidak ada bayangan, gradien, atau blur. Kalau perlu memisahkan, pakai border 2px atau isian warna.

## Shapes

Sudut sedikit membulat 12px di tombol, input, kartu, tile, dan papan. Tabel dan struk bersudut 0. Badge jumlah di tile produk berbentuk pil. Semua border 2px; hanya struk memakai garis putus-putus 1px hitam seperti kertas thermal.

## Components

### Buttons
Tegas seperti papan harga, satu label per tombol.
- **Shape:** sudut 12px, tinggi minimal 48px, border 2px.
- **Default (sekunder):** putih, border dan teks tinta, berat 700.
- **Primary:** toska penuh, teks putih. Untuk tap berikutnya.
- **Danger:** putih, border dan teks cabai. Untuk void dan hapus.
- **Link:** tanpa border, teks toska.
- **Big:** tinggi 64px, 20px, lebar penuh. Untuk Bayar dan aksi utama sheet.
- **Disabled:** opasitas 0.4.
- **Focus:** satu gaya fokus di seluruh app, outline 3px tinta dengan offset 2px (lolos 3:1 di putih, abu, dan kuning).

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** putih. Di halaman login, kartu putih di atas abu.
- **Shadow Strategy:** tidak ada (lihat Elevation & Depth).
- **Border:** 2px abu.
- **Internal Padding:** 16px, gap 16px.

### Inputs / Fields
- **Style:** border 2px tinta, sudut 12px, latar putih, tinggi 48px, 16px.
- **Label:** di atas field, 14px berat 700.
- **Focus:** outline 3px tinta global.
- **Error:** pesan `role="alert"` dengan border dan teks cabai, selalu berupa kalimat.

### Navigation
- **HP:** bar bawah, item dibagi rata, 14px. Item aktif: blok toska penuh dengan teks putih.
- **Tablet:** rail kiri, item 48px bersudut 12px, aktif toska. Wordmark toska 20px di atas. Halaman owner dikelompokkan di bawah label redup "Pemilik" 14px. Nama user dan tombol link "Keluar" di bawah.
- Rail dan tile Beranda memakai satu daftar (`nav-links.ts`): urutan dan label selalu sama. Owner melihat Katalog, Kelola kasir, Laporan; kasir tidak.
- **HP:** owner pages dan "Keluar" dijangkau dari Beranda.

### Tables
- Rata, sudut 0. Header 14px dengan garis bawah 2px tinta. Belang abu di baris genap. Baris nonaktif redup.

### Papan Harga (signature)
Papan kuning dengan teks tinta 800. Dipakai untuk papan status Beranda (shift dan penjualan hari ini, dengan tombol aksi berikutnya), papan total di keranjang (angka 44px, turun baris kalau tidak muat) dan bar keranjang di HP (64px, menempel di atas nav, berisi jumlah item dan total).

### Tile Produk
Tombol putih dengan border abu, tinggi minimal 96px, padding 12px. Nama produk 20px di atas, harga 16px tabular di bawah, dan badge pil toska berisi jumlah di keranjang.

### Tombol Uang Cepat (signature)
Elemen paling diingat. Grid 2 kolom, tiap tombol 64px, tanpa border, warna uang kertas asli, teks putih 18px tabular yang tetap menulis nominal. Tombol "Uang pas" melintang penuh, abu dengan border tinta.

### Segmen Tunai / QRIS
Dua segmen sama lebar, 48px, border tinta. Yang terpilih toska penuh dengan teks putih. Radio tetap ada di urutan tab dan fokusnya tampil di label.

### Struk
Lebar 58 mm, hitam di atas putih, 13px tabular. Garis putus-putus 1px hitam di atas dan bawah item. Total 800. Tanda VOID dalam kotak border 2px hitam. Saat cetak, hanya struk yang tampil.

## Do's and Don'ts

### Do:
- **Do** pakai token dari `:root` di `base.css` (`--toska`, `--kuning`, ...), tidak pernah hex mentah. Satu-satunya pengecualian: warna uang kertas di `payment.css` dan hitam struk di `print.css`.
- **Do** buat tap berikutnya sebagai elemen terbesar: tombol primary, atau `.big` 64px di langkah bayar.
- **Do** beri `className="num"` pada sel uang (tabular, rata kanan, tanpa putus baris).
- **Do** jaga target sentuh minimal 48px; tile produk 96px, tombol uang cepat 64px.
- **Do** tulis status kosong, loading, dan error sebagai kalimat yang menyebut apa yang terjadi dan apa yang harus di-tap.

### Don't:
- **Don't** pakai warna uang kertas di luar tombol uang cepat.
- **Don't** tampilkan bahaya dengan warna saja; `cabai` selalu disertai teks.
- **Don't** pakai bayangan, gradien, atau blur.
- **Don't** pakai berat font di bawah 500, huruf kapital semua, atau eyebrow label.
- **Don't** taruh teks putih di atas `kuning`.
- **Don't** buat lebih dari satu elemen keras per layar.
- **Don't** beri warna pada struk; struk hitam di atas putih.
