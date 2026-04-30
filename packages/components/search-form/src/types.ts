import type { FormItemProp } from 'element-plus'

import type {
  ProFormEmits,
  ProFormFields,
  ProFormInstance,
  ProFormProps,
  ProFormSlots,
} from '../../form/src/types'

export type ProSearchFormButtonJustify =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

export type ProSearchFormProps<
  TModel extends Record<string, any> = Record<string, any>,
> = ProFormProps<TModel> & {
  initSearch?: boolean
  autoSearch?: boolean
  autoSearchDebounce?: number
  resetAfterSearch?: boolean
  buttonJustify?: ProSearchFormButtonJustify
  hideSearchButton?: boolean
  hideResetButton?: boolean
  hideCollapseButton?: boolean
  defaultCollapsed?: boolean
  resetButtonText?: string
  searchButtonText?: string
  collapseButtonText?: [string, string]
  collapsedCount?: number
}

export type ProSearchFormPublicProps = ProSearchFormProps<any>

export interface ProSearchFormEmits extends ProFormEmits {
  (event: 'reset'): void
  (event: 'search', params?: Record<string, any>): void
  (event: 'collapsed', collapsed: boolean): void
  (
    event: 'validate',
    prop: FormItemProp,
    isValid: boolean,
    message: string,
  ): void
}

export interface ProSearchFormSlots extends ProFormSlots {
  default?: () => any
}

export interface ProSearchFormInstance extends ProFormInstance {
  reset: () => void
  search: () => void
  toggleCollapse: () => void
}

export type ProSearchFormFields<
  TModel extends Record<string, any> = Record<string, any>,
> = ProFormFields<TModel>
