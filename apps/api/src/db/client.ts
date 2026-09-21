import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Route the local docker compose host to local-neon-http-proxy; everything else goes to Neon.
const LOCAL_HOST = 'db.localtest.me';
neonConfig.fetchEndpoint = (host) =>
  host === LOCAL_HOST ? `http://${host}:4444/sql` : `https://${host}/sql`;

export function createDb(databaseUrl: string) {
  return drizzle({ client: neon(databaseUrl), schema });
}

export type Db = ReturnType<typeof createDb>;
