import type { App, Plugin } from 'vue'
import { withInstall, type SFCWithInstall } from 'element-plus/es/utils/index'

export function makeInstaller(components: Plugin[]) {
  const install = (app: App) => {
    components.forEach((component) => {
      app.use(component)
    })
  }

  return install
}

export { withInstall, type SFCWithInstall }
