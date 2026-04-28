import { defineConfig } from 'vite'
import { resolve } from 'path'
import { createLibBuildPlugins } from './vite.lib-plugins'
import { isExternalLib } from './vite.external'

export default defineConfig({
  plugins: createLibBuildPlugins(),
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'ProElementPlus',
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: isExternalLib,
      output: {
        exports: 'named',
      },
    },
  },
  resolve: {
    alias: {
      '@coderhd/pro-element-plus/components': resolve(
        __dirname,
        '../components',
      ),
    },
  },
})
