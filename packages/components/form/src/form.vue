<template>
  <el-form
    :ref="changeRef"
    v-bind="omit(props, ['gutter', 'justify', 'align', 'tag', 'fields'])"
    @validate="onValidate"
  >
    <template v-for="(row, index) in fieldsRow" :key="index">
      <el-row v-bind="pick(props, ['gutter', 'justify', 'align', 'tag'])">
        <template v-for="field in row" :key="field.prop">
          <pro-col v-bind="field.colProps">
            <el-form-item
              v-bind="
                omit(field, [
                  'component',
                  'componentProps',
                  'colProps',
                  'componentSlots',
                  'render',
                ])
              "
            >
              <component :is="renderComponent(field)" />
            </el-form-item>
          </pro-col>
        </template>

        <slot v-if="index === fieldsRow.length - 1" />
      </el-row>
    </template>
  </el-form>
</template>

<script setup lang="tsx">
import { computed, getCurrentInstance, h, resolveComponent } from 'vue'
import { ElForm, ElFormItem, ElRow } from 'element-plus'
import ProCol from '../../col/src/col.vue'
import { omit, pick } from 'lodash-es'

import type {
  ProFormEmits,
  ProFormField,
  ProFormFields,
  ProFormProps,
} from './types'

import type { FormInstance, FormItemProp } from 'element-plus'

defineOptions({
  name: 'ProForm',
})

defineSlots<{
  /**
   * 自定义默认内容
   */
  default: any
}>()

const emit = defineEmits<ProFormEmits>()

const props = withDefaults(defineProps<ProFormProps>(), {
  fields: () => [],
  labelPosition: 'right',
  requireAsteriskPosition: 'left',
  showMessage: true,
  validateOnRuleChange: true,
  scrollIntoViewOptions: true,
})

const instance = getCurrentInstance()
const changeRef = (exposed: Record<string, any> | null) => {
  instance!.exposed = exposed
  instance!.exposeProxy = exposed
}

const toFieldsRow = (list: ProFormFields) => {
  const newList = []
  let currentGroup = []

  for (const item of list) {
    if (item.isNewLine) {
      // 遇到换行标记时，结束当前分组并开始新分组
      if (currentGroup.length > 0) {
        newList.push(currentGroup)
        currentGroup = []
      }
      // 将换行元素单独作为新分组
      newList.push([item])
    } else {
      // 非换行元素添加到当前分组
      currentGroup.push(item)
    }
  }

  // 添加最后一个分组（如果有剩余元素）
  if (currentGroup.length > 0) {
    newList.push(currentGroup)
  }

  return newList
}

const renderComponent = (field: ProFormField) => {
  const elFormItemProps = omit(field, [
    'component',
    'componentProps',
    'render',
    'colProps',
    'componentSlots',
  ])

  // 优先使用render
  if (field.render) {
    return typeof field.render === 'function' ? field.render() : field.render
  }

  if (field.component) {
    const comp = resolveComponent(field.component)
    if (typeof comp === 'string') {
      // 组件未注册
      console.error(
        new TypeError(
          `组件${field.component}未注册，请先进行注册，或使用render自定义渲染`,
        ),
      )
      return null
    }

    return h(
      comp,
      {
        ...field.componentProps,
        modelValue: props.model![elFormItemProps.prop as string],
        'onUpdate:modelValue': (val: any) => {
          props.model![elFormItemProps.prop as string] = val
        },
      },
      field.componentSlots,
    )
  }
  return null
}

const fieldHidden = (field: ProFormField) => {
  if (typeof field.hidden === 'function') {
    return field.hidden(props.model)
  }

  return field.hidden
}

const innerFields = computed(() => {
  return props.fields.filter((item) => !fieldHidden(item))
})

const fieldsRow = computed<ProFormFields[]>(() =>
  toFieldsRow(innerFields.value),
)

const onValidate = (prop: FormItemProp, isValid: boolean, errMsg: string) => {
  emit('validate', prop, isValid, errMsg)
}

defineExpose(
  {} as {
    validate: FormInstance['validate']
    validateField: FormInstance['validateField']
    resetFields: FormInstance['resetFields']
    scrollToField: FormInstance['scrollToField']
    clearValidate: FormInstance['clearValidate']
    fields: FormInstance['fields']
    getField: FormInstance['getField']
  },
)
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
