<template>
  <div class="global-page-container">
    <div class="base">
      <h3>基础用法</h3>
      <ProHeader>这是一个标题</ProHeader>
    </div>

    <div class="use-divider">
      <h3>分割线</h3>
      <ProHeader divider>显示分割线</ProHeader>
    </div>

    <div class="use-border">
      <h3>下划线</h3>
      <ProHeader border>显示下划线</ProHeader>
    </div>

    <div class="use-size">
      <h3>尺寸</h3>
      <ProHeader divider size="small">小尺寸</ProHeader>
      <ProHeader divider>默认尺寸</ProHeader>
      <ProHeader divider size="large">大尺寸</ProHeader>
    </div>

    <div class="use-slot">
      <h3>右侧插槽</h3>
      <ProHeader border>
        使用插槽
        <template #right>
          <el-button type="primary">添加联系人</el-button>
        </template>
      </ProHeader>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.global-page-container {
  gap: 20px;
}
</style>
