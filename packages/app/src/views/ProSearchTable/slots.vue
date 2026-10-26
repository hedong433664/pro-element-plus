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
    border
    stripe
  >
    <template #search-keyword="{ value, setValue }">
      <ElInput
        :model-value="String(value ?? '')"
        placeholder="姓名或邮箱"
        clearable
        @update:model-value="setValue"
      >
        <template #prepend>搜索</template>
      </ElInput>
    </template>
    <template #search-actions>
      <ElButton @click="fillKeyword">填充关键字</ElButton>
    </template>
    <template #toolbar>
      <ElSpace wrap>
        <ElButton @click="table?.reload()">刷新当前页</ElButton>
        <ElTag effect="plain">共 {{ table?.total ?? 0 }} 项</ElTag>
        <span v-if="detail">
          当前查看：{{ detail.name }} · {{ detail.email }} · {{ detail.city }}
        </span>
      </ElSpace>
    </template>
    <template #table-name="{ row }">
      <strong>{{ row.name }}</strong>
    </template>
    <template #table-nameHeader>姓名（模板表头）</template>
    <template #table-actions="{ row }">
      <ElButton type="primary" link @click="detail = row">查看</ElButton>
    </template>
    <template #table-empty>没有匹配的数据</template>
  </ProSearchTable>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { ElButton, ElInput, ElSpace, ElTag } from 'element-plus'
import {
  type ProSearchTableInstance,
  type ProTableColumn,
} from '@coderhd/pro-element-plus'
import { createSearchModel, request, type DataRow } from './data'
import { createColumns, createFields } from './schema'

const table = ref<ProSearchTableInstance<DataRow> | null>(null)
const detail = ref<DataRow | null>(null)
const model = reactive(createSearchModel())
const fields = createFields().map((field) =>
  field.prop === 'keyword'
    ? ({
        prop: 'keyword',
        // label: '关键字',
        labelWidth: 0,
        slotName: 'keyword',
        colProps: field.colProps,
      } as const)
    : field,
)
const columns: ProTableColumn<DataRow>[] = [
  ...createColumns()
    .filter((column) => column.columnKey !== 'actions')
    .map((column) =>
      column.prop === 'name'
        ? { ...column, slotNames: { default: 'name', header: 'nameHeader' } }
        : column,
    ),
  {
    label: '操作',
    width: 90,
    fixed: 'right',
    slotNames: { default: 'actions' },
  },
]
const fillKeyword = () => {
  model.keyword = '用户 1'
}
</script>
