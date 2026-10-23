---
title: 用法示例
description: 表单显隐、查询重置与分页的常见用法
outline: deep
prev:
  link: /get-started
  text: 快速开始
next:
  link: /components/ProCol/index.md
  text: ProCol 栅格布局
---

# 用法示例

本页补充组件的常见组合方式。组件和样式的接入方式见[快速开始](/get-started)。

## 区分视觉隐藏与字段卸载

`visible=false` 只隐藏布局，字段继续参与校验与重置；`hidden=true` 会卸载字段，但不会自动删除模型中的值。

```vue
<template>
  <ProForm :model="model" :fields="fields" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElInput, ElSwitch } from 'element-plus'
import { ProForm, type ProFormFields } from '@coderhd/pro-element-plus'

const model = reactive({ enabled: true, remark: '', extra: '' })
const fields: ProFormFields<typeof model> = [
  { prop: 'enabled', label: '启用', component: ElSwitch },
  {
    prop: 'remark',
    label: '备注',
    component: ElInput,
    visible: (model) => model.enabled,
  },
  {
    prop: 'extra',
    label: '附加信息',
    component: ElInput,
    hidden: (model) => !model.enabled,
  },
]
</script>
```

显隐函数只判断状态。若需要关闭开关时清空字段，请用独立的 `watch` 处理字段联动。

## 手动确认查询条件

对于需要一次确认多个条件的页面，可关闭自动查询和初始化查询。`search` 事件表示校验通过并发出查询，不会自动执行数据请求。

```vue
<template>
  <ProSearchForm
    ref="searchForm"
    :model="model"
    :fields="fields"
    :auto-search="false"
    :init-search="false"
    @search="handleSearch"
  />
  <pre>最近一次查询条件：{{ lastParams }}</pre>
  <button @click="resetAndSearch">程序重置并查询</button>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElInput } from 'element-plus'
import {
  ProSearchForm,
  type ProSearchFormFields,
  type ProSearchFormInstance,
} from '@coderhd/pro-element-plus'

const model = reactive({ keyword: '' })
const lastParams = ref<Record<string, unknown>>({})
const searchForm = ref<ProSearchFormInstance | null>(null)
const fields: ProSearchFormFields<typeof model> = [
  { prop: 'keyword', label: '关键字', component: ElInput },
]
const handleSearch = (params?: Record<string, unknown>) => {
  // 事件传递当前模型引用，这里为展示结果保留一份浅快照。
  // 需要保留嵌套对象的历史值时，可使用深拷贝。
  lastParams.value = { ...params }
}
const resetAndSearch = async () => {
  // 默认 resetAfterSearch=true，会在字段重置后查询。
  await searchForm.value?.reset()
}
</script>
```

### 选择正确的重置方法

- `reset()`：执行查询表单的完整重置流程，包含取消防抖、原生重置、`reset` 事件和可选的查询。
- `resetFields()`：只执行原生字段重置。模型变化仍可能被自动查询监听捕获，不等于完整重置流程。
- 两者都是恢复字段初始值，并非无条件清空所有查询条件。

## 控制分页状态

`ProTable` 渲染传入的 `data`，不会按 `pageSize` 自动切片。通过 `data / total / currentPage / pageSize` 控制分页，使用 `pagination` 监听页码或每页条数的变化。

同一轮更新中，页码与每页条数的变化会合并为一次 `pagination`，参见 [ProTable 分页示例](/components/ProTable/index.md#分页用法)。

## 访问原生组件实例

通过 `getInstance()` 获取底层组件实例，挂载前返回 `null`。
