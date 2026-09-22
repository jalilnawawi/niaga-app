# Tasklist

Daftar pekerjaan Niaga dari commit `617b689` sampai production. Centang item saat selesai, dan tulis hash commitnya di akhir baris.
Urutan fase = urutan kerja. Tiap fitur mengikuti [CONVENTIONS.md](CONVENTIONS.md) (model → repository → dto → service → controller, lalu api → components → pages).

## Sudah selesai

- [x] Scaffold monorepo, CI per app, guard type-only import `@niaga/api` — `5d355ff`
- [x] Auth email + password, signup tenant + owner, session cookie — `fb55b7b`
- [x] Struktur modul berlapis + CONVENTIONS.md — `bf255b9`
- [x] Error validasi seragam `{ error: 'invalid_input' }` — `617b689`

## 0. Keputusan produk (blokir fase 2–4)

- [x] Model tenant: satu tenant = satu stand
- [x] Metode bayar MVP: tunai + QRIS statis (kasir tandai lunas manual, tanpa gateway)
- [x] Struk: tampil di layar, cetak via `window.print()`; printer thermal belakangan
- [x] Mode offline: tidak, online saja
- [x] Stok: belakangan

## 1. Fondasi

- [x] Web: pasang router (hapus `ponytail:` di `App.tsx`) begitu ada halaman login kedua
- [x] Owner mengelola kasir: tambah, nonaktifkan, reset password (pindahkan `users` ke modul `user`)
  - [x] API `/users`: list, tambah kasir, `PATCH` aktif/password (cabut semua session) — `f5e075e`
  - [x] Halaman kelola kasir di web (`/kasir`) — `d060ad3`
- [x] Middleware role (`requireRole('owner')`) untuk route khusus owner
- [x] Batasi percobaan login (rate limit per email/IP)
- [x] Hapus session kedaluwarsa (dihapus per user saat login)

## 2. Katalog

- [x] Kategori produk (CRUD, per tenant) — `f5a6520`
- [x] Produk: nama, harga integer rupiah, kategori, aktif/nonaktif (CRUD, per tenant) — `f5a6520`
- [x] Halaman katalog untuk owner (`/katalog`) — `f5a6520`

## 3. Transaksi (inti POS)

- [x] Model `orders` + `order_items`; item menyimpan snapshot nama dan harga saat transaksi — `84f731d`
- [x] Buat order dari keranjang dalam satu `db.batch` — `84f731d`
- [x] Pembayaran tunai: jumlah dibayar, kembalian, validasi kurang bayar — `84f731d`
- [x] Pembayaran QRIS statis: kasir tandai lunas, metode tercatat di order — `84f731d`
- [x] Nomor struk berurutan per tenant per hari (dijaga unique constraint) — `84f731d`
- [x] Void / refund, hanya owner, dengan alasan — `84f731d`
- [x] Halaman kasir: grid produk, keranjang, bayar, struk — `84f731d`
- [x] Riwayat transaksi hari ini — `84f731d`

## 4. Shift dan kas

- [x] Buka shift dengan modal awal, tutup shift dengan hitung kas — `e071de7`
- [x] Selisih kas tercatat per shift per kasir — `e071de7`

## 5. Laporan

- [x] Penjualan per hari / rentang tanggal (zona waktu Asia/Jakarta) — `ceb5a04`
- [x] Penjualan per produk dan per kasir — `ceb5a04`
- [x] Export CSV — `ceb5a04`

## 6. Desain UI

Web belum punya CSS sama sekali; satu-satunya CSS adalah aturan print struk di `index.html`. Pertama tentukan arah visual dengan skill `frontend-design`. Lalu buat draft di canvas Superdesign. Implementasi dimulai setelah satu arah dipilih.

### 6a. Brief dan arah visual

- [x] Keputusan: perangkat kasir = HP (portrait) dan tablet (landscape). Halaman Jual didesain untuk dua layout ini, laptop cukup ikut layout tablet
- [x] Brief singkat: pengguna, tempat pakai, dan alur utama, tertulis di bagian Product context pada `.superdesign/design-system.md`
- [x] Tema utama: gabungan **Uang rupiah** dan **Gerobak stand**
  - Kerangka dari gerobak stand: warna cat gerobak (toska, kuning, merah cabai) di atas putih, tombol besar dan tegas seperti papan harga, terbaca di layar terang
  - Warna pecahan rupiah hanya untuk tombol uang cepat di `PaymentForm` (Rp100.000 merah, Rp50.000 biru, Rp20.000 hijau, Rp10.000 ungu), tiap tombol tetap menampilkan nominalnya
  - Satu elemen paling diingat: tombol uang cepat. Bagian lain tetap tenang agar tidak berebut perhatian
  - Font: Plus Jakarta Sans (dibuat untuk identitas kota Jakarta)
  - Selesaikan di rencana desain: merah cabai dan merah Rp100.000 berdekatan, jadi status bahaya (void, kurang bayar) wajib punya teks, bukan warna saja
