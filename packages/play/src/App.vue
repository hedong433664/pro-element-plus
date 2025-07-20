<script setup lang="ts">
import { ref } from "vue"

const value = ref("1")
const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" }
]
</script>

<template>
  <pro-radio-group v-model="value" :options="options"></pro-radio-group>
</template>

<style scoped></style>
