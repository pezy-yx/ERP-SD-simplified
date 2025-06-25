<template>
  <div class="var-input">
    <!-- 基础类型 -->
    <basic-types
      v-if="isBasicType"
      :type="type"
      v-model="modelValue"
      :readonly="readonly"
      :validator="validator"
      :style="style"
      :configs="configs"
      :placeholder="placeholder"
      @input="handleInput"
    />

    <!-- 复杂类型 -->
    <complex-types
      v-else
      :type="type"
      v-model="modelValue"
      :readonly="readonly"
      :style="style"
      :configs="configs"
      @input="handleInput"
    />
  </div>
</template>

<script>
import BasicTypes from './BasicTypes.vue'
import ComplexTypes from './ComplexTypes.vue'

const BASIC_TYPES = ['string', 'string[]', 'selection', 'date', 'unknown']
const COMPLEX_TYPES = ['dict', 'fixlist', 'dynamiclist']

export default {
  name: 'VarInput',

  components: {
    BasicTypes,
    ComplexTypes
  },

  props: {
    // 变量类型
    type: {
      type: String,
      required: true,
      validator: value => [...BASIC_TYPES, ...COMPLEX_TYPES].includes(value)
    },
    // 值
    value: {
      required: true
    },
    // 只读模式
    readonly: {
      type: Boolean,
      default: false
    },
    // 内容验证函数
    validator: {
      type: Function,
      default: null
    },
    // 样式
    style: {
      type: Object,
      default: () => ({})
    },
    // 配置项
    configs: {
      type: Object,
      default: () => ({})
    },
    // 占位符
    placeholder: {
      type: String,
      default: '请输入'
    }
  },

  data() {
    return {
      modelValue: this.value,
    }
  },

  computed: {
    isBasicType() {
      return BASIC_TYPES.includes(this.type)
    }
  },

  methods: {
    handleInput(value) {
      this.modelValue = value
      this.$emit('input', value)
    }
  },

  watch: {
    value: {
      handler(newVal) {
        this.modelValue = newVal
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.var-input {
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
</style>