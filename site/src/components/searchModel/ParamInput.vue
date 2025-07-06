<template>
  <div class="param-input-container">
    <VarBox
      v-if="varTree"
      :tree="varTree"
      @update="handleUpdate"
    />
    <div v-else class="no-params">
      <p>此搜索方式无需输入参数</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VarBox from '@/components/varbox/VarBox.vue'
import { VarTree } from '@/utils/VarTree'

// 定义props
const props = defineProps<{
  varTree: VarTree | null
}>()

// 定义emits
const emit = defineEmits<{
  (e: 'update', payload: any): void
}>()

// 处理参数更新
function handleUpdate(payload: any) {
  emit('update', payload)
}
</script>

<style scoped>
.param-input-container {
  width: 100%;
  height: 100%;
}

.no-params {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-primary);
  font-family: var(--theme-font-family);
}

.no-params p {
  margin: 0;
  font-size: 16px;
  color: #666;
}
</style>