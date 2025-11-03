---
title: ProForm
description: ProForm 组件文档

prev:
  link: /components/ProHeader/
  text: 标题组件（ProHeader）

next:
  link: /components/ProSearchFor/
  text: 查询表单（ProSearchForm）
---

# ProForm 表单

## 基础用法

::: preview
demo-preview=../../components/ProForm/index.vue
:::

## Attributes

> ProForm属性完全继承ElForm，更多属性参考[ElementPlus Form Attributes](https://element-plus.org/zh-CN/component/form#form-attributes)

| 属性名  | 类型            | 默认值 | 说明                                                                                             |
| ------- | --------------- | ------ | ------------------------------------------------------------------------------------------------ |
| fields  | `ProFormFields` | []     | 表单项                                                                                           |
| gutter  | `number`        | 0      | 参考[ElementPlus Row Attributes](https://element-plus.org/zh-CN/component/layout#row-attributes) |
| justify | `enum`          | start  | 参考[ElementPlus Row Attributes](https://element-plus.org/zh-CN/component/layout#row-attributes) |
| align   | `enum`          | ——     | 参考[ElementPlus Row Attributes](https://element-plus.org/zh-CN/component/layout#row-attributes) |
| tag     | `string`        | div    | 参考[ElementPlus Row Attributes](https://element-plus.org/zh-CN/component/layout#row-attributes) |

## Slots

| 插槽名  | 说明     |
| ------- | -------- |
| default | 默认插槽 |

## Exposes

> 更多实例方法参考[ElementPlus Form Methods](https://element-plus.org/zh-CN/component/form#form-methods)

<details>
  <summary>类型定义</summary>

```ts
import type { ProColProps } from '../../col/src/types'
import type {
  FormProps,
  FormItemProps,
  TimePickerDefaultProps,
  RowProps,
  InputInstance,
  InputNumberInstance,
  InputTagInstance,
  DatePickerInstance,
  TimeSelectInstance,
  CheckboxInstance,
  CheckboxGroupInstance,
  RadioInstance,
  RadioGroupInstance,
  SelectInstance,
  SwitchInstance,
  FormItemProp,
} from 'element-plus'
import type { VNodeChild } from 'vue'

export interface ComponentNamesMap {
  ElInput: 'ElInput'
  ElInputNumber: 'ElInputNumber'
  ElInputTag: 'ElInputTag'
  ElDatePicker: 'ElDatePicker'
  ElTimePicker: 'ElTimePicker'
  ElTimeSelect: 'ElTimeSelect'
  ElCheckbox: 'ElCheckbox'
  ElCheckboxGroup: 'ElCheckboxGroup'
  ElRadio: 'ElRadio'
  ElRadioGroup: 'ElRadioGroup'
  ElSelect: 'ElSelect'
  ElSwitch: 'ElSwitch'
}

export interface ComponentPropsMap {
  ElInput: InputInstance['$props']
  ElInputNumber: InputNumberInstance['$props']
  ElInputTag: InputTagInstance['$props']
  ElDatePicker: DatePickerInstance['$props']
  ElTimePicker: TimePickerDefaultProps
  ElTimeSelect: TimeSelectInstance['$props']
  ElCheckbox: CheckboxInstance['$props']
  ElCheckboxGroup: CheckboxGroupInstance['$props']
  ElRadio: RadioInstance['$props']
  ElRadioGroup: RadioGroupInstance['$props']
  ElSelect: SelectInstance['$props']
  ElSwitch: SwitchInstance['$props']
}

export interface ComponentSlotsMap {
  ElInput: InputInstance['$slots']
  ElInputNumber: InputNumberInstance['$slots']
  ElInputTag: InputTagInstance['$slots']
  ElDatePicker: DatePickerInstance['$slots']
  ElTimePicker: DatePickerInstance['$slots']
  ElTimeSelect: TimeSelectInstance['$slots']
  ElCheckbox: CheckboxInstance['$slots']
  ElCheckboxGroup: CheckboxGroupInstance['$slots']
  ElRadio: RadioInstance['$slots']
  ElRadioGroup: RadioGroupInstance['$slots']
  ElSelect: SelectInstance['$slots']
  ElSwitch: SwitchInstance['$slots']
}

/**
 * 内置如下组件`Props` `Slots`类型:
 * - `ElInput`
 * - `ElInputNumber`
 * - `ElInputTag`
 * - `ElDatePicker`
 * - `ElTimePicker`
 * - `ElTimeSelect`
 * - `ElCheckbox`
 * - `ElCheckboxGroup`
 * - `ElRadio`
 * - `ElRadioGroup`
 * - `ElSelect`
 * - `ElSwitch`
 */
export type ProFormField<
  T extends keyof ComponentNamesMap = keyof ComponentNamesMap,
> = Partial<FormItemProps> & {
  /**
   * 组件名称
   */
  component?: T
  /**
   * 组件属性
   */
  componentProps?: ComponentPropsMap[T]
  /**
   * 组件插槽
   */
  componentSlots?: ComponentSlotsMap[T]
  /**
   * 栅格布局
   * @default 24
   */
  colProps?: ProColProps
  /**
   * 是否独占一行
   * @default false
   */
  isNewLine?: boolean
  /**
   * 是否隐藏表单项
   * @default false
   */
  hidden?: (model?: Record<string, any>) => boolean | boolean
  /**
   * 自定义渲染
   */
  render?: () => VNodeChild | VNodeChild
}

export type ProFormFields = {
  [K in keyof ComponentNamesMap]: ProFormField<K>
}[keyof ComponentNamesMap][]

export type ProFormProps = Partial<FormProps> &
  Partial<RowProps> & {
    /**
     * 表单项
     */
    fields?: ProFormFields
  }

export type ProFormEmits = {
  (e: 'validate', prop: FormItemProp, isValid: boolean, message: string): void
}
```

</details>

<details>
  <summary>扩展类型</summary>

```ts
// types/pro-form.d.ts
import type {
  ComponentNamesMap,
  ComponentPropsMap,
  ComponentSlotsMap,
} from 'pro-element-plus'

import type { ButtonInstance } from 'element-plus'

declare module 'pro-element-plus' {
  // 扩展 ElButton 的类型
  export interface ComponentNamesMap {
    ElButton: 'ElButton'
  }
  export interface ComponentPropsMap {
    ElButton: ButtonInstance['$props']
  }
  export interface ComponentSlotsMap {
    ElButton: ButtonInstance['$slots']
  }
}
```

</details>
