import DefaultTheme from 'vitepress/theme'
import { ElementPlusContainer } from '@vitepress-demo-preview/component'
import ElementPlus, {
  ID_INJECTION_KEY,
  ZINDEX_INJECTION_KEY,
} from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import ProElementPlus from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/dist/index.css'

import '@vitepress-demo-preview/component/dist/style.css'
import './index.scss'

import type { App } from 'vue'

export default {
  ...DefaultTheme,
  enhanceApp: async ({ app }: { app: App }) => {
    app.component('demo-preview', ElementPlusContainer)
    app.use(ElementPlus, {
      locale: zhCn,
    })
    app.use(ProElementPlus)
    app.provide(ID_INJECTION_KEY, {
      prefix: 1024,
      current: 0,
    })
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
  },
}
