<script lang="ts" setup>
import {ref} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
import FilterTabs from '@/components/FilterTabs.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'
import {createTreeFromConfig, createNodeFromConfig, cns, VarTree, VarNode, NodeStructure, isNodeStructure, VarNodeValue} from '@/utils/VarTree';
import {
  inquiryTypeSearch,
  salesOrgSearch,
  distributionChannelSearch,
  divisionSearch
} from '@/utils/searchMethods'

const API_BASE_URL = window.API_BASE_URL || ''
const appContentRef = ref(null) as any

const initialTree = createTreeFromConfig(
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

const inquiryDataTree = createTreeFromConfig(
  cns('dict','dict','inquiryData',{},false,{hideLabel:true},[
    cns('dict','dict','basicInfo',{},false,{hideLabel:true},[
      cns('string','leaf','inquiry','',false,{},[],"Inquiry:"),
      cns('string','leaf','soldToParty','',false,{},[],"Sold-To Party:"),
      cns('string','leaf','shipToParty','',false,{},[],"Ship-To Party:"),
      cns('string','leaf','customerReference','',false,{},[],"Cust. Reference:"),
      cns('number','leaf','netValue','0.0',true,{},[],"Net Value:"),
      cns('number','leaf','netValueUnit','',true,{hideLabel:true},[],"Net Value Unit:"),
      cns('date','leaf','customerReferenceDate','',false,{},[],"Cust. Ref. Date:"),
    ]),
    cns('dict','dict','itemOverview',{},false,{},[
      cns('date','leaf','validFrom','',false,{},[],"Valid From:"),
      cns('date','leaf','validTo','',false,{},[],"Valid To:"),
      cns('date','leaf','reqDelivDate','',false,{},[],"Req. Deliv Date:"),
      cns('string','leaf','expectOralVal','0.0',true,{},[],"Expect. Oral Val:"),
      cns('string','leaf','expectOralValUnit','',true,{hideLabel:true},[],"Expect. Oral Val Unit:"),
      cns('dynamiclist','list','items',null,false,{
        hideLabel:true, 
        hideList: ['orderQuantityUnit', 'netValue', 'netValueUnit', 'pricingDate', 'orderProbability','reqDelivDate'],
        childTemplate:createNodeFromConfig(cns('dict','dict','item',null,false,{},[
          cns('string','leaf','item','',false,{},[],"Item"),
          cns('string','leaf','material','',false,{},[],"Material"),
          cns('string','leaf','orderQuantity','',false,{},[],"Order Quantity"),
          cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[],"Order Quantity Unit"),
          cns('date','leaf','reqDelivDate','',false,{},[],"Req. Deliv Date"),
          cns('string','leaf','netValue','',true,{},[],"Net Value"),
          cns('string','leaf','netValueUnit','',true,{hideLabel:true},[],"Net Value Unit"),
          cns('date','leaf','pricingDate','',false,{},[],"Pricing Date"),
          cns('string','leaf','orderProbability','',false,{},[],"Order Probability"),
          cns('string','leaf','su','',false,{},[],"SU"),
          cns('string','leaf','altItm','',false,{},[],"AltItm"),
          cns('string','leaf','description','',false,{},[],"Description"),
        ])),
      },[],"Items")
    ],'Item Overview')
  ])
)

const itemDetailHeaderTree = createTreeFromConfig(
  cns('dict','dict','itemDetailHeader',{},true,{
    childNameDisplayTranslation: {
      item: 'Sales Document Item',
      material: 'Material'
    }
  },[
    cns('string','leaf','item','',false,{},[]),
    cns('string','leaf','material','',false,{},[]),
  ])
)

const itemDetailSalesTree = createTreeFromConfig(
  cns('dict','dict','itemDetailSales',{},false,{hideLabel:true},[
    cns('dict','dict','orderQuantityAndDeliveryDate',{},false,{
      childNameDisplayTranslation: {
        orderQuantity: 'Quantity',
        reqDelivDate: 'First Delivery Date'
      }
    },[
      cns('string','leaf','orderQuantity','',false,{},[]),
      cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[]),
      cns('date','leaf','reqDelivDate','',false,{},[]),
    ],'Order Quantity and Delivery Date'),
    cns('dict','dict','generalSalesData',{},false,{
      childNameDisplayTranslation: {
        netValue: 'Net: ',
        pricingDate: 'Pricing Date: ',
        orderProbability: 'Order Probability: '
      }
    },[
      cns('number','leaf','netValue','',true,{},[]),
      cns('number','leaf','netValueUnit','',true,{hideLabel:true},[]),
      cns('number','leaf','pricingDate','',false,{},[]),
      cns('number','leaf','orderProbability','1',false,{},[]),
    ])
  ])
)

