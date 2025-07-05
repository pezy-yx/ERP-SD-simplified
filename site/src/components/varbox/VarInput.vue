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
              @blur="handleBlur"
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
                  @blur="handleBlur"
                  @validation-error="handleValidationError"
                  @focus="handleFocus"
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
                <!-- 搜索按钮插槽 -->
                <div v-if="displaySearchButton" :class="`search-button-container ${baseClassPrefix}--search-button-container`">
                  <slot
                    :name="`${pathString}--search-button`"
                    v-bind="slotScopeData"
                  >
                    <button
                      :class="searchButtonClass"
                      @click="handleSearchButtonClick"
                    >
                      🔍
                    </button>
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
                    :showLabel="true"
                    :class="`dict-item dict-item--${child.nodeType} ${baseClassPrefix}--dict-item ${baseClassPrefix}--dict-item--${child.nodeType}`"
                    @update="handleChildUpdate"
                    @focus="handleFocus"
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
                    :showLabel="true"
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
                    +
                  </button>
                  <button
                    @click="removeSelectedItems"
                    :disabled="selectedRows.size === 0"
                    :class="`btn-remove-selected ${baseClassPrefix}--btn-remove-selected`"
                  >
                    -
                    <!-- ({{ selectedRows.size }}) -->
                  </button>
                  <!-- 列表节点的额外按钮插槽 -->
                  <div v-if="$slots[`${pathString}--extra-buttons`]" :class="extraTableButtonsClass">
                    <slot
                      :name="`${pathString}--extra-buttons`"
                      v-bind="slotScopeData"
                    >
                    </slot>
                  </div>
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
                      <th v-if="isDynamicList && !effectiveReadonly" :class="`select-column ${baseClassPrefix}--select-column`">
                        <input
                          type="checkbox"
                          :checked="isAllSelected"
                          @change="toggleAllSelection"
                          :class="`select-all-checkbox ${baseClassPrefix}--select-all-checkbox`"
                        />
                      </th>
                      <th v-for="(header, index) in getTableHeaders()" :key="index">
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(child, index) in currentNode?.children" :key="`${child.name}_${child.index}_${index}`" :class="`list-row ${baseClassPrefix}--list-row`">
                      <td v-if="isDynamicList && !effectiveReadonly" :class="`select-cell ${baseClassPrefix}--select-cell`">
                        <input
                          type="checkbox"
                          :checked="selectedRows.has(index)"
                          @change="toggleRowSelection(index)"
                          :class="`row-select-checkbox ${baseClassPrefix}--row-select-checkbox`"
                        />
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
                          :showLabel="true"
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
                      :showLabel="true"
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
import BooleanInput from './inputs/BooleanInput.vue'

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

// 列表选择状态管理
const selectedRows = ref<Set<number>>(new Set())
const isAllSelected = ref<boolean>(false)

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
  // 选择相关
  selectedRows: selectedRows.value,
  isAllSelected: isAllSelected.value,
  toggleRowSelection: toggleRowSelection,
  toggleAllSelection: toggleAllSelection,
  removeSelectedItems: removeSelectedItems,

  // 输入框、搜索按钮相关
  handleFocus: handleFocus,
  handleBlur: handleBlur,
  focusCounter: focusCounter.value,
  searchButtonCounter: searchButtonCounter.value,
  handleSearchButtonClick: handleSearchButtonClick,
  displaySearchButton: displaySearchButton.value,


}));

const forceUpdateKey = ref(0)
const forceUpdate = () => {
  forceUpdateKey.value++
}
const displaySearchButton = ref(false)
const searchButtonCounter = ref(0)
const focusCounter = ref(0)

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
const isShowLabel = computed(()=> {
  if (props.config?.hideLabel == true) {
    return false
  }
  if (props.showLabel == undefined) {
    return true
  }
  if (props.showLabel == false) {
    return false
  }
  return true
})
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

const searchButtonClass = computed(() => {
  return `search-button ${baseClassPrefix.value}--search-button`
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

// 监听列表内容变化，重置选择状态
watch(() => currentNode.value?.children?.length, () => {
  selectedRows.value.clear()
  isAllSelected.value = false
}, { immediate: true })

function handleFocus() {
  displaySearchButton.value = true
  searchButtonCounter.value++
  // console.log(`Focus on node: ${pathString.value}`)
}

function handleSearchButtonClick() {
  // 处理搜索按钮点击事件
  // console.log('Search clicked')
  searchButtonCounter.value++
  displaySearchButton.value = false
}

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
    'boolean': BooleanInput,
  }
  return typeMap[currentNode.value.varType] || StringInput
}

function getPlaceholder() {
  const typeMap: Record<string, string> = {
    'string': '请输入文本',
    'number': '请输入数字',
    'date': '请选择日期',
    'selection': '请选择',
    'boolean': '请选择是否',
  }
  // return typeMap[(currentNode.value?.varType ?? 'string')] || '请输入'
  return ""
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

function handleBlur() {
  handleValidation()
  //延迟
  const currentSearchButtonCounter = searchButtonCounter.value
  const currentFocusCount = focusCounter.value
  setTimeout(() => {
    if (searchButtonCounter.value !== currentSearchButtonCounter) return
    if (focusCounter.value !== currentFocusCount) return
      displaySearchButton.value = false
  }, 333)
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
    // 更新选择状态
    selectedRows.value.delete(index)
    // 重新映射选择状态（因为删除后索引会变化）
    const newSelectedRows = new Set<number>()
    selectedRows.value.forEach(selectedIndex => {
      if (selectedIndex > index) {
        newSelectedRows.add(selectedIndex - 1)
      } else if (selectedIndex < index) {
        newSelectedRows.add(selectedIndex)
      }
    })
    selectedRows.value = newSelectedRows
    updateAllSelectedState()
    forceUpdate() // 强制刷新界面
    emit('update', {
      path: props.nodePath,
      action: 'removeItem',
      index: index,
      node: currentNode.value
    })
  }
}

