import type { ComponentResolver } from 'unplugin-vue-components'

const PACKAGE_NAME = '@coderhd/pro-element-plus'

export interface ProElementPlusResolverOptions {
  /**
   * 是否自动引入对应组件的按需样式（`@coderhd/pro-element-plus/es/<name>/style`）
   * @default true
   */
  importStyle?: boolean
}

/**
 * `unplugin-vue-components` 解析器：将模板中以 `Pro` 开头的标签解析到
 * `@coderhd/pro-element-plus/es/<kebab>`，例如 `ProHeader` → `@coderhd/pro-element-plus/es/header`。
 */
export function ProElementPlusResolver(
  options: ProElementPlusResolverOptions = {},
): ComponentResolver {
  const { importStyle = true } = options

  return {
    type: 'component',
    resolve: (name: string) => {
      if (!name.startsWith('Pro')) return
      const dir = proNameToKebabDir(name)
      if (!dir) return

      const resolved: {
        name: string
        from: string
        sideEffects?: string[]
      } = {
        name,
        from: `${PACKAGE_NAME}/es/${dir}`,
      }

      if (importStyle) {
        resolved.sideEffects = [`${PACKAGE_NAME}/es/${dir}/style`]
      }

      return resolved
    },
  }
}

/** ProHeader → header；ProDataTable → data-table */
function proNameToKebabDir(name: string): string | undefined {
  if (name.length <= 3 || !name.startsWith('Pro')) return
  const rest = name.slice(3)
  if (!rest) return
  return pascalToKebab(rest)
}

function pascalToKebab(s: string): string {
  return s
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}
