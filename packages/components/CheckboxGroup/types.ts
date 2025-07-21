import type {
  CheckboxGroupProps,
  CheckboxGroupValueType,
  CheckboxProps
} from "element-plus"

export type ProCheckboxGroupOption = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  /**
   * 选项禁用
   */
  disabled?: boolean
}

export type ProCheckboxGroupProps = {
  /**
   * @description 绑定值
   */
  modelValue: CheckboxGroupValueType
  /**
   * @description 选项列表
   */
  options: ProCheckboxGroupOption[]
  /**
   * @description 选项的label字段
   */
  labelKey?: string
  /**
   * @description 选项的value字段
   */
  valueKey?: string
  /**
   * @description 使用按钮样式
   */
  isButton?: boolean
  /**
   * @description 使用边框样式
   */
  isBorder?: CheckboxProps["border"]
  /**
   * @description 选项大小
   */
  size?: CheckboxGroupProps["size"]
  /**
   * @description 使用全选
   */
  useCheckAll?: boolean
  /**
   * @description 全选的label
   */
  checkAllLabel?: string
  /**
   * @description 排除的选项
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exclude?: any[]
  /**
   * @description 包含的选项
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  include?: any[]
  /**
   * @description 可被勾选的 checkbox 的最小数量
   */
  min?: CheckboxGroupProps["min"]
  /**
   * @description 可被勾选的 checkbox 的最大数量
   */
  max?: CheckboxGroupProps["max"]
  /**
   * @description 当按钮为活跃状态时的字体颜色
   */
  textColor?: CheckboxGroupProps["textColor"]
  /**
   * @description 当按钮为活跃状态时的边框和背景颜色
   */
  fill?: CheckboxGroupProps["fill"]
  /**
   * @description 是否禁用
   */
  disabled?: CheckboxGroupProps["disabled"]
}
