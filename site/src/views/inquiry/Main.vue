<script lang="ts" setup>
import {ref, Ref, computed, onMounted} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
import FilterTabs from '@/components/FilterTabs.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'
import {createTreeFromConfig, createNodeFromConfig, cns, VarTree, VarNode, NodeStructure, isNodeStructure, VarNodeValue} from '@/utils/VarTree';
import {
  inquiryTypeSearch,
  salesOrgSearch,
  distributionChannelSearch,
  divisionSearch,
  inquiryIdSearch,
  customerSearch,
} from '@/utils/searchMethods'
import { createItemConditionKit, type ItemConditionKit } from '@/utils/ItemConditionKit'
import ItemConditionDetail from '@/components/itemCondition/ItemConditionDetail.vue'


const appContentRef = ref(null) as any

type State = 'create' | 'change' | 'display'

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
// 复用 kit 的校验能力，并在校验成功后更新总计字段
itemConditionKit.updateConfig({
  onGeneralData: async (generalData: any) => {
    await fetch(`${window.getAPIBaseUrl()}/api/item/cal-value`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryDataTree.findNodeByPath(['itemOverview','items'])?.getValue() ?? [])
    }).then(async (response) => {
      const data = await response.json()
      // 更新销售订单数据树
      inquiryDataTree.findNodeByPath(['basicInfo','netValue'])?.forceSetValue(data?.data?.netValue)
      inquiryDataTree.findNodeByPath(['basicInfo','netValueUnit'])?.forceSetValue(data?.data?.netValueUnit)
      inquiryDataTree.findNodeByPath(['itemOverview','expectOralVal'])?.forceSetValue(data?.data?.netValue)
      inquiryDataTree.findNodeByPath(['itemOverview','expectOralValUnit'])?.forceSetValue(data?.data?.netValueUnit)
      inquiryDataTree.forceUpdate()
    })
  },
  onSave: async () => {
    await itemsTabQueryAll()
  }
})

function validateItemsInTree(itemsPath: string[]) {
  return (itemConditionKit as any).validateItemsInTree(
    inquiryDataTree,
    itemsPath,
    { forceUpdateTree: inquiryDataTree }
  )
}
function validateItems(nodes: VarNode[]) {
  return (itemConditionKit as any).validateItems(nodes, { forceUpdateTree: inquiryDataTree })
}
/**
 * @description 应用模式-创建/修改/查看
 */
const state: Ref<State> = ref('create')
const onCreateState = computed(() => state.value === 'create')
const onChangeState = computed(() => state.value === 'change')
const onDisplayState = computed(() => state.value === 'display')
function appToState(newState: State) {
  state.value = newState
  let readonly = newState === 'display'
  writableTrees.forEach(tree => {
    tree.root!.readonly = readonly
  })
  appContentRef.value.forceUpdate()
}

const initializeStageNextButtonLabel = computed(() => {
  if (onCreateState.value) {
    return 'Continue'
  }
  if (onChangeState.value) {
    return 'Execute'
  }
  if (onDisplayState.value) {
    return 'Execute'
  }
  return '/hide'
})

const informationStagePrevButtonLabel = computed(() => {
  if (onCreateState.value) {
    return 'Cancel'
  }
  if (onChangeState.value) {
    return 'Cancel'
  }
  if (onDisplayState.value) {
    return 'Cancel'
  }
  return '/hide'
})

const informationStageNextButtonLabel = computed(() => {
  if (onCreateState.value) {
    return 'Create'
  }
  if (onChangeState.value) {
    return 'Save'
  }
  if (onDisplayState.value) {
    return 'Switch to Change'
  }
  return '/hide'
})

const itemDetailStageCancelButtonLabel = computed(() => {
  if (onCreateState.value) {
    return 'Cancel'
  }
  if (onChangeState.value) {
    return 'Cancel'
  }
  if (onDisplayState.value) {
    return 'Back'
  }
  return 'Back'
})

const itemDetailStageExecuteButtonVisible = computed(() => {
  return onCreateState.value || onChangeState.value
})

defineExpose({
  appToState,
})

/**
 * @description 初始阶段-创建-初始化询价单
 */
const initialCreationTree = createTreeFromConfig(
  cns('dict','dict','initialScreen',{},false,{hideLabel:true},[
    cns('dict','dict','inquiryType',{},false,{hideLabel:true},[
      cns('string','leaf','inquiryType','',false,{searchMethods:inquiryTypeSearch},[],"Inquiry Type:"),
    ]),
    cns('dict','dict','salesOrg',{},false,{},[
      cns('string','leaf','salesOrganization','',false,{searchMethods:salesOrgSearch},[],"Sales Organization:"),
      cns('string','leaf','distributionChannel','',false,{searchMethods:distributionChannelSearch},[],"Distribution Channel:"),
      cns('string','leaf','division','',false,{searchMethods:divisionSearch},[],"Division:"),
    ],"Organizational Data"),
  ])
)

