<template>
  <ProSearchTable
    ref="table"
    :model="model"
    :fields="fields"
    :columns="columns"
    :request="request"
    :auto-search="false"
    :gutter="16"
    :collapsed-count="1"
    label-width="80px"
    height="320px"
    row-key="id"
    border
    stripe
    @selection-change="onSelectionChange"
  >
    <template #toolbar>
      <ElSpace wrap>
        <ElButton
          :disabled="!selection.length"
          @click="table?.getTableInstance()?.clearSelection()"
        >
          清空选择
        </ElButton>
        <span>
          已选 {{ selection.length }} 项：{{
            selection.map((row) => row.name).join('、') || '暂无'
          }}
        </span>
      </ElSpace>
    </template>
  </ProSearchTable>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { ElButton, ElSpace } from 'element-plus'
import {
  type ProSearchTableInstance,
  type ProTableColumn,
} from '@coderhd/pro-element-plus'
import { createSearchModel, request, type DataRow } from './data'
import { createColumns, createFields } from './schema'

const table = ref<ProSearchTableInstance<DataRow> | null>(null)
const model = reactive(createSearchModel())
const selection = ref<DataRow[]>([])
const fields = createFields()
const columns: ProTableColumn<DataRow>[] = [
  { type: 'selection', width: 55, fixed: 'left', reserveSelection: true },
  ...createColumns(),
]
const onSelectionChange = (rows: DataRow[]) => {
  selection.value = rows
}
</script>
