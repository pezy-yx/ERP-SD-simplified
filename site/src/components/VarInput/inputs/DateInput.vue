<template>
  <div class="date-input-container">
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
        📅
      </button>
    </div>
    
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
  </div>
</template>

<script>
export default {
  name: 'DateInput',
  
  props: {
    value: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择日期'
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
      displayValue: this.value || '',
      dateValue: this.formatToDateInput(this.value),
      showPicker: false
    }
  },

  computed: {
    inputClass() {
      return {
        'date-input': true,
        'readonly': this.readonly
      }
    }
  },

  watch: {
    value(newValue) {
      this.displayValue = newValue || ''
      this.dateValue = this.formatToDateInput(newValue)
    }
  },

  methods: {
    // 格式化为date input需要的格式 (YYYY-MM-DD)
    formatToDateInput(dateStr) {
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
    },

    // 格式化为显示格式
    formatDisplayDate(dateStr) {
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
    },

    handleTextInput() {
      this.$emit('input', this.displayValue)
    },

    handleDateChange() {
      if (this.dateValue) {
        this.displayValue = this.formatDisplayDate(this.dateValue)
        this.$emit('input', this.displayValue)
      }
      this.hideDatePicker()
    },

    handleBlur() {
      this.$emit('blur', this.displayValue)
    },

    handleEnter() {
      if (this.validator) {
        const isValid = this.validator(this.displayValue)
        if (!isValid) {
          this.$emit('validation-error', '日期格式不正确')
          return
        }
      }
      this.$emit('enter', this.displayValue)
    },

    showDatePicker() {
      if (this.readonly) return
      
      this.showPicker = true
      this.$nextTick(() => {
        if (this.$refs.datePicker) {
          this.$refs.datePicker.focus()
        }
      })
    },

    hideDatePicker() {
      setTimeout(() => {
        this.showPicker = false
      }, 200)
    }
  }
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

.date-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #DCDFE6;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.date-input:focus {
  outline: none;
  border-color: #409EFF;
}

.date-input.readonly {
  background-color: #F5F7FA;
  cursor: not-allowed;
  border-radius: 4px;
}

.date-picker-btn {
  padding: 8px 12px;
  border: 1px solid #DCDFE6;
  border-left: none;
  border-radius: 0 4px 4px 0;
  background-color: #F5F7FA;
  cursor: pointer;
  font-size: 14px;
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