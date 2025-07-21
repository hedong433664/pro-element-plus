<template>
  <div class="pro-radio-group">
    <el-radio-group
      v-model="modelValue"
      :size="size"
      :text-color="textColor"
      :fill="fill"
      @change="handleChange"
    >
      <component
        :is="isButton ? ElRadioButton : ElRadio"
        v-for="item in innerOptions"
        :key="item[valueKey]"
        :value="item[valueKey]"
        :label="item[labelKey]"
        :disabled="disabled || item.disabled"
        :border="isBorder"
      >
        <slot name="default" :option="item">
          {{ item[labelKey] }}
        </slot>
      </component>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ElRadioGroup, ElRadioButton, ElRadio } from "element-plus"
import type { ProRadioGroupProps, ProRadioGroupValueType } from "./types"
import type { ProRadioGroupOption } from "./types"
import "element-plus/theme-chalk/src/radio-group.scss"
import "element-plus/theme-chalk/src/radio.scss"
import "element-plus/theme-chalk/src/radio-button.scss"

defineOptions({
  name: "ProRadioGroup"
})

interface Emits {
  (e: "change", val: ProRadioGroupValueType, checkedOption: ProRadioGroupOption): void
}

const modelValue = defineModel<ProRadioGroupValueType>()
const emit = defineEmits<Emits>()
const props = withDefaults(defineProps<ProRadioGroupProps>(), {
  labelKey: "label",
  valueKey: "value",
  size: "default",
  isBorder: false,
  isButton: false,
  disabled: false,
  options: () => []
})

/**
 * 处理后的选项
 */
const innerOptions = computed(() => {
  const { include, exclude, options, valueKey } = props

  if (include && include.length) {
    return options.filter(item => include.includes(item[valueKey]))
  }
  if (exclude && exclude.length) {
    return options.filter(item => !exclude.includes(item[valueKey]))
  }
  return options
})

/**
 * 选项值改变
 */
const handleChange = (val: ProRadioGroupValueType) => {
  const checkedOption: ProRadioGroupOption =
    innerOptions.value.find(item => item[props.valueKey] === val) || {}
  emit("change", val, checkedOption)
}
</script>

<style lang="scss" scoped>
.pro-radio-group {
  display: flex;
}
</style>
