<template>
  <ProForm ref="form" :model="model" :fields="fields">
    <template #name="scope">{{ scope.value }}</template>
  </ProForm>
  <ProSearchForm
    ref="search"
    :model="model"
    :fields="fields"
    @search="onSearch"
  />
  <ProTable ref="table" :data="rows" :columns="columns" hide-pagination>
    <template #name="{ row }">{{ row.name }}</template>
  </ProTable>
  <ProSearchTable
    :model="model"
    :fields="fields"
    :columns="columns"
    :request="request"
    size="small"
    @selection-change="onSelect"
  >
    <template #table-name="{ row }">{{ row.name }}</template>
  </ProSearchTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ProForm,
  ProSearchForm,
  ProSearchTable,
  ProTable,
  type ProFormFields,
  type ProTableColumn,
} from '@coderhd/pro-element-plus'
const form = ref<InstanceType<typeof ProForm>>()
const search = ref<InstanceType<typeof ProSearchForm>>()
const table = ref<InstanceType<typeof ProTable>>()
const model = ref({ name: '' })
const fields: ProFormFields<{ name: string }> = [
  { prop: 'name', slotName: 'name' },
]
const rows = [{ name: 'Alice' }]
const columns: ProTableColumn<{ name: string }>[] = [{ prop: 'name' }]
const request = async () => ({ data: rows, total: rows.length })
const onSelect = (_rows: unknown[]) => {}
const onSearch = (_params?: Record<string, any>) => {}
form.value?.getInstance()
search.value?.search()
table.value?.getInstance()
</script>
