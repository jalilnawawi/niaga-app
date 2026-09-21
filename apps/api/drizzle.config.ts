import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

// drizzle-kit talks plain Postgres, so the local URL points at the docker host port (5434) directly.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: { url: url.replace('db.localtest.me:5432', 'localhost:5434') },
});
