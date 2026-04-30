import { ElForm } from 'element-plus'
import { withInstall, type SFCWithInstall } from 'element-plus/es/utils/index'

import SearchForm from './src/search-form.vue'
import type { ProSearchFormPublicProps, ProSearchFormSlots } from './src/types'

type ElFormInstance = InstanceType<typeof ElForm>

type ProSearchFormComponent = typeof ElForm & {
  new (): ElFormInstance & {
    $props: ElFormInstance['$props'] & ProSearchFormPublicProps
    $emit: ElFormInstance['$emit']
    $slots: ProSearchFormSlots
  }
}

export const ProSearchForm: SFCWithInstall<ProSearchFormComponent> =
  withInstall(SearchForm) as unknown as SFCWithInstall<ProSearchFormComponent>

export default ProSearchForm

export * from './src/types'
