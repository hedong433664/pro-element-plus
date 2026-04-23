<script lang="ts">
import { ElPagination, ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, h, ref, shallowRef, useAttrs, watch } from 'vue'
import { omit } from 'lodash-es'

import type { TableInstance } from 'element-plus'
import type { Component, Slots, VNode, VNodeChild } from 'vue'
import type { ProTableColumn, ProTableInstance } from './table'
import { proTableProps } from './table'

const TableComponent = ElTable as Component
const TableColumnComponent = ElTableColumn as Component
const PaginationComponent = ElPagination as Component

type ToggleRowSelectionArgs = Parameters<TableInstance['toggleRowSelection']>
type ToggleRowExpansionArgs = Parameters<TableInstance['toggleRowExpansion']>
type SetCurrentRowArgs = Parameters<TableInstance['setCurrentRow']>
type ClearFilterArgs = Parameters<TableInstance['clearFilter']>
type SortArgs = Parameters<TableInstance['sort']>
type ScrollToArgs = Parameters<TableInstance['scrollTo']>
type SetScrollTopArgs = Parameters<TableInstance['setScrollTop']>
type SetScrollLeftArgs = Parameters<TableInstance['setScrollLeft']>

const getColumnKey = (column: ProTableColumn, index: number) =>
  column.columnKey || column.prop || column.label || `pro-table-column-${index}`

const getPaginationIndex = (
  index: number,
  currentPage: number,
  pageSize: number,
) => {
  return (currentPage - 1) * pageSize + index + 1
}

const getColumnProps = (
  column: ProTableColumn,
  currentPage: number,
  pageSize: number,
): Record<string, unknown> => {
  const columnProps = omit(column, [
    'cellSlots',
    'slotNames',
    'children',
    'hidden',
  ]) as Record<string, unknown>

  if (column.type === 'index' && column.index == null) {
    columnProps.index = (index: number) =>
      getPaginationIndex(index, currentPage, pageSize)
  }

  return columnProps
}

const isColumnHidden = (column: ProTableColumn): boolean =>
  typeof column.hidden === 'function' ? column.hidden() : !!column.hidden

const getVisibleChildren = (column: ProTableColumn): ProTableColumn[] =>
  (column.children ?? []).filter((child) => !isColumnHidden(child))

const getColumnSlots = (
  column: ProTableColumn,
  templateSlots: Slots,
): Record<string, (...args: any[]) => VNodeChild> => {
  const renderSlots = { ...(column.cellSlots ?? {}) } as Record<
    string,
    (...args: any[]) => VNodeChild
  >

  for (const [slotKey, slotName] of Object.entries(column.slotNames ?? {})) {
    if (!slotName || renderSlots[slotKey]) continue
    const templateSlot = templateSlots[slotName]
    if (!templateSlot) continue
    renderSlots[slotKey] = (scope) => templateSlot(scope)
  }

  return renderSlots
}

const renderColumn = (
  column: ProTableColumn,
  index: number,
  templateSlots: Slots,
  currentPage: number,
  pageSize: number,
): VNode | null => {
  if (isColumnHidden(column)) return null

  const children = getVisibleChildren(column)
  const slots = getColumnSlots(column, templateSlots)

  if (children.length > 0) {
    delete slots.default
    slots.default = () =>
      children
        .map((child, childIndex) =>
          renderColumn(child, childIndex, templateSlots, currentPage, pageSize),
        )
        .filter((child): child is VNode => child !== null)
  }

  if (column.children?.length && children.length === 0) return null

  return h(
    TableColumnComponent,
    {
      key: getColumnKey(column, index),
      ...getColumnProps(column, currentPage, pageSize),
    },
    slots,
  )
}

export default defineComponent({
  name: 'ProTable',
  inheritAttrs: false,
  props: proTableProps,
  emits: {
    'update:currentPage': (val: number) => typeof val === 'number',
    'update:pageSize': (val: number) => typeof val === 'number',
    pagination: (currentPage: number, pageSize: number) =>
      typeof currentPage === 'number' && typeof pageSize === 'number',
  },
  setup(props, { emit, expose, slots }) {
    const attrs = useAttrs()
    const tableRef = shallowRef<TableInstance | null>(null)
    const innerCurrentPage = ref(props.currentPage)
    const innerPageSize = ref(props.pageSize)
    const getInstance = () => tableRef.value
    const changeRef = (tableInstance: TableInstance | null) => {
      tableRef.value = tableInstance
    }

    watch(
      () => props.currentPage,
      (value) => {
        innerCurrentPage.value = value
      },
    )

    watch(
      () => props.pageSize,
      (value) => {
        innerPageSize.value = value
      },
    )

    const handlePaginationCurrentPageChange = (value: number) => {
      innerCurrentPage.value = value
      emit('update:currentPage', value)
      emit('pagination', value, innerPageSize.value)
    }

    const handlePaginationPageSizeChange = (value: number) => {
      innerPageSize.value = value
      emit('update:pageSize', value)
      emit('pagination', innerCurrentPage.value, value)
    }

    const getPaginationProps = () => ({
      ...props.paginationProps,
      currentPage: innerCurrentPage.value,
      pageSize: innerPageSize.value,
      total: props.total ?? props.data.length,
      'onUpdate:currentPage': handlePaginationCurrentPageChange,
      'onUpdate:pageSize': handlePaginationPageSizeChange,
    })

    expose({
      get tableRef() {
        return tableRef.value
      },
      get instance() {
        return tableRef.value
      },
      getInstance,
      clearSelection: () => tableRef.value?.clearSelection(),
      getSelectionRows: () => tableRef.value?.getSelectionRows(),
      toggleRowSelection: (...args: ToggleRowSelectionArgs) =>
        tableRef.value?.toggleRowSelection(...args),
      toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
      toggleRowExpansion: (...args: ToggleRowExpansionArgs) =>
        tableRef.value?.toggleRowExpansion(...args),
      setCurrentRow: (...args: SetCurrentRowArgs) =>
        tableRef.value?.setCurrentRow(...args),
      clearSort: () => tableRef.value?.clearSort(),
      clearFilter: (...args: ClearFilterArgs) =>
        tableRef.value?.clearFilter(...args),
      doLayout: () => tableRef.value?.doLayout(),
      sort: (...args: SortArgs) => tableRef.value?.sort(...args),
      scrollTo: (...args: ScrollToArgs) => tableRef.value?.scrollTo(...args),
      setScrollTop: (...args: SetScrollTopArgs) =>
        tableRef.value?.setScrollTop(...args),
      setScrollLeft: (...args: SetScrollLeftArgs) =>
        tableRef.value?.setScrollLeft(...args),
    } as ProTableInstance)

    return () =>
      h('div', { class: 'pro-table' }, [
        h(
          TableComponent,
          {
            ref: changeRef,
            ...attrs,
            ...omit(props, [
              'columns',
              'hidePagination',
              'currentPage',
              'pageSize',
              'total',
              'paginationProps',
            ]),
          },
          {
            default: () =>
              props.columns
                .map((column, index) =>
                  renderColumn(
                    column,
                    index,
                    slots,
                    innerCurrentPage.value,
                    innerPageSize.value,
                  ),
                )
                .filter((column): column is VNode => column !== null),
            append: () => slots.append?.(),
            empty: () => slots.empty?.(),
          },
        ),
        !props.hidePagination
          ? h(PaginationComponent, {
              class: 'pro-table__pagination',
              ...getPaginationProps(),
            })
          : null,
      ])
  },
})
</script>
