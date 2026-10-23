// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { ensureVersionAvailable } from '../scripts/release-registry.mjs'
import {
  buildPublishArgs,
  parsePublishOptions,
} from '../scripts/release-publish-options.mjs'
import { isSemver, resolveNextVersion } from '../scripts/release-utils.mjs'

const response = (body, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('发布版本检查', () => {
  it('拒绝已发布的版本', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(response({ versions: { '2.2.0': {} } }))
    await expect(
      ensureVersionAvailable(
        '@coderhd/pro-element-plus',
        '2.2.0',
        undefined,
        fetcher,
      ),
    ).rejects.toThrow('已发布')
  })
  it('允许未发布版本，并读取 latest', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      response({
        versions: { '2.2.0': {} },
        'dist-tags': { latest: '2.2.0' },
      }),
    )
    await expect(
      ensureVersionAvailable(
        '@coderhd/pro-element-plus',
        '3.0.0',
        undefined,
        fetcher,
      ),
    ).resolves.toEqual({ latest: '2.2.0', tags: { latest: '2.2.0' } })
    expect(String(fetcher.mock.calls[0][0])).toBe(
      'https://registry.npmjs.org/%40coderhd%2Fpro-element-plus',
    )
    expect(fetcher.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal)
  })
  it('允许首次发布的包', async () => {
    const fetcher = vi.fn().mockResolvedValue(response({}, 404))
    await expect(
      ensureVersionAvailable('new-package', '1.0.0', undefined, fetcher),
    ).resolves.toEqual({ latest: null, tags: {} })
  })
  it.each([401, 403, 429, 500])('HTTP %s 不视为版本可用', async (status) => {
    const fetcher = vi.fn().mockResolvedValue(response({}, status))
    await expect(
      ensureVersionAvailable('package', '3.0.0', undefined, fetcher),
    ).rejects.toThrow(`HTTP ${status}`)
  })
  it('网络失败时停止检查', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('network unavailable'))
    await expect(
      ensureVersionAvailable('package', '3.0.0', undefined, fetcher),
    ).rejects.toThrow('network unavailable')
  })
  it.each([{}, { versions: null }, { versions: [] }])(
    '拒绝不完整的版本列表 %j',
    async (body) => {
      const fetcher = vi.fn().mockResolvedValue(response(body))
      await expect(
        ensureVersionAvailable('package', '3.0.0', undefined, fetcher),
      ).rejects.toThrow('版本列表无效')
    },
  )
})

describe('发布参数', () => {
  it('稳定版默认为 latest', () => {
    expect(parsePublishOptions([], '3.0.0')).toEqual({
      dryRun: false,
      tag: 'latest',
    })
  })
  it.each([['--tag', 'beta'], ['--tag=beta'], ['--', '--tag', 'beta']])(
    '转发标签 %j',
    (...args) => {
      expect(parsePublishOptions(args, '3.0.0-beta.0')).toEqual({
        dryRun: false,
        tag: 'beta',
      })
    },
  )
  it('拒绝没有标签的预发布版本', () => {
    expect(() => parsePublishOptions([], '3.0.0-beta.0')).toThrow(
      '必须指定 --tag',
    )
  })
  it('拒绝将预发布版本标记为 latest', () => {
    expect(() =>
      parsePublishOptions(['--tag', 'latest'], '3.0.0-beta.0'),
    ).toThrow('不能使用 latest')
  })
  it.each([
    ['--tag'],
    ['--tag', '--dry-run'],
    ['--tag='],
    ['--tag', 'v3'],
    ['--tag', 'beta;echo'],
    ['--unknown'],
    ['--tag', 'beta', '--tag', 'next'],
  ])('拒绝无效参数 %j', (...args) => {
    expect(() => parsePublishOptions(args, '3.0.0')).toThrow()
  })
  it('仅预演时允许跳过 Git 检查，且始终携带 dry-run', () => {
    const options = parsePublishOptions(
      ['--dry-run', '--tag', 'beta'],
      '3.0.0-beta.0',
    )
    const args = buildPublishArgs(options, 'https://registry.npmjs.org/')
    expect(args).toContain('--dry-run')
    expect(args).toContain('--no-git-checks')
    expect(
      args.slice(args.indexOf('--tag'), args.indexOf('--tag') + 2),
    ).toEqual(['--tag', 'beta'])
    const actual = buildPublishArgs(
      parsePublishOptions([], '3.0.0'),
      'https://registry.npmjs.org/',
    )
    expect(actual).not.toContain('--dry-run')
    expect(actual).not.toContain('--no-git-checks')
  })
})

describe('版本递增', () => {
  it.each([
    ['2.2.0', 'major', '3.0.0'],
    ['2.2.0', 'patch', '2.2.1'],
    ['2.2.0', 'minor', '2.3.0'],
    ['2.2.0', 'premajor', '3.0.0-beta.0'],
    ['3.0.0-beta.0', 'prerelease', '3.0.0-beta.1'],
    ['3.0.0-beta.1', 'patch', '3.0.0'],
  ])('%s / %s -> %s', (version, type, expected) => {
    expect(resolveNextVersion(version, type)).toBe(expected)
  })
  it('接受更高的显式版本', () => {
    expect(resolveNextVersion('2.2.0', '3.0.0')).toBe('3.0.0')
  })
  it.each(['2.2.0', '2.1.0'])('拒绝回退或重复版本 %s', (version) => {
    expect(() => resolveNextVersion('2.2.0', version)).toThrow('必须高于')
  })
  it('拒绝非标准版本和预发布标识', () => {
    expect(isSemver('01.2.0')).toBe(false)
    expect(() => resolveNextVersion('2.2.0', 'premajor', 'bad id')).toThrow(
      '非法预发布标识',
    )
  })
})
