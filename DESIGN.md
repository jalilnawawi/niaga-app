---
name: Niaga
description: POS untuk stand food court, ditulis seperti buku nota rangkap karbon.
colors:
  kertas: "#ffffff"
  tinta: "#15172b"
  karbon: "#3b3fa3"
  garis: "#d7dcef"
  garis-tua: "#8e98c7"
  cap: "#c8302a"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1
    fontVariation: "'wdth' 75"
    fontFeature: "tnum"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 800
    lineHeight: 1.1
    fontVariation: "'wdth' 75"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.1
    fontVariation: "'wdth' 75"
  tally:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.1
    fontVariation: "'wdth' 75"
  entry:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    fontVariation: "'wdth' 87.5"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 450
    lineHeight: 1.45
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 650
  stamp:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 900
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 75"
  receipt:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 450
    fontFeature: "tnum"
rounded:
  sm: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "36px"
components:
  button:
    backgroundColor: "{colors.kertas}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.sm}"
    padding: "8px 18px"
    height: "48px"
  button-primary:
    backgroundColor: "{colors.karbon}"
    textColor: "{colors.kertas}"
    rounded: "{rounded.sm}"
    padding: "8px 18px"
    height: "48px"
  button-danger:
    backgroundColor: "{colors.kertas}"
    textColor: "{colors.cap}"
    rounded: "{rounded.sm}"
    height: "48px"
  button-big:
    backgroundColor: "{colors.karbon}"
    textColor: "{colors.kertas}"
    typography: "{typography.entry}"
    rounded: "{rounded.sm}"
    height: "64px"
    width: "100%"
  input:
    textColor: "{colors.karbon}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "48px"
  price-cell:
    backgroundColor: "{colors.kertas}"
    textColor: "{colors.tinta}"
    typography: "{typography.entry}"
    padding: "14px"
    height: "104px"
  nota-strip:
    backgroundColor: "{colors.karbon}"
    textColor: "{colors.kertas}"
    typography: "{typography.title}"
    height: "64px"
  quick-cash:
    backgroundColor: "{colors.kertas}"
    textColor: "{colors.tinta}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    height: "56px"
  stamp-lunas:
    textColor: "{colors.karbon}"
    typography: "{typography.stamp}"
    rounded: "{rounded.sm}"
  stamp-void:
    textColor: "{colors.cap}"
    typography: "{typography.stamp}"
    rounded: "{rounded.sm}"
  nav-item-active:
    backgroundColor: "{colors.karbon}"
    textColor: "{colors.kertas}"
    rounded: "{rounded.sm}"
    height: "48px"
---

# Design System: Niaga

## Overview

**Creative North Star: "Buku Nota"**

Setiap penjualan adalah satu lembar buku nota kontan: ditulis baris demi baris, dijumlah di bawah garis ganda, lalu dicap LUNAS. Semua yang tercetak di formulir memakai tinta gelap. Semua yang ditulis atau diisi, yaitu nama barang di nota, angka, isian field, dan pilihan aktif, memakai karbon biru-ungu seperti salinan rangkap.

Kepadatan rendah dan presisi tinggi. Garis tipis biru pucat membagi kolom dan baris seperti kertas nota bergaris. Judul formulir memakai Archivo condensed yang tebal, sehingga terasa tercetak dan matang, bukan kartu admin generik. Kesan premium datang dari ketepatan garis dan huruf, bukan dari efek.

Status berbicara lewat cap karet: LUNAS dalam karbon, VOID dalam merah. Cap LUNAS jatuh sekali di struk tepat setelah pembayaran; itulah satu-satunya momen gerak di aplikasi.

**Key Characteristics:**
- Dua tinta di atas kertas putih: karbon dan merah cap. Tanpa isian abu dekoratif.
- Garis 1px biru pucat untuk ruling; garis ganda 3px tinta di atas setiap total dan di bawah setiap kepala tabel.
- Sudut 4px. Tanpa bayangan, gradien, atau blur.
- Judul condensed 800; angka uang tabular dan rata kanan di slot yang sama di mana pun.
- Setiap kontrol punya label tertulis; tidak ada tombol ikon saja.

## Colors

Strategi restrained: kertas putih, tinta cetak, dan karbon sebagai satu-satunya warna aksi. Merah hanya untuk masalah.

