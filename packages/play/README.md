# @pro-element-plus/play

本地调试页面。Vite 配置将组件库导入路径映射到 `components` 和 `core` 的源码，修改后可直接预览。

## 目录

- `src/views/`：各组件的调试页面。
- `src/router/`：页面路由。
- `vite.config.ts`：源码别名、自动导入和样式配置。

## 运行

在仓库根目录执行：

```bash
pnpm dev
```

## 构建

```bash
pnpm --filter @pro-element-plus/play build
```

`play` 使用源码，`app` 使用构建产物，`docs` 存放文档和演示。
