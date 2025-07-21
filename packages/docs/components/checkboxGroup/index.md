---
title: CheckboxGroup
description: CheckboxGroup 组件文档

prev:
  link: /get-started
  text: 快速开始

next:
  link: /table
  text: 表格
---

# CheckboxGroup 多选框组

配置化的多选框组。

## 基础用法

使用 options 属性配置多选框组选项。

::: preview
demo-preview=../../demo/checkboxGroup/Basic.vue
:::

## 边框样式

使用 is-border 控制多选框组边框样式。

::: preview
demo-preview=../../demo/checkboxGroup/Border.vue
:::

## 按钮样式

使用 is-button 控制多选框组按钮样式。

::: preview
demo-preview=../../demo/checkboxGroup/Button.vue
:::

## 调整尺寸

除了默认的大小，使用 size 属性额外配置尺寸，可使用 large 和 small 两种值。

::: preview
demo-preview=../../demo/checkboxGroup/Size.vue
:::

## 自定义选项

使用 labelKey、valueKey 自定义选项。

::: preview
demo-preview=../../demo/checkboxGroup/Custom.vue
:::

## 禁用

使用 disabled 或 option.disabled 控制多选框组或某个选项禁用。

::: preview
demo-preview=../../demo/checkboxGroup/Disabled.vue
:::

## 自定义颜色

使用 填充 和 文本颜色 设置按钮的样式。

::: preview
demo-preview=../../demo/checkboxGroup/Theme.vue
:::

## 包含选项

使用 include 设置包含的选项。

::: preview
demo-preview=../../demo/checkboxGroup/Include.vue
:::

## 排除选项

使用 exclude 设置排除的选项。

::: preview
demo-preview=../../demo/checkboxGroup/Exclude.vue
:::

## 使用全选

使用 use-check-all 允许全选，check-all-label 自定义全选 label。

::: preview
demo-preview=../../demo/checkboxGroup/UseCheckAll.vue
:::

## 插槽

使用插槽来自定义多选框项。

::: preview
demo-preview=../../demo/checkboxGroup/Slot.vue
:::

## CheckboxGroup Attributes

| 属性名                | 类型                 | 默认值  | 说明                                 |
| --------------------- | -------------------- | ------- | ------------------------------------ |
| model-value / v-model | `string[]\|number[]` | -       | 绑定值                               |
| value                 | `string[]\|number[]` | -       | 当前选中的值                         |
| options               | Array                | -       | 多选框组选项                         |
| is-border             | boolean              | false   | 是否显示边框                         |
| is-button             | boolean              | false   | 是否显示按钮样式                     |
| size                  | string               | default | 尺寸，可选值为 default、large、small |
| label-key             | string               | label   | 选项 label 值，用于显示              |
| value-key             | string               | value   | 选项 value 值，用于赋值              |
| disabled              | boolean              | false   | 是否禁用                             |
| include               | Array                | -       | 包含的选项                           |
| exclude               | Array                | -       | 排除的选项                           |
| use-check-all         | boolean              | false   | 是否使用全选                         |
| check-all-label       | string               | 全选    | 全选 label                           |

## CheckboxGroup Events

| 事件名 | 说明           | 回调参数                                                                    |
| ------ | -------------- | --------------------------------------------------------------------------- |
| change | 选项变化时触发 | (values: `string[]\|number[]`, options: `ProCheckboxGroupOption[]`) => void |

## CheckboxGroup Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 自定义多选框项 |
