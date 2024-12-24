import fs from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  multiselect,
  outro,
  spinner,
  text,
} from '@clack/prompts'
import { $ } from 'bun'

type PackageConfig = {
  name: string
  isClient: boolean
  dependencies: string[]
}

async function appendToTsConfig(name: string) {
  try {
    const tsConfig = await Bun.file('tsconfig.json').json()
    // @ts-expect-error
    const references: string[] = tsConfig.references.map((dep) => dep.path)
    if (references.includes(name)) return
    tsConfig.references.push({ path: `./packages/${name}` })
    await Bun.write('tsconfig.json', JSON.stringify(tsConfig, null, 2))
  } catch (e) {
    console.error('Failed to append to tsconfig.json')
  }
}

async function getPackageConfig(): Promise<PackageConfig> {
  const name = await text({
    message: 'What is the name of your package?',
    placeholder: 'my-package',
    validate: (value) => {
      if (value.length === 0) return 'Package name is required'
      if (fs.existsSync(path.join('packages', value))) {
        return 'Package already exists'
      }
    },
  })

  if (isCancel(name)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  const isClient = await confirm({
    message: 'Is this a client-side package (using Vite)?',
  })

  if (isCancel(isClient)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  const packages = await readdir('packages')
  const dependencies = await multiselect({
    message: 'Select dependencies',
    options: packages.map((pkg) => ({
      value: pkg,
      label: `@template/${pkg}`,
    })),
    required: false,
  })

  if (isCancel(dependencies)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  return {
    name: name as string,
    isClient,
    dependencies: dependencies as string[],
  }
}

function generatePackageJson(config: PackageConfig): string {
  const deps = config.dependencies.reduce(
    (acc, dep) => {
      acc[`@template/${dep}`] = 'workspace:*'
      return acc
    },
    {} as Record<string, string>,
  )

  const scripts = config.isClient
    ? {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
      }
    : {
        build: 'tsup',
        dev: 'tsup --watch',
      }

  const devDeps = {
    ...(config.isClient ? {} : { tsup: '^8.3.5' }),
    typescript: '^5.7.2',
  }

  return JSON.stringify(
    {
      name: `@template/${config.name}`,
      private: true,
      type: 'module',
      exports: {
        './package.json': './package.json',
        '.': {
          types: './dist/index.d.ts',
          default: './dist/index.js',
        },
      },
      scripts: {
        ...scripts,
        typecheck: 'tsc --noEmit',
        clean: 'rm -rf dist node_modules .turbo',
      },
      dependencies: deps,
      devDependencies: devDeps,
    },
    null,
    2,
  )
}

function generateTsConfig(config: PackageConfig): string {
  return JSON.stringify(
    {
      extends: '../../tsconfig.json',
      compilerOptions: {
        outDir: './dist',
        rootDir: './src',
        composite: true,
        ...(config.isClient && {
          jsx: 'react-jsx',
          lib: ['DOM', 'DOM.Iterable', 'ESNext'],
        }),
      },
      include: [
        './src/**/*.ts',
        ...(config.isClient ? ['./src/**/*.tsx'] : []),
      ],
      references: config.dependencies.map((dep) => ({
        path: `../${dep}`,
      })),
    },
    null,
    2,
  )
}

function generateTsupConfig(): string {
  return `import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  outDir: 'dist',
  tsconfig: 'tsconfig.json',
})`
}

async function main() {
  intro(`Create New Package`)

  const config = await getPackageConfig()
  const packageDir = path.join('packages', config.name)

  const s = spinner()
  s.start('Creating package structure')

  try {
    // Create directories
    await $`mkdir -p ${packageDir}/src`

    // Create package.json
    await Bun.write(
      path.join(packageDir, 'package.json'),
      generatePackageJson(config),
    )

    // Create tsconfig.json
    await Bun.write(
      path.join(packageDir, 'tsconfig.json'),
      generateTsConfig(config),
    )

    // Create tsup.config.ts for non-client packages
    if (!config.isClient) {
      await Bun.write(
        path.join(packageDir, 'tsup.config.ts'),
        generateTsupConfig(),
      )
    }

    // Create index file
    await Bun.write(
      path.join(packageDir, 'src', 'index.ts'),
      `export function hello() {\n  return "Hello from ${config.name}";\n}\n`,
    )

    await appendToTsConfig(config.name)
    log.info('Appended to tsconfig.json')

    s.stop('Package structure created')

    log.success(`Created package @template/${config.name}`)
    log.info('Next steps:')
    log.step('1. Run bun install')

    outro('Happy coding! 🎉')
  } catch (error) {
    s.stop('Failed to create package')
    log.error('Error creating package:')
    log.error(String(error))
    process.exit(1)
  }
}

main().catch((error) => {
  log.error('Fatal error:')
  log.error(String(error))
  process.exit(1)
})
