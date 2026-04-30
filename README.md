# Pro Element Plus

`@coderhd/pro-element-plus` 是一个基于 `Vue 3` 和 `Element Plus` 的业务组件库仓库，当前提供：

- `ProTable`
- `ProForm`
- `ProSearchForm`
- `ProHeader`
- `ProCol`

在线文档：

- [https://hedong433664.github.io/pro-element-plus/](https://hedong433664.github.io/pro-element-plus/)

## 仓库结构

```text
pro-element-plus
├─ packages/
│  ├─ app/          接入验证工程
│  ├─ components/   组件源码
│  ├─ core/         最终发布包
│  ├─ docs/         VitePress 文档站点
│  └─ play/         本地调试与交互预览
├─ scripts/         构建、版本与发布脚本
├─ package.json
└─ pnpm-workspace.yaml
```

## 常用命令

```bash
pnpm install
pnpm dev
pnpm start
pnpm docs:dev
pnpm docs:build
pnpm build
```

## 发布流程

当前实际发布包为 `packages/core` 下的 `@coderhd/pro-element-plus`。

```bash
pnpm release:check
pnpm release:version patch
pnpm release:build
pnpm release:publish:dry
pnpm release:publish
```

## 相关说明

- 组件源码在 `packages/components`
- 最终 npm 发布包在 `packages/core`
- 文档站点在 `packages/docs`
- 在线文档地址：
  [https://hedong433664.github.io/pro-element-plus/](https://hedong433664.github.io/pro-element-plus/)
