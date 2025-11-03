import DefaultTheme from 'vitepress/theme'
import { ElementPlusContainer } from '@vitepress-demo-preview/component'
import {
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElDivider,
  ElInput,
  ElInputNumber,
  ElButton,
  ElSwitch,
  ElSelect,
  ElCheckboxGroup,
  ElRadioGroup,
  ElDatePicker,
  ElTimePicker,
} from 'element-plus'

import ProElementPlus from 'pro-element-plus'
import 'pro-element-plus/dist/index.css'

// 导入elm样式
import 'element-plus/theme-chalk/src/base.scss'
import 'element-plus/theme-chalk/src/form.scss'
import 'element-plus/theme-chalk/src/form-item.scss'
import 'element-plus/theme-chalk/src/row.scss'
import 'element-plus/theme-chalk/src/col.scss'
import 'element-plus/theme-chalk/src/button.scss'
import 'element-plus/theme-chalk/src/divider.scss'
import 'element-plus/theme-chalk/src/input.scss'
import 'element-plus/theme-chalk/src/input-number.scss'
import 'element-plus/theme-chalk/src/switch.scss'
import 'element-plus/theme-chalk/src/select.scss'
import 'element-plus/theme-chalk/src/checkbox-group.scss'
import 'element-plus/theme-chalk/src/radio-group.scss'
import 'element-plus/theme-chalk/src/date-picker-panel.scss'
import 'element-plus/theme-chalk/src/date-picker.scss'
import 'element-plus/theme-chalk/src/time-picker.scss'

import '@vitepress-demo-preview/component/dist/style.css'
import './index.scss'

import type { App } from 'vue'

export default {
  ...DefaultTheme,
  enhanceApp: async ({ app }: { app: App }) => {
    app.component('demo-preview', ElementPlusContainer)
    app.component('ElForm', ElForm)
    app.component('ElFormItem', ElFormItem)
    app.component('ElRow', ElRow)
    app.component('ElCol', ElCol)
    app.component('ElDivider', ElDivider)
    app.component('ElInput', ElInput)
    app.component('ElInputNumber', ElInputNumber)
    app.component('ElButton', ElButton)
    app.component('ElSwitch', ElSwitch)
    app.component('ElSelect', ElSelect)
    app.component('ElCheckboxGroup', ElCheckboxGroup)
    app.component('ElRadioGroup', ElRadioGroup)
    app.component('ElDatePicker', ElDatePicker)
    app.component('ElTimePicker', ElTimePicker)
    app.use(ProElementPlus)
  },
}
