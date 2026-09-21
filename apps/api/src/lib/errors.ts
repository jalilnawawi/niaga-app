import type { ContentfulStatusCode } from 'hono/utils/http-status';

// Thrown by services; app.onError turns it into `{ error: code }` with this status.
export class AppError extends Error {
  constructor(
    readonly status: ContentfulStatusCode,
    readonly code: string,
  ) {
    super(code);
  }
}
