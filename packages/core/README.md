# @coderhd/pro-element-plus

## 介绍

`@coderhd/pro-element-plus` 是一个基于 `Vue 3` 与 `Element Plus` 的二次封装组件库，提供更贴近业务场景的组件能力，同时尽量保持与 `Element Plus` 一致的使用习惯。

当前已提供的组件包括：

- `ProHeader`
- `ProCol`
- `ProTable`

## 安装

```bash
pnpm add @coderhd/pro-element-plus element-plus
```

也可以使用 `npm` 或 `yarn`：

```bash
npm install @coderhd/pro-element-plus element-plus
```

## 全量引入

适合快速接入或中后台项目初始化阶段使用。

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
import { ProTable } from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/es/table/style'
```

或者使用 `style/css` 入口：

```ts
import { ProTable } from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/es/table/style/css'
```

### 使用自动导入解析器

如果你使用 `unplugin-vue-components`，可以搭配 `@coderhd/pro-element-plus/resolver` 实现组件与样式自动导入。

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
- 当前组件依赖的 Element Plus 样式

如果项目没有单独引入 `el-table`、`el-pagination` 等样式，直接使用这个入口也可以正常工作。

### 按需样式

组件子路径支持两种样式入口：

- `@coderhd/pro-element-plus/es/<name>/style`
- `@coderhd/pro-element-plus/es/<name>/style/css`

例如：

```ts
import '@coderhd/pro-element-plus/es/header/style'
import '@coderhd/pro-element-plus/es/col/style'
import '@coderhd/pro-element-plus/es/table/style/css'
```

## TypeScript 支持

如果项目使用自动导入或全局组件类型，建议在 `tsconfig.json` 中补充：

```json
{
  "compilerOptions": {
    "types": ["vite/client", "@coderhd/pro-element-plus/global"]
  }
}
```

## 导出能力

当前包提供以下几类导出：

### 根入口

```ts
import ProElementPlus, {
  ProHeader,
  ProCol,
  ProTable,
} from '@coderhd/pro-element-plus'
```

### 组件子路径

```ts
import { ProTable } from '@coderhd/pro-element-plus/es/table'
import type {
  ProTableColumn,
  ProTableProps,
} from '@coderhd/pro-element-plus/es/table'
```

### 样式子路径

```ts
import '@coderhd/pro-element-plus/es/table/style'
import '@coderhd/pro-element-plus/es/table/style/css'
```

### 解析器

```ts
import { ProElementPlusResolver } from '@coderhd/pro-element-plus/resolver'
```

## 基础示例

```vue
<template>
  <ProTable :columns="columns" :data="data" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ProTableColumn } from '@coderhd/pro-element-plus/es/table'

interface UserRow {
  name: string
  age: number
}

const data = ref<UserRow[]>([
  { name: '张三', age: 24 },
  { name: '李四', age: 28 },
])

const columns: ProTableColumn<UserRow>[] = [
  { label: '姓名', prop: 'name' },
  { label: '年龄', prop: 'age' },
]
</script>
```

## 兼容说明

当前包以以下生态为基础：

- `vue`
- `element-plus`
- `lodash-es`

这些依赖在包中以 `peerDependencies` 方式声明，使用方项目需要自行安装。
