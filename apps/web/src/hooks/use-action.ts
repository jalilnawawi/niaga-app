import { useState } from 'react';
import { errorMessage } from '../api/error-message';

// Runs a mutation and keeps one error/notice line for the page. `run` resolves true on success so forms can reset.
export function useAction() {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function run(action: () => Promise<void>, done: string) {
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(done);
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    }
  }

  return { error, notice, setError, run };
}
