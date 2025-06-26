<template>
  <div class="string-array-container">
    <div
      v-for="(item, index) in arrayValue"
      :key="index"
      class="array-item"
    >
      <span class="item-label">[{{ index }}]</span>
      <input
        type="text"
        v-model="arrayValue[index]"
        :readonly="readonly"
        :placeholder="`${placeholder} ${index + 1}`"
        :class="inputClass"
        @input="handleItemChange(index)"
        @blur="handleBlur"
        @keyup.enter="handleEnter"
      />
      <button
        v-if="isDynamic && !readonly"
        type="button"
        class="remove-btn"
        @click="removeItem(index)"
        :disabled="arrayValue.length <= minLength"
      >
        ✕
      </button>
    </div>
    
    <div v-if="isDynamic && !readonly" class="array-controls">
      <button
        type="button"
        class="add-btn"
        @click="addItem"
        :disabled="arrayValue.length >= maxLength"
      >
        添加项 +
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StringArrayInput',
  
  props: {
    value: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
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
      arrayValue: this.initArrayValue()
    }
  },

  computed: {
    inputClass() {
      return {
        'string-array-input': true,
        'readonly': this.readonly
      }
    },

    // 是否为动态数组（可以添加删除项）
    isDynamic() {
      return this.config.dynamic !== false
    },

    // 最小长度
    minLength() {
      return this.config.minLength || 0
    },

    // 最大长度
    maxLength() {
      return this.config.maxLength || 20
    },

    // 固定长度
    fixedLength() {
      return this.config.length || 0
    }
  },

  watch: {
    value: {
      handler(newValue) {
        this.arrayValue = this.initArrayValue()
      },
      deep: true
    }
  },

  methods: {
    initArrayValue() {
      let arr = Array.isArray(this.value) ? [...this.value] : []
      
      // 如果有固定长度要求
      if (this.fixedLength > 0) {
        while (arr.length < this.fixedLength) {
          arr.push('')
        }
        arr = arr.slice(0, this.fixedLength)
      }
      
      // 如果数组为空且有最小长度要求
      if (arr.length === 0 && this.minLength > 0) {
        for (let i = 0; i < this.minLength; i++) {
          arr.push('')
        }
      }
      
      return arr
    },

    handleItemChange(index) {
      // 确保数组长度足够
      while (this.arrayValue.length <= index) {
        this.arrayValue.push('')
      }
      
      this.$emit('input', [...this.arrayValue])
    },

    handleBlur() {
      this.$emit('blur', [...this.arrayValue])
    },

    handleEnter() {
      if (this.validator) {
        for (let i = 0; i < this.arrayValue.length; i++) {
          const isValid = this.validator(this.arrayValue[i])
          if (!isValid) {
            this.$emit('validation-error', `第${i + 1}项输入值不符合要求`)
            return
          }
        }
      }
      this.$emit('enter', [...this.arrayValue])
    },

    addItem() {
      if (this.readonly || !this.isDynamic) return
      if (this.arrayValue.length >= this.maxLength) return
      
      this.arrayValue.push('')
      this.$emit('input', [...this.arrayValue])
    },

    removeItem(index) {
      if (this.readonly || !this.isDynamic) return
      if (this.arrayValue.length <= this.minLength) return
      if (this.fixedLength > 0) return // 固定长度不允许删除
      
      this.arrayValue.splice(index, 1)
      this.$emit('input', [...this.arrayValue])
    }
  }
}
</script>

<style scoped>
.string-array-container {
  width: 100%;
}

.array-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.item-label {
  flex-shrink: 0;
  min-width: 40px;
  font-size: 12px;
  color: #909399;
  text-align: center;
}

.string-array-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.string-array-input:focus {
  outline: none;
  border-color: #409EFF;
}

.string-array-input.readonly {
  background-color: #F5F7FA;
  cursor: not-allowed;
}

.remove-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: 1px solid #F56C6C;
  border-radius: 4px;
  background-color: white;
  color: #F56C6C;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:hover:not(:disabled) {
  background-color: #F56C6C;
  color: white;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.array-controls {
  margin-top: 8px;
  text-align: center;
}

.add-btn {
  padding: 6px 12px;
  border: 1px solid #409EFF;
  border-radius: 4px;
  background-color: white;
  color: #409EFF;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.add-btn:hover:not(:disabled) {
  background-color: #409EFF;
  color: white;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #DCDFE6;
  color: #C0C4CC;
}
</style>