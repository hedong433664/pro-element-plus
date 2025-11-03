<template>
  <div :class="['pro-header', `pro-header__${props.size}`]">
    <div class="pro-header__inner">
      <div class="pro-header__block"></div>
      <div :class="[`pro-header-text`, { full: !props.divider }]">
        <slot></slot>
      </div>
      <el-divider v-if="props.divider" />
      <div v-if="$slots.right" class="pro-header-right">
        <slot name="right"></slot>
      </div>
    </div>
    <el-divider v-if="props.border" class="pro-header__border" />
  </div>
</template>

<script setup lang="ts">
import { ElDivider } from 'element-plus'

import type { ProHeaderProps } from './types'

defineOptions({
  name: 'ProHeader',
})

defineSlots<{
  /**
   * 默认插槽
   */
  default: any
  /**
   * 右侧扩展插槽
   */
  right: any
}>()

const props = withDefaults(defineProps<ProHeaderProps>(), {
  size: 'default',
  border: false,
  divider: false,
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
