<template>
  <div :class="wrapperClass" :key="forceUpdateKey">
    <slot
      :name="`${pathString}--wrapper`"
      v-bind="slotScopeData"
    >
      <!-- 主要内容区域 -->
      <div :class="mainContentClass">
        <slot
          :name="`${pathString}--main`"
          v-bind="slotScopeData"
        >
          <!-- 外部组件钩子 config.customComponent -->
          <div v-if="config?.customComponent !== undefined" :class="`custom-component ${baseClassPrefix}--custom-component`">
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
          <div v-else :class="`var-input-container ${baseClassPrefix}--var-input-container`" :style="containerStyle">
            <!-- 叶子节点渲染 -->
            <div v-if="isLeafNode" :class="`leaf-node ${baseClassPrefix}--leaf-node`">
              <label v-if="isShowLabel" :class="`var-label ${baseClassPrefix}--var-label`">{{ nameDisplay }}</label>
              <!-- 输入框和额外组件的容器 -->
              <div :class="`leaf-input-container ${baseClassPrefix}--leaf-input-container`">
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

                <!-- 额外组件插槽 - 在叶子节点内部 -->
                <div v-if="$slots[`${pathString}--extra`]" :class="extraComponentsClass">
                  <slot
                    :name="`${pathString}--extra`"
                    v-bind="slotScopeData"
                  >
                  </slot>
                </div>
              </div>
              <div v-if="validationError" :class="`error-message ${baseClassPrefix}--error-message`">{{ validationError }}</div>
            </div>

            <!-- 字典节点渲染 -->
            <div v-else-if="isDictNode" :class="`dict-node ${baseClassPrefix}--dict-node`">
              <div v-if="isShowLabel" :class="`dict-header ${baseClassPrefix}--dict-header`">
                <label v-if="isShowLabel" :class="`var-label ${baseClassPrefix}--var-label`">{{ nameDisplay }}</label>
              </div>
              <!-- 字典节点的额外组件插槽 -->
              <div v-if="$slots[`${pathString}--extra`]" :class="extraComponentsClass">
                <slot
                  :name="`${pathString}--extra`"
                  v-bind="slotScopeData"
                >
                </slot>
              </div>
              <div :class="`dict-content ${baseClassPrefix}--dict-content`" :style="{ paddingLeft: indentLevel + 'px' }">
                <!-- 先渲染所有叶子节点 -->
                <div v-if="leafChildren.length > 0" :class="`dict-leaf-section ${baseClassPrefix}--dict-leaf-section`">
                  <VarInput
                    v-for="(child, index) in leafChildren"
                    :key="child.name + '_leaf_' + index"
                    :varTree="varTree"
                    :nodePath="[...nodePath, child.name]"
                    :readonly="effectiveReadonly ?? false"
                    :config="getChildConfig(child)"
                    :indentLevel="0"
                    :class="`dict-item dict-item--${child.nodeType} ${baseClassPrefix}--dict-item ${baseClassPrefix}--dict-item--${child.nodeType}`"
                    @update="handleChildUpdate"
                  >
                    <!-- 透传插槽 -->
                    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps: any">
                      <slot :name="slotName" v-bind="slotProps"></slot>
                    </template>
                  </VarInput>
                </div>

                <!-- 再渲染所有复杂节点（dict和list） -->
                <div v-if="complexChildren.length > 0" :class="`dict-complex-section ${baseClassPrefix}--dict-complex-section`">
                  <VarInput
                    v-for="(child, index) in complexChildren"
                    :key="child.name + '_complex_' + index"
                    :varTree="varTree"
                    :nodePath="[...nodePath, child.name]"
                    :readonly="effectiveReadonly ?? false"
                    :config="getChildConfig(child)"
                    :indentLevel="(indentLevel ?? 0) + 20"
                    :class="`dict-item dict-item--${child.nodeType} ${baseClassPrefix}--dict-item ${baseClassPrefix}--dict-item--${child.nodeType}`"
                    @update="handleChildUpdate"
                  >
                    <!-- 透传插槽 -->
                    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps: any">
                      <slot :name="slotName" v-bind="slotProps"></slot>
                    </template>
                  </VarInput>
                </div>
              </div>
            </div>

            <!-- 列表节点渲染 -->
            <div v-else-if="isListNode" :class="`list-node ${baseClassPrefix}--list-node`">
              <div v-if="isShowLabel" :class="`list-header ${baseClassPrefix}--list-header`">
                <label v-if="isShowLabel" :class="`var-label ${baseClassPrefix}--var-label`">{{ nameDisplay }}</label>
              </div>
              <div :class="`list-header-actions ${baseClassPrefix}--list-header-actions`">
                <!-- 动态列表的添加/删除按钮 -->
                <div v-if="isDynamicList && !effectiveReadonly" :class="`list-controls ${baseClassPrefix}--list-controls`">
                  <button
                    @click="addListItem"
                    :disabled="!!reachedMaxLength"
                    :class="`btn-add ${baseClassPrefix}--btn-add`"
                  >
                    添加项 +
                  </button>
                </div>
                <!-- 列表节点的额外组件插槽 -->
                <div v-if="$slots[`${pathString}--extra`]" :class="extraComponentsClass">
                  <slot
                    :name="`${pathString}--extra`"
                    v-bind="slotScopeData"
                  >
                  </slot>
                </div>
              </div>
              <!-- 表格形式渲染列表 -->
              <div :class="`list-content ${baseClassPrefix}--list-content`">
                <table v-if="shouldRenderAsTable" :class="`list-table ${baseClassPrefix}--list-table`">
                  <thead>
                    <tr>
                      <th v-if="isDynamicList && !effectiveReadonly" :class="`action-column ${baseClassPrefix}--action-column`">操作</th>
                      <th v-for="(header, index) in getTableHeaders()" :key="index">
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(child, index) in currentNode?.children" :key="`${child.name}_${child.index}_${index}`" :class="`list-row ${baseClassPrefix}--list-row`">
                      <td v-if="isDynamicList && !effectiveReadonly" :class="`action-cell ${baseClassPrefix}--action-cell`">
                        <button @click="removeListItem(index)" :class="`btn-remove ${baseClassPrefix}--btn-remove`">删除</button>
                      </td>
                      <!-- 如果子项是dict，则每个字段占一列 -->
                      <template v-if="child.nodeType === 'dict'">
                        <td v-for="(dictChild, dictIndex) in child.children" :key="dictIndex" :class="`list-cell ${baseClassPrefix}--list-cell`">
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
                      <td v-else :class="`list-cell ${baseClassPrefix}--list-cell`">
                        <VarInput
                          :varTree="varTree"
                          :nodePath="[...nodePath, index.toString()]"
                          :readonly="effectiveReadonly ?? false"
                          :config="getChildConfig(child)"
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
                <div v-else :class="`list-items ${baseClassPrefix}--list-items`">
                  <div
                    v-for="(child, index) in currentNode?.children"
                    :key="`${child.name}_${child.index}_${index}`"
                    :class="`list-item ${baseClassPrefix}--list-item`"
                    :style="{ paddingLeft: indentLevel + 'px' }"
                  >
                    <div :class="`list-item-header ${baseClassPrefix}--list-item-header`">
                      <span :class="`item-index ${baseClassPrefix}--item-index`">[{{ index }}]</span>
                      <button
                        v-if="isDynamicList && !effectiveReadonly"
                        @click="removeListItem(index)"
                        :class="`btn-remove-inline ${baseClassPrefix}--btn-remove-inline`"
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
  currentNode: currentNode.value,
  pathString: pathString.value,
  isLeafNode: isLeafNode.value,
  isDictNode: isDictNode.value,
  isListNode: isListNode.value,
  isDynamicList: isDynamicList.value,
  effectiveReadonly: effectiveReadonly.value,
  shouldRenderAsTable: shouldRenderAsTable.value,
  reachedMaxLength: reachedMaxLength.value,
  containerStyle: containerStyle.value,
  inputStyle: inputStyle.value,
  nameDisplay: nameDisplay.value,
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
  forceUpdate:forceUpdate,
  forceUpdateKey:forceUpdateKey.value,
  setNodeValue:setNodeValue,
  getNodeValue:getNodeValue,
}));

