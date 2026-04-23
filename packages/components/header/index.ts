import { withInstall, type SFCWithInstall } from 'element-plus/es/utils/index'
import Header from './src/header.vue'

// 导出组件
export const ProHeader: SFCWithInstall<typeof Header> = withInstall(Header)
export default ProHeader

// 导出类型
export * from './src/header'
