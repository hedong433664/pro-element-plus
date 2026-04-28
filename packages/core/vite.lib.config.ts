import { defineConfig } from 'vite'
import { resolve } from 'path'
import { getComponentEntries } from './scripts/component-entries'
import { createLibBuildPlugins } from './vite.lib-plugins'
import { isExternalLib } from './vite.external'

export default defineConfig({
  plugins: createLibBuildPlugins(),
  build: {
    outDir: 'dist/lib',
    emptyOutDir: true,
    lib: {
      entry: getComponentEntries(__dirname),
      formats: ['cjs'],
      fileName: (_format, entryName) => `${entryName}.js`,
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
