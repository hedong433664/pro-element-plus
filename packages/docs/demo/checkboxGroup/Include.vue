<template>
  <div class="demo-preview">
    <div>include="['1', '3'] 包含选项1、选项3</div>
    <pro-checkbox-group v-model="value" :options="options" :include="['1', '3']" />
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
