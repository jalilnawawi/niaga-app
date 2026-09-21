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

- [ ] Buka shift dengan modal awal, tutup shift dengan hitung kas
- [ ] Selisih kas tercatat per shift per kasir

## 5. Laporan

- [ ] Penjualan per hari / rentang tanggal (zona waktu Asia/Jakarta)
- [ ] Penjualan per produk dan per kasir
- [ ] Export CSV

## 6. Persiapan deploy

- [ ] Domain di Cloudflare; aktifkan `routes` di kedua `wrangler.toml` (web dan api satu site agar cookie jalan)
- [ ] `WEB_ORIGIN` production di `apps/api/wrangler.toml`
- [ ] Database Neon production + branch untuk staging
- [ ] GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `DATABASE_URL`; variable `VITE_API_URL`
- [ ] `wrangler secret put DATABASE_URL` untuk Worker production
- [ ] Observability Worker aktif (logs) dan error 500 tercatat
- [ ] Cek backup / point-in-time restore Neon
- [ ] Security review sebelum rilis: filter `tenantId`, cookie, CSRF, rate limit

## 7. Deploy

- [ ] `bun run lint && bun run typecheck && bun test` hijau di CI
- [ ] Migrasi production jalan lewat CI
- [ ] Deploy api dan web
- [ ] Smoke test production: signup, login, buat produk, transaksi, laporan
- [ ] Onboarding tenant pertama
