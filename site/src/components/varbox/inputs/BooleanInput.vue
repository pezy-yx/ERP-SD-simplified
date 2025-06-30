<template>
  <div class="boolean-input-container">
    <slot
      :name="`${pathString}--simple`"
      v-bind="slotScopeData"
    >
      <div class="boolean-input-wrapper">
        <input
          type="checkbox"
          v-model="inputValue"
          :disabled="readonly"
          :class="inputClass"
          @change="handleInput"
          @blur="handleBlur"
          @keyup.enter="handleEnter"
        />
        <!-- <span v-if="!readonly" class="boolean-label">{{ inputValue ? '是' : '否' }}</span>
        <span v-else class="boolean-label readonly">{{ inputValue ? '是' : '否' }}</span> -->
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { SimpleInputBoxProps, SimpleInputBoxEmitsWithBool } from './InputProps';
import {getPathString} from '../utils'

const props = defineProps({
  ...SimpleInputBoxProps,
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(SimpleInputBoxEmitsWithBool)

const slotScopeData = computed(() => ({
  handleInput: handleInput,
  blur: handleBlur,
  handleEnter: handleEnter,
  allProps: props,
}));

const pathString = computed<string>(() => getPathString(props.tree, props.nodePath))

const inputValue = ref<boolean>(Boolean(props.modelValue))

const inputClass = computed(() => ({
  'boolean-input': true,
  'readonly': props.readonly
}))

watch(() => props.modelValue, (newValue) => {
  inputValue.value = Boolean(newValue)
}, { immediate: true })

function handleInput() {
  emit('update:modelValue', inputValue.value);
}

function handleBlur() {
  emit('blur', inputValue.value.toString());
}

function handleEnter() {
  if (props.node?.config?.validators !== undefined) {
    for (const validator of props.node.config.validators) {
      const isValid = validator.creteria(inputValue.value);
      if (!isValid) {
        const message = validator.message || '输入值不符合要求'
        emit('validation-error', message);
        return;
      }
    }
  } else {
    emit('validation-error', '');
  }

  emit('enter', inputValue.value.toString());
  emit('validation-error', '');
}
</script>

<style scoped>
.boolean-input-container {
  display: flex;
  align-items: center;
}

.boolean-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.boolean-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #409EFF;
}

.boolean-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.boolean-label {
  font-size: 14px;
  color: #606266;
  user-select: none;
}

.boolean-label.readonly {
  color: #909399;
}

.boolean-input:focus {
  outline: 2px solid #409EFF;
  outline-offset: 2px;
}
</style>