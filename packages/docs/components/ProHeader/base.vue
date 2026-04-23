<template>
  <div>
    <ProHeader>这是一个标题</ProHeader>

    <ProHeader divider>显示分割线</ProHeader>

    <ProHeader border>显示下划线</ProHeader>

    <ProHeader divider size="small">小尺寸</ProHeader>
    <ProHeader divider>默认尺寸</ProHeader>
    <ProHeader divider size="large">大尺寸</ProHeader>

    <ProHeader divider border>
      使用插槽
      <template #right>
        <el-button type="primary">添加联系人</el-button>
      </template>
    </ProHeader>
  </div>
</template>

<script setup lang="ts">
import { ProHeader } from '@coderhd/pro-element-plus'
import { ElButton } from 'element-plus'
</script>

<style lang="scss" scoped></style>
