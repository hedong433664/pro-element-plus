<template>
  <div>
    <pro-header size="small" divider border>
      Pro Header
      <template #right>
        <el-button>新增</el-button>
      </template>
    </pro-header>

    <pro-search-form
      ref="formRef"
      :model="form"
      :gutter="20"
      :fields="fields"
      :collapsed-count="3"
      :init-search="false"
      @search="handleSearch"
    />

    <pro-table
      ref="tableRef"
      :data="data"
      :columns="columns"
      :height="500"
      border
      stripe
      highlight-current-row
      show-summary
      :total="data.length"
      @row-click="(row) => console.log(row)"
      @pagination-change="(n, s) => console.log(n, s)"
    >
      <template #nameSlot="{ row }">
        {{ row.name + 123 }}
      </template>
      <template #append>123</template>
    </pro-table>
  </div>
</template>

<script setup lang="tsx">
import { ElDatePicker } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

import type { ProFormFields, ProTableColumn } from '@coderhd/pro-element-plus'
import { ProSearchForm, ProTable } from '@coderhd/pro-element-plus'

const form = ref({
  name: '',
  age: 18,
  sex: '1',
  birthday: '',
})

const fields = computed<ProFormFields>(() => [
  {
    prop: 'name',
    label: '姓名',
    component: 'ElInput',
    componentProps: {
      placeholder: '请输入姓名',
    },
    componentSlots: {
      append: () => [<span>后置</span>],
    },
    colProps: {
      span: 6,
    },
    // rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  },
  {
    prop: 'age',
    label: '年龄',
    component: 'ElInputNumber',
    componentProps: {
      placeholder: '请输入年龄',
      min: 0,
      max: 100,
    },
    colProps: {
      span: 6,
    },
  },
  {
    prop: 'sex',
    label: '性别',
    hidden: () => form.value.age < 18,
    component: 'ElSelect',
    componentProps: {
      placeholder: '请选择性别',
      options: [
        {
          label: '男',
          value: '1',
        },
        {
          label: '女',
          value: '2',
        },
      ],
    },
    colProps: {
      span: 6,
    },
  },
  {
    prop: 'birthday',
    label: '自定义render',
    rules: [{ required: true, message: '请选择生日', trigger: 'blur' }],
    render: () => {
      return (
        <ElDatePicker v-model={form.value.birthday} placeholder="请选择生日" />
      )
    },
    colProps: {
      span: 6,
    },
  },
  {
    prop: 'cs',
    label: '自定义扩展组件',
    component: 'ElButton',
    componentProps: {
      type: 'primary',
    },
    componentSlots: {
      default: () => [<span>自定义按钮</span>],
    },
    colProps: {
      span: 6,
    },
  },
])

const formRef = ref<InstanceType<typeof ProSearchForm>>()
const handleSearch = () => {
  // eslint-disable-next-line no-console
  console.log(form.value)
}

const data = ref<any>([])

const tableRef = ref<InstanceType<typeof ProTable>>()
const columns = computed<ProTableColumn[]>(() => [
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'age',
    label: '年龄',
  },
  {
    prop: 'sex',
    label: '性别',
  },
  {
    prop: 'birthday',
    label: '生日',
  },
  {
    prop: 'action',
    label: '操作',
    cellSlots: {
      default: () => {
        return (
          <div>
            <el-button type="primary" text>
              编辑
            </el-button>
            <el-button type="danger" text>
              删除
            </el-button>
          </div>
        )
      },
      header: () => '自定义header',
    },
  },
])

onMounted(() => {
  data.value = new Array(100).fill(0).map((_, i) => ({
    name: `姓名${i}`,
    age: i,
    sex: i % 2 === 0 ? '1' : '2',
    birthday: '2023-01-01',
  }))

  tableRef.value?.setCurrentRow(data.value[4])
  setTimeout(() => {
    tableRef.value?.scrollTo({
      left: 0,
      top: 300,
      behavior: 'smooth',
    })
  }, 2000)
})
</script>

<style lang="scss" scoped></style>
