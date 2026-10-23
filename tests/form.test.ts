import { mount } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ProForm, type ProFormFieldContext } from '../packages/components/form'

const Input = defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup:
    (props, { emit }) =>
    () =>
      h('input', {
        value: props.modelValue,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).value),
      }),
})

describe('ProForm', () => {
  it.each([
    { fields: [] },
    { fields: [{ prop: 'name', hidden: true, component: Input }] },
  ])(
    'renders its action slot even without visible fields (%j)',
    ({ fields }) => {
      const wrapper = mount(ProForm, {
        props: { model: { name: '' }, fields },
        slots: { default: () => h('button', 'Save') },
      })
      expect(wrapper.find('button').text()).toBe('Save')
      wrapper.unmount()
    },
  )
  it('updates nested models and composes external update listeners', async () => {
    const model = reactive({ user: { name: '' } })
    const listener = vi.fn()
    const wrapper = mount(ProForm, {
      props: {
        model,
        fields: [
          {
            prop: 'user.name',
            component: Input,
            componentProps: {
              'onUpdate:modelValue': [listener],
            },
          },
        ],
      },
    })
    await wrapper.find('input').setValue('Alice')
    expect(model.user.name).toBe('Alice')
    expect(listener).toHaveBeenCalledExactlyOnceWith('Alice')
    wrapper.unmount()
  })
  it('provides the same field context to template slots', async () => {
    const model = reactive({ name: 'Alice' })
    let context: ProFormFieldContext | undefined
    const wrapper = mount(ProForm, {
      props: { model, fields: [{ prop: 'name', slotName: 'name' }] },
      slots: {
        name: (scope: ProFormFieldContext) => {
          context = scope
          return h('span', String(scope.value))
        },
      },
    })
    expect(wrapper.text()).toContain('Alice')
    context?.setValue('Bob')
    await wrapper.vm.$nextTick()
    expect(model.name).toBe('Bob')
    wrapper.unmount()
  })
  it('supports custom model prop and event protocols', async () => {
    const Toggle = defineComponent({
      props: ['checked'],
      emits: ['change'],
      setup:
        (props, { emit }) =>
        () =>
          h(
            'button',
            {
              onClick: () => emit('change', !props.checked),
            },
            String(props.checked),
          ),
    })
    const model = reactive({ enabled: false })
    const listener = vi.fn()
    const wrapper = mount(ProForm, {
      props: {
        model,
        fields: [
          {
            prop: 'enabled',
            component: Toggle,
            modelProp: 'checked',
            modelEvent: 'change',
            componentProps: { onChange: listener },
          },
        ],
      },
    })
    await wrapper.find('button').trigger('click')
    expect(model.enabled).toBe(true)
    expect(listener).toHaveBeenCalledExactlyOnceWith(true)
    wrapper.unmount()
  })
})
