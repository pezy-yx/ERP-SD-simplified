<template>
  <div class="date-input-container">
    <slot
      :name="`${pathString}--simple`"
      v-bind="slotScopeData"
    >    
      <slot
        :name="`${pathString}--simple-input-group`"
        v-bind="slotScopeData"
      >
        <div class="date-input-group">
          <input
            type="text"
            v-model="displayValue"
            :readonly="readonly"
            :placeholder="placeholder"
            :class="inputClass"
            @input="handleTextInput"
            @blur="handleBlur"
            @keyup.enter="handleEnter"
          />
          <button
            v-if="!readonly"
            type="button"
            class="date-picker-btn"
            @click="showDatePicker"
            :disabled="readonly"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="3" y="5" width="14" height="12" rx="2" stroke="#606266" stroke-width="1.5" fill="#fff"/>
              <path d="M3 8H17" stroke="#606266" stroke-width="1.5"/>
              <rect x="6" y="11" width="2" height="2" rx="1" fill="#606266"/>
              <rect x="9" y="11" width="2" height="2" rx="1" fill="#606266"/>
              <rect x="12" y="11" width="2" height="2" rx="1" fill="#606266"/>
              <path d="M7 3V6" stroke="#606266" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M13 3V6" stroke="#606266" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </slot>
      <input
        v-if="showPicker"
        type="date"
        v-model="dateValue"
        :min="config.minDate"
        :max="config.maxDate"
        @change="handleDateChange"
        @blur="hideDatePicker"
        class="date-picker"
        ref="datePicker"
      />
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import { SimpleInputBoxProps, SimpleInputBoxEmits } from './InputProps';
import {getPathString} from '../utils'
import { VarNode, VarTree } from '@/utils/VarTree'

const props = defineProps(SimpleInputBoxProps)
const emit = defineEmits(SimpleInputBoxEmits)

const displayValue = ref<string>(props.modelValue || '')
const dateValue = ref<string>(formatToDateInput(props.modelValue))
const showPicker = ref(false)

const slotScopeData = computed(() => ({
  handleInput: handleTextInput,
  handleTextInput: handleTextInput,
  blur: handleBlur,
  handleEnter: handleEnter,
  showDatePicker: showDatePicker,
  handleDateChange: handleDateChange,
  hideDatePicker: hideDatePicker,
  allProps: props,
}));
const pathString = computed<string>(()=>getPathString(props.tree, props.nodePath))

const inputClass = computed(() => ({
  'date-input': true,
  'readonly': props.readonly
}))

watch(() => props.modelValue, (newValue) => {
  displayValue.value = newValue || ''
  dateValue.value = formatToDateInput(newValue)
})

function formatToDateInput(dateStr: string) {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return ''
  }
}

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return dateStr
  }
}

function handleTextInput() {
  emit('update:modelValue', displayValue.value)
}

function handleDateChange() {
  if (dateValue.value) {
    displayValue.value = formatDisplayDate(dateValue.value)
    emit('update:modelValue', displayValue.value)
  }
  hideDatePicker()
}

function handleBlur() {
  emit('blur', displayValue.value)
}

function handleEnter() {
  if (props.node?.config?.validators !== undefined) {
    for (const validator of props.node.config.validators) {
      const isValid = validator.creteria(displayValue.value);
      if (!isValid) {
        const message = validator.message || '输入值不符合要求'
        emit('validation-error', message);
        return;
      }
    }
  } else {
    emit('validation-error', '');
  }

  emit('enter', displayValue.value);
  emit('validation-error', '');
}

function showDatePicker() {
  if (props.readonly) return
  showPicker.value = true
  nextTick(() => {
    const picker = document.querySelector<HTMLInputElement>('.date-picker')
    if (picker) picker.focus()
  })
}

function hideDatePicker() {
  setTimeout(() => {
    showPicker.value = false
  }, 200)
}
</script>

<style scoped>
.date-input-container {
  position: relative;
  width: 100%;
}

.date-input-group {
  display: flex;
  align-items: center;
}

/* .date-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #DCDFE6;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  transition: border-color 0.2s;
} */

/* .date-input:focus {
  outline: none;
  border-color: #409EFF;
} */

/* .date-input.readonly {
  background-color: #F5F7FA;
  cursor: not-allowed;
  border-radius: 4px;
} */

.date-picker-btn {
  /* padding: 8px 12px; */
  /* border: 1px solid #DCDFE6; */
  border: none;
  border-left: none;
  border-radius: 0 4px 4px 0;
  background-color: transparent;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.date-picker-btn:hover:not(:disabled) {
  background-color: #ECF5FF;
}

.date-picker-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.date-picker {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-top: 2px;
  padding: 8px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>