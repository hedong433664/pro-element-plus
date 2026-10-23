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
import {
  ProTable,
  type ProTableColumn,
  type ProTablePaginationProps,
} from '@coderhd/pro-element-plus'
import { vLoading } from 'element-plus'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

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

const paginationProps = computed<ProTablePaginationProps>(() => ({
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [10, 20, 30, 50],
  background: true,
}))

let requestId = 0
const loadData = async () => {
  const id = ++requestId
  const page = currentPage.value
  const size = pageSize.value
  try {
    loading.value = true
    // 模拟延迟返回的分页数据，并忽略过期结果。
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (id !== requestId) return
    const start = (page - 1) * size
    total.value = 100
    data.value = Array.from(
      { length: Math.max(0, Math.min(size, total.value - start)) },
      (_, i) => ({
        name: `用户 ${start + i + 1}`,
        age: 20 + (i % 10),
        address: `测试地址 ${start + i + 1}`,
      }),
    )
  } finally {
    if (id === requestId) loading.value = false
  }
}

const handlePagination = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  loadData()
}

onBeforeUnmount(() => {
  requestId++
})

onMounted(() => {
  loadData()
})
</script>
