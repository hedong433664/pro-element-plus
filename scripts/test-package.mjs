/* eslint-disable no-console */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { extractPackageArchive } from './package-archive.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const core = path.join(root, 'packages/core')
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'pro-element-plus-package-'))
const names = {
  header: 'ProHeader',
  col: 'ProCol',
  table: 'ProTable',
  form: 'ProForm',
  'search-form': 'ProSearchForm',
  'search-table': 'ProSearchTable',
}

try {
  execFileSync(
    process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
    ['pack', '--pack-destination', temp],
    { cwd: core, shell: process.platform === 'win32', stdio: 'pipe' },
  )
  const archive = fs.readdirSync(temp).find((file) => file.endsWith('.tgz'))
  assert.ok(archive, 'pnpm pack must create an archive')
  await extractPackageArchive(path.join(temp, archive), temp)
  const pkg = path.join(temp, 'package')
  // External runtime dependencies come from the consumer, never from core/node_modules.
  fs.symlinkSync(
    path.join(root, 'node_modules'),
    path.join(pkg, 'node_modules'),
    process.platform === 'win32' ? 'junction' : 'dir',
  )
  const requirePackage = createRequire(path.join(pkg, 'package.json'))
  const manifest = JSON.parse(
    fs.readFileSync(path.join(pkg, 'package.json'), 'utf8'),
  )
  const consumerFile = path.join(pkg, 'audit-consumer.mjs')
  fs.writeFileSync(
    consumerFile,
    [
      `export * from '${manifest.name}';`,
      `export { default } from '${manifest.name}';`,
      ...Object.keys(names).map(
        (dir) =>
          `export * as ${dir.replace('-', '_')} from '${manifest.name}/es/${dir}';`,
      ),
    ].join('\n'),
  )
  const esm = await import(pathToFileURL(consumerFile).href)
  const cjs = requirePackage(manifest.name)
  for (const name of Object.values(names)) {
    assert.ok(esm[name], `ESM must export ${name}`)
    assert.ok(cjs[name], `CJS must export ${name}`)
  }
  const { createSSRApp, h } = requirePackage('vue')
  const { renderToString } = requirePackage('vue/server-renderer')
  for (const lib of [esm, cjs]) {
    const app = createSSRApp({
      render: () =>
        h(
          lib.ProForm,
          { model: {}, fields: [] },
          {
            default: () => h('button', 'package-action'),
          },
        ),
    })
    app.use(lib.default)
    for (const name of Object.values(names)) assert.ok(app.component(name))
    assert.match(await renderToString(app), /package-action/)
  }
  for (const [dir, name] of Object.entries(names)) {
    const es = esm[dir.replace('-', '_')]
    const lib = requirePackage(`${manifest.name}/lib/${dir}`)
    assert.ok(es[name], `ESM component entry: ${name}`)
    assert.ok(lib[name], `CJS component entry: ${name}`)
    for (const format of ['es', 'lib']) {
      const extension = format === 'es' ? 'mjs' : 'js'
      for (const entry of ['index', 'css']) {
        const entryFile = path.join(
          pkg,
          'dist',
          format,
          dir,
          'style',
          `${entry}.${extension}`,
        )
        const code = fs.readFileSync(entryFile, 'utf8')
        for (const [, specifier] of code.matchAll(
          /(?:import\s+|require\()['"]([^'"]+)['"]/g,
        )) {
          if (specifier.startsWith('.')) {
            assert.ok(
              fs.existsSync(path.resolve(path.dirname(entryFile), specifier)),
              `${entryFile}: ${specifier} must exist`,
            )
          }
          if (format === 'lib')
            assert.ok(!specifier.startsWith('element-plus/es/'))
        }
      }
    }
  }
  const { build } = createRequire(path.join(core, 'package.json'))('esbuild')
  const headerBundle = await build({
    stdin: {
      contents: `import { ProHeader } from '${manifest.name}'; console.info(ProHeader)`,
      resolveDir: pkg,
    },
    bundle: true,
    write: false,
    format: 'esm',
    external: ['vue', 'element-plus'],
    logLevel: 'silent',
  })
  assert.ok(
    !headerBundle.outputFiles[0].text.includes('ProSearchForm'),
    'Named header imports must tree-shake unrelated components',
  )
  assert.ok(
    !headerBundle.outputFiles[0].text.includes('ProTable'),
    'Named header imports must tree-shake the table',
  )
  for (const format of ['es', 'lib']) {
    for (const component of ['form', 'search-form', 'search-table']) {
      const bundle = await build({
        stdin: {
          contents:
            format === 'es'
              ? `import '${manifest.name}/${format}/${component}/style/css'`
              : `require('${manifest.name}/${format}/${component}/style/css')`,
          resolveDir: pkg,
        },
        absWorkingDir: pkg,
        bundle: true,
        write: false,
        outdir: path.join(temp, 'bundled'),
        logLevel: 'silent',
      })
      const css = bundle.outputFiles.find((file) =>
        file.path.endsWith('.css'),
      )?.text
      assert.ok(css, `${format}/${component}: CSS must be bundled`)
      assert.match(css, /\.pro-col__not-grid/)
      assert.match(css, /\.pro-form__row/)
      assert.match(css, /\.el-form/)
    }
  }
  const formStyle = fs.readFileSync(
    path.join(pkg, 'dist/es/form/style/index.mjs'),
    'utf8',
  )
  assert.match(formStyle, /css\/col\.css/)
  assert.match(formStyle, /css\/form\.css/)
  const resolver = await import(
    pathToFileURL(path.join(pkg, 'dist/resolver.mjs')).href
  )
  assert.equal(
    resolver.ProElementPlusResolver().resolve('ProBusinessCard'),
    undefined,
  )
  assert.ok(fs.existsSync(path.join(pkg, 'dist/index.d.ts')))
  assert.ok(fs.existsSync(path.join(pkg, 'global.d.ts')))
  assert.ok(fs.existsSync(path.join(pkg, 'LICENSE')))
  const changelog = fs.readFileSync(path.join(pkg, 'CHANGELOG.md'), 'utf8')
  assert.ok(
    changelog.includes(`## ${manifest.version}`),
    'Packed changelog must describe the current version',
  )

  console.log(
    'Package smoke tests passed: packed archive, ESM/CJS, component entries, installation, SSR, styles and resolver.',
  )
} finally {
  // Only remove the exact temporary directory created by this process.
  const resolved = path.resolve(temp)
  assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()))
  assert.ok(path.basename(resolved).startsWith('pro-element-plus-package-'))
  fs.rmSync(resolved, { recursive: true, force: true })
}
