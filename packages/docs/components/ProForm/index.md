---
title: ProForm 配置式表单
description: 基于 ElForm 的配置式表单组件
prev:
  link: /components/ProCol/index.md
  text: ProCol 栅格布局
next:
  link: /components/ProSearchForm/index.md
  text: ProSearchForm 查询表单
---

# ProForm 配置式表单

`ProForm` 基于 `ElForm`、`ElRow` 与 `ProCol`，通过 `fields` 构建配置式表单，支持原生表单属性、校验和重置。

## 基础用法

字段可以使用 `component`、`render` 或 `slotName` 三种互斥的渲染方式。下面展示组件配置、模板插槽和函数式渲染的组合用法。

::: preview
demo-preview=../../components/ProForm/base.vue
:::

## 组件解析

`component` 支持直接传组件对象，或传字符串组件名。字符串优先从注入表中解析，再回退到全局注册组件；未注册时会输出错误并跳过该组件内容。

在父组件的 `<script setup>` 或 `setup()` 中注入，供后代 `ProForm` 使用：

```ts
import { ElInput, ElSelect } from 'element-plus'
import { provideProFormComponents } from '@coderhd/pro-element-plus'

provideProFormComponents({ ElInput, ElSelect })
```

在 `main.ts` 中为应用统一注入时，使用应用的 `provide`：

```ts
import { createApp } from 'vue'
import { ElInput, ElSelect } from 'element-plus'
import { proFormComponentsKey } from '@coderhd/pro-element-plus'
import App from './App.vue'

const app = createApp(App)
app.provide(proFormComponentsKey, { ElInput, ElSelect })
app.mount('#app')
```

上面的片段只展示组件注入，组件和样式仍需按[快速开始](/get-started)接入。注入不会自动引入输入组件的样式，使用按需方案时仍需配置样式插件或手动导入。

模板自动导入不能注册字段配置里的字符串组件名。直接传 `ElInput` 等组件对象时，不需要名称解析或全局注册。

## 接口说明

### 属性

| 属性                             | 说明                                                     | 类型                         | 默认值                       |
| -------------------------------- | -------------------------------------------------------- | ---------------------------- | ---------------------------- |
| `model`                          | 表单模型，校验与字段绑定时应传入                         | `TModel`                     | 无                           |
| `fields`                         | 表单项配置数组                                           | `ProFormFields<TModel>`      | `[]`                         |
| `gutter / justify / align / tag` | 传给内部 `ElRow` 的布局属性                              | `RowProps` 中对应属性的类型  | `ElRow` 默认值               |
| 其他表单属性                     | 传给内部 `ElForm`，例如 `rules / label-width / disabled` | `FormProps` 中对应属性的类型 | 以内部组件及本组件默认值为准 |

本组件默认 `labelPosition='right'`、`requireAsteriskPosition='left'`、`showMessage=true`、`validateOnRuleChange=true`、`scrollIntoViewOptions=true`。

### 字段配置（ProFormField）

| 字段             | 说明                                               | 类型                                                   |
| ---------------- | -------------------------------------------------- | ------------------------------------------------------ |
| `prop`           | 模型字段路径，泛型配置会检查点分路径               | `FieldPath<TModel> \| string[]`                        |
| `key`            | 稳定的字段标识                                     | `string \| number`                                     |
| `component`      | 组件对象或已注册的字符串组件名                     | `Component \| keyof ProFormComponentTypeMap`           |
| `componentProps` | 组件属性；使用内置字符串名称时提供对应属性提示     | 对应组件属性或 `Record<string, any>`                   |
| `componentSlots` | 组件内部插槽                                       | 对应组件插槽或插槽函数映射                             |
| `render`         | 自定义渲染函数                                     | `(context: ProFormFieldContext<TModel>) => VNodeChild` |
| `slotName`       | 外层模板中的具名插槽名                             | `string`                                               |
| `colProps`       | 传给 `ProCol` 的布局配置                           | `ProColProps`                                          |
| `hidden`         | 隐藏并卸载字段，退出字段注册                       | `boolean \| ((model, field) => boolean)`               |
| `visible`        | 仅视觉显隐，保留校验与重置                         | `boolean \| ((model, field) => boolean)`               |
| `modelProp`      | 模型属性名，默认 `modelValue`                      | `string`                                               |
| `modelEvent`     | 模型事件名，默认 `update:${modelProp}`             | `string`                                               |
| `isNewLine`      | 是否强制从新一行开始                               | `boolean`                                              |
| 其他表单项属性   | 传给 `ElFormItem`，例如 `label / rules / required` | `FormItemProps` 中对应属性的类型                       |

