# @coderhd/pro-element-plus

## 介绍

`@coderhd/pro-element-plus` 是一个基于 `Vue 3` 与 `Element Plus` 的业务组件库，当前提供：

- `ProForm`
- `ProTable`
- `ProHeader`
- `ProCol`

组件库尽量保持与 `Element Plus` 一致的使用习惯，同时针对常见后台场景提供配置式能力。

## 安装

```bash
pnpm add @coderhd/pro-element-plus element-plus
```

也可以使用 `npm` 或 `yarn`：

```bash
npm install @coderhd/pro-element-plus element-plus
```

## 全量引入

```ts
import { createApp } from 'vue'
import App from './App.vue'

import ProElementPlus from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/style.css'

createApp(App).use(ProElementPlus).mount('#app')
```

## 按需引入

### 手动按需引入组件

```ts
import { ProForm, ProTable } from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/es/form/style'
import '@coderhd/pro-element-plus/es/table/style/css'
```

### 配合自动导入解析器

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ProElementPlusResolver } from '@coderhd/pro-element-plus/resolver'

export default defineConfig({
  plugins: [
    vue(),
    ElementPlus(),
    Components({
      resolvers: [ElementPlusResolver(), ProElementPlusResolver()],
    }),
  ],
})
```

## 样式说明

### 全量样式

```ts
import '@coderhd/pro-element-plus/style.css'
```

该入口会包含：

- 组件库自身样式
- 当前组件依赖的 `Element Plus` 样式

### 按需样式

```ts
import '@coderhd/pro-element-plus/es/form/style'
import '@coderhd/pro-element-plus/es/form/style/css'
import '@coderhd/pro-element-plus/es/table/style'
```

## ProForm 说明

`ProForm` 基于 `el-form`、`el-row` 与 `ProCol` 封装，支持通过 `fields` 快速描述表单结构。

### 基础示例

```vue
<template>
  <ProForm :model="model" :fields="fields" label-width="88px" />
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { ElInput } from 'element-plus'
import {
  provideProFormComponents,
  type ProFormField,
} from '@coderhd/pro-element-plus'

interface FormModel {
  name: string
}

provideProFormComponents({ ElInput })

const model = reactive<FormModel>({
  name: '',
})

const fields = computed((): ProFormField<FormModel>[] => [
  {
    prop: 'name',
    label: '姓名',
    component: 'ElInput',
    componentProps: {
      placeholder: '请输入姓名',
      clearable: true,
    },
  },
])
</script>
```

### 字符串组件名与注入

当 `fields` 中使用字符串组件名时，`ProForm` 会优先从注入表中解析组件：

```ts
import { ElInput, ElSelect } from 'element-plus'
import { provideProFormComponents } from '@coderhd/pro-element-plus'

provideProFormComponents({
  ElInput,
  ElSelect,
})
```

如果需要在 `main.ts` 里统一配置，请直接使用：

```ts
import { createApp } from 'vue'
import { ElInput, ElSelect } from 'element-plus'
import App from './App.vue'
import { proFormComponentsKey } from '@coderhd/pro-element-plus'

const app = createApp(App)

app.provide(proFormComponentsKey, {
  ElInput,
  ElSelect,
})
```

## TypeScript 支持

如果项目使用自动导入或全局组件类型，建议在 `tsconfig.json` 中补上：

```json
{
  "compilerOptions": {
    "types": ["vite/client", "@coderhd/pro-element-plus/global"]
  }
}
```

## 导出能力

### 根入口

```ts
import ProElementPlus, {
  ProForm,
  ProTable,
  ProHeader,
  ProCol,
} from '@coderhd/pro-element-plus'
```

### 组件子路径

```ts
import { ProForm } from '@coderhd/pro-element-plus/es/form'
import type {
  ProFormField,
  ProFormInstance,
} from '@coderhd/pro-element-plus/es/form'
```

### 样式子路径

```ts
import '@coderhd/pro-element-plus/es/form/style'
import '@coderhd/pro-element-plus/es/form/style/css'
```

### 解析器

```ts
import { ProElementPlusResolver } from '@coderhd/pro-element-plus/resolver'
```

## 兼容说明

当前包依赖以下生态：

- `vue`
- `element-plus`
- `lodash-es`

这些依赖在包中以 `peerDependencies` 方式声明，使用方项目需要自行安装。
