<template>
  <div>
    <pro-search-form
      ref="formRef"
      label-width="80px"
      label-suffix=":"
      :model="form"
      :gutter="20"
      :fields="fields"
      @search="handleSearch"
    />

    <div style="white-space: pre-wrap">
      {{ JSON.stringify(form, null, 2) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProFormFields } from '@coderhd/pro-element-plus'

const form = ref({})
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
      style: {
        width: '100%',
      },
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

const handleSearch = () => {
  // eslint-disable-next-line no-console
  console.log(form.value)
}
</script>

<style scoped></style>
