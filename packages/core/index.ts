import { makeInstaller } from './utils'
import components from './registry'

export { ProHeader } from '../components/header'
export { ProCol } from '../components/col'
export { ProTable } from '../components/table'

export * from '../components/header'
export * from '../components/col'
export * from '../components/table'

const installer = makeInstaller(components)

export default installer
