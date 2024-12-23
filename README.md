# TRPC + React + Hono Monorepo Template

A production-ready monorepo setup with tRPC, React, and Hono.

## Project Structure

```
my-monorepo/
├── package.json
├── packages/
│   ├── server/
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts    # Server entry point
│   │       ├── exports.ts  # Public API exports
│   │       └── trpc.ts     # tRPC router setup
│   ├── client/
│   │   ├── package.json
│   │   └── src/
│   │       └── main.tsx
│   ├── schemas/
│   │   ├── package.json
│   │   └── src/
│   │       └── index.ts
│   └── types/
│       ├── package.json
│       └── index.ts
```

## Package Configuration

Each package follows this structure:

```json
{
  "name": "@template/[package-name]",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

## Package Imports

Import from other packages using the workspace protocol:

```typescript
import { userSchema } from "@template/schemas";
import type { AppRouter } from "@template/server";
```

## Development

1. Install dependencies:
```bash
bun install
```

2. Start development servers:
```bash
bun run dev
```

## Production

1. Build all packages:
```bash
bun run build
```

2. Start production server:
```bash
bun run start:prod
```

## Environment Variables

Production environment variables can be set in `.env.production`:
```env
NODE_ENV=production
PORT=3000
```

## Package Structure

- `server`: Hono server with tRPC integration
- `client`: React app with tRPC client
- `schemas`: Shared Zod schemas
- `types`: Shared TypeScript types

## Best Practices

1. Only import from package public APIs (exports.ts or index.ts)
2. Use workspace protocol for internal dependencies
3. Keep package.json exports field up to date
4. Follow the monorepo build order through turbo.json
