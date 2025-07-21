import { withInstall } from "@pro-element-plus/utils"
import CheckboxGroup from "./CheckboxGroup.vue"

export const ProCheckboxGroup = withInstall(CheckboxGroup)

export * from "./types"

declare module "vue" {
  export interface GlobalComponents {
    ProCheckboxGroup: typeof ProCheckboxGroup
  }
}
