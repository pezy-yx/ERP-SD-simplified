<template>
  <div class="string-input-container">
    <slot
      :name="`${pathString}--simple`"
      v-bind="slotScopeData"
    >
      <input
        type="text"
        v-model="inputValue"
        :readonly="readonly"
        :placeholder="placeholder"
        :class="inputClass"
        @blur="handleBlur"
        @focus="handleFocus"
        @keyup.enter="handleEnter"
      >
      
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { SimpleInputBoxProps, SimpleInputBoxEmits } from './InputProps';
import {getPathString} from '../utils'

const props = defineProps({...SimpleInputBoxProps,
  modelValue:{
    type: [String, Number],
    default: ""
  }
})
const emit = defineEmits(SimpleInputBoxEmits)

const slotScopeData = computed(() => ({
  blur: handleBlur,
  handleEnter: handleEnter,
  allProps: props,
}));
const pathString = computed<string>(()=>getPathString(props.tree, props.nodePath))
const inputValue = ref<string>(
  (typeof props.modelValue === 'number' || typeof props.modelValue === 'string')
    ? String(props.modelValue)
    : ''
)

const inputClass = computed(()=>({
        'string-input': true,
        'readonly': props.readonly
      }))

// 监听 inputValue 的变化，并 emit 给父组件
watch(inputValue, (newValue) => {
  // console.log("inputValue 变化了，通过 watch emit 给父组件:", newValue);
  emit('update:modelValue', newValue);
});

// 监听 props.modelValue 的变化，同步更新 inputValue
// 这用于处理父组件直接改变 modelValue 的情况 (例如重置)
watch(() => props.modelValue, (newValue) => {
  const newStringValue = (typeof newValue === 'number' || typeof newValue === 'string')
    ? String(newValue)
    : '';

  // 只有当 prop 的值与当前 inputValue 不同时才更新，避免无限循环
  // 因为 inputValue 的变化也会通过 watch 触发 update:modelValue
  if (inputValue.value !== newStringValue) {
    // console.log("Prop modelValue 变化，同步到 inputValue:", newStringValue);
    inputValue.value = newStringValue;
  }
}, { immediate: true });


function handleBlur() {
  emit('blur', inputValue.value);
}

function handleFocus() {
  emit('focus');
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
  const data = {
    nodePath: props.nodePath
  }
  if (props.node){
    emit('enter-from-node', props.node, inputValue.value, data);
  }
  emit('validation-error', '');
}
</script>

<style scoped>
/* .string-input {
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
} */
</style>