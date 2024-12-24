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
import fs from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

type PackageConfig = {
  name: string
  isClient: boolean
  dependencies: string[]
}

async function getPackageConfig(projectName: string): Promise<PackageConfig> {
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
      label: `@${projectName}/${pkg}`,
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

function generatePackageJson(
  config: PackageConfig,
  projectName: string,
): string {
  const deps = config.dependencies.reduce(
    (acc, dep) => {
      acc[`@${projectName}/${dep}`] = 'workspace:*'
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
        build: 'tsc -p tsconfig.build.json',
        dev: 'tsup --watch',
      }

  const devDeps = {
    ...(config.isClient ? {} : { tsup: '^8.3.5' }),
    typescript: '^5.7.2',
  }

  return JSON.stringify(
    {
      name: `@${projectName}/${config.name}`,
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

function generateTsConfig(config: PackageConfig, projectName: string): string {
  return JSON.stringify(
    {
      extends: [`@${projectName}/tsconfig/base.json`],
      compilerOptions: {
        lib: ['dom', 'dom.iterable', 'esnext'],
        outDir: './dist',
        noEmit: false,
        emitDeclarationOnly: true,
        tsBuildInfoFile: 'dist/tsconfig.tsbuildinfo',
      },
      include: ['./src/**/*.ts'],
      exclude: ['node_modules'],
    },
    null,
    2,
  )
}

function generateTsConfigBuild(
  config: PackageConfig,
  projectName: string,
): string {
  return JSON.stringify(
    {
      extends: [`@${projectName}/tsconfig/base.json`],
      compilerOptions: {
        lib: ['dom', 'dom.iterable', 'esnext'],
        rootDir: 'src',
        outDir: './dist',
        noEmit: false,
        tsBuildInfoFile: 'dist/tsconfig.build.tsbuildinfo',
      },
      include: ['src/**/*'],
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

  const projectName = await Bun.file('package.json')
    .json()
    .then((json) => json.name)
  const config = await getPackageConfig(projectName)
  const packageDir = path.join('packages', config.name)

  const s = spinner()
  s.start('Creating package structure')

  try {
    // Create directories
    await $`mkdir -p ${packageDir}/src`

    // Create package.json
    await Bun.write(
      path.join(packageDir, 'package.json'),
      generatePackageJson(config, projectName),
    )

    // Create tsconfig.json
    await Bun.write(
      path.join(packageDir, 'tsconfig.json'),
      generateTsConfig(config, projectName),
    )

    // Create tsconfig.build.json for non-client packages
    if (!config.isClient) {
      await Bun.write(
        path.join(packageDir, 'tsconfig.build.json'),
        generateTsConfigBuild(config, projectName),
      )
    }

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

    log.info('Appended to tsconfig.json')

    s.stop('Package structure created')

    log.success(`Created package @${projectName}/${config.name}`)
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
