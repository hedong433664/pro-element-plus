<script setup lang="ts">
import { ref } from "vue"
import type { ProRadioGroupOption, ProRadioGroupValueType } from "pro-element-plus"

const value = ref("1")
const options: ProRadioGroupOption[] = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2", disabled: true },
  { label: "Option 3", value: "3" }
]

const handle = (value: ProRadioGroupValueType, option: ProRadioGroupOption) => {
  console.log(value, option)
}
</script>

<template>
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
</template>

<style scoped></style>
