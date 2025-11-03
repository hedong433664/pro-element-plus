<template>
  <el-row :gutter="20">
    <pro-col :span="4">
      <div class="col-item"></div>
    </pro-col>

    <pro-col :use-grid="false">
      <div class="col-item">不使用栅格布局</div>
    </pro-col>

    <pro-col :span="6">
      <div class="col-item"></div>
    </pro-col>

    <pro-col :use-grid="false" is-full>
      <div class="col-item">不使用栅格布局，且填充</div>
    </pro-col>

    <pro-col>
      <div class="col-item"></div>
    </pro-col>
  </el-row>
</template>

<script setup lang="ts">
import { ElRow } from 'element-plus'
</script>

<style scoped>
.col-item {
  width: 100%;
  height: 36px;
  line-height: 36px;
  text-align: center;
  padding: 0 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  background: var(--vp-c-gray-3);
}
</style>
