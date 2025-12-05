<template>
  <div v-loading="loading">
    <pro-search-form
      label-width="80px"
      label-suffix=":"
      :model="searchForm"
      :gutter="20"
      :fields="fields"
      :auto-search-debounce="300"
      @search="handleSearch"
    />

    <pro-table
      ref="proTableRef"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      border
      stripe
      height="400px"
      :data="data"
      :columns="columns"
      :total="total"
      background
      @pagination-change="handlePagination"
    />
  </div>
</template>

<script setup lang="tsx">
import { computed, reactive, ref } from 'vue'
import { ProTable } from '@coderhd/pro-element-plus'
import type { ProFormFields, ProTableColumn } from '@coderhd/pro-element-plus'

const proTableRef = ref<InstanceType<typeof ProTable>>()

const searchForm = reactive({})
const currentPage = ref<number>(1)
const pageSize = ref<number>(20)
const data = ref<any>([])
const total = ref<number>(100)
const loading = ref<boolean>(false)

const fields = computed<ProFormFields>(() => [
  {
    label: '姓名',
    prop: 'name',
    component: 'ElInput',
    componentProps: {
      placeholder: '请输入姓名',
    },
    colProps: {
      span: 8,
    },
  },
  {
    label: '年龄',
    prop: 'age',
    component: 'ElInputNumber',
    componentProps: {
      placeholder: '请输入年龄',
      style: { width: '100%' },
    },
    colProps: {
      span: 8,
    },
  },
  {
    label: '性别',
    prop: 'sex',
    component: 'ElSelect',
    componentProps: {
      placeholder: '请选择性别',
      options: [
        { label: '男', value: '1' },
        { label: '女', value: '2' },
      ],
    },
    colProps: {
      span: 8,
    },
  },
  {
    label: '日期',
    prop: 'date',
    component: 'ElDatePicker',
    componentProps: {
      placeholder: '请选择日期',
    },
    colProps: {
      span: 8,
    },
  },
  {
    label: '状态',
    prop: 'status',
    component: 'ElSwitch',
    componentProps: {
      activeValue: true,
      inactiveValue: false,
    },
    colProps: {
      span: 8,
    },
  },
])

const columns = computed<ProTableColumn[]>(() => [
  {
    label: '序号',
    prop: 'index',
    width: 100,
  },
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
    label: '描述',
    prop: 'desc',
    showOverflowTooltip: true,
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
])

const handleSearch = () => {
  currentPage.value = 1
  request()
}

const request = async () => {
  loading.value = true
  data.value = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Array.from({ length: pageSize.value }).map((_, index) => ({
          index: (currentPage.value - 1) * pageSize.value + index + 1,
          name: '姓名',
          age: Math.floor(Math.random() * 100),
          sex: Math.random() > 0.5 ? '男' : '女',
          address: '北京市海淀区',
          desc: '很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的描述',
        })),
      )
    }, 1000)
  })
  loading.value = false
}

const handlePagination = (page: number, pageSize: number) => {
  // eslint-disable-next-line no-console
  console.log({ page, pageSize })

  request()
  proTableRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped></style>
