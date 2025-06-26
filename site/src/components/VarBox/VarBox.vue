<template>
  <VarInput
    v-if="props.tree"
    :varTree="props.tree"
    :nodePath="[]"
    :readonly="props.tree.root?.readonly"
    :config="props.tree.root?.config"
    :indentLevel="props.indentLevel"
    :showLabel="props.showLabel"
    :wrapperStyle="props.wrapperStyle"
  />
</template>

<script lang="ts" setup>
import VarInput from '@/components/VarBox/VarInput.vue'
import { VarTree } from '@/utils/VarTree';
const props = defineProps<{
  tree: VarTree,
  indentLevel?: number, 
  showLabel?: boolean,
  wrapperStyle?: Record<string, any>
}>()
</script>