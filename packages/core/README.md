# @coderhd/pro-element-plus

基于 `Vue 3` 和 `Element Plus` 的业务组件库，当前提供：

- `ProTable`
- `ProForm`
- `ProSearchForm`
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
import App from './App.vue'

import ProElementPlus from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/style.css'

createApp(App).use(ProElementPlus).mount('#app')
```

### 按需引入

```ts
import { ProForm, ProSearchForm, ProTable } from '@coderhd/pro-element-plus'
import '@coderhd/pro-element-plus/es/form/style'
import '@coderhd/pro-element-plus/es/search-form/style'
import '@coderhd/pro-element-plus/es/table/style/css'
```

### 自动导入解析器

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

## TypeScript

如果项目使用自动导入或全局组件类型，建议在 `tsconfig.json` 中补上：

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
