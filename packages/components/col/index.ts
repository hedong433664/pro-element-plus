import { withInstall, type SFCWithInstall } from 'element-plus/es/utils/index'
import Col from './src/col.vue'

// 导出组件
export const ProCol: SFCWithInstall<typeof Col> = withInstall(Col)
export default ProCol

// 导出类型
export * from './src/col'
