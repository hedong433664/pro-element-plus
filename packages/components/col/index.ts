import { withInstall, type SFCWithInstall } from '../_utils/install'
import Col from './src/col.vue'

// 导出组件
export const ProCol: SFCWithInstall<typeof Col> =
  /* @__PURE__ */ withInstall(Col)
export default ProCol

// 导出类型
export * from './src/types'
