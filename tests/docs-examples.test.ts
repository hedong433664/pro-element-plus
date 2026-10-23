import { flushPromises, mount } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import type { Component } from 'vue'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ColBase from '../packages/docs/components/ProCol/base.vue'
import ColGroup from '../packages/docs/components/ProCol/group.vue'
import FormBase from '../packages/docs/components/ProForm/base.vue'
import SearchBase from '../packages/docs/components/ProSearchForm/base.vue'
import HeaderBase from '../packages/docs/components/ProHeader/base.vue'
import TableBase from '../packages/docs/components/ProTable/base.vue'
import TableGroup from '../packages/docs/components/ProTable/group-header.vue'
import TablePagination from '../packages/docs/components/ProTable/pagination.vue'

const demos: { name: string; component: Component }[] = [
  { name: '栅格基础布局', component: ColBase },
  { name: '栅格自由组合', component: ColGroup },
  { name: '配置式表单', component: FormBase },
  { name: '查询表单', component: SearchBase },
  { name: '标题组件', component: HeaderBase },
  { name: '基础表格', component: TableBase },
  { name: '分组表头', component: TableGroup },
  { name: '服务端分页', component: TablePagination },
]

afterEach(() => {
  ElMessage.closeAll()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('文档示例无需文档主题的全局组件注册', () => {
  it.each(demos)('$name', async ({ component }) => {
    vi.useFakeTimers()
    const warn = vi.spyOn(console, 'warn')
    const wrapper = mount(component)
    try {
      await nextTick()
      await flushPromises()
      expect(wrapper.text().length).toBeGreaterThan(0)
      const unresolved = warn.mock.calls.filter((args) =>
        /Failed to resolve (component|directive)/.test(String(args[0])),
      )
      expect(unresolved).toEqual([])
    } finally {
      wrapper.unmount()
    }
  })
})