/**
 * @description 初始阶段-查询/修改-搜索询价单
 */
const initialSearchTree = createTreeFromConfig(
  cns('dict','dict','initialScreen',{},false,{hideLabel:true},[
    cns('string','leaf','inquiryId','',false,{searchMethods:inquiryIdSearch},[],"Inquiry Id:"),
  ])
)

/**
 * @description 主信息-询价单信息主树
 */
const inquiryDataTree = createTreeFromConfig(
  cns('dict','dict','inquiryData',{},false,{hideLabel:true},[
    cns('dict','dict','meta',{},false,{hideSelf:true},[
      cns('string','leaf','id','',false,{},[]),
    ]),
    cns('dict','dict','basicInfo',{},false,{hideLabel:true},[
      cns('string','leaf','inquiry','',false,{},[],"Inquiry:"),
      cns('string','leaf','soldToParty','',false,{searchMethods:customerSearch},[],"Sold-To Party:"),
      cns('string','leaf','shipToParty','',false,{searchMethods:customerSearch},[],"Ship-To Party:"),
      cns('string','leaf','customerReference','',false,{},[],"Cust. Reference:"),
      cns('string','leaf','netValue','0.0',true,{},[],"Net Value:"),
      cns('string','leaf','netValueUnit','',true,{hideLabel:true},[],"Net Value Unit:"),
      cns('date','leaf','customerReferenceDate','',false,{},[],"Cust. Ref. Date:"),
    ]),
    cns('dict','dict','itemOverview',{},false,{},[
      cns('date','leaf','validFrom','',false,{},[],"Valid From:"),
      cns('date','leaf','validTo','',false,{},[],"Valid To:"),
      cns('date','leaf','reqDelivDate','',false,{},[],"Req. Deliv Date:"),
      cns('string','leaf','expectOralVal','0.0',true,{},[],"Expect. Oral Val:"),
      cns('string','leaf','expectOralValUnit','',true,{hideLabel:true},[],"Expect. Oral Val Unit:"),
      // items 节点将通过 itemConditionKit.summonItemsNode 添加
    ],'Item Overview')
  ])
)

// 使用 ItemConditionKit 创建 items 节点（使用默认模板）
itemConditionKit.summonItemsNode(
  inquiryDataTree,
  ['itemOverview', 'items']
  // 不传递自定义模板，使用默认模板
)

/**
 * @description 询价单物品的可写树，即stage1 stage2，用于显示状态和编辑状态的切换
 * @description 现在只包含主数据树，item detail由ItemConditionKit管理
 */
const writableTrees = [inquiryDataTree]


/**
 * 将初始化创建请求从 VarTree 的 getValue 结果转换为文档定义的扁平结构
 * 文档期望: { inquiryType, salesOrganization, distributionChannel, division }
 * VarTree 当前输出: { inquiryType: { inquiryType }, salesOrg: { salesOrganization, distributionChannel, division } }
 */
function transformInitializePayload(input: any) {
  const inquiryType = input?.inquiryType?.inquiryType ?? ''
  const salesOrg = input?.salesOrg ?? {}
  return {
    inquiryType,
    salesOrganization: salesOrg?.salesOrganization ?? '',
    distributionChannel: salesOrg?.distributionChannel ?? '',
    division: salesOrg?.division ?? ''
  }
}

const initializeResult = ref(false)
/**
 * @description 创建-初始化
 */
async function initializeByCreation() {
  const data = await fetch(`${window.getAPIBaseUrl()}/api/app/inquiry/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transformInitializePayload(initialCreationTree.getValue()))
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('申请失败:', error)
    return { success: false }
  })
  console.log('返回的数据',data)
  initializeResult.value = data.success
  if(!data.success) return false
  // inquiryData-itemOverview-reqDelivDate
  if(data.data.content) {
    inquiryDataTree.forceSetValue(data.data.content)
  }
  if (initializeResult.value) {
    return true
  }
  return false
}

/**
 * @description 查询/修改-初始化
 */
async function initializeByGet() {
  const data = await fetch(`${window.getAPIBaseUrl()}/api/app/inquiry/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(initialSearchTree.getValue())
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('申请失败:', error)
    return { success: false }
  })
  console.log('返回的数据',data)
  if(!data.success) return false
  if(!data.data.content) {
    return false
  }
  const inquiryData: VarNodeValue = data.data.content
  inquiryDataTree.forceSetValue(inquiryData)
  await itemsTabQueryAll()
  return true
}

/**
 * @description 封装itemsTabQuery-查询所有（复用 kit）
 */
