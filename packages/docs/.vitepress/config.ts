import { defineConfig } from 'vitepress'
import {
  containerPreview,
  componentPreview,
} from '@vitepress-demo-preview/plugin'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Pro Element Plus',
  description: '基于 Element Plus 二次封装组件库',
  base: '/pro-element-plus/',
  vite: {
    plugins: [vueJsx()],
    server: {
      port: 3001,
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'theme'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/element/index.scss" as *;`,
        },
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '开始使用', link: '/get-started' },
      { text: '组件', link: '/components/ProCol/index.md' },
    ],
    search: {
      provider: 'local',
    },
    sidebar: [
      {
        text: '指南',
        collapsed: false,
        items: [{ text: '快速开始', link: '/get-started' }],
      },
      {
        text: '布局组件',
        collapsed: false,
        items: [
          { text: 'ProCol 栅格布局', link: 'components/ProCol/index.md' },
          { text: 'ProHeader 标题', link: 'components/ProHeader/index.md' },
        ],
      },
      {
        text: '表单组件',
        collapsed: false,
        items: [
          { text: 'ProForm 表单', link: 'components/ProForm/index.md' },
          {
            text: 'ProSearchForm 查询表单',
            link: 'components/ProSearchForm/index.md',
          },
        ],
      },
      {
        text: '数据展示',
        collapsed: false,
        items: [
          { text: 'ProTable 表格', link: 'components/ProTable/index.md' },
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
