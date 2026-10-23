# 组件行为与发布说明

## 当前版本

当前准备版本为 `3.0.0`，尚未发布。变更见[更新记录](../packages/core/CHANGELOG.md)。

## 表单行为

- `hidden`：卸载字段，退出表单字段注册；模型中的值不会自动删除。
- `visible`：仅视觉隐藏，保留模型、字段注册、校验与重置。
- `resetFields()` 恢复 Element Plus 记录的字段初始值，不代表无条件清空。
- `slotName` 和 `render` 均可取得 `model / field / value / setValue` 上下文。
- 默认绑定 `modelValue / update:modelValue`；自定义组件可设置 `modelProp / modelEvent`。
- 模型更新事件先更新模型，再执行配置中的同名监听器。
- 点分路径提供最多五层的类型检查，并支持数组数字索引；`string[]` 路径保留 Element Plus 的动态路径兼容方式。

## 查询行为

`autoSearch` 默认为 `true`，设置为 `false` 可关闭模型变化后的自动查询。

初始化查询、自动查询和手动查询独立控制。手动查询和重置会取消待执行防抖；卸载或关闭自动查询后，不再发出排队的自动查询。过期的异步校验结果不会触发 `search`。

`search` 事件传递当前模型引用，而不是模型快照。

## 表格行为

`ProTable` 渲染传入的 `data`，不隐式执行客户端切片。通过 `data / total / currentPage / pageSize` 控制数据和分页状态，使用 `pagination` 监听分页变化。

同一轮更新中的分页变化会合并为一次 `pagination` 事件（包括修改每页条数后的页码修正），在 Vue 本轮更新结束后发出，避免触发重复请求。`update:currentPage` / `update:pageSize` 仍按状态变化分别发出。

ESM 与 CJS 均保留。样式入口供构建工具处理；不要在纯 Node 环境直接执行 CSS / SCSS 导入。

## 检查命令

开发环境使用 Node.js 22.12+ 和仓库声明的 pnpm 版本。

```bash
pnpm check
```

依次执行 lint、源码类型检查、测试代码类型检查、组件回归测试、库构建、公共类型测试、真实 tarball 消费测试。后者验证 ESM/CJS 导出、按需入口、安装、SSR、样式依赖与 CSS 打包。

PR 必须先通过质量门禁和文档构建。正式发布保留 Git 检查，不自动修复源码，不自动提交、不自动推送。
