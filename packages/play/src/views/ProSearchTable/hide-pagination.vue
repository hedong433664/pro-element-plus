<template>
  <ProSearchTable
    :model="model"
    :fields="fields"
    :columns="columns"
    :request="requestAll"
    :auto-search="false"
    :gutter="16"
    :collapsed-count="1"
    label-width="80px"
    height="320px"
    hide-pagination
    border
    stripe
  />
</template>

<script setup lang="tsx">
import { reactive } from 'vue'
import { type ProSearchTableRequest } from '@coderhd/pro-element-plus'
import {
  createSearchModel,
  filterRows,
  type DataRow,
  type SearchModel,
} from './data'
import { createColumns, createFields } from './schema'

const model = reactive(createSearchModel())
const fields = createFields()
const columns = createColumns()
// 隐藏分页只隐藏控件；这里由 request 返回全部匹配结果，不做切片。
const requestAll: ProSearchTableRequest<SearchModel, DataRow> = async ({
  query,
}) => {
  const data = filterRows(query)
  return { data, total: data.length }
}
</script>
