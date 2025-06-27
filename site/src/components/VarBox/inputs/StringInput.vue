<template>
  <input
    type="text"
    v-model="inputValue"
    :readonly="readonly"
    :placeholder="placeholder"
    :class="inputClass"
    @input="handleInput"
    @blur="handleBlur"
    @keyup.enter="handleEnter"
  />
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { VarNode } from '@/utils/VarTree'
import { SimpleInputBoxProps, SimpleInputBoxEmits } from './InputProps';

const props = defineProps(SimpleInputBoxProps)
const emit = defineEmits(SimpleInputBoxEmits)

const inputValue = ref<string>(
  (typeof props.modelValue === 'number' || typeof props.modelValue === 'string')
    ? String(props.modelValue)
    : ''
)

const inputClass = computed(()=>({
        'string-input': true,
        'readonly': props.readonly
      }))

watch(() => props.modelValue, (newValue)=>{
  if (typeof newValue === 'number' || typeof newValue === 'string') {
    inputValue.value = String(newValue);
  } else {
    inputValue.value = '';
  }
}, { immediate: true })

function handleInput() {
  emit('update:modelValue', inputValue.value);
}

function handleBlur() {
  emit('blur', inputValue.value);
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
.string-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.string-input:focus {
  outline: none;
  border-color: #409EFF;
}

.string-input.readonly {
  background-color: #F5F7FA;
  cursor: not-allowed;
}
</style>