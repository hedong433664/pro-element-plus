import { withInstall } from '@pro-element-plus/utils'
import SearchForm from './src/search-form.vue'

export const ProSearchForm = withInstall(SearchForm)

export * from './src/types'

declare module 'vue' {
  export interface GlobalComponents {
    ProSearchForm: typeof ProSearchForm
  }
}
