# 更新记录

## 3.1.0

### 新增

- 新增 `ProSearchTable`，组合 `ProSearchForm` 和 `ProTable`，对外属性平铺，`size` 同时作用于表单、按钮和表格。
- 通过必填 `request({ query, currentPage, pageSize })` 获取 `{ data, total }`，组件内部管理数据、总数和加载状态。
- 查询提交时保存条件快照，翻页和刷新使用已提交条件；重新查询或修改每页条数时返回第一页。连续请求只应用最新结果。
- 提供 `search()`、`reload()`、`reset()`、请求成功与失败事件，以及表单、表格实例访问方法。
- 支持 `search-*`、`table-*` 插槽转发，提供查询按钮区、工具栏插槽，并透传原生表格事件。
- 补齐组件导出、全局类型、按需样式入口和自动导入 resolver。

### 修复

- 修复文档深色模式引入默认样式后，自定义主色被蓝色覆盖的问题。
- 隔离文档 Markdown 排版与示例样式，移除干扰表格布局的覆盖，修复固定列随横向滚动移动的问题。
- 评分进度条改用主题变量，不再写死蓝色和绿色。

### 文档与示例

- 文档、play 和 app 增加查询表格的基础用法、插槽、隐藏分页、多选和树形数据示例。
- 补充关键字、部门、状态、城市、评分和日期范围的组合筛选，以及角色、状态、评分和操作列。
- 查询表单收起时保留一项；示例不指定 `size`，表格高度统一为 `320px`，固定序号列和操作列。
- 基础示例演示防抖自动查询，其余示例使用手动查询。

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
