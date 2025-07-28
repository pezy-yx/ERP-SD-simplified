<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import VarBox from '@/components/varbox/VarBox.vue'
import FilterTabs from '@/components/FilterTabs.vue'
import { type ItemConditionKit } from '@/utils/ItemConditionKit'
import { VarNode, VarTree } from '@/utils/VarTree'

// Props
interface Props {
  kit: ItemConditionKit
}

const props = defineProps<Props>()

// Events
const emit = defineEmits<{
  save: []
  cancel: []
  'validation-failed': [items: VarNode[]]
  'validation-success': [items: VarNode[]]
}>()

// 响应式数据
const selectedItems = ref<VarNode[]>([])
const currentItemIndex = ref(0)
const currentTabIndex = ref(0)
const editingNode = ref<{ node: VarNode | null }>({ node: null })
const isDataReady = ref(false)

// Teleport 相关状态
const teleportTarget = ref<string | null>(null)
const showButtonsInline = ref(true)

// 计算属性
const config = computed(() => props.kit.detailPageConfig)
const hasMultipleItems = computed(() => selectedItems.value.length > 1)
const canGoPrevious = computed(() => currentItemIndex.value > 0)
const canGoNext = computed(() => currentItemIndex.value < selectedItems.value.length - 1)
const hasTabs = computed(() => config.value.detailTrees[0]?.tabs && config.value.detailTrees[0].tabs.length > 0)
const tabsConfig = computed(() => config.value.detailTrees[0]?.tabs || [])
const currentDetailTree = computed(() => {
  if (hasTabs.value && config.value.detailTrees.length > 1) {
    return config.value.detailTrees[currentTabIndex.value] || config.value.detailTrees[0]
  }
  return config.value.detailTrees[0]
})

// API 基础 URL
const API_BASE_URL = window.API_BASE_URL || ''

/**
 * 处理 Items 表格的按钮点击事件
 */
async function handleItemsTableClick() {
  if (!config.value.itemsNode) {
    console.error('Items node not found')
    return
  }

  const selectedChildren = [...config.value.itemsNode.getSelectedChildren()]

  if (selectedChildren && selectedChildren.length > 0) {
    // 先检查所有选中的item是否有validation状态
    const itemsWithoutValidation = selectedChildren.filter(item =>
      item.config.data?.validation === undefined
    )

    // 如果有未验证的item，先进行验证
    if (itemsWithoutValidation.length > 0) {
      console.log('发现未验证的item，进行验证...')
      const result = await validateItems(itemsWithoutValidation as VarNode[])
      if (!result) {
        console.log('验证失败，无法继续')
        emit('validation-failed', itemsWithoutValidation as VarNode[])
        return
      }
    }

    // 再次检查所有选中的item是否都验证通过
    const hasInvalidItems = selectedChildren.some(item =>
      item.config.data?.validation === false
    )

    if (hasInvalidItems) {
      console.log('存在验证未通过的item，无法继续')
      emit('validation-failed', selectedChildren as VarNode[])
      return
    }

    // 所有验证都通过，准备数据
    selectedItems.value = selectedChildren as VarNode[]
    currentItemIndex.value = 0
    currentTabIndex.value = 0

    // 确保数据准备完成后再更新详细信息树
    await nextTick()
    updateItemDetailTrees()

    // 等待数据准备完成
    await nextTick()

    // 确保 isDataReady 为 true 后再继续
    if (!isDataReady.value) {
      console.warn('数据未准备完成，等待...')
      await nextTick()
    }

    // 成功进入详情页面后，清空items表格的选中状态
    config.value.itemsNode.children.forEach(child => {
      child.setSelection(false)
    })

    emit('validation-success', selectedItems.value)
  } else {
    console.log('No items selected')
    // 没有选中物品时，不应该进入详细信息页面
    emit('validation-failed', [])
  }
}

/**
 * 验证指定的items
 */
