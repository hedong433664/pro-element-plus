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

import ProElementPlus from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/dist/index.css'

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
