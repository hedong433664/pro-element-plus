---
search: false
next:
  link: /components/ProCol/index.md
  text: 响应式栅格布局（ProCol）
---

# 快速开始

`@coderhd/pro-element-plus` 是一套基于 `Vue 3` 与 `Element Plus` 的业务组件库，当前提供：

- `ProForm`
- `ProTable`
- `ProHeader`
- `ProCol`

## 安装

```bash
pnpm add @coderhd/pro-element-plus element-plus
```

也可以使用 `npm` 或 `yarn`：

```bash
npm install @coderhd/pro-element-plus element-plus
```

## 全量引入

适合快速接入或后台项目初始化阶段：

```ts
import { createApp } from 'vue'
import App from './App.vue'

import ProElementPlus from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/style.css'

createApp(App).use(ProElementPlus).mount('#app')
```

## 按需引入 Element Plus

如果项目希望按需加载 `Element Plus` 组件和样式，推荐结合 `unplugin-vue-components` 与 `unplugin-element-plus` 使用。

### 安装依赖

```bash
pnpm add -D unplugin-vue-components unplugin-element-plus
```

### Vite 配置

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
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

### 入口文件

```ts
import { createApp } from 'vue'
import App from './App.vue'

import '@coderhd/pro-element-plus/style.css'

createApp(App).mount('#app')
```

## TypeScript 配置建议

如果你使用自动导入和全局组件类型，推荐在 `tsconfig.json` 中补上：

```json
{
  "compilerOptions": {
    "types": ["vite/client", "@coderhd/pro-element-plus/global"]
  }
}
```

## 下一步

- 查看 [ProForm](/components/ProForm/index.md) 了解配置式表单
- 查看 [ProTable](/components/ProTable/index.md) 了解配置式表格
- 查看 [ProHeader](/components/ProHeader/index.md) 了解头部区域组件
- 查看 [ProCol](/components/ProCol/index.md) 了解响应式栅格布局
