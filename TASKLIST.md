# Tasklist

Daftar pekerjaan Niaga dari commit `617b689` sampai production. Centang item saat selesai, dan tulis hash commitnya di akhir baris.
Urutan fase = urutan kerja. Tiap fitur mengikuti [CONVENTIONS.md](CONVENTIONS.md) (model → repository → dto → service → controller, lalu api → components → pages).

## Sudah selesai

- [x] Scaffold monorepo, CI per app, guard type-only import `@niaga/api` — `5d355ff`
- [x] Auth email + password, signup tenant + owner, session cookie — `fb55b7b`
- [x] Struktur modul berlapis + CONVENTIONS.md — `bf255b9`
- [x] Error validasi seragam `{ error: 'invalid_input' }` — `617b689`

## 0. Keputusan produk (blokir fase 2–4)

- [ ] Model tenant: satu tenant = pengelola food court (banyak stand), atau satu tenant = satu stand?
- [ ] Metode bayar di MVP: tunai saja, atau tunai + QRIS (statis / payment gateway)?
- [ ] Struk: cetak thermal (Bluetooth/USB), tampil di layar, atau tanpa struk?
- [ ] Perlu mode offline? Kalau ya, fase 3 jauh lebih besar.
- [ ] Stok dilacak di MVP atau belakangan?

## 1. Fondasi

- [ ] Web: pasang router (hapus `ponytail:` di `App.tsx`) begitu ada halaman login kedua
- [ ] Owner mengelola kasir: tambah, nonaktifkan, reset password (pindahkan `users` ke modul `user`)
- [ ] Middleware role (`requireRole('owner')`) untuk route khusus owner
- [ ] Batasi percobaan login (rate limit per email/IP)
- [ ] Hapus session kedaluwarsa (cron trigger Worker atau hapus saat lookup)

## 2. Katalog

- [ ] Kategori produk (CRUD, per tenant)
- [ ] Produk: nama, harga integer rupiah, kategori, aktif/nonaktif (CRUD, per tenant)
- [ ] Halaman katalog untuk owner

## 3. Transaksi (inti POS)

- [ ] Model `orders` + `order_items`; item menyimpan snapshot nama dan harga saat transaksi
- [ ] Buat order dari keranjang dalam satu `db.batch`
- [ ] Pembayaran tunai: jumlah dibayar, kembalian, validasi kurang bayar
- [ ] Nomor struk berurutan per tenant per hari (dijaga unique constraint)
- [ ] Void / refund, hanya owner, dengan alasan
- [ ] Halaman kasir: grid produk, keranjang, bayar, struk
- [ ] Riwayat transaksi hari ini

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
