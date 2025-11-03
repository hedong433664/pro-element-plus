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
  </div>
</template>

<script setup lang="tsx">
import { ElDatePicker } from 'element-plus'
import { computed, ref } from 'vue'

import type { ProFormFields } from 'pro-element-plus'
import { ProSearchForm } from 'pro-element-plus'

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
  },
])

const formRef = ref<InstanceType<typeof ProSearchForm>>()
const handleSearch = () => {
  // eslint-disable-next-line no-console
  console.log(form.value)
}
</script>

<style lang="scss" scoped>
.el-col {
  margin-bottom: 10px;
}
.item {
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-radius: 5px;
  background: var(--el-color-primary-light-5);
}
</style>
