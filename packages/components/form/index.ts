import { withInstall } from '@pro-element-plus/utils'
import Form from './src/form.vue'

export const ProForm = withInstall(Form)

export * from './src/types'

declare module 'vue' {
  export interface GlobalComponents {
    ProForm: typeof ProForm
  }
}
