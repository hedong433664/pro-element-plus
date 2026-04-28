import { createApp } from 'vue'
import './styles/index.scss'
import App from './App.vue'
import router from './router'

import { proFormComponentsKey } from '@coderhd/pro-element-plus'
import { ElInput, ElSelect, ElRadioGroup, ElDatePicker } from 'element-plus'

const app = createApp(App)

app.provide(proFormComponentsKey, {
  ElInput,
  ElSelect,
  ElRadioGroup,
  ElDatePicker,
})
app.use(router)
app.mount('#app')
