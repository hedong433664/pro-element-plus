/* eslint-disable no-console */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import {
  ensureSyncedVersions,
  readPackageVersions,
  repoRoot,
} from './release-utils.mjs'
import { DEFAULT_REGISTRY } from './release-registry.mjs'
import {
  buildPublishArgs,
  parsePublishOptions,
} from './release-publish-options.mjs'

const run = (commandArgs, cwd = repoRoot) => {
  const result = spawnSync('pnpm', commandArgs, {
    cwd,
    stdio: 'inherit',
    shell: true,
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

try {
  const version = ensureSyncedVersions()
  const { corePackage } = readPackageVersions()
  const options = parsePublishOptions(process.argv.slice(2), version)
  const registry = corePackage.publishConfig?.registry ?? DEFAULT_REGISTRY
  console.log(
    `发布目标：${corePackage.name}@${version}，标签 ${options.tag}${options.dryRun ? '（预演，不上传）' : ''}`,
  )
  run(['release:check'])
  run(['check'])
  run(buildPublishArgs(options, registry), path.join(repoRoot, 'packages/core'))
} catch (error) {
  console.error(`发布失败：${error.message}`)
  process.exitCode = 1
}
