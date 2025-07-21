<template>
  <div class="demo-preview">
    <pro-checkbox-group v-model="value" :options="options">
      <template #default="{ option: { label, value } }">
        {{ value === "2" ? label + "插槽" : label }}
      </template>
    </pro-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import type { ProCheckboxGroupOption } from "pro-element-plus"

const value = ref(["1"])
const options: ProCheckboxGroupOption[] = [
  { label: "选项 1", value: "1" },
  { label: "选项 2", value: "2" },
  { label: "选项 3", value: "3" }
]
</script>

<style lang="scss" scoped>
.demo-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
