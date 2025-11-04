import type {
  ComponentNamesMap,
  ComponentPropsMap,
  ComponentSlotsMap,
} from '@coderhd/pro-element-plus'

import type { ButtonInstance } from 'element-plus'

declare module '@coderhd/pro-element-plus' {
  // 扩展 ElButton 的类型
  export interface ComponentNamesMap {
    ElButton: 'ElButton'
  }
  export interface ComponentPropsMap {
    ElButton: ButtonInstance['$props']
  }
  export interface ComponentSlotsMap {
    ElButton: ButtonInstance['$slots']
  }
}
