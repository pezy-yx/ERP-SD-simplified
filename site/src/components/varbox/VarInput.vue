<template>
  <div>
    <slot
      :name="`${pathString}--slot`"
      v-bind="slotScopeData"
    >
      <!-- 外部组件钩子 config.customComponent -->
      <div v-if="config?.customComponent !== undefined" class="custom-component">
        <component
          :is="config.customComponent"
          :modelValue="currentNode?.currentValue"
          :readonly="effectiveReadonly"
          :placeholder="getPlaceholder()"
          :config="config"
          :style="inputStyle"
          :tree="varTree"
          :node="currentNode"
          :nodePath="nodePath"
          :varTree="varTree"
          :class="getInputClass()"
          @update="handleChildUpdate"
          @update:modelValue="handleValueChange"
          @blur="handleValidation"
          @validation-error="handleValidationError"
        >
          <!-- 透传插槽 -->
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps"></slot>
          </template>
        </component>
      </div>
      <div v-else class="var-input-container" :style="containerStyle">
        <!-- 叶子节点渲染 -->
        <div v-if="isLeafNode" class="leaf-node">
          <label v-if="showLabel" class="var-label">{{ nameDisplay }}</label>
          <!-- 基础类型输入框 -->
          <component
            :is="getLeafComponent()"

            :modelValue="currentNode?.currentValue"
            :readonly="effectiveReadonly"
            :placeholder="getPlaceholder()"
            :config="config"
            :class="getInputClass()"
            :style="inputStyle"
            :tree="varTree"
            :node="currentNode"
            :nodePath="nodePath"
            
            @update:modelValue="handleValueChange"
            @blur="handleValidation"
            @validation-error="handleValidationError"
          >
            <!-- 透传插槽 -->
            <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
              <slot :name="slotName" v-bind="slotProps"></slot>
            </template>
          </component>
          <div v-if="validationError" class="error-message">{{ validationError }}</div>
        </div>

        <!-- 字典节点渲染 -->
        <div v-else-if="isDictNode" class="dict-node">
          <div v-if="1 || showLabel" class="dict-header">
            <label class="var-label">{{ nameDisplay }}</label>
          </div>
          <div class="dict-content" :style="{ paddingLeft: indentLevel + 'px' }">
            <VarInput
              v-for="(child, index) in currentNode?.children"
              :key="child.name + '_' + index"

              :varTree="varTree"
              :nodePath="[...nodePath, child.name]"
              :readonly="effectiveReadonly ?? false"
              :config="getChildConfig(child)"
              :indentLevel="(indentLevel ?? 0) + 20"
              :showLabel="true"

              class="dict-item"
              @update="handleChildUpdate"
            >
              <!-- 透传插槽 -->
              <template v-for="(_, slotName) in $slots" #[slotName]="slotProps: any">
                <slot :name="slotName" v-bind="slotProps"></slot>
              </template>
            </VarInput>
          </div>
        </div>

        <!-- 列表节点渲染 -->
        <div v-else-if="isListNode" class="list-node">
          <div v-if="1 || showLabel" class="list-header">
            <label class="var-label">{{ nameDisplay }}</label>
            <!-- 动态列表的添加/删除按钮 -->
            <div v-if="isDynamicList && !effectiveReadonly" class="list-controls">
              <button
                @click="addListItem"
                :disabled="!!reachedMaxLength"
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
                <tr v-for="(child, index) in currentNode?.children" :key="index" class="list-row">
                  <td v-if="isDynamicList && !effectiveReadonly" class="action-cell">
                    <button @click="removeListItem(index)" class="btn-remove">删除</button>
                  </td>
                  <!-- 如果子项是dict，则每个字段占一列 -->
                  <template v-if="child.nodeType === 'dict'">
                    <td v-for="(dictChild, dictIndex) in child.children" :key="dictIndex" class="list-cell">
                      <VarInput
                        :varTree="varTree"
                        :nodePath="[...nodePath, index.toString(), dictChild.name]"
                        :readonly="effectiveReadonly ?? false"
                        :config="getChildConfig(dictChild)"
                        :showLabel="false"
                        @update="handleChildUpdate"
                      >
                        <!-- 透传插槽 -->
                        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps:any">
                          <slot :name="slotName" v-bind="slotProps"></slot>
                        </template>
                      </VarInput>
                    </td>
                  </template>
                  <!-- 如果子项不是dict，则整个子项占一列 -->
                  <td v-else class="list-cell">
                    <VarInput
                      :varTree="varTree"
                      :nodePath="[...nodePath, index.toString()]"
                      :readonly="effectiveReadonly ?? false"
                      :config="getChildConfig(child)"
                      :showLabel="false"
                      @update="handleChildUpdate"
                    >
                        <!-- 透传插槽 -->
                        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps:any">
                          <slot :name="slotName" v-bind="slotProps"></slot>
                        </template>
                    </VarInput>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 非表格形式渲染列表 -->
            <div v-else class="list-items">
              <div
                v-for="(child, index) in currentNode?.children"
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
                <VarInput
                  :varTree="varTree"
                  :nodePath="[...nodePath, index.toString()]"
                  :readonly="effectiveReadonly ?? false"
                  :config="getChildConfig(child)"
                  :indentLevel="(indentLevel ?? 0) + 20"
                  :showLabel="true"
                  @update="handleChildUpdate"
                >
                  <!-- 透传插槽 -->
                  <template v-for="(_, slotName) in $slots" #[slotName]="slotProps:any">
                    <slot :name="slotName" v-bind="slotProps"></slot>
                  </template>
                </VarInput>
              </div>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { VarTree, VarNode, VarNodeConfig, createNodeFromConfig, NodeStructure } from '@/utils/VarTree'
