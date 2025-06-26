<template>
  <select
    v-model="inputValue"
    :disabled="readonly"
    :class="inputClass"
    @change="handleChange, handleEnter"
    @blur="handleBlur"
  >
    <option value="" disabled>{{ placeholder }}</option>
    <option
      v-for="option in options"
      :key="getOptionValue(option)"
      :value="getOptionValue(option)"
    >
      {{ getOptionLabel(option) }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { VarNode } from '@/utils/VarTree'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  config: {
    type: Object,
    default: () => ({})
  },
  node: {
    type: VarNode,
    default: null
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'blur', value: string | number): void;
  (e: 'enter', value: string | number): void;
  (e: 'validation-error', message: string): void;
}>()

const inputValue = ref<string | number>(props.modelValue || '')

const inputClass = computed(() => ({
  'selection-input': true,
  'readonly': props.readonly
}))

const options = computed(() => props.config.options || [])

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue || ''
})

function getOptionValue(option: any) {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option.value || option.key || option
}

function getOptionLabel(option: any) {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option.label || option.text || option.name || option.value || option
}

function handleChange() {
  emit('update:modelValue', inputValue.value)
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

function handleBlur() {
  emit('blur', inputValue.value)
}
</script>

<style scoped>
.selection-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s;
  cursor: pointer;
}

.selection-input:focus {
  outline: none;
  border-color: #409EFF;
}

.selection-input:disabled {
  background-color: #F5F7FA;
  cursor: not-allowed;
  color: #C0C4CC;
}

.selection-input.readonly {
  background-color: #F5F7FA;
  cursor: not-allowed;
}

/* 自定义下拉箭头样式 */
.selection-input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='m2 0-2 2h4zm0 5 2-2h-4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 32px;
}
</style>