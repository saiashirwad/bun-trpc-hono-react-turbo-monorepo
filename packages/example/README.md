# Example Package

This is a template for creating new packages in the monorepo. It demonstrates proper setup and usage of shared schemas, types, and build configurations.

## Package Structure
```bash
packages/your-package/
├── package.json        # Package configuration
├── tsconfig.json      # TypeScript configuration
├── README.md          # Documentation
└── src/
    └── index.ts       # Main entry point
```

## Setup Steps

### 1. Package Configuration
Create a `package.json`:
```json
{
  "name": "@template/your-package",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc --build",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist node_modules .turbo"
  },
  "dependencies": {
    // Internal dependencies use workspace protocol
    "@template/schemas": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### 2. TypeScript Configuration
Create a `tsconfig.json`:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "declaration": true
  },
  "include": ["./src/**/*.ts"],
  "references": [
    // Add references to dependent packages
    { "path": "../schemas" }
  ]
}
```

### 3. Root Configuration Updates

1. Add to root `package.json` workspaces:
```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

2. Add to root `tsconfig.json` references:
```json
{
  "references": [
    { "path": "./packages/your-package" }
  ]
}
```

3. Ensure `turbo.json` pipeline includes your package:
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

## Usage Example

```typescript
import { validateUser } from '@template/example';

// Validate a user object
const user = validateUser({
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'user@example.com',
  name: 'John Doe',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## Development

1. Install dependencies:
```bash
bun install
```

2. Build the package:
```bash
bun run build
```

3. Type check:
```bash
bun run typecheck
```

4. Clean build artifacts:
```bash
bun run clean
```

## Common Issues

### 1. Build Order Problems
If you see type errors about missing declarations:
```bash
bun run clean
bun install
bun run build
```

### 2. Type Resolution Issues
- Ensure package is listed in root tsconfig.json references
- Check that dependent packages are built first
- Verify package.json main/types fields are correct

### 3. Import Errors
- Use `@template/` prefix for internal imports
- Check tsconfig.json paths configuration
- Ensure packages are properly built

## Best Practices

1. **Dependencies**
   - Use `workspace:*` for internal dependencies
   - Keep versions consistent across packages
   - Minimize external dependencies

2. **TypeScript**
   - Always export types for public APIs
   - Use strict type checking
   - Maintain proper project references

3. **Build Process**
   - Follow the monorepo build order
   - Keep build artifacts in `dist/`
   - Use clean script before rebuilds

4. **Code Organization**
   - Keep related functionality together
   - Export public API from index.ts
   - Document complex type definitions

## Contributing

1. Create your feature branch
2. Make your changes
3. Run type checks and builds
4. Submit a pull request

## License

This package is private and part of the @template monorepo.