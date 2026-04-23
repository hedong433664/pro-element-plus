import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const sourceIndexFile = path.join(rootDir, 'index.ts')

const rm = (targetPath) => {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true })
  }
}

const createRootIndexDts = () => {
  if (!fs.existsSync(sourceIndexFile)) return

  const source = fs.readFileSync(sourceIndexFile, 'utf8')
  const namedExportMatches = [
    ...source.matchAll(
      /export\s+\{\s*([^}]+?)\s*\}\s+from\s+'\.\.\/components\/([^']+)'/g,
    ),
  ]
  const exportAllMatches = [
    ...source.matchAll(/export\s+\*\s+from\s+'\.\.\/components\/([^']+)'/g),
  ]

  const lines = []

  for (const match of namedExportMatches) {
    const [, names, componentDir] = match
    lines.push(
      `export { ${names.trim()} } from './es/${componentDir}/index.js';`,
    )
  }

  for (const match of exportAllMatches) {
    const [, componentDir] = match
    lines.push(`export * from './es/${componentDir}/index.js';`)
  }

  lines.push(`declare const installer: (app: import('vue').App) => void;`)
  lines.push('export default installer;')

  fs.writeFileSync(path.join(distDir, 'index.d.ts'), `${lines.join('\n')}\n`)
}

rm(path.join(distDir, 'scripts'))

const orphanBarrel = (subDir) => {
  const dts = path.join(distDir, subDir, 'index.d.ts')
  const mjs = path.join(distDir, subDir, 'index.mjs')
  const js = path.join(distDir, subDir, 'index.js')
  if (fs.existsSync(dts) && !fs.existsSync(mjs) && !fs.existsSync(js)) {
    fs.unlinkSync(dts)
  }
}

orphanBarrel('es')
orphanBarrel('lib')
createRootIndexDts()

rm(path.join(distDir, 'core'))
rm(path.join(distDir, 'components'))
rm(path.join(distDir, 'pro-element-plus.css'))
rm(path.join(distDir, 'es', 'pro-element-plus.css'))
rm(path.join(distDir, 'lib', 'pro-element-plus.css'))
