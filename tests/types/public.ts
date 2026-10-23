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
