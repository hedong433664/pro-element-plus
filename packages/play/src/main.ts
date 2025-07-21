import { createApp } from "vue"
import App from "./App.vue"
import ProElementPlus from "pro-element-plus"
// import { ProRadioGroup } from "pro-element-plus"
import "pro-element-plus/dist/index.css"

const app = createApp(App)

// 全局引入
app.use(ProElementPlus)
// 按需引入
// app.component("ProRadioGroup", ProRadioGroup)
app.mount("#app")
