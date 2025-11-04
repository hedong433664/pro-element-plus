import { createApp } from 'vue'
import App from './App.vue'
import ProElementPlus from '@coderhd/pro-element-plus'
import { ElButton, ElInput, ElInputNumber, ElSelect } from 'element-plus'
import '@coderhd/pro-element-plus/dist/index.css'

const app = createApp(App)

app.use(ProElementPlus)
app.use(ElButton)
app.use(ElInput)
app.use(ElInputNumber)
app.use(ElSelect)
app.mount('#app')
