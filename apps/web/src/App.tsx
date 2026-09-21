import { useEffect, useState } from 'react';
import type { Health } from '@niaga/shared';
import { api } from './lib/api';

export function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.health
      .$get()
      .then((res) => res.json())
      .then(setHealth)
      .catch((e: unknown) => setError(String(e)));
  }, []);

  return (
    <main>
      <h1>Niaga</h1>
      {error && <p>API error: {error}</p>}
      {health && <p>API {health.status} · {health.time}</p>}
    </main>
  );
}
