import semver from 'semver'

export function parsePublishOptions(args, version) {
  if (!semver.valid(version)) throw new Error(`非法版本号：${version}`)
  let dryRun = false
  let tag
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
    if (arg === '--') continue
    if (arg === '--dry-run') {
      dryRun = true
      continue
    }
    if (arg === '--tag' || arg.startsWith('--tag=')) {
      if (tag !== undefined) throw new Error('--tag 不能重复指定')
      tag = arg === '--tag' ? args[++index] : arg.slice('--tag='.length)
      if (!tag || tag.startsWith('--')) throw new Error('--tag 缺少标签值')
      continue
    }
    throw new Error(`未知发布参数：${arg}`)
  }
  const prerelease = semver.prerelease(version) !== null
  if (prerelease && tag === undefined)
    throw new Error('预发布版本必须指定 --tag，例如 --tag beta')
  tag ??= 'latest'
  if (!/^[a-z][a-z0-9._-]*$/i.test(tag) || semver.validRange(tag) !== null) {
    throw new Error(`非法 dist-tag：${tag}`)
  }
  if (prerelease && tag === 'latest')
    throw new Error('预发布版本不能使用 latest 标签')
  return { dryRun, tag }
}

export function buildPublishArgs({ dryRun, tag }, registry) {
  const args = [
    'publish',
    '--access',
    'public',
    '--registry',
    registry,
    '--tag',
    tag,
  ]
  if (dryRun) args.push('--dry-run', '--no-git-checks')
  return args
}
