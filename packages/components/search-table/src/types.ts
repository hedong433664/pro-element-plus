import type { FormItemProp } from 'element-plus'
import type { VNodeChild } from 'vue'
import type {
  ProSearchFormProps,
  ProSearchFormInstance,
} from '../../search-form/src/types'
import type { ProTableProps, ProTableInstance } from '../../table/src/table'

export interface ProSearchTableRequestParams<TQuery = Record<string, any>> {
  query: TQuery
  currentPage: number
  pageSize: number
}

export interface ProSearchTableRequestResult<TRow = Record<string, any>> {
  data: TRow[]
  total: number
}

export type ProSearchTableRequest<
  TQuery = Record<string, any>,
  TRow = Record<string, any>,
> = (
  params: ProSearchTableRequestParams<TQuery>,
) => Promise<ProSearchTableRequestResult<TRow>>

export type ProSearchTableProps<
  TQuery extends Record<string, any> = Record<string, any>,
  TRow extends Record<string, any> = Record<string, any>,
> = ProSearchFormProps<TQuery> &
  Omit<ProTableProps<TRow>, 'size' | 'data' | 'total'> & {
    request: ProSearchTableRequest<TQuery, TRow>
    /** 数据与请求状态只由 request 管理。 */
    data?: never
    total?: never
    loading?: never
  }

export type ProSearchTablePublicProps = ProSearchTableProps<any, any>

export interface ProSearchTableEmits {
  (event: 'search', query: Record<string, any>): void
  (event: 'reset'): void
  (event: 'collapsed', collapsed: boolean): void
  (event: 'validate', prop: FormItemProp, valid: boolean, message: string): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
  (event: 'pagination', currentPage: number, pageSize: number): void
  (
    event: 'request-success',
    result: ProSearchTableRequestResult,
    params: ProSearchTableRequestParams,
  ): void
  (
    event: 'request-error',
    error: unknown,
    params: ProSearchTableRequestParams,
  ): void
}

export interface ProSearchTableSlots {
  /** 查询按钮区的附加内容。 */
  'search-actions'?: () => VNodeChild
  /** 表单和表格之间的内容。 */
  toolbar?: () => VNodeChild
  /** search-<name> 转发表单字段插槽，table-<name> 转发表格插槽。 */
  [name: string]: ((scope: any) => VNodeChild) | undefined
}

export interface ProSearchTableInstance<TRow = Record<string, any>> {
  /** 防抖后校验并提交当前条件，返回第一页；返回值表示请求是否成功应用。 */
  search: () => Promise<boolean>
  /** 防抖后使用已提交条件和当前页重新请求；被后续操作替换时返回 false。 */
  reload: () => Promise<boolean>
  reset: () => Promise<void>
  getSearchFormInstance: () => ProSearchFormInstance | null
  getTableInstance: () => ProTableInstance | null
  readonly data: TRow[]
  readonly total: number
  readonly loading: boolean
  readonly currentPage: number
  readonly pageSize: number
}