const forceUpdateKey = ref(0)
const forceUpdate = () => {
  forceUpdateKey.value++
}

const currentNode = computed<VarNode | null>(() => {return props.varTree.findNodeByPath(props.nodePath)})
const pathString = computed<string>(()=>getPathString(props.varTree,props.nodePath))
const setNodeValue = (val: any, refresh:boolean=true, update:boolean=true) => {
  if (currentNode.value) {
    currentNode.value.currentValue = val
  }
  if (refresh) {
    forceUpdate()
  }
  if (update) {
    emit('update', {
      path: props.nodePath,
      value: val,
      node: currentNode.value || undefined
    })
  }
}
const getNodeValue = () => {
  return currentNode.value?.currentValue
}

const isLeafNode = computed(() => currentNode.value && currentNode.value.isLeaf())
const isDictNode = computed(() => currentNode.value && currentNode.value.nodeType === 'dict')
const isListNode = computed(() => currentNode.value && currentNode.value.nodeType === 'list')
const isDynamicList = computed(() => isListNode.value && currentNode.value?.varType === 'dynamiclist')
const effectiveReadonly = computed(() => props.readonly || (currentNode.value && currentNode.value.readonly))
const isShowLabel = computed(()=> !props.config?.hideLabel || props.showLabel)
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
  // marginBottom: '8px'
}))
const inputStyle = computed(() => ({
  // width: '100%'
}))
const nameDisplay = computed(() => {
  return currentNode.value?.getNameDisplay() || '未命名'
})

