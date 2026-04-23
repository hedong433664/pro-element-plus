# @@coderhd/pro-element-plus/docs

## 包说明

`docs` 是组件库的文档站点，基于 `VitePress` 构建。这里负责对外展示组件说明、示例、接入方式与 API 文档，是项目的主要说明入口。

## 当前工程结构

```text
docs
├─ .vitepress/          文档站配置、主题与样式
├─ components/          文档示例组件
├─ get-started.md       快速开始
├─ index.md             首页
├─ package.json         当前子包脚本与依赖
├─ tsconfig*.json       TypeScript 配置
└─ vite-env.d.ts        文档类型声明
```

## 作用

- 对外提供组件使用文档
- 展示标准示例与推荐接入方式
- 统一沉淀 API、约束和最佳实践

## 开发方式

常用命令：

```bash
pnpm --filter @@coderhd/pro-element-plus/docs dev
pnpm --filter @@coderhd/pro-element-plus/docs build
```

文档示例默认依赖工作区里的 `@coderhd/pro-element-plus`，适合随着组件更新同步维护。

## 开发规范

- 文档描述优先使用中文，术语尽量统一。
- 示例要与当前实际组件能力保持一致，不写“未来计划式”文档。
- API 描述要和 `components` / `core` 的真实导出保持同步。
- 文档中的代码示例要优先可运行，而不是只追求排版好看。
- 站点级改动涉及主题、样式或语言环境时，优先在 `.vitepress/theme` 里统一处理。

## 与其他子包的关系

- 示例源码可参考 `play`，但正式展示内容以 `docs` 为准。
- 文档里的接入方式要对应 `core` 的真实发包结果。
- 组件说明要基于 `components` 的真实能力，不自行定义额外行为。
