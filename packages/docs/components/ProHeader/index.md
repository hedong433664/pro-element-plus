---
title: ProHeader 标题组件
description: 用于区分页面内容层次的标题组件
prev:
  link: /components/ProSearchForm/index.md
  text: ProSearchForm 查询表单
next:
  link: /components/ProTable/index.md
  text: ProTable 配置式表格
---

# ProHeader 标题组件

用于页面标题进行分割主次内容。

## 基础用法

::: preview
demo-preview=../../components/ProHeader/base.vue
:::

## 属性

| 属性名  | 类型                            | 默认值    | 说明   |
| ------- | ------------------------------- | --------- | ------ |
| size    | `large` \| `default` \| `small` | `default` | 尺寸   |
| divider | `boolean`                       | `false`   | 分割线 |
| border  | `boolean`                       | `false`   | 下边框 |

## 插槽

| 名称      | 说明                                 |
| --------- | ------------------------------------ |
| `default` | 标题内容                             |
| `right`   | 右侧扩展操作区域，仅在提供插槽时显示 |

`divider` 控制标题同行的分割线，`border` 控制底部边框线，两者可以同时启用。
