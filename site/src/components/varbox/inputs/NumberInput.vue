<template>
  <div class="number-input-container">
    <slot
      :name="`${pathString}--simple`"
      v-bind="slotScopeData"
    >
      <input
        type="text"
        v-model.number="inputValue"
        :readonly="readonly"
        :placeholder="placeholder"
        :class="inputClass"
        :min="config.min"
        :max="config.max"
        :step="config.step || 1"
        @input="handleInput"
        @blur="handleBlur"
        @keyup.enter="handleEnter"
      />
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { SimpleInputBoxProps, SimpleInputBoxEmitsWithNum } from './InputProps';
import {getPathString} from '../utils'

const props = defineProps(SimpleInputBoxProps)
const emit = defineEmits(SimpleInputBoxEmitsWithNum)
const slotScopeData = computed(() => ({
  handleInput: handleInput,
  blur: handleBlur,
  handleEnter: handleEnter,
  allProps: props,
}));
const pathString = computed<string>(()=>getPathString(props.tree, props.nodePath))

function parseValue(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  const num = Number(value)
  return isNaN(num) ? '' : num
}

const inputValue = ref<number | string>(parseValue(props.modelValue))

const inputClass = computed(() => ({
  'number-input': true,
  'readonly': props.readonly
}))

watch(() => props.modelValue, (newValue) => {
  inputValue.value = parseValue(newValue)
})

function handleInput() {
  emit('update:modelValue', inputValue.value)
}

function handleBlur() {
  emit('blur', inputValue.value)
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

  emit('enter', inputValue.value);
  emit('validation-error', '');
}
</script>

<style scoped>
.number-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.number-input:focus {
  outline: none;
  border-color: #409EFF;
}

.number-input.readonly {
  background-color: #F5F7FA;
  cursor: not-allowed;
}

/* 隐藏数字输入框的上下箭头 */
.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input[type=number] {
  -moz-appearance: textfield;
}
</style>