import type { App, Plugin } from 'vue'

export function makeInstaller(components: Plugin[]) {
  return (app: App) => {
    components.forEach((component) => app.use(component))
  }
}

export {
  withInstall,
  type SFCWithInstall,
} from '../../components/_utils/install'
