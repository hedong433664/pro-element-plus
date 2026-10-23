---
title: ProCol 栅格布局
description: 基于 ElCol 的响应式栅格布局组件
prev:
  link: /get-started
  text: 快速开始
next:
  link: /components/ProForm/index.md
  text: ProForm 配置式表单
---

# ProCol 栅格布局

`ProCol` 支持栅格布局和非栅格布局，应放在 Element Plus 的 `ElRow` 中，以使用其布局和 `gutter` 间距上下文。

## 基础用法

::: preview
demo-preview=../../components/ProCol/base.vue
:::

## 自由组合

`use-grid=false` 时使用普通 Flex 子项；同时设置 `full` 可以填充父级行的剩余空间。它不表示独占整行，栅格模式下的 `full` 不生效。

::: preview
demo-preview=../../components/ProCol/group.vue
:::

## 默认响应式规则

- 未传 `span` 时使用 `24`；`span=0` 会保留。
- 当 `span=24` 时，不自动补齐断点，显式配置的断点继续传给 `ElCol`。
- 当 `span` 不等于 `24` 时，各断点使用下表的默认值；传入的数字或对象配置优先。

| 断点 | 未显式配置时的值 |
| ---- | ---------------- |
| `xs` | `24`             |
| `sm` | `12`             |
| `md` | `8`              |
| `lg` | `span`           |
| `xl` | `span`           |

因此，`:span="6"` 不表示在所有屏幕尺寸下都占六列。若需要固定占比，请显式设置相应断点。

## 接口说明

### 属性

| 属性                         | 说明                                        | 类型                        | 默认值         |
| ---------------------------- | ------------------------------------------- | --------------------------- | -------------- |
| `span`                       | 栅格占据的列数，仅在栅格模式生效            | `number`                    | `24`           |
| `use-grid`                   | 是否使用 `ElCol` 栅格布局                   | `boolean`                   | `true`         |
| `full`                       | 非栅格模式下通过 `flex: 1` 填充行内剩余空间 | `boolean`                   | `false`        |
| `xs / sm / md / lg / xl`     | 对应断点的列数或布局对象                    | `ColProps` 中对应属性的类型 | 见上表         |
| `offset / push / pull / tag` | 栅格模式下透传给 `ElCol`                    | `ColProps` 中对应属性的类型 | `ElCol` 默认值 |

非栅格模式会根据最近一层 `ElRow` 的 `gutter` 设置左右内边距；栅格专用属性不会应用到普通容器上。

### 插槽

| 名称      | 说明     |
| --------- | -------- |
| `default` | 列内内容 |
