<template>
  <div class="global-page-container">
    <ProHeader divider>基础用法</ProHeader>

    <ProTable
      :columns="columns"
      :data="data"
      border
      stripe
      hide-pagination
      highlight-current-row
    />

    <ProHeader divider>分页用法</ProHeader>

    <ProTable
      v-loading="loading"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="columns"
      :data="data2"
      :total="total"
      border
      stripe
      height="300px"
      @pagination="handlePagination"
    />

    <ProHeader divider>多级表头</ProHeader>

    <ProTable :columns="columns2" :data="data" border stripe hide-pagination>
      <template #custom>
        <span>自定义插槽内容</span>
      </template>
      <template #customHeader>
        <span>自定义插槽表头</span>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx">
import type { ProTableColumn } from '@coderhd/pro-element-plus'
import { computed, onMounted, ref } from 'vue'

type DataRow = {
  name: string
  age: number
  address: string
}

const data = ref<DataRow[]>(
  Array.from({ length: 5 }, (_, i) => ({
    name: `姓名 ${i + 1}`,
    age: Math.floor(Math.random() * 60) + 20,
    address: `地址 ${i + 1}`,
  })),
)

const loading = ref(false)
const data2 = ref<DataRow[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const columns = computed<ProTableColumn[]>(() => [
  {
    type: 'selection',
    width: 60,
  },
  {
    type: 'index',
    label: '序号',
    width: 60,
  },
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '年龄',
    prop: 'age',
  },
  {
    label: '地址',
    prop: 'address',
  },
  {
    label: '操作',
    width: 240,
    fixed: 'right',
    cellSlots: {
      default: () => {
        return (
          <>
            <el-button type="success" text plain>
              查看
            </el-button>
            <el-button type="primary" text plain>
              编辑
            </el-button>
            <el-button type="danger" text plain>
              删除
            </el-button>
          </>
        )
      },
    },
  },
])

// 多级表头
const columns2 = computed<ProTableColumn[]>(() => [
  {
    label: '个人信息',
    align: 'center',
    children: [
      {
        label: '姓名',
        prop: 'name',
        align: 'center',
      },
      {
        label: '年龄',
        prop: 'age',
        align: 'center',
      },
      {
        cellSlots: {
          default: () => {
            return <el-tag>自定义渲染JSX</el-tag>
          },
          header: () => {
            return <span>自定义渲染JSX</span>
          },
        },
      },
    ],
  },
  {
    label: '地址信息',
    align: 'center',
    children: [
      {
        label: '地址',
        prop: 'address',
        align: 'center',
      },
      {
        slotNames: {
          default: 'custom',
          header: 'customHeader',
        },
      },
    ],
  },
])

const mockData = async () => {
  try {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 1000))
    data2.value = Array.from({ length: 10 }, (_, i) => ({
      name: `姓名 ${i + 1 + (currentPage.value - 1) * pageSize.value}`,
      age: Math.floor(Math.random() * 60) + 20,
      address: `地址 ${i + 1 + (currentPage.value - 1) * pageSize.value}`,
    }))
    total.value = 100
  } finally {
    loading.value = false
  }
}

const handlePagination = (page: number, size: number) => {
  // eslint-disable-next-line no-console
  console.log('分页参数', { page, size })
  mockData()
}

onMounted(() => {
  mockData()
})
</script>

<style lang="scss" scoped></style>
