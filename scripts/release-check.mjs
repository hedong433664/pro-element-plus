/* eslint-disable no-console */
import { ensureSyncedVersions, readPackageVersions } from './release-utils.mjs'
import {
  DEFAULT_REGISTRY,
  ensureVersionAvailable,
} from './release-registry.mjs'

try {
  const version = ensureSyncedVersions()
  const { corePackage } = readPackageVersions()
  const registry = corePackage.publishConfig?.registry ?? DEFAULT_REGISTRY
  const { latest } = await ensureVersionAvailable(
    corePackage.name,
    version,
    registry,
  )
  console.log(`版本同步检查通过：${version}`)
  console.log(`发布包名：${corePackage.name}`)
  console.log(`registry：${registry}`)
  console.log(`远端 latest：${latest ?? '尚未发布'}`)
  console.log(`版本 ${version} 未发布，可用于本次发布。`)
} catch (error) {
  console.error(`发布检查失败：${error.message}`)
  process.exitCode = 1
}
