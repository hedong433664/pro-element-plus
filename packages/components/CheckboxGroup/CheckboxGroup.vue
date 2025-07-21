<template>
  <div class="pro-checkbox-group">
    <el-checkbox
      v-if="useCheckAll"
      v-model="checkAll"
      :label="checkAllLabel"
      :indeterminate="isIndeterminate"
      :border="isBorder"
      :size="size"
      :disabled="disabled"
      @change="handleCheckAllChange"
    />

    <el-checkbox-group
      v-model="modelValue"
      :size="size"
      :text-color="textColor"
      :fill="fill"
      :min="min"
      :max="max"
      @change="handleChange"
    >
      <component
        :is="isButton ? ElCheckboxButton : ElCheckbox"
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
    </el-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { ProCheckboxGroupOption, ProCheckboxGroupProps } from "./types"
import {
  ElCheckboxGroup,
  ElCheckboxButton,
  ElCheckbox,
  type CheckboxValueType
} from "element-plus"
import "element-plus/theme-chalk/src/checkbox-group.scss"
import "element-plus/theme-chalk/src/checkbox.scss"
import "element-plus/theme-chalk/src/checkbox-button.scss"

defineOptions({
  name: "ProCheckboxGroup"
})

interface Emits {
  (e: "change", val: CheckboxValueType[], checkedOptions: ProCheckboxGroupOption[]): void
}

const modelValue = defineModel<ProCheckboxGroupProps["modelValue"]>()
const emits = defineEmits<Emits>()
const props = withDefaults(defineProps<ProCheckboxGroupProps>(), {
  labelKey: "label",
  valueKey: "value",
  size: "default",
  isBorder: false,
  isButton: false,
  useCheckAll: false,
  checkAllLabel: "全选",
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
 * 全选
 */
const checkAll = ref(false)

/**
 * 是否半选
 */
const isIndeterminate = computed(() => {
  return (
    modelValue.value!.length > 0 && modelValue.value!.length < innerOptions.value.length
  )
})

/**
 * 全选改变
 */
const handleCheckAllChange = (val: CheckboxValueType) => {
  // 全选不能选中禁用项
  const valArr = innerOptions.value
    .filter(item => !item.disabled)
    .map(item => item[props.valueKey])
  modelValue.value = val ? valArr : []

  handleChange(modelValue.value as CheckboxValueType[])
}

/**
 * 选项值改变
 */
const handleChange = (val: CheckboxValueType[]) => {
  const checkedOptions: ProCheckboxGroupOption[] = innerOptions.value.filter(item => {
    return val.includes(item[props.valueKey])
  })
  emits("change", val, checkedOptions)
}
</script>

<style lang="scss" scoped>
.pro-checkbox-group {
  display: flex;
  gap: 30px;
}
</style>