### Primary
- **Karbon Rangkap** (`karbon`): semua yang "ditulis": tombol primary, nav aktif, isian field, nama barang dan jumlah di nota, total, cap LUNAS, strip nota di HP. Cucian karbon 7% (`--karbon-cuci`) menandai sel terpilih dan hover.

### Tertiary
- **Merah Cap** (`cap`): VOID, hapus, error, dan kurang bayar. Selalu dengan teks.

### Neutral
- **Kertas Nota** (`kertas`): latar semua permukaan.
- **Tinta Cetak** (`tinta`): teks, judul, border tombol, garis ganda, cincin fokus. Teks redup (`--pudar`) adalah campuran 68% tinta dengan putih.
- **Garis Biru Pucat** (`garis`): ruling antarbaris dan antarkolom di tabel dan nota.
- **Garis Biru Tua** (`garis-tua`): tepi lembar, sel daftar harga, rail.

### Named Rules
**The Dua Tinta Rule.** Hanya karbon dan merah cap yang berwarna. Tidak ada warna ketiga, termasuk warna uang kertas.

**The Tulisan Karbon Rule.** Yang dicetak memakai tinta; yang ditulis atau dipilih memakai karbon. Kalau ragu, tanya: apakah kasir yang mengisinya?

**The Cap Bersuara Rule.** Status selalu berupa kata di dalam cap (LUNAS, VOID, "Kurang Rp5.000"), tidak pernah warna saja.

## Typography

**Font:** Archivo variable (sumbu `wdth` 62–125, `wght` 400–900), fallback `system-ui, sans-serif`. Satu keluarga: condensed (`font-stretch: 75%`) untuk kepala formulir, 87.5% untuk nama barang dan tombol besar, 100% untuk teks.

**Character:** Grotesk formulir cetak: tegas dan rapat di kepala, netral di badan teks.

### Hierarchy
- **Display** (800, 48px, condensed, tabular): total di langkah bayar dan wordmark login.
- **Headline** (800, 34px, condensed): judul halaman dan kepala "Nota".
- **Title** (800, 24px, condensed): judul bagian, baris total (`.board`), strip nota HP, tombol uang cepat.
- **Tally** (800, 28px, condensed): judul tile Beranda, kembalian, wordmark rail.
- **Entry** (700, 20px, 87.5%): nama produk di daftar harga, tombol besar.
- **Body** (450, 16px, line-height 1.45): teks, isian field.
- **Label** (650, 14px): label field, kepala tabel, nav, meta. Kepala kolom nota 13px.
- **Stamp** (900, 14px, condensed, huruf kapital, tracking 0.08em): cap status. Di struk 20px.
- **Receipt** (450, 13px, tabular): isi struk 58 mm.

### Named Rules
**The Angka Satu Slot Rule.** Uang selalu `tabular-nums`, rata kanan, tidak terputus baris.

**The Kapital Hanya Cap Rule.** Sentence case di mana pun. Satu-satunya teks huruf kapital semua adalah cap karet.

## Layout

Satu breakpoint: `900px`. HP portrait (360–430px) dan tablet landscape; laptop ikut tablet.

- **HP:** nav bawah 64px, border atas tinta, item aktif karbon dengan garis karbon 3px di tepi atas. Daftar harga 2 kolom. Nota terlipat jadi strip karbon 64px di atas nav (jumlah item dan total); tap membukanya jadi lembar penuh.
- **Tablet:** rail kiri 136px: wordmark di atas garis ganda, halaman kasir, grup "Pemilik", lalu user dan "Keluar" di bawah. Daftar harga isi-otomatis (min 176px). Nota di kolom kanan 400px dengan border kiri tinta; seluruh lembar scroll dan tombol Bayar menempel di kakinya.
- **Halaman lain:** `.page` padding 24px 16px (36px 40px di tablet), lebar maks 1200px, rata kiri.
- **Spasi:** 4, 8, 12, 16, 24, 36.

## Elevation & Depth

Rata sepenuhnya. Kedalaman datang dari garis (ruling, tepi lembar, garis ganda) dan dari cucian karbon untuk pilihan. `box-shadow` hanya dipakai sebagai garis inset (item nav aktif di HP, sel produk terpilih) dan sebagai strip kertas di belakang tombol Bayar yang menempel; tidak pernah sebagai bayangan.