async function itemsTabQueryAll() {
  return await (itemConditionKit as any).validateItemsInTree(
    inquiryDataTree,
    ['itemOverview','items'],
    { forceUpdateTree: inquiryDataTree }
  )
}

// 页面层如需对指定 nodes 进行校验，可直接使用 validateItems(itemNodes)

// ItemConditionKit 相关的事件处理函数
function handleSave() {
  console.log('保存数据')
  // 返回到主页面
  appContentRef.value.goToStage(1)
}

function handleItemConditionCancel() {
  console.log('取消编辑')
  // 返回到主页面
  appContentRef.value.goToStage(1)
}

function handleValidationFailed() {
  console.log('验证失败')
}

function handleValidationSuccess() {
  console.log('验证成功')
}
/**
 * @descrition 处理Items Table的按钮点击事件
 * @param selection 选中的行
 */
async function handleItemsTableClick() {
  // 获取items节点
  const items = inquiryDataTree.findNodeByPath(['itemOverview','items'])!
  const selectedChildren = [...items.getSelectedChildren()]

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
        return // 验证失败，不继续执行
      }
    }

    // 再次检查所有选中的item是否都验证通过
    const hasInvalidItems = selectedChildren.some(item =>
      item.config.data?.validation === false
    )

    if (hasInvalidItems) {
      console.log('存在验证未通过的item，无法继续')
      return // 有验证未通过的item，不继续执行
    }

    // 所有验证都通过，切换到详情页面
    appContentRef.value.goToStage(2)

    // 延迟清空items表格的选中状态，让ItemConditionDetail组件先初始化
    setTimeout(() => {
      items.children.forEach(child => {
        child.setSelection(false)
      })
    }, 100)
  } else {
    console.log('No items selected')
  }
}







/**
 * @description 询价单变量树的enter-from-node事件处理
 * @param node 节点对象
 * @param value 值
 * @param data 其他数据
 */
async function handleEnterFromNodeInquiryTree(node: VarNode, value: string, data: any) {
  if (data.nodePath.length > 2 && data.nodePath[0] === 'itemOverview' && data.nodePath[1] === 'items') {
    // 执行价格查询
    await itemsTabQueryAll()
  }
}

/**
 * @description 状态管理的before-prev钩子
 * @param currentStage
 * @param targetStage
 */
async function handleCancel(currentStage: number, targetStage: number) {
  if (currentStage === 1) {
    const confirmValue = confirm('Cancel?')
    if(confirmValue) {
      appContentRef.value.footerMessage = ''
    }
    return confirmValue
  }
  return true
}

/**
 * @description 状态管理的before-next钩子
 * @param currentStage
 * @param targetStage
 */
