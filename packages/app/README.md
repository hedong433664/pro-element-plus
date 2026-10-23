# @pro-element-plus/app

此示例从 `@coderhd/pro-element-plus` 的构建产物导入组件，不使用源码别名。

## 目录

- `src/views/`：各组件的示例页面。
- `src/router/`：页面路由。
- `vite.config.ts`：自动导入、样式和开发服务器配置。

## 运行

在仓库根目录执行：

```bash
pnpm start
```

此命令先构建组件库，再启动示例。已完成构建时，也可以单独启动：

```bash
pnpm --filter @pro-element-plus/app dev
```

## 构建

```bash
pnpm --filter @pro-element-plus/app build
```

构建同时检查示例的 TypeScript 类型。
