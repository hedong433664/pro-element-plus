---
title: ProSearchTable 查询表格
description: 通过 request 加载数据的查询表格
prev:
  link: /components/ProTable/index.md
  text: ProTable 配置式表格
next: false
---

# ProSearchTable 查询表格

组合 `ProSearchForm` 和 `ProTable`。属性在外层平铺，`size` 同时作用于表单、按钮和表格。数据与总数只取自 `request`，不接受外部的 `data / total / loading`。

## 基础用法

本例开启 `autoSearch`，修改查询条件后防抖 300ms，校验通过即返回第一页并请求，无需点击查询。`initSearch` 默认为 `true`，挂载后查询一次。其余示例关闭自动查询，点击查询后才提交条件。

::: preview
demo-preview=../../components/ProSearchTable/base.vue
:::

普通查询项按一行四列排列，日期范围项加宽为 `span: 8`，收起时保留第一项。表格高度为 `320px`，序号列固定在左侧，操作列固定在右侧。

包含关键字、部门、状态、城市、最低评分和创建日期筛选，查询条件共同参与过滤。表格展示邮箱、角色、评分、状态等信息。

`schema.tsx` 定义查询项和列，后续示例复用这份配置：

<<< ./schema.tsx

`data.ts` 定义示例数据和请求：

<<< ./data.ts

## 插槽用法

- `search-<name>` 对应字段的 `slotName`，例如 `slotName: 'keyword'` 对应 `#search-keyword`。
- `table-<name>` 对应列的 `slotNames`，例如 `default: 'name'` 对应 `#table-name`。
- `search-actions` 位于查询按钮区，`toolbar` 位于表单和表格之间。
- `table-empty / table-append` 对应表格的空数据和底部内容插槽。
- `cellSlots`、`componentSlots` 中的 JSX 函数直接使用，不需要插槽前缀。

::: preview
demo-preview=../../components/ProSearchTable/slots.vue
:::

## 隐藏分页

`hide-pagination` 只隐藏分页控件，不会修改请求参数，也不会把结果再次切片。若要显示全部数据，由 `request` 返回全部匹配结果。

::: preview
demo-preview=../../components/ProSearchTable/hide-pagination.vue
:::

## 多选

列中配置 `type: 'selection'`，用 `selection-change` 接收选择结果。跨页保留选择时，设置稳定的 `row-key` 和列的 `reserveSelection`。查询条件变化后如需清空选择，可以调用 `getTableInstance()?.clearSelection()`。

::: preview
demo-preview=../../components/ProSearchTable/selection.vue
:::

## 树形数据

`request` 的 `data` 可以包含嵌套行。`row-key / tree-props / default-expand-all / lazy / load` 传给表格。下面按名称、类型和创建者过滤树节点并保留匹配项的父节点，隐藏分页，`total` 表示根节点数量。

::: preview
demo-preview=../../components/ProSearchTable/tree.vue
:::

## request

```ts
import type { ProSearchTableRequest } from '@coderhd/pro-element-plus'

type Query = { keyword: string }
type Row = { id: number; name: string }

const request: ProSearchTableRequest<Query, Row> = async ({
  query,
  currentPage,
  pageSize,
}) => {
  // 在这里获取数据，并将结果转换为 { data, total }。
  const matched: Row[] = [{ id: 1, name: '张三' }].filter((row) =>
    row.name.includes(query.keyword),
  )
  const start = (currentPage - 1) * pageSize
  return { data: matched.slice(start, start + pageSize), total: matched.length }
}
```

请求参数为 `{ query, currentPage, pageSize }`，返回 `Promise<{ data: Row[]; total: number }>`。`total` 必须为非负有限数值。

`query` 是已提交条件的深拷贝。关闭自动查询时，尚未提交的输入变化不会影响翻页或刷新。组件不取消 HTTP 请求，但只应用最后一次请求的结果；卸载后忽略结果。失败时保留已有数据，结束 loading 并发出 `request-error`，不弹出消息。

