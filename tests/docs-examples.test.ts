import { flushPromises, mount } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import { ProSearchForm, ProSearchTable } from '@coderhd/pro-element-plus'
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

import SearchTableBase from '../packages/docs/components/ProSearchTable/base.vue'
import SearchTableSlots from '../packages/docs/components/ProSearchTable/slots.vue'
import SearchTableHidePagination from '../packages/docs/components/ProSearchTable/hide-pagination.vue'
import SearchTableSelection from '../packages/docs/components/ProSearchTable/selection.vue'
import SearchTableTree from '../packages/docs/components/ProSearchTable/tree.vue'

const demos: { name: string; component: Component }[] = [
  { name: '栅格基础布局', component: ColBase },
  { name: '栅格自由组合', component: ColGroup },
  { name: '配置式表单', component: FormBase },
  { name: '查询表单', component: SearchBase },
  { name: '标题组件', component: HeaderBase },
  { name: '基础表格', component: TableBase },
  { name: '分组表头', component: TableGroup },
  { name: '服务端分页', component: TablePagination },
  { name: '查询表格基础用法', component: SearchTableBase },
  { name: '查询表格插槽', component: SearchTableSlots },
  { name: '查询表格隐藏分页', component: SearchTableHidePagination },
  { name: '查询表格多选', component: SearchTableSelection },
  { name: '查询表格树形', component: SearchTableTree },
]

afterEach(() => {
  ElMessage.closeAll()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('文档示例无需文档主题的全局组件注册', () => {
  it.each(demos)('$name', async ({ name, component }) => {
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
      if (name.startsWith('查询表格')) {
        const table = wrapper.findComponent(ProSearchTable)
        expect(table.props('height')).toBe('320px')
        expect(table.props('size')).toBeUndefined()
        expect(table.props('collapsedCount')).toBe(1)
        const columns = table.props('columns')!
        expect(columns.find((column) => column.type === 'index')?.fixed).toBe(
          'left',
        )
        expect(
          columns.filter((column) => column.label === '操作'),
        ).toHaveLength(1)
        expect(columns.find((column) => column.label === '操作')?.fixed).toBe(
          'right',
        )
        table.vm.getSearchFormInstance()!.toggleCollapse()
        await nextTick()
        expect(
          table
            .findComponent(ProSearchForm)
            .findAll('.el-form-item')
            .filter(
              (item) => item.element.parentElement?.style.display !== 'none',
            ),
        ).toHaveLength(1)
      }
    } finally {
      wrapper.unmount()
    }
  })
})
