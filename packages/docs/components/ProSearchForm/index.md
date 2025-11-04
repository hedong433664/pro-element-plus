---
title: ProSearchForm
description: ProSearchForm 组件文档

prev:
  link: /components/ProForm/
  text: 表单（ProForm）
---

# ProSearchForm 查询表单

基于 `ProForm` 进行封装，支持折叠展开、重置、自动查询等功能。

## 基础用法

::: preview
demo-preview=../../components/ProSearchForm/index.vue
:::

## Attributes

> ProSearchForm基于ProForm进行封装，更多属性参考[ProForm Attributes](/components/ProForm/#attributes)

| 属性名                                        | 类型                                                                                                                          | 默认值    | 说明                   |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------- |
| init-search                                   | `boolean`                                                                                                                     | true      | 是否初始化查询         |
| auto-search                                   | `boolean`                                                                                                                     | false     | 是否自动查询           |
| auto-search-debounce                          | `number`                                                                                                                      | 300       | 自动搜索防抖阈值       |
| refresh-after-search                          | `boolean`                                                                                                                     | true      | 是否重置后触发搜索     |
| button-justify                                | [`justify-content`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/justify-content#%E8%AF%AD%E6%B3%95) | end       | 搜索、重置按钮对齐方式 |
| hide-search-button                            | `boolean`                                                                                                                     | false     | 是否隐藏搜索按钮       |
| hide-reset-button                             | `boolean`                                                                                                                     | false     | 是否隐藏重置按钮       |
| hide-collapse-button                          | `boolean`                                                                                                                     | false     | 是否隐藏折叠按钮       |
| default-collapsed / v-model:default-collapsed | `boolean`                                                                                                                     | false     | 默认是否折叠           |
| refresh-button-text                           | `string`                                                                                                                      | 重置      | 重置按钮文本           |
| search-button-text                            | `string`                                                                                                                      | 查询      | 查询按钮文本           |
| collapse-button-text                          | `[string, string]`                                                                                                            | 展开,收起 | 折叠按钮文本           |
| collapsed-count                               | `number`                                                                                                                      | 1         | 折叠后显示的表单项数量 |

## Events

| 事件名    | 说明                                     | 回调参数                                 |
| --------- | ---------------------------------------- | ---------------------------------------- |
| search    | 当绑定值变化时，或点击查询按钮触发的事件 | `(params?: Record<string, any>) => void` |
| reset     | 重置时触发的事件                         | `() => void`                             |
| collapsed | 展开折叠时触发的事件                     | `(collapsed: boolean) => void`           |

## Slots

| 插槽名  | 说明     |
| ------- | -------- |
| default | 默认插槽 |

## Exposes

> 更多实例方法参考[ElementPlus Form Methods](https://element-plus.org/zh-CN/component/form#form-methods)

| 方法名         | 说明         | 参数 |
| -------------- | ------------ | ---- |
| refresh        | 重置表单     | -    |
| search         | 查询         | -    |
| toggleCollapse | 切换折叠状态 | -    |
