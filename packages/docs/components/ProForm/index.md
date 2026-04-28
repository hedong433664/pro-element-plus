---
title: ProForm
description: 基于 el-form、el-row 与 ProCol 的配置式表单组件
prev:
  link: /components/ProCol/index.md
  text: ProCol
next:
  link: /components/ProHeader/index.md
  text: ProHeader
---

# ProForm

`ProForm` 基于 `el-form` 封装，保留原生表单能力，并通过 `fields` 与 `ProCol` 快速构建配置式栅格表单。

## 基础用法

表单项可以通过 `component`、`render` 或 `slotName` 三种方式描述，并支持：

- `componentProps`
- `componentSlots`
- `colProps`
- `hidden`
- `isNewLine`

::: preview
demo-preview=../../components/ProForm/base.vue
:::

## 组件解析

`component` 支持两种写法：

- 直接传组件对象
- 传字符串组件名

当你使用字符串组件名时，`ProForm` 会优先从注入表中查找组件，再回退到全局注册组件。

组件树内部可使用：

```ts
import { ElInput, ElSelect } from 'element-plus'
import { provideProFormComponents } from '@coderhd/pro-element-plus'

provideProFormComponents({
  ElInput,
  ElSelect,
})
```

如果要在 `main.ts` 里统一注入，则直接使用：

```ts
import { createApp } from 'vue'
import { ElInput, ElSelect } from 'element-plus'
import App from './App.vue'
import { proFormComponentsKey } from '@coderhd/pro-element-plus'

const app = createApp(App)

app.provide(proFormComponentsKey, {
  ElInput,
  ElSelect,
})
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `fields` | 表单项配置数组 | `ProFormField[]` | `[]` |
| `...el-form props` | 完整透传 `el-form` 原生属性 | - | - |
| `gutter / justify / align / tag` | 透传给内部 `el-row` 的布局属性 | `RowProps` | `el-row` 默认值 |

### ProFormField

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `component` | 组件对象或字符串组件名 | `Component \| keyof ProFormComponentTypeMap` |
| `componentProps` | 传给子组件的 props | `Record<string, any>` |
| `componentSlots` | 子组件原生插槽 | `Record<string, (...args: any[]) => VNodeChild>` |
| `render` | 自定义渲染函数 | `(context) => VNodeChild` |
| `slotName` | 普通具名插槽名 | `string` |
| `colProps` | 透传给 `ProCol` 的布局配置 | `ProColProps` |
| `hidden` | 控制字段显隐 | `boolean \| ((model, field) => boolean)` |
| `isNewLine` | 是否强制从新一行开始 | `boolean` |
| `...el-form-item props` | 原生 `el-form-item` 属性 | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `validate` | 透传 `el-form` 的 `validate` 事件 | `(prop, isValid, message) => void` |

### Exposes

`ProForm` 对外暴露了常用的 `el-form` 实例方法：

- `getInstance`
- `validate`
- `validateField`
- `resetFields`
- `scrollToField`
- `clearValidate`
- `fields`
- `getField`

## 类型扩展

`ProForm` 内置了一批常用组件的类型提示，例如：

- `ElInput`
- `ElInputNumber`
- `ElDatePicker`
- `ElTimePicker`
- `ElCheckbox`
- `ElRadioGroup`
- `ElSelect`
- `ElSwitch`

如果你有自己的业务组件，也可以通过 declaration merging 扩展：

```ts
declare module '@coderhd/pro-element-plus' {
  interface ProFormComponentTypeMap {
    UserSelect: {
      props: InstanceType<typeof UserSelect>['$props']
      slots: InstanceType<typeof UserSelect>['$slots']
    }
  }
}
```
