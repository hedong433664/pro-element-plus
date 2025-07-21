import { withInstall } from "@pro-element-plus/utils"
import RadioGroup from "./RadioGroup.vue"

export const ProRadioGroup = withInstall(RadioGroup)

export * from "./types"

declare module "vue" {
  export interface GlobalComponents {
    ProRadioGroup: typeof ProRadioGroup
  }
}
