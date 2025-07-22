<template>
  <div class="demo-preview">
    <pro-checkbox-group
      v-model="value"
      :options="options"
      is-button
      size="small"
      fill="pink"
      text-color="#fff"
    />
    <pro-checkbox-group
      :model-value="['1']"
      :options="options"
      is-button
      size="small"
      fill="#66ccff"
      text-color="#fff"
      disabled
    />
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
