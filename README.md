# Pro Element Plus

## 项目简介

`@coderhd/pro-element-plus` 是一个基于 `Vue 3` 和 `Element Plus` 的业务组件库仓库，当前包含：

- 组件源码
- 打包与发布脚本
- 本地调试工程
- 接入验证工程
- 文档站点

当前组件包括：

- `ProForm`
- `ProTable`
- `ProHeader`
- `ProCol`

## 仓库结构

```text
pro-element-plus
├─ packages/
│  ├─ app/          接入验证工程
│  ├─ components/   组件源码
│  ├─ core/         打包产物与发布入口
│  ├─ docs/         VitePress 文档站点
│  └─ play/         本地调试与交互预览
├─ scripts/         构建、版本、发布脚本
├─ package.json
└─ pnpm-workspace.yaml
```

## 常用命令

安装依赖：

```bash
pnpm install
```

本地调试：

```bash
pnpm dev
```

接入验证：

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

## 发布流程

发布包为 `packages/core` 下的 `@coderhd/pro-element-plus`。

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

`releaseType` 支持：

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
