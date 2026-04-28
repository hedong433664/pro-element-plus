<template>
  <div class="global-page-container">
    <ProHeader divider>基础用法</ProHeader>

    <ProForm
      ref="formRef"
      label-width="96px"
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
        <el-button @click="handleClearValidate">清空校验</el-button>
      </ProCol>
    </ProForm>

    <ProHeader divider>当前值</ProHeader>

    <pre class="pro-form-demo__json">{{
      JSON.stringify(formModel, null, 2)
    }}</pre>
  </div>
</template>

<script setup lang="tsx">
import { computed, h, reactive, ref } from 'vue'
import {
  ElInput,
  ElMessage,
  ElOption,
  ElRadio,
  ElSelect,
  type FormRules,
} from 'element-plus'
import {
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
  remark: string
}

const formRef = ref<ProFormInstance | null>(null)

const initialModel = (): FormModel => ({
  name: '',
  mobile: '',
  department: '',
  status: 'enabled',
  enableTime: '',
  city: '',
  remark: '',
})

const formModel = reactive<FormModel>(initialModel())

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
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1\d{10}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
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
      maxlength: 11,
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
      filterable: true,
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
    prop: 'remark',
    label: '备注',
    render: ({ value, setValue }) =>
      h(ElInput, {
        type: 'textarea',
        rows: 4,
        maxlength: 200,
        showWordLimit: true,
        placeholder: '请输入备注信息',
        modelValue: value as string,
        'onUpdate:modelValue': setValue,
      }),
    colProps: {
      span: 24,
    },
  },
])

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success('校验通过，提交成功')
}

const handleReset = () => {
  formRef.value?.resetFields()
  Object.assign(formModel, initialModel())
}

const handleClearValidate = () => {
  formRef.value?.clearValidate()
}
</script>

<style lang="scss" scoped>
.pro-form-demo__json {
  margin: 0;
  padding: 16px;
  border-radius: 12px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  overflow: auto;
}
</style>
