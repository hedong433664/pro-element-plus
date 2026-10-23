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
 * 按 package.json 的 exports 读取组件库构建产物。
 * 先执行根目录 pnpm build，或使用包含构建步骤的 pnpm start。
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
