import type { TextProps } from 'element-plus'

export type ProHeaderProps = {
  /**
   * 是否显示分割线
   * @default true
   */
  divider?: boolean
  /**
   * 尺寸
   * @default default
   */
  size?: TextProps['size']
  /**
   * 底部边框线
   * @default false
   */
  border?: boolean
}
