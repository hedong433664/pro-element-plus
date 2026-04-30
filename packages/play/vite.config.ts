import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ProElementPlusResolver } from '../core/resolver'

const PACKAGE_NAME = '@coderhd/pro-element-plus'

const dir = path.dirname(fileURLToPath(import.meta.url))
const coreRoot = path.resolve(dir, '../core')
const componentsRoot = path.resolve(dir, '../components')

/**
 * 开发预览：将 `@coderhd/pro-element-plus` 解析到源码与组件 SCSS，无需先构建 dist。
 */
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    ElementPlus({ useSource: true }),
    Components({
      resolvers: [
        ElementPlusResolver({ importStyle: 'sass' }),
        ProElementPlusResolver(),
      ],
    }),
  ],
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
        replacement: path.resolve(dir, 'src'),
      },
    ],
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/element/index.scss" as *;',
      },
    },
  },
})
