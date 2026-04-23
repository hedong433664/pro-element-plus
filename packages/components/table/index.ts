import { withInstall, type SFCWithInstall } from 'element-plus/es/utils/index'
import { ElTable } from 'element-plus'
import Table from './src/table.vue'
import type {
  ProTableInstance,
  ProTablePaginationModelEmits,
  ProTablePaginationModelEventProps,
  ProTablePublicProps,
  ProTableSlots,
} from './src/table'

type ElTableInstance = InstanceType<typeof ElTable>

type ProTableComponent = typeof ElTable & {
  new (): ProTableInstance &
    Omit<ElTableInstance, keyof ProTableInstance> & {
      $props: ElTableInstance['$props'] &
        ProTablePublicProps &
        ProTablePaginationModelEventProps
      $emit: ElTableInstance['$emit'] & ProTablePaginationModelEmits
      $slots: ProTableSlots
    }
}

export const ProTable: SFCWithInstall<ProTableComponent> = withInstall(
  Table,
) as unknown as SFCWithInstall<ProTableComponent>

export default ProTable

export * from './src/table'
