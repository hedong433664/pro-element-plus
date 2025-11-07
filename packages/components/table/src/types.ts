// import tableProps from 'element-plus/es/components/table/src/table/defaults'
import tableColumnProps from 'element-plus/es/components/table/src/table-column/defaults'

import type { ExtractPublicPropTypes, PropType, VNodeChild } from 'vue'
import type { TableProps, TableColumnCtx, PaginationProps } from 'element-plus'

type DefaultRow = Record<PropertyKey, any>

type CellSlots = {
  default?: (data: {
    row: any
    column: TableColumnCtx<any>
    $index: number
  }) => VNodeChild
  header?: (data: { column: TableColumnCtx<any>; $index: number }) => VNodeChild
  filterIcon?: (data: { filterOpened: boolean }) => VNodeChild
  expand?: (data: { expanded: boolean }) => VNodeChild
}

export const proTableColumn = {
  ...tableColumnProps,
  /**
   * 列插槽
   */
  cellSlots: {
    type: Object as PropType<CellSlots>,
    default: () => ({}),
  },
}

export type ProTableColumn = ExtractPublicPropTypes<typeof proTableColumn>

export type ProTableProps<T extends DefaultRow = DefaultRow> = TableProps<T> &
  Partial<PaginationProps> & {
    /**
     * 列配置
     */
    columns: ProTableColumn[]
    /**
     * 是否隐藏分页
     * @default false
     */
    hidePagination?: boolean
  }
