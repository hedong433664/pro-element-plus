import { makeInstaller } from './utils'
import components from './registry'

export { ProHeader } from '../components/header'
export { ProCol } from '../components/col'
export { ProTable } from '../components/table'
export { ProForm } from '../components/form'
export { ProSearchForm } from '../components/search-form'

export * from '../components/header'
export * from '../components/col'
export * from '../components/table'
export * from '../components/form'
export * from '../components/search-form'

const installer = makeInstaller(components)

export default installer
