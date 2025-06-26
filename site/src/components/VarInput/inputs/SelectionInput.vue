<template>
  <select
    v-model="inputValue"
    :disabled="readonly"
    :class="inputClass"
    @change="handleChange"
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

<script>
export default {
  name: 'SelectionInput',
  
  props: {
    value: {
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
      inputValue: this.value || ''
    }
  },

  computed: {
    inputClass() {
      return {
        'selection-input': true,
        'readonly': this.readonly
      }
    },

    options() {
      return this.config.options || []
    }
  },

  watch: {
    value(newValue) {
      this.inputValue = newValue || ''
    }
  },

  methods: {
    getOptionValue(option) {
      // 支持简单字符串数组或对象数组
      if (typeof option === 'string' || typeof option === 'number') {
        return option
      }
      return option.value || option.key || option
    },

    getOptionLabel(option) {
      // 支持简单字符串数组或对象数组
      if (typeof option === 'string' || typeof option === 'number') {
        return option
      }
      return option.label || option.text || option.name || option.value || option
    },

    handleChange() {
      this.$emit('input', this.inputValue)
      
      if (this.validator) {
        const isValid = this.validator(this.inputValue)
        if (!isValid) {
          this.$emit('validation-error', '选择的值不符合要求')
          return
        }
      }
    },

    handleBlur() {
      this.$emit('blur', this.inputValue)
    }
  }
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