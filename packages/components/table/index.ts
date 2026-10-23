import { withInstall, type SFCWithInstall } from '../_utils/install'
import { ElTable, type TableInstance } from 'element-plus'
import Table from './src/table.vue'
import type {
  ProTableInstance,
  ProTablePaginationModelEmits,
  ProTablePaginationModelEventProps,
  ProTablePublicProps,
  ProTableSlots,
} from './src/table'

type ElTableInstance = InstanceType<typeof ElTable>

type ProTableComponent = {
  new (): ProTableInstance &
    Omit<ElTableInstance, keyof TableInstance | keyof ProTableInstance> & {
      $props: ElTableInstance['$props'] &
        ProTablePublicProps &
        ProTablePaginationModelEventProps
      $emit: ElTableInstance['$emit'] & ProTablePaginationModelEmits
      $slots: ProTableSlots
    }
}

export const ProTable: SFCWithInstall<ProTableComponent> =
  /* @__PURE__ */ withInstall(
    Table,
  ) as unknown as SFCWithInstall<ProTableComponent>

export default ProTable

export * from './src/table'
