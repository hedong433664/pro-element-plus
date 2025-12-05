<template>
  <div>
    <pro-form
      ref="formRef"
      label-width="100px"
      label-suffix=":"
      :model="form"
      :gutter="20"
      :fields="fields"
      :rules="rules"
    />

    <div style="white-space: pre-wrap">
      {{ JSON.stringify(form, null, 2) }}
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, computed, reactive } from 'vue'
import type { ProFormFields } from '@coderhd/pro-element-plus'
import type { FormInstance } from 'element-plus'

type Form = {
  name?: string
  region?: string
  date1?: Date
  date2?: Date
  delivery?: boolean
  type?: string[]
  resource?: string
  desc?: string
}

const form = reactive<Form>({
  delivery: true,
})

const rules = reactive({
  name: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
  ],
  region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
  date1: [
    { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
  ],
  date2: [
    { type: 'date', required: true, message: '请选择时间', trigger: 'change' },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: '请至少选择一个活动性质',
      trigger: 'change',
    },
  ],
  resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
  desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
})

const formRef = ref<FormInstance>()

const fields = computed<ProFormFields>(() => [
  {
    label: '活动名称',
    prop: 'name',
    required: true,
    component: 'ElInput',
    componentProps: {
      placeholder: '请输入活动名称',
      clearable: true,
    },
    colProps: {
      span: 24,
    },
  },
  {
    label: '活动区域',
    prop: 'region',
    required: true,
    component: 'ElSelect',
    componentProps: {
      placeholder: '请选择活动区域',
      clearable: true,
      options: [
        { label: '区域一', value: 'shanghai' },
        { label: '区域二', value: 'beijing' },
      ],
    },
    colProps: {
      span: 24,
    },
  },
  {
    label: '活动时间',
    required: true,
    render: () => (
      <el-row style="flex: 1;">
        <pro-col span={11}>
          <el-form-item prop="date1">
            <el-date-picker
              type="date"
              v-model={form.date1}
              placeholder="选择日期"
              value-format="x"
              style="width: 100%;"
            />
          </el-form-item>
        </pro-col>

        <pro-col span={2} style="text-align: center;">
          -
        </pro-col>

        <pro-col span={11}>
          <el-form-item prop="date2">
            <el-time-picker
              v-model={form.date2}
              placeholder="选择时间"
              value-format="x"
              style="width: 100%;"
            />
          </el-form-item>
        </pro-col>
      </el-row>
    ),
    colProps: {
      span: 24,
    },
  },
  {
    label: '即时配送',
    prop: 'delivery',
    required: true,
    component: 'ElSwitch',
    componentProps: {
      activeText: '是',
      inactiveText: '否',
    },
    colProps: {
      span: 24,
    },
  },
  {
    label: '活动性质',
    prop: 'type',
    required: true,
    component: 'ElCheckboxGroup',
    componentProps: {
      options: [
        { label: '美食/餐厅线上活动', value: '1' },
        { label: '地推活动', value: '2' },
        { label: '线下主题活动', value: '3' },
        { label: '单纯品牌曝光', value: '4' },
      ],
    },
    colProps: {
      span: 24,
    },
  },
  {
    label: '特殊资源',
    prop: 'resource',
    required: true,
    component: 'ElRadioGroup',
    componentProps: {
      options: [
        { label: '线上品牌商赞助', value: '1' },
        { label: '线下场地免费', value: '2' },
      ],
    },
    colProps: {
      span: 24,
    },
  },
  {
    label: '活动形式',
    prop: 'desc',
    component: 'ElInput',
    componentProps: {
      type: 'textarea',
      autosize: {
        minRows: 4,
        maxRows: 6,
      },
      maxlength: 300,
      showWordLimit: true,
      placeholder: '请输入活动形式',
      clearable: true,
    },
    colProps: {
      span: 24,
    },
  },
  {
    render: () => (
      <div>
        <el-button type="primary" onClick={onSubmit}>
          立即创建
        </el-button>

        <el-button onClick={onReset}>重置</el-button>
      </div>
    ),
    colProps: {
      useGrid: false,
    },
  },
])

const onSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      // eslint-disable-next-line no-console
      console.log('submit!', form)
    } else {
      // eslint-disable-next-line no-console
      console.log('error submit!')
    }
  })
}

const onReset = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped></style>
