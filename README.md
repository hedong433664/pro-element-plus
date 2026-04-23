# Pro Element Plus

## 项目简介

`@coderhd/pro-element-plus` 是一个基于 `Vue 3` 与 `Element Plus` 的二次封装组件库，目标是提供更贴近业务场景的组件能力，同时保持与 `Element Plus` 的使用习惯和生态兼容。

当前仓库采用多包工作区结构，包含：

- 组件源码
- 构建与发包逻辑
- 本地调试工程
- 业务接入示例
- 文档站点

## 仓库结构

```text
@coderhd/pro-element-plus
├─ packages/
│  ├─ app/           业务接入示例工程
│  ├─ components/    组件源码层
│  ├─ core/          构建与发包核心
│  ├─ docs/          文档站点
│  └─ play/          本地调试与交互演示工程
├─ scripts/          发布与版本管理脚本
├─ package.json      工作区根脚本与依赖
└─ pnpm-workspace.yaml
```

## 各子包职责

### `packages/components`

负责维护组件源码、类型定义和样式依赖入口，是组件能力的事实来源。

### `packages/core`

负责将 `components` 中的源码构建为最终 npm 包产物，包括：

- `es` / `lib` 构建
- 根入口导出
- 类型声明整理
- 全量样式与按需样式入口
- resolver 生成

### `packages/play`

本地开发阶段的预览与调试工程，适合快速验证组件交互、样式和行为。

### `packages/app`

模拟真实业务项目中的组件消费方式，偏向“接入侧”验证。

### `packages/docs`

基于 `VitePress` 的文档站点，用于沉淀正式的使用说明、示例与 API 文档。

## 开发方式

### 安装依赖

```bash
pnpm install
```

### 常用命令

本地调试：

```bash
pnpm dev
```

业务接入验证：

```bash
pnpm start
```

文档预览：

```bash
pnpm docs:dev
```

文档构建：

```bash
pnpm docs:build
```

组件库构建：

```bash
pnpm build
```

### 版本管理与发布流程

当前仓库采用“根包版本 + `packages/core` 发布版本”同步维护策略，发布包实际为 `packages/core` 中的 `@coderhd/pro-element-plus`。

### 包名环境配置

仓库根目录提供了 `.env` 作为统一包名配置入口，当前支持：

```ini
PRO_EP_PACKAGE_NAME=pro-element-plus
PRO_EP_PACKAGE_DIR=./packages/core
```

- `PRO_EP_PACKAGE_NAME`：组件库对外发布与示例中使用的包名
- `PRO_EP_PACKAGE_DIR`：实际执行发布的子包目录

当需要在 `pro-element-plus` 与 `@scope/pro-element-plus` 之间切换时，推荐流程如下：

```bash
1. 修改 .env
2. 执行 pnpm sync:package-name
3. 执行 pnpm build
4. 执行 pnpm install
```

其中 `pnpm sync:package-name` 会自动同步：

- `packages/core/package.json` 中的发布包名
- `app` / `play` / `docs` 的依赖声明
- 文档、示例、`vite.config.ts`
- `tsconfig*.json` 中如 `pro-element-plus/global` 这类类型引用

版本检查：

```bash
pnpm release:check
```

版本升级：

```bash
pnpm release:version patch
pnpm release:version minor
pnpm release:version major
pnpm release:version prepatch beta
pnpm release:version prerelease beta
pnpm release:version 1.2.0
```

`releaseType` 支持以下几种：

- `patch`：修订版本，例如 `1.0.0 -> 1.0.1`
- `minor`：次版本，例如 `1.0.0 -> 1.1.0`
- `major`：主版本，例如 `1.0.0 -> 2.0.0`
- `prepatch`：预发布修订版，例如 `1.0.0 -> 1.0.1-beta.0`
- `preminor`：预发布次版本，例如 `1.0.0 -> 1.1.0-beta.0`
- `premajor`：预发布主版本，例如 `1.0.0 -> 2.0.0-beta.0`
- `prerelease`：在当前预发布版本基础上递增，例如 `1.0.1-beta.0 -> 1.0.1-beta.1`
- 也支持直接传显式版本号，例如 `1.2.0`

发布构建：

```bash
pnpm release:build
```

发布预演：

```bash
pnpm release:publish:dry
```

正式发布：

```bash
pnpm release:publish
```

#### 正式版发布推荐流程

适用于稳定版本发布，例如 `1.0.1`、`1.1.0`、`2.0.0`。

1. 执行 `pnpm release:check`
2. 选择合适的正式版本类型：
   - 修复发布：`pnpm release:version patch`
   - 功能发布：`pnpm release:version minor`
   - 破坏性升级：`pnpm release:version major`
   - 或直接指定版本：`pnpm release:version 1.2.0`
3. 执行 `pnpm release:build`
4. 执行 `pnpm release:publish:dry`
5. 确认无误后提交代码并打 tag
6. 执行 `pnpm release:publish`

#### Beta 发布推荐流程

适用于新功能验证、灰度测试或正式发布前试用，例如 `1.0.1-beta.0`。

1. 执行 `pnpm release:check`
2. 首次生成 beta 版本：
   - 基于当前修订版本预发布：`pnpm release:version prepatch beta`
   - 基于下一个次版本预发布：`pnpm release:version preminor beta`
   - 基于下一个主版本预发布：`pnpm release:version premajor beta`
3. 如果要继续递增 beta 版本，执行：`pnpm release:version prerelease beta`
4. 执行 `pnpm release:build`
5. 执行 `pnpm release:publish:dry`
6. 确认无误后提交代码并打 beta tag
7. 执行 `pnpm release:publish`

## 开发建议

- 改组件逻辑时，优先在 `components` 中实现。
- 改发包结构、导出路径、样式产物时，同步检查 `core`。
- 改示例或交互时，优先在 `play` 中验证。
- 改正式文档时，维护 `docs`。
- 如果问题只会在业务接入时出现，优先在 `app` 中复现。

## 开发规范

- `components` 是源码事实来源，避免在 `core` 重复定义组件行为。
- 样式依赖以组件目录下的 `style/index.ts` 和 `style/css.ts` 为准。
- 变更构建脚本后，至少执行一轮完整 `build`。
- 文档与示例要尽量与实际组件行为保持同步。
- 新增组件时，至少同步检查：
  - 组件源码与类型
  - 样式入口
  - 聚合导出
  - 注册表
  - 文档示例
  - 构建产物

## 维护说明

每个子包目录下都已经补充了独立的中文 `README.md`，如果需要了解更具体的职责、结构和约定，可以继续查看。
