<template>
  <component
    :is="
      useGrid
        ? h(ElCol, { ...colProps }, { ...slots })
        : h(
            'div',
            {
              class: ['pro-col__not-grid', { 'pro-col__full': full }],
              style: `padding-left: ${padding}px; padding-right: ${padding}px;`,
            },
            { ...slots },
          )
    "
  />
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, h } from 'vue'
import { ElCol } from 'element-plus'
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
  full: false,
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

const { useGrid, full, ...rest } = props
const instance = getCurrentInstance()

function findParentGutter() {
  let parent = instance?.parent

  while (parent) {
    const gutter = parent.props?.gutter
    if (typeof gutter === 'number') return gutter
    parent = parent.parent
  }

  return 0
}

const padding = computed(() => {
  const gutter = findParentGutter()
  return gutter > 0 ? gutter / 2 : 0
})

const colProps = computed(() => ({
  ...rest,
  ...getColLayout(props),
}))
</script>