const itemDetailConditionTree = itemDetailSalesTree

const initializeResult = ref(false)
async function initializeCreation() {
  const data = await fetch(`${API_BASE_URL}/api/app/inquiry/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(initialTree.getValue())
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('申请失败:', error)
    return { success: false }
  })
  console.log('返回的数据',data)
  initializeResult.value = data.success
  if(!data.success) return
  // if(!data.data.inquiryData) {
  //   initializeResult.value = false
  // }
  // const inquiryData: VarNodeValue = data.data.inquiryData
  // inquiryDataTree.setValue(inquiryData)
  if (initializeResult.value) {
    handleExecute(0,1)
  }
}
/**
 * 该功能过于复杂，我们先不做
 */
async function initializeCreationWithRefference() {
  const data = await fetch(`${API_BASE_URL}/api/app/inquiry/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(initialTree.getValue())
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('申请失败:', error)
    return { success: false }
  })
  console.log('返回的数据',data)
  initializeResult.value = data.success
  if(!data.success) return
  if(!data.data.inquiryData) {
    initializeResult.value = false
  }
  const inquiryData: VarNodeValue = data.data.inquiryData
  inquiryDataTree.setValue(inquiryData)
  if (initializeResult.value) {
    handleExecute(0,1)
  }
}

/**
 * @description 询价单价格查询，向后端发送List的内容，返回Net Value: 和 Expect. Oral Val: 包括值和单位
 */
