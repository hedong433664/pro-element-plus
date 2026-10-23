/**
 * 库构建：不打进 bundle 的依赖。
 * element-plus 也 external，避免构建产物内嵌 Element Plus 运行时代码，与导入组件库的应用共用同一份 Element Plus。
 * Vue / Element Plus 保持单实例；lodash-es 按需打包以兼容 CommonJS。
 */
export function isExternalLib(id: string): boolean {
  return (
    id === 'vue' ||
    id.startsWith('vue/') ||
    id === 'element-plus' ||
    id.startsWith('element-plus/') ||
    id === '@coderhd/pro-element-plus' ||
    id.startsWith('@coderhd/pro-element-plus/')
  )
}
