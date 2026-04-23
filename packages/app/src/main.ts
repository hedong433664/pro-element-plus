import { createApp } from 'vue'
import './styles/index.scss'
import router from '@/router'
import App from './App.vue'

// import ProElementPlus from '@coderhd/pro-element-plus'
// import '@coderhd/pro-element-plus/style.css'

const app = createApp(App)

app.use(router)
// app.use(ProElementPlus)
app.mount('#app')
