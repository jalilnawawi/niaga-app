import { hc } from 'hono/client';
import type { AppType } from '@niaga/api';

export const client = hc<AppType>(import.meta.env.VITE_API_URL, {
  init: { credentials: 'include' },
});

// `code` is the backend's `{ error }` string, e.g. 'email_taken'.
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
  }
}

type Ok<R> = R extends { ok: true; json(): Promise<infer T> } ? T : never;

// Returns the success body, typed from AppType; throws ApiError otherwise.
export async function unwrap<R extends { ok: boolean; status: number; json(): Promise<unknown> }>(res: R): Promise<Ok<R>> {
  if (res.ok) return res.json() as Promise<Ok<R>>;
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  throw new ApiError(res.status, body.error ?? `http_${res.status}`);
}
