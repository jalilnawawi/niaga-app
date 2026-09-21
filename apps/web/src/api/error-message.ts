import { ApiError } from './client';

const MESSAGES: Record<string, string> = {
  email_taken: 'Email sudah terdaftar.',
  invalid_credentials: 'Email atau password salah.',
  invalid_input: 'Data yang diisi tidak valid.',
  user_inactive: 'Akun ini dinonaktifkan. Hubungi owner.',
  user_not_found: 'User tidak ditemukan.',
  forbidden: 'Anda tidak punya akses.',
  too_many_attempts: 'Terlalu banyak percobaan. Coba lagi dalam 1 menit.',
};

// Turns an ApiError code or a failed shared-schema parse into text for the user.
export function errorMessage(e: unknown): string {
  if (e instanceof ApiError) return MESSAGES[e.code] ?? e.code;
  // zod's parse throws ZodError; web has no direct zod import to instanceof against.
  if (e instanceof Error && e.name === 'ZodError') return (e as unknown as { issues: { message: string }[] }).issues[0]!.message;
  return String(e);
}
