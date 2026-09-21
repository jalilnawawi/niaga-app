# Code Conventions

Rules for all code in this repo. Existing code that breaks a rule is fixed when touched, not in a big-bang refactor.

## General

- **Max 200 lines per file** in `apps/*` and `packages/*` (tests and generated migrations exempt). Enforced by ESLint `max-lines`. Hitting the limit means the file does two jobs: split by responsibility, not by cutting at line 200.
- File names: `kebab-case`. React components: `PascalCase.tsx`. One component per file.
- Group by **feature module first, layer second**. Everything for `product` lives together; you should never jump across five top-level folders for one feature.
- Types flow from one source. zod schema → `z.infer`. Drizzle table → `$inferSelect`. Never hand-write a type that duplicates a schema.
- `import type` for type-only imports (lint enforced).
- Tests sit next to the code: `product.service.test.ts` beside `product.service.ts`.
- No speculative abstractions: no base classes, generic repositories, DI containers, or interfaces with one implementation. Plain functions and modules.
- Comments explain *why*, not *what*. Deliberate shortcuts get a `ponytail:` comment naming the limit and the upgrade path.

## Backend (`apps/api`)

Layers: **model → repository → dto → service → controller**.

```
apps/api/src/
  index.ts                     # app wiring: middleware, onError, .route() per module
  env.ts                       # Hono Env (bindings + variables)
  db/
    client.ts                  # createDb
    schema.ts                  # barrel: re-exports every *.model.ts (drizzle-kit + client read this)
  lib/
    errors.ts                  # AppError
    validate.ts                # zValidator wrapper: 400 { error: 'invalid_input' }
  modules/
    product/
      product.model.ts
      product.repository.ts
      product.service.ts
      product.controller.ts
      product.middleware.ts    # optional: Hono middleware other modules reuse (e.g. auth's requireAuth)
      product.service.test.ts
      pricing.ts               # optional: pure helpers used only by this module
packages/shared/src/
  dto/
    product.dto.ts             # zod request/response schemas, shared with web
```

### Model — `<module>.model.ts`

- Drizzle table definitions, enums and row types (`typeof products.$inferSelect`) only. No logic.
- Every tenant-owned table has `tenantId uuid not null references tenants(id)` and an index that starts with `tenantId`.
- Integrity lives in the DB: `not null`, `unique`, foreign keys, check constraints. App code does not re-check what a constraint guarantees.
- Money is an integer in the smallest unit (rupiah), never a float.
- Schema change = `bun run db:generate`, commit the migration. Never edit an applied migration.

### Repository — `<module>.repository.ts`

- The only layer that imports `drizzle-orm` or model tables.
- Plain exported functions; `db` is the first argument: `findProductById(db, tenantId, id)`.
- **Every query on a tenant-owned table filters by `tenantId`.** It is a required argument, never optional. This is the multi-tenant security boundary. The only exception is auth lookups that run before a tenant is known (login by email, session lookup); comment them as such.
- No business rules, no HTTP, no thrown `AppError`. Return rows or `undefined`.
- `neon-http` has no interactive transactions. For atomic writes, return the unexecuted query builders and let the service run them together with `db.batch([...])`.

### DTO — `packages/shared/src/dto/<module>.dto.ts`

- zod schemas for request bodies, query params and responses, plus `z.infer` types.
- Lives in `packages/shared` so the web forms validate with the exact same rules as the API.
- Name by intent: `createProductSchema`, `updateProductSchema`, `productListQuerySchema`, type `CreateProduct`.
- Normalise here (`trim`, `toLowerCase`) and bound every string/array (`max`), so the service receives clean, size-limited input.
- Responses never expose model internals (`passwordHash`, `tenantId` where not needed). Map rows to the DTO shape in the service.

### Service — `<module>.service.ts`

- Business logic and orchestration. Calls repositories, other services, external APIs.
- Framework-free: no Hono `Context`, no `c.json`, no cookies. Takes plain arguments (`db`, `tenantId`, validated DTO) so it is unit-testable.
- Signals failure with `throw new AppError(status, 'snake_case_code')`. The code is a stable string the web can branch on (`email_taken`, `insufficient_stock`).
- Authorization rules (role checks) belong here or in controller middleware, never in repositories.

### Controller — `<module>.controller.ts`

- A Hono router: `export const productController = new Hono<Env>().get(...).post(...)`.
- **Keep the chain.** Routes must be chained and mounted with `.route()` in `index.ts`, or the web loses `AppType` inference.
- Per route: auth middleware, `validate(target, schema)` from `lib/validate.ts` (never raw `zValidator`), one service call, `c.json(result, status)`. Nothing else.
- Reads `tenantId` from the session (`c.var.user.tenant.id`), never from the request body or params.
- No `drizzle-orm` imports.
- HTTP-only concerns (cookies, headers) stay here or in `<module>.middleware.ts`; the service returns plain data such as a session token.

### Dependency direction

```
controller → service → repository → model
     ↘          ↘
        dto (shared)
```

A layer imports only layers to its right. Modules call each other through services, never through another module's repository.

### Errors

- One `app.onError` in `index.ts` turns `AppError` into `{ error: code }` with its status, and anything else into a logged `500 { error: 'internal' }`. Stack traces never reach the client.
- Validation failures return `400 { error: 'invalid_input' }` through `validate()`.

## Frontend (`apps/web`)

Layers: **types → api → components → pages**.

```
apps/web/src/
  main.tsx
  App.tsx                      # providers + router only
  types/                       # UI-only types (form state, view models)
  api/
    client.ts                  # hc<AppType> instance
    product.api.ts             # typed calls per module
  hooks/                       # shared stateful logic, only when used by 2+ components
  components/
    ui/                        # generic: Button, Input, Modal (no API calls, no domain terms)
    product/                   # domain components: ProductCard, ProductForm
  pages/
    ProductListPage.tsx        # one per route
```

### Types — `types/`

- Domain and API types are **not** declared here. Import them from `@niaga/shared` or derive with `InferResponseType` from `hono/client`.
- Only types the UI invents: form state, table column config, view models.

### API — `api/<module>.api.ts`

- The only place that touches the Hono RPC client.
- One exported function per endpoint: `listProducts(query)`, `createProduct(input)`.
- Unwraps the response: returns typed data on success, throws an `ApiError` carrying the backend `error` code otherwise. Components never see `Response` objects.

### Components — `components/`

- `ui/`: presentational, props in, events out. No API calls, no business terms.
- `<feature>/`: may use domain types; still receive data via props. Data loading stays in pages (or a hook the page calls).
- Props typed with a `type Props = {...}` in the same file.
- Forms validate with the shared DTO schema before submitting.
- Accessibility basics are not optional: real `<button>`/`<label>`, keyboard reachable, visible focus.

### Pages — `pages/<Name>Page.tsx`

- One per route. Loads data via `api/`, handles loading / error / empty states, composes components.
- No reusable UI defined inside a page file; extract to `components/` once it is used twice or pushes the page past 200 lines.

### Dependency direction

```
pages → components → types
  ↘         ↘
   api  →  types
```

`components/ui` imports nothing from `api/` or `pages/`. Nothing imports from `pages/`.

## Checklist before a PR

- `bun run lint && bun run typecheck && bun test` pass.
- New tenant-owned query filters by `tenantId`.
- No file over 200 lines.
- Schema change has its generated migration committed.
