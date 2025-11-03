import type { ColProps } from 'element-plus'

export type ProColProps = Partial<ColProps> & {
  /**
   * 是否使用栅格布局
   * @default true
   */
  useGrid?: boolean
  /**
   * 是否填充
   * @default false
   */
  isFull?: boolean
}
