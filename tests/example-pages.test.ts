import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import ElementPlus, {
  ElDatePicker,
  ElInput,
  ElMessage,
  ElPagination,
  ElRadio,
  ElRadioGroup,
  ElSelect,
} from 'element-plus'
import type { Component } from 'vue'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ProElementPlus, {
  ProForm,
  ProSearchForm,
  ProTable,
  proFormComponentsKey,
} from '@coderhd/pro-element-plus'
import PlayTable from '../packages/play/src/views/ProTable/index.vue'
import PlayForm from '../packages/play/src/views/ProForm/index.vue'
import PlaySearch from '../packages/play/src/views/ProSearchForm/index.vue'
import AppTable from '../packages/app/src/views/ProTable/index.vue'
import AppForm from '../packages/app/src/views/ProForm/index.vue'
import AppSearch from '../packages/app/src/views/ProSearchForm/index.vue'

const examples = [
  { name: 'play', Table: PlayTable, Form: PlayForm, Search: PlaySearch },
  { name: 'app', Table: AppTable, Form: AppForm, Search: AppSearch },
]
const wrappers: VueWrapper[] = []
const settle = async () => {
  await nextTick()
  await flushPromises()
}
const mountPage = (component: Component) => {
  if (!vi.isFakeTimers()) vi.useFakeTimers()
  const wrapper = mount(component, {
    global: {
      plugins: [ElementPlus, ProElementPlus],
      provide: {
        [proFormComponentsKey as symbol]: {
          ElInput,
          ElSelect,
          ElRadio,
          ElRadioGroup,
          ElDatePicker,
        },
      },
    },
  })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(async () => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  ElMessage.closeAll()
  await nextTick()
  vi.restoreAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe.each(examples)('$name 示例页面', ({ Table, Form, Search }) => {
  it('每页条数与数据一致，最后一页不超出总数', async () => {
    const wrapper = mountPage(Table)
    await settle()
    await vi.advanceTimersByTimeAsync(1000)
    const table = wrapper.findAllComponents(ProTable)[1]!
    const pagination = table.findComponent(ElPagination)
    expect(table.props('data')).toHaveLength(10)

    pagination.vm.$emit('update:page-size', 30)
    await settle()
    await vi.advanceTimersByTimeAsync(1000)
    expect(table.props('pageSize')).toBe(30)
    expect(table.props('data')).toHaveLength(30)

    pagination.vm.$emit('update:current-page', 4)
    await settle()
    await vi.advanceTimersByTimeAsync(1000)
    expect(table.props('data')).toHaveLength(10)
    expect(table.props('data')?.[0]?.name).toBe('姓名 91')
    expect(table.props('data')?.at(-1)?.name).toBe('姓名 100')
  })

  it('连续翻页只应用最后一次结果，旧调用不会关闭 loading', async () => {
    const wrapper = mountPage(Table)
    await settle()
    await vi.advanceTimersByTimeAsync(1000)
    const table = wrapper.findAllComponents(ProTable)[1]!
    const pagination = table.findComponent(ElPagination)
    const loading = () => Boolean(table.vm.$.vnode.dirs?.[0]?.value)

    pagination.vm.$emit('update:current-page', 2)
    await settle()
    await vi.advanceTimersByTimeAsync(400)
    pagination.vm.$emit('update:current-page', 3)
    await settle()
    await vi.advanceTimersByTimeAsync(600)
    expect(loading()).toBe(true)
    expect(table.props('data')?.[0]?.name).toBe('姓名 1')

    await vi.advanceTimersByTimeAsync(400)
    expect(loading()).toBe(false)
    expect(table.props('data')?.[0]?.name).toBe('姓名 21')
  })

  it('卸载时取消模拟加载的定时器', async () => {
    // Install spies after fake timers so their handles match clearTimeout calls.
    vi.useFakeTimers()
    const timeout = vi.spyOn(globalThis, 'setTimeout')
    const clear = vi.spyOn(globalThis, 'clearTimeout')
    const wrapper = mountPage(Table)
    await settle()
    const index = timeout.mock.calls.findIndex((args) => args[1] === 1000)
    expect(index).toBeGreaterThanOrEqual(0)
    const handle = timeout.mock.results[index]?.value
    wrapper.unmount()
    wrappers.pop()
    expect(clear).toHaveBeenCalledWith(handle)
    await vi.advanceTimersByTimeAsync(1000)
  })

  it('上次查询参数在下一次查询前保持不变', async () => {
    const wrapper = mountPage(Search)
    await settle()
    const form = wrapper.findComponent(ProSearchForm)
    const model = form.props('model')!
    model.keyword = '第一次'
    await nextTick()
    expect(await form.vm.search()).toBe(true)
    await settle()
    const previous = JSON.parse(wrapper.find('pre').text())
    expect(previous.lastSearchParams.keyword).toBe('第一次')

    model.keyword = '第二次'
    await settle()
    const pending = JSON.parse(wrapper.find('pre').text())
    expect(pending.model.keyword).toBe('第二次')
    expect(pending.lastSearchParams.keyword).toBe('第一次')
    expect(pending.searchCount).toBe(previous.searchCount)

    await vi.advanceTimersByTimeAsync(300)
    await settle()
    expect(
      JSON.parse(wrapper.find('pre').text()).lastSearchParams.keyword,
    ).toBe('第二次')
  })

  it('TSX 字段保留输入绑定与单选插槽', async () => {
    const wrapper = mountPage(Form)
    await settle()
    const model = wrapper.findComponent(ProForm).props('model')!
    await wrapper.find('textarea').setValue('TSX 输入')
    expect(model.remark).toBe('TSX 输入')
    expect(
      wrapper.findAllComponents(ElRadio).map((radio) => radio.props('value')),
    ).toEqual(['enabled', 'disabled'])
  })

  it('显隐判断不修改模型，状态切换后由 watch 清空日期', async () => {
    const wrapper = mountPage(Form)
    await settle()
    const form = wrapper.findComponent(ProForm)
    const model = form.props('model')!
    const field = form
      .props('fields')!
      .find((field) => field.prop === 'enableTime')!
    model.enableTime = '2026-10-23'
    await settle()
    const otherModel = { status: 'disabled', enableTime: 'unchanged' }
    expect(typeof field.hidden).toBe('function')
    if (typeof field.hidden !== 'function')
      throw new Error('Missing hidden predicate')
    expect(field.hidden(otherModel, field)).toBe(true)
    expect(model.enableTime).toBe('2026-10-23')
    expect(otherModel.enableTime).toBe('unchanged')

    model.status = 'disabled'
    await settle()
    expect(model.enableTime).toBe('')
  })
})
