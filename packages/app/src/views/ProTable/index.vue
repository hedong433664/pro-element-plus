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
import { onBeforeUnmount, onMounted, ref } from 'vue'

type DataRow = {
  name: string
  age: number
  address: string
}

const data = ref<DataRow[]>(
  Array.from({ length: 5 }, (_, i) => ({
    name: `姓名 ${i + 1}`,
    age: 20 + i,
    address: `地址 ${i + 1}`,
  })),
)

const loading = ref(false)
const data2 = ref<DataRow[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const columns: ProTableColumn<DataRow>[] = [
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
]

// 多级表头
const columns2: ProTableColumn<DataRow>[] = [
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
]

let requestId = 0
let cancelDelay: (() => void) | undefined

const mockData = async () => {
  const id = ++requestId
  cancelDelay?.()
  const page = currentPage.value
  const size = pageSize.value

  try {
    loading.value = true
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 1000)
      cancelDelay = () => {
        clearTimeout(timer)
        resolve()
      }
    })
    if (id !== requestId) return
    cancelDelay = undefined

    total.value = 100
    const start = (page - 1) * size
    const count = Math.max(0, Math.min(size, total.value - start))
    data2.value = Array.from({ length: count }, (_, i) => ({
      name: `姓名 ${start + i + 1}`,
      age: 20 + ((start + i) % 60),
      address: `地址 ${start + i + 1}`,
    }))
  } finally {
    if (id === requestId) loading.value = false
  }
}

const handlePagination = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  void mockData()
}

onMounted(() => {
  void mockData()
})

onBeforeUnmount(() => {
  requestId++
  cancelDelay?.()
  cancelDelay = undefined
})
</script>