async function validateItems(itemNodes: VarNode[]): Promise<boolean> {
  const itemValues = itemNodes.map(node => node.getValue())

  try {
    const response = await fetch(`${API_BASE_URL}${config.value.validationEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemValues)
    })

    const data = await response.json()
    console.log('验证返回的数据', data)

    if (data.success) {
      // 更新每个item的详细信息
      if (data.data.breakdowns && Array.isArray(data.data.breakdowns)) {
        data.data.breakdowns.forEach((breakdown: any, index: number) => {
          if (index < itemNodes.length) {
            itemNodes[index].forceSetValue(breakdown)
          }
        })
      }

      // 根据badRecordIndices设置validation
      if (data.data.result && Array.isArray(data.data.result.badRecordIndices)) {
        // 先重置所有节点的validation
        itemNodes.forEach(node => {
          if (!node.config.data) {
            node.config.data = {}
          }
          node.config.data.validation = true
        })

        // 设置不合法节点的validation
        data.data.result.badRecordIndices.forEach((badIndex: number) => {
          if (badIndex < itemNodes.length) {
            if (!itemNodes[badIndex].config.data) {
              itemNodes[badIndex].config.data = {}
            }
            itemNodes[badIndex].config.data.validation = false
          }
        })
      }

      return data.data.result.allDataLegal === 1
    }

    return false
  } catch (error) {
    console.error('验证失败:', error)
    return false
  }
}

/**
 * 更新详情页面的树结构数据
 * @description 把editingNode.node设为正在编辑节点的一个拷贝，将itemCondition中的输入框指向这个拷贝中的节点
 */
function updateItemDetailTrees() {
  if (selectedItems.value.length === 0) {
    isDataReady.value = false
    editingNode.value.node = null
    return
  }

  // 先设置为未准备状态
  isDataReady.value = false

  const currentItem = selectedItems.value[currentItemIndex.value]
  editingNode.value.node = currentItem.clone()
  const node = editingNode.value.node

  console.log('editingNode 初始值:', node.getValue())

  // 使用引用传递而不是值拷贝设置
  const setNodeFromItem = (sourcePath: string[], targetPath: string[], targetTree: VarTree) => {
    const sourceNode = node.findNodeByPath(sourcePath)
    if (sourceNode) {
      // 使用 replaceNodeByPath 让目标树的节点引用源节点
      targetTree.replaceNodeByPath(sourceNode, targetPath)
    }
  }

  // 更新所有详细信息树
  config.value.detailTrees.forEach(detailTree => {
    // 更新header树（如果存在）
    if (detailTree.headerTree) {
      // Header 树需要的字段
      setNodeFromItem(['item'], ['item'], detailTree.headerTree)
      setNodeFromItem(['material'], ['material'], detailTree.headerTree)
    }

    // 更新详细信息树
    if (detailTree.tree.root?.name === 'itemDetailSales') {
      // Sales 树需要的字段
      setNodeFromItem(['orderQuantity'], ['orderQuantityAndDeliveryDate', 'orderQuantity'], detailTree.tree)
      setNodeFromItem(['orderQuantityUnit'], ['orderQuantityAndDeliveryDate', 'orderQuantityUnit'], detailTree.tree)
      setNodeFromItem(['reqDelivDate'], ['orderQuantityAndDeliveryDate', 'reqDelivDate'], detailTree.tree)
      setNodeFromItem(['netValue'], ['generalSalesData', 'netValue'], detailTree.tree)
      setNodeFromItem(['netValueUnit'], ['generalSalesData', 'netValueUnit'], detailTree.tree)
      setNodeFromItem(['pricingDate'], ['generalSalesData', 'pricingDate'], detailTree.tree)
      setNodeFromItem(['orderProbability'], ['generalSalesData', 'orderProbability'], detailTree.tree)
    } else if (detailTree.tree.root?.name === 'itemDetailConditions') {
      // Conditions 树需要的字段
      setNodeFromItem(['orderQuantity'], ['orderQuantity'], detailTree.tree)
      setNodeFromItem(['orderQuantityUnit'], ['orderQuantityUnit'], detailTree.tree)
      setNodeFromItem(['netValue'], ['netValue'], detailTree.tree)
      setNodeFromItem(['netValueUnit'], ['netValueUnit'], detailTree.tree)
      setNodeFromItem(['taxValue'], ['taxValue'], detailTree.tree)
      setNodeFromItem(['taxValueUnit'], ['taxValueUnit'], detailTree.tree)
      setNodeFromItem(['pricingElements'], ['pricingElements'], detailTree.tree)
    }
  })

  // 数据准备完成
  isDataReady.value = true
}



/**
 * 验证当前itemCondition数据并同步到原始item
 * @description 把editingNode.node中的数据发送给后端验证，验证成功后更新原始item的数据
 */
async function validateCurrentItemConditionData(): Promise<boolean> {
  if (!editingNode.value.node) return false

  // 如果未更改过(config.data.validation is true) 直接返回
  if (editingNode.value.node.config.data?.validation) {
    console.log('数据未更改，无需验证', editingNode.value.node)
    return true
  }

  const nodeList = [editingNode.value.node]
  const isValid = await validateItems(nodeList)

  if (isValid) {
    console.log('数据验证成功')
    // 同步数据
    const currentNode = selectedItems.value[currentItemIndex.value]
    currentNode.forceSetValue(editingNode.value.node.getValue())
  } else {
    console.log('数据验证失败')
  }

  return isValid
}

/**
 * 验证当前itemCondition数据（仅验证，不同步）
 */
async function validateCurrentItemConditionDataOnly(): Promise<boolean> {
  if (!editingNode.value.node) return false

  // 如果未更改过(config.data.validation is true) 直接返回
  if (editingNode.value.node.config.data?.validation) {
    console.log('数据未更改，无需验证')
    return true
  }

  const nodeList = [editingNode.value.node]
  const isValid = await validateItems(nodeList)

  if (isValid) {
    console.log('数据验证成功（仅验证，未同步）')
  } else {
    console.log('数据验证失败')
  }

  return isValid
}

/**
 * 同步当前编辑数据到原始item
 */
function syncCurrentDataToOriginalItem() {
  if (!editingNode.value.node) return

  const currentNode = selectedItems.value[currentItemIndex.value]
  currentNode.forceSetValue(editingNode.value.node.getValue())
  console.log('数据已同步到原始item')
}

/**
 * 处理用户输入事件
 */
function handleInputFromNode(node: VarNode, value: string, data: any) {
  console.log('用户输入:', node.name, '=', value)

  // 标记 editingNode 为未验证
  if (editingNode.value.node && !editingNode.value.node.config.data) {
    editingNode.value.node.config.data = {}
  }
  if (editingNode.value.node) {
    editingNode.value.node.config.data!.validation = false
  }
}



/**
 * 处理回车事件
 */
async function handleEnterFromNode(_node: VarNode, value: string, data: any) {
  await validateCurrentItemConditionData()
}

/**
 * 切换到指定的item
 */
async function switchToItem(index: number) {
  if (index >= 0 && index < selectedItems.value.length) {
    const isValid = await validateCurrentItemConditionData()
    if (isValid) {
      currentItemIndex.value = index
      updateItemDetailTrees()
    } else {
      console.log('数据验证失败，无法切换')
    }
  }
}

/**
 * 切换到上一个item
 */
async function switchToPreviousItem() {
  await switchToItem(currentItemIndex.value - 1)
}

/**
 * 切换到下一个item
 */
async function switchToNextItem() {
  await switchToItem(currentItemIndex.value + 1)
}

/**
 * 处理标签页切换
 */
function handleTabClick(index: number) {
  currentTabIndex.value = index
}

/**
 * 保存数据
 */
async function save() {
  const isValid = await validateCurrentItemConditionDataOnly()
  if (isValid) {
    // 验证成功后同步数据到原始item
    syncCurrentDataToOriginalItem()
    emit('save')
  } else {
    console.log('数据验证失败，无法保存')
  }
}

/**
 * 检测teleport目标是否存在
 */
function checkTeleportTarget() {
  // 检查是否存在 AppContent 的 footer 插槽目标
  const footerTarget = document.querySelector('.app-content-footer-content-right')
  if (footerTarget) {
    teleportTarget.value = '.app-content-footer-content-right'
    showButtonsInline.value = false
    console.log('找到teleport目标，按钮将显示在footer中')
  } else {
    teleportTarget.value = null
    showButtonsInline.value = true
    console.log('未找到teleport目标，按钮将显示在页面内')
  }
}

/**
 * 初始化组件数据
 */
async function initializeComponent() {
  if (!config.value.itemsNode) {
    console.error('Items node not found')
    return
  }

  const selectedChildren = [...config.value.itemsNode.getSelectedChildren()]

  if (selectedChildren && selectedChildren.length > 0) {
    console.log('发现选中的items，自动初始化详细信息页面')

    // 设置选中的items
    selectedItems.value = selectedChildren as VarNode[]
    currentItemIndex.value = 0
    currentTabIndex.value = 0

    // 确保数据准备完成后再更新详细信息树
    await nextTick()
    updateItemDetailTrees()

    // 等待数据准备完成
    await nextTick()
    isDataReady.value = true

    emit('validation-success', selectedChildren as VarNode[])
  } else {
    console.log('没有选中的items，等待用户选择')
    isDataReady.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  nextTick(() => {
    checkTeleportTarget()
    initializeComponent()
  })
})

onUnmounted(() => {
  // 清理teleport状态
  teleportTarget.value = null
  showButtonsInline.value = true
})

/**
 * 取消编辑
 */
function cancel() {
  if (selectedItems.value.length > 0) {
    selectedItems.value.forEach(item => {
      if (item.config.data?.validation === false) {
        item.config.data.validation = undefined
      }
    })
  }
  selectedItems.value = []
  editingNode.value = { node: null }
  emit('cancel')
}

// 暴露方法给父组件
defineExpose({
  handleItemsTableClick,
  save,
  cancel,
  switchToPreviousItem,
  switchToNextItem,
  selectedItems: computed(() => selectedItems.value),
  hasSelectedItems: computed(() => selectedItems.value.length > 0)
})
</script>

<template>
  <div v-if="isDataReady" class="item-condition-detail">
    <!-- Item导航 -->
    <div class="item-navigation" v-if="hasMultipleItems">
      <button
        class="item-nav-button item-prev-button"
        @click="switchToPreviousItem"
        :disabled="!canGoPrevious"
      >
        {{ config.navigationLabels?.previous }}
      </button>
      <span class="item-counter">
        Item {{ currentItemIndex + 1 }} of {{ selectedItems.length }}
      </span>
      <button
        class="item-nav-button item-next-button"
        @click="switchToNextItem"
        :disabled="!canGoNext"
      >
        {{ config.navigationLabels?.next }}
      </button>
    </div>

    <!-- Header树 -->
    <VarBox
      v-if="currentDetailTree.headerTree && editingNode.node"
      :tree="currentDetailTree.headerTree"
    />

    <!-- 标签页 -->
    <FilterTabs
      v-if="hasTabs"
      :tabs="tabsConfig"
      @tab-selected="handleTabClick"
      class="reverse middle hide-bottom-line"
      :initialActiveTab="0"
    />

    <!-- 详细信息树 -->
    <VarBox
      v-if="editingNode.node"
      :tree="currentDetailTree.tree"
      @enter-from-node="validateCurrentItemConditionDataOnly"
      @input-from-node="handleInputFromNode"
    >
      <!-- Sales 页面的单位字段插槽 -->
      <template #[`itemDetailSales-orderQuantityAndDeliveryDate-orderQuantity--extra`]>
        <VarBox
          :tree="currentDetailTree.tree"
          :path="['orderQuantityAndDeliveryDate','orderQuantityUnit']"
          :showLabel="false"
        />
      </template>
      <template #[`itemDetailSales-generalSalesData-netValue--extra`]>
        <VarBox
          :tree="currentDetailTree.tree"
          :path="['generalSalesData','netValueUnit']"
          :showLabel="false"
        />
      </template>

      <!-- Conditions 页面的单位字段插槽 -->
      <template #[`itemDetailConditions-orderQuantity--extra`]>
        <VarBox
          :tree="currentDetailTree.tree"
          :path="['orderQuantityUnit']"
          :showLabel="false"
        />
      </template>
      <template #[`itemDetailConditions-netValue--extra`]>
        <VarBox
          :tree="currentDetailTree.tree"
          :path="['netValueUnit']"
          :showLabel="false"
        />
      </template>
      <template #[`itemDetailConditions-taxValue--extra`]>
        <VarBox
          :tree="currentDetailTree.tree"
          :path="['taxValueUnit']"
          :showLabel="false"
        />
      </template>
    >
      <!-- 传递所有插槽 -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </VarBox>

    <!-- 操作按钮 - 页面内显示 -->
    <div v-if="showButtonsInline" class="item-condition-actions">
      <button class="cancel-button" @click="cancel">
        {{ config.navigationLabels?.cancel }}
      </button>
      <button
        v-if="!config.readonly"
        class="save-button"
        @click="save"
      >
        {{ config.navigationLabels?.save }}
      </button>
    </div>

    <!-- 操作按钮 - Teleport到footer -->
    <Teleport v-if="teleportTarget && !showButtonsInline" :to="teleportTarget">
      <button class="cancel-button" @click="cancel">
        {{ config.navigationLabels?.cancel }}
      </button>
      <button
        v-if="!config.readonly"
        class="save-button"
        @click="save"
      >
        {{ config.navigationLabels?.save }}
      </button>
    </Teleport>
  </div>
</template>

<style scoped>
/* 复用之前的样式 */
.item-condition-detail {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.item-counter {
  font-weight: bold;
  color: #333;
}

.item-nav-button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.item-nav-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.item-nav-button:disabled {
  background-color: #f9f9f9;
  color: #999;
  cursor: not-allowed;
}

.item-prev-button {
  margin-right: auto;
}

.item-next-button {
  margin-left: auto;
}

.item-condition-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 0;
  border-top: 1px solid #e0e0e0;
}

/* Save和Cancel按钮样式 - 与inquiry保持一致 */
.save-button {
  padding: 8px 20px;
  margin-right: 10px;
  background-color: var(--theme-color-dark);
  color: var(--theme-color-contrast);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: var(--theme-color-execute-button-hover);
}

.cancel-button {
  padding: 8px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #5a6268;
}

/* VarTree 详细信息页面布局样式 */
:deep(.itemDetailHeader--dict-leaf-section) {
  display: grid;
  grid-template-columns: 40%;
  grid-template-rows: auto auto;
  gap: 0
}

/* Sales 页面布局 - 使用 flex 布局支持单位字段 */
:deep(.itemDetailSales-orderQuantityAndDeliveryDate--dict-leaf-section),
:deep(.itemDetailSales-generalSalesData--dict-leaf-section) {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 10px;
}

/* Sales 页面数值字段的 flex 布局 */
:deep(.itemDetailSales-orderQuantityAndDeliveryDate-orderQuantity--leaf-input-container),
:deep(.itemDetailSales-generalSalesData-netValue--leaf-input-container) {
  display: flex;
  gap: 5px;
  align-items: center;
}

/* Sales 页面 extra 插槽占据剩余空间 */
:deep(.itemDetailSales-orderQuantityAndDeliveryDate-orderQuantity--extra),
:deep(.itemDetailSales-generalSalesData-netValue--extra) {
  flex: 1;
}

/* Conditions 页面布局 - 使用 flex 布局支持单位字段 */
:deep(.itemDetailConditions--dict-leaf-section) {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 10px;
}

/* Conditions 页面数值字段的 flex 布局 */
:deep(.itemDetailConditions-orderQuantity--leaf-input-container),
:deep(.itemDetailConditions-netValue--leaf-input-container),
:deep(.itemDetailConditions-taxValue--leaf-input-container) {
  display: flex;
  gap: 5px;
  align-items: center;
}

/* Conditions 页面 extra 插槽占据剩余空间 */
:deep(.itemDetailConditions-orderQuantity--extra),
:deep(.itemDetailConditions-netValue--extra),
:deep(.itemDetailConditions-taxValue--extra) {
  flex: 1;
}
</style>
