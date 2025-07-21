import { defineConfig } from "vitepress"
import { containerPreview, componentPreview } from "@vitepress-demo-preview/plugin"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Pro Element Plus",
  description: "基于 Element Plus 二次封装组件库",
  base: "/pro-element-plus/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "开始使用", link: "/get-started" },
      { text: "组件", link: "/components/radioGroup" }
    ],
    search: {
      provider: "local"
    },
    sidebar: [
      {
        text: "指南",
        collapsed: false,
        items: [{ text: "快速开始", link: "/get-started" }]
      },
      {
        text: "表单组件",
        collapsed: false,
        items: [
          { text: "RadioGroup 单选框组", link: "components/radioGroup" },
          { text: "CheckboxGroup 多选框组", link: "components/checkboxGroup" }
        ]
      }
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/hedong433664/pro-element-plus" }
    ]
  },
  markdown: {
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    }
  }
})