async function handleExecute(currentStage: number, targetStage: number) {
  console.log('try: stage change:',currentStage,'->',targetStage)
  if (currentStage === 0) {
    if (onCreateState.value) {
      return await initializeByCreation()
    }
    if (onChangeState.value || onDisplayState.value) {
      const r = await initializeByGet()
      console.log('初始化结果',r)
      return r
    }
    return false
  }

  if (currentStage === 1) {
    if (onDisplayState.value) {
      console.log('切换到修改状态')
      appToState('change')
      return false
    }
    if (onCreateState.value || onChangeState.value) {
      // 先做一次tab
      await itemsTabQueryAll()
      inquiryDataTree.forceUpdate()
      console.log(inquiryDataTree.getValue())
      // 向后端发送stage 1的所有树，创建inquiry
      const data = await fetch(`${window.getAPIBaseUrl()}/api/app/inquiry/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryDataTree.getValue())
      }).then(response => {
        console.log('正常返回', response)
        return response.json()
      }).catch(error => {
        console.error('创建询价单失败:', error)
        return { success: false }
      })
      console.log('返回的数据',data)
      // footer
      if (data.success){
        appContentRef.value.footerMessage = data.data.message
        if (data.data.content?.id) {
          inquiryDataTree.findNodeByPath(['meta','id'])!.setValue(data.data.content?.id)
          inquiryDataTree.findNodeByPath(['basicInfo','inquiry'])!.setValue(data.data.content?.id)
        }
        appToState('display')
      }
    }
    return false
  }


  return false
}

</script>

<template>
  <AppContent
    :stages="['initialScreen','information','itemCondition']"
    :before-next="handleExecute"
    :before-prev="handleCancel"
    :footer-config="[
      { nextText:initializeStageNextButtonLabel }, // 使用插槽自定义第一步的按钮
      { prevText:informationStagePrevButtonLabel, nextText:informationStageNextButtonLabel },
      { prevText:'/hide', nextText:'/hide'}
    ]"
    ref="appContentRef"
  >
    <template #[`stage-initialScreen`]>
      <VarBox
        :tree="initialCreationTree"
        v-if="onCreateState"
      ></VarBox>
      <VarBox
        :tree="initialSearchTree"
        v-if="onDisplayState || onChangeState"
      ></VarBox>
    </template>
    <template #[`stage-information`]>
      <VarBox
        :tree="inquiryDataTree"
        @enter-from-node="handleEnterFromNodeInquiryTree"
      >
        <template #[`inquiryData-itemOverview-items--extra-buttons`]>
          <button
            class = "execute-button table-extra-button"
            @click="handleItemsTableClick"
          >
            ...
          </button>
        </template>
      </VarBox>
    </template>
    <template #[`stage-itemCondition`]>
      <h2>Item Details</h2>
      <ItemConditionDetail
        :kit="itemConditionKit"
        @save="handleSave"
        @cancel="handleItemConditionCancel"
        @validation-failed="handleValidationFailed"
        @validation-success="handleValidationSuccess"
      >
      </ItemConditionDetail>
    </template>

    <template #[`footer-content-right`]>
      <div class="app-content-footer-content-right">
        
        <!-- ItemConditionDetail 组件会使用 teleport 将按钮显示在这里 -->
      </div>
    </template>

  </AppContent>
</template>

<style scoped>
:deep(.inquiryData-basicInfo--dict-leaf-section) {
  display: grid;
  grid-template-columns: 50% 35% 15%;
  grid-template-rows: auto auto auto auto;
}

:deep(.inquiryData-basicInfo-inquiry--wrapper) {
  grid-column: 1;
  grid-row: 1;
}
:deep(.inquiryData-basicInfo-netValue--wrapper) {
  grid-column: 2;
  grid-row: 1;
}
:deep(.inquiryData-basicInfo-netValueUnit--wrapper) {
  grid-column: 3;
  grid-row: 1;
}
:deep(.inquiryData-basicInfo-soldToParty--wrapper) {
  grid-column: 1;
  grid-row: 2;
}
:deep(.inquiryData-basicInfo-shipToParty--wrapper) {
  grid-column: 1;
  grid-row: 3;
}
:deep(.inquiryData-basicInfo-customerReference--wrapper) {
  grid-column: 1;
  grid-row: 4;
}
:deep(.inquiryData-basicInfo-customerReferenceDate--wrapper) {
  grid-column: 2;
  grid-row: 4;
}

:deep(.inquiryData-itemOverview--dict-leaf-section) {
  display: grid;
  grid-template-columns: 50% 35% 15%;
  grid-template-rows: auto auto;
}
:deep(.inquiryData-itemOverview-validTo--wrapper) {
  grid-column: 2;
  grid-row: 1;
}
:deep(.inquiryData-itemOverview-reqDelivDate--wrapper) {
  grid-column: 1;
  grid-row: 2;
}
:deep(.inquiryData-itemOverview-expectOralVal--wrapper) {
  grid-column: 2;
  grid-row: 2;
}
:deep(.inquiryData-itemOverview-expectOralValUnit--wrapper) {
  grid-column: 3;
  grid-row: 2;
}

:deep(.itemDetailHeader--dict-leaf-section) {
  display: grid;
  grid-template-columns: 40%;
  grid-template-rows: auto auto;
  gap: 0
}
:deep(.itemDetailSales-orderQuantityAndDeliveryDate--dict-leaf-section),
:deep(.itemDetailSales-generalSalesData--dict-leaf-section) {
  display: grid;
  grid-template-columns: 30% 30% 100px;
  grid-template-rows: auto auto;
  gap: 0
}
:deep(.itemDetailSales-orderQuantityAndDeliveryDate-orderQuantity--wrapper) {
  grid-column: 2;
  grid-row: 1;
}
:deep(.itemDetailSales-orderQuantityAndDeliveryDate-orderQuantityUnit--wrapper) {
  grid-column: 3;
  grid-row: 1;
}
:deep(.itemDetailSales-orderQuantityAndDeliveryDate-reqDelivDate--wrapper) {
  grid-column: 2;
  grid-row: 2;
}

:deep(.itemDetailSales-generalSalesData-netValue--wrapper) {
  grid-column: 2;
  grid-row: 1;
}
:deep(.itemDetailSales-generalSalesData-netValueUnit--wrapper) {
  grid-column: 3;
  grid-row: 1;
}
:deep(.itemDetailSales-generalSalesData-pricingDate--wrapper) {
  grid-column: 2;
  grid-row: 2;
}
:deep(.itemDetailSales-generalSalesData-orderProbability--wrapper) {
  grid-column: 2;
  grid-row: 3;
}


:deep(.inquiryData-itemOverview-items--extra-table-buttons) {
  display: flex;
  padding-left: 10px;
  gap: 8px;
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

/* Item导航样式 */
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

/* Save和Cancel按钮样式 */
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

</style>