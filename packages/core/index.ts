import { makeInstaller } from '@pro-element-plus/utils'
import components from './components'

const installer = makeInstaller(components)

export * from '../components'
export default installer
