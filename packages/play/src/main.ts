import { createApp } from 'vue'
import App from './App.vue'
import ProElementPlus from 'pro-element-plus'
import { ElButton, ElInput, ElInputNumber, ElSelect } from 'element-plus'
import 'pro-element-plus/dist/index.css'

const app = createApp(App)

app.use(ProElementPlus)
app.use(ElButton)
app.use(ElInput)
app.use(ElInputNumber)
app.use(ElSelect)
app.mount('#app')
