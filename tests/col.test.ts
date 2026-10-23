import { mount } from '@vue/test-utils'
import { ElRow } from 'element-plus'
import { defineComponent, h, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { ProCol } from '../packages/components/col'

describe('ProCol', () => {
  it('preserves numeric and zero-valued breakpoints', () => {
    const wrapper = mount(ProCol, { props: { span: 6, xs: 8, sm: 0 } })
    expect(wrapper.classes()).toContain('el-col-xs-8')
    expect(wrapper.classes()).toContain('el-col-sm-0')
    wrapper.unmount()
  })
  it('preserves span=0', () => {
    const wrapper = mount(ProCol, { props: { span: 0 } })
    expect(wrapper.classes()).toContain('el-col-0')
    wrapper.unmount()
  })
  it('responds to grid, full and layout prop updates', async () => {
    const wrapper = mount(ProCol, { props: { span: 6, offset: 1 } })
    await wrapper.setProps({ offset: 3 })
    expect(wrapper.classes()).toContain('el-col-offset-3')
    await wrapper.setProps({ useGrid: false, full: true })
    expect(wrapper.classes()).toContain('pro-col__full')
    expect(wrapper.classes()).not.toContain('el-col')
    await wrapper.setProps({ full: false })
    expect(wrapper.classes()).not.toContain('pro-col__full')
    wrapper.unmount()
  })
  it('tracks the nearest row gutter through its public context', async () => {
    const gutter = ref(16)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            ElRow,
            { gutter: gutter.value },
            {
              default: () => h(ProCol, { useGrid: false }),
            },
          ),
      }),
    )
    expect(wrapper.find('.pro-col__not-grid').attributes('style')).toContain(
      'padding-left: 8px',
    )
    gutter.value = 24
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.pro-col__not-grid').attributes('style')).toContain(
      'padding-left: 12px',
    )
    wrapper.unmount()
  })
})
