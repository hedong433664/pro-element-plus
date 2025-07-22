<template>
  <div class="demo-preview">
    <pro-checkbox-group v-model="value" :options="options" disabled />
    <pro-checkbox-group v-model="value2" :options="options2" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import type { ProCheckboxGroupOption } from "pro-element-plus"

const value = ref(["1"])
const value2 = ref(["1"])

const options: ProCheckboxGroupOption[] = [
  { label: "选项 1", value: "1" },
  { label: "选项 2", value: "2" },
  { label: "选项 3", value: "3" }
]

const options2: ProCheckboxGroupOption[] = [
  { label: "选项 1", value: "1" },
  { label: "选项 2", value: "2", disabled: true },
  { label: "选项 3", value: "3" }
]
</script>