`component`、`render`、`slotName` 三选一。`render` 与字段插槽均能获得 `{ model, field, value, setValue }`。

模型更新事件会先修改模型，再调用配置中的外部监听器，不覆盖外部监听器。自定义 `modelEvent` 的第一个事件参数应是模型的新值；更复杂的参数转换可通过 `render` 或模板插槽完成。

### 自定义渲染

`render` 接收字段上下文，通过 `setValue` 更新当前字段：

```vue
<template>
  <ProForm :model="model" :fields="fields" />
</template>

<script setup lang="tsx">
import { reactive } from 'vue'
import { ElInput } from 'element-plus'
import { ProForm, type ProFormFields } from '@coderhd/pro-element-plus'

const model = reactive({ remark: '' })
const fields: ProFormFields<typeof model> = [
  {
    prop: 'remark',
    label: '备注',
    render: ({ value, setValue }) => (
      <ElInput
        type="textarea"
        modelValue={String(value ?? '')}
        onUpdate:modelValue={setValue}
      />
    ),
  },
]
</script>
```

### 事件

| 名称       | 说明                 | 回调参数                           |
| ---------- | -------------------- | ---------------------------------- |
| `validate` | 转发原生字段校验事件 | `(prop, isValid, message) => void` |

### 插槽

| 名称              | 说明                                     | 参数                                |
| ----------------- | ---------------------------------------- | ----------------------------------- |
| `default`         | 最后一行的操作区域；没有可见字段时仍渲染 | 无                                  |
| 字段的 `slotName` | 自定义字段内容                           | `{ model, field, value, setValue }` |

字段上下文中的 `value` 类型为 `unknown`，传给具体输入组件前应按目标输入组件的要求缩小类型。下面使用原生输入框演示：

```vue
<template>
  <ProForm :model="model" :fields="fields">
    <template #name="{ value, setValue }">
      <input
        :value="String(value ?? '')"
        @input="setValue(($event.target as HTMLInputElement).value)"
      />
    </template>
  </ProForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ProForm, type ProFormFields } from '@coderhd/pro-element-plus'

const model = reactive({ name: '' })
const fields: ProFormFields<typeof model> = [{ prop: 'name', slotName: 'name' }]
</script>
```

### 实例方法与属性

| 名称                     | 说明                                                    |
| ------------------------ | ------------------------------------------------------- |
| `getInstance()`          | 获取底层 `ElForm` 实例，挂载前为 `null`                 |
| `validate(...args)`      | 校验表单，参数与原生方法一致；未通过时 Promise 可能拒绝 |
| `validateField(...args)` | 校验指定字段                                            |
| `resetFields(...args)`   | 将指定或全部已注册字段恢复为初始值                      |
| `clearValidate(...args)` | 清除校验状态                                            |
| `scrollToField(...args)` | 滚动到指定字段                                          |
| `getField(...args)`      | 获取指定字段上下文                                      |
| `fields`                 | 当前已注册的表单字段                                    |

## 显隐判断与字段联动

- `hidden` 会卸载字段，模型值不会由组件自动删除。
- `visible=false` 只隐藏布局，字段继续参与校验与重置。
- 显隐函数只返回布尔值。需要在字段变化后清空其他值时，使用独立的 `watch` 或事件处理函数，不要在显隐判断中修改模型。
- `resetFields()` 恢复字段挂载时记录的初始值，不代表无条件清空。

基础示例已经将显隐判断与清值联动分开。更多区别见[用法示例](/api-examples)。

## 类型扩展

`ProFormFields<Model>` 用于定义字段配置并检查模型路径。点分路径最多检查五层，支持 `users.0.name` 等数组索引；动态 `string[]` 路径保留原生兼容方式，不做同等的静态路径检查。

内置类型映射覆盖 `ElInput`、`ElInputNumber`、`ElInputTag`、`ElDatePicker`、`ElTimePicker`、`ElTimeSelect`、`ElCheckbox`、`ElCheckboxGroup`、`ElRadio`、`ElRadioGroup`、`ElSelect`、`ElSwitch`。类型映射不等于运行时注册，仍需注入或全局注册组件。

自定义组件可通过模块声明合并扩展。以下路径替换为实际组件文件：

```ts
import type UserSelect from './UserSelect.vue'

declare module '@coderhd/pro-element-plus' {
  interface ProFormComponentTypeMap {
    UserSelect: {
      props: InstanceType<typeof UserSelect>['$props']
      slots: InstanceType<typeof UserSelect>['$slots']
    }
  }
}
```

扩展类型后，再通过 `provideProFormComponents({ UserSelect })` 注入运行时组件。
