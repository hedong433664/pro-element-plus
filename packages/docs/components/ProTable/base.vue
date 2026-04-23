<template>
  <ProTable
    :columns="columns"
    :data="data"
    border
    stripe
    hide-pagination
    highlight-current-row
  />
</template>

<script setup lang="tsx">
import type { ProTableColumn } from '@coderhd/pro-element-plus'
import { computed, ref } from 'vue'

type DataRow = {
  name: string
  age: number
  address: string
}

const data = ref<DataRow[]>(
  Array.from({ length: 5 }, (_, i) => ({
    name: `用户 ${i + 1}`,
    age: 20 + i,
    address: `测试地址 ${i + 1}`,
  })),
)

const columns = computed<ProTableColumn<DataRow>[]>(() => [
  {
    type: 'selection',
    width: 60,
  },
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
  {
    label: '操作',
    width: 240,
    fixed: 'right',
    cellSlots: {
      default: () => {
        return (
          <>
            <el-button type="primary" text plain>
              查看
            </el-button>
            <el-button type="success" text plain>
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
</script>
