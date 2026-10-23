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
      #[slotName]="scope"
    >
      <slot :name="slotName" v-bind="scope" />
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
import { ElButton, type FormItemProp } from 'element-plus'
import { debounce, omit } from 'lodash-es'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
} from 'vue'

import ProCol from '../../col/src/col.vue'
import ProForm from '../../form/src/form.vue'
import type { ProFormInstance } from '../../form/src/types'
import type {
  ProSearchFormEmits,
  ProSearchFormFields,
  ProSearchFormInstance,
  ProSearchFormPublicProps,
  ProSearchFormSlots,
} from './types'

defineOptions({
  name: 'ProSearchForm',
})

defineSlots<ProSearchFormSlots>()

const slots = useSlots()
const emit = defineEmits<ProSearchFormEmits>()

const props = withDefaults(defineProps<ProSearchFormPublicProps>(), {
  initSearch: true,
  autoSearch: true,
  autoSearchDebounce: 300,
  resetAfterSearch: true,
  buttonJustify: 'flex-end',
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
const collapsed = ref(props.defaultCollapsed)
const resetting = ref(false)
let disposed = false
let searchVersion = 0

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

const forwardedSlotNames = computed(() =>
  Object.keys(slots).filter((slotName) => slotName !== 'default'),
)

const visibleFields = computed(() =>
  props.fields.filter((field) => {
    const hidden =
      typeof field.hidden === 'function'
        ? field.hidden(props.model ?? {}, field)
        : field.hidden
    const visible =
      typeof field.visible === 'function'
        ? field.visible(props.model ?? {}, field)
        : field.visible
    return !hidden && visible !== false
  }),
)
const collapsedCount = computed(() => Math.max(0, props.collapsedCount))
const showCollapseButton = computed(
  () =>
    !props.hideCollapseButton &&
    visibleFields.value.length > collapsedCount.value,
)
const showActionRow = computed(
  () =>
    !props.hideSearchButton ||
    !props.hideResetButton ||
    !!slots.default ||
    showCollapseButton.value,
)

// Collapsing only changes visibility; fields remain registered.
const innerFields = computed<ProSearchFormFields>(() => {
  if (!collapsed.value) return props.fields
  const collapsedFields = new Set(
    visibleFields.value.slice(collapsedCount.value),
  )
  return props.fields.map((field) =>
    collapsedFields.has(field) ? { ...field, visible: false } : field,
  )
})

const search = async (): Promise<boolean> => {
  debounceSearch.cancel()
  // Drain model watchers before taking ownership of a manual/initial search.
  await nextTick()
  debounceSearch.cancel()
  const version = ++searchVersion
  if (disposed || !formRef.value) return false
  try {
    const valid = await formRef.value.validate()
    if (!valid || disposed || version !== searchVersion) return false
    emit('search', props.model)
    return true
  } catch {
    // Element Plus rejects validation promises for invalid forms.
    return false
  }
}

let debounceSearch = debounce(() => {
  void search()
}, props.autoSearchDebounce)

const reset = async () => {
  debounceSearch.cancel()
  ++searchVersion
  resetting.value = true
  try {
    formRef.value?.resetFields()
    emit('reset')
    await nextTick()
  } finally {
    resetting.value = false
  }
  if (props.resetAfterSearch && !disposed) await search()
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
    if (!resetting.value && !disposed) {
      ++searchVersion
      if (props.autoSearch) debounceSearch()
    }
  },
  { deep: true },
)
watch(
  () => props.autoSearch,
  (enabled) => {
    if (!enabled) {
      debounceSearch.cancel()
      ++searchVersion
    }
  },
)
watch(
  () => props.autoSearchDebounce,
  (delay) => {
    debounceSearch.cancel()
    debounceSearch = debounce(() => {
      void search()
    }, delay)
  },
)

onMounted(() => {
  if (props.initSearch) void search()
})
onBeforeUnmount(() => {
  disposed = true
  ++searchVersion
  debounceSearch.cancel()
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