import StringInput from './inputs/StringInput.vue'
import NumberInput from './inputs/NumberInput.vue'
import DateInput from './inputs/DateInput.vue'
import SelectionInput from './inputs/StringInput.vue'

import {getPathString} from './utils'

const props = defineProps<{
  varTree: VarTree
  nodePath: string[]
  readonly?: boolean
  config?: VarNodeConfig
  indentLevel?: number
  showLabel?: boolean
  wrapperStyle?: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update', payload: { path: string[]; value?: any; node?: VarNode; action?: string; index?: number }): void
}>()

const validationError = ref<string>('')
const nodeValue = ref<any>(null)

const slotScopeData = computed(() => ({
  allProps: props,
  validationError: validationError,
  nodeValue: nodeValue,
  currentNode: currentNode,
  pathString: pathString,
  isLeafNode:isLeafNode,
  isDictNode:isDictNode,
  isListNode:isListNode,
  isDynamicList:isDynamicList,
  effectiveReadonly:effectiveReadonly,
  shouldRenderAsTable:shouldRenderAsTable,
  reachedMaxLength:reachedMaxLength,
  containerStyle:containerStyle,
  inputStyle:inputStyle,
  nameDisplay:nameDisplay,
  initNodeValue:initNodeValue,
  getLeafComponent:getLeafComponent,
  getPlaceholder:getPlaceholder,
  getInputClass:getInputClass,
  getTableHeaders:getTableHeaders,
  getChildConfig:getChildConfig,
  handleValueChange:handleValueChange,
  handleChildUpdate:handleChildUpdate,
  handleValidation:handleValidation,
  handleValidationError:handleValidationError,
  addListItem:addListItem,
  removeListItem:removeListItem,
  createNewListItem:createNewListItem,
}));

const currentNode = computed<VarNode | null>(() => props.varTree.findNodeByPath(props.nodePath))
const pathString = computed<string>(()=>getPathString(props.nodePath))

