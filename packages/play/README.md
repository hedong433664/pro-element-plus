# @@coderhd/pro-element-plus/play

## 包说明

`play` 是组件库的本地调试与交互演示工程，主要用于开发阶段快速预览组件效果。这里强调“边改边看”，适合验证样式、交互、插槽、事件和类型表现。

## 当前工程结构

```text
play
├─ src/                 调试页面与演示视图
├─ components.d.ts      自动导入生成的组件类型
├─ vite.config.ts       本地预览配置
├─ tsconfig*.json       TypeScript 配置
└─ package.json         当前子包脚本与依赖
```

## 作用

- 作为组件开发时的第一预览现场
- 验证工作区源码在未发包状态下的运行效果
- 测试组件按需样式、自动导入与交互行为

## 开发方式

常用命令：

```bash
pnpm --filter @@coderhd/pro-element-plus/play dev
pnpm --filter @@coderhd/pro-element-plus/play build
```

本包通常会直接 alias 到工作区源码，适合联调 `components` 与 `core` 的改动。

## 开发规范

- 示例应覆盖当前组件的关键能力，但不要把 `play` 写成正式文档。
- 优先提供“可验证问题”的示例，例如分页、插槽、多级表头、事件透传等。
- 如果是临时调试页面，问题修复后应及时整理或删除，避免示例堆积。
- 影响外部文档理解的示例，请同步维护到 `docs`。
