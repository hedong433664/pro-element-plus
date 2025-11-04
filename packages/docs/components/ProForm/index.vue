<template>
  <div>
    <pro-form
      ref="formRef"
      :model="form"
      :gutter="20"
      :fields="fields"
      label-width="120px"
      label-suffix=":"
    >
      <el-button type="primary" @click="onSubmit">Submit</el-button>
      <el-button type="primary" plain @click="onReset">Reset</el-button>
    </pro-form>

    <div style="white-space: pre-wrap">
      {{ JSON.stringify(form, null, 2) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProFormFields } from '@coderhd/pro-element-plus'
import type { FormInstance } from 'element-plus'

const form = ref({})
const formRef = ref<FormInstance>()

const fields = computed<ProFormFields>(() => [
  {
    label: 'Activity name',
    prop: 'name',
    component: 'ElInput',
    componentProps: {
      placeholder: 'Please input activity name',
    },
    rules: [
      {
        required: true,
        message: 'Please input activity name',
        trigger: 'blur',
      },
      { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    colProps: {
      span: 24,
    },
  },
  {
    label: 'Activity zone',
    prop: 'region',
    component: 'ElSelect',
    componentProps: {
      placeholder: 'Please select activity zone',
      options: [
        {
          label: 'Zone one',
          value: 'Zone one',
        },
        {
          label: 'Zone two',
          value: 'Zone two',
        },
      ],
    },
    rules: [
      {
        required: true,
        message: 'Please select the activity zone',
        trigger: 'change',
      },
    ],
    colProps: {
      span: 24,
    },
  },
  {
    label: 'Activity time',
    prop: 'date1',
    component: 'ElDatePicker',
    componentProps: {
      type: 'date',
      placeholder: 'Pick a day',
      style: {
        width: '100%',
      },
    },
    rules: [
      {
        type: 'date',
        required: true,
        message: 'Please pick a date',
        trigger: 'change',
      },
    ],
    colProps: {
      span: 24,
    },
  },
  {
    label: 'Instant delivery',
    prop: 'delivery',
    component: 'ElSwitch',
    colProps: {
      span: 24,
    },
  },
  {
    label: 'Activity type',
    prop: 'type',
    component: 'ElCheckboxGroup',
    componentProps: {
      options: [
        {
          label: 'Online',
          value: 'Online',
        },
        {
          label: 'Offline',
          value: 'Offline',
        },
        {
          label: 'Promotion',
          value: 'Promotion',
        },
      ],
    },
    rules: [
      {
        type: 'array',
        required: true,
        message: 'Please select at least one activity type',
        trigger: 'change',
      },
    ],
    colProps: {
      span: 24,
    },
  },
  {
    label: 'Resources',
    prop: 'resource',
    component: 'ElRadioGroup',
    componentProps: {
      options: [
        {
          label: 'Sponsor',
          value: 'Sponsor',
        },
        {
          label: 'Venue',
          value: 'Venue',
        },
      ],
    },
    rules: [
      {
        required: true,
        message: 'Please select activity resource',
        trigger: 'change',
      },
    ],
    colProps: {
      span: 24,
    },
  },
  {
    label: 'Activity form',
    prop: 'desc',
    component: 'ElInput',
    componentProps: {
      type: 'textarea',
      rows: 2,
      placeholder: 'Please input activity form',
    },
    rules: [
      {
        required: true,
        message: 'Please input activity form',
        trigger: 'blur',
      },
    ],
    colProps: {
      span: 24,
    },
  },
])

const onSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      // eslint-disable-next-line no-console
      console.log('submit!', form.value)
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
