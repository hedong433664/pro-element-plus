/* eslint-disable no-console */
import {
  corePackagePath,
  ensureSyncedVersions,
  readJson,
  resolveNextVersion,
  rootPackagePath,
  writeJson,
} from './release-utils.mjs'

const [, , releaseType, preIdArg] = process.argv

if (!releaseType) {
  console.error('缺少 releaseType 或显式版本号。')
  console.error('')
  console.error('用法示例：')
  console.error('  pnpm release:version patch')
  console.error('  pnpm release:version minor')
  console.error('  pnpm release:version major')
  console.error('  pnpm release:version prepatch beta')
  console.error('  pnpm release:version prerelease beta')
  console.error('  pnpm release:version 1.2.0')
  console.error('')
  console.error('支持的 releaseType：')
  console.error('  patch       修订版本，例如 1.0.0 -> 1.0.1')
  console.error('  minor       次版本，例如 1.0.0 -> 1.1.0')
  console.error('  major       主版本，例如 1.0.0 -> 2.0.0')
  console.error('  prepatch    预发布修订版，例如 1.0.0 -> 1.0.1-beta.0')
  console.error('  preminor    预发布次版本，例如 1.0.0 -> 1.1.0-beta.0')
  console.error('  premajor    预发布主版本，例如 1.0.0 -> 2.0.0-beta.0')
  console.error(
    '  prerelease  在当前预发布版本基础上递增，例如 1.0.1-beta.0 -> 1.0.1-beta.1',
  )
  console.error('  1.2.0       直接指定显式版本号')
  process.exit(1)
}

try {
  const currentVersion = ensureSyncedVersions()
  const nextVersion = resolveNextVersion(
    currentVersion,
    releaseType,
    preIdArg || 'beta',
  )

  const rootPackage = readJson(rootPackagePath)
  const corePackage = readJson(corePackagePath)

  rootPackage.version = nextVersion
  corePackage.version = nextVersion

  writeJson(rootPackagePath, rootPackage)
  writeJson(corePackagePath, corePackage)

  console.log(`版本已更新：${currentVersion} -> ${nextVersion}`)
  console.log('建议后续步骤：')
  console.log('1. 执行 pnpm release:check')
  console.log('2. 执行 pnpm release:build')
  console.log('3. 提交代码并打 tag')
  console.log('4. 执行 pnpm release:publish 或 pnpm release:publish:dry')
} catch (error) {
  console.error(`版本更新失败：${error.message}`)
  process.exit(1)
}
