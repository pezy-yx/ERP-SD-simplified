<script lang="ts" setup>
import {ref, Ref, computed, onMounted} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'
import {createTreeFromConfig, createNodeFromConfig, cns, VarTree, VarNode, NodeStructure, isNodeStructure, VarNodeValue} from '@/utils/VarTree';
import {
  customerSearch
} from '@/utils/searchMethods'
const appContentRef = ref(null) as any

defineExpose({})

/**
 * @description 初始阶段-输入创建参数
 */
const initialInputTree = createTreeFromConfig(
  cns('dict','dict','initialScreen',{},false,{hideLabel:true},[
    cns('string','leaf','shipToParty','',false,{searchMethods:customerSearch},[],"Ship-To Party:"),
    cns('date','leaf','plannedCreationDate','',false,{},[],"Planned Creation Date:"),
    cns('selection','leaf','relevantForTM','',false,{options:['Yes','No']},[],"Relevant For TM:"),
  ])
)

/**
 * @description 销售订单列表树
 */
const salesOrdersTree = createTreeFromConfig(
  cns('dict','dict','salesOrders',{},true,{},[
    cns('dynamiclist','list','orders',null,false,{
      hideLabel:true,
      rowProvided: 1,
      childTemplate:cns('dict','dict','order',null,false,{},[
        cns('string','leaf','id','',true,{},[],"Sales Order"),
        cns('string','leaf','netValue','',true,{},[],"Net Value"),
        cns('string','leaf','currency','',true,{},[],"Currency"),
        cns('string','leaf','shippingPoint','',true,{hideSelf:true},[],"Shipping Point"),
        cns('string','leaf','shipToParty','',true,{},[],"Ship-To Party"),
        cns('date','leaf','plannedCreationDate','',true,{},[],"Planned Creation Date"),
        cns('date','leaf','plannedGIDate','',true,{},[],"Planned GI Date"),
        cns('string','leaf','grossWeight','',true,{hideSelf:true},[],"Gross Weight"),
      ]),
    },[])
  ],"Sales Orders")
)

/**
 * @description 获取销售订单列表
 */
async function loadSalesOrders() {
  const data = await fetch(`${window.getAPIBaseUrl()}/api/app/outbound-delivery/get-sales-orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(initialInputTree.getValue())
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('获取销售订单失败:', error)
    return { success: false }
  })
  console.log('返回的数据',data)

  if(data.success && data.data.orders) {
    salesOrdersTree.forceSetValue({orders: data.data.orders})
    salesOrdersTree.forceUpdate()
    return true
  }
  return false
}

/**
 * @description 处理Go按钮点击事件
 */
async function handleGoClick() {
  appContentRef.value.footerMessage = ''
  appContentRef.value.forceUpdate()
  const success = await loadSalesOrders()
}

/**
 * @description 处理Execute按钮点击事件 - 创建出库交货单
 */
async function handleExecuteClick() {
  const orders = salesOrdersTree.findNodeByPath(['orders'])
  if (!orders) return false
  const selectedOrders = [...orders.getSelectedChildren()]

  if (selectedOrders && selectedOrders.length > 0) {
    console.log('Selected orders for delivery creation:', selectedOrders.length)

    // 提取选中订单的值
    const orderValues = selectedOrders.map(order => order.getValue())

    const data = await fetch(`${window.getAPIBaseUrl()}/api/app/outbound-delivery/create-from-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({
      //   selectedOrders: orderValues
      // })
      body: JSON.stringify(((obj)=>{
        // return {selectedOrders:{id:string}[]}
        const tobj = {...obj}
        console.log(obj)
        tobj.selectedOrders = obj.selectedOrders.map(
          (item: any) => {
            return { id: item.id }
          }
        )
        return tobj
      })({
        selectedOrders: orderValues
      })),
    }).then(response => {
      console.log('正常返回', response)
      return response.json()
    }).catch(error => {
      console.error('创建出库交货单失败:', error)
      return { success: false }
    })

    console.log('返回的数据',data)

    if (data.success) {
      const idsString = (data.data.createdDeliveries as Array<string>)?.join(', ')
      appContentRef.value.footerMessage = `${data.data.message} ${idsString}`
      appContentRef.value.forceUpdate()
      // 重新加载销售订单列表以反映更新
      await loadSalesOrders()
    }
  } else {
    console.log('No orders selected')
  }
  return false
}

/**
 * @description 状态管理的before-prev钩子
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
 */
async function handleExecute(currentStage: number, targetStage: number) {
  console.log('try: stage change:',currentStage,'->',targetStage)
  if (currentStage === 0 && targetStage === 1) {
    return await handleExecuteClick()
  }
  return false
}

</script>

<template>
  <AppContent
    :stages="['createDelivery']"
    :before-next="handleExecute"
    :before-prev="handleCancel"
    :footer-config="[
      { nextText:'Create Deliveries' }
    ]"
    ref="appContentRef"
  >
    <template #[`stage-createDelivery`]>
      <!-- 输入参数部分 -->
      <VarBox
        :tree="initialInputTree"
      ></VarBox>
      <div class="stage-buttons">
        <button class="go-button" @click="handleGoClick">Go</button>
      </div>

      <!-- 销售订单表格部分 -->
      <VarBox
        :tree="salesOrdersTree"
      >
      </VarBox>
    </template>

    <template #[`footer-content-right`]>
      
    </template>

  </AppContent>
</template>

<style scoped>
.stage-buttons {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  gap: 10px;
}

.go-button {
  padding: 4px 10px;
  background-color: var(--theme-color-dark);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.go-button:hover {
  background-color: var(--theme-color-darker);
}
.go-button:active {
  background-color: var(--theme-color-light);
}

:deep(.salesOrders-orders--extra-table-buttons) {
  display: flex;
  padding-left: 10px;
  gap: 8px;
}

.table-extra-button:disabled {
  cursor: not-allowed;
}

/* 输入框布局调整 */
:deep(.initialScreen--dict-leaf-section) {
  grid-template-columns: 50% 50%;
  grid-template-rows: auto auto;
}
:deep(.initialScreen-shipToParty--wrapper) { grid-row: 1; grid-column: 1; }
:deep(.initialScreen-plannedCreationDate--wrapper) { grid-row: 1; grid-column: 2; }
:deep(.initialScreen-relevantForTM--wrapper) { grid-row: 2; grid-column: 2; }
</style>
