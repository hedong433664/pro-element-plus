import { withInstall, type SFCWithInstall } from '../_utils/install'
import Header from './src/header.vue'

// 导出组件
export const ProHeader: SFCWithInstall<typeof Header> =
  /* @__PURE__ */ withInstall(Header)
export default ProHeader

// 导出类型
export * from './src/types'
