<template>
  <ProSearchTable
    :model="model"
    :fields="fields"
    :columns="columns"
    :request="request"
    :auto-search="true"
    :auto-search-debounce="300"
    :gutter="16"
    :collapsed-count="1"
    label-width="80px"
    height="320px"
    border
    stripe
  />
</template>

<script setup lang="tsx">
import { reactive } from 'vue'
import { createSearchModel, request } from './data'
import { createColumns, createFields } from './schema'

const model = reactive(createSearchModel())
const fields = createFields()
const columns = createColumns()
</script>
