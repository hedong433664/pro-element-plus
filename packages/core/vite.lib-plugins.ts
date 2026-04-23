import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export function createLibBuildPlugins(
  dtsPlugin?: PluginOption,
): PluginOption[] {
  return [
    vue(),
    Components({
      dts: false,
      resolvers: [ElementPlusResolver({ importStyle: 'css' })],
    }),
    dtsPlugin,
  ].filter(Boolean) as PluginOption[]
}
