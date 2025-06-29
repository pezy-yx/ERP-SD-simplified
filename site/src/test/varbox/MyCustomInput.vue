<template>
  <div style="border:1px dashed #409EFF; padding:10px;">
    <div>🌟 这是外部钩子自定义组件</div>
    <input
      :value="currentValue"
      @input="onInput"
      :readonly="readonly"
      style="width: 200px;"
    />
    <div style="color:#888;font-size:12px;">当前值：{{ currentValue }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { VarTree, VarNode, validators, VarNodeConfig, VarNodeValue } from '@/utils/VarTree'

const props = defineProps<{
  varTree: VarTree
  nodePath: string[]
  readonly?: boolean
  contentValidator?: ((val: any) => boolean) | null
  config?: VarNodeConfig
  indentLevel?: number
  showLabel?: boolean
  wrapperStyle?: Record<string, any>
}>()

const currentNode = computed<VarNode | null>(() => {
  return props.varTree.findNodeByPath(props.nodePath)
})

const currentValue = computed<VarNodeValue>(() => {
  return currentNode.value?.currentValue || ""
})

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  // 这里需要用 defineEmits
  emit('update', val)
}

const emit = defineEmits<{
  (e: 'update', val: any): void
}>()
</script>