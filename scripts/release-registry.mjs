export const DEFAULT_REGISTRY = 'https://registry.npmjs.org/'

export async function ensureVersionAvailable(
  packageName,
  version,
  registry = DEFAULT_REGISTRY,
  fetchMetadata = globalThis.fetch,
) {
  const base = new URL(registry)
  if (!['http:', 'https:'].includes(base.protocol))
    throw new Error('registry 必须使用 HTTP 或 HTTPS')
  if (!base.pathname.endsWith('/')) base.pathname += '/'
  const url = new URL(encodeURIComponent(packageName), base)
  const response = await fetchMetadata(url, {
    headers: { accept: 'application/vnd.npm.install-v1+json' },
    signal: AbortSignal.timeout(15000),
  })
  if (response.status === 404) return { latest: null, tags: {} }
  if (!response.ok)
    throw new Error(`查询 registry 失败：HTTP ${response.status}`)

  const metadata = await response.json()
  if (
    !metadata ||
    typeof metadata.versions !== 'object' ||
    metadata.versions === null ||
    Array.isArray(metadata.versions)
  ) {
    throw new Error('registry 返回的版本列表无效')
  }
  if (Object.hasOwn(metadata.versions, version)) {
    throw new Error(`${packageName}@${version} 已发布，请先更新版本号`)
  }
  return {
    latest: metadata['dist-tags']?.latest ?? null,
    tags: metadata['dist-tags'] ?? {},
  }
}
