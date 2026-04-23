/* eslint-disable no-console */
import { ensureSyncedVersions, readPackageVersions } from './release-utils.mjs'

try {
  const version = ensureSyncedVersions()
  const { corePackage } = readPackageVersions()

  console.log(`版本检查通过：${version}`)
  console.log(`发布包名：${corePackage.name}`)
  console.log(
    '说明：当前仓库采用“根包版本 + packages/core 发布版本”同步维护策略。',
  )
} catch (error) {
  console.error(`版本检查失败：${error.message}`)
  process.exit(1)
}
