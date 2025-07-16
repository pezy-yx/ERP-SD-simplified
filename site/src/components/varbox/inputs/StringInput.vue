<template>
  <div class="string-input-container">
    <slot
      :name="`${pathString}--simple`"
      v-bind="slotScopeData"
    >
      <div class="input-wrapper" :class="{'has-dropdown': props.node?.varType === 'selection'}">
        <input
          type="text"
          v-model="inputValue"
          :readonly="readonly"
          :placeholder="placeholder"
          :class="inputClass"
          @blur="handleBlur"
          @focus="handleFocus"
          @keyup.enter="handleEnter"
          @click.stop="handleInputClick"
          @input="handleInput"
        >
        <div v-if="showDropdownComputed" class="dropdown-options" @click.stop>
          <div
            v-for="option in selectionOptions"
            :key="option"
            class="dropdown-option"
            @click.stop="selectOption(option)"
          >
            {{ option }}
          </div>
        </div>
      </div>
      
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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

const showDropdown = ref<boolean>(false)

const showDropdownComputed = computed(() => {
  return showDropdown.value && props.node?.varType === 'selection'
})

const selectionOptions = computed(() => {
  return props.node?.config?.options || []
})

const inputClass = computed(()=>({
        'string-input': true,
        'readonly': props.readonly,
        'selection-style': props.node?.varType === 'selection'
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

function handleInput() {
  const data = {
    nodePath: props.nodePath
  }
  if (props.node){
    emit('input-from-node', props.node, inputValue.value, data);
  }
}

function toggleShowDropdown() {
  showDropdown.value = !showDropdown.value;
}
function setShowDropdown(v: boolean) {
  showDropdown.value = v;
}
// 处理输入框点击事件
function handleInputClick() {
  if (props.node?.varType === 'selection' && !props.readonly) {
    toggleShowDropdown()
  }
}

// 选择下拉选项
function selectOption(option: string) {
  inputValue.value = option;
  setShowDropdown(false)
  handleEnter();
}

// 点击外部关闭下拉框
function closeDropdown() {
  if (showDropdown.value) {
    setShowDropdown(false)
  }
}

// 添加全局点击事件监听器
onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
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

/* 当varType为selection时，添加下拉箭头样式 */
.string-input.selection-style {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='m2 0-2 2h4zm0 5 2-2h-4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  cursor: pointer;
  box-sizing: border-box;
}

.string-input.selection-style.readonly {
  cursor: not-allowed;
}

/* 输入框包装器 */
.input-wrapper {
  position: relative;
  width: 100%;
}

/* 确保所有输入框都有相同的box-sizing */
.string-input {
  box-sizing: border-box;
  width: 100%;
}

/* 下拉选项容器 */
.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--theme-color-page);
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 4px;
}

/* 下拉选项 */
.dropdown-option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-option:hover {
  background-color: var(--theme-color-light-a);
}
</style>