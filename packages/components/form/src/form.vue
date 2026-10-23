<template>
  <el-form
    ref="formRef"
    v-bind="omit(props, ['gutter', 'justify', 'align', 'tag', 'fields'])"
    @validate="onValidate"
  >
    <template v-for="(row, index) in fieldsRow" :key="index">
      <el-row
        class="pro-form__row"
        v-bind="pick(props, ['gutter', 'justify', 'align', 'tag'])"
      >
        <template
          v-for="field in row"
          :key="
            String(
              field.key ??
                field.prop ??
                field.label ??
                ('component' in field ? field.component : 'pro-form-field'),
            )
          "
        >
          <ProCol v-show="fieldVisible(field)" v-bind="field.colProps">
            <el-form-item
              v-bind="
                omit(field, [
                  'key',
                  'component',
                  'componentProps',
                  'colProps',
                  'componentSlots',
                  'render',
                  'hidden',
                  'isNewLine',
                  'slotName',
                  'visible',
                  'modelProp',
                  'modelEvent',
                ])
              "
            >
              <slot
                v-if="isSlotField(field) && field.slotName"
                :name="field.slotName"
                v-bind="createFieldContext(field)"
              />
              <component
                v-else-if="isComponentField(field)"
                :is="RenderFieldComponent"
                :component="resolveFieldComponent(field)"
                :component-props="getComponentProps(field)"
                :component-slots="getComponentSlots(field)"
              />
              <RenderVNode
                v-else-if="isRenderField(field)"
                :render="() => field.render(createFieldContext(field))"
              />
            </el-form-item>
          </ProCol>
        </template>

        <slot v-if="index === fieldsRow.length - 1" />
      </el-row>
    </template>
    <el-row
      v-if="fieldsRow.length === 0 && $slots.default"
      class="pro-form__row"
      v-bind="pick(props, ['gutter', 'justify', 'align', 'tag'])"
    >
      <slot />
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElRow,
  type FormInstance,
  type FormItemProp,
} from 'element-plus'
import { get, omit, pick, set } from 'lodash-es'
import {
  computed,
  defineComponent,
  h,
  inject,
  resolveDynamicComponent,
  shallowRef,
} from 'vue'
import type { Component, PropType, VNodeChild } from 'vue'

import ProCol from '../../col/src/col.vue'
import {
  proFormComponentsKey,
  type ProFormEmits,
  type ProFormField,
  type ProFormFieldByComponent,
  type ProFormFieldByComponentNameUnion,
  type ProFormFieldByRender,
  type ProFormFieldBySlot,
  type ProFormFieldContext,
  type ProFormFields,
  type ProFormInjectedComponents,
  type ProFormInstance,
  type ProFormPublicProps,
  type ProFormSlots,
} from './types'

defineOptions({
  name: 'ProForm',
})

defineSlots<ProFormSlots>()

const RenderVNode = defineComponent({
  name: 'ProFormRenderVNode',
  props: {
    render: {
      type: Function as PropType<() => VNodeChild>,
      required: true,
    },
  },
  setup(renderProps) {
    return () => renderProps.render()
  },
})

const RenderFieldComponent = defineComponent({
  name: 'ProFormRenderFieldComponent',
  props: {
    component: {
      type: [Object, Function, String] as PropType<Component | null>,
      default: null,
    },
    componentProps: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
    componentSlots: {
      type: Object as PropType<Record<string, (...args: any[]) => VNodeChild>>,
      default: undefined,
    },
  },
  setup(renderProps) {
    return () => {
      if (!renderProps.component) return null
      return h(
        renderProps.component,
        renderProps.componentProps,
        renderProps.componentSlots,
      )
    }
  },
})

const emit = defineEmits<ProFormEmits>()

const props = withDefaults(defineProps<ProFormPublicProps>(), {
  fields: () => [],
  labelPosition: 'right',
  requireAsteriskPosition: 'left',
  showMessage: true,
  validateOnRuleChange: true,
  scrollIntoViewOptions: true,
})

const formRef = shallowRef<FormInstance | null>(null)
const injectedComponents = inject<ProFormInjectedComponents>(
  proFormComponentsKey,
  {},
)

const isSlotField = (field: ProFormField): field is ProFormFieldBySlot =>
  'slotName' in field && typeof field.slotName === 'string'

const isRenderField = (field: ProFormField): field is ProFormFieldByRender =>
  'render' in field && typeof field.render === 'function'

const isComponentField = (
  field: ProFormField,
): field is ProFormFieldByComponent | ProFormFieldByComponentNameUnion =>
  'component' in field && !!field.component

