import type { Db } from './db/client';

export type Env = {
  Bindings: {
    DATABASE_URL: string;
    WEB_ORIGIN: string;
  };
  Variables: {
    db: Db;
  };
};
