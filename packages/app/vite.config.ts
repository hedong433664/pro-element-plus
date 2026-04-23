import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ProElementPlusResolver } from '@coderhd/pro-element-plus/resolver'
import vueJsx from '@vitejs/plugin-vue-jsx'

const dir = path.dirname(fileURLToPath(import.meta.url))

/**
 * 模拟生产：按 package.json 的 exports 使用已构建的 `@coderhd/pro-element-plus/dist`。
 * 请先执行根目录 `pnpm build`（或 `pnpm start`，已包含构
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
    alias: {
      '@': path.resolve(dir, 'src'),
    },
  },
  server: {
    port: 8080,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/element/index.scss" as *;',
      },
    },
  },
})
