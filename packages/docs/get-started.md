---
search: false
next:
  link: /components/ProCol/index.md
  text: ProCol 栅格布局
---

# 快速开始

`@coderhd/pro-element-plus` 是基于 Vue 3 与 Element Plus 的二次封装组件库，当前提供 `ProCol`、`ProForm`、`ProSearchForm`、`ProHeader` 和 `ProTable`。

## 安装

在已有的 Vue 3 项目中安装：

```bash
pnpm add @coderhd/pro-element-plus element-plus
```

使用 npm 时：

```bash
npm install @coderhd/pro-element-plus element-plus
```

## JSX / TSX 配置

示例中的 `render`、`cellSlots` 和 `componentSlots` 使用 JSX。安装对应的 Vite 插件：

```bash
pnpm add -D @vitejs/plugin-vue-jsx
```

并在 Vite 配置中保留原有插件，添加 `vueJsx()`：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx()],
})
```

在 TypeScript 配置中添加：

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
  }
}
```

## 方式一：全量引入

组件库插件只注册 `Pro` 组件，不会替你全局注册 Element Plus。示例同时用到两者，因此需要分别安装插件和引入样式：

```ts
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import ProElementPlus from '@coderhd/pro-element-plus'
import App from './App.vue'

import 'element-plus/dist/index.css'
import '@coderhd/pro-element-plus/style.css'

createApp(App).use(ElementPlus).use(ProElementPlus).mount('#app')
```

这种方式不需要配置自动导入插件，也不需要 Sass。若表单配置使用字符串组件名，可通过全局注册的 Element Plus 组件解析，也可参考 [ProForm 的组件解析说明](/components/ProForm/index.md#组件解析)显式注入。

## 方式二：按需自动引入

下面使用 Vite 配置组件与样式的自动导入。此方式不需要全量引入。

### 安装构建依赖

```bash
pnpm add -D unplugin-vue-components unplugin-element-plus sass
```

`ProElementPlusResolver()` 默认引入组件的 `/style` 入口，其中包含 Element Plus 的 SCSS，因此需要安装 `sass`。

### 配置 Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ProElementPlusResolver } from '@coderhd/pro-element-plus/resolver'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    ElementPlus(),
    Components({
      resolvers: [ElementPlusResolver(), ProElementPlusResolver()],
    }),
  ],
})
```

### 入口文件

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

这一方式不需要再引入组件库的全量 `style.css`。模板中的组件由解析器处理；JSX 中使用的组件应显式导入。配置中的字符串组件名不是模板标签，不能只靠自动导入插件注册，请通过 `provideProFormComponents` 注入，或直接传组件对象。

### 不使用 Sass 的替代配置

如果希望自动导入组件代码，但统一使用全量 CSS，可将上述解析器改为：

```ts
ProElementPlusResolver({ importStyle: false })
```

并在入口中引入：

```ts
import 'element-plus/dist/index.css'
import '@coderhd/pro-element-plus/style.css'
```

此时不会按需引入组件库的 SCSS 样式，可省去 `sass`；样式也不再是按需加载。

## 方式三：手动按需引入

在单文件组件中显式导入组件及 CSS 样式入口，无需全局注册：

```vue
<template>
  <ProTable :data="rows" :columns="columns" hide-pagination />
</template>

<script setup lang="ts">
import { ProTable, type ProTableColumn } from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/es/table/style/css'

const rows = [{ name: '张三' }]
const columns: ProTableColumn<{ name: string }>[] = [
  { prop: 'name', label: '姓名' },
]
</script>
```

`/style/css` 是构建后的 CSS 入口，不要求 Sass；`/style` 会引入 Element Plus 的 SCSS。若自行添加输入框、标签等原生组件，还需要为它们引入对应样式或配置 Element Plus 自动样式插件。

## 全局组件类型

全量注册或自动导入时，可在现有 TypeScript 配置的 `types` 中追加组件声明，保留已有条目：

```json
{
  "compilerOptions": {
    "types": ["vite/client", "@coderhd/pro-element-plus/global"]
  }
}
```

类型声明不会执行运行时注册；仍需按前面的方式配置插件或导入组件。

## 下一步

- [ProCol 栅格布局](/components/ProCol/index.md)
- [ProForm 配置式表单](/components/ProForm/index.md)
- [ProSearchForm 查询表单](/components/ProSearchForm/index.md)
- [ProHeader 标题组件](/components/ProHeader/index.md)
- [ProTable 配置式表格](/components/ProTable/index.md)
- [用法示例](/api-examples)

## 兼容范围

当前 Element Plus 依赖基线为 `^2.13.5`，Vue 为 `^3.5.30`。支持 ESM 和 CommonJS JavaScript 入口。样式入口由 Vite 等构建工具处理，纯 Node 环境不要直接执行 CSS / SCSS 导入。
