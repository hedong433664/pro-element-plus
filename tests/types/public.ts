import {
  ProForm,
  ProSearchForm,
  ProTable,
  type ProFormFields,
  type ProTableColumn,
  type ProFormInstance,
  type ProSearchFormInstance,
} from '@coderhd/pro-element-plus'

declare const form: InstanceType<typeof ProForm>
declare const search: InstanceType<typeof ProSearchForm>
declare const table: InstanceType<typeof ProTable>
const _formInstance: ProFormInstance = form
const _searchInstance: ProSearchFormInstance = search
form.getInstance()
search.search().then((valid: boolean) => valid)
search.reset()
search.toggleCollapse()
table.clearSelection()
table.getInstance()
// @ts-expect-error internal Element Plus component state is not exposed by our wrapper
form.resetLabelWidth()
// @ts-expect-error not part of the wrapper's explicit table contract
const _store = table.store
search.$emit('search', { name: 'Alice' })
search.$emit('collapsed', true)
// @ts-expect-error event payload must match the public contract
search.$emit('collapsed', 'yes')

type User = {
  name: string
  address: { city: string }
  tags: { label: string }[]
}
const _fields: ProFormFields<User> = [
  { prop: 'name', component: 'ElInput' },
  { prop: 'address.city', component: 'ElInput' },
  { prop: 'tags.0.label', component: 'ElInput' },
  // @ts-expect-error misspelled model key
  { prop: 'nmae', component: 'ElInput' },
  // @ts-expect-error misspelled nested key
  { prop: 'address.ctiy', component: 'ElInput' },
]
const _columns: ProTableColumn<User>[] = [
  { prop: 'address.city', align: 'right', sortable: 'custom' },
  // @ts-expect-error misspelled model key
  { prop: 'nmae' },
  // @ts-expect-error invalid alignment
  { prop: 'name', align: 'whatever' },
  // @ts-expect-error invalid fixed mode
  { prop: 'name', fixed: 'middle' },
]

// Consumer-side declaration merging must survive the package's root barrel.
declare module '@coderhd/pro-element-plus' {
  interface ProFormComponentTypeMap {
    AuditSelect: {
      props: { options: string[] }
      slots: { default: (scope: { label: string }) => import('vue').VNodeChild }
    }
  }
}
const _customFields: ProFormFields<User> = [
  {
    prop: 'name',
    component: 'AuditSelect',
    componentProps: { options: ['Alice'] },
    componentSlots: { default: (scope) => scope.label },
  },
]
const _invalidCustomFields: ProFormFields<User> = [
  // @ts-expect-error custom component properties preserve their declared types
  {
    prop: 'name',
    component: 'AuditSelect',
    componentProps: { options: [123] },
  },
]

// Search table owns results and request state; native table listeners remain public.
import {
  ProSearchTable,
  type ProSearchTableProps,
  type ProSearchTableRequest,
  type ProSearchTableInstance,
} from '@coderhd/pro-element-plus'
declare const searchTable: InstanceType<typeof ProSearchTable>
const _searchTableInstance: ProSearchTableInstance = searchTable
searchTable.search().then((applied: boolean) => applied)
searchTable.reload()
searchTable.reset()
searchTable.getTableInstance()?.clearSelection()
searchTable.getSearchFormInstance()?.validate()
const _request: ProSearchTableRequest<{ keyword: string }, User> = async ({
  query,
  currentPage,
  pageSize,
}) => ({
  data: [
    {
      name: query.keyword,
      address: { city: String(currentPage) },
      tags: [{ label: String(pageSize) }],
    },
  ],
  total: 1,
})
const _searchTableProps: ProSearchTableProps<{ keyword: string }, User> = {
  request: _request,
  model: { keyword: '' },
  fields: [{ prop: 'keyword', component: 'ElInput' }],
  columns: [{ prop: 'name' }],
  size: 'small',
}
const _invalidData: ProSearchTableProps = {
  request: async () => ({ data: [], total: 0 }),
  // @ts-expect-error data can only come from request
  data: [],
}
const _invalidTotal: ProSearchTableProps = {
  request: async () => ({ data: [], total: 0 }),
  // @ts-expect-error total can only come from request
  total: 100,
}
const _invalidLoading: ProSearchTableProps = {
  request: async () => ({ data: [], total: 0 }),
  // @ts-expect-error loading is internally managed
  loading: true,
}
const _nativeTableListener: InstanceType<
  typeof ProSearchTable
>['$props']['onSelectionChange'] = (_rows: unknown[]) => {}
