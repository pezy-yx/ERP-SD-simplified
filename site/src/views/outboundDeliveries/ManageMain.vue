<script lang="ts" setup>
import {ref, Ref, computed} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'
import PickMain from './PickMain.vue'
import {createTreeFromConfig, createNodeFromConfig, cns, VarTree, VarNode, NodeStructure, isNodeStructure, VarNodeValue} from '@/utils/VarTree';

const API_BASE_URL = window.API_BASE_URL || ''
const appContentRef = ref(null) as any

defineExpose({})

/**
 * @description 控制PickMain应用的显示
 */
const showPickMain = ref(false)

/**
 * @description 控制PickMain应用的显示
 */
const pickingId = ref('')

/**
 * @description 进入详情阶段-跳转到PickMain应用
 */
function goToPickMain() {
  if (!pickingId.value) {
    return
  }
  showPickMain.value = true
}

/**
 * @description 退出PickMain应用
 */
async function exitPickMain() {
  showPickMain.value = false
  await loadDeliveries()
}

const deliveriesTableLength = computed(() => {
  deliveriesTree.forceUpdateKey.value // 强制依赖
  return deliveriesTree.findNodeByPath(['deliveryList'])?.children?.length || 0
})

/**
 * @description 初始阶段-输入查询参数
 */
const initialInputTree = createTreeFromConfig(
  cns('dict','dict','initialScreen',{},false,{hideLabel:true},[
    cns('string','leaf','overallStatus','',false,{},[],"Overall Status:"),
    cns('string','leaf','createdBy','',false,{},[],"Created By:"),
  ])
)

/**
 * @description 出库交货单列表树
 */
const deliveriesTree = createTreeFromConfig(
  cns('dict','dict','deliveries',{},false,{hideLabel:true},[
    cns('dynamiclist','list','deliveryList',null,true,{
      hideLabel:true,
      rowProvided: 1,
      childTemplate:cns('dict','dict','delivery',null,false,{},[
        cns('string','leaf','outboundDelivery','',true,{},[],"Outbound Delivery"),
        cns('date','leaf','pickingDate','',true,{},[],"Picking Date"),
        cns('string','leaf','pickingStatus','',true,{},[],"Picking Status"),
        cns('string','leaf','giStatus','',true,{},[],"GI Status"),
        cns('string','leaf','pick','',false,{},[],"Pick"),
      ]),
    },[],"Deliveries")
  ])
)

/**
 * @description 获取出库交货单列表
 */
async function loadDeliveries() {
  const data = await fetch(`${API_BASE_URL}/api/app/outbound-delivery/get-deliveries-summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(initialInputTree.getValue())
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('获取出库交货单失败:', error)
    return { success: false }
  })
  console.log('返回的数据',data)
  
  if(data.success && data.data.deliveries) {
    deliveriesTree.forceSetValue({deliveryList: data.data.deliveries})
    deliveriesTree.forceUpdate()
    return true
  }
  return false
}

/**
 * @description 处理Go按钮点击事件
 */
async function handleGoClick() {
  const success = await loadDeliveries()
}

/**
 * @description 处理Pick按钮点击事件 - 跳转到PickMain应用
 * @todo 传id到应用内
 */
async function handlePickClick(_node: VarNode, path: string[], tree: VarTree) {
  console.log('path:', path)
  const l = path.length
  if (!(l>1 && path[l-1]=='pick')) {
    return
  }
  const node = tree.findNodeByPath(path.slice(0, l-1))!

  pickingId.value = node.findNodeByPath(['outboundDelivery'])?.getValue() as string

  // 显示PickMain应用
  goToPickMain()
}

/**
 * @description Post选中的GI记录
 */
async function handlePostGIs() {
  const selectedNodes = deliveriesTree.findNodeByPath(['deliveryList'])?.getSelectedChildren() || []
  const deliveryIds = selectedNodes.map(node => node.findNodeByPath(['outboundDelivery'])?.getValue() as string)

  const data = await fetch(`${API_BASE_URL}/api/app/outbound-delivery/post-gis-by-id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deliveryIds })
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('Post GIs失败:', error)
    return { success: false }
  })

  console.log('返回的数据', data)

  if (data.success && data.data && data.data.breakdowns) {
    // 使用breakdown数据结构更新树
    if (data.data.breakdowns.length > 0) {
      const selectedNodes = deliveriesTree.findNodeByPath(['deliveryList'])?.getSelectedChildren() || []
      selectedNodes.forEach((node, index) => {
        node.forceSetValue(data.data.breakdowns[index])
      })
      // 清空选择
      deliveriesTree.findNodeByPath(['deliveryList'])?.children.forEach(node => {
        node.setSelection(false)
      })

      deliveriesTree.forceUpdate()

      appContentRef.value.footerMessage = 'Post GIs成功'
    }
  } else {
    appContentRef.value.footerMessage = 'Post GIs失败: ' + (data.message || '未知错误')
  }
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
  if (currentStage === 2) {
    return true // 允许从详情页面返回
  }
  return true
}

/**
 * @description 状态管理的before-next钩子
 */
async function handleExecute(currentStage: number, targetStage: number) {
  console.log('try: stage change:',currentStage,'->',targetStage)
  return false // 阻止自动切换，使用自定义按钮控制
}

</script>

<template>
  <!-- 显示PickMain应用 -->
  <PickMain
    v-if="showPickMain"
    :pickingId = "pickingId"
  >
    <template #extra-bottom-elements>
      <button class="cancel-button" @click="exitPickMain">Back to Manage</button>
    </template>
  </PickMain>

  <!-- 显示ManageMain应用 -->
  <AppContent
    v-else
    :stages="['manageDeliveries']"
    :before-next="handleExecute"
    :before-prev="handleCancel"
    :footer-config="[
      { nextText:'/hide' },
    ]"
    ref="appContentRef"
  >
    <template #[`stage-manageDeliveries`]>
      <!-- 输入参数部分 -->
      <VarBox
        :tree="initialInputTree"
      ></VarBox>
      <div class="stage-buttons">
        <button class="go-button" @click="handleGoClick">Go</button>
      </div>

      <!-- 交货单列表部分 -->
      <div class="delivery-list-section">
        <VarBox
          :tree="deliveriesTree"
        >
          <template v-for="index in deliveriesTableLength" #[`deliveries-deliveryList-${index-1}-pick--wrapper`]="{ currentNode, allProps }">
            <button
              class="pick-button"
              @click="handlePickClick(currentNode, allProps.nodePath, allProps.varTree)"
            >
              Pick
            </button>
          </template>
        </VarBox>
      </div>
    </template>

    <template #[`footer-content-right`]>
      {{ appContentRef?.getCurrentStageName() }}
      <button
        v-if="appContentRef?.currentStage == 0"
        class = "nav-button next-button"
        @click="handlePostGIs"
      >
        Post GIs
      </button>
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

.pick-button:hover,
.go-button:hover {
  background-color: var(--theme-color-darker);
}
.pick-button:active,
.go-button:active {
  background-color: var(--theme-color-light);
}

.delivery-list-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.pick-button {
  padding: 2px 12px;
  width: 50%;
  background-color: var(--theme-color-dark);
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.save-button {
  padding: 8px 20px;
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

/* 详情页面样式 */
.delivery-detail-container {
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.detail-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.delivery-id {
  font-size: 16px;
  color: #666;
  font-weight: bold;
}
</style>
