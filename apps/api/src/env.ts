import type { Db } from './db/client';
import type { RateLimit } from '@cloudflare/workers-types/index';

export type Env = {
  Bindings: {
    DATABASE_URL: string;
    WEB_ORIGIN: string;
    AUTH_LIMITER: RateLimit;
  };
  Variables: {
    db: Db;
  };
};
