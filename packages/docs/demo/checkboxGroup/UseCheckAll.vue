<template>
  <div class="demo-preview">
    <pro-checkbox-group
      v-model="value"
      :options="options"
      use-check-all
      check-all-label="坤坤必须是全部"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import type { ProCheckboxGroupOption } from "pro-element-plus"

const value = ref(["4"])
const options: ProCheckboxGroupOption[] = [
  { label: "唱", value: "1" },
  { label: "跳", value: "2" },
  { label: "rap", value: "3" },
  { label: "篮球", value: "4" }
]
</script>
