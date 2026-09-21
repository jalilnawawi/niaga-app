# Niaga

Multi-tenant POS for food courts. Bun workspaces monorepo.

- `apps/api`: Hono on Cloudflare Workers, Drizzle + Neon (`neon-http`)
- `apps/web`: Vite + React, calls the API through the Hono RPC client (type-only import of `AppType`)
- `packages/shared`: zod schemas and shared types

## Local development

```sh
bun install
bun run db:up                                    # Postgres (host port 5434) + local-neon-http-proxy (4444)
cp apps/api/.dev.vars.example apps/api/.dev.vars # DATABASE_URL for wrangler dev
cp apps/web/.env.example apps/web/.env           # VITE_API_URL
bun run dev                                      # api on :8787, web on :5173
```

Migrations (run from `apps/api`, with `DATABASE_URL` set):

```sh
bun run db:generate
bun run db:migrate
```

## Checks

```sh
bun run lint
bun run typecheck
bun test                                         # DB tests skip unless DATABASE_URL is set (local DB, migrated)
bun run --filter '@niaga/web' build && bun run check:web-bundle
```

## Deploy

GitHub Actions deploys `apps/api` and `apps/web` separately, filtered by changed paths.
Required repository settings:

- Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `DATABASE_URL` (production, used for migrations)
- Variables: `VITE_API_URL`
- Worker secret: `wrangler secret put DATABASE_URL` in `apps/api`
