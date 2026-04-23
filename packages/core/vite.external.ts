/**
 * 库构建：不打进 bundle 的依赖。
 * element-plus 也 external，避免构建产物内嵌 Element Plus 运行时代码，确保业务侧与组件库共用同一份 Element Plus。
 * vue / lodash-es 仍 external，由业务项目提供单一版本。
 */
export function isExternalLib(id: string): boolean {
  return (
    id === 'vue' ||
    id.startsWith('vue/') ||
    id === 'element-plus' ||
    id.startsWith('element-plus/') ||
    id === '@coderhd/pro-element-plus' ||
    id.startsWith('@coderhd/pro-element-plus/') ||
    id === 'lodash-es' ||
    id.startsWith('lodash-es/')
  )
}
