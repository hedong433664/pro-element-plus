<template>
  <el-col v-if="props.useGrid" v-bind="colProps">
    <slot />
  </el-col>
  <div
    v-else
    :class="['pro-col__not-grid', { 'pro-col__full': props.full }]"
    :style="{ paddingLeft: `${padding}px`, paddingRight: `${padding}px` }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { ElCol, rowContextKey } from 'element-plus'
import type { ProColProps } from './types'

defineOptions({ name: 'ProCol' })
defineSlots<{ default?: () => any }>()

const props = withDefaults(defineProps<ProColProps>(), {
  useGrid: true,
  full: false,
})
const row = inject(rowContextKey, undefined)
const padding = computed(() => Math.max(0, row?.gutter.value ?? 0) / 2)
const colProps = computed(() => {
  const { useGrid: _useGrid, full: _full, ...rest } = props
  const span = props.span ?? 24
  if (span === 24) return { ...rest, span }
  return {
    ...rest,
    span,
    xs: props.xs ?? 24,
    sm: props.sm ?? 12,
    md: props.md ?? 8,
    lg: props.lg ?? span,
    xl: props.xl ?? span,
  }
})
</script>