### Named Rules
**The Kertas Rata Rule.** Tidak ada bayangan, gradien, atau blur. Pemisah adalah garis.

## Shapes

Sudut 4px di tombol, isian, lembar, dan cap. Sel daftar harga, tile Beranda, dan tabel bersudut 0 dan berbagi garis seperti kisi formulir. Isian field adalah titik-titik formulir: cucian karbon di atas garis bawah 2px tinta. Cap memakai border ganda 3px dan diputar −4° (−7° di struk).

## Components

### Buttons
- **Default:** kertas, border 1.5px tinta, 48px, berat 650. Hover cucian karbon; saat ditekan turun 1px.
- **Primary:** karbon penuh, teks putih; hover karbon lebih gelap.
- **Danger:** border dan teks merah cap.
- **Link:** teks karbon bergaris bawah.
- **Big:** 64px, lebar penuh, 20px 87.5% 800.
- **Focus:** outline 3px tinta, offset 2px, di seluruh aplikasi.

### Cards / Containers
- Lembar nota: kertas putih, border 1px garis tua, sudut 4px, padding 20px. Judul `h2` di atas garis ganda.

### Inputs / Fields
- Cucian karbon, garis bawah 2px tinta, tinggi 48px. Isinya ditulis dalam karbon 600.

### Navigation
- Lihat Layout. Rail dan tile Beranda memakai satu daftar (`nav-links.ts`). Tile Beranda adalah kisi bergaris, judul 28px condensed.

### Tables
- Kepala 14px 87.5% 700 di atas garis ganda; baris dan kolom dibagi garis biru pucat; tanpa belang. Baris void redup, total dicoret, dengan cap VOID.

### Baris Total
- `.board`: garis ganda di atas, garis tua di bawah, teks karbon condensed 24px. Dipakai di Beranda (status hari ini), Riwayat, Laporan, Shift, dan nota.

### Daftar Harga (signature)
- Kisi sel bergaris; nama 20px 87.5% di atas, harga 16px redup di bawah. Sel yang sudah masuk nota diberi cucian karbon, garis inset 2px karbon, dan kotak jumlah karbon.

### Nota (signature)
- Kepala "Nota" 34px dengan tanggal, garis ganda. Kolom "Barang | Jumlah". Tiap baris: nama barang karbon, lalu stepper dan jumlah. Total 48px karbon di bawah garis ganda.

### Pembayaran
- Tunai/QRIS sebagai dua sel dalam satu kotak tinta; terpilih karbon. Uang cepat: empat tombol 56px dengan nominal 24px condensed; "Uang pas" berborder putus-putus karbon. Kembalian 28px karbon; kurang bayar jadi cap merah berborder ganda.

### Cap (signature)
- LUNAS (karbon) dan VOID (merah) di Riwayat dan struk. Di struk yang baru dibayar, cap jatuh sekali: skala 1.6 ke 1 dan putar −12° ke −7° dalam 220ms ease-out; mati di `prefers-reduced-motion`. Saat cetak, cap hitam.

### Struk
- 58 mm, hitam di atas putih, 13px tabular, tanpa ruling nota. Hanya `.receipt` yang tercetak.

## Do's and Don'ts

### Do:
- **Do** pakai token `:root` di `base.css` (`--karbon`, `--garis`, ...). Satu-satunya hex mentah: hitam struk di `print.css`.
- **Do** tulis yang diisi kasir dalam karbon dan yang tercetak dalam tinta.
- **Do** taruh garis ganda di atas setiap total.
- **Do** tampilkan status sebagai cap berisi kata.
- **Do** jaga target sentuh: 48px umum (stepper 44px tinggi), sel harga 104px, uang cepat 56px, Bayar 64px.

### Don't:
- **Don't** tambah warna ketiga, termasuk warna uang kertas.
- **Don't** pakai bayangan, gradien, blur, atau isian abu dekoratif.
- **Don't** pakai huruf kapital semua di luar cap.
- **Don't** buat kartu bersudut besar; sel dan tabel berbagi garis, lembar bersudut 4px.
- **Don't** tambah animasi selain cap LUNAS.