const toFieldsRow = (list: ProFormFields) => {
  const rows: ProFormFields[] = []
  let currentRow: ProFormFields = []

  for (const item of list) {
    if (item.isNewLine && currentRow.length > 0) {
      rows.push(currentRow)
      currentRow = []
    }

    currentRow.push(item)
  }

  if (currentRow.length > 0) {
    rows.push(currentRow)
  }

  return rows
}

const getFieldValue = (field: ProFormField) => {
  if (!props.model || !field.prop) return undefined
  return get(props.model, field.prop as string)
}

const setFieldValue = (field: ProFormField, value: unknown) => {
  if (!props.model || !field.prop) return
  set(props.model, field.prop as string, value)
}

const createFieldContext = (
  field: ProFormField,
): ProFormFieldContext<Record<string, any>, ProFormField> => ({
  model: props.model ?? {},
  field,
  value: getFieldValue(field),
  setValue: (value: unknown) => setFieldValue(field, value),
})

type FormValidateArgs = Parameters<FormInstance['validate']>
type FormValidateFieldArgs = Parameters<FormInstance['validateField']>
type FormResetFieldsArgs = Parameters<FormInstance['resetFields']>
type FormScrollToFieldArgs = Parameters<FormInstance['scrollToField']>
type FormClearValidateArgs = Parameters<FormInstance['clearValidate']>
type FormGetFieldArgs = Parameters<FormInstance['getField']>

const resolveFieldComponent = (
  field: ProFormFieldByComponent | ProFormFieldByComponentNameUnion,
): Component | null => {
  if (typeof field.component !== 'string') return field.component as Component

  const injectedComponent = injectedComponents[field.component]
  if (injectedComponent) return injectedComponent

  const resolvedComponent = resolveDynamicComponent(field.component)
  if (
    typeof resolvedComponent === 'string' &&
    resolvedComponent === field.component
  ) {
    console.error(
      new TypeError(
        `组件 ${field.component} 未注册，请先注册组件、通过 provideProFormComponents 注入组件，或直接传入组件对象`,
      ),
    )
    return null
  }

  return resolvedComponent as Component
}

const getComponentProps = (
  field: ProFormFieldByComponent | ProFormFieldByComponentNameUnion,
): Record<string, unknown> => {
  const fieldContext = createFieldContext(field)

  const modelProp = field.modelProp ?? 'modelValue'
  const modelEvent = field.modelEvent ?? `update:${modelProp}`
  const handlerKey = `on${modelEvent[0]?.toUpperCase()}${modelEvent.slice(1)}`
  const externalHandler = (
    field.componentProps as Record<string, unknown> | undefined
  )?.[handlerKey]

  return {
    ...field.componentProps,
    [modelProp]: fieldContext.value,
    [handlerKey]: [
      (value: unknown) => fieldContext.setValue(value),
      ...(Array.isArray(externalHandler)
        ? externalHandler
        : typeof externalHandler === 'function'
          ? [externalHandler]
          : []),
    ],
  }
}

const getComponentSlots = (
  field: ProFormFieldByComponent | ProFormFieldByComponentNameUnion,
): Record<string, (...args: any[]) => VNodeChild> | undefined => {
  if (!field.componentSlots) return undefined
  return field.componentSlots as Record<string, (...args: any[]) => VNodeChild>
}

const fieldVisible = (field: ProFormField) =>
  typeof field.visible === 'function'
    ? field.visible(props.model ?? {}, field)
    : field.visible !== false

const fieldHidden = (field: ProFormField) => {
  if (typeof field.hidden === 'function') {
    return field.hidden(props.model ?? {}, field)
  }

  return !!field.hidden
}

const innerFields = computed(() =>
  props.fields.filter((field) => !fieldHidden(field)),
)

const fieldsRow = computed<ProFormFields[]>(() =>
  toFieldsRow(innerFields.value),
)

const onValidate = (prop: FormItemProp, isValid: boolean, errMsg: string) => {
  emit('validate', prop, isValid, errMsg)
}

const getInstance = () => formRef.value

defineExpose<ProFormInstance>({
  getInstance,
  validate: (...args: FormValidateArgs) =>
    formRef.value?.validate(...args) as ReturnType<FormInstance['validate']>,
  validateField: (...args: FormValidateFieldArgs) =>
    formRef.value?.validateField(...args) as ReturnType<
      FormInstance['validateField']
    >,
  resetFields: (...args: FormResetFieldsArgs) =>
    formRef.value?.resetFields(...args),
  scrollToField: (...args: FormScrollToFieldArgs) =>
    formRef.value?.scrollToField(...args),
  clearValidate: (...args: FormClearValidateArgs) =>
    formRef.value?.clearValidate(...args),
  get fields() {
    return formRef.value?.fields ?? []
  },
  getField: (...args: FormGetFieldArgs) =>
    formRef.value?.getField(...args) as ReturnType<FormInstance['getField']>,
})
</script>
