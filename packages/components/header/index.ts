import { withInstall } from '@pro-element-plus/utils'
import Header from './src/header.vue'

export const ProHeader = withInstall(Header)

export * from './src/types'

declare module 'vue' {
  export interface GlobalComponents {
    ProHeader: typeof ProHeader
  }
}
