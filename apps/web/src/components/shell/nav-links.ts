// One list for the rail and the Beranda tiles, so order and labels never drift apart.
export const navLinks = [
  { to: '/jual', label: 'Jual', hint: 'Catat penjualan dan cetak struk', owner: false },
  { to: '/riwayat', label: 'Riwayat', hint: 'Transaksi dan struk hari ini', owner: false },
  { to: '/shift', label: 'Shift', hint: 'Buka dan tutup shift, hitung kas', owner: false },
  { to: '/katalog', label: 'Katalog', hint: 'Produk, harga, dan kategori', owner: true },
  { to: '/kasir', label: 'Kelola kasir', hint: 'Tambah kasir dan reset password', owner: true },
  { to: '/laporan', label: 'Laporan', hint: 'Penjualan per hari, produk, kasir', owner: true },
];
