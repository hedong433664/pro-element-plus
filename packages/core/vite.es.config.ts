import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { getComponentEntries } from './scripts/component-entries'
import { createLibBuildPlugins } from './vite.lib-plugins'
import { isExternalLib } from './vite.external'

export default defineConfig({
  plugins: createLibBuildPlugins(
    dts({
      tsconfigPath: resolve(__dirname, '../../tsconfig.dts-es.json'),
      outDir: 'dist/es',
      entryRoot: resolve(__dirname, '../components'),
      exclude: [
        'vite.*.config.ts',
        '**/node_modules/**',
        'scripts/**',
        '**/components/index.ts',
        '**/resolver.ts',
        '**/vite.external.ts',
        '**/vite.lib-plugins.ts',
      ],
      rollupTypes: false,
      copyDtsFiles: true,
    }),
  ),
  build: {
    outDir: 'dist/es',
    emptyOutDir: true,
    lib: {
      entry: getComponentEntries(__dirname),
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.mjs`,
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
