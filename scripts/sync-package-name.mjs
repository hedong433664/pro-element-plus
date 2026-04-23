/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { PACKAGE_NAME } from './package-config.mjs'
import {
  corePackagePath,
  readJson,
  rootPackagePath,
  writeJson,
} from './release-utils.mjs'

const packagesDir = path.dirname(corePackagePath)

const workspacePackageJsonPaths = [
  corePackagePath,
  path.join(packagesDir, '..', 'app', 'package.json'),
  path.join(packagesDir, '..', 'play', 'package.json'),
  path.join(packagesDir, '..', 'docs', 'package.json'),
]

const textSyncRoots = [
  path.join(packagesDir, '..', 'core'),
  path.join(packagesDir, '..', 'docs'),
  path.join(packagesDir, '..', 'play'),
  path.join(packagesDir, '..', 'app'),
]

const textSyncExtensions = new Set([
  '.md',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.vue',
])

const tsConfigFilePattern = /^tsconfig(?:\..+)?\.json$/i

const ignoredDirNames = new Set([
  'node_modules',
  'dist',
  '.git',
  '.vite',
  '.turbo',
  'coverage',
])

const ignoredPathSegments = [`${path.sep}.vitepress${path.sep}cache${path.sep}`]

const packageBaseName = PACKAGE_NAME.split('/').pop()
const escapedPackageBaseName = packageBaseName.replace(
  /[.*+?^${}()|[\]\\]/g,
  '\\$&',
)
const repeatedScopedPackagePattern = new RegExp(
  `(?:@[\\w.-]+/)+${escapedPackageBaseName}`,
  'g',
)
const scopedPackagePattern = new RegExp(`@[\\w.-]+/${escapedPackageBaseName}`, 'g')
const barePackagePattern = new RegExp(
  `(?<![@\\w.-]/)${escapedPackageBaseName}(?![\\w.-])`,
  'g',
)

const isLegacyPackageName = (name) =>
  name === packageBaseName ||
  name === PACKAGE_NAME ||
  name.endsWith(`/${packageBaseName}`)

const updateDependencyMap = (deps = {}) => {
  const nextDeps = { ...deps }

  for (const name of Object.keys(nextDeps)) {
    if (isLegacyPackageName(name)) {
      delete nextDeps[name]
    }
  }

  nextDeps[PACKAGE_NAME] = 'workspace:*'
  return nextDeps
}

const replacePackageNameText = (content) => {
  let nextContent = content.replace(repeatedScopedPackagePattern, PACKAGE_NAME)
  nextContent = nextContent.replace(scopedPackagePattern, PACKAGE_NAME)
  nextContent = nextContent.replace(barePackagePattern, PACKAGE_NAME)
  return nextContent
}

const shouldIgnorePath = (filePath) =>
  ignoredPathSegments.some((segment) => filePath.includes(segment))

const shouldSyncTextFile = (filePath) => {
  const extension = path.extname(filePath)

  if (textSyncExtensions.has(extension)) {
    return true
  }

  return (
    extension === '.json' && tsConfigFilePattern.test(path.basename(filePath))
  )
}

const collectTextSyncFiles = (rootPath) => {
  if (!fs.existsSync(rootPath)) return []

  const stat = fs.statSync(rootPath)
  if (stat.isFile()) {
    return shouldSyncTextFile(rootPath) ? [rootPath] : []
  }

  const files = []

  const walk = (currentPath) => {
    if (shouldIgnorePath(currentPath)) return

    const currentStat = fs.statSync(currentPath)
    if (currentStat.isFile()) {
      if (shouldSyncTextFile(currentPath)) {
        files.push(currentPath)
      }
      return
    }

    for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
      if (entry.isDirectory() && ignoredDirNames.has(entry.name)) continue
      walk(path.join(currentPath, entry.name))
    }
  }

  walk(rootPath)
  return files
}

for (const packagePath of workspacePackageJsonPaths) {
  const pkg = readJson(packagePath)

  if (packagePath === corePackagePath) {
    pkg.name = PACKAGE_NAME
  } else {
    if (pkg.dependencies) {
      pkg.dependencies = updateDependencyMap(pkg.dependencies)
    }

    if (pkg.devDependencies) {
      pkg.devDependencies = updateDependencyMap(pkg.devDependencies)
    }

    if (pkg.peerDependencies) {
      pkg.peerDependencies = updateDependencyMap(pkg.peerDependencies)
    }

    if (pkg.optionalDependencies) {
      pkg.optionalDependencies = updateDependencyMap(pkg.optionalDependencies)
    }
  }

  writeJson(packagePath, pkg)
  console.log(`已同步包名配置：${packagePath}`)
}

const textSyncFiles = [...new Set(textSyncRoots.flatMap(collectTextSyncFiles))]

for (const filePath of textSyncFiles) {
  const content = fs.readFileSync(filePath, 'utf8')
  const nextContent = replacePackageNameText(content)

  if (nextContent !== content) {
    fs.writeFileSync(filePath, nextContent)
    console.log(`已同步文本引用：${filePath}`)
  }
}

const rootPackage = readJson(rootPackagePath)
console.log(`当前统一包名配置：${PACKAGE_NAME}`)
console.log(`根包名称保持不变：${rootPackage.name}`)
