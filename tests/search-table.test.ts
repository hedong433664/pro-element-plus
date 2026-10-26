import { flushPromises, mount } from '@vue/test-utils'
import { ElForm, ElInput, ElPagination, ElTable } from 'element-plus'
import { markRaw, nextTick, reactive } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProSearchTable } from '../packages/components/search-table'
import { ProSearchForm } from '../packages/components/search-form'
import { ProTable } from '../packages/components/table'

const wrappers: ReturnType<typeof mount>[] = []
const rows = [{ id: 1, name: 'Alice' }]
const result = () => ({ data: rows, total: 100 })
const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}
const create = (
  extra: Record<string, any> = {},
  slots: Record<string, any> = {},
) => {
  const request = vi.fn().mockResolvedValue(result())
  const wrapper = mount(ProSearchTable, {
    props: {
      request,
      model: reactive({ keyword: '' }),
      columns: [{ prop: 'name' }],
      autoSearch: false,
      ...extra,
    },
    slots,
  })
  wrappers.push(wrapper)
  return { wrapper, request: (extra.request ?? request) as typeof request }
}
const pagination = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(ElPagination)
const deferred = () => {
  let resolve!: (value: ReturnType<typeof result>) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<ReturnType<typeof result>>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.useRealTimers()
})

describe('ProSearchTable', () => {
  it('初始化只请求一次，统一 size 且保留原生表格默认值', async () => {
    const { wrapper, request } = create({ size: 'small', border: true })
    await settle()
    expect(request).toHaveBeenCalledExactlyOnceWith({
      query: { keyword: '' },
      currentPage: 1,
      pageSize: 10,
    })
    expect(wrapper.findComponent(ElForm).props('size')).toBe('small')
    const table = wrapper.findComponent(ElTable)
    expect(table.props('size')).toBe('small')
    expect(table.props('border')).toBe(true)
    expect(table.props('fit')).toBe(true)
    expect(table.props('showHeader')).toBe(true)
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.vm.total).toBe(100)
  })
  it('关闭初始化查询后，search 才提交并请求', async () => {
    const { wrapper, request } = create({ initSearch: false })
    await settle()
    expect(request).not.toHaveBeenCalled()
    expect(await wrapper.vm.search()).toBe(true)
    expect(request).toHaveBeenCalledOnce()
  })
  it('分页使用已提交条件的深快照，查询返回第一页且只请求一次', async () => {
    const model = reactive({ keyword: 'first', nested: { value: 1 } })
    const { wrapper, request } = create({ model })
    await settle()
    model.keyword = 'draft'
    model.nested.value = 2
    pagination(wrapper).vm.$emit('update:current-page', 3)
    await settle()
    expect(request).toHaveBeenLastCalledWith({
      query: { keyword: 'first', nested: { value: 1 } },
      currentPage: 3,
      pageSize: 10,
    })
    const before = request.mock.calls.length
    expect(await wrapper.vm.search()).toBe(true)
    expect(request).toHaveBeenCalledTimes(before + 1)
    expect(request).toHaveBeenLastCalledWith({
      query: { keyword: 'draft', nested: { value: 2 } },
      currentPage: 1,
      pageSize: 10,
    })
  })
  it('修改每页条数返回第一页，不重复请求', async () => {
    const { wrapper, request } = create()
    await settle()
    pagination(wrapper).vm.$emit('update:current-page', 4)
    await settle()
    const before = request.mock.calls.length
    pagination(wrapper).vm.$emit('update:page-size', 20)
    await settle()
    expect(request).toHaveBeenCalledTimes(before + 1)
    expect(request).toHaveBeenLastCalledWith({
      query: { keyword: '' },
      currentPage: 1,
      pageSize: 20,
    })
    expect(wrapper.vm.currentPage).toBe(1)
  })
  it('reload 保留当前页和已提交条件', async () => {
    const model = reactive({ keyword: 'first' })
    const { wrapper, request } = create({ model })
    await settle()
    pagination(wrapper).vm.$emit('update:current-page', 2)
    await settle()
    model.keyword = 'draft'
    expect(await wrapper.vm.reload()).toBe(true)
    expect(request).toHaveBeenLastCalledWith({
      query: { keyword: 'first' },
      currentPage: 2,
      pageSize: 10,
    })
  })
  it('外部控制分页时合并更新，v-model 回写不会重复请求', async () => {
    const { wrapper, request } = create()
    await settle()
    await wrapper.setProps({ currentPage: 3, pageSize: 20 })
    await settle()
    expect(request).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.currentPage).toBe(3)
    pagination(wrapper).vm.$emit('update:current-page', 4)
    await settle()
    const before = request.mock.calls.length
    await wrapper.setProps({ currentPage: 4 })
    await settle()
    expect(request).toHaveBeenCalledTimes(before)
  })
  it('校验未通过不请求', async () => {
    const { wrapper, request } = create({
      initSearch: false,
      fields: [
        {
          prop: 'keyword',
          component: markRaw(ElInput),
          rules: [{ required: true, message: 'Required' }],
        },
      ],
    })
    await settle()
    expect(await wrapper.vm.search()).toBe(false)
    expect(request).not.toHaveBeenCalled()
  })
  it('重置恢复初始值并且只请求一次，resetAfterSearch=false 不请求', async () => {
    const model = reactive({ keyword: 'initial' })
    const { wrapper, request } = create({
      model,
      autoSearch: true,
      fields: [{ prop: 'keyword', component: markRaw(ElInput) }],
    })
    await settle()
    model.keyword = 'draft'
    await nextTick()
    const before = request.mock.calls.length
    await wrapper.vm.reset()
    await settle()
    expect(model.keyword).toBe('initial')
    expect(request).toHaveBeenCalledTimes(before + 1)
    await wrapper.setProps({ resetAfterSearch: false })
    const count = request.mock.calls.length
    await wrapper.vm.reset()
    expect(request).toHaveBeenCalledTimes(count)
  })
  it('自动查询触发后提交条件并回到第一页', async () => {
    vi.useFakeTimers()
    const model = reactive({ keyword: '' })
    const { wrapper, request } = create({ model, autoSearch: true })
    await settle()
    model.keyword = 'auto'
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)
    await settle()
    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.lastCall?.[0].query.keyword).toBe('auto')
    wrapper.unmount()
    wrappers.pop()
  })
  it('只应用最新结果，旧请求不能关闭 loading 或发出成功事件', async () => {
    const first = deferred(),
      second = deferred()
    const request = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise)
    const { wrapper } = create({ request })
    await settle()
    const pending = wrapper.vm.reload()
    await settle()
    first.resolve(result())
    await settle()
    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.vm.data).toEqual([])
    second.resolve({ data: [{ id: 2, name: 'Bob' }], total: 1 })
    expect(await pending).toBe(true)
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.data[0]?.name).toBe('Bob')
    expect(wrapper.emitted('request-success')).toHaveLength(1)
  })
  it('请求失败保留数据，错误通过事件返回且 reload 返回 false', async () => {
    const { wrapper, request } = create()
    await settle()
    const error = new Error('failed')
    request.mockRejectedValueOnce(error)
    expect(await wrapper.vm.reload()).toBe(false)
    expect(wrapper.vm.data).toEqual(rows)
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.emitted('request-error')?.[0]?.[0]).toBe(error)
  })
  it.each([
    { data: [], total: -1 },
    { data: null, total: 1 },
    { data: [], total: NaN },
  ])('拒绝非法返回结果 %j', async (value) => {
    const { wrapper } = create({ request: vi.fn().mockResolvedValue(value) })
    await settle()
    expect(wrapper.emitted('request-error')).toHaveLength(1)
    expect(wrapper.vm.loading).toBe(false)
  })
  it('隐藏分页仍使用 request 结果，禁止外部覆盖 data total loading', async () => {
    const { wrapper, request } = create({
      hidePagination: true,
      data: [{ id: 9, name: 'Injected' }],
      total: 999,
      loading: true,
    })
    await settle()
    expect(request).toHaveBeenCalledOnce()
    expect(wrapper.findComponent(ElPagination).exists()).toBe(false)
    expect(wrapper.findComponent(ElTable).props('data')).toEqual(rows)
    expect(wrapper.vm.total).toBe(100)
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.find('.pro-search-table').attributes('data')).toBeUndefined()
  })
  it('转发表单字段、按钮区、工具栏和表格插槽', async () => {
    const { wrapper } = create(
      {
        fields: [{ prop: 'keyword', slotName: 'keyword' }],
        columns: [
          {
            prop: 'name',
            slotNames: { default: 'name', header: 'nameHeader' },
          },
        ],
      },
      {
        'search-keyword': ({ value }: { value: unknown }) =>
          `Field: ${String(value)}`,
        'search-actions': () => 'Search actions',
        toolbar: () => 'Toolbar',
        'table-name': ({ row }: { row: { name: string } }) =>
          `User: ${row.name}`,
        'table-nameHeader': () => 'Name header',
      },
    )
    await settle()
    expect(wrapper.text()).toContain('Field:')
    expect(wrapper.text()).toContain('Search actions')
    expect(wrapper.text()).toContain('Toolbar')
    expect(wrapper.text()).toContain('User: Alice')
    expect(wrapper.text()).toContain('Name header')
  })
  it('无作用域的 empty 和 append 插槽不要求参数', async () => {
    const { wrapper } = create(
      { request: vi.fn().mockResolvedValue({ data: [], total: 0 }) },
      {
        'table-empty': () => 'Custom empty',
        'table-append': () => 'Custom append',
      },
    )
    await settle()
    expect(wrapper.text()).toContain('Custom empty')
    expect(wrapper.text()).toContain('Custom append')
  })
  it('请求函数修改入参不会改变提交快照或事件参数', async () => {
    const request = vi.fn(async (params) => {
      params.query.keyword = 'mutated'
      return result()
    })
    const { wrapper } = create({
      request,
      model: reactive({ keyword: 'original' }),
    })
    await settle()
    expect(wrapper.emitted('request-success')?.[0]?.[1]).toMatchObject({
      query: { keyword: 'original' },
    })
    await wrapper.vm.reload()
    expect(wrapper.emitted('request-success')?.[1]?.[1]).toMatchObject({
      query: { keyword: 'original' },
    })
  })
  it('只重置字段时不等待无关的在途请求', async () => {
    const pending = deferred()
    const { wrapper } = create({
      request: () => pending.promise,
      resetAfterSearch: false,
    })
    await settle()
    await wrapper.vm.reset()
    expect(wrapper.vm.loading).toBe(true)
    pending.resolve(result())
    await settle()
  })
  it('转发原生多选事件并可访问两个子组件实例', async () => {
    const onSelectionChange = vi.fn()
    const { wrapper } = create({
      onSelectionChange,
      rowKey: 'id',
      columns: [{ type: 'selection' }, { prop: 'name' }],
    })
    await settle()
    const table = wrapper.findComponent(ElTable)
    table.vm.$emit('selection-change', rows)
    expect(onSelectionChange).toHaveBeenCalledWith(rows)
    expect(wrapper.vm.getTableInstance()).toBeTruthy()
    expect(wrapper.vm.getSearchFormInstance()).toBeTruthy()
    expect(wrapper.findComponent(ProSearchForm).exists()).toBe(true)
    expect(wrapper.findComponent(ProTable).exists()).toBe(true)
  })
  it('转发树形属性并渲染子节点', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [{ id: 1, name: 'Parent', children: [{ id: 2, name: 'Child' }] }],
      total: 1,
    })
    const { wrapper } = create({
      request,
      hidePagination: true,
      rowKey: 'id',
      defaultExpandAll: true,
      treeProps: { children: 'children' },
    })
    await settle()
    expect(wrapper.findComponent(ElTable).props('rowKey')).toBe('id')
    expect(wrapper.text()).toContain('Parent')
    expect(wrapper.text()).toContain('Child')
  })
  it('卸载后忽略请求结果和错误', async () => {
    const pending = deferred()
    const { wrapper } = create({ request: () => pending.promise })
    await settle()
    wrapper.unmount()
    wrappers.pop()
    pending.reject(new Error('late'))
    await settle()
    expect(wrapper.emitted('request-error')).toBeUndefined()
    expect(wrapper.emitted('request-success')).toBeUndefined()
  })
})
