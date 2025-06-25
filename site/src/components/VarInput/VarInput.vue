<template>
  <div class="var-input-container" :style="containerStyle">
    <!-- 叶子节点渲染 -->
    <div v-if="isLeafNode" class="leaf-node">
      <label v-if="showLabel" class="var-label">{{ currentNode.name }}</label>
      
      <!-- 基础类型输入框 -->
      <component
        :is="getLeafComponent()"
        v-model="nodeValue"
        :readonly="effectiveReadonly"
        :placeholder="getPlaceholder()"
        :configs="configs"
        :validator="contentValidator"
        @input="handleValueChange"
        @blur="handleValidation"
        :class="getInputClass()"
        :style="inputStyle"
      />
      
      <div v-if="validationError" class="error-message">{{ validationError }}</div>
    </div>

    <!-- 字典节点渲染 -->
    <div v-else-if="isDictNode" class="dict-node">
      <div v-if="showLabel" class="dict-header">
        <label class="var-label">{{ currentNode.name }}</label>
      </div>
      
      <div class="dict-content" :style="{ paddingLeft: indentLevel + 'px' }">
        <var-input
          v-for="(child, index) in currentNode.children"
          :key="child.name + '_' + index"
          :varTree="varTree"
          :nodePath="[...nodePath, child.name]"
          :readonly="effectiveReadonly"
          :contentValidator="getChildValidator(child)"
          :configs="getChildConfigs(child)"
          :indentLevel="indentLevel + 20"
          :showLabel="true"
          @update="handleChildUpdate"
          class="dict-item"
        />
      </div>
    </div>

    <!-- 列表节点渲染 -->
    <div v-else-if="isListNode" class="list-node">
      <div v-if="showLabel" class="list-header">
        <label class="var-label">{{ currentNode.name }}</label>
        
        <!-- 动态列表的添加/删除按钮 -->
        <div v-if="isDynamicList && !effectiveReadonly" class="list-controls">
          <button 
            @click="addListItem" 
            :disabled="reachedMaxLength"
            class="btn-add"
          >
            添加项 +
          </button>
        </div>
      </div>

      <!-- 表格形式渲染列表 -->
      <div class="list-content">
        <table v-if="shouldRenderAsTable" class="list-table">
          <thead>
            <tr>
              <th v-if="isDynamicList && !effectiveReadonly" class="action-column">操作</th>
              <th v-for="(header, index) in getTableHeaders()" :key="index">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(child, index) in currentNode.children" :key="index" class="list-row">
              <td v-if="isDynamicList && !effectiveReadonly" class="action-cell">
                <button @click="removeListItem(index)" class="btn-remove">删除</button>
              </td>
              
              <!-- 如果子项是dict，则每个字段占一列 -->
              <template v-if="child.nodeType === 'dict'">
                <td v-for="(dictChild, dictIndex) in child.children" :key="dictIndex" class="list-cell">
                  <var-input
                    :varTree="varTree"
                    :nodePath="[...nodePath, index.toString(), dictChild.name]"
                    :readonly="effectiveReadonly"
                    :contentValidator="getChildValidator(dictChild)"
                    :configs="getChildConfigs(dictChild)"
                    :showLabel="false"
                    @update="handleChildUpdate"
                  />
                </td>
              </template>
              
              <!-- 如果子项不是dict，则整个子项占一列 -->
              <td v-else class="list-cell">
                <var-input
                  :varTree="varTree"
                  :nodePath="[...nodePath, index.toString()]"
                  :readonly="effectiveReadonly"
                  :contentValidator="getChildValidator(child)"
                  :configs="getChildConfigs(child)"
                  :showLabel="false"
                  @update="handleChildUpdate"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 非表格形式渲染列表 -->
        <div v-else class="list-items">
          <div 
            v-for="(child, index) in currentNode.children" 
            :key="index"
            class="list-item"
            :style="{ paddingLeft: indentLevel + 'px' }"
          >
            <div class="list-item-header">
              <span class="item-index">[{{ index }}]</span>
              <button 
                v-if="isDynamicList && !effectiveReadonly"
                @click="removeListItem(index)"
                class="btn-remove-inline"
              >
                删除
              </button>
            </div>
            
            <var-input
              :varTree="varTree"
              :nodePath="[...nodePath, index.toString()]"
              :readonly="effectiveReadonly"
              :contentValidator="getChildValidator(child)"
              :configs="getChildConfigs(child)"
              :indentLevel="indentLevel + 20"
              :showLabel="true"
              @update="handleChildUpdate"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VarTree, VarNode, validators } from '@/utils/VarTree'

