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
      if (this.validator) {
        const isValid = this.validator(this.inputValue)
        if (!isValid) {
          this.$emit('validation-error', '输入值不符合要求')
          return
        }
      }
      this.$emit('enter', this.inputValue)
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