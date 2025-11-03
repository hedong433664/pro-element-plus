<template>
  <el-row :gutter="20">
    <pro-col v-for="i in 6" :span="4" :key="i">
      <div class="col-item"></div>
    </pro-col>
  </el-row>
</template>

<script setup lang="ts">
import { ElRow } from 'element-plus'
</script>

<style scoped>
.col-item {
  height: 36px;
  margin-bottom: 20px;
  border-radius: 5px;
  background: var(--vp-c-gray-3);
}
</style>
