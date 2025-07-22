import { makeInstaller } from "@pro-element-plus/utils"
import components from "./components"
import "@pro-element-plus/theme/index.scss"

const installer = makeInstaller(components)

export * from "../components"
export default installer
