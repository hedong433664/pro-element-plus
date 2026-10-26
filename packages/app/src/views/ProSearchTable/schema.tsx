import {
  ElButton,
  ElMessage,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElOption,
  ElProgress,
  ElSelect,
  ElTag,
} from 'element-plus'
import type {
  ProSearchFormFields,
  ProTableColumn,
} from '@coderhd/pro-element-plus'
import { cities, departments, type DataRow, type SearchModel } from './data'

export const createFields = (): ProSearchFormFields<SearchModel> => [
  {
    prop: 'keyword',
    // label: '关键字',
    labelWidth: 0,
    component: ElInput,
    componentProps: { clearable: true, placeholder: '姓名或邮箱' },
    colProps: { span: 6 },
  },
  {
    prop: 'department',
    label: '部门',
    component: ElSelect,
    componentProps: {
      clearable: true,
      placeholder: '全部部门',
      style: { width: '100%' },
    },
    componentSlots: {
      default: () =>
        departments.map((value) => (
          <ElOption key={value} label={value} value={value} />
        )),
    },
    colProps: { span: 6 },
  },
  {
    prop: 'status',
    label: '状态',
    component: ElSelect,
    componentProps: {
      clearable: true,
      placeholder: '全部状态',
      style: { width: '100%' },
    },
    componentSlots: {
      default: () => (
        <>
          <ElOption label="启用" value="enabled" />
          <ElOption label="停用" value="disabled" />
        </>
      ),
    },
    colProps: { span: 6 },
  },
  {
    prop: 'city',
    label: '城市',
    component: ElSelect,
    componentProps: {
      clearable: true,
      filterable: true,
      placeholder: '全部城市',
      style: { width: '100%' },
    },
    componentSlots: {
      default: () =>
        cities.map((value) => (
          <ElOption key={value} label={value} value={value} />
        )),
    },
    colProps: { span: 6 },
  },
  {
    prop: 'minScore',
    label: '最低评分',
    component: ElInputNumber,
    componentProps: {
      min: 0,
      max: 100,
      controlsPosition: 'right',
      placeholder: '不限',
      style: { width: '100%' },
    },
    colProps: { span: 6 },
  },
  {
    prop: 'createdAtRange',
    label: '创建日期',
    component: ElDatePicker,
    componentProps: {
      type: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      rangeSeparator: '至',
      style: { width: '100%' },
    },
    colProps: { span: 8 },
  },
]

export const createColumns = (): ProTableColumn<DataRow>[] => [
  { type: 'index', label: '序号', width: 64, fixed: 'left' },
  { prop: 'name', label: '姓名', minWidth: 110, fixed: 'left' },
  { prop: 'email', label: '邮箱', minWidth: 200, showOverflowTooltip: true },
  { prop: 'department', label: '部门', width: 100 },
  {
    prop: 'role',
    label: '角色',
    width: 100,
    cellSlots: {
      default: ({ row }) => <ElTag effect="plain">{row.role}</ElTag>,
    },
  },
  { prop: 'city', label: '城市', width: 90 },
  {
    prop: 'score',
    label: '评分',
    width: 160,
    cellSlots: {
      default: ({ row }) => (
        <ElProgress
          percentage={row.score}
          strokeWidth={8}
          color={
            row.score >= 80
              ? 'var(--el-color-success)'
              : 'var(--el-color-primary)'
          }
        />
      ),
    },
  },
  {
    prop: 'status',
    label: '状态',
    width: 90,
    cellSlots: {
      default: ({ row }) => (
        <ElTag type={row.status === 'enabled' ? 'success' : 'info'}>
          {row.status === 'enabled' ? '启用' : '停用'}
        </ElTag>
      ),
    },
  },
  { prop: 'createdAt', label: '创建日期', width: 120, sortable: true },
  {
    columnKey: 'actions',
    label: '操作',
    width: 90,
    fixed: 'right',
    cellSlots: {
      default: ({ row }) => (
        <ElButton
          type="primary"
          link
          onClick={() =>
            ElMessage.info(`${row.name} · ${row.email} · ${row.city}`)
          }
        >
          查看
        </ElButton>
      ),
    },
  },
]
