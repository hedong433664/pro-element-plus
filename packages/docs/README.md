# @pro-element-plus/docs

使用 VitePress 构建的文档站点。

## 目录

- `.vitepress/`：站点配置、主题和样式。
- `components/`：组件说明与演示。
- `get-started.md`：安装和引入方式。
- `api-examples.md`：用法示例。
- `scripts/typecheck.mjs`：文档类型检查。

## 命令

在仓库根目录执行：

```bash
pnpm docs:dev
pnpm docs:build
pnpm --filter @pro-element-plus/docs typecheck
```

类型检查覆盖示例组件、站点配置和 Markdown 中完整的 Vue 单文件代码块。临时提取的代码块在检查结束后删除。

文档构建先执行类型检查。根目录的 `pnpm test` 会在未全局注册组件的环境中挂载演示，检查组件和指令是否可以解析。

页面、导航和提示使用中文，组件名、代码标识符和命令保持原样。
