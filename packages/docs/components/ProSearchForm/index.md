---
title: ProSearchForm 查询表单
description: 基于 ProForm 的查询表单组件
prev:
  link: /components/ProForm/index.md
  text: ProForm 配置式表单
next:
  link: /components/ProHeader/index.md
  text: ProHeader 标题组件
---

# ProSearchForm 查询表单

`ProSearchForm` 基于 `ProForm` 实现，使用 `fields` 配置字段，并提供：

- 查询按钮
- 重置按钮
- 折叠 / 展开
- 自动查询
- 查询表单实例方法

## 基础用法

`ProSearchForm` 仍然使用 `fields` 描述查询项，最后一行会自动补上操作区。默认插槽会渲染在按钮区域里，可以放置额外内容。

::: preview
demo-preview=../../components/ProSearchForm/base.vue
:::

## 接口说明

### 属性

| 属性名               | 说明                               | 类型                                                                                | 默认值             |
| -------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- | ------------------ |
| `fields`             | 查询项配置                         | `ProSearchFormFields`                                                               | `[]`               |
| `initSearch`         | 是否在挂载后独立执行初始化查询     | `boolean`                                                                           | `true`             |
| `autoSearch`         | 是否在 `model` 变化后自动查询      | `boolean`                                                                           | `true`             |
| `autoSearchDebounce` | 自动查询、查询及重置请求的防抖时间 | `number`                                                                            | `300`              |
| `resetAfterSearch`   | 重置后是否自动执行查询             | `boolean`                                                                           | `true`             |
| `buttonJustify`      | 按钮区对齐方式                     | `flex-start \| flex-end \| center \| space-between \| space-around \| space-evenly` | `flex-end`         |
| `hideSearchButton`   | 是否隐藏查询按钮                   | `boolean`                                                                           | `false`            |
| `hideResetButton`    | 是否隐藏重置按钮                   | `boolean`                                                                           | `false`            |
| `hideCollapseButton` | 是否隐藏折叠按钮                   | `boolean`                                                                           | `false`            |
| `defaultCollapsed`   | 是否默认折叠                       | `boolean`                                                                           | `false`            |
| `collapsedCount`     | 折叠时保留的可见字段数             | `number`                                                                            | `1`                |
| `resetButtonText`    | 重置按钮文本                       | `string`                                                                            | `重置`             |
| `searchButtonText`   | 查询按钮文本                       | `string`                                                                            | `查询`             |
| `collapseButtonText` | 折叠按钮文本                       | `[string, string]`                                                                  | `['展开', '收起']` |
| 其他表单属性         | 传给 `ProForm` 的表单与布局属性    | -                                                                                   | -                  |

### 事件

| 事件名      | 说明                                        | 回调参数                                 |
| ----------- | ------------------------------------------- | ---------------------------------------- |
| `search`    | 表单校验通过并发出查询时触发                | `(params?: Record<string, any>) => void` |
| `reset`     | 执行组件 `reset()` 流程时触发，包含程序调用 | `() => void`                             |
| `collapsed` | 折叠状态变化时触发                          | `(collapsed: boolean) => void`           |
| `validate`  | 继续透传 `el-form` 的 `validate` 事件       | `(prop, isValid, message) => void`       |

### 实例方法与属性

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

## 查询与折叠行为

- `initSearch` 与 `autoSearch` 独立：关闭自动查询不会关闭初始化查询。
- 查询按钮、实例 `search()`、自动查询和重置后的查询共用 `autoSearchDebounce`，默认 300ms；窗口内以最后一次操作为准，只提交一次。关闭 `autoSearch` 仅关闭输入变化触发的查询，不影响按钮和实例方法。
- 初始化查询不等待防抖，挂载后直接校验提交。重置立即恢复字段，随后按 `resetAfterSearch` 决定是否排入防抖查询。卸载会取消队列；关闭自动查询只取消尚未完成的自动查询。
- 折叠仅隐藏布局，不卸载字段，因此折叠字段仍参与校验与重置。隐藏计数只考虑可见字段。
- `reset()` 恢复字段初始值，是否随后查询由 `resetAfterSearch` 控制，不会额外触发重复的自动查询。
- `search()` 返回 `Promise<boolean>`；被后续操作替换、校验失败或卸载时返回 `false`。`reset()` 返回 `Promise<void>`，等待重置及可选的查询结束。
- `search` 事件传递当前模型引用，而不是模型快照。

设置 `:auto-search="false"` 可关闭模型变化后的自动查询，默认值为 `true`。

## 程序调用与插槽

| 方法                   | 行为                                                             | 返回值                        |
| ---------------------- | ---------------------------------------------------------------- | ----------------------------- |
| `search()`             | 防抖后校验；仅通过且结果未过期时发出 `search`                    | `Promise<boolean>`            |
| `reset()`              | 恢复字段初始值并发出 `reset`；按 `resetAfterSearch` 决定是否查询 | `Promise<void>`               |
| `resetFields(...args)` | 只调用原生字段重置，不主动发出 `reset` 或执行查询流程            | 与 `ProForm.resetFields` 一致 |
| `toggleCollapse()`     | 切换折叠状态并发出 `collapsed`                                   | `void`                        |

单独调用 `resetFields()` 仍可能因为模型变化而触发自动查询监听；若要取消排队的查询并执行完整重置流程，请调用 `reset()`。

默认插槽位于按钮区，可以放置额外内容；字段的具名插槽继续转发 `{ model, field, value, setValue }`。继承的 `validate / validateField / clearValidate / scrollToField / getField / fields / getInstance` 与 `ProForm` 一致。

基础示例保留默认的初始化查询和自动查询：进入示例时、修改输入值时，以及点击“填充关键字”修改模型后，都可能发出查询事件。示例提示表示已触发 `search` 事件。
