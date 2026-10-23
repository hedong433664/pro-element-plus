---
title: ProTable 配置式表格
description: 基于 ElTable 与 ElPagination 的配置式表格组件
prev:
  link: /components/ProHeader/index.md
  text: ProHeader 标题组件
next: false
---

# ProTable 配置式表格

`ProTable` 是一个基于 `el-table` 与 `el-pagination` 封装的配置式表格组件，通过 `columns` 描述表格结构。

## 基础用法

通过 `columns` 配置列信息。基础示例中的操作按钮仅演示外观，可添加 `onClick` 处理函数。支持 `selection`、`index`、固定列、自定义渲染等功能。

::: preview
demo-preview=../../components/ProTable/base.vue
:::

## 分页用法

组件内置了分页区域，支持：

- `hide-pagination` 控制分页显隐
- `v-model:current-page` 与 `v-model:page-size` 双向绑定
- `total` 作为分页总数
- `@pagination` 返回页码与每页条数
- `pagination-props` 透传其他 `el-pagination` 属性

下面使用延迟返回的数据模拟服务端分页，并忽略过期结果。`v-loading` 指令在示例中已显式导入。

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

## 接口说明

### 属性

| 属性名             | 说明                                               | 类型                      | 默认值                                                  |
| ------------------ | -------------------------------------------------- | ------------------------- | ------------------------------------------------------- |
| `columns`          | 表格列配置数组                                     | `ProTableColumn[]`        | `[]`                                                    |
| `hide-pagination`  | 是否隐藏分页区域                                   | `boolean`                 | `false`                                                 |
| `current-page`     | 当前页，支持 `v-model:current-page`                | `number`                  | `1`                                                     |
| `page-size`        | 每页条数，支持 `v-model:page-size`                 | `number`                  | `10`                                                    |
| `total`            | 分页总条数                                         | `number`                  | `data.length`                                           |
| `pagination-props` | 额外分页属性，不包含受控页码、条数、总数及其默认值 | `ProTablePaginationProps` | `{ layout: 'total, sizes, prev, pager, next, jumper' }` |
| 其他表格属性       | 传给内部 `ElTable`                                 | -                         | -                                                       |

`ProTablePaginationProps` 是 `PaginationPropsPublic` 排除 `currentPage`、`pageSize`、`defaultCurrentPage`、`defaultPageSize`、`total` 后的可选属性集合。请通过 `ProTable` 自身的双向绑定与 `total` 控制分页，不要在 `pagination-props` 中重复设置这些字段。自定义分页对象不会与本库默认对象深合并，需要保持默认布局时请显式传入 `layout`。

### 列配置（ProTableColumn）

| 字段                  | 说明                                   | 类型                                              |
| --------------------- | -------------------------------------- | ------------------------------------------------- |
| `label`               | 列标题                                 | `string`                                          |
| `prop`                | 列字段路径，使用泛型配置时进行类型检查 | `FieldPath<T>`                                    |
| `type`                | 列类型                                 | `'default' \| 'selection' \| 'index' \| 'expand'` |
| `align / headerAlign` | 单元格与表头的对齐方式                 | `'left' \| 'center' \| 'right'`                   |
| `fixed`               | 固定列位置                             | `boolean \| 'left' \| 'right'`                    |
| `sortable`            | 是否排序，`custom` 仅发出排序事件      | `boolean \| 'custom'`                             |
| `children`            | 子列配置，用于多级表头                 | `ProTableColumn[]`                                |
| `hidden`              | 是否隐藏当前列，支持静态值或函数       | `boolean \| () => boolean`                        |
| `cellSlots`           | 函数式列插槽                           | `ProTableColumnSlots<T>`                          |
| `slotNames`           | 将列插槽映射到外层具名模板插槽         | `ProTableColumnSlotNames`                         |
| 其他列属性            | 传给内部 `ElTableColumn`               | -                                                 |

### 事件

| 事件名               | 说明                                   | 回调参数                                   |
| -------------------- | -------------------------------------- | ------------------------------------------ |
| `pagination`         | 分页变化时触发，参数为当前页和每页条数 | `(page: number, pageSize: number) => void` |
| `update:currentPage` | 当前页双向绑定事件                     | `(page: number) => void`                   |
| `update:pageSize`    | 每页条数双向绑定事件                   | `(pageSize: number) => void`               |
| 其他表格事件         | 原生 `el-table` 事件继续可用           | -                                          |

### 实例方法与属性

组件引用包含以下方法与属性：

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

## 插槽

| 名称                                | 说明                     | 参数                                                               |
| ----------------------------------- | ------------------------ | ------------------------------------------------------------------ |
| `append`                            | 表格内容底部的附加区域   | 无                                                                 |
| `empty`                             | 自定义空数据内容         | 无                                                                 |
| `slotNames.default` 对应名称        | 自定义单元格或展开行内容 | 普通单元格包含 `{ row, column, $index }`；展开列以原生插槽参数为准 |
| `slotNames.header` 对应名称         | 自定义列头               | `{ column, $index }`                                               |
| `slotNames['filter-icon']` 对应名称 | 自定义筛选图标           | `{ filterOpened, column }`                                         |

`cellSlots` 和 `slotNames` 同时配置同一个列插槽时，函数式 `cellSlots` 优先。多级表头父列的默认插槽用于渲染子列，不能同时用作普通单元格内容。

## 数据与类型

`ProTable` 不自动请求数据，也不对传入 `data` 做客户端分页切片。通过 `data / total / currentPage / pageSize` 控制数据与分页状态，使用 `pagination` 监听分页变化。

`ProTableColumn<Row>` 会检查字段路径和 `type / align / headerAlign / fixed / sortable` 的取值。

底层 `ElTable` 实例通过 `getInstance()` 或 `instance` 获取。

同一轮更新中的分页变化会合并为一次 `pagination` 事件（包括修改每页条数后的页码修正），在 Vue 本轮更新结束后发出，避免触发重复请求。`update:currentPage` / `update:pageSize` 仍按状态变化分别发出。
