---
title: ProCol
description: ProCol 组件文档

prev:
  link: /get-started
  text: 快速开始

next:
  link: /components/ProHeader/
  text: 标题组件（ProHeader）
---

# ProCol 响应式栅格布局

用于响应式栅格布局，默认 `xs: 24` `sm: 12` `md: 8` `lg: span || 24` `xl: span || 24`

## 基础用法

需配合 `el-row` 使用。

::: preview
demo-preview=../../components/ProCol/index.vue
:::

## 自由组合

配合 `use-grid` 和 `is-full` 属性，可以自由组合布局。

::: preview
demo-preview=../../components/ProCol/not-grid.vue
:::

## Attributes

> 更多属性参考 [ElementPlus Col Attributes](https://element-plus.org/zh-CN/component/layout#col-attributes)

| 属性名   | 类型      | 默认值 | 说明               |
| -------- | --------- | ------ | ------------------ |
| use-grid | `boolean` | true   | 是否使用栅格布局   |
| is-full  | `boolean` | false  | 是否占满父容器宽度 |

## Slots

> 插槽参考 [ElementPlus Col Slots](https://element-plus.org/zh-CN/component/layout#col-slots)
