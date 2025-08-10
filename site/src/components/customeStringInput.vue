<template>
  <div class="string-input-container">
    <slot
      :name="`${pathString}--simple`"
      v-bind="slotScopeData"
    >
      <input
        :type="currentInputType"
        v-model="inputValue"
        :readonly="readonly"
        :placeholder="placeholder"
        :class="inputClass"
        @blur="handleBlur"
        @keyup.enter="handleEnter"
        @input="handleInput"
      >
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { SimpleInputBoxProps, SimpleInputBoxEmits } from './varbox/inputs/InputProps';
import {getPathString} from './varbox/utils'

const props = defineProps({...SimpleInputBoxProps,
  modelValue:{
    type: [String, Number],
    default: ""
  },
  // 新增
  Type: {
    type: String,
    default: 'text'
  },
})
const emit = defineEmits(SimpleInputBoxEmits)

const slotScopeData = computed(() => ({
  blur: handleBlur,
  handleEnter: handleEnter,
  allProps: props,
  //新增
  internalValue: inputValue,
  inputTypeRef: currentInputType,
  handleInput: handleInput,
  togglePasswordVisibility: togglePasswordVisibility
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

const currentInputType = ref(props.Type);
// **定义允许的字符集正则表达式**
// 允许字母 (a-z, A-Z)、数字 (0-9) 和特殊字符 !@#$%^&*
// 你可以根据需要修改这个正则表达式，例如，如果只允许字母和数字：/^[a-zA-Z0-9]*$/
const allowedCharsRegex = /^[a-zA-Z0-9!@#$%^&*]*$/;

// **定义非法字符的错误提示信息**
const characterRestrictionMessage = 'Only letters, numbers and special characters like !@#$%^&* are allowed.';
const passwordLengthMessage = 'Password must be 8 characters or more.'; 

// 监听 props.Type 的变化，同步更新 currentInputType
watch(() => props.Type, (newType) => {
  currentInputType.value = newType;
}, { immediate: true }); // immediate 确保初始化时设置正确

// 监听 inputValue 的变化，并 emit 给父组件
watch(inputValue, (newValue) => {
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
    console.log("Prop modelValue 变化，同步到 inputValue:", newStringValue);
    inputValue.value = newStringValue;
  }
}, { immediate: true });

// 统一的校验函数：返回最优先的错误信息
function validateAll(value: string): { isValid: boolean; message: string } {
    // 1. 最高优先级：字符合法性校验
    if (!allowedCharsRegex.test(value)) {
        return { isValid: false, message: characterRestrictionMessage };
    }

    // 2. 次高优先级：密码长度校验
    if (props.Type === 'password' && value.length < 8) {
        return { isValid: false, message: passwordLengthMessage };
    }
    return { isValid: true, message: '' }; // 所有校验都通过
}

function handleBlur() {
  emit('blur', inputValue.value);
}

// 切换密码可见性的方法
function togglePasswordVisibility() {
  console.log("切换密码可见性");
  console.log("当前输入类型:", currentInputType.value);
  currentInputType.value = currentInputType.value === 'password' ? 'text' : 'password';
}

function handleEnter() {
  // 对输入的验证会在Login.vue中处理，这里不需要重复验证
  // if (props.node?.config?.validators !== undefined) {
  //   for (const validator of props.node.config.validators) {
  //     const isValid = validator.creteria(inputValue.value);
  //     if (!isValid) {
  //       const message = validator.message || '输入值不符合要求'
  //       emit('validation-error', message);
  //       return;
  //     }
  //   }
  // } else {
  //   emit('validation-error', '');
  // }

  // emit('enter', inputValue.value);
  // emit('validation-error', '');
  emit('enter', inputValue.value);//仍然可以发出 enter 事件，让父组件决定如何响应回车
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const newInputValue = target.value;

  // 始终先对新输入的整个字符串进行完整校验
  const { isValid, message } = validateAll(newInputValue);

  if (isValid) {
    // 如果当前输入的新值完全合法 (字符和长度都符合)
    inputValue.value = newInputValue; // 更新内部绑定的值
    emit('validation-error', ''); // 清除所有错误信息
  } else {
    // 如果当前输入的新值不合法 (可能是字符非法，也可能是超长)
    // 阻止非法内容进入，将 input 框显示的内容强制回退到上一次合法状态
    target.value = inputValue.value;
    // 发出明确的错误信息 (validateAll 会返回最优先的错误)
    emit('validation-error', message);
  }
}

</script>

<style scoped>
.string-input {
  width: 100%;
  padding:10px;
  border:none;
  background-color: var(--login-input-bg);
  border-radius: 5px;
  font-size: 14px;
  color: white;
  transition: border-color 0.2s;
}

.string-input::placeholder {
  color:var(--login-text-placeholder); /* 你想要的占位符颜色，例如一个浅灰色 */
  opacity: 1; /* 某些浏览器会默认给占位符设置透明度，设置 opacity: 1 可以确保颜色完全显示 */
}

.string-input-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-items: center;
}

.string-input:focus {
  outline: none;
  border: 1px solid white; /* 聚焦时的边框颜色 */
}

.string-input.readonly {
  background-color: #F5F7FA;
  cursor: not-allowed;
}
</style>