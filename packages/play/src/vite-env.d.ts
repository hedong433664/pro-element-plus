/// <reference types="vite/client" />

// import type { ProFormComponentTypeMap } from '@coderhd/pro-element-plus'
import type { ButtonInstance } from 'element-plus'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_PORT: string
  readonly VITE_APP_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@coderhd/pro-element-plus' {
  interface ProFormComponentTypeMap {
    ElButton: {
      props: ButtonInstance['$props']
      slots: ButtonInstance['$slots']
    }
  }
}
