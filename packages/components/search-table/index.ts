import { withInstall, type SFCWithInstall } from '../_utils/install'
import type { ElTable } from 'element-plus'
import SearchTable from './src/search-table.vue'

type NativeTableInstance = InstanceType<typeof ElTable>
type CamelizeEvent<T extends string> = T extends `${infer Head}-${infer Tail}`
  ? `${Head}${Capitalize<CamelizeEvent<Tail>>}`
  : T
type NativeTableEventProps = Pick<
  NativeTableInstance['$props'],
  Extract<keyof NativeTableInstance['$props'], `on${string}`>
>
type NativeTableEvents = NativeTableEventProps & {
  [K in keyof NativeTableEventProps as CamelizeEvent<
    K & string
  >]: NativeTableEventProps[K]
}
type SearchTableInstance = InstanceType<typeof SearchTable>
type SearchTableComponent = {
  new (): Omit<SearchTableInstance, '$props' | '$emit'> & {
    $props: SearchTableInstance['$props'] & NativeTableEvents
    $emit: SearchTableInstance['$emit'] & NativeTableInstance['$emit']
  }
}

export const ProSearchTable = /* @__PURE__ */ withInstall(
  SearchTable,
) as unknown as SFCWithInstall<SearchTableComponent>
export default ProSearchTable
export * from './src/types'
