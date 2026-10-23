# 更新记录

## 3.0.0

### 使用变化

- `ProSearchForm.buttonJustify` 默认为 `flex-end`，按钮区默认右对齐。
- 折叠仅隐藏字段布局，字段仍参与校验和重置。需要卸载字段时使用 `hidden`。
- `initSearch` 与 `autoSearch` 独立；关闭自动查询后，仍按 `initSearch` 决定是否初始化查询。
- `ProSearchForm.search()` 返回 `Promise<boolean>`，`reset()` 返回 `Promise<void>`。
- `ProFormFields<Model>`、`ProTableColumn<Row>` 检查字段路径和枚举取值，原先未报错的错误配置可能需要修改。
- 组件引用只声明实际暴露的方法，其他原生方法通过 `getInstance()` 访问。
- 同一轮更新中的分页变化合并为一次 `pagination` 事件，在 Vue 本轮更新结束后发出。

### 新增

- 表单字段支持 `visible`，只隐藏布局而不卸载字段。
- 字段模板插槽提供 `model / field / value / setValue` 上下文。
- 支持通过 `modelProp / modelEvent` 配置自定义组件的模型绑定。

### 修复

- 修复 CommonJS 入口加载、按需样式依赖和具名导入的 tree-shaking。
- 修复 `ProCol` 的数字断点、`span=0` 和动态属性更新。
- 修复空字段表单不显示操作插槽，以及内部模型更新覆盖外部监听器的问题。
- 手动查询、重置和卸载会取消待执行防抖，过期校验结果不再发出查询。
- lodash 辅助函数随组件库打包，不再要求单独安装 `lodash-es`。
- 包元数据中的许可证与仓库的 MIT LICENSE 保持一致。

### 文档

- 补齐引入方式、类型、事件和实例方法说明。
- 示例统一使用 JSX/TSX，站点导航和提示改为中文。

### 已知限制

- 关闭 `skipLibCheck` 时，当前 Element Plus/VueUse 的声明文件存在类型错误；同样的问题可在只导入 Element Plus 时复现。