- [x] `superdesign init`: analisis repo ke `.superdesign/init/`. Folder itu masuk `.gitignore` karena bisa dibuat ulang; hanya `design-system.md` yang di-commit
- [x] Rencana desain sesuai `frontend-design` di `.superdesign/design-system.md`: 6 warna dasar dan 4 warna pecahan (semua lolos kontras WCAG AA), Plus Jakarta Sans, layout HP dan tablet, prinsip. Semua draft memakai file ini

### 6b. Draft di canvas Superdesign

- [x] Halaman Jual (`/jual`) lebih dulu karena paling sering dipakai. Dua arah dari model berbeda dibandingkan untuk tablet landscape; arah A dipilih
- [x] Pilih satu arah, kunci token warna, font, dan jarak. Revisi A: grid 4 kolom, keranjang tanpa harga satuan, tombol Bayar selalu terlihat
- [x] Halaman Jual versi HP portrait dari arah A: grid 2 kolom, bar total kuning di atas navigasi bawah
- [x] Sheet keranjang dan pembayaran versi HP
- [x] Draft halaman lain dengan arah yang sama: Login, Beranda, Riwayat, Shift, Kasir, Katalog, Laporan
- [x] Draft struk cetak untuk kertas thermal 58 mm (tetap lewat `window.print()`)
- [x] Draft state loading, error, dan kosong (belum ada produk, shift belum dibuka, laporan tanpa data)

### 6c. Implementasi di `apps/web`

- [x] Token sebagai CSS custom properties di `:root`, font, dan style dasar. CSS biasa, tanpa library UI atau CSS baru — `a374551`
- [x] Cek Plus Jakarta Sans mendukung angka tabular (`tnum`) agar kolom rupiah rata: didukung (subset latin Google Fonts punya fitur `tnum`) — `a374551`
- [x] Aturan styling ditambahkan ke CONVENTIONS.md: letak file CSS dan batas 200 baris juga berlaku untuk CSS — `a374551`
- [x] Pindahkan print CSS struk dari `index.html` ke file CSS — `a374551`
- [x] Shell aplikasi: navigasi per role (owner melihat Kasir, Katalog, Laporan; kasir tidak) — `a374551`
- [x] Komponen `components/ui/` yang dipakai 2+ tempat saja: tombol dan field cukup class CSS (`primary`, `danger`, label bawaan), `DataTable` sudah ada — `a374551`
- [x] Terapkan per halaman, urut: Jual, Shift, Riwayat, Katalog, Kasir, Laporan, Login, Beranda — `a374551`
- [x] Aksesibilitas: fokus terlihat, kontras WCAG AA, target sentuh minimal 44px, `prefers-reduced-motion` dihormati — `a374551`
- [x] Cek lebar 360px (HP) dan tablet lewat screenshot Chrome DevTools, tanpa scroll horizontal — `a374551`
- [ ] Cek cetak struk di print preview
- [x] `bun run lint && bun run typecheck && bun test` hijau — `a374551`

## 7. Persiapan deploy

- [ ] Domain di Cloudflare; aktifkan `routes` di kedua `wrangler.toml` (web dan api satu site agar cookie jalan)
- [ ] `WEB_ORIGIN` production di `apps/api/wrangler.toml`
- [ ] Database Neon production + branch untuk staging
- [ ] GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `DATABASE_URL`; variable `VITE_API_URL`
- [ ] `wrangler secret put DATABASE_URL` untuk Worker production
- [ ] Observability Worker aktif (logs) dan error 500 tercatat
- [ ] Cek backup / point-in-time restore Neon
- [ ] Security review sebelum rilis: filter `tenantId`, cookie, CSRF, rate limit

## 8. Deploy

- [ ] `bun run lint && bun run typecheck && bun test` hijau di CI
- [ ] Migrasi production jalan lewat CI
- [ ] Deploy api dan web
- [ ] Smoke test production: signup, login, buat produk, transaksi, laporan
- [ ] Onboarding tenant pertama
