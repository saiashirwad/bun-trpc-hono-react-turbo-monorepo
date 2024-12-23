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

## Creating a New Package

1. Create the package structure:
```bash
packages/your-package/
├── package.json
├── tsconfig.json
└── src/
    └── index.ts
```

2. Configure package.json:
```json
{
  "name": "@template/your-package",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "bun build ./src/index.ts --outdir ./dist",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist node_modules .turbo"
  },
  "dependencies": {
    "@template/schemas": "workspace:*"
  }
}
```

Note: For packages that need both type declarations and bundling (like the server package), use:
```json
{
  "scripts": {
    "build": "tsc --build && bun build ./src/index.ts --outdir ./dist"
  }
}
```

For client-side packages using Vite:
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "dev": "vite"
  }
}
```

3. Configure tsconfig.json:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["./src/**/*.ts"],
  "references": [
    // Add references to dependent packages
    { "path": "../schemas" }
  ]
}
```

4. Add to root tsconfig.json references:
```json
{
  "references": [
    // ... existing references
    { "path": "./packages/your-package" }
  ]
}
```

5. Create src/index.ts:
```typescript
// Export your package's public API
export function yourFunction() {
  return "Hello from your package!";
}
```

### Package Development Checklist

- [ ] Package structure created
- [ ] package.json configured
  - [ ] Correct name (@template/*)
  - [ ] Main and types fields set
  - [ ] Exports field configured
  - [ ] Build scripts added
  - [ ] Dependencies declared
- [ ] tsconfig.json configured
  - [ ] Extends root config
  - [ ] Proper outDir and rootDir
  - [ ] References to dependent packages
- [ ] Root configuration updated
  - [ ] Added to root tsconfig.json references
  - [ ] Verified build order in turbo.json
- [ ] Source files created
  - [ ] index.ts with public exports
  - [ ] Types properly exported
- [ ] Package builds successfully
  - [ ] `bun run build` works
  - [ ] Types are generated
  - [ ] Can be imported by other packages
