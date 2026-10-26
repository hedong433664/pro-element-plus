// @vitest-environment node
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createMarkdownStyleIsolation } from '../packages/docs/.vitepress/markdown-style-isolation'

const require = createRequire(
  new URL('../packages/docs/package.json', import.meta.url),
)
const sass =
  require('sass') as typeof import('../packages/docs/node_modules/sass')

describe('文档主题', () => {
  it('浅色和深色样式都使用自定义主色，并分别生成色阶', () => {
    const { css } = sass.compile(
      fileURLToPath(
        new URL(
          '../packages/docs/.vitepress/theme/element/index.scss',
          import.meta.url,
        ),
      ),
      {
        loadPaths: [fileURLToPath(new URL('../node_modules', import.meta.url))],
        logger: sass.Logger.silent,
      },
    )
    const light = [...css.matchAll(/(?:^|\n):root\s*\{([^}]+)\}/g)]
      .map((match) => match[1]!)
      .find((block) => /--el-color-primary:/.test(block))!
    const dark = /html\.dark\s*\{([^}]+)\}/.exec(css)![1]!
    expect(light).toMatch(/--el-color-primary:\s*#5672cd;/)
    expect(dark).toMatch(/--el-color-primary:\s*#5672cd;/)
    const lightLevel = /--el-color-primary-light-3:\s*([^;]+);/.exec(light)![1]
    const darkLevel = /--el-color-primary-light-3:\s*([^;]+);/.exec(dark)![1]
    expect(darkLevel).not.toBe(lightLevel)
  })
  it('不再引入会覆盖主色的默认深色 CSS', () => {
    const theme = readFileSync(
      new URL('../packages/docs/.vitepress/theme/index.ts', import.meta.url),
      'utf8',
    )
    expect(theme).not.toContain('element-plus/theme-chalk/dark/css-vars.css')
  })
})

describe('文档示例样式隔离', () => {
  it('Markdown 表格规则不匹配示例表格，但保留正文和源码区样式', async () => {
    const vitepressRequire = createRequire(
      require.resolve('vitepress/package.json'),
    )
    const postcss = vitepressRequire('postcss')
    const { JSDOM } = require('jsdom')
    const dom = new JSDOM(`<div class="vp-doc">
      <table id="markdown"></table>
      <section class="vitepress-demo-preview-preview"><div class="el-table"><table id="demo"></table></div></section>
      <section class="vitepress-demo-preview-source"><table id="source"></table></section>
      <div class="vp-raw"><table id="raw"></table></div>
    </div>`)
    try {
      const result = await postcss([createMarkdownStyleIsolation()]).process(
        '.vp-doc table { display: block; overflow-x: auto; }',
        { from: 'vp-doc.css' },
      )
      const selector = result.root.first.selector as string
      const doc = dom.window.document as Document
      expect(doc.querySelector('#markdown')!.matches(selector)).toBe(true)
      expect(doc.querySelector('#source')!.matches(selector)).toBe(true)
      expect(doc.querySelector('#demo')!.matches(selector)).toBe(false)
      expect(doc.querySelector('#raw')!.matches(selector)).toBe(false)
    } finally {
      dom.window.close()
    }
  })
  it('不改写 Element Plus 自身样式', async () => {
    const vitepressRequire = createRequire(
      require.resolve('vitepress/package.json'),
    )
    const postcss = vitepressRequire('postcss')
    const source = '.el-table table { table-layout: fixed; }'
    const result = await postcss([createMarkdownStyleIsolation()]).process(
      source,
      { from: 'table.css' },
    )
    expect(result.css).toBe(source)
    const theme = readFileSync(
      new URL('../packages/docs/.vitepress/theme/index.scss', import.meta.url),
      'utf8',
    )
    expect(theme).not.toMatch(/\.el-table\s+table\s*\{/)
  })
})
