<script lang="ts" setup>
import { ref } from 'vue'
import VarBox from '@/components/varbox/VarBox.vue'
import AppContent from '@/components/applicationContent/AppContent.vue'
import ItemConditionDetail from '@/components/itemCondition/ItemConditionDetail.vue'
import { createTreeFromConfig, createNodeFromConfig, cns, VarNode } from '@/utils/VarTree'
import { createItemConditionKit, type ItemConditionKit } from '@/utils/ItemConditionKit'

const appContentRef = ref(null) as any

// 创建基础数据树 - 不包含 items 节点
const mainDataTree = createTreeFromConfig(
  cns('dict','dict','mainData',{},false,{hideLabel:true},[
    cns('dict','dict','itemOverview',{},false,{},[
      cns('string','leaf','inquiry','TEST-001',false,{},[],"Inquiry:"),
      cns('string','leaf','soldToParty','CUSTOMER-001',false,{},[],"Sold-To Party:"),
      // items 节点将通过 kit.summonItemsNode 添加
    ],'Item Overview')
  ])
)

// 创建 ItemConditionKit 实例
const itemConditionKit: ItemConditionKit = createItemConditionKit({
  validationEndpoint: '/api/app/inquiry/items-tab-query',
  readonly: false,
  navigationLabels: {
    cancel: 'Cancel',
    save: 'Save',
    previous: '← Previous',
    next: 'Next →'
  }
})

// 使用 kit 创建 items 节点
const itemsNode = itemConditionKit.summonItemsNode(
  mainDataTree, 
  ['itemOverview', 'items']
)

// 初始化测试数据
function initializeTestData() {
  const testItems = [
    {
      item: '10',
      material: 'MAT-001',
      orderQuantity: '100',
      orderQuantityUnit: 'PC',
      description: 'Test Material 1',
      reqDelivDate: '2024-01-15',
      netValue: '500.00',
      netValueUnit: 'USD',
      taxValue: '50.00',
      taxValueUnit: 'USD',
      pricingDate: '2024-01-01',
      orderProbability: '0.8',
      pricingElements: []
    },
    {
      item: '20',
      material: 'MAT-002',
      orderQuantity: '200',
      orderQuantityUnit: 'PC',
      description: 'Test Material 2',
      reqDelivDate: '2024-01-20',
      netValue: '800.00',
      netValueUnit: 'USD',
      taxValue: '80.00',
      taxValueUnit: 'USD',
      pricingDate: '2024-01-01',
      orderProbability: '0.9',
      pricingElements: []
    }
  ]

  testItems.forEach(itemData => {
    const newItem = itemsNode.config.childTemplate ? 
      createNodeFromConfig(itemsNode.config.childTemplate) :
      new VarNode()
    newItem.forceSetValue(itemData)
    itemsNode.addChild(newItem)
  })
}

// ItemConditionDetail 引用
const itemConditionDetailRef = ref<InstanceType<typeof ItemConditionDetail> | null>(null)

// 树值显示
const treeValueDisplay = ref('')

// 处理 Items 表格按钮点击
async function handleItemsTableClick() {
  console.log('handleItemsTableClick called')

  if (!itemsNode) {
    console.error('Items node not found')
    return
  }

  const selectedChildren = [...itemsNode.getSelectedChildren()]
  console.log('Selected children:', selectedChildren)

  if (selectedChildren && selectedChildren.length > 0) {
    // 切换到详细信息阶段
    console.log('切换到详细信息阶段')
    appContentRef.value?.goToStage(1)

    // 等待组件渲染后，调用详细信息组件的初始化方法
    setTimeout(() => {
      if (itemConditionDetailRef.value) {
        console.log('调用详细信息组件的 handleItemsTableClick')
        itemConditionDetailRef.value.handleItemsTableClick()
      }
    }, 100)
  } else {
    console.log('No items selected')
  }
}

// 处理保存
function handleSave() {
  console.log('保存数据')
  appContentRef.value?.goToStage(0)
}

// 处理取消
function handleCancel() {
  console.log('取消编辑')
  appContentRef.value?.goToStage(0)
}

// 处理验证失败
function handleValidationFailed(items: VarNode[]) {
  console.log('验证失败的items:', items)
}

// 处理验证成功
function handleValidationSuccess(items: VarNode[]) {
  console.log('验证成功的items:', items)
  // 自动切换到详细信息阶段
  appContentRef.value?.goToStage(2)
}

// 处理 AppContent 的 before-next 钩子
async function handleExecute(currentStage: number, targetStage: number) {
  console.log('Stage change:', currentStage, '->', targetStage)
  return true
}

