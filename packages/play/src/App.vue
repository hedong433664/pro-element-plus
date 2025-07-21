<script setup lang="ts">
import { ref } from "vue"
import type {
  ProCheckboxGroupOption,
  ProRadioGroupOption,
  ProRadioGroupValueType
} from "pro-element-plus"
import type { CheckboxValueType } from "element-plus"

const value = ref("1")
const options: ProRadioGroupOption[] = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2", disabled: true },
  { label: "Option 3", value: "3" }
]

const handle = (value: ProRadioGroupValueType, option: ProRadioGroupOption) => {
  console.log(value, option)
}

const value2 = ref(["1"])
const options2: ProRadioGroupOption[] = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2", disabled: true },
  { label: "Option 3", value: "3" }
]

const handle2 = (value: CheckboxValueType[], option: ProCheckboxGroupOption[]) => {
  console.log(value, option)
}
</script>

<template>
  <div class="demo-preview">
    <pro-radio-group
      v-model="value"
      :options="options"
      size="large"
      is-button
      @change="handle"
    >
      <template #default="{ option: { label, disabled } }">
        {{ disabled ? label + "插槽" : label }}
      </template>
    </pro-radio-group>

    <pro-checkbox-group
      v-model="value2"
      :options="options2"
      size="large"
      @change="handle2"
    >
      <template #default="{ option: { label, disabled } }">
        {{ disabled ? label + "插槽" : label }}
      </template>
    </pro-checkbox-group>
  </div>
</template>

<style lang="scss" scoped>
.demo-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
