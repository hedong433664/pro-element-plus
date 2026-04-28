import { formProps, rowProps } from 'element-plus'
import {
  provide,
  type InjectionKey,
  type Component,
  type PropType,
  type VNodeChild,
} from 'vue'
import type {
  CheckboxGroupInstance,
  CheckboxInstance,
  DatePickerInstance,
  FormInstance,
  FormItemProp,
  FormItemProps,
  FormProps,
  InputInstance,
  InputNumberInstance,
  InputTagInstance,
  RadioGroupInstance,
  RadioInstance,
  RowProps,
  SelectInstance,
  SwitchInstance,
  TimePickerDefaultProps,
  TimeSelectInstance,
} from 'element-plus'

import type { ProColProps } from '../../col/src/types'

export interface ProFormBuiltinComponentTypeMap {
  ElInput: {
    props: InputInstance['$props']
    slots: InputInstance['$slots']
  }
  ElInputNumber: {
    props: InputNumberInstance['$props']
    slots: InputNumberInstance['$slots']
  }
  ElInputTag: {
    props: InputTagInstance['$props']
    slots: InputTagInstance['$slots']
  }
  ElDatePicker: {
    props: DatePickerInstance['$props']
    slots: DatePickerInstance['$slots']
  }
  ElTimePicker: {
    props: TimePickerDefaultProps
    slots: DatePickerInstance['$slots']
  }
  ElTimeSelect: {
    props: TimeSelectInstance['$props']
    slots: TimeSelectInstance['$slots']
  }
  ElCheckbox: {
    props: CheckboxInstance['$props']
    slots: CheckboxInstance['$slots']
  }
  ElCheckboxGroup: {
    props: CheckboxGroupInstance['$props']
    slots: CheckboxGroupInstance['$slots']
  }
  ElRadio: {
    props: RadioInstance['$props']
    slots: RadioInstance['$slots']
  }
  ElRadioGroup: {
    props: RadioGroupInstance['$props']
    slots: RadioGroupInstance['$slots']
  }
  ElSelect: {
    props: SelectInstance['$props']
    slots: SelectInstance['$slots']
  }
  ElSwitch: {
    props: SwitchInstance['$props']
    slots: SwitchInstance['$slots']
  }
}

/**
 * 用户可通过 declaration merging 扩展额外组件类型。
 *
 * ```ts
 * declare module '@coderhd/pro-element-plus' {
 *   interface ProFormComponentTypeMap {
 *     MySelect: {
 *       props: InstanceType<typeof MySelect>['$props']
 *       slots: InstanceType<typeof MySelect>['$slots']
 *     }
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ProFormComponentTypeMap extends ProFormBuiltinComponentTypeMap {}

export type ProFormComponentName = keyof ProFormComponentTypeMap

export type ProFormComponentProps<TName extends ProFormComponentName> =
  ProFormComponentTypeMap[TName]['props']

export type ProFormComponentRawSlots<TName extends ProFormComponentName> =
  ProFormComponentTypeMap[TName]['slots']

export interface ProFormFieldBase<
  TModel extends Record<string, any> = Record<string, any>,
> extends Partial<FormItemProps> {
  key?: string | number
  colProps?: ProColProps
  isNewLine?: boolean
  hidden?: boolean | ((model: TModel, field: ProFormField<TModel>) => boolean)
}

export interface ProFormFieldContext<
  TModel extends Record<string, any> = Record<string, any>,
  TField extends ProFormField<TModel> = ProFormField<TModel>,
> {
  model: TModel
  field: TField
  value: unknown
  setValue: (value: unknown) => void
}

export type ProFormFieldRender<
  TModel extends Record<string, any> = Record<string, any>,
  TField extends ProFormField<TModel> = ProFormField<TModel>,
> = (context: ProFormFieldContext<TModel, TField>) => VNodeChild

export type ProFormComponentSlot<TSlot> = TSlot extends (...args: any[]) => any
  ? (...args: any[]) => VNodeChild
  : never

export type ProFormComponentSlots<TName extends ProFormComponentName> = {
  [K in keyof ProFormComponentRawSlots<TName>]?: ProFormComponentSlot<
    NonNullable<ProFormComponentRawSlots<TName>[K]>
  >
}

export type ProFormFieldByComponentName<
  TName extends ProFormComponentName,
  TModel extends Record<string, any> = Record<string, any>,
> = ProFormFieldBase<TModel> & {
  component: TName
  componentProps?: ProFormComponentProps<TName>
  componentSlots?: ProFormComponentSlots<TName>
  render?: never
  slotName?: never
}

export type ProFormFieldByComponentNameUnion<
  TModel extends Record<string, any> = Record<string, any>,
> = {
  [K in ProFormComponentName]: ProFormFieldByComponentName<K, TModel>
}[ProFormComponentName]

export type ProFormFieldByComponent<
  TModel extends Record<string, any> = Record<string, any>,
> = ProFormFieldBase<TModel> & {
  component: Component
  componentProps?: Record<string, any>
  componentSlots?: Record<string, (...args: any[]) => VNodeChild>
  render?: never
  slotName?: never
}

export type ProFormFieldByRender<
  TModel extends Record<string, any> = Record<string, any>,
> = ProFormFieldBase<TModel> & {
  render: ProFormFieldRender<TModel>
  component?: never
  componentProps?: never
  componentSlots?: never
  slotName?: never
}

export type ProFormFieldBySlot<
  TModel extends Record<string, any> = Record<string, any>,
> = ProFormFieldBase<TModel> & {
  slotName: string
  component?: never
  componentProps?: never
  componentSlots?: never
  render?: never
}

export type ProFormField<
  TModel extends Record<string, any> = Record<string, any>,
> =
  | ProFormFieldByComponentNameUnion<TModel>
  | ProFormFieldByComponent<TModel>
  | ProFormFieldByRender<TModel>
  | ProFormFieldBySlot<TModel>

export type ProFormFields<
  TModel extends Record<string, any> = Record<string, any>,
> = ProFormField<TModel>[]

export type ProFormInjectedComponents = Record<string, Component>

export const proFormComponentsKey: InjectionKey<ProFormInjectedComponents> =
  Symbol.for('pro-form-components')

export const provideProFormComponents = (
  components: ProFormInjectedComponents,
) => {
  provide(proFormComponentsKey, components)
  return components
}

export interface ProFormSlots {
  default?: () => VNodeChild
  [slotName: string]: (() => VNodeChild) | undefined
}

export const proFormProps = {
  fields: {
    type: Array as PropType<ProFormFields<any>>,
    default: () => [],
  },
  ...formProps,
  ...rowProps,
} as const

export type ProFormProps<
  TModel extends Record<string, any> = Record<string, any>,
> = Partial<FormProps> &
  Partial<RowProps> & {
    fields?: ProFormFields<TModel>
  }

export type ProFormPublicProps = ProFormProps<any>

export interface ProFormEmits {
  (
    event: 'validate',
    prop: FormItemProp,
    isValid: boolean,
    message: string,
  ): void
}

export interface ProFormInstance {
  getInstance: () => FormInstance | null
  validate: FormInstance['validate']
  validateField: FormInstance['validateField']
  resetFields: FormInstance['resetFields']
  scrollToField: FormInstance['scrollToField']
  clearValidate: FormInstance['clearValidate']
  fields: FormInstance['fields']
  getField: FormInstance['getField']
}
