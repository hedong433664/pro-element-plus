# Pro Element Plus

<p align="center">
  <a href="https://www.npmjs.com/package/@coderhd/pro-element-plus" target="_blank">
    <img src="https://img.shields.io/npm/dm/@coderhd/pro-element-plus.svg" alt="npm downloads" />
  </a>
  <a href="https://github.com/vuejs/core" target="_blank">
    <img src="https://img.shields.io/badge/vue-3.5+-42b883.svg" alt="vue" />
  </a>
  <a href="https://element-plus.org/" target="_blank">
    <img src="https://img.shields.io/badge/element--plus-2.0+-409eff.svg" alt="element-plus" />
  </a>
</p>

基于 Element Plus 二次封装的 Vue 3 组件库，提供更高层次的抽象和业务常用组件。

## ✨ 特性

- 🎯 **开箱即用** - 提供业务常用组件
- 📦 **TypeScript 优先** - 完整的类型定义和智能提示
- 🎨 **设计一致** - 完全继承 Element Plus API
- 🔧 **开发者友好** - 清晰的文档和示例

## 📚 文档

[Pro Element Plus 文档](https://hedong433664.github.io/pro-element-plus/)

## 🛠️ 安装

```bash
npm install @coderhd/pro-element-plus
```

## 🔨 使用

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

## 🤝 贡献

欢迎提交 Pull Request 或 Issue。

## 📝 许可证

[MIT](https://github.com/hedong433664/pro-element-plus/blob/master/LICENSE)
