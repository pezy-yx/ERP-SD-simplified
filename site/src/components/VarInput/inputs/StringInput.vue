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

<script>
import { VarNode, VarNodeValueValidator } from '@/utils/VarTree'
export default {
  name: 'StringInput',
  
  props: {
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
      default: '请输入文本'
    },
    config: {
      type: Object,
      default: () => ({})
    },
    node: {
      type: VarNode,
      default: null
    }
  },

  data() {
    return {
      inputValue: (typeof this.modelValue === 'number' || typeof this.modelValue === 'string')
        ? String(this.modelValue)
        : ''
    }
  },

  computed: {
    inputClass() {
      return {
        'string-input': true,
        'readonly': this.readonly
      }
    }
  },

  watch: {
    modelValue(newValue) {
      if (typeof newValue === 'number' || typeof newValue === 'string') {
        this.inputValue = String(newValue)
      } else {
        this.inputValue = ''
      }
    }
  },

  methods: {
    handleInput() {
      this.$emit('update:modelValue', this.inputValue)
    },

    handleBlur() {
      this.$emit('blur', this.inputValue)
    },

    handleEnter() {
      // if (this.validator) {
      //   const isValid = this.validator(this.inputValue)
      //   if (!isValid) {
      //     this.$emit('validation-error', '输入值不符合要求')
      //     return
      //   } else {
      //     // 校验通过时清空错误喵！
      //     this.$emit('validation-error', '')
      //   }
      // } else {
      //   // 没有校验器也清空错误喵！
      //   this.$emit('validation-error', '')
      // }
      // this.$emit('enter', this.inputValue)
      if (this.node?.config?.validators!==undefined) {
        for (const validator of this.node.config.validators) {
          const isValid = validator(this.inputValue)
          if (!isValid) {
            this.$emit('validation-error', '输入值不符合要求')
            return
          }
        }
      } else {
        // 没有校验器也清空错误
        this.$emit('validation-error', '')
      }
      this.$emit('enter', this.inputValue)
      this.$emit('validation-error', '')
    }
  }
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