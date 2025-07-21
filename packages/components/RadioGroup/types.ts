import type { RadioGroupProps, RadioProps } from "element-plus"

export type ProRadioGroupValueType = string | number | boolean | undefined

export type ProRadioGroupOption = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  /**
   * 选项禁用
   */
  disabled?: boolean
}

export type ProRadioGroupProps = {
  /**
   * @description 绑定值
   */
  modelValue: ProRadioGroupValueType
  /**
   * @description 选项列表
   */
  options: ProRadioGroupOption[]
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
  isBorder?: RadioProps["border"]
  /**
   * @description 选项大小
   */
  size?: RadioGroupProps["size"]
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
   * @description 当按钮为活跃状态时的字体颜色
   */
  textColor?: RadioGroupProps["textColor"]
  /**
   * @description 当按钮为活跃状态时的边框和背景颜色
   */
  fill?: RadioGroupProps["fill"]
  /**
   * @description 是否禁用
   */
  disabled?: RadioGroupProps["disabled"]
}
