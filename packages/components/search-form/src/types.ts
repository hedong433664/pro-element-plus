import type { ProFormProps } from '../../form/src/types'

type buttonJustifyType =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'

export type ProSearchFormProps = ProFormProps & {
  /**
   * 是否初始化查询
   * @default true
   */
  initSearch?: boolean
  /***
   * 是否自动查询
   * @default false
   */
  autoSearch?: boolean
  /**
   * 自动查询防抖阈值
   * @default 500
   */
  autoSearchDebounce?: number
  /**
   * 是否重置后触发查询
   * @default true
   */
  refreshAfterSearch?: boolean
  /**
   * 查询、重置按钮对齐方式
   * @default end
   */
  buttonJustify?: buttonJustifyType
  /**
   * 是否隐藏查询按钮
   * @default false
   */
  hideSearchButton?: boolean
  /**
   * 是否隐藏重置按钮
   * @default false
   */
  hideResetButton?: boolean
  /**
   * 是否隐藏折叠按钮
   * @default false
   */
  hideCollapseButton?: boolean
  /**
   * 是否默认折叠
   * @default false
   */
  defaultCollapsed?: boolean
  /**
   * 重置按钮文字
   * @default 重置
   */
  refreshButtonText?: string
  /**
   * 查询按钮文字
   * @default 查询
   */
  searchButtonText?: string
  /**
   * 折叠按钮文字
   * @default 展开,收起
   */
  collapseButtonText?: [string, string]
  /**
   * 折叠后显示的表单项数量
   * @default 1
   */
  collapsedCount?: number
}

export type ProSearchFormEmits = {
  /**
   * 重置事件
   */
  (e: 'refresh'): void
  /**
   * 查询事件
   */
  (e: 'search', params?: Record<string, any>): void
  /**
   * 展开/收起事件
   */
  (e: 'collapsed', collapsed: boolean): void
}
