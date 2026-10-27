import { flushPromises, mount } from '@vue/test-utils'
import { ElFormItem, ElInput } from 'element-plus'
import { markRaw, nextTick, reactive } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProSearchForm } from '../packages/components/search-form'

const wrappers: ReturnType<typeof mount>[] = []
function create(props: Record<string, unknown> = {}) {
  const wrapper = mount(ProSearchForm, {
    props: {
      model: reactive({ name: '', other: '' }),
      fields: [],
      initSearch: false,
      ...props,
    },
  })
  wrappers.push(wrapper)
  return wrapper
}
const settle = async () => {
  await nextTick()
  await flushPromises()
}

const submit = async (wrapper: ReturnType<typeof create>) => {
  const pending = wrapper.vm.search()
  await settle()
  await vi.advanceTimersByTimeAsync(wrapper.props('autoSearchDebounce') ?? 300)
  await settle()
  return pending
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.useRealTimers()
})

describe('ProSearchForm', () => {
  it('按钮区默认右对齐', () => {
    const wrapper = create()
    expect(wrapper.find('.pro-col__not-grid').attributes('style')).toContain(
      'justify-content: flex-end',
    )
  })
  it('允许显式覆盖按钮区对齐方式', () => {
    const wrapper = create({ buttonJustify: 'flex-start' })
    expect(wrapper.find('.pro-col__not-grid').attributes('style')).toContain(
      'justify-content: flex-start',
    )
  })
  it('initializes independently of automatic model watching', async () => {
    const wrapper = create({ initSearch: true, autoSearch: false })
    await settle()
    expect(wrapper.emitted('search')).toHaveLength(1)
  })
  it.each([true, false])(
    '初始化不等待防抖（autoSearch=%s）',
    async (autoSearch) => {
      const wrapper = create({
        initSearch: true,
        autoSearch,
        autoSearchDebounce: 5000,
      })
      await settle()
      expect(wrapper.emitted('search')).toHaveLength(1)
      await vi.advanceTimersByTimeAsync(5000)
      expect(wrapper.emitted('search')).toHaveLength(1)
    },
  )
  it('实例 search 连续调用只提交一次，被替换的调用返回 false', async () => {
    const wrapper = create({ autoSearch: false })
    const first = wrapper.vm.search()
    await vi.advanceTimersByTimeAsync(100)
    const second = wrapper.vm.search()
    expect(await first).toBe(false)
    await vi.advanceTimersByTimeAsync(299)
    expect(wrapper.emitted('search')).toBeUndefined()
    await vi.advanceTimersByTimeAsync(1)
    expect(await second).toBe(true)
    expect(wrapper.emitted('search')).toHaveLength(1)
  })
  it('关闭自动查询不会取消已经排队的手动查询', async () => {
    const wrapper = create()
    const pending = wrapper.vm.search()
    await wrapper.setProps({ autoSearch: false })
    await vi.advanceTimersByTimeAsync(300)
    expect(await pending).toBe(true)
    expect(wrapper.emitted('search')).toHaveLength(1)
  })
  it('debounces model changes and cancels the queued search on manual search', async () => {
    const model = reactive({ name: '' })
    const wrapper = create({ model })
    model.name = 'Alice'
    await nextTick()
    model.name = 'Bob'
    await nextTick()
    await submit(wrapper)
    await vi.advanceTimersByTimeAsync(500)
    expect(wrapper.emitted('search')).toHaveLength(1)
  })
  it('debounces manual search following a model update in the same tick', async () => {
    const model = reactive({ name: '' })
    const wrapper = create({ model })
    model.name = 'Alice'
    expect(await submit(wrapper)).toBe(true)
    expect(wrapper.emitted('search')).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(500)
    expect(wrapper.emitted('search')).toHaveLength(1)
  })
  it('does not query after unmount', async () => {
    const listener = vi.fn()
    const model = reactive({ name: '' })
    const wrapper = create({ model, onSearch: listener })
    model.name = 'Alice'
    await nextTick()
    wrapper.unmount()
    wrappers.pop()
    await vi.advanceTimersByTimeAsync(500)
    expect(listener).not.toHaveBeenCalled()
  })
  it('cancels queued searches when automatic mode is disabled', async () => {
    const model = reactive({ name: '' })
    const wrapper = create({ model })
    model.name = 'Alice'
    await nextTick()
    await wrapper.setProps({ autoSearch: false })
    await vi.advanceTimersByTimeAsync(500)
    expect(wrapper.emitted('search')).toBeUndefined()
  })
  it('honors updated debounce delays', async () => {
    const model = reactive({ name: '' })
    const wrapper = create({ model })
    await wrapper.setProps({ autoSearchDebounce: 50 })
    model.name = 'Alice'
    await nextTick()
    await vi.advanceTimersByTimeAsync(49)
    expect(wrapper.emitted('search')).toBeUndefined()
    await vi.advanceTimersByTimeAsync(1)
    await settle()
    expect(wrapper.emitted('search')).toHaveLength(1)
  })
  it.each([true, false])(
    '查询按钮连续点击共用防抖（autoSearch=%s）',
    async (autoSearch) => {
      const model = reactive({ name: '' })
      const wrapper = create({ model, autoSearch })
      const button = wrapper
        .findAll('button')
        .find((button) => button.text() === '查询')!
      await button.trigger('click')
      await vi.advanceTimersByTimeAsync(100)
      model.name = '最后条件'
      await button.trigger('click')
      await vi.advanceTimersByTimeAsync(100)
      await button.trigger('click')
      await vi.advanceTimersByTimeAsync(299)
      expect(wrapper.emitted('search')).toBeUndefined()
      await vi.advanceTimersByTimeAsync(1)
      await settle()
      expect(wrapper.emitted('search')).toEqual([[{ name: '最后条件' }]])
      await vi.advanceTimersByTimeAsync(500)
      expect(wrapper.emitted('search')).toHaveLength(1)
    },
  )
  it('输入变化和点击查询只使用一个计时器', async () => {
    const model = reactive({ name: '' })
    const wrapper = create({ model })
    model.name = 'Alice'
    await nextTick()
    await vi.advanceTimersByTimeAsync(100)
    await wrapper
      .findAll('button')
      .find((button) => button.text() === '查询')!
      .trigger('click')
    await vi.advanceTimersByTimeAsync(299)
    expect(wrapper.emitted('search')).toBeUndefined()
    await vi.advanceTimersByTimeAsync(1)
    await settle()
    expect(wrapper.emitted('search')).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(500)
    expect(wrapper.emitted('search')).toHaveLength(1)
  })
  it.each([true, false])(
    '重置取消待执行的按钮查询（resetAfterSearch=%s）',
    async (resetAfterSearch) => {
      const wrapper = create({ autoSearch: false, resetAfterSearch })
      await wrapper
        .findAll('button')
        .find((button) => button.text() === '查询')!
        .trigger('click')
      const resetting = wrapper.vm.reset()
      await settle()
      await vi.advanceTimersByTimeAsync(500)
      await resetting
      expect(wrapper.emitted('search')?.length ?? 0).toBe(
        resetAfterSearch ? 1 : 0,
      )
    },
  )
  it('卸载后取消按钮查询', async () => {
    const onSearch = vi.fn()
    const wrapper = create({ autoSearch: false, onSearch })
    await wrapper
      .findAll('button')
      .find((button) => button.text() === '查询')!
      .trigger('click')
    wrapper.unmount()
    wrappers.pop()
    await vi.advanceTimersByTimeAsync(500)
    expect(onSearch).not.toHaveBeenCalled()
  })
  it('按钮使用更新后的防抖时间', async () => {
    const wrapper = create({ autoSearch: false })
    await wrapper.setProps({ autoSearchDebounce: 50 })
    await wrapper
      .findAll('button')
      .find((button) => button.text() === '查询')!
      .trigger('click')
    await vi.advanceTimersByTimeAsync(49)
    expect(wrapper.emitted('search')).toBeUndefined()
    await vi.advanceTimersByTimeAsync(1)
    await settle()
    expect(wrapper.emitted('search')).toHaveLength(1)
  })
  it('keeps collapsed fields registered for reset and validation', async () => {
    const model = reactive({ name: 'initial', other: 'initial-other' })
    const wrapper = create({
      model,
      defaultCollapsed: true,
      collapsedCount: 1,
      fields: [
        { prop: 'name', component: markRaw(ElInput) },
        {
          prop: 'other',
          component: markRaw(ElInput),
          rules: [{ required: true, message: 'Required' }],
        },
      ],
    })
    expect(wrapper.findAllComponents(ElFormItem)).toHaveLength(2)
    expect(wrapper.vm.fields).toHaveLength(2)
    model.other = ''
    await nextTick()
    expect(await submit(wrapper)).toBe(false)
    const resetting = wrapper.vm.reset()
    await settle()
    await vi.advanceTimersByTimeAsync(500)
    await resetting
    expect(model.other).toBe('initial-other')
    expect(wrapper.emitted('search')).toHaveLength(1)
  })
  it.each([true, false])(
    'ignores stale asynchronous validation results (autoSearch=%s)',
    async (autoSearch) => {
      const model = reactive({ name: 'Alice' })
      const wrapper = create({
        model,
        autoSearch,
        fields: [
          {
            prop: 'name',
            component: markRaw(ElInput),
            rules: [
              {
                validator: (
                  _rule: unknown,
                  _value: unknown,
                  callback: () => void,
                ) => {
                  setTimeout(callback, 200)
                },
              },
            ],
          },
        ],
      })
      const first = wrapper.vm.search()
      await vi.advanceTimersByTimeAsync(300)
      await settle()
      model.name = 'Bob'
      await nextTick()
      await vi.advanceTimersByTimeAsync(200)
      expect(await first).toBe(false)
      expect(wrapper.emitted('search')).toBeUndefined()
      await vi.advanceTimersByTimeAsync(400)
      await settle()
      if (autoSearch) expect(wrapper.emitted('search')).toHaveLength(1)
      else expect(wrapper.emitted('search')).toBeUndefined()
    },
  )
  it('counts visible fields and renders collapse-only actions', () => {
    const wrapper = create({
      defaultCollapsed: true,
      hideSearchButton: true,
      hideResetButton: true,
      fields: [
        { prop: 'hidden', component: markRaw(ElInput), hidden: true },
        { prop: 'name', component: markRaw(ElInput) },
        { prop: 'other', component: markRaw(ElInput) },
      ],
    })
    expect(wrapper.findAllComponents(ElFormItem)).toHaveLength(2)
    expect(wrapper.find('button').text()).toContain('展开')
    expect(
      wrapper.findAll('.el-col')[0]?.attributes('style') ?? '',
    ).not.toContain('display: none')
    expect(wrapper.findAll('.el-col')[1]?.attributes('style')).toContain(
      'display: none',
    )
  })
  it('resetAfterSearch=false suppresses both reset and pending automatic queries', async () => {
    const model = reactive({ name: '' })
    const wrapper = create({
      model,
      resetAfterSearch: false,
      fields: [{ prop: 'name', component: markRaw(ElInput) }],
    })
    model.name = 'Alice'
    await nextTick()
    const resetting = wrapper.vm.reset()
    await settle()
    await vi.advanceTimersByTimeAsync(500)
    await resetting
    expect(model.name).toBe('')
    expect(wrapper.emitted('reset')).toHaveLength(1)
    expect(wrapper.emitted('search')).toBeUndefined()
  })
})
