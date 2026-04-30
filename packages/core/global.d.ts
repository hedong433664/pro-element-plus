import type {
  ProCol,
  ProForm,
  ProHeader,
  ProSearchForm,
  ProTable,
} from '@coderhd/pro-element-plus'

export {}

declare module 'vue' {
  export interface GlobalComponents {
    ProHeader: typeof ProHeader
    ProCol: typeof ProCol
    ProTable: typeof ProTable
    ProForm: typeof ProForm
    ProSearchForm: typeof ProSearchForm
  }
}
