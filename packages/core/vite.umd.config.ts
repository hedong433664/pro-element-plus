import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist/umd',
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'ProElementPlus',
      fileName: 'index',
      formats: ['umd'],
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
        },
        assetFileNames: (assertInfo) => {
          if (assertInfo.name === 'style.css') {
            return 'index.css'
          }
          return assertInfo.name as string
        },
      },
    },
  },
})
