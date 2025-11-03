<template>
  <ProForm
    :ref="changeRef"
    :fields="innerFields"
    v-bind="
      omit(props, [
        'fields',
        'initSearch',
        'autoSearch',
        'autoSearchDebounce',
        'buttonJustify',
        'hideResetButton',
        'hideSearchButton',
        'hideCollapseButton',
        'defaultCollapsed',
        'collapsedCount',
        'collapseButtonText',
        'onReset',
        'onSearch',
        'onCollapsed',
      ])
    "
  >
    <template
      v-if="!hideSearchButton || !hideResetButton || slot.default"
      #default
    >
      <pro-col
        :use-grid="false"
        is-full
        :style="{ 'justify-content': buttonJustify }"
      >
        <el-button
          type="primary"
          plain
          :icon="Refresh"
          :size="size"
          @click="refresh"
        >
          {{ refreshButtonText }}
        </el-button>

        <el-button type="primary" :icon="Search" :size="size" @click="search">
          {{ searchButtonText }}
        </el-button>

        <slot></slot>

        <el-button
          type="primary"
          :icon="isCollapse ? ArrowDown : ArrowUp"
          :size="size"
          text
          @click="toggleCollapse"
        >
          {{ isCollapse ? collapseButtonText[0] : collapseButtonText[1] }}
        </el-button>
      </pro-col>
    </template>
  </ProForm>
</template>

<script setup lang="ts">
import { debounce, omit } from 'lodash-es'
import ProForm from '../../form/src/form.vue'
import ProCol from '../../col/src/col.vue'
import { ElButton, type FormInstance } from 'element-plus'
import { Search, Refresh, ArrowDown, ArrowUp } from '@element-plus/icons-vue'

import type { ProSearchFormEmits, ProSearchFormProps } from './types'
import {
  getCurrentInstance,
  onMounted,
  watch,
  nextTick,
  computed,
  ref,
} from 'vue'

defineOptions({
  name: 'ProSearchForm',
})

const slot = defineSlots<{
  /**
   * 查询区域插槽
   */
  default: any
}>()

const emit = defineEmits<ProSearchFormEmits>()
const props = withDefaults(defineProps<ProSearchFormProps>(), {
  initSearch: true,
  autoSearch: true,
  autoSearchDebounce: 300,
  refreshAfterSearch: true,
  buttonJustify: 'flex-end',
  hideResetButton: false,
  hideSearchButton: false,
  hideCollapseButton: false,
  defaultCollapsed: false,
  collapsedCount: 1,
  refreshButtonText: '重置',
  searchButtonText: '查询',
  collapseButtonText: () => ['展开', '收起'],
  fields: () => [],
  labelPosition: 'right',
  requireAsteriskPosition: 'left',
  showMessage: true,
  validateOnRuleChange: true,
  scrollIntoViewOptions: true,
})

const isCollapse = defineModel<boolean>('defaultCollapsed')
const refreshing = ref<boolean>(false)

const instance = getCurrentInstance()
const changeRef = (exposed: Record<string, any> | null) => {
  instance!.exposed = exposed
  instance!.exposeProxy = exposed
  return exposed
}
/**
 * 重置
 */
const refresh = () => {
  instance?.exposeProxy?.resetFields()
  refreshing.value = true
  emit('refresh')
  if (props.refreshAfterSearch) {
    search()
  }
  nextTick(() => {
    refreshing.value = false
  })
}

/**
 * 查询
 */
const search = () => {
  instance?.exposeProxy?.validate((valid: boolean) => {
    if (valid) {
      emit('search', props.model)
    }
  })
}

/**
 * 防抖查询
 */
const debounceSearch = debounce(search, props.autoSearchDebounce)

/**
 * 切换展开/收起
 */
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
  emit('collapsed', isCollapse.value)
}

const innerFields = computed(() => {
  // 根据折叠状态isCollapse和折叠后保留的个数collapsedCount，返回表单项
  return props.fields.filter((_field, index) => {
    if (!isCollapse.value) {
      return true
    }
    return index < props.collapsedCount
  })
})

watch(
  () => props.model,
  () => {
    if (props.autoSearch && !refreshing.value) {
      nextTick(debounceSearch)
    }
  },
  {
    deep: true,
    immediate: props.initSearch,
  },
)

onMounted(() => {
  isCollapse.value = props.defaultCollapsed
})

defineExpose({
  refresh,
  search,
  toggleCollapse,
} as {
  refresh: () => void
  search: () => void
  toggleCollapse: () => void
  validate: FormInstance['validate']
  validateField: FormInstance['validateField']
  resetFields: FormInstance['resetFields']
  scrollToField: FormInstance['scrollToField']
  clearValidate: FormInstance['clearValidate']
  fields: FormInstance['fields']
  getField: FormInstance['getField']
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
