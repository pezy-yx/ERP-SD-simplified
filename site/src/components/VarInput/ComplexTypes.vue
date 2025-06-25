<template>
  <div class="var-input-complex" :style="style">
    <!-- NameTree 类型 -->
    <div v-if="type === 'nametree'" class="nametree-wrapper">
      <div class="nametree-item">
        <div class="nametree-type">{{ localValue[1] }}</div>
        <div class="nametree-name">{{ localValue[2] }}</div>
        <div v-if="localValue[0] === 'leaf'" class="nametree-value">
          <component
            :is="getComponentType(localValue[1])"
            :type="localValue[1]"
            v-model="localValue[3]"
            :readonly="readonly"
            :configs="configs"
            @input="handleNameTreeInput"
          />
        </div>
        <div v-else-if="localValue[0] === 'dict'" class="nametree-children">
          <div v-for="(child, key) in localValue[3]" :key="key" class="nametree-child">
            <component
              :is="'ComplexTypes'"
              type="nametree"
              v-model="localValue[3][key]"
              :readonly="readonly"
              :configs="configs"
              @input="handleNameTreeDictInput(key)"
            />
          </div>
        </div>
        <div v-else-if="localValue[0] === 'list'" class="nametree-children">
          <div v-for="(child, index) in localValue[3]" :key="index" class="nametree-child">
            <component
              :is="'ComplexTypes'"
              type="nametree"
              v-model="localValue[3][index]"
              :readonly="readonly"
              :configs="configs"
              @input="handleNameTreeListInput(index)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Dict 类型 -->
    <div v-else-if="type === 'dict'" class="dict-wrapper">
      <div v-for="(childType, key) in configs.children" :key="key" class="dict-item">
        <div class="dict-label">{{ key }}:</div>
        <component
          :is="getComponentType(childType)"
          :type="childType"
          v-model="localValue[key]"
          :readonly="readonly"
          :configs="getChildConfig(key)"
          :style="{ marginLeft: '20px' }"
          @input="handleDictInput"
        />
      </div>
    </div>

    <!-- FixList 类型 -->
    <div v-if="type === 'fixlist'" class="fixlist-wrapper">
      <table>
        <tbody>
          <tr v-for="(item, index) in localValue" :key="index">
            <td>
              <component
                :is="getComponentType(configs.itemType)"
                :type="configs.itemType"
                v-model="localValue[index]"
                :readonly="readonly"
                :configs="configs.itemConfig"
                @input="handleListInput"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- DynamicList 类型 -->
    <div v-if="type === 'dynamiclist'" class="dynamiclist-wrapper">
      <table>
        <tbody>
          <tr v-for="(item, index) in localValue" :key="index" class="list-item">
            <td>
              <component
                :is="getComponentType(configs.itemType)"
                :type="configs.itemType"
                v-model="localValue[index]"
                :readonly="readonly"
                :configs="configs.itemConfig"
                @input="handleListInput"
              />
            </td>
            <td v-if="!readonly" class="actions">
              <button @click="removeItem(index)" class="remove-btn">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="!readonly && canAddMore" class="add-item">
        <button @click="addItem" class="add-btn">➕ 添加项</button>
      </div>
    </div>
  </div>
</template>

<script>
import BasicTypes from './BasicTypes.vue'

const BASIC_TYPES = ['string', 'string[]', 'selection', 'date', 'unknown']

export default {
  name: 'ComplexTypes',

  components: {
    BasicTypes,
    ComplexTypes: () => import('./ComplexTypes.vue')
  },

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
    style: {
      type: Object,
      default: () => ({})
    },
    configs: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      localValue: this.initLocalValue()
    }
  },

  computed: {
    canAddMore() {
      if (this.type !== 'dynamiclist') return false
      const maxLength = this.configs.maxLength || Infinity
      return this.localValue.length < maxLength
    }
  },

  created() {
    console.log(`[ComplexTypes] Created with type: ${this.type}`, {
      value: this.value,
      configs: this.configs
    })
  },

  methods: {
    getComponentType(type) {
      return BASIC_TYPES.includes(type) ? 'BasicTypes' : 'ComplexTypes'
    },

    initLocalValue() {
      console.log(`[ComplexTypes] Initializing ${this.type} value`, this.value)
      
      if (this.type === 'dict') {
        const value = { ...this.value }
        Object.keys(this.configs.children).forEach(key => {
          if (!(key in value)) {
            value[key] = null
          }
        })
        return value
      }

      if (this.type === 'fixlist') {
        const length = this.configs.length || 1
        return Array.isArray(this.value) ? 
          [...this.value] : 
          new Array(length).fill(null)
      }

      if (this.type === 'dynamiclist') {
        return Array.isArray(this.value) ? [...this.value] : []
      }

      return this.value
    },

    getChildConfig(key) {
      return this.configs.childConfigs?.[key] || {}
    },

    handleDictInput() {
      console.log(`[ComplexTypes] Dict input updated`, this.localValue)
      this.$emit('input', { ...this.localValue })
    },

    handleNameTreeInput() {
      console.log(`[ComplexTypes] NameTree leaf input updated`, this.localValue)
      this.$emit('input', [...this.localValue])
    },

    handleNameTreeDictInput(key) {
      console.log(`[ComplexTypes] NameTree dict child updated`, key, this.localValue)
      this.$emit('input', [...this.localValue])
    },

    handleNameTreeListInput(index) {
      console.log(`[ComplexTypes] NameTree list child updated`, index, this.localValue)
      this.$emit('input', [...this.localValue])
    },

    handleListInput() {
      console.log(`[ComplexTypes] List input updated`, this.localValue)
      this.$emit('input', [...this.localValue])
    },

    addItem() {
      if (this.canAddMore) {
        console.log(`[ComplexTypes] Adding new item to list`)
        this.localValue.push(null)
        this.handleListInput()
      }
    },

    removeItem(index) {
      console.log(`[ComplexTypes] Removing item at index ${index}`)
      this.localValue.splice(index, 1)
      this.handleListInput()
    }
  },

  watch: {
    value: {
      handler(newValue) {
        console.log(`[ComplexTypes] Value changed externally`, newValue)
        this.localValue = this.initLocalValue()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>
.var-input-complex {
  margin: 4px 0;
}

.nametree-wrapper {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 8px;
  margin: 4px 0;
}

.nametree-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nametree-type {
  color: #409eff;
  font-size: 12px;
}

.nametree-name {
  font-weight: bold;
}

.nametree-value {
  margin-left: 16px;
}

.nametree-children {
  margin-left: 16px;
  border-left: 2px solid #e6e6e6;
  padding-left: 8px;
}

.nametree-child {
  margin: 8px 0;
}

.dict-wrapper {
  border-left: 2px solid #e6e6e6;
  padding-left: 8px;
}

.dict-item {
  margin: 8px 0;
}

.dict-label {
  font-weight: bold;
  margin-bottom: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 4px;
  vertical-align: top;
}

.actions {
  width: 40px;
  text-align: center;
}

.remove-btn,
.add-btn {
  padding: 4px 8px;
  background: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn:hover {
  color: #f56c6c;
  border-color: #f56c6c;
}

.add-btn {
  margin-top: 8px;
  color: #409eff;
  border-color: #409eff;
}

.add-btn:hover {
  background-color: #ecf5ff;
}
</style>