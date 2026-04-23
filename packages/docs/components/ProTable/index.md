---
title: ProTable
description: 基于 el-table 和 el-pagination 的配置式表格组件。

prev:
  link: /components/ProHeader/
  text: ProHeader
---

# ProTable

`ProTable` 是一个基于 `el-table` 与 `el-pagination` 封装的配置式表格组件，适合在业务中通过 `columns` 快速描述表格结构。

## 基础用法

通过 `columns` 配置列信息，支持 `selection`、`index`、固定列、自定义渲染等常见能力。

::: preview
demo-preview=../../components/ProTable/base.vue
:::

## 分页用法

组件内置了分页区域，支持：

- `hide-pagination` 控制分页显隐
- `v-model:current-page` 与 `v-model:page-size` 双向绑定
- `total` 作为分页总数
- `@pagination` 统一抛出页码与每页条数
- `pagination-props` 透传其他 `el-pagination` 属性

::: preview
demo-preview=../../components/ProTable/pagination.vue
:::

## 多级表头与插槽

当列配置中存在 `children` 时，会自动渲染为多级表头。  
同时支持两种自定义内容方式：

- `cellSlots`：函数式插槽
- `slotNames`：模板插槽名称映射

::: preview
demo-preview=../../components/ProTable/group-header.vue
:::

## API

### Props

| 属性名              | 说明                                                                         | 类型               | 默认值                                                  |
| ------------------- | ---------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------- |
| `columns`           | 表格列配置数组                                                               | `ProTableColumn[]` | `[]`                                                    |
| `hide-pagination`   | 是否隐藏分页区域                                                             | `boolean`          | `false`                                                 |
| `current-page`      | 当前页，支持 `v-model:current-page`                                          | `number`           | `1`                                                     |
| `page-size`         | 每页条数，支持 `v-model:page-size`                                           | `number`           | `10`                                                    |
| `total`             | 分页总条数                                                                   | `number`           | `data.length`                                           |
| `pagination-props`  | 额外透传给 `el-pagination` 的属性，不包含 `currentPage`、`pageSize`、`total` | `PaginationProps`  | `{ layout: 'total, sizes, prev, pager, next, jumper' }` |
| `...el-table props` | 完整支持 `el-table` 的属性                                                   | -                  | -                                                       |

### ProTableColumn

| 字段                       | 说明                                      | 类型                       |
| -------------------------- | ----------------------------------------- | -------------------------- |
| `label`                    | 列标题                                    | `string`                   |
| `prop`                     | 列字段名                                  | `string`                   |
| `type`                     | 列类型，如 `selection`、`index`、`expand` | `string`                   |
| `children`                 | 子列配置，用于多级表头                    | `ProTableColumn[]`         |
| `hidden`                   | 是否隐藏当前列，支持静态值或函数          | `boolean \| () => boolean` |
| `cellSlots`                | 函数式插槽配置                            | `object`                   |
| `slotNames`                | 模板插槽名称映射                          | `object`                   |
| `...el-table-column props` | 完整支持 `el-table-column` 的属性         | -                          |

### Events

| 事件名               | 说明                               | 回调参数                                   |
| -------------------- | ---------------------------------- | ------------------------------------------ |
| `pagination`         | 分页变化时统一抛出当前页和每页条数 | `(page: number, pageSize: number) => void` |
| `update:currentPage` | 当前页双向绑定事件                 | `(page: number) => void`                   |
| `update:pageSize`    | 每页条数双向绑定事件               | `(pageSize: number) => void`               |
| `...el-table events` | 原生 `el-table` 事件继续可用       | -                                          |

### Exposes

`ProTable` 对外透传了常用的 `el-table` 实例方法与实例访问能力，包括：

- `clearSelection`
- `getSelectionRows`
- `toggleRowSelection`
- `toggleAllSelection`
- `toggleRowExpansion`
- `setCurrentRow`
- `clearSort`
- `clearFilter`
- `doLayout`
- `sort`
- `scrollTo`
- `setScrollTop`
- `setScrollLeft`
- `instance`
- `tableRef`
- `getInstance`
