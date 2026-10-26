# @coderhd/pro-element-plus

基于 `Vue 3` 和 `Element Plus` 的二次封装组件库，当前提供：

- `ProTable`
- `ProForm`
- `ProSearchForm`
- `ProSearchTable`
- `ProHeader`
- `ProCol`

在线文档：

- [https://hedong433664.github.io/pro-element-plus/](https://hedong433664.github.io/pro-element-plus/)

## 安装

```bash
pnpm add @coderhd/pro-element-plus element-plus
```

也可以使用：

```bash
npm install @coderhd/pro-element-plus element-plus
```

## 使用方式

### 全量引入

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'

import ProElementPlus from '@coderhd/pro-element-plus'
import 'element-plus/dist/index.css'
import '@coderhd/pro-element-plus/style.css'

createApp(App).use(ElementPlus).use(ProElementPlus).mount('#app')
```

### 按需引入

```ts
import { ProForm, ProSearchForm, ProTable } from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/es/form/style/css'
import '@coderhd/pro-element-plus/es/search-form/style/css'
import '@coderhd/pro-element-plus/es/table/style/css'
```

`/style/css` 使用构建后的 CSS，无需 Sass；`/style` 会引入 Element Plus 的 SCSS。动态表单的字符串组件名需要显式注入或全局注册，不能只靠模板自动导入。

### 自动导入解析器

```bash
pnpm add -D unplugin-vue-components unplugin-element-plus sass @vitejs/plugin-vue-jsx
```

默认解析器按需引入 SCSS，因此需要 Sass。此方式无需在入口中重复引入全量样式。插件只处理模板标签；JSX 中使用的组件请显式导入。

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
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

JSX / TSX 的 TypeScript 配置见在线文档的“快速开始”。

## TypeScript

使用自动导入或全局注册时，在现有 `tsconfig.json` 的 `types` 中追加：

```json
{
  "compilerOptions": {
    "types": ["vite/client", "@coderhd/pro-element-plus/global"]
  }
}
```

## 文档

详细组件用法、示例和 API 文档请查看：

- [https://hedong433664.github.io/pro-element-plus/](https://hedong433664.github.io/pro-element-plus/)

## 兼容范围

当前 Element Plus 依赖基线为 `^2.13.5`，Vue 为 `^3.5.30`。旧版 Element Plus 不在当前声明的支持范围内。

支持 ESM 和 CommonJS JavaScript 入口。样式入口由 Vite 等构建工具处理，纯 Node 环境不要直接加载 CSS / SCSS。

## 更新记录

版本变更见 [CHANGELOG.md](./CHANGELOG.md)。
