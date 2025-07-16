<template>
  <VarInput
    v-if="props.tree"
    :varTree="props.tree"
    :nodePath="[]"
    :readonly="props.tree.root?.readonly"
    :config="props.tree.root?.config"
    :indentLevel="props.indentLevel"
    :showLabel="true"
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
const props = defineProps<{
  tree: VarTree,
  indentLevel?: number, 
  showLabel?: boolean,
  wrapperStyle?: Record<string, any>
}>()
const emit = defineEmits<{
  (e: 'update', payload: any): void
}>()
function handleUpdate(payload: any) {
  emit('update', payload)
}
</script>