// 基础输入组件
import StringInput from './inputs/StringInput.vue'
import NumberInput from './inputs/NumberInput.vue'
import DateInput from './inputs/DateInput.vue'
import SelectionInput from './inputs/SelectionInput.vue'
import StringArrayInput from './inputs/StringArrayInput.vue'

export default {
  name: 'VarInput',
  
  components: {
    StringInput,
    NumberInput,
    DateInput,
    SelectionInput,
    StringArrayInput
  },

  props: {
    // VarTree实例
    varTree: {
      type: VarTree,
      required: true
    },
    
    // 当前节点在树中的路径
    nodePath: {
      type: Array,
      default: () => []
    },
    
    // 是否只读（会覆盖子组件）
    readonly: {
      type: Boolean,
      default: false
    },
    
    // 内容检查函数
    contentValidator: {
      type: Function,
      default: null
    },
    
    // 配置项
    configs: {
      type: Object,
      default: () => ({})
    },
    
    // 缩进级别
    indentLevel: {
      type: Number,
      default: 0
    },
    
    // 是否显示标签
    showLabel: {
      type: Boolean,
      default: true
    },
    
    // 自定义样式
    style: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      validationError: '',
      nodeValue: null
    }
  },

  computed: {
    // 当前节点
    currentNode() {
      return this.varTree.findNodeByPath(this.nodePath)
    },

    // 是否为叶子节点
    isLeafNode() {
      return this.currentNode && this.currentNode.isLeaf()
    },

    // 是否为字典节点
    isDictNode() {
      return this.currentNode && this.currentNode.nodeType === 'dict'
    },

    // 是否为列表节点
    isListNode() {
      return this.currentNode && this.currentNode.nodeType === 'list'
    },

    // 是否为动态列表
    isDynamicList() {
      return this.isListNode && this.currentNode.varType === 'dynamiclist'
    },

    // 有效的只读状态
    effectiveReadonly() {
      return this.readonly || (this.currentNode && this.currentNode.readonly)
    },

    // 是否应该以表格形式渲染
    shouldRenderAsTable() {
      if (!this.isListNode) return false
      
      // 固定列表和动态列表默认用表格形式
      return ['fixlist', 'dynamiclist'].includes(this.currentNode.varType)
    },

    // 是否达到最大长度
    reachedMaxLength() {
      if (!this.isDynamicList) return false
      const maxLength = this.configs.maxLength
      return maxLength && this.currentNode.children.length >= maxLength
    },

    // 容器样式
    containerStyle() {
      return {
        ...this.style,
        marginBottom: '8px'
      }
    },

    // 输入框样式
    inputStyle() {
      return {
        width: '100%'
      }
    }
  },

  watch: {
    currentNode: {
      handler() {
        this.initNodeValue()
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    // 初始化节点值
    initNodeValue() {
      if (this.isLeafNode && this.currentNode) {
        this.nodeValue = this.currentNode.defaultValue
      }
    },

    // 获取叶子节点组件
    getLeafComponent() {
      if (!this.currentNode) return 'StringInput'
      
      const typeMap = {
        'string': 'StringInput',
        'number': 'NumberInput', 
        'date': 'DateInput',
        'selection': 'SelectionInput',
        'string[]': 'StringArrayInput'
      }
      
      return typeMap[this.currentNode.varType] || 'StringInput'
    },

    // 获取占位符
    getPlaceholder() {
      const typeMap = {
        'string': '请输入文本',
        'number': '请输入数字',
        'date': '请选择日期', 
        'selection': '请选择',
        'string[]': '请输入'
      }
      
      return typeMap[this.currentNode?.varType] || '请输入'
    },

    // 获取输入框样式类
    getInputClass() {
      return {
        'readonly': this.effectiveReadonly,
        'error': !!this.validationError
      }
    },

    // 获取表格头部
    getTableHeaders() {
      if (!this.isListNode || !this.currentNode.children.length) return ['值']
      
      const firstChild = this.currentNode.children[0]
      if (firstChild.nodeType === 'dict') {
        return firstChild.children.map(child => child.name)
      }
      
      return ['值']
    },

    // 获取子节点验证器
    getChildValidator(child) {
      // 可以根据子节点类型返回相应的验证器
      const validatorMap = {
        'date': validators.date,
        'number': validators.number,
        'email': validators.email,
        'url': validators.url
      }
      
      return validatorMap[child.varType] || this.contentValidator
    },

    // 获取子节点配置
    getChildConfigs(child) {
      const childConfigs = this.configs.childConfigs || {}
      return childConfigs[child.name] || {}
    },

    // 处理值变化
    handleValueChange(newValue) {
      this.nodeValue = newValue
      
      // 更新节点的默认值，实现数据同步
      if (this.currentNode) {
        this.currentNode.defaultValue = newValue
      }
      
      this.$emit('update', {
        path: this.nodePath,
        value: newValue,
        node: this.currentNode
      })
    },

    // 处理子节点更新
    handleChildUpdate(updateInfo) {
      this.$emit('update', updateInfo)
    },

    // 处理验证
    handleValidation() {
      if (!this.contentValidator) {
        this.validationError = ''
        return
      }

      try {
        const isValid = this.contentValidator(this.nodeValue)
        this.validationError = isValid ? '' : '输入值不符合要求'
      } catch (error) {
        this.validationError = '验证过程出错'
        console.error('Validation error:', error)
      }
    },

    // 添加列表项
    addListItem() {
      if (!this.isDynamicList || this.effectiveReadonly) return
      
      const newItem = this.createNewListItem()
      if (newItem) {
        this.currentNode.addChild(newItem)
        this.$emit('update', {
          path: this.nodePath,
          action: 'addItem',
          node: this.currentNode
        })
      }
    },

    // 删除列表项
    removeListItem(index) {
      if (!this.isDynamicList || this.effectiveReadonly) return
      
      this.currentNode.removeChild(index)
      this.$emit('update', {
        path: this.nodePath,
        action: 'removeItem',
        index: index,
        node: this.currentNode
      })
    },

    // 创建新的列表项
    createNewListItem() {
      const itemConfig = this.configs.itemConfig || {}
      const itemType = this.configs.itemType || 'string'
      
      if (itemType === 'dict') {
        const children = []
        const childrenDef = itemConfig.children || {}
        
        for (let childName in childrenDef) {
          const childType = childrenDef[childName]
          const child = new VarNode('leaf', childType, childName, '')
          children.push(child)
        }
        
        return new VarNode('dict', 'dict', '', null, false, children)
      } else {
        return new VarNode('leaf', itemType, '', '')
      }
    }
  }
}
</script>

<style scoped>
.var-input-container {
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

.var-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #606266;
}

.leaf-node {
  margin-bottom: 10px;
}

.dict-node {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #FAFAFA;
}

.dict-header {
  margin-bottom: 15px;
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 10px;
}

.dict-content {
  padding-left: 0;
}

.dict-item {
  margin-bottom: 10px;
}

.list-node {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #F5F7FA;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 10px;
}

.list-controls {
  display: flex;
  gap: 10px;
}

.btn-add, .btn-remove, .btn-remove-inline {
  padding: 5px 10px;
  border: 1px solid #DCDFE6;
  border-radius: 3px;
  background-color: #FFF;
  cursor: pointer;
  font-size: 12px;
}

.btn-add {
  color: #409EFF;
  border-color: #409EFF;
}

.btn-add:hover {
  background-color: #409EFF;
  color: white;
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-remove, .btn-remove-inline {
  color: #F56C6C;
  border-color: #F56C6C;
}

.btn-remove:hover, .btn-remove-inline:hover {
  background-color: #F56C6C;
  color: white;
}

.list-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.list-table th,
.list-table td {
  border: 1px solid #EBEEF5;
  padding: 8px;
  text-align: left;
}

.list-table th {
  background-color: #F5F7FA;
  font-weight: 500;
}

.action-column {
  width: 80px;
}

.action-cell {
  text-align: center;
}

.list-cell {
  padding: 5px;
}

.list-items {
  margin-top: 10px;
}

.list-item {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: white;
}

.list-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-index {
  font-weight: 500;
  color: #909399;
}

.error-message {
  color: #F56C6C;
  font-size: 12px;
  margin-top: 5px;
}

.readonly {
  background-color: #F5F7FA;
  cursor: not-allowed;
}

.error {
  border-color: #F56C6C;
}
</style>