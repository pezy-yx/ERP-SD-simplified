<template>
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
</template>

<script>
export default {
  name: 'NumberInput',
  
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入数字'
    },
    validator: {
      type: Function,
      default: null
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      inputValue: this.parseValue(this.value)
    }
  },

  computed: {
    inputClass() {
      return {
        'number-input': true,
        'readonly': this.readonly
      }
    }
  },

  watch: {
    value(newValue) {
      this.inputValue = this.parseValue(newValue)
    }
  },

  methods: {
    parseValue(value) {
      if (value === null || value === undefined || value === '') {
        return ''
      }
      const num = Number(value)
      return isNaN(num) ? '' : num
    },

    handleInput() {
      this.$emit('input', this.inputValue)
    },

    handleBlur() {
      this.$emit('blur', this.inputValue)
    },

    handleEnter() {
      if (this.validator) {
        const isValid = this.validator(this.inputValue)
        if (!isValid) {
          this.$emit('validation-error', '输入的数字不符合要求')
          return
        }
      }
      this.$emit('enter', this.inputValue)
    }
  }
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