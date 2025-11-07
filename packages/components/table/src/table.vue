<template>
  <div class="pro-table">
    <el-table :ref="changeRef" v-bind="omit(props, 'columns')">
      <template v-for="column in props.columns" :key="column.prop">
        <component
          :is="
            h(
              ElTableColumn,
              { ...omit(column, 'renderCell') },
              { ...column.cellSlots },
            )
          "
        />
      </template>

      <template #append>
        <slot name="append" />
      </template>

      <template #empty>
        <slot name="empty" />
      </template>
    </el-table>

    <div v-if="!hidePagination" class="pro-table__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :size="size"
        :background="background"
        :layout="layout"
        :total="total"
        @size-change="handlePaginationChange"
        @current-change="handlePaginationChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import { omit } from 'lodash-es'

import type { ProTableProps } from './types'
import type { TableInstance } from 'element-plus'
import { h } from 'vue'

defineOptions({
  name: 'ProTable',
})

defineSlots<{
  append: (scope: any) => any
  empty: (scope: any) => any
}>()

const emit = defineEmits<{
  (e: 'pagination-change', currentPage: number, pageSize: number): void
}>()

const props = withDefaults(defineProps<ProTableProps>(), {
  fit: true,
  showHeader: true,
  tooltipEffect: 'dark',
  headerRowClassName: 'pro-table__header',
  tooltipOptions: () => ({
    enterable: true,
    placement: 'top',
    showArrow: true,
    hideAfter: 200,
    popperOptions: { strategy: 'fixed' },
  }),
  sumText: 'Sum',
  selectOnIndeterminate: true,
  indent: 16,
  treeProps: () => ({
    hasChildren: 'hasChildren',
    children: 'children',
    checkStrictly: false,
  }),
  columns: () => [],
  data: () => [],
  pageSizes: () => [10, 20, 50, 100],
  background: false,
  layout: 'total, sizes, prev, pager, next, jumper',
  total: 0,
})

const currentPage = defineModel('currentPage', {
  type: Number,
  default: 1,
})

const pageSize = defineModel('pageSize', {
  type: Number,
  default: 10,
})

const instance = getCurrentInstance()
const changeRef = (exposed: Record<string, any> | null) => {
  instance!.exposed = exposed
  instance!.exposeProxy = exposed
}

const handlePaginationChange = () => {
  emit('pagination-change', currentPage.value, pageSize.value)
}

// defineExpose(
//   {} as {
//     clearSelection: TableInstance['clearSelection']
//     getSelectionRows: TableInstance['getSelectionRows']
//     toggleRowSelection: TableInstance['toggleRowSelection']
//     toggleAllSelection: TableInstance['toggleAllSelection']
//     toggleRowExpansion: TableInstance['toggleRowExpansion']
//     setCurrentRow: TableInstance['setCurrentRow']
//     clearSort: TableInstance['clearSort']
//     clearFilter: TableInstance['clearFilter']
//     doLayout: TableInstance['doLayout']
//     sort: TableInstance['sort']
//     scrollTo: TableInstance['scrollTo']
//     setScrollTop: TableInstance['setScrollTop']
//     setScrollLeft: TableInstance['setScrollLeft']
//     columns: TableInstance['columns']
//     updateKeyChildren: TableInstance['updateKeyChildren']
//   },
// )

defineExpose({} as TableInstance)
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
