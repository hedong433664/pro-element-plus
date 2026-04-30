<template>
  <div class="global-page-container">
    <ProHeader divider>基础用法</ProHeader>

    <ProSearchForm
      label-width="88px"
      :model="searchModel"
      :fields="fields"
      :gutter="16"
      :collapsed-count="3"
      buttonJustify="flex-end"
      default-collapsed
      @search="handleSearch"
      @reset="handleReset"
      @collapsed="handleCollapsed"
    >
      <el-button @click="fillKeyword">填充关键字</el-button>
    </ProSearchForm>

    <ProHeader divider>当前状态</ProHeader>

    <pre class="pro-search-form-demo__json">{{
      JSON.stringify(
        {
          model: searchModel,
          collapsed,
          searchCount,
          lastSearchParams,
        },
        null,
        2,
      )
    }}</pre>
  </div>
</template>

<script setup lang="tsx">
import { computed, h, reactive, ref } from 'vue'
import { ElInput, ElOption, ElSelect, ElMessage } from 'element-plus'
import {
  provideProFormComponents,
  type ProSearchFormFields,
} from '@coderhd/pro-element-plus'

type SearchModel = {
  keyword: string
  status: string
  department: string
  city: string
  remark: string
}

provideProFormComponents({
  ElInput,
  ElSelect,
})

const collapsed = ref(true)
const searchCount = ref(0)
const lastSearchParams = ref<Record<string, any> | null>(null)

const searchModel = reactive<SearchModel>({
  keyword: '',
  status: '',
  department: '',
  city: '',
  remark: '',
})

const statusOptions = [
  { label: '启用', value: 'enabled' },
  { label: '停用', value: 'disabled' },
]

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

const fields = computed(
  (): ProSearchFormFields<SearchModel> => [
    {
      prop: 'keyword',
      label: '关键字',
      component: 'ElInput',
      componentProps: {
        placeholder: '请输入关键字',
        clearable: true,
      },
      colProps: {
        span: 8,
      },
    },
    {
      prop: 'status',
      label: '状态',
      component: 'ElSelect',
      componentProps: {
        placeholder: '请选择状态',
        clearable: true,
      },
      componentSlots: {
        default: () =>
          statusOptions.map((item) =>
            h(ElOption, {
              key: item.value,
              label: item.label,
              value: item.value,
            }),
          ),
      },
      colProps: {
        span: 8,
      },
    },
    {
      prop: 'department',
      label: '部门',
      component: 'ElSelect',
      componentProps: {
        placeholder: '请选择部门',
        clearable: true,
      },
      componentSlots: {
        default: () =>
          departmentOptions.map((item) =>
            h(ElOption, {
              key: item.value,
              label: item.label,
              value: item.value,
            }),
          ),
      },
      colProps: {
        span: 8,
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
        span: 8,
      },
    },
    {
      prop: 'remark',
      label: '备注',
      component: 'ElInput',
      componentProps: {
        placeholder: '请输入备注',
        clearable: true,
      },
      colProps: {
        span: 16,
      },
    },
  ],
)

const handleSearch = (params?: Record<string, any>) => {
  searchCount.value += 1
  lastSearchParams.value = params ?? null
  ElMessage.success(`已触发查询，第 ${searchCount.value} 次`)
}

const handleReset = () => {
  lastSearchParams.value = null
  ElMessage.info('已执行重置')
}

const handleCollapsed = (value: boolean) => {
  collapsed.value = value
  ElMessage.info(value ? '已收起' : '已展开')
}

const fillKeyword = () => {
  searchModel.keyword = '测试关键字'
}
</script>

<style lang="scss" scoped>
.pro-search-form-demo__json {
  margin: 0;
  padding: 16px;
  border-radius: 12px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  overflow: auto;
}
</style>
