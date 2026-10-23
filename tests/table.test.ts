import { flushPromises, mount } from '@vue/test-utils'
import { ElPagination, ElTable } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import { ProTable } from '../packages/components/table'

describe('ProTable', () => {
  it('forwards native attributes and events without importing private table props', async () => {
    const onRowClick = vi.fn()
    const wrapper = mount(ProTable, {
      props: {
        data: [{ id: 1, name: 'Alice' }],
        columns: [{ prop: 'name', label: 'Name' }],
        hidePagination: true,
      },
      attrs: { border: true, rowKey: 'id', onRowClick },
    })
    await flushPromises()
    const table = wrapper.findComponent(ElTable)
    expect(table.props('border')).toBe(true)
    expect(table.props('rowKey')).toBe('id')
    table.vm.$emit('row-click', { id: 1 }, {}, new MouseEvent('click'))
    expect(onRowClick).toHaveBeenCalledOnce()
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.vm.getInstance()).toBeTruthy()
    expect(wrapper.vm.getSelectionRows()).toEqual([])
    wrapper.unmount()
  })
  it('synchronizes controlled pagination and emits the public pagination contract', async () => {
    const wrapper = mount(ProTable, {
      props: {
        data: [],
        columns: [],
        total: 100,
        currentPage: 2,
        pageSize: 10,
      },
    })
    const pagination = wrapper.findComponent(ElPagination)
    pagination.vm.$emit('update:current-page', 3)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:currentPage')).toEqual([[3]])
    expect(wrapper.emitted('pagination')).toEqual([[3, 10]])
    await wrapper.setProps({ currentPage: 4, pageSize: 20 })
    expect(pagination.props('currentPage')).toBe(4)
    expect(pagination.props('pageSize')).toBe(20)
    pagination.vm.$emit('update:page-size', 50)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:pageSize')).toEqual([[50]])
    expect(wrapper.emitted('pagination')).toHaveLength(2)
    expect(wrapper.emitted('pagination')?.at(-1)).toEqual([2, 50])
    wrapper.unmount()
  })
  it('renders named cell slots and reacts to hidden column changes', async () => {
    const wrapper = mount(ProTable, {
      props: {
        data: [{ name: 'Alice' }],
        columns: [
          { prop: 'name', label: 'Name', slotNames: { default: 'name' } },
        ],
        hidePagination: true,
      },
      slots: {
        name: ({ row }: { row: { name: string } }) => `User: ${row.name}`,
      },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('User: Alice')
    await wrapper.setProps({
      columns: [{ prop: 'name', label: 'Name', hidden: true }],
    })
    await flushPromises()
    expect(wrapper.text()).not.toContain('Alice')
    wrapper.unmount()
  })
})
