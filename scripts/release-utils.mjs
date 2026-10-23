import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import semver from 'semver'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const repoRoot = path.resolve(__dirname, '..')
export const rootPackagePath = path.join(repoRoot, 'package.json')
export const corePackagePath = path.join(
  repoRoot,
  'packages',
  'core',
  'package.json',
)

export const readJson = (filePath) =>
  JSON.parse(fs.readFileSync(filePath, 'utf8'))
export const writeJson = (filePath, value) => {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}
export const isSemver = (version) =>
  typeof version === 'string' && semver.valid(version) !== null

export const resolveNextVersion = (
  currentVersion,
  releaseType,
  preId = 'beta',
) => {
  const current = semver.valid(currentVersion)
  if (!current) throw new Error(`非法版本号：${currentVersion}`)

  const explicit = semver.valid(releaseType)
  if (explicit) {
    if (!semver.gt(explicit, current))
      throw new Error(`新版本 ${explicit} 必须高于当前版本 ${current}`)
    return explicit
  }

  const releaseTypes = [
    'patch',
    'minor',
    'major',
    'prepatch',
    'preminor',
    'premajor',
    'prerelease',
  ]
  if (!releaseTypes.includes(releaseType))
    throw new Error(`不支持的版本类型：${releaseType}`)
  if (releaseType.startsWith('pre') && !semver.valid(`0.0.0-${preId}.0`)) {
    throw new Error(`非法预发布标识：${preId}`)
  }
  const next = semver.inc(current, releaseType, preId)
  if (!next) throw new Error(`无法生成版本：${current} / ${releaseType}`)
  return next
}

export const readPackageVersions = () => {
  const rootPackage = readJson(rootPackagePath)
  const corePackage = readJson(corePackagePath)
  return {
    rootPackage,
    corePackage,
    rootVersion: rootPackage.version,
    coreVersion: corePackage.version,
  }
}

export const ensureSyncedVersions = () => {
  const { rootVersion, coreVersion } = readPackageVersions()
  if (!isSemver(rootVersion) || !isSemver(coreVersion))
    throw new Error('根包或发布包的版本号无效')
  if (rootVersion !== coreVersion) {
    throw new Error(
      `根包版本（${rootVersion}）与 packages/core 版本（${coreVersion}）不一致，请先同步版本`,
    )
  }
  return rootVersion
}
