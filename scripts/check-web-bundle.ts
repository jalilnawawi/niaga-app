// Fails when the built web bundle contains server-only code or secrets.
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'apps/web/dist';
const FORBIDDEN = [
  /drizzle-orm/i,
  /@neondatabase/i,
  /neon\.tech/i,
  /DATABASE_URL/,
  /postgres(ql)?:\/\//i,
];

const files = await readdir(DIST, { recursive: true });
const hits: string[] = [];
for (const file of files) {
  if (!/\.(js|html|css|map)$/.test(file)) continue;
  const text = await Bun.file(join(DIST, file)).text();
  for (const pattern of FORBIDDEN) {
    if (pattern.test(text)) hits.push(`${file}: ${pattern}`);
  }
}

if (hits.length > 0) {
  console.error('Server-only strings found in web bundle:\n' + hits.join('\n'));
  process.exit(1);
}
console.log(`Web bundle clean (${files.length} files checked).`);
