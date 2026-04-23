import { defineConfig } from 'vitepress'
import {
  containerPreview,
  componentPreview,
} from '@vitepress-demo-preview/plugin'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { DOCS_BASE, PACKAGE_NAME } from '../../../scripts/package-config.mjs'

const docsRoot = __dirname
const coreRoot = path.resolve(docsRoot, '../../core')
const componentsRoot = path.resolve(docsRoot, '../../components')

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
