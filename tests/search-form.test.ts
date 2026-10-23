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
  it('debounces model changes and cancels the queued search on manual search', async () => {
    const model = reactive({ name: '' })
    const wrapper = create({ model })
    model.name = 'Alice'
    await nextTick()
    model.name = 'Bob'
    await nextTick()
    await wrapper.vm.search()
    await vi.advanceTimersByTimeAsync(500)
    expect(wrapper.emitted('search')).toHaveLength(1)
  })
  it('queries immediately when manual search follows a model update in the same tick', async () => {
    const model = reactive({ name: '' })
    const wrapper = create({ model })
    model.name = 'Alice'
    expect(await wrapper.vm.search()).toBe(true)
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
    expect(await wrapper.vm.search()).toBe(false)
    await wrapper.vm.reset()
    await vi.advanceTimersByTimeAsync(500)
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
    await wrapper.vm.reset()
    await vi.advanceTimersByTimeAsync(500)
    expect(model.name).toBe('')
    expect(wrapper.emitted('reset')).toHaveLength(1)
    expect(wrapper.emitted('search')).toBeUndefined()
  })
})