// 选择相关函数
function toggleRowSelection(index: number) {
  if (selectedRows.value.has(index)) {
    selectedRows.value.delete(index)
  } else {
    selectedRows.value.add(index)
  }
  updateAllSelectedState()
}

function toggleAllSelection() {
  if (isAllSelected.value) {
    selectedRows.value.clear()
  } else {
    selectedRows.value.clear()
    const childrenCount = currentNode.value?.children?.length || 0
    for (let i = 0; i < childrenCount; i++) {
      selectedRows.value.add(i)
    }
  }
  updateAllSelectedState()
}

function updateAllSelectedState() {
  const childrenCount = currentNode.value?.children?.length || 0
  isAllSelected.value = childrenCount > 0 && selectedRows.value.size === childrenCount
}

function removeSelectedItems() {
  if (!isDynamicList.value || effectiveReadonly.value || selectedRows.value.size === 0) return

  // 从大到小删除，避免索引变化问题
  const sortedIndices = Array.from(selectedRows.value).sort((a, b) => b - a)

  for (const index of sortedIndices) {
    if (currentNode.value) {
      currentNode.value.removeChild(index)
    }
  }

  selectedRows.value.clear()
  isAllSelected.value = false
  forceUpdate()

  emit('update', {
    path: props.nodePath,
    action: 'removeSelectedItems',
    node: currentNode.value || undefined
  })
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
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  /* border-bottom: 1px solid #f0f0f0; */
}

.search-button-container .search-button {
  background: transparent;
  border: 1px solid var(--theme-color-dark);
  margin-left: -24px;
  width: 24px;
  font-size: 14px;
  padding: 0;
  height: 24px;
  line-height: 1.5;
  z-index: 1; /* 确保按钮在输入框上方 */
  cursor: pointer;
}
.search-button-container .search-button:hover {
  background: var(--theme-color-dark);
  color: white;
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
  display: flex;
  grid-template-columns: 1fr;
}

/* 统一输入框样式 - 方形设计 */
.leaf-node :deep(input),
.leaf-node :deep(select) {
  width: 100%;
  min-width: 120px; /* 最小宽度 */
  padding: 0;
  border: 1px solid var(--theme-color-dark);
  border-radius: 0px; /* 方形直角 */
  font-size: 14px;
  height: 24px;
  line-height: 1.5;
  background: transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.leaf-node :deep(input:focus),
.leaf-node :deep(select:focus) {
  outline: none;
  border-color: var(--theme-color-dark);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.leaf-node :deep(input.readonly),
.leaf-node :deep(select:disabled) {
  background: var(--theme-color-input-readonly);
  cursor: not-allowed;
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
  grid-template-columns: repeat(1, 1fr);
  gap: 0px 24px; /* rowgap, colgap*/
  align-items: center;
  justify-items: start;
  margin-bottom: 16px;
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
  /* border: 1px solid #e5e7eb; */
  margin-top: 10px;
  border-radius: 0px;
  overflow: hidden;
  margin-bottom: 16px;
}

.list-table th {
  background: var(--theme-color-table-header-bg);
  text-align: left;
  font-weight: 450;
  color: var(--theme-color-table-header-text);
  /* height: 40px; */
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

.list-table td {
  padding: 0;
  border-radius: 0px;
  /* border-bottom: 1px solid #f3f4f6; */
  /* height: 36px; */
  white-space: nowrap; /* 防止内容换行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  vertical-align: middle; /* 垂直居中对齐 */
}

.list-table th,
.list-table td {
  padding: 0;
  border-radius: 0px;
  white-space: nowrap; /* 防止内容换行 */
  border: 1px solid #d1d5db;
  width: auto;
  height: 24px;
}

.list-table tr:hover {
  background: var(--theme-color-lighter-a);
}
.list-table td :deep(.leaf-node) {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;
}
/* 表格内的输入框样式调整 */
.list-table td :deep(*:not(input select)) {
  /* display: none; */
  padding: 0;
  margin: 0;
}
.list-table td :deep(input),
.list-table td :deep(select) {
  width: 100%;
  height: 24px; /* 固定输入框高度 */
  padding: 0; /* 减少内边距 */
  /* border: 1px solid #d1d5db; */
  border: none;
  border-radius: 0px;
  font-size: 13px; /* 稍小的字体 */
  line-height: 1.2;
  background: transparent;
}

.list-table td :deep(input:focus),
.list-table td :deep(select:focus) {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

/* 选择列宽度控制 */
.list-table .select-column {
  width: 40px; /* 固定选择列宽度 */
  text-align: center;
}

.list-table .select-cell {
  width: 40px;
  text-align: center;
  padding-left: 4px;
  padding-right: 4px;
  height: 24px;
}

.select-all-checkbox,
.row-select-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #409EFF;
}

.select-all-checkbox:disabled,
.row-select-checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.6;
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
  /* gap: 1px; */
}

.list-controls > button,
.list-controls > .extra-buttons button {
  margin: 0 2px;
  padding: 1px;
  width: 24px;
  height: 24px;
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

.btn-remove-selected {
  padding: 4px 8px;
  border: 1px solid #dc2626;
  border-radius: 4px;
  background: #dc2626;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.btn-remove-selected:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}

.btn-remove-selected:disabled {
  background: #c0c4cc;
  border-color: #c0c4cc;
  cursor: not-allowed;
  opacity: 0.6;
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