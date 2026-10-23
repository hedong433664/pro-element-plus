/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const componentsDir = path.resolve(__dirname, '../../components')
const distEs = path.resolve(__dirname, '../dist/es')
const distLib = path.resolve(__dirname, '../dist/lib')

const componentDirs = fs
  .readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

const extractImports = (code) =>
  [...code.matchAll(/import\s+['"]([^'"]+)['"];?/g)].map((match) => match[1])

const readStyleImports = (componentName, entryName) => {
  const entryFile = path.join(
    componentsDir,
    componentName,
    'style',
    `${entryName}.ts`,
  )
  if (!fs.existsSync(entryFile)) return []

  return extractImports(fs.readFileSync(entryFile, 'utf8'))
}

const toStylePath = (importPath, format) => {
  if (importPath.startsWith('../../styles/')) {
    return `../../../css/${path.basename(importPath, '.scss')}.css`
  }
  if (importPath.startsWith('.')) {
    return `${importPath}.${format === 'es' ? 'mjs' : 'js'}`
  }
  if (format === 'lib' && importPath.startsWith('element-plus/es/')) {
    return importPath.replace('element-plus/es/', 'element-plus/lib/')
  }
  return importPath
}

const toDistImportStatements = (_componentName, imports) =>
  [...new Set(imports.map((item) => toStylePath(item, 'es')))]
    .map((item) => `import '${item}';`)
    .join('\n')

const toDistRequireStatements = (_componentName, imports) =>
  [...new Set(imports.map((item) => toStylePath(item, 'lib')))]
    .map((item) => `require('${item}');`)
    .join('\n')

for (const name of componentDirs) {
  const scss = path.join(componentsDir, 'styles', `${name}.scss`)
  if (!fs.existsSync(scss)) continue

  const esStyleDir = path.join(distEs, name, 'style')
  const libStyleDir = path.join(distLib, name, 'style')
  fs.mkdirSync(esStyleDir, { recursive: true })
  fs.mkdirSync(libStyleDir, { recursive: true })

  const sourceIndexImports = readStyleImports(name, 'index')
  const sourceCssImports = readStyleImports(name, 'css')

  fs.writeFileSync(
    path.join(esStyleDir, 'index.mjs'),
    `${toDistImportStatements(name, sourceIndexImports)}\n`,
  )
  fs.writeFileSync(
    path.join(esStyleDir, 'css.mjs'),
    `${toDistImportStatements(name, sourceCssImports)}\n`,
  )
  fs.writeFileSync(
    path.join(libStyleDir, 'index.js'),
    `${toDistRequireStatements(name, sourceIndexImports)}\n`,
  )
  fs.writeFileSync(
    path.join(libStyleDir, 'css.js'),
    `${toDistRequireStatements(name, sourceCssImports)}\n`,
  )

  const dts = `export {};\n`
  fs.writeFileSync(path.join(esStyleDir, 'index.d.ts'), dts)
  fs.writeFileSync(path.join(esStyleDir, 'css.d.ts'), dts)
  fs.writeFileSync(path.join(libStyleDir, 'index.d.ts'), dts)
  fs.writeFileSync(path.join(libStyleDir, 'css.d.ts'), dts)

  console.log('style entries:', name)
}
