/* eslint-disable no-console */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const docsRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const componentsRoot = path.join(docsRoot, 'components')
const require = createRequire(import.meta.url)
const compiler = require.resolve('vue-tsc/bin/vue-tsc.js')
const generatedDir = fs.mkdtempSync(
  path.join(componentsRoot, '__snippet_types__-'),
)
let count = 0
let failed = false

function collectMarkdown(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (
      entry.name.startsWith('.') ||
      entry.name === 'node_modules' ||
      entry.name.startsWith('__snippet_types__-')
    )
      return []
    const filename = path.join(directory, entry.name)
    return entry.isDirectory()
      ? collectMarkdown(filename)
      : filename.endsWith('.md')
        ? [filename]
        : []
  })
}

try {
  for (const file of collectMarkdown(docsRoot)) {
    const source = fs.readFileSync(file, 'utf8')
    for (const match of source.matchAll(/```vue\s*\r?\n([\s\S]*?)```/g)) {
      // Only standalone SFC examples; explanatory fragments are not executable.
      if (!match[1].includes('<script')) continue
      const name = `snippet-${++count}.vue`
      fs.writeFileSync(
        path.join(generatedDir, name),
        `<!-- ${path.relative(docsRoot, file)} -->\n${match[1]}`,
      )
      console.log(`${name}: ${path.relative(docsRoot, file)}`)
    }
  }
  for (const config of ['tsconfig.app.json', 'tsconfig.node.json']) {
    const result = spawnSync(
      process.execPath,
      [
        compiler,
        '--noEmit',
        '--incremental',
        'false',
        '--composite',
        'false',
        '-p',
        path.join(docsRoot, config),
      ],
      { cwd: docsRoot, stdio: 'inherit' },
    )
    if (result.error) throw result.error
    if (result.status !== 0) {
      failed = true
      break
    }
  }
} finally {
  // Remove only the exact fixture directory created by this process.
  const target = path.resolve(generatedDir)
  assert.equal(path.dirname(target), componentsRoot)
  assert.ok(path.basename(target).startsWith('__snippet_types__-'))
  fs.rmSync(target, { recursive: true, force: true })
}

if (failed) process.exitCode = 1
else
  console.log(
    `文档类型检查通过：示例组件、站点配置和 ${count} 个完整 Vue 代码块。`,
  )
