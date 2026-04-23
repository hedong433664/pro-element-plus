/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const componentsDir = path.resolve(__dirname, '../../components')
const cssOut = path.resolve(__dirname, '../dist/css')

const elementPlusPackagePath = require.resolve('element-plus/package.json')
const elementPlusDir = path.dirname(elementPlusPackagePath)
const elementPlusNodeModulesDir = path.dirname(elementPlusDir)
const componentsNodeModulesDir = path.resolve(
  __dirname,
  '../../components/node_modules',
)

const sassLoadPaths = [
  ...new Set([elementPlusNodeModulesDir, componentsNodeModulesDir]),
]

if (!fs.existsSync(cssOut)) {
  fs.mkdirSync(cssOut, { recursive: true })
}

const componentDirs = fs
  .readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

const compileScss = (inFile) =>
  sass.compile(inFile, {
    style: 'compressed',
    sourceMap: false,
    loadPaths: sassLoadPaths,
  }).css

const writeCssFile = (outFile, css) => {
  fs.writeFileSync(outFile, css)
  console.log('css:', path.relative(cssOut, outFile))
}

const extractImports = (code) =>
  [...code.matchAll(/import\s+['"]([^'"]+)['"];?/g)].map((match) => match[1])

const resolveElementPlusImport = (importPath, fromFile) => {
  if (importPath.startsWith('element-plus/theme-chalk/')) {
    return {
      type: 'css',
      filePath: path.join(
        elementPlusDir,
        importPath.replace('element-plus/', '').replaceAll('/', path.sep),
      ),
    }
  }

  if (importPath.startsWith('element-plus/es/')) {
    return {
      type: 'module',
      filePath: path.join(
        elementPlusDir,
        `${importPath.replace('element-plus/', '').replaceAll('/', path.sep)}.mjs`,
      ),
    }
  }

  if (importPath.startsWith('.')) {
    return {
      type: path.extname(importPath) === '.css' ? 'css' : 'module',
      filePath: path.resolve(path.dirname(fromFile), importPath),
    }
  }

  return null
}

const collectElementPlusCssFiles = (
  entryFile,
  visitedModules,
  collectedCssFiles,
) => {
  if (visitedModules.has(entryFile) || !fs.existsSync(entryFile)) return
  visitedModules.add(entryFile)

  const code = fs.readFileSync(entryFile, 'utf8')
  const imports = extractImports(code)

  for (const importPath of imports) {
    const resolved = resolveElementPlusImport(importPath, entryFile)
    if (!resolved) continue

    if (resolved.type === 'css') {
      collectedCssFiles.add(resolved.filePath)
      continue
    }

    collectElementPlusCssFiles(
      resolved.filePath,
      visitedModules,
      collectedCssFiles,
    )
  }
}

const collectGlobalElementPlusCss = () => {
  const visitedModules = new Set()
  const collectedCssFiles = new Set()

  for (const name of componentDirs) {
    const styleCssEntry = path.join(componentsDir, name, 'style', 'css.ts')
    if (!fs.existsSync(styleCssEntry)) continue

    const code = fs.readFileSync(styleCssEntry, 'utf8')
    const imports = extractImports(code).filter((importPath) =>
      importPath.startsWith('element-plus/'),
    )

    for (const importPath of imports) {
      const resolved = resolveElementPlusImport(importPath, styleCssEntry)
      if (!resolved) continue

      if (resolved.type === 'css') {
        collectedCssFiles.add(resolved.filePath)
        continue
      }

      collectElementPlusCssFiles(
        resolved.filePath,
        visitedModules,
        collectedCssFiles,
      )
    }
  }

  return [...collectedCssFiles]
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => fs.readFileSync(filePath, 'utf8'))
    .join('\n')
}

const baseScss = path.join(componentsDir, 'styles/base.scss')
if (fs.existsSync(baseScss)) {
  writeCssFile(path.join(cssOut, 'base.css'), compileScss(baseScss))
}

const indexScss = path.join(componentsDir, 'styles/index.scss')
if (fs.existsSync(indexScss)) {
  const elementPlusCss = collectGlobalElementPlusCss()
  const localCss = compileScss(indexScss)
  writeCssFile(
    path.join(cssOut, 'index.css'),
    `${elementPlusCss}${elementPlusCss ? '\n' : ''}${localCss}`,
  )
}

const stylesDir = path.join(componentsDir, 'styles')
for (const name of componentDirs) {
  const scss = path.join(stylesDir, `${name}.scss`)
  if (!fs.existsSync(scss)) continue

  writeCssFile(path.join(cssOut, `${name}.css`), compileScss(scss))
}
