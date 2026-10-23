import type { App, Component, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

/** Keep installation independent of Element Plus internal module paths. */
export function withInstall<T extends Component>(
  component: T,
): SFCWithInstall<T> {
  return Object.assign(component, {
    install(app: App) {
      const name = component.name
      if (!name) throw new Error('An installable component must have a name')
      app.component(name, component)
    },
  })
}
