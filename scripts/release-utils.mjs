import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?$/.test(version)

const parseVersion = (version) => {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-.]+))?$/)

  if (!match) {
    throw new Error(`非法版本号：${version}`)
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null,
  }
}

const formatVersion = ({ major, minor, patch, prerelease }) =>
  `${major}.${minor}.${patch}${prerelease ? `-${prerelease}` : ''}`

const nextPrerelease = (version, preId) => {
  if (!version.prerelease) {
    return formatVersion({
      ...version,
      patch: version.patch + 1,
      prerelease: `${preId}.0`,
    })
  }

  const [currentId, currentNo] = version.prerelease.split('.')
  if (
    currentId !== preId ||
    currentNo == null ||
    Number.isNaN(Number(currentNo))
  ) {
    return formatVersion({
      ...version,
      prerelease: `${preId}.0`,
    })
  }

  return formatVersion({
    ...version,
    prerelease: `${preId}.${Number(currentNo) + 1}`,
  })
}

export const resolveNextVersion = (
  currentVersion,
  releaseType,
  preId = 'beta',
) => {
  if (isSemver(releaseType)) return releaseType

  const version = parseVersion(currentVersion)

  switch (releaseType) {
    case 'patch':
      return formatVersion({
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
        prerelease: null,
      })
    case 'minor':
      return formatVersion({
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
        prerelease: null,
      })
    case 'major':
      return formatVersion({
        major: version.major + 1,
        minor: 0,
        patch: 0,
        prerelease: null,
      })
    case 'prepatch':
      return formatVersion({
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
        prerelease: `${preId}.0`,
      })
    case 'preminor':
      return formatVersion({
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
        prerelease: `${preId}.0`,
      })
    case 'premajor':
      return formatVersion({
        major: version.major + 1,
        minor: 0,
        patch: 0,
        prerelease: `${preId}.0`,
      })
    case 'prerelease':
      return nextPrerelease(version, preId)
    default:
      throw new Error(
        `不支持的版本类型：${releaseType}。可用值：patch、minor、major、prepatch、preminor、premajor、prerelease 或显式版本号`,
      )
  }
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

  if (rootVersion !== coreVersion) {
    throw new Error(
      `根包版本（${rootVersion}）与 packages/core 版本（${coreVersion}）不一致，请先同步版本`,
    )
  }

  return rootVersion
}
