import { flushPromises, mount } from '@vue/test-utils'
import {
  ElDatePicker,
  ElInput,
  ElPagination,
  ElProgress,
  ElSelect,
} from 'element-plus'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  ProHeader,
  ProSearchForm,
  ProSearchTable,
} from '@coderhd/pro-element-plus'
import AppSearchTable from '../packages/app/src/views/ProSearchTable/index.vue'
import PlaySearchTable from '../packages/play/src/views/ProSearchTable/index.vue'

const settle = async () => {
  await nextTick()
  await flushPromises()
  await vi.advanceTimersByTimeAsync(250)
  await flushPromises()
}

afterEach(() => {
  vi.useRealTimers()
})

describe('app 和 play 的查询表格示例', () => {
  it.each([
    { name: 'app', component: AppSearchTable },
    { name: 'play', component: PlaySearchTable },
  ])(
    '$name 展示五种用法，支持翻页、查询和多选',
    async ({ component }) => {
      vi.useFakeTimers()
      const warn = vi.spyOn(console, 'warn')
      const wrapper = mount(component, {
        global: { components: { ProHeader, ProSearchTable } },
      })
      try {
        await settle()
        const tables = wrapper.findAllComponents(ProSearchTable)
        expect(tables).toHaveLength(5)
        expect(wrapper.text()).toContain('插槽用法')
        expect(wrapper.text()).toContain('说明.md')
        expect(tables[2]!.findComponent(ElPagination).exists()).toBe(false)
        expect(tables[4]!.findComponent(ElPagination).exists()).toBe(false)

        const base = tables[0]!
        expect(base.text()).toContain('用户 1')
        expect(base.text()).toContain('邮箱')
        expect(base.text()).toContain('评分')
        const progressColors = base
          .findAllComponents(ElProgress)
          .map((progress) => progress.props('color'))
        expect(progressColors).toContain('var(--el-color-primary)')
        expect(progressColors).toContain('var(--el-color-success)')
        expect(
          progressColors.every((color) =>
            /^var\(--el-color-(primary|success)\)$/.test(String(color)),
          ),
        ).toBe(true)
        expect(
          base.findComponent(ProSearchForm).findAllComponents(ElSelect),
        ).toHaveLength(3)
        expect(base.findComponent(ElDatePicker).exists()).toBe(true)
        expect(base.props('autoSearch')).toBe(true)
        expect(
          base
            .props('fields')!
            .every(
              (field) =>
                field.colProps?.span ===
                (field.prop === 'createdAtRange' ? 8 : 6),
            ),
        ).toBe(true)
        expect(
          tables.slice(1).every((table) => table.props('autoSearch') === false),
        ).toBe(true)
        base.findComponent(ElPagination).vm.$emit('update:current-page', 2)
        await settle()
        expect(base.text()).toContain('用户 11')
        await base.findComponent(ElInput).setValue('用户 12')
        expect(base.findComponent(ElPagination).props('currentPage')).toBe(2)
        await vi.advanceTimersByTimeAsync(300)
        await settle()
        expect(base.findComponent(ElPagination).props('currentPage')).toBe(1)
        expect(base.findComponent(ElPagination).props('total')).toBe(1)
        expect(base.text()).toContain('用户 12')

        const selection = tables[3]!
        await selection.find('tbody input[type="checkbox"]').setValue(true)
        expect(selection.text()).toContain('已选 1 项')
        for (const table of tables) {
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

        expect(
          warn.mock.calls.filter((args) =>
            /Failed to resolve (component|directive)/.test(String(args[0])),
          ),
        ).toEqual([])
      } finally {
        wrapper.unmount()
      }
    },
    20000,
  )
})
