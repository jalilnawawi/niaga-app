// PBKDF2-SHA256 via WebCrypto. Workers caps PBKDF2 at 100k iterations.
const ITERATIONS = 100_000;
const enc = new TextEncoder();

const b64 = (b: Uint8Array) => btoa(String.fromCharCode(...b));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

// Format: pbkdf2$<iterations>$<salt>$<hash>, so iterations can change without breaking old hashes.
export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(await derive(password, salt, ITERATIONS))}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [, iter = '', salt = '', hash = ''] = stored.split('$');
  const expected = unb64(hash);
  const actual = await derive(password, unb64(salt), Number(iter));
  let diff = expected.length ^ actual.length;
  for (let i = 0; i < expected.length; i++) diff |= expected[i]! ^ (actual[i] ?? 0);
  return diff === 0;
}
