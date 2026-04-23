<template>
  <ProTable :columns="columns" :data="data" border stripe hide-pagination>
    <template #custom>
      <span>模板插槽单元格</span>
    </template>

    <template #customHeader>
      <span>模板插槽表头</span>
    </template>
  </ProTable>
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
    label: '基础信息',
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
        label: 'JSX 插槽',
        align: 'center',
        cellSlots: {
          default: () => {
            return <el-tag>JSX 单元格</el-tag>
          },
          header: () => {
            return <span>JSX 表头</span>
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
        label: '模板插槽',
        align: 'center',
        slotNames: {
          default: 'custom',
          header: 'customHeader',
        },
      },
    ],
  },
])
</script>
