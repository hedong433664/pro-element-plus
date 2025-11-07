<template>
  <div>
    <el-switch
      v-model="hidePagination"
      active-text="隐藏分页"
      inactive-text="显示分页"
      style="margin-bottom: 10px"
    />

    <pro-table
      ref="proTableRef"
      border
      stripe
      height="400px"
      :data="data"
      :columns="columns"
      :total="total"
      :hide-pagination="hidePagination"
      @pagination-change="handlePagination"
    />
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'

import { ProTable } from '@coderhd/pro-element-plus'
import type { ProTableColumn } from '@coderhd/pro-element-plus'

const proTableRef = ref<InstanceType<typeof ProTable>>()
const data = ref<any>(
  Array.from({ length: 30 }).fill({
    name: '张三',
    age: 18,
    sex: '男',
    address: '北京市',
  }),
)
const hidePagination = ref<boolean>(false)
const total = ref<number>(100)
const columns: ProTableColumn[] = [
  {
    label: '姓名',
    prop: 'name',
    width: 100,
  },
  {
    label: '年龄',
    prop: 'age',
    width: 100,
  },
  {
    label: '性别',
    prop: 'sex',
    width: 100,
  },
  {
    label: '地址',
    prop: 'address',
  },
  {
    label: '操作',
    prop: 'action',
    width: 140,
    cellSlots: {
      default: (scope) => {
        return (
          <div>
            <el-button
              type="primary"
              size="small"
              // eslint-disable-next-line no-console
              onClick={() => console.log(scope)}
            >
              编辑
            </el-button>

            <el-button type="danger" size="small">
              删除
            </el-button>
          </div>
        )
      },
      header: () => '自定义',
    },
  },
]

const handlePagination = (page: number, pageSize: number) => {
  // eslint-disable-next-line no-console
  console.log({ page, pageSize })
  proTableRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped></style>