// 处理 AppContent 的 before-prev 钩子
async function handleCancel2(currentStage: number, targetStage: number) {
  console.log('Cancel from stage:', currentStage, 'to:', targetStage)
  return true
}

// 显示树的getValue结果
function showTreeValue() {
  const treeValue = mainDataTree.getValue()
  treeValueDisplay.value = JSON.stringify(treeValue, null, 2)
  console.log('Tree getValue:', treeValue)
}

// 初始化
initializeTestData()
</script>

<template>
  <AppContent
    :stages="['itemOverview', 'itemCondition']"
    :before-next="handleExecute"
    :before-prev="handleCancel2"
    :footer-config="[
      { prevText: '/hide', nextText: '/hide' },
      { prevText: '/hide', nextText: '/hide' }
    ]"
    ref="appContentRef"
  >
    <!-- Items 列表阶段 -->
    <template #[`stage-itemOverview`]>
      <h2>ItemConditionKit 测试 - Items 列表</h2>
      <VarBox :tree="mainDataTree">
        <template #[`mainData-itemOverview-items--extra-buttons`]>
          <button
            class="execute-button table-extra-button"
            @click="handleItemsTableClick"
          >
            ...
          </button>
        </template>
      </VarBox>

      <!-- 测试按钮和显示区域 -->
      <div class="test-section">
        <button class="test-button" @click="showTreeValue">
          显示树的getValue
        </button>
        <div v-if="treeValueDisplay" class="tree-value-display">
          <h3>树的getValue结果：</h3>
          <pre>{{ treeValueDisplay }}</pre>
        </div>
      </div>
    </template>

    <!-- Item 详细信息阶段 -->
    <template #[`stage-itemCondition`]>
      <h2>Item 详细信息 (使用 ItemConditionKit)</h2>
      <ItemConditionDetail
        ref="itemConditionDetailRef"
        :kit="itemConditionKit"
        @save="handleSave"
        @cancel="handleCancel"
        @validation-failed="handleValidationFailed"
        @validation-success="handleValidationSuccess"
      >
        <!-- 传递 pricing elements 的额外按钮 -->
        <template #[`itemDetailConditions-pricingElements--extra-buttons`]>
          <button
            class="execute-button table-extra-button item-condition-button"
            @click="() => {}"
          >
            New
          </button>
          <button
            class="execute-button table-extra-button item-condition-button"
            @click="() => {}"
          >
            Delete
          </button>
        </template>
      </ItemConditionDetail>
    </template>

    <!-- Footer 插槽 - 为teleport提供目标 -->
    <template #[`footer-content-right`]>
      <div class="app-content-footer-content-right">
        <!-- teleport目标容器，ItemConditionDetail的按钮会teleport到这里 -->
      </div>
    </template>
  </AppContent>
</template>

<style scoped>
h2 {
  margin-bottom: 20px;
  color: #333;
}

.table-extra-button {
  width: inherit;
  padding: 0 6px;
  min-width: 20px;
  height: 24px;
  cursor: pointer;
}

.table-extra-button:disabled {
  cursor: not-allowed;
}

.item-condition-button {
  margin-right: 4px;
}

.save-button {
  padding: 8px 20px;
  margin-right: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.save-button:hover {
  background-color: #218838;
}

.cancel-button {
  padding: 8px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-button:hover {
  background-color: #5a6268;
}

/* 测试区域样式 */
.test-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.test-button {
  padding: 8px 16px;
  background-color: var(--theme-color-dark);
  color: var(--theme-color-contrast);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.test-button:hover {
  background-color: var(--theme-color-execute-button-hover);
}

.tree-value-display {
  margin-top: 15px;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
}

.tree-value-display h3 {
  margin: 0 0 10px 0;
  color: var(--theme-color-dark);
  font-size: 14px;
}

.tree-value-display pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 复用样式 */
:deep(.mainData-basicInfo--dict-leaf-section) {
  display: grid;
  grid-template-columns: 50% 35% 15%;
  grid-template-rows: auto auto;
}

:deep(.mainData-basicInfo-inquiry--wrapper) {
  grid-column: 1;
  grid-row: 1;
}
:deep(.mainData-basicInfo-netValue--wrapper) {
  grid-column: 2;
  grid-row: 1;
}
:deep(.mainData-basicInfo-netValueUnit--wrapper) {
  grid-column: 3;
  grid-row: 1;
}
:deep(.mainData-basicInfo-soldToParty--wrapper) {
  grid-column: 1;
  grid-row: 2;
}
</style>
