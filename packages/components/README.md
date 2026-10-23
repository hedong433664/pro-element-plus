# @pro-element-plus/components

组件源码、类型和样式。

## 目录

```text
components
├─ col/           ProCol
├─ form/          ProForm
├─ search-form/   ProSearchForm
├─ header/        ProHeader
├─ table/         ProTable
├─ _utils/        公共类型与安装函数
├─ styles/        样式源码
└─ index.ts       组件导出
```

每个组件的文件结构：

```text
<component>
├─ src/           实现与类型
├─ style/         样式依赖入口
└─ index.ts       导出与安装
```

## 样式

`style/index.ts` 与 `style/css.ts` 记录样式依赖，构建脚本据此生成发布包的样式入口。公共样式位于 `styles/`。

## 调试与构建

在仓库根目录执行：

```bash
pnpm dev
pnpm build
pnpm check
```

组件通过 `core` 构建和发布，不单独发布此包。
