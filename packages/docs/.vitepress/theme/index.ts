import DefaultTheme from "vitepress/theme"
import { ElementPlusContainer } from "@vitepress-demo-preview/component"
import "@vitepress-demo-preview/component/dist/style.css"

import ProElementPlus from "pro-element-plus"
import "pro-element-plus/dist/index.css"
import "./index.css"

export default {
  ...DefaultTheme,
  enhanceApp: async ({ app }) => {
    app.component("demo-preview", ElementPlusContainer)
    app.use(ProElementPlus)
  }
}