## 属性

| 属性                                               | 说明                                                                     | 默认值                  |
| -------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------- |
| `request`                                          | 必填，请求函数                                                           | 无                      |
| `model / fields`                                   | 查询模型与字段配置                                                       | `{}` / `[]`             |
| `columns`                                          | 表格列配置                                                               | `[]`                    |
| `size`                                             | 统一尺寸                                                                 | 跟随 Element Plus 配置  |
| `current-page`                                     | 当前页，支持双向绑定                                                     | `1`                     |
| `page-size`                                        | 每页条数，支持双向绑定                                                   | `10`                    |
| `hide-pagination`                                  | 是否隐藏分页控件                                                         | `false`                 |
| `pagination-props`                                 | 分页属性，受控页码、条数和总数不能在此设置                               | 与 `ProTable` 一致      |
| `init-search / auto-search / auto-search-debounce` | 初始化及自动查询                                                         | `true` / `true` / `300` |
| `reset-after-search`                               | 重置字段后是否提交条件并请求                                             | `true`                  |
| 其他查询表单属性                                   | 与 `ProSearchForm` 一致                                                  | 见对应文档              |
| 其他表格属性                                       | 与 `ProTable` 一致，如 `border / stripe / row-key / height / tree-props` | 见对应文档              |

`class / style` 作用于外层容器，`height / max-height` 作用于表格；`disabled` 作用于查询表单。`data / total / loading` 不属于可配置属性，即使绕过类型检查传入也不会覆盖内部状态。

## 查询与分页

| 操作            | 行为                                                     |
| --------------- | -------------------------------------------------------- |
| 初始化          | 按 `initSearch` 决定是否校验并提交当前条件，查询第一页   |
| 手动 / 自动查询 | 校验通过后提交条件，返回第一页并请求                     |
| 修改页码        | 使用已提交条件请求对应页                                 |
| 修改每页条数    | 返回第一页并请求一次                                     |
| `reload()`      | 保持当前页与已提交条件重新请求；尚未提交过时取当前模型   |
| `reset()`       | 恢复字段初始值，按 `resetAfterSearch` 决定是否提交并请求 |

外部修改 `currentPage / pageSize` 也会触发请求。同一轮页码和条数变化合并处理。更换 `request` 函数本身不自动请求，需调用 `reload()`。

## 事件

| 名称                                   | 参数                      | 说明                                            |
| -------------------------------------- | ------------------------- | ----------------------------------------------- |
| `search`                               | `query`                   | 校验通过并提交条件，不代表请求成功              |
| `reset / collapsed / validate`         | 与 `ProSearchForm` 一致   | 查询表单事件                                    |
| `update:currentPage / update:pageSize` | 数值                      | 分页状态更新                                    |
| `pagination`                           | `(currentPage, pageSize)` | 分页控件触发变化                                |
| `request-success`                      | `(result, params)`        | 最新请求结果已应用                              |
| `request-error`                        | `(error, params)`         | 最新请求失败或返回值不符合约定                  |
| 原生表格事件                           | 与 `ElTable` 一致         | 如 `selection-change / row-click / sort-change` |

## 实例

| 名称                                              | 说明                                                 |
| ------------------------------------------------- | ---------------------------------------------------- |
| `search(): Promise<boolean>`                      | 校验并提交当前条件，请求第一页；返回是否成功应用结果 |
| `reload(): Promise<boolean>`                      | 重新请求，返回是否成功应用结果                       |
| `reset(): Promise<void>`                          | 等待字段重置和可选的请求完成                         |
| `getSearchFormInstance()`                         | 获取 `ProSearchForm` 实例，挂载前为 `null`           |
| `getTableInstance()`                              | 获取 `ProTable` 实例，挂载前为 `null`                |
| `data / total / loading / currentPage / pageSize` | 只读状态，用于查看当前结果与请求状态                 |
