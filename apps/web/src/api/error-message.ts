import { ApiError } from './client';

const MESSAGES: Record<string, string> = {
  email_taken: 'Email sudah terdaftar.',
  invalid_credentials: 'Email atau password salah.',
  invalid_input: 'Data yang diisi tidak valid.',
  user_inactive: 'Akun ini dinonaktifkan. Hubungi owner.',
  user_not_found: 'User tidak ditemukan.',
  forbidden: 'Anda tidak punya akses.',
  category_not_found: 'Kategori tidak ditemukan.',
  category_in_use: 'Kategori masih dipakai produk. Pindahkan produknya dulu.',
  product_not_found: 'Produk tidak ditemukan.',
  product_unavailable: 'Ada produk yang sudah nonaktif. Muat ulang halaman.',
  insufficient_payment: 'Uang yang dibayar kurang.',
  order_not_found: 'Transaksi tidak ditemukan.',
  order_already_void: 'Transaksi sudah di-void.',
  shift_not_open: 'Belum ada shift yang dibuka. Buka shift dulu.',
  shift_already_open: 'Shift Anda masih terbuka.',
  shift_not_found: 'Shift tidak ditemukan.',
  too_many_attempts: 'Terlalu banyak percobaan. Coba lagi dalam 1 menit.',
};

// Turns an ApiError code or a failed shared-schema parse into text for the user.
export function errorMessage(e: unknown): string {
  if (e instanceof ApiError) return MESSAGES[e.code] ?? e.code;
  // zod's parse throws ZodError; web has no direct zod import to instanceof against.
  if (e instanceof Error && e.name === 'ZodError') return (e as unknown as { issues: { message: string }[] }).issues[0]!.message;
  return String(e);
}
