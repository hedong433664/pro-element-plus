import { defineConfig } from 'vitepress'
import {
  containerPreview,
  componentPreview,
} from '@vitepress-demo-preview/plugin'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { DOCS_BASE } from '../../../scripts/package-config.mjs'

export default defineConfig({
  title: 'Pro Element Plus',
  description: 'A component library built on top of Element Plus.',
  base: DOCS_BASE,
  vite: {
    plugins: [vueJsx()],
    server: {
      port: 9527,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './theme'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/element/index.scss" as *;`,
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  },
  themeConfig: {
    nav: [
      { text: 'Get Started', link: '/get-started' },
      { text: 'Components', link: '/components/ProTable/index.md' },
    ],
    search: {
      provider: 'local',
    },
    sidebar: [
      {
        text: 'Guide',
        collapsed: false,
        items: [{ text: 'Get Started', link: '/get-started' }],
      },
      {
        text: 'Components',
        collapsed: false,
        items: [
          { text: 'ProCol', link: 'components/ProCol/index.md' },
          { text: 'ProHeader', link: 'components/ProHeader/index.md' },
          { text: 'ProTable', link: 'components/ProTable/index.md' },
        ],
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/hedong433664/pro-element-plus',
      },
    ],
  },
  markdown: {
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    },
  },
})