const isLeafNode = computed(() => currentNode.value && currentNode.value.isLeaf())
const isDictNode = computed(() => currentNode.value && currentNode.value.nodeType === 'dict')
const isListNode = computed(() => currentNode.value && currentNode.value.nodeType === 'list')
const isDynamicList = computed(() => isListNode.value && currentNode.value?.varType === 'dynamiclist')
const effectiveReadonly = computed(() => props.readonly || (currentNode.value && currentNode.value.readonly))
const shouldRenderAsTable = computed(() => {
  if (!isListNode.value) return false
  return ['fixlist', 'dynamiclist'].includes((currentNode.value?.varType ?? '') as string)
})
const reachedMaxLength = computed(() => {
  if (!isDynamicList.value) return false
  const maxLength = props.config?.maxLength
  return !!maxLength && !!currentNode.value?.children && currentNode.value.children.length >= maxLength
})
const containerStyle = computed(() => ({
  ...(props.wrapperStyle || {}),
  marginBottom: '8px'
}))
const inputStyle = computed(() => ({
  width: '100%'
}))
const nameDisplay = computed(() => {
  return currentNode.value?.nameDisplay || currentNode.value?.name || '未命名'
})

watch(currentNode, () => {
  initNodeValue()
}, { immediate: true, deep: true })

function initNodeValue() {
  if (isLeafNode.value && currentNode.value) {
    nodeValue.value = currentNode.value.defaultValue
  }
}

function getLeafComponent() {
  if (!currentNode.value) return StringInput
  const typeMap: Record<string, any> = {
    'string': StringInput,
    // 'number': NumberInput,
    'number': StringInput,
    'date': DateInput,
    'selection': SelectionInput,
  }
  return typeMap[currentNode.value.varType] || StringInput
}

function getPlaceholder() {
  const typeMap: Record<string, string> = {
    'string': '请输入文本',
    'number': '请输入数字',
    'date': '请选择日期',
    'selection': '请选择',
  }
  return typeMap[(currentNode.value?.varType ?? 'string')] || '请输入'
}

function getInputClass() {
  return {
    'readonly': effectiveReadonly.value,
    'error': !!validationError.value
  }
}

function getTableHeaders(): string[] {
  const defaultValue = "值"
  if (props.config?.childTemplate?.children !== undefined && props.config.childTemplate.children.length > 0) {
    return props.config.childTemplate.children.map((child: NodeStructure) => child.nameDisplay || child.name || defaultValue)
  }

  const firstChild = currentNode.value?.children[0]
  if (!firstChild) return [defaultValue]
  if (firstChild.nodeType === 'dict') {
    return firstChild.children.map((child: NodeStructure) => child.nameDisplay || child.name || defaultValue)
  }
  return firstChild.nameDisplay ? [firstChild.nameDisplay] : [defaultValue]
}

function getChildConfig(child: VarNode) {
  return child.config || {}
}

function handleValueChange(newValue: any) {
  if (currentNode.value) {
    currentNode.value.currentValue = newValue
  }
  emit('update', {
    path: props.nodePath,
    value: newValue,
    node: currentNode.value || undefined
  })
}

function handleChildUpdate(updateInfo: any) {
  emit('update', updateInfo)
}

function handleValidation() {
  // validationError.value = ''
  return
}

function handleValidationError(message: string | null = '') {
  validationError.value = message || ''
  return
}

function addListItem() {
  if (!isDynamicList.value || effectiveReadonly.value) return
  const newItem = createNewListItem()
  if (newItem && currentNode.value) {
    currentNode.value.addChild(newItem)
    emit('update', {
      path: props.nodePath,
      action: 'addItem',
      node: currentNode.value
    })
  }
}

function removeListItem(index: number) {
  if (!isDynamicList.value || effectiveReadonly.value) return
  if (currentNode.value) {
    currentNode.value.removeChild(index)
    emit('update', {
      path: props.nodePath,
      action: 'removeItem',
      index: index,
      node: currentNode.value
    })
  }
}

function createNewListItem(): VarNode | null {
  if (props.config?.childTemplate) {
    return createNodeFromConfig(props.config.childTemplate)
  }
  const lastChild = currentNode.value?.children[currentNode.value.children.length - 1]
  if (lastChild) {
    return lastChild.template()
  }
  return createNodeFromConfig({
    name: '新项',
    varType: 'string',
    nodeType: 'leaf',
    defaultValue: ''
  })
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
</style>