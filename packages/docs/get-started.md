---
search: false
next:
  link: /components/ProCol/
  text: 响应式栅格布局（ProCol）
---

# 基于 Element Plus 二次封装组件库

## 安装

```bash
npm i @coderhd/pro-element-plus --save
```

## 开始使用

Pro Element Plus 提供了基于 ES Module 的开箱即用的 Element Plus 二次封装组件。

**全局使用**

```js
import { createApp } from 'vue'
// 引入所有组件
import ProElementPlus from '@coderhd/pro-element-plus'
// 引入样式
import '@coderhd/pro-element-plus/dist/index.css'

import App from './App.vue'
// 全局使用
createApp(App).use(ProElementPlus).mount('#app')
```

**按需引入**

```vue
<template>
  <pro-form :model="form" :fields="fields" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProForm } from '@coderhd/pro-element-plus'
import type { ProFormFields } from '@coderhd/pro-element-plus'

const form = ref({
  name: '',
  age: '',
  date: '',
})

const fields: ProFormFields = [
  {
    label: '姓名',
    prop: 'name',
    component: 'ElInput',
    componentProps: {
      placeholder: '请输入姓名',
    },
  },
  {
    label: '年龄',
    prop: 'age',
    component: 'ElInputNumber',
    componentProps: {
      placeholder: '请输入年龄',
    },
  },
  {
    label: '日期',
    prop: 'date',
    component: 'ElDatePicker',
    componentProps: {
      type: 'date',
      placeholder: '请选择日期',
    },
  },
]
</script>
```
