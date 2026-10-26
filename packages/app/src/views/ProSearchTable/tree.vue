<template>
  <ProSearchTable
    :model="model"
    :fields="fields"
    :columns="columns"
    :request="requestTree"
    :auto-search="false"
    :gutter="16"
    :collapsed-count="1"
    label-width="80px"
    height="320px"
    row-key="id"
    :tree-props="{ children: 'children' }"
    default-expand-all
    hide-pagination
    border
    stripe
  />
</template>

<script setup lang="tsx">
import { reactive } from 'vue'
import {
  ElButton,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
  ElTag,
} from 'element-plus'
import {
  type ProSearchTableRequest,
  type ProSearchFormFields,
  type ProTableColumn,
} from '@coderhd/pro-element-plus'

interface Query {
  keyword: string
  kind: string
  owner: string
}
interface TreeRow {
  id: number
  name: string
  kind: 'folder' | 'file'
  owner: string
  size: string
  updatedAt: string
  children?: TreeRow[]
}
const model = reactive<Query>({ keyword: '', kind: '', owner: '' })
const fields: ProSearchFormFields<Query> = [
  {
    prop: 'keyword',
    label: '名称',
    component: ElInput,
    componentProps: { clearable: true, placeholder: '输入文件或目录名' },
    colProps: { span: 6 },
  },
  {
    prop: 'kind',
    label: '类型',
    component: ElSelect,
    componentProps: {
      clearable: true,
      placeholder: '全部类型',
      style: { width: '100%' },
    },
    componentSlots: {
      default: () => (
        <>
          <ElOption label="目录" value="folder" />
          <ElOption label="文件" value="file" />
        </>
      ),
    },
    colProps: { span: 6 },
  },
  {
    prop: 'owner',
    label: '创建者',
    component: ElSelect,
    componentProps: {
      clearable: true,
      placeholder: '全部创建者',
      style: { width: '100%' },
    },
    componentSlots: {
      default: () =>
        ['张三', '李四', '王五'].map((value) => (
          <ElOption key={value} label={value} value={value} />
        )),
    },
    colProps: { span: 6 },
  },
]
const columns: ProTableColumn<TreeRow>[] = [
  { type: 'index', label: '序号', width: 64, fixed: 'left' },
  { prop: 'name', label: '名称', minWidth: 240 },
  {
    prop: 'kind',
    label: '类型',
    width: 90,
    cellSlots: {
      default: ({ row }) => (
        <ElTag type={row.kind === 'folder' ? 'warning' : 'info'}>
          {row.kind === 'folder' ? '目录' : '文件'}
        </ElTag>
      ),
    },
  },
  { prop: 'owner', label: '创建者', width: 100 },
  { prop: 'size', label: '大小', width: 100, align: 'right' },
  { prop: 'updatedAt', label: '更新日期', width: 130 },
  {
    label: '操作',
    width: 90,
    fixed: 'right',
    cellSlots: {
      default: ({ row }) => (
        <ElButton
          type="primary"
          link
          onClick={() =>
            ElMessage.info(`${row.name} · ${row.owner} · ${row.size}`)
          }
        >
          查看
        </ElButton>
      ),
    },
  },
]
const nodes: TreeRow[] = [
  {
    id: 1,
    name: '文件',
    kind: 'folder',
    owner: '张三',
    size: '—',
    updatedAt: '2026-06-18',
    children: [
      {
        id: 11,
        name: '文档',
        kind: 'folder',
        owner: '张三',
        size: '—',
        updatedAt: '2026-06-18',
        children: [
          {
            id: 111,
            name: '说明.md',
            kind: 'file',
            owner: '张三',
            size: '12 KB',
            updatedAt: '2026-06-18',
          },
          {
            id: 112,
            name: '记录.md',
            kind: 'file',
            owner: '李四',
            size: '8 KB',
            updatedAt: '2026-06-16',
          },
        ],
      },
      {
        id: 12,
        name: '图片',
        kind: 'folder',
        owner: '王五',
        size: '—',
        updatedAt: '2026-05-20',
        children: [
          {
            id: 121,
            name: '封面.png',
            kind: 'file',
            owner: '王五',
            size: '256 KB',
            updatedAt: '2026-05-20',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '归档',
    kind: 'folder',
    owner: '李四',
    size: '—',
    updatedAt: '2026-04-12',
    children: [
      {
        id: 21,
        name: '旧文档.md',
        kind: 'file',
        owner: '李四',
        size: '6 KB',
        updatedAt: '2026-04-12',
      },
    ],
  },
]
const filterTree = (rows: TreeRow[], query: Query): TreeRow[] =>
  rows.flatMap((row) => {
    const matches =
      row.name.includes(query.keyword.trim()) &&
      (!query.kind || row.kind === query.kind) &&
      (!query.owner || row.owner === query.owner)
    if (matches) return [row]
    const children = filterTree(row.children ?? [], query)
    return children.length ? [{ ...row, children }] : []
  })
const requestTree: ProSearchTableRequest<Query, TreeRow> = async ({
  query,
}) => {
  const data = filterTree(nodes, query)
  return { data, total: data.length }
}
</script>
