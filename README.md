# Pro Element Plus

`@coderhd/pro-element-plus` 是一个基于 `Vue 3` 和 `Element Plus` 的二次封装组件库仓库，当前提供：

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
pnpm check
```

## 发布流程

发布包为 `packages/core` 下的 `@coderhd/pro-element-plus`。先选择新版本，再检查远端是否已经发布：

```bash
pnpm release:version patch
pnpm release:check
pnpm release:build
```

`release:version` 支持 `patch / minor / major` 和显式版本号。发布检查会查询 registry，版本冲突、网络错误或响应异常都会终止检查。

检查并提交变更后执行预演，确认包内容与标签：

```bash
pnpm release:publish:dry
```

确认后再正式发布：

```bash
pnpm release:publish
```

稳定版默认使用 `latest`。预发布版本必须显式指定标签，且不能使用 `latest`：

```bash
pnpm release:version premajor beta
pnpm release:publish:dry --tag beta
pnpm release:publish --tag beta
```

`--tag=beta` 也受支持。只有预演跳过 Git 检查，正式发布保留检查。正式发布前应先推送提交并确认 CI 通过。

## 开发环境

Node.js 22.12+，pnpm 版本见 `package.json`。

组件支持的依赖版本见 `packages/core/package.json` 的 `peerDependencies`。

组件行为见[组件行为与发布说明](./docs/architecture.md)，版本变更见[更新记录](./packages/core/CHANGELOG.md)。
