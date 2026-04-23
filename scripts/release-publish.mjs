import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { PACKAGE_DIR } from './package-config.mjs'
import { repoRoot } from './release-utils.mjs'

const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const packageDir = path.resolve(repoRoot, PACKAGE_DIR)

const run = (command, commandArgs, cwd = repoRoot) => {
  const result = spawnSync(command, commandArgs, {
    cwd,
    stdio: 'inherit',
    shell: true,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run('pnpm', ['release:check'])
run('pnpm', ['release:build'])

const publishArgs = ['publish', '--access', 'public']

if (isDryRun) {
  publishArgs.push('--dry-run', '--no-git-checks')
} else {
  publishArgs.push('--no-git-checks')
}

run('pnpm', publishArgs, packageDir)
