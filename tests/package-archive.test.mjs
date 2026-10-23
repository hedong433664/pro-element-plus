// @vitest-environment node
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { c as create } from 'tar'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { extractPackageArchive } from '../scripts/package-archive.mjs'

const fixtures = []
const fixture = async () => {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'pro-element-plus-archive-'),
  )
  fixtures.push(root)
  const source = path.join(root, 'source files')
  const destination = path.join(root, 'extracted files')
  const archive = path.join(root, 'package archive.tgz')
  fs.mkdirSync(path.join(source, 'package', 'dist'), { recursive: true })
  fs.mkdirSync(destination)
  fs.writeFileSync(
    path.join(source, 'package', 'package.json'),
    '{"name":"archive-fixture","version":"1.0.0"}',
  )
  fs.writeFileSync(
    path.join(source, 'package', 'dist', 'index.mjs'),
    'export const value = 1;',
  )
  await create({ gzip: true, file: archive, cwd: source }, ['package'])
  return { root, archive, destination }
}

afterEach(() => {
  vi.unstubAllEnvs()
  for (const root of fixtures.splice(0)) {
    const target = path.resolve(root)
    assert.equal(path.dirname(target), path.resolve(os.tmpdir()))
    assert.ok(path.basename(target).startsWith('pro-element-plus-archive-'))
    fs.rmSync(target, { recursive: true, force: true })
  }
})

describe('发布包解压', () => {
  it('支持包含空格的绝对路径及 Windows 盘符', async () => {
    const { archive, destination } = await fixture()
    expect(path.isAbsolute(archive)).toBe(true)
    await extractPackageArchive(archive, destination)
    expect(
      JSON.parse(
        fs.readFileSync(
          path.join(destination, 'package', 'package.json'),
          'utf8',
        ),
      ).name,
    ).toBe('archive-fixture')
    expect(
      fs.readFileSync(
        path.join(destination, 'package', 'dist', 'index.mjs'),
        'utf8',
      ),
    ).toContain('value = 1')
  })

  it('不依赖 PATH 中的 tar 可执行文件', async () => {
    const { archive, destination } = await fixture()
    vi.stubEnv('PATH', '')
    await extractPackageArchive(archive, destination)
    expect(
      fs.existsSync(path.join(destination, 'package', 'dist', 'index.mjs')),
    ).toBe(true)
  })

  it('归档文件不存在时拒绝执行', async () => {
    const { root, destination } = await fixture()
    await expect(
      extractPackageArchive(path.join(root, 'missing.tgz'), destination),
    ).rejects.toThrow()
  })

  it('损坏的归档不会通过校验', async () => {
    const { archive, destination } = await fixture()
    fs.writeFileSync(archive, 'not a tarball')
    await expect(extractPackageArchive(archive, destination)).rejects.toThrow()
  })
})
