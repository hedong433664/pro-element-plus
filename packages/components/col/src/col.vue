<template>
  <component
    :is="
      useGrid
        ? h(ElCol, { ...colProps }, { ...slots })
        : h(
            'div',
            {
              class: ['pro-col-not-grid', { 'pro-col-full': isFull }],
              style: `padding-left: ${padding}px; padding-right: ${padding}px;`,
            },
            { ...slots },
          )
    "
  />
</template>

<script setup lang="ts">
import { computed, h, inject } from 'vue'
import { ElCol, rowContextKey } from 'element-plus'
import { isEmpty } from 'lodash-es'

import type { ProColProps } from './types'

defineOptions({
  name: 'ProCol',
})

const slots = defineSlots<{
  /**
   * 自定义默认内容
   */
  default: any
}>()

const props = withDefaults(defineProps<ProColProps>(), {
  useGrid: true,
  isFull: false,
})

const getColLayout = ({ span, xs, sm, md, lg, xl }: ProColProps) => {
  const _span = span || 24

  if (_span === 24) {
    return {
      xs,
      sm,
      md,
      lg,
      xl,
      span: _span,
    }
  }
  return {
    //<768px
    xs: !isEmpty(xs) ? xs : 24,
    //≥768px
    sm: !isEmpty(sm) ? sm : 12,
    // ≥992px
    md: !isEmpty(md) ? md : 8,
    // ≥1200px
    lg: !isEmpty(lg) ? lg : _span,
    // ≥1920px
    xl: !isEmpty(xl) ? xl : _span,
  }
}

const { useGrid, isFull, ...rest } = props
const { gutter } = inject(rowContextKey, { gutter: computed(() => 0) })
const padding = computed(() => (gutter.value ? gutter.value / 2 : 0))

const colProps = {
  ...rest,
  ...getColLayout(props),
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
