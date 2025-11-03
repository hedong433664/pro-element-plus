<template>
  <div>
    <pro-header size="large">large 尺寸</pro-header>
    <pro-header size="default">default 尺寸</pro-header>
    <pro-header size="small">small 尺寸</pro-header>
    <pro-header divider>分割线</pro-header>
    <pro-header border>下边框</pro-header>
    <pro-header divider border>
      右侧插槽
      <template #right>
        <el-button type="primary" text>新增</el-button>
      </template>
    </pro-header>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
</script>

<style scoped></style>
