import { defineConfig } from 'vitepress'
import { createMarkdownStyleIsolation } from './markdown-style-isolation'
import {
  containerPreview,
  componentPreview,
} from '@vitepress-demo-preview/plugin'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'

const PACKAGE_NAME = '@coderhd/pro-element-plus'
const DOCS_BASE = '/pro-element-plus/'

const docsRoot = __dirname
const coreRoot = path.resolve(docsRoot, '../../core')
const componentsRoot = path.resolve(docsRoot, '../../components')

export default defineConfig({
  lang: 'zh-CN',
  title: 'Pro Element Plus',
  description: '基于 Vue 3 与 Element Plus 的二次封装组件库。',
  base: DOCS_BASE,
  vite: {
    plugins: [vueJsx()],
    server: {
      port: 9527,
    },
    resolve: {
      alias: [
        {
          find: `${PACKAGE_NAME}/style.css`,
          replacement: path.join(componentsRoot, 'styles/index.scss'),
        },
        {
          find: new RegExp(
            `^${PACKAGE_NAME.replace('/', '\\/')}/css/(.+)\\.css$`,
          ),
          replacement: `${componentsRoot}/styles/$1.scss`,
        },
        {
          find: new RegExp(
            `^${PACKAGE_NAME.replace('/', '\\/')}/es/([^/]+)/style/css$`,
          ),
          replacement: `${componentsRoot}/$1/style/css.ts`,
        },
        {
          find: new RegExp(
            `^${PACKAGE_NAME.replace('/', '\\/')}/es/([^/]+)/style$`,
          ),
          replacement: `${componentsRoot}/$1/style/index.ts`,
        },
        {
          find: new RegExp(
            `^${PACKAGE_NAME.replace('/', '\\/')}/lib/([^/]+)/style/css$`,
          ),
          replacement: `${componentsRoot}/$1/style/css.ts`,
        },
        {
          find: new RegExp(
            `^${PACKAGE_NAME.replace('/', '\\/')}/lib/([^/]+)/style$`,
          ),
          replacement: `${componentsRoot}/$1/style/index.ts`,
        },
        {
          find: new RegExp(`^${PACKAGE_NAME.replace('/', '\\/')}/es/([^/]+)$`),
          replacement: `${componentsRoot}/$1/index.ts`,
        },
        {
          find: new RegExp(`^${PACKAGE_NAME.replace('/', '\\/')}/lib/([^/]+)$`),
          replacement: `${componentsRoot}/$1/index.ts`,
        },
        {
          find: `${PACKAGE_NAME}/resolver`,
          replacement: path.join(coreRoot, 'resolver.ts'),
        },
        {
          find: PACKAGE_NAME,
          replacement: path.join(coreRoot, 'index.ts'),
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, './theme'),
        },
      ],
    },
    css: {
      postcss: {
        plugins: [createMarkdownStyleIsolation()],
      },
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
      { text: '快速开始', link: '/get-started' },
      { text: '组件文档', link: '/components/ProCol/index.md' },
    ],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdatedText: '最后更新于',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    skipToContentLabel: '跳转到正文',
    langMenuLabel: '切换语言',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色主题',
    darkModeSwitchTitle: '切换到深色主题',
    notFound: {
      title: '页面不存在',
      quote: '请检查访问地址，或返回首页查看组件文档。',
      linkLabel: '返回首页',
      linkText: '返回首页',
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清空搜索',
                backButtonTitle: '返回搜索',
                noResultsText: '未找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车键',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上方向键',
                  navigateDownKeyAriaLabel: '下方向键',
                  closeText: '关闭',
                  closeKeyAriaLabel: '退出键',
                },
              },
            },
          },
        },
      },
    },
    sidebar: [
      {
        text: '使用指南',
        collapsed: false,
        items: [
          { text: '快速开始', link: '/get-started' },
          { text: '用法示例', link: '/api-examples' },
        ],
      },
      {
        text: '组件文档',
        collapsed: false,
        items: [
          { text: 'ProCol 栅格布局', link: '/components/ProCol/index.md' },
          { text: 'ProForm 配置式表单', link: '/components/ProForm/index.md' },
          {
            text: 'ProSearchForm 查询表单',
            link: '/components/ProSearchForm/index.md',
          },
          {
            text: 'ProHeader 标题组件',
            link: '/components/ProHeader/index.md',
          },
          {
            text: 'ProTable 配置式表格',
            link: '/components/ProTable/index.md',
          },
          {
            text: 'ProSearchTable 查询表格',
            link: '/components/ProSearchTable/index.md',
          },
        ],
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        ariaLabel: '查看 GitHub 源码',
        link: 'https://github.com/hedong433664/pro-element-plus',
      },
    ],
  },
  markdown: {
    codeCopyButtonTitle: '复制代码',
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    },
  },
})
