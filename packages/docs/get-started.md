---
search: false
next:
  link: /components/radioGroup
  text: RadioGroup 单选框组
---

# 基于 Element Plus 二次封装组件库

## 安装

```bash
npm i pro-element-plus --save
```

## 开始使用

**全局使用**

```js
import { createApp } from "vue"
// 引入所有组件
import ProElementPlus from "pro-element-plus"
// 引入样式
import "pro-element-plus/dist/index.css"

import App from "./App.vue"
// 全局使用
createApp(App).use(ProElementPlus).mount("#app")
```

```vue
<template>
  <pro-radio-group v-model="value" :options="options" is-button />
</template>

<script setup>
import { ref } from "vue"

const value = ref("1")
const options = [
  { label: "选项 1", value: "1" },
  { label: "选项 2", value: "2", disabled: true },
  { label: "选项 3", value: "3" }
]
</script>
```

**按需引入**

Pro-Element-Plus 提供了基于 ES Module 的开箱即用的 Element Plus 二次封装组件。

```vue
<template>
  <pro-radio-group v-model="value" :options="options" is-button>
</template>

<script setup>
import { ref } from "vue"
import { ProRadioGroup } from "pro-element-plus"

const value = ref("1")
const options: = [
  { label: "选项 1", value: "1" },
  { label: "选项 2", value: "2", disabled: true },
  { label: "选项 3", value: "3" }
]
</script>
```
