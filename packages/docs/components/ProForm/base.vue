<template>
  <div class="pro-form-doc-demo">
    <ProForm
      ref="formRef"
      label-width="92px"
      :model="formModel"
      :rules="rules"
      :fields="fields"
      :gutter="16"
    >
      <template #departmentSelect>
        <el-select
          v-model="formModel.department"
          placeholder="请选择部门"
          clearable
        >
          <el-option
            v-for="item in departmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>

      <ProCol :use-grid="false" full>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleReset">重置</el-button>
      </ProCol>
    </ProForm>

    <pre class="json">{{ JSON.stringify(formModel, null, 2) }}</pre>
  </div>
</template>

<script setup lang="tsx">
import { computed, h, reactive, ref } from 'vue'
import {
  ElDatePicker,
  ElInput,
  ElMessage,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  type FormRules,
} from 'element-plus'
import {
  provideProFormComponents,
  type ProFormField,
  type ProFormInstance,
} from '@coderhd/pro-element-plus'

type FormModel = {
  name: string
  mobile: string
  department: string
  status: 'enabled' | 'disabled'
  enableTime: string
  city: string
}

provideProFormComponents({
  ElInput,
  ElRadioGroup,
  ElDatePicker,
  ElSelect,
})

const formRef = ref<ProFormInstance | null>(null)
const formModel = reactive<FormModel>({
  name: '',
  mobile: '',
  department: '',
  status: 'enabled',
  enableTime: '',
  city: '',
})

const departmentOptions = [
  { label: '研发部', value: 'rd' },
  { label: '产品部', value: 'pm' },
  { label: '运营部', value: 'op' },
]

const cityOptions = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
  { label: '深圳', value: 'shenzhen' },
]

const rules: FormRules<FormModel> = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  city: [{ required: true, message: '请选择城市', trigger: 'change' }],
}

const fields = computed((): ProFormField<FormModel>[] => [
  {
    prop: 'name',
    label: '姓名',
    component: 'ElInput',
    componentProps: {
      placeholder: '请输入姓名',
      clearable: true,
    },
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'mobile',
    label: '手机号',
    component: 'ElInput',
    componentProps: {
      placeholder: '请输入手机号',
      clearable: true,
    },
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'department',
    label: '部门',
    slotName: 'departmentSelect',
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'status',
    label: '状态',
    component: 'ElRadioGroup',
    componentSlots: {
      default: () => [
        h(ElRadio, { value: 'enabled' }, () => '启用'),
        h(ElRadio, { value: 'disabled' }, () => '停用'),
      ],
    },
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'enableTime',
    label: '启用时间',
    component: 'ElDatePicker',
    componentProps: {
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      placeholder: '请选择启用时间',
      clearable: true,
      style: {
        width: '100%',
      },
    },
    hidden: (model) => {
      if (model.status !== 'enabled') {
        formModel.enableTime = ''
      }
      return model.status !== 'enabled'
    },
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'city',
    label: '城市',
    component: 'ElSelect',
    componentProps: {
      placeholder: '请选择城市',
      clearable: true,
    },
    componentSlots: {
      default: () =>
        cityOptions.map((item) =>
          h(ElOption, {
            key: item.value,
            label: item.label,
            value: item.value,
          }),
        ),
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: 'jsx',
    render: () => <div>这是通过 render 字段渲染的内容</div>,
  },
])

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success('提交成功')
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.json {
  margin-top: 20px;
  padding: 16px;
  border-radius: 12px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  overflow: auto;
}
</style>
