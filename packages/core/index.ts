import { makeInstaller } from "@pro-element-plus/utils"
import components from "./components"

const installer = makeInstaller(components)

export * from "@pro-element-plus/components"
export default installer