const baseClassPrefix = computed(() => {
  // 如果config中有自定义前缀，使用自定义前缀，否则使用pathString，如果pathString为空则使用默认前缀
  if (props.config?.classPrefix) {
    return props.config.classPrefix
  }
  return pathString.value || pathString.value || 'var-input'
})

const wrapperClass = computed(() => {
  return `wrapper ${baseClassPrefix.value}--wrapper`
})

const mainContentClass = computed(() => {
  return `main ${baseClassPrefix.value}--main`
})

const extraComponentsClass = computed(() => {
  return `extra ${baseClassPrefix.value}--extra`
})

// 分离叶子节点和复杂节点
const leafChildren = computed(() => {
  if (!currentNode.value?.children) return []
  return currentNode.value.children.filter(child => child.nodeType === 'leaf')
})

const complexChildren = computed(() => {
  if (!currentNode.value?.children) return []
  return currentNode.value.children.filter(child => child.nodeType === 'dict' || child.nodeType === 'list')
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
  const pathReadonly = `${baseClassPrefix.value}--readonly`
  const pathError = `${baseClassPrefix.value}--error`
  return {
    'readonly': effectiveReadonly.value,
    'error': !!validationError.value,
    [pathReadonly]: effectiveReadonly.value,
    [pathError]: !!validationError.value,
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
    forceUpdate() // 强制刷新界面
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
    forceUpdate() // 强制刷新界面
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
/* 默认容器样式 */
.var-input-container {
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

/* SAP风格叶子节点布局 */
.leaf-node {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  /* border-bottom: 1px solid #f0f0f0; */
}

.var-label {
  display: block;
  margin-bottom: 0; /* 移除垂直间距 */
  font-weight: 500;
  color: #606266;
  text-align: right; /* 右对齐，SAP风格 */
  padding-right: 8px;
}

/* 叶子节点输入容器 */
.leaf-input-container {
  display: flex;
  align-items: center;
  /* gap: 8px; */
  /* width: 100%; */
}

.leaf-input-container > :first-child {
  flex: 1; /* 输入框占主要空间 */
}

/* 叶子节点内的额外组件 */
.leaf-input-container .var-input--extra {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0; /* 不压缩额外组件 */
}

/* 输入框容器样式 */
.leaf-node :deep(.string-input-container),
.leaf-node :deep(.number-input-container),
.leaf-node :deep(.date-input-container),
.leaf-node :deep(.selection-input-container) {
  /* width: 100%; */
}

/* 统一输入框样式 - 方形设计 */
.leaf-node :deep(input),
.leaf-node :deep(select) {
  width: 100%;
  min-width: 120px; /* 最小宽度 */
  max-width: 300px; /* 最大宽度 */
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 0px; /* 方形直角 */
  font-size: 14px;
  line-height: 1.5;
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.leaf-node :deep(input:focus),
.leaf-node :deep(select:focus) {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.leaf-node :deep(input:readonly),
.leaf-node :deep(select:disabled) {
  background-color: #f9fafb;
  cursor: default;
}

/* SAP风格字典节点布局 */
.dict-node {
  margin-bottom: 16px;
}

.dict-header {
  /* margin-bottom: 12px;
  padding-bottom: 8px; */
  border-bottom: 1px solid #4E635E;
}

.dict-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dict-header .var-label {
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0;
  padding-right: 0;
  flex: 1;
}

.dict-header .var-input--extra {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.list-header .var-label{
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0;
  padding-right: 0;
}

.dict-content {
  padding-top: 16px;
  padding-left: 8px;
  /* background: #fafafa;
  border: 1px solid #e5e7eb; */
  background: transparent;
  border: none;
  border-radius: 0px;
  /* width: 100%; */
}

/* 叶子节点区域 - 网格布局 */
.dict-leaf-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70%, 1fr));
  gap: 0px 24px; /* rowgap, colgap*/
  align-items: center;
  justify-items: start;
  margin-bottom: 16px;
}

:deep(.dict-leaf-section input) {
  width: 50px;
}

.dict-leaf-section > .dict-item--leaf {
  display: contents; /* 让叶子节点直接参与网格布局 */
}

/* 复杂节点区域 - 垂直布局 */
.dict-complex-section {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.dict-complex-section > .dict-item--dict,
.dict-complex-section > .dict-item--list {
  width: 100%; /* 复杂节点独占一行 */
}

/* SAP风格列表表格 */
.list-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  table-layout: fixed; /* 固定表格布局，实现等宽列 */
}

.list-table th {
  background: #f9fafb;
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  height: 40px; /* 固定表头高度 */
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

.list-table td {
  padding: 6px 12px;
  border-bottom: 1px solid #f3f4f6;
  height: 36px; /* 固定单元格高度 */
  white-space: nowrap; /* 防止内容换行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  vertical-align: middle; /* 垂直居中对齐 */
}

.list-table tr:hover {
  background: #f9fafb;
}

/* 表格内的输入框样式调整 */
.list-table td :deep(input),
.list-table td :deep(select) {
  width: 100%;
  height: 24px; /* 固定输入框高度 */
  padding: 2px 6px; /* 减少内边距 */
  border: 1px solid #d1d5db;
  border-radius: 3px;
  font-size: 13px; /* 稍小的字体 */
  line-height: 1.2;
  background: white;
}

.list-table td :deep(input:focus),
.list-table td :deep(select:focus) {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

/* 操作列宽度控制 */
.list-table .action-column {
  width: 80px; /* 固定操作列宽度 */
}

.list-table .action-cell {
  width: 80px;
  text-align: center;
}

/* 列表头部布局 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.list-header .var-label {
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0;
  padding-right: 0;
  flex: 1;
}

.list-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.list-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-header .var-input--extra {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 列表操作按钮 */
.btn-add, .btn-remove, .btn-remove-inline {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add:hover {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.btn-remove:hover, .btn-remove-inline:hover {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

/* 错误信息样式 */
.error-message {
  margin-top: 4px;
  font-size: 12px;
  color: #dc2626;
  line-height: 1.4;
}

/* 叶子节点默认居中显示 */
.dict-leaf-section .wrapper {
  display: grid;
  width: 100%;
  justify-content: center;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .leaf-node {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .var-label {
    text-align: left;
    padding-right: 0;
    margin-bottom: 4px;
  }

  .dict-children {
    grid-template-columns: 1fr;
  }
}
</style>