import { withInstall, type SFCWithInstall } from 'element-plus/es/utils/index'
import { ElForm } from 'element-plus'
import Form from './src/form.vue'
import type { ProFormPublicProps, ProFormSlots } from './src/types'

type ElFormInstance = InstanceType<typeof ElForm>

type ProFormComponent = typeof ElForm & {
  new (): ElFormInstance & {
    $props: ElFormInstance['$props'] & ProFormPublicProps
    $emit: ElFormInstance['$emit']
    $slots: ProFormSlots
  }
}

export const ProForm: SFCWithInstall<ProFormComponent> = withInstall(
  Form,
) as unknown as SFCWithInstall<ProFormComponent>

export default ProForm

export * from './src/types'