async function priceQuery() {
  const items = inquiryDataTree.getValue().itemOverview.items
  const data = await fetch(`${API_BASE_URL}/api/app/inquiry/price-query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(items)
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('价格查询失败:', error)
    return { success: false }
  })
  console.log('返回的数据',data)
  if (data.success) {
    inquiryDataTree.findNodeByPath(['basicInfo','netValue'])?.setValue(data.data.netValue)
    inquiryDataTree.findNodeByPath(['basicInfo','netValueUnit'])?.setValue(data.data.netValueUnit)
    inquiryDataTree.findNodeByPath(['itemOverview','expectOralVal'])?.setValue(data.data.expectOralVal)
    inquiryDataTree.findNodeByPath(['itemOverview','expectOralValUnit'])?.setValue(data.data.expectOralValUnit)
    appContentRef.value.forceUpdate()
  }
}

/**
 * 物品的详细信息
 */

const selectedItems = ref<VarNode[]>([])
const currentItemIndex = ref(0)

const itemConditionTabBarStage = ref(0)
function handleItemConditionTabClick(index: number) {
  itemConditionTabBarStage.value = index
}
/**
 * @descrition 处理Items Table的按钮点击事件
 * @param selection 选中的行
 */
async function handleItemsTableClick() {
  const items = inquiryDataTree.findNodeByPath(['itemOverview','items'])!
  const selectedChildren = items.getSelectedChildren()
  
  if (selectedChildren && selectedChildren.length > 0) {
    selectedItems.value = selectedChildren
    currentItemIndex.value = 0
    
    // 更新详情页面的数据
    updateItemDetailTrees()
    
    // 切换到详情页面
    appContentRef.value.goToStage(2)
  } else {
    console.log('No items selected')
  }
}

/**
 * 更新详情页面的树结构数据
 */
function updateItemDetailTrees() {
  if (selectedItems.value.length === 0) return
  
  const currentItem = selectedItems.value[currentItemIndex.value]
  const replace = (sourceNode: VarNode | null, targetPath: string[], targetTree: VarTree) => {
    if (sourceNode) {
      targetTree.replaceNodeByPath(sourceNode, targetPath)
    }
  }
  const replaceMap = [
    { sourcePath: ['item'], targetPath: ['item'], tree: itemDetailHeaderTree },
    { sourcePath: ['material'], targetPath: ['material'], tree: itemDetailHeaderTree },
    { sourcePath: ['orderQuantity'], targetPath: ['orderQuantityAndDeliveryDate', 'orderQuantity'], tree: itemDetailSalesTree },
    { sourcePath: ['orderQuantityUnit'], targetPath: ['orderQuantityAndDeliveryDate', 'orderQuantityUnit'], tree: itemDetailSalesTree },
    { sourcePath: ['reqDelivDate'], targetPath: ['orderQuantityAndDeliveryDate', 'reqDelivDate'], tree: itemDetailSalesTree },
    { sourcePath: ['netValue'], targetPath: ['generalSalesData', 'netValue'], tree: itemDetailSalesTree },
    { sourcePath: ['netValueUnit'], targetPath: ['generalSalesData', 'netValueUnit'], tree: itemDetailSalesTree },
    { sourcePath: ['pricingDate'], targetPath: ['generalSalesData', 'pricingDate'], tree: itemDetailSalesTree },
    { sourcePath: ['orderProbability'], targetPath: ['generalSalesData', 'orderProbability'], tree: itemDetailSalesTree },
  ]
  replaceMap.forEach(item => {
    const sourceNode = currentItem.findNodeByPath(item.sourcePath)
    replace(sourceNode, item.targetPath, item.tree)
  })
}

/**
 * 切换到上一个/下一个选中的item
 */
function switchToItem(index: number) {
  if (index >= 0 && index < selectedItems.value.length) {
    currentItemIndex.value = index
    updateItemDetailTrees()
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
    priceQuery()
  }
}

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

async function handleExecute(currentStage: number, targetStage: number) {
  console.log('try: stage change:',currentStage,'->',targetStage)
  if (currentStage === 0) {
    if (!initializeResult.value) return false
    appContentRef.value.goToStage(1)
    return false
  }

  if (currentStage === 1) {
    priceQuery()
    console.log(inquiryDataTree.getValue())
    // 向后端发送stage 1的所有树，创建inquiry
    const data = await fetch(`${API_BASE_URL}/api/app/inquiry/create`, {
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
      { nextText:'/hide' }, // 使用插槽自定义第一步的按钮
      { prevText:'Cancel' },
      { prevText:'Back', nextText:'/hide'}
    ]"
    ref="appContentRef"
  >
    <template #[`stage-initialScreen`]>
      <VarBox
        :tree="initialTree"
      ></VarBox>
    </template>
    <template #[`stage-information`]>
      <VarBox
        :tree="inquiryDataTree"
        @enter-from-node="handleEnterFromNodeInquiryTree"
      >
        <template #[`inquiryData-itemOverview-items--extra-buttons`]>
          <button
            class = "execute-button item-condition-button"
            @click="handleItemsTableClick"
          >
            ...
          </button>
        </template>
      </VarBox>
    </template>
    <template #[`stage-itemCondition`]>
      <VarBox
        :tree="itemDetailHeaderTree"
      ></VarBox>
      <!-- 可选的tab Sales和Conditions -->
      <!-- tab bar -->
      <FilterTabs
        :tabs="[{label:'Sales',value:0},{label:'Conditions',value:1}]" 
        @tab-selected="handleItemConditionTabClick" class="reverse middle hide-bottom-line"
        :initialActiveTab="0"
      />
      <!-- Sales -->
      <VarBox
        v-if="itemConditionTabBarStage==0"
        :tree="itemDetailSalesTree"
      ></VarBox>
      <!-- Conditions -->
      <VarBox
        v-else
        :tree="itemDetailConditionTree"
      ></VarBox>
    </template>

    <template #[`footer-content-right`]>
      {{ appContentRef?.getCurrentStageName() }}
      <button
        v-if="appContentRef?.currentStage == 0"
        class="nav-button next-button"
        @click = "initializeCreation"
      >
        Continue
      </button>
      <!-- <button
        v-if="appContentRef?.currentStage == 0"
        class="nav-button next-button"
        @click = "initializeCreationWithRefference"
      >
        Continue with Reference
      </button> -->
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
.item-condition-button {
  width: 24px;
  height: 24px;
}

</style>