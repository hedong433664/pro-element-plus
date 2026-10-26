<template>
  <div class="pro-search-table" v-bind="getRootAttrs()">
    <ProSearchForm
      ref="searchFormRef"
      v-bind="searchFormProps"
      @search="handleSearch"
      @reset="emit('reset')"
      @collapsed="emit('collapsed', $event)"
      @validate="handleValidate"
    >
      <template v-for="name in searchSlotNames" :key="name" #[name]="scope">
        <slot :name="`search-${name}`" v-bind="scope ?? {}" />
      </template>
      <template v-if="$slots['search-actions']" #default>
        <slot name="search-actions" />
      </template>
    </ProSearchForm>

    <div v-if="$slots.toolbar" class="pro-search-table__toolbar">
      <slot name="toolbar" />
    </div>

    <div v-loading="loading" class="pro-search-table__table">
      <ProTable
        ref="tableRef"
        v-bind="getTableProps()"
        :data="data"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @pagination="handlePagination"
      >
        <template v-for="name in tableSlotNames" :key="name" #[name]="scope">
          <slot :name="`table-${name}`" v-bind="scope ?? {}" />
        </template>
      </ProTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vLoading, type FormItemProp } from 'element-plus'
import { cloneDeep, omit, pick } from 'lodash-es'
import {
  camelize,
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import ProSearchForm from '../../search-form/src/search-form.vue'
import ProTable from '../../table/src/table.vue'
import { proFormProps } from '../../form/src/types'
import type { ProSearchFormInstance } from '../../search-form/src/types'
import type { ProTableInstance } from '../../table/src/table'
import type {
  ProSearchTablePublicProps,
  ProSearchTableEmits,
  ProSearchTableSlots,
  ProSearchTableInstance,
  ProSearchTableRequestParams,
  ProSearchTableRequestResult,
} from './types'

defineOptions({ name: 'ProSearchTable', inheritAttrs: false })
defineSlots<ProSearchTableSlots>()
const emit = defineEmits<ProSearchTableEmits>()
const props = withDefaults(defineProps<ProSearchTablePublicProps>(), {
  model: () => ({}),
  fields: () => [],
  columns: () => [],
  initSearch: true,
  autoSearch: true,
  autoSearchDebounce: 300,
  resetAfterSearch: true,
  buttonJustify: 'flex-end',
  defaultCollapsed: false,
  collapsedCount: 1,
  resetButtonText: '重置',
  searchButtonText: '查询',
  collapseButtonText: () => ['展开', '收起'],
  currentPage: 1,
  pageSize: 10,
  hidePagination: false,
  paginationProps: () => ({
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
  labelPosition: 'right',
  requireAsteriskPosition: 'left',
  showMessage: true,
  validateOnRuleChange: true,
  scrollIntoViewOptions: true,
})

const attrs = useAttrs()
const instance = getCurrentInstance()!
const slots: ProSearchTableSlots = useSlots()
const searchFormRef = shallowRef<ProSearchFormInstance | null>(null)
const tableRef = shallowRef<ProTableInstance | null>(null)
const data = shallowRef<Record<string, any>[]>([])
const total = ref(0)
const loading = ref(false)
const currentPage = ref(props.currentPage)
const pageSize = ref(props.pageSize)
let submittedQuery = cloneDeep(props.model)
let hasSubmitted = false
let requestId = 0
let disposed = false
let pendingSubmission = 0
let scheduled: Promise<boolean> | undefined
let latestRequest: Promise<boolean> = Promise.resolve(false)

// Public props stay flat; forwarding is split by ownership here.
const searchPropNames = [
  ...Object.keys(proFormProps),
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
]
const searchFormProps = computed(() => pick(props, searchPropNames))
const getTableProps = (): Record<string, unknown> => {
  // Absent optional boolean props must retain ElTable defaults (fit, showHeader...).
  const supplied = Object.keys(instance.vnode.props ?? {}).map(camelize)
  const forwarded = pick(props, [
    ...supplied,
    'columns',
    'hidePagination',
    'paginationProps',
    'size',
  ])
  return {
    ...omit(attrs, [
      'class',
      'style',
      'data',
      'total',
      'loading',
      'onUpdate:data',
      'onUpdate:total',
      'onUpdate:loading',
    ]),
    ...omit(forwarded, [
      ...searchPropNames.filter((name) => name !== 'size'),
      'request',
      'data',
      'total',
      'loading',
      'currentPage',
      'pageSize',
    ]),
  }
}
const getRootAttrs = () => pick(attrs, ['class', 'style'])
const searchSlotNames = computed<string[]>(() =>
  Object.keys(slots)
    .filter((name) => name.startsWith('search-') && name !== 'search-actions')
    .map((name) => name.slice(7)),
)
const tableSlotNames = computed<string[]>(() =>
  Object.keys(slots)
    .filter((name) => name.startsWith('table-'))
    .map((name) => name.slice(6)),
)

const setPagination = (page: number, size: number) => {
  if (currentPage.value !== page) {
    currentPage.value = page
    emit('update:currentPage', page)
  }
  if (pageSize.value !== size) {
    pageSize.value = size
    emit('update:pageSize', size)
  }
}

const executeRequest = async (): Promise<boolean> => {
  if (disposed) return false
  const id = ++requestId
  const params: ProSearchTableRequestParams = {
    query: cloneDeep(submittedQuery),
    currentPage: currentPage.value,
    pageSize: pageSize.value,
  }
  loading.value = true
  try {
    const result: ProSearchTableRequestResult = await props.request(
      cloneDeep(params),
    )
    if (disposed || id !== requestId) return false
    if (
      !result ||
      !Array.isArray(result.data) ||
      !Number.isFinite(result.total) ||
      result.total < 0
    ) {
      throw new TypeError(
        'request 必须返回 { data: 数组, total: 非负有限数值 }',
      )
    }
    data.value = result.data
    total.value = result.total
    emit('request-success', result, params)
    return true
  } catch (error) {
    if (!disposed && id === requestId) emit('request-error', error, params)
    return false
  } finally {
    if (!disposed && id === requestId) loading.value = false
  }
}

const scheduleRequest = (): Promise<boolean> => {
  ++requestId
  if (!scheduled) {
    scheduled = nextTick().then(() => {
      scheduled = undefined
      return executeRequest()
    })
  }
  latestRequest = scheduled
  return scheduled
}

const handleSearch = () => {
  submittedQuery = cloneDeep(props.model)
  hasSubmitted = true
  setPagination(1, pageSize.value)
  emit('search', cloneDeep(submittedQuery))
  void scheduleRequest()
}

const handlePagination = (page: number, size: number) => {
  const targetPage = size !== pageSize.value ? 1 : page
  setPagination(targetPage, size)
  emit('pagination', targetPage, size)
  void scheduleRequest()
}

const handleValidate = (
  prop: FormItemProp,
  valid: boolean,
  message: string,
) => {
  emit('validate', prop, valid, message)
}

watch(
  () => [props.currentPage, props.pageSize] as const,
  ([page, size]) => {
    const sizeChanged = size !== pageSize.value
    const targetPage = sizeChanged && page === currentPage.value ? 1 : page
    if (targetPage === currentPage.value && size === pageSize.value) return
    setPagination(targetPage, size)
    void scheduleRequest()
  },
)

const search = async () => {
  const submission = ++pendingSubmission
  const valid = await searchFormRef.value?.search()
  return valid && submission === pendingSubmission && !disposed
    ? latestRequest
    : false
}
const reload = () => {
  if (!hasSubmitted) {
    submittedQuery = cloneDeep(props.model)
    hasSubmitted = true
  }
  return scheduleRequest()
}
const reset = async () => {
  const previous = requestId
  await searchFormRef.value?.reset()
  if (requestId !== previous) await latestRequest
}

onBeforeUnmount(() => {
  disposed = true
  ++requestId
})

defineExpose<ProSearchTableInstance>({
  search,
  reload,
  reset,
  getSearchFormInstance: () => searchFormRef.value,
  getTableInstance: () => tableRef.value,
  get data() {
    return data.value
  },
  get total() {
    return total.value
  },
  get loading() {
    return loading.value
  },
  get currentPage() {
    return currentPage.value
  },
  get pageSize() {
    return pageSize.value
  },
})
</script>
