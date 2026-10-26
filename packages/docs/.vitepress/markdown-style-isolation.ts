import { postcssIsolateStyles } from 'vitepress'

// 只隔离示例内容，保留 Markdown 正文和示例源码区的排版。
export const createMarkdownStyleIsolation = () =>
  postcssIsolateStyles({
    includeFiles: [/vp-doc\.css/],
    prefix:
      ':not(:where(.vp-raw, .vp-raw *, .vitepress-demo-preview-preview, .vitepress-demo-preview-preview *))',
  })
