# TRPC + React + Hono Monorepo Template

A monorepo template for a production-ready tRPC, React, Hono, and Bun setup that uses built packages.

## Project Structure

```
my-monorepo/
├── package.json
├── packages/
│   ├── server/        # Hono server with tRPC
│   ├── client/        # React app with tRPC client
│   ├── schemas/       # Shared Zod schemas
│   └── trpc/          # tRPC router setup
└── tooling/
    └── tsconfig/      # Shared TypeScript configs
```

## Getting Started

* Find and replace `xyz` with your project name.
* Run `bun install` to install dependencies.
* Run `bun run build` just once to build all packages.
* Run `bun run dev` to start the development server.

## Package Configuration

Each package follows this structure:

```json
{
  "name": "@xyz/[package-name]",
  "private": true,
  "type": "module",
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

## Package Types

We have three types of packages:

1. **Client Packages** (using Vite):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

2. **Library Packages** (using tsup + tsc):
```json
{
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsc -p tsconfig.build.json",
    "typecheck": "tsc --noEmit"
  }
}
```

3. **Server Packages** (using Bun):
```json
{
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "build": "tsc -p tsconfig.build.json",
    "typecheck": "tsc --noEmit"
  }
}
```

## Creating a New Package

We provide a CLI tool to create new packages:

```bash
bun run create-package
```

This will:
1. Ask for the package name
2. Ask if it's a client package (using Vite) or not
3. Let you select dependencies from other workspace packages
4. Generate all necessary files:
   - package.json
   - tsconfig.json
   - tsconfig.build.json (for non-client packages)
   - tsup.config.ts (for non-client packages)
   - src/index.ts

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

## Package Structure

Each package includes:

- `src/index.ts` - Main entry point and public API
- `tsconfig.json` - Development configuration
  - Uses `emitDeclarationOnly` for type checking
- `tsconfig.build.json` - Production build configuration
  - Used by `tsc` for final builds
- `tsup.config.ts` (non-client packages)
  - Fast development builds with watch mode
  - Type generation during development

## Best Practices

1. Use the create-package script for new packages
2. Only import from package public APIs (index.ts)
3. Use workspace protocol for internal dependencies
4. Keep package.json exports field up to date
5. Follow the monorepo build order through turbo.json

## Environment Variables

Production environment variables can be set in `.env.production`:
```env
NODE_ENV=production
PORT=3000