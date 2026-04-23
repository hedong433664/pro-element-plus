# @pro-element-plus/app

## 包说明

`app` 是业务接入示例工程，用来模拟组件库在真实项目中的使用方式。这里更偏向“消费侧”视角，重点验证组件在常规应用中的集成体验，而不是组件库本身的开发细节。

## 当前工程结构

```text
app
├─ src/                 应用源码
├─ components.d.ts      自动导入生成的组件类型
├─ vite.config.ts       Vite 配置
├─ tsconfig*.json       TypeScript 配置
└─ package.json         当前子包脚本与依赖
```

## 作用

- 验证组件库在业务项目中的安装与使用方式
- 检查自动导入、样式引入、类型提示是否符合预期
- 模拟真实页面场景，提前发现集成问题

## 开发方式

常用命令：

```bash
pnpm --filter @pro-element-plus/app dev
pnpm --filter @pro-element-plus/app build
```

开发时默认依赖工作区里的 `@coderhd/pro-element-plus`，适合联调组件库改动。

## 开发规范

- 这里以“使用者视角”组织代码，不要把组件库内部实现逻辑搬到本包。
- 尽量通过真实业务页面验证组件能力，避免只写最小 demo。
- 如果某个问题只会在业务侧出现，优先在这里复现，再回到 `components` 或 `core` 修复。
- 与文档展示相关的示例放在 `docs` 或 `play`，不要让 `app` 承担过多演示职责。
