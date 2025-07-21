<template>
  <div class="demo-preview">
    <pro-checkbox-group
      v-model="value"
      :options="options"
      label-key="customLabel"
      value-key="customValue"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import type { ProCheckboxGroupOption } from "pro-element-plus"

const value = ref(["1"])
const options: ProCheckboxGroupOption[] = [
  { customLabel: "选项 1", customValue: "1" },
  { customLabel: "选项 2", customValue: "2" },
  { customLabel: "选项 3", customValue: "3" }
]
</script>

<style lang="scss" scoped>
.demo-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
