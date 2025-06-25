<template>
  <div class="var-input-basic" :style="style">
    <!-- String 类型 -->
    <div v-if="type === 'string'" class="input-wrapper">
      <input
        v-model="localValue"
        :readonly="readonly"
        @input="handleInput"
        @change="handleInput"
        @keyup.enter="handleInput"
        :placeholder="placeholder"
      />
    </div>

    <!-- String[] 类型 -->
    <div v-if="type === 'string[]'" class="input-array-wrapper">
      <div v-for="(item, index) in localValue" :key="index" class="array-item">
        <input
          v-model="localValue[index]"
          :readonly="readonly"
          @input="handleArrayInput(index, $event)"
          @change="handleArrayInput(index, $event)"
          @keyup.enter="handleArrayInput(index, $event)"
          :placeholder="`${placeholder} ${index + 1}`"
        />
      </div>
    </div>

    <!-- Selection 类型 -->
    <div v-if="type === 'selection'" class="select-wrapper">
      <select 
        v-model="localValue" 
        :disabled="readonly"
        @change="handleInput"
      >
        <option v-for="option in configs.options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <!-- Date 类型 -->
    <div v-if="type === 'date'" class="date-wrapper">
      <input
        v-model="localValue"
        :readonly="readonly"
        @input="handleInput"
        @change="handleInput"
        @keyup.enter="handleInput"
        :placeholder="placeholder"
      />
      <button v-if="!readonly" @click="showDatePicker = true">📅</button>
      <div v-if="showDatePicker" class="date-picker">
        <input
          type="date"
          :min="configs.minDate"
          :max="configs.maxDate"
          v-model="localValue"
          @change="handleDateSelect"
        />
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicTypes',
  
  props: {
    type: {
      type: String,
      required: true
    },
    value: {
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    validator: {
      type: Function,
      default: null
    },
    style: {
      type: Object,
      default: () => ({})
    },
    configs: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },

  data() {
    return {
      localValue: this.initLocalValue(),
      error: '',
      showDatePicker: false
    }
  },

  created() {
    console.log(`[BasicTypes] Created with type: ${this.type}`, {
      value: this.value,
      configs: this.configs
    })
  },

  methods: {
    initLocalValue() {
      console.log(`[BasicTypes] Initializing ${this.type} value`, this.value)
      if (this.type === 'string[]') {
        return Array.isArray(this.value) ? [...this.value] : new Array(this.configs.length || 1).fill('')
      }
      return this.value
    },

    async handleInput(event) {
      if (this.readonly) return
      
      console.log(`[BasicTypes] Input value changed`, {
        type: this.type,
        value: this.localValue
      })

      // 验证输入
      if (this.validator) {
        try {
          await this.validator(this.localValue)
          this.error = ''
        } catch (err) {
          console.warn(`[BasicTypes] Validation error`, err)
          this.error = err.message
          return
        }
      }

      this.$emit('input', this.localValue)
    },

    async handleArrayInput(index, event) {
      if (this.readonly) return

      console.log(`[BasicTypes] Array input changed at index ${index}`, {
        value: this.localValue[index]
      })

      if (this.validator) {
        try {
          await this.validator(this.localValue[index])
          this.error = ''
        } catch (err) {
          console.warn(`[BasicTypes] Array validation error`, err)
          this.error = err.message
          return
        }
      }

      this.$emit('input', [...this.localValue])
    },

    handleDateSelect() {
      console.log(`[BasicTypes] Date selected`, this.localValue)
      this.showDatePicker = false
      this.handleInput()
    }
  },

  watch: {
    value: {
      handler(newValue) {
        console.log(`[BasicTypes] Value changed externally`, newValue)
        this.localValue = this.initLocalValue()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.var-input-basic {
  margin: 4px 0;
}

.input-wrapper,
.select-wrapper,
.date-wrapper {
  display: flex;
  align-items: center;
}

input,
select {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.array-item {
  margin: 4px 0;
}

.date-wrapper button {
  margin-left: 8px;
  padding: 4px 8px;
  background: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}

.date-picker {
  position: absolute;
  background: white;
  border: 1px solid #dcdfe6;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
</style>