<template>
  <div class="demo-preview">
    <pro-checkbox-group v-model="value" :options="options" is-border size="small" />
    <pro-checkbox-group v-model="value" :options="options" is-border size="default" />
    <pro-checkbox-group v-model="value" :options="options" is-border size="large" />
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
