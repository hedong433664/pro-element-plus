---
title: ProSearchForm
description: 基于 ProForm 的查询表单组件
prev:
  link: /components/ProForm/index.md
  text: ProForm
next:
  link: /components/ProHeader/index.md
  text: ProHeader
---

# ProSearchForm

`ProSearchForm` 基于 `ProForm` 实现，保留原有 `fields` 配置能力，并补充查询场景常用的：

- 查询按钮
- 重置按钮
- 折叠 / 展开
- 自动查询
- 查询表单实例能力透传

## 基础用法

`ProSearchForm` 仍然使用 `fields` 描述查询项，最后一行会自动补上操作区。默认插槽会渲染在按钮区域里，适合补充额外操作按钮。

::: preview
demo-preview=../../components/ProSearchForm/base.vue
:::

## API

### Props

| 属性名               | 说明                                | 类型                                                                                | 默认值             |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------- | ------------------ |
| `fields`             | 查询项配置                          | `ProSearchFormFields[]`                                                             | `[]`               |
| `initSearch`         | 是否初始化时立即触发查询监听        | `boolean`                                                                           | `true`             |
| `autoSearch`         | 是否在 `model` 变化后自动查询       | `boolean`                                                                           | `true`             |
| `autoSearchDebounce` | 自动查询防抖时间                    | `number`                                                                            | `300`              |
| `resetAfterSearch`   | 重置后是否自动执行查询              | `boolean`                                                                           | `true`             |
| `buttonJustify`      | 按钮区对齐方式                      | `flex-start \| flex-end \| center \| space-between \| space-around \| space-evenly` | `flex-start`       |
| `hideSearchButton`   | 是否隐藏查询按钮                    | `boolean`                                                                           | `false`            |
| `hideResetButton`    | 是否隐藏重置按钮                    | `boolean`                                                                           | `false`            |
| `hideCollapseButton` | 是否隐藏折叠按钮                    | `boolean`                                                                           | `false`            |
| `defaultCollapsed`   | 是否默认折叠                        | `boolean`                                                                           | `false`            |
| `collapsedCount`     | 折叠时保留的字段数                  | `number`                                                                            | `1`                |
| `resetButtonText`    | 重置按钮文本                        | `string`                                                                            | `重置`             |
| `searchButtonText`   | 查询按钮文本                        | `string`                                                                            | `查询`             |
| `collapseButtonText` | 折叠按钮文本                        | `[string, string]`                                                                  | `['展开', '收起']` |
| `...ProForm props`   | 继续透传 `ProForm` 的表单与布局能力 | -                                                                                   | -                  |

### Events

| 事件名      | 说明                                  | 回调参数                                 |
| ----------- | ------------------------------------- | ---------------------------------------- |
| `search`    | 查询成功时触发                        | `(params?: Record<string, any>) => void` |
| `reset`     | 点击重置时触发                        | `() => void`                             |
| `collapsed` | 折叠状态变化时触发                    | `(collapsed: boolean) => void`           |
| `validate`  | 继续透传 `el-form` 的 `validate` 事件 | `(prop, isValid, message) => void`       |

### Exposes

`ProSearchForm` 除了透传 `ProForm` / `el-form` 的实例方法外，还额外暴露：

- `reset`
- `search`
- `toggleCollapse`

同时继续可用：

- `getInstance`
- `validate`
- `validateField`
- `resetFields`
- `scrollToField`
- `clearValidate`
- `fields`
- `getField`
