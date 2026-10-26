<template>
  <div class="global-page-container">
    <ProHeader divider>基础用法（自动查询）</ProHeader>
    <BaseDemo />

    <ProHeader divider>插槽用法</ProHeader>
    <SlotsDemo />

    <ProHeader divider>隐藏分页</ProHeader>
    <HidePaginationDemo />

    <ProHeader divider>多选</ProHeader>
    <SelectionDemo />

    <ProHeader divider>树形数据</ProHeader>
    <TreeDemo />
  </div>
</template>

<script setup lang="ts">
import BaseDemo from './base.vue'
import SlotsDemo from './slots.vue'
import HidePaginationDemo from './hide-pagination.vue'
import SelectionDemo from './selection.vue'
import TreeDemo from './tree.vue'
</script>
