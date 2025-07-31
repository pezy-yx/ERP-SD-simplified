<template>
  <VarInput
    v-if="props.tree"
    :varTree="props.tree"
    :nodePath="props.path ?? []"
    :readonly="props.tree.root?.readonly"
    :config="props.tree.root?.config"
    :indentLevel="props.indentLevel"
    :showLabel="showLabel"
    :wrapperStyle="props.wrapperStyle"
    @update="handleUpdate"
    v-bind="$attrs"
    :key="props.tree.forceUpdateKey.value"
  >
    <!-- 透传插槽 -->
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps: any">
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>
  </VarInput>
</template>

<script lang="ts" setup>
import VarInput from '@/components/varbox/VarInput.vue'
import { VarTree } from '@/utils/VarTree';
import { computed } from 'vue'
const props = defineProps<{
  tree: VarTree,
  indentLevel?: number, 
  // showLabel?: boolean,
  wrapperStyle?: Record<string, any>
  path?: string[]
  hideLabel?: boolean
}>()
const emit = defineEmits<{
  (e: 'update', payload: any): void
}>()
function handleUpdate(payload: any) {
  emit('update', payload)
}
const showLabel = computed(()=>{
  if(props.hideLabel == true){
    return false
  }
  return true
})
</script>