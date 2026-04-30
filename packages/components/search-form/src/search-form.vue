<template>
  <ProForm
    ref="formRef"
    :fields="innerFields"
    v-bind="formProps"
    @validate="onValidate"
  >
    <template
      v-for="slotName in forwardedSlotNames"
      :key="slotName"
      #[slotName]
    >
      <slot :name="slotName" />
    </template>

    <ProCol
      v-if="showActionRow"
      full
      :use-grid="false"
      :style="{ justifyContent: buttonJustify }"
    >
      <el-button
        v-if="!hideSearchButton"
        type="primary"
        :icon="Search"
        :size="size"
        @click="search"
      >
        {{ searchButtonText }}
      </el-button>

      <el-button
        v-if="!hideResetButton"
        type="default"
        plain
        :icon="Refresh"
        :size="size"
        @click="reset"
      >
        {{ resetButtonText }}
      </el-button>

      <slot />

      <el-button
        v-if="showCollapseButton"
        type="default"
        text
        :icon="collapsed ? ArrowDown : ArrowUp"
        :size="size"
        @click="toggleCollapse"
      >
        {{ collapsed ? collapseButtonText[0] : collapseButtonText[1] }}
      </el-button>
    </ProCol>
  </ProForm>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp, Refresh, Search } from '@element-plus/icons-vue'
import {
  ElButton,
  type FormItemProp,
  type FormValidateCallback,
} from 'element-plus'
import { debounce, omit } from 'lodash-es'
import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue'

import ProCol from '../../col/src/col.vue'
import ProForm from '../../form/src/form.vue'
import type { ProFormInstance } from '../../form/src/types'
import type {
  ProSearchFormEmits,
  ProSearchFormFields,
  ProSearchFormInstance,
  ProSearchFormProps,
  ProSearchFormSlots,
} from './types'

defineOptions({
  name: 'ProSearchForm',
})

defineSlots<ProSearchFormSlots>()

const slots = useSlots()
const emit = defineEmits<ProSearchFormEmits>()

const props = withDefaults(defineProps<ProSearchFormProps>(), {
  initSearch: true,
  autoSearch: true,
  autoSearchDebounce: 300,
  resetAfterSearch: true,
  buttonJustify: 'flex-start',
  hideSearchButton: false,
  hideResetButton: false,
  hideCollapseButton: false,
  defaultCollapsed: false,
  resetButtonText: '重置',
  searchButtonText: '查询',
  collapseButtonText: () => ['展开', '收起'],
  collapsedCount: 1,
  fields: () => [],
})

const formRef = ref<ProFormInstance | null>(null)
const collapsed = ref(false)
const resetting = ref(false)

type ProFormValidateArgs = Parameters<ProFormInstance['validate']>
type ProFormValidateFieldArgs = Parameters<ProFormInstance['validateField']>
type ProFormResetFieldsArgs = Parameters<ProFormInstance['resetFields']>
type ProFormScrollToFieldArgs = Parameters<ProFormInstance['scrollToField']>
type ProFormClearValidateArgs = Parameters<ProFormInstance['clearValidate']>
type ProFormGetFieldArgs = Parameters<ProFormInstance['getField']>

const formProps = computed(() =>
  omit(props, [
    'fields',
    'initSearch',
    'autoSearch',
    'autoSearchDebounce',
    'resetAfterSearch',
    'buttonJustify',
    'hideSearchButton',
    'hideResetButton',
    'hideCollapseButton',
    'defaultCollapsed',
    'resetButtonText',
    'searchButtonText',
    'collapseButtonText',
    'collapsedCount',
  ]),
)

const showActionRow = computed(
  () => !props.hideSearchButton || !props.hideResetButton || !!slots.default,
)

const forwardedSlotNames = computed(() =>
  Object.keys(slots).filter((slotName) => slotName !== 'default'),
)

const showCollapseButton = computed(
  () => !props.hideCollapseButton && props.fields.length > props.collapsedCount,
)

const innerFields = computed<ProSearchFormFields>(() => {
  if (!collapsed.value) return props.fields
  return props.fields.filter((_, index) => index < props.collapsedCount)
})

const search = () => {
  formRef.value?.validate(((valid: boolean) => {
    if (valid) {
      emit('search', props.model)
    }
  }) as FormValidateCallback)
}

const debounceSearch = debounce(search, props.autoSearchDebounce)

const reset = () => {
  formRef.value?.resetFields()
  resetting.value = true
  emit('reset')

  if (props.resetAfterSearch) {
    search()
  }

  nextTick(() => {
    resetting.value = false
  })
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  emit('collapsed', collapsed.value)
}

const onValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  emit('validate', prop, isValid, message)
}

watch(
  () => props.model,
  () => {
    if (props.autoSearch && !resetting.value) {
      nextTick(debounceSearch)
    }
  },
  {
    deep: true,
    immediate: props.initSearch,
  },
)

onMounted(() => {
  collapsed.value = props.defaultCollapsed
})

defineExpose<ProSearchFormInstance>({
  reset,
  search,
  toggleCollapse,
  getInstance: () => formRef.value?.getInstance() ?? null,
  validate: (...args: ProFormValidateArgs) =>
    formRef.value?.validate(...args) as ReturnType<ProFormInstance['validate']>,
  validateField: (...args: ProFormValidateFieldArgs) =>
    formRef.value?.validateField(...args) as ReturnType<
      ProFormInstance['validateField']
    >,
  resetFields: (...args: ProFormResetFieldsArgs) =>
    formRef.value?.resetFields(...args),
  scrollToField: (...args: ProFormScrollToFieldArgs) =>
    formRef.value?.scrollToField(...args),
  clearValidate: (...args: ProFormClearValidateArgs) =>
    formRef.value?.clearValidate(...args),
  get fields() {
    return formRef.value?.fields ?? []
  },
  getField: (...args: ProFormGetFieldArgs) =>
    formRef.value?.getField(...args) as ReturnType<ProFormInstance['getField']>,
})
</script>
