---
title: ProTable
description: ProTable 组件文档

prev:
  link: /get-started
  text: 快速开始
---

# ProTable 数据表格 `1.1.0`

基于 `el-table` 进行封装的 JSON 配置化表格，属性、方法完全兼容，用于快速构建表格

## 基础用法

内置分页组件，使用 `hide-pagination` 属性控制是否显示分页

::: preview
demo-preview=../../components/ProTable/index.vue
:::

## 查询表格

配合 `pro-search-form` 组件使用，实现查询表格功能

::: preview
demo-preview=../../components/ProTable/search-table.vue
:::

## Attributes

> 更多属性参考 [ElementPlus Table Attributes](https://element-plus.org/zh-CN/component/table#table-%E5%B1%9E%E6%80%A7)

| 属性名          | 类型               | 默认值 | 说明         |
| --------------- | ------------------ | ------ | ------------ |
| columns         | `ProTableColumn[]` | []     | 列配置       |
| hide-pagination | `boolean`          | false  | 是否隐藏分页 |

## Events

> 更多事件参考 [ElementPlus Table Events](https://element-plus.org/zh-CN/component/table#table-%E4%BA%8B%E4%BB%B6)

| 事件名            | 说明                         | 回调参数                                        |
| ----------------- | ---------------------------- | ----------------------------------------------- |
| pagination-change | 当分页发生变化时，触发的事件 | `(currentPage: number, pageSize: number): void` |

## Slots

| 插槽名 | 说明                                                                                                                                    |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| append | 插入至表格最后一行之后的内容， 如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。 若表格有合计行，该 slot 会位于合计行之上。 |
| empty  | 空数据时显示的内容                                                                                                                      |

## Exposes

> 更多实例方法参考[ElementPlus Table Methods](https://element-plus.org/zh-CN/component/table#table-exposes)

<details>
  <summary>类型定义</summary>

```ts
// import tableProps from 'element-plus/es/components/table/src/table/defaults'
import tableColumnProps from 'element-plus/es/components/table/src/table-column/defaults'

import type { ExtractPublicPropTypes, PropType, VNodeChild } from 'vue'
import type { TableProps, TableColumnCtx, PaginationProps } from 'element-plus'

type DefaultRow = Record<PropertyKey, any>

type CellSlots = {
  default?: (data: {
    row: any
    column: TableColumnCtx<any>
    $index: number
  }) => VNodeChild
  header?: (data: { column: TableColumnCtx<any>; $index: number }) => VNodeChild
  filterIcon?: (data: { filterOpened: boolean }) => VNodeChild
  expand?: (data: { expanded: boolean }) => VNodeChild
}

export const proTableColumn = {
  ...tableColumnProps,
  /**
   * 列插槽
   */
  cellSlots: {
    type: Object as PropType<CellSlots>,
    default: () => ({}),
  },
}

export type ProTableColumn = ExtractPublicPropTypes<typeof proTableColumn>

export type ProTableProps<T extends DefaultRow = DefaultRow> = TableProps<T> &
  Partial<PaginationProps> & {
    /**
     * 列配置
     */
    columns: ProTableColumn[]
    /**
     * 是否隐藏分页
     * @default false
     */
    hidePagination?: boolean
  }
```

</details>
