import { createApp } from "vue"
import App from "./App.vue"
import { ProCheckboxGroup, ProRadioGroup } from "@pro-element-plus/components"
import "pro-element-plus/dist/index.css"

const app = createApp(App)

app.component("ProCheckboxGroup", ProCheckboxGroup)
app.component("ProRadioGroup", ProRadioGroup)
app.mount("#app")
