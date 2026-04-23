<template>
  <ProTable
    v-loading="loading"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :columns="columns"
    :data="data"
    :total="total"
    :pagination-props="paginationProps"
    border
    stripe
    height="320px"
    @pagination="handlePagination"
  />
</template>

<script setup lang="ts">
import type { ProTableColumn } from '@coderhd/pro-element-plus'
import { computed, onMounted, ref } from 'vue'

type DataRow = {
  name: string
  age: number
  address: string
}

const loading = ref(false)
const data = ref<DataRow[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const columns = computed<ProTableColumn<DataRow>[]>(() => [
  {
    type: 'index',
    label: '序号',
    width: 70,
  },
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '年龄',
    prop: 'age',
    width: 100,
  },
  {
    label: '地址',
    prop: 'address',
  },
])

const paginationProps = computed(() => ({
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [10, 20, 30, 50],
  background: true,
}))

const loadData = async () => {
  try {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 500))
    data.value = Array.from({ length: pageSize.value }, (_, i) => ({
      name: `用户 ${i + 1 + (currentPage.value - 1) * pageSize.value}`,
      age: 20 + (i % 10),
      address: `测试地址 ${i + 1 + (currentPage.value - 1) * pageSize.value}`,
    }))
    total.value = 100
  } finally {
    loading.value = false
  }
}

const handlePagination = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  loadData()
}

onMounted(() => {
  loadData()
})
</script>
