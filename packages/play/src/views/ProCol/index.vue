<template>
  <div class="global-page-container">
    <div class="base">
      <h3>基础用法</h3>

      <el-row :gutter="20">
        <pro-col v-for="i in 4" :span="6" :key="i">
          <div class="col-item">span 6</div>
        </pro-col>
      </el-row>
    </div>

    <div class="group">
      <h3>自由组合</h3>

      <el-row :gutter="20">
        <pro-col :span="4">
          <div class="col-item">span 4</div>
        </pro-col>

        <pro-col :use-grid="false">
          <div class="col-item">不使用栅格布局</div>
        </pro-col>

        <pro-col :span="6">
          <div class="col-item">span 6</div>
        </pro-col>

        <pro-col :use-grid="false" full>
          <div class="col-item">不使用栅格布局，且填充</div>
        </pro-col>

        <pro-col>
          <div class="col-item">span 24</div>
        </pro-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.el-row {
  width: 100%;
}
.col-item {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  padding: 0 10px;
  margin: 10px 0;
  border-radius: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--el-text-color-primary);
  background: var(--el-fill-color);
}
</style>
