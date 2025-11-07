import { withInstall } from '@pro-element-plus/utils'
import Table from './src/table.vue'

export const ProTable = withInstall(Table)

export * from './src/types'

declare module 'vue' {
  export interface GlobalComponents {
    ProTable: typeof ProTable
  }
}
