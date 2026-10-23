import type { PropType, VNodeChild } from 'vue'
import type {
  PaginationPropsPublic,
  TableColumnCtx,
  TableInstance,
  TableProps,
} from 'element-plus'
import type { FieldPath } from '../../_utils/types'

type DefaultRow = Record<string, any>

type TableColumnFilters<T extends DefaultRow = DefaultRow> =
  TableColumnCtx<T>['filters']
type TableColumnFilterMethod<T extends DefaultRow = DefaultRow> =
  TableColumnCtx<T>['filterMethod']
type TableColumnSortOrders<T extends DefaultRow = DefaultRow> =
  TableColumnCtx<T>['sortOrders']

export type ProTableColumnDefaultSlotScope<T extends DefaultRow = DefaultRow> =
  {
    row: T
    column: TableColumnCtx<T>
    $index: number
  }

export type ProTableColumnHeaderSlotScope<T extends DefaultRow = DefaultRow> = {
  column: TableColumnCtx<T>
  $index: number
}

export type ProTableColumnFilterIconSlotScope<
  T extends DefaultRow = DefaultRow,
> = {
  filterOpened: boolean
  column: TableColumnCtx<T>
}

export type ProTableColumnExpandSlotScope<T extends DefaultRow = DefaultRow> = {
  row: T
  $index: number
  store: unknown
  expanded: boolean
}

export interface ProTableColumnSlots<T extends DefaultRow = DefaultRow> {
  default?: (scope: ProTableColumnDefaultSlotScope<T>) => VNodeChild
  header?: (scope: ProTableColumnHeaderSlotScope<T>) => VNodeChild
  'filter-icon'?: (scope: ProTableColumnFilterIconSlotScope<T>) => VNodeChild
  expand?: (scope: ProTableColumnExpandSlotScope<T>) => VNodeChild
}

export interface ProTableColumnSlotNames {
  default?: string
  header?: string
  'filter-icon'?: string
  expand?: string
}

export interface ProTableColumn<T extends DefaultRow = DefaultRow> {
  type?: 'default' | 'selection' | 'index' | 'expand'
  label?: string
  className?: string
  labelClassName?: string
  property?: FieldPath<T>
  prop?: FieldPath<T>
  width?: string | number
  minWidth?: string | number
  renderHeader?: TableColumnCtx<T>['renderHeader']
  sortable?: boolean | 'custom'
  sortMethod?: TableColumnCtx<T>['sortMethod']
  sortBy?: TableColumnCtx<T>['sortBy']
  resizable?: boolean
  columnKey?: string
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  showOverflowTooltip?: TableColumnCtx<T>['showOverflowTooltip']
  tooltipFormatter?: TableColumnCtx<T>['tooltipFormatter']
  fixed?: boolean | 'left' | 'right'
  formatter?: TableColumnCtx<T>['formatter']
  selectable?: TableColumnCtx<T>['selectable']
  reserveSelection?: boolean
  filterMethod?: TableColumnFilterMethod<T>
  filteredValue?: string[]
  filters?: TableColumnFilters<T>
  filterPlacement?: string
  filterMultiple?: boolean
  filterClassName?: string
  index?: number | ((index: number) => number)
  sortOrders?: TableColumnSortOrders<T>
  hidden?: boolean | (() => boolean)
  cellSlots?: ProTableColumnSlots<T>
  slotNames?: ProTableColumnSlotNames
  children?: ProTableColumn<T>[]
}

export type ProTablePaginationProps = Partial<
  Omit<
    PaginationPropsPublic,
    | 'currentPage'
    | 'pageSize'
    | 'defaultCurrentPage'
    | 'defaultPageSize'
    | 'total'
  >
>

export const proTableProps = {
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array as PropType<ProTableColumn<any>[]>,
    default: () => [],
  },
  hidePagination: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
  },
  paginationProps: {
    type: Object as PropType<ProTablePaginationProps>,
    default: () => ({
      layout: 'total, sizes, prev, pager, next, jumper',
    }),
  },
} as const

export type ProTableProps<T extends DefaultRow = DefaultRow> = Partial<
  TableProps<T>
> & {
  columns?: ProTableColumn<T>[]
  hidePagination?: boolean
  currentPage?: number
  pageSize?: number
  total?: number
  paginationProps?: ProTablePaginationProps
}

export type ProTablePublicProps = ProTableProps<any>

export interface ProTablePaginationModelEventProps {
  'onUpdate:currentPage'?: (value: number) => void
  'onUpdate:pageSize'?: (value: number) => void
  onPagination?: (currentPage: number, pageSize: number) => void
}

export interface ProTablePaginationModelEmits {
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
  (event: 'pagination', currentPage: number, pageSize: number): void
}

export interface ProTableSlots {
  [slotName: string]: ((scope: any) => VNodeChild) | undefined
  append?: () => VNodeChild
  empty?: () => VNodeChild
}

export interface ProTableInstance extends Pick<
  TableInstance,
  | 'clearSelection'
  | 'getSelectionRows'
  | 'toggleRowSelection'
  | 'toggleAllSelection'
  | 'toggleRowExpansion'
  | 'setCurrentRow'
  | 'clearSort'
  | 'clearFilter'
  | 'doLayout'
  | 'sort'
  | 'scrollTo'
  | 'setScrollTop'
  | 'setScrollLeft'
> {
  tableRef: TableInstance | null
  instance: TableInstance | null
  getInstance: () => TableInstance | null
}
