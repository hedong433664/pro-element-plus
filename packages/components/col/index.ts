import { withInstall } from '@pro-element-plus/utils'
import Col from './src/col.vue'

export const ProCol = withInstall(Col)

export * from './src/types'

declare module 'vue' {
  export interface GlobalComponents {
    ProCol: typeof ProCol
  }
}
