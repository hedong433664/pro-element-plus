import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

/** Rollup/Vite lib.entry：键为 `header/index`（仅含组件子包，排除 styles、node_modules 等） */
export function getComponentEntries(coreDir: string) {
  const componentsDir = resolve(coreDir, '../components')
  return Object.fromEntries(
    readdirSync(componentsDir, { withFileTypes: true })
      .filter((d) => {
        if (!d.isDirectory()) return false
        const name = d.name
        if (name === 'node_modules' || name === 'styles') return false
        return existsSync(resolve(componentsDir, name, 'index.ts'))
      })
      .map((d) => {
        const name = d.name
        return [`${name}/index`, resolve(componentsDir, name, 'index.ts')]
      }),
  )
}
