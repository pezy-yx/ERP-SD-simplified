<script lang="ts" setup>
import {ref, Ref, computed, onMounted} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'
import FilterTabs from '@/components/FilterTabs.vue';
import {createTreeFromConfig, createNodeFromConfig, cns, VarTree, VarNode, NodeStructure, isNodeStructure, VarNodeValue} from '@/utils/VarTree';
import {
  customerSearch
} from '@/utils/searchMethods'

let API_BASE_URL = window.API_BASE_URL || ''
onMounted(() => {
  API_BASE_URL = window.API_BASE_URL || ''
})
const appContentRef = ref(null) as any

defineExpose({
  appContentRef,
})

const props = defineProps({
  pickingId: {
    type: String,
    default: '',
  }
})

/**
 * @description 开始时，自动初始化一个outbound-delivery的数据
 */
onMounted(async () => {
  if (!props.pickingId) {
    return
  }
  console.log('props.pickingId', props.pickingId)
  initialInputTree.findNodeByPath(['id'])?.setValue(props.pickingId)
  await handleGoClick()
  appContentRef?.value.forceUpdate()
})


/**
 * @description 初始阶段-输入id
 */ 
const initialInputTree = createTreeFromConfig(
  cns('dict','dict','initialScreen',{},false,{hideLabel:true},[
    cns('string','leaf','id','',false,{},[],"Delivery:"),
  ])
)

/**
 * @description 单子的头部数据
 */
const deliveryDetailTree = createTreeFromConfig(
  cns('dict','dict','deliveryDetail',{},false,{hideLabel:true},[
    cns('dict','dict','meta',{},true,{hideSelf:true},[
      cns('string','leaf','id','',false,{},[]),
      cns('boolean','leaf','posted',false,false,{},[]),
      cns('boolean','leaf','readyToPost',false,false,{},[]),
    ]),
    cns('date','leaf','actualGIDate','',true,{},[],"Actual GI Date: "), // col: 1, row: 1
    cns('date','leaf','plannedGIDate','',true,{},[],"Planned GI Date: "), // 1 2
    cns('date','leaf','actualDate','',true,{},[],"Actual Date: "), // 1 3
    cns('date','leaf','loadingDate','',true,{},[],"Loading Date: "), // 1 4
    cns('date','leaf','deliveryDate','',true,{},[],"Delivery Date: "), // 1 5
    cns('string','leaf','pickingStatus','',true,{},[],"Picking Status: "), // 1 7
    cns('string','leaf','overallStatus','',true,{},[],"Overall Status: "), // 1 8
    cns('string','leaf','giStatus','',true,{},[],"GI Status: "), // 1 9
    cns('string','leaf','shipToParty','',true,{},[],"Ship-To Party: "), // 1 10
    cns('string','leaf','address','',true,{},[],"Address: "), // 1 11
    
    cns('string','leaf','grossWeight','',true,{},[],"Gross Wgt: "), // 2 1
    cns('string','leaf','grossWeightUnit','',true,{hideLabel:true},[],"Gross Wgt Unit: "), // 3 1
    cns('string','leaf','netWeight','',true,{},[],"Net Wgt: "), // 2 2
    cns('string','leaf','netWeightUnit','',true,{hideLabel:true},[],"Net Wgt Unit: "), // 3 2
    cns('string','leaf','volume','',true,{},[],"Volume: "), // 2 3
    cns('string','leaf','volumeUnit','',true,{hideLabel:true},[],"Volume Unit: "), // 3 3
    cns('string','leaf','priority','',true,{},[],"Priority: "), // 2 4
    cns('string','leaf','shippingPoint','',true,{},[],"Shipping Point: "), // 2 5
  ])
)
/** @description 交货单详情树的可写路径 */
const deliveryDetailTreeWritablePaths = [
  ['actualGIDate'],
  ['grossWeight'], ['netWeight'], ['volume'],
  ['grossWeightUnit'], ['netWeightUnit'], ['volumeUnit'],
]


/** 
 * @description 根据GI是否完成设置树的可写性
 * @param {boolean} isGIComplete GI是否完成
 */
function setDeliveryDetailTreeWritable(isGIComplete: boolean) {
  console.log('设置可写性', isGIComplete)
  deliveryDetailTreeWritablePaths.forEach(path => {
    const node = deliveryDetailTree.findNodeByPath(path)
    if (node) {
      node.readonly = !isGIComplete
    }
  })
  deliveryDetailTree.forceUpdate()
  itemDetailTree.root!.readonly = !isGIComplete
  itemDetailTree.forceUpdate()
}

/**
 * @description 交货单物品列表树 - 最外层只读的动态列表
 */
const deliveryItemsTree = createTreeFromConfig(
  cns('dict','dict','deliveryItems',{},false,{hideLabel:true},[
    cns('dynamiclist','list','items',null,true,{
      hideLabel:true,
      rowProvided: 1,
      showWhiteList:[
        'item',
        'material',
        'deliveryQuantity',
        'deliveryQuantityUnit',
        'pickedQuantity',
        'pickedQuantityUnit',
        'pickingStatus',
        'confirmationStatus',
        'details',
      ],
      childTemplate:cns('dict','dict','item',null,false,{},[
        cns('string','leaf','item','',true,{},[],"Item"),
        cns('string','leaf','material','',true,{},[],"Material"),
        cns('string','leaf','deliveryQuantity','',false,{},[],"Delivery Quantity"),
        cns('string','leaf','deliveryQuantityUnit','',false,{},[]," "),
        cns('string','leaf','pickingQuantity','',true,{},[],"Picking Quantity"),
        cns('string','leaf','pickingQuantityUnit','',true,{},[]," "),
        cns('string','leaf','pickingStatus','',true,{},[],"Picking Status"),
        cns('string','leaf','confirmationStatus','',true,{},[],"Confirmation Status"),

        // detailsInfo
        // col left
        cns('string','leaf','salesOrder','',true,{},[],"Sales Order: "),
        // item -> Sales Order Item
        cns('string','leaf','itemType','',true,{},[],"Item Type: "),
        // empty 4th row
        cns('string','leaf','originalDelivertyQuantity','',true,{},[],"Original Delivery Quantity: "),
        // pickingQuantity, unit (above)
        // deliveryQuantiry, unit (above): writable
        cns('string','leaf','conversionRate','',true,{},[],"Conversion Rate: "),
        cns('string','leaf','baseUnitDeliveryQuantity','',true,{},[],"Base Unit Delivery Quantity: "),
        // col right
        // material (above)
        cns('string','leaf','grossWeight','',true,{},[],"Gross Weight: "),
        cns('string','leaf','netWeight','',true,{},[],"Net Weight: "),
        cns('string','leaf','volume','',true,{},[],"Volume: "),
        cns('string','leaf','plant','',true,{},[],"Plant: "),
        cns('string','leaf','storageLocation','',false,{},[],"Storage Location: "), // writable
        cns('string','leaf','storageLocationDescription','',true,{},[]," "),
        cns('string','leaf','storageBin','',true,{},[],"Storage Bin: "),
        cns('date','leaf','materialAvailability','',true,{},[],"Material Availability: "),

        cns('string','leaf','details','',false,{},[]," "),
      ]),
    },[])
  ])
)

/**
 * @description 物品详情页面的信息树
 * ```
 * createTreeFromConfig(
 *   cns('dict','dict','itemDetail',{},false,{hideLabel:true},[
 *     // col left
 *     cns('string','leaf','salesOrder','',true,{},[],"Sales Order: "),
 *     cns('string','leaf','item','',true,{},[],"Item"),
 *     cns('string','leaf','itemType','',true,{},[],"Item Type: "),
 *     // empty 4th row
 *     cns('string','leaf','originalDelivertyQuantity','',true,{},[],"Original Delivery Quantity: "),
 *     cns('string','leaf','pickingQuantity','',true,{},[],"Picking Quantity"),
 *     cns('string','leaf','pickingQuantityUnit','',true,{},[],""), // col unit1
 *     cns('string','leaf','deliveryQuantity','',false,{},[],"Delivery Quantity"),
 *     cns('string','leaf','deliveryQuantityUnit','',false,{},[],""), // col unit1
 *     cns('string','leaf','conversionRate','',true,{},[],"Conversion Rate: "),
 *     cns('string','leaf','baseUnitDeliveryQuantity','',true,{},[],"Base Unit Delivery Quantity: "),
 *     // col right
 *     cns('string','leaf','material','',true,{},[],"Material"),
 *     cns('string','leaf','grossWeight','',true,{},[],"Gross Weight: "),
 *     cns('string','leaf','netWeight','',true,{},[],"Net Weight: "),
 *     cns('string','leaf','volume','',true,{},[],"Volume: "),
 *     cns('string','leaf','plant','',true,{},[],"Plant: "),
 *     cns('string','leaf','storageLocation','',false,{},[],"Storage Location: "),
 *     cns('string','leaf','storageLocationDescription','',true,{},[],""),
 *     cns('string','leaf','storageBin','',true,{},[],"Storage Bin: "),
 *     cns('date','leaf','materialAvailability','',true,{},[],"Material Availability: "),
 *   ])
 * )
 * ```
 */
const itemDetailTree = createTreeFromConfig(
  cns('dict','dict','displayController',null,true,{
    hideLabel:true,
  },[
    (()=>{
      const ns =  deliveryItemsTree.findNodeByPath(['items'])!.config.childTemplate!
      ns.config!.hideLabel = true
      ns.config!.showWhiteList = [
        'salesOrder',
        'item',
        'itemType',
        'originalDelivertyQuantity',
        'pickingQuantity',
        'pickingQuantityUnit',
        'deliveryQuantity',
        'deliveryQuantityUnit',
        'conversionRate',
        'baseUnitDeliveryQuantity',
        'material',
        'grossWeight',
        'netWeight',
        'volume',
        'plant',
        'storageLocation',
        'storageLocationDescription',
        'storageBin',
        'materialAvailability',
      ]
      return ns
    })()
  ]),
)

/**
 * @description 获取全部数据 - 包含deliveryDetail和deliveryItems
 */
function getAllData() {
  return {
    deliveryDetail: deliveryDetailTree.getValue(),
    items: deliveryItemsTree.findNodeByPath(['items'])?.getValue() || []
  }
}

/** 
 * @description 设置物品详情页显示的节点 - 拷贝传递
 * @param {VarNode} [node] 要显示的节点
 */
function setItemDetailNode(node: VarNode) {
  itemDetailTree.replaceNodeByPath(node.clone(), ['item'])
}

/**
 * 物品的详细信息
 */
const selectedItems = ref<VarNode[]>([])
const currentItemIndex = ref(0)

/**
 * @description 处理Items Table的详情按钮点击事件
 * @param node 当前节点
 * @param path 节点路径
 * @param tree 树对象
 */
async function handleItemDetailsClick(node: VarNode, path: string[], tree: VarTree) {
  console.log('path:', path)
  const l = path.length
  if (!(l>1 && path[l-1]=='details')) {
    return
  }
  const itemNode = tree.findNodeByPath(path.slice(0, l-1))!

  // 验证当前节点数据
  const isValid = await itemsTabQuery([itemNode])
  if (!isValid) {
    console.log('数据验证失败，无法进入详情页面')
    return
  }

  // 验证通过，设置选中的物品并进入详情页面
  selectedItems.value = [itemNode]
  currentItemIndex.value = 0

  setItemDetailNode(itemNode)

  // 切换到详情页面
  appContentRef.value.goToStage(1)
}

/**
 * @description 验证+补全物品数据
 */
async function itemsTabQuery(itemNodes: VarNode[]) {
  // 提取每个VarNode的值
  const itemValues = itemNodes.map(node => node.getValue())

  const data = await fetch(`${API_BASE_URL}/api/app/outbound-delivery/items-tab-query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemValues)
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('批量查询失败:', error)
    return { success: false }
  })

  console.log('返回的数据', data)

  if (data.success) {
    // 更新每个item的详细信息，使用forceSetValue确保完整更新
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

    itemDetailTree.forceUpdate()
    deliveryItemsTree.forceUpdate()
    return data.data.result.allDataLegal === 1
  }

  return false
}

/**
 * 验证当前itemDetail数据并同步到原始item
 * @description 把正在编辑节点中的数据发送给后端验证，验证成功后更新原始item的数据
 * @param force 默认为true，控制validation通过之后是否重新检验
 */
async function updateCurrentItemDetailData(force: boolean = false) {
  // 如果未更改过(config.data.validation is true) 直接返回
  const node = itemDetailTree.findNodeByPath(['item'])!
  let isValidate = true
  if (!force &&node.config.data?.validation) {
    console.log('数据未更改，无需验证', node)
  } else {
    isValidate = await itemsTabQuery([node])
  }

  if (isValidate) {
    console.log('数据验证成功')
    // 同步数据
    const currentNode = selectedItems.value[currentItemIndex.value]
    currentNode.forceSetValue(node.getValue())
  } else {
    console.log('数据验证失败')
  }
  return isValidate
}

/**
 * @description 处理Go按钮 - 向后端获取单子的具体信息
 */
async function handleGoClick() {
  const deliveryId = initialInputTree.findNodeByPath(['id'])?.getValue()
  if (!deliveryId) {
    appContentRef.value.footerMessage = '请输入Delivery ID'
    return
  }
  appContentRef.value.footerMessage = ''

  const data = await fetch(`${API_BASE_URL}/api/app/outbound-delivery/get-detail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deliveryId })
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('获取交货单详情失败:', error)
    return { success: false }
  })

  console.log('返回的数据', data)

  if (data.success && data.data) {
    // 填充deliveryDetailTree
    if (data.data.detail) {
      deliveryDetailTree.forceSetValue(data.data.detail)
    }

    // 填充deliveryItemsTree
    if (data.data.items) {
      deliveryItemsTree.forceSetValue(data.data.items)
    }

    // 根据状态设置可写性
    const isPosted = deliveryDetailTree.findNodeByPath(['meta','posted'])?.getValue()
    setDeliveryDetailTreeWritable(!isPosted)

    appContentRef.value.forceUpdate()
  
    giSummaryKey.value++
  } else {
    appContentRef.value.footerMessage = '获取交货单详情失败: ' + (data.message || '未知错误')
  }
}

/**
 * @description 处理Post GIs按钮 - 提交GI数据
 */
async function handlePostGIs() {
  // 获取所有数据
  const allData = getAllData()

  // 形成单元素列表作为post GIs的输入
  const postData = [allData]

  const data = await fetch(`${API_BASE_URL}/api/app/outbound-delivery/post-gis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData)
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('Post GIs失败:', error)
    return { success: false }
  })

  console.log('Post GIs返回的数据', data)

  if (data.success && data.data && data.data.breakdowns) {
    // 使用breakdown数据结构更新树
    if (data.data.breakdowns.length > 0) {
      const breakdown = data.data.breakdowns[0]

      // 更新deliveryDetailTree
      if (breakdown.detail) {
        deliveryDetailTree.forceSetValue(breakdown.detail)
      }

      // 更新deliveryItemsTree
      if (breakdown.items) {
        deliveryItemsTree.forceSetValue({ items: breakdown.items })
      }

      deliveryDetailTree.forceUpdate()
      deliveryItemsTree.forceUpdate()

      appContentRef.value.footerMessage = 'Post GIs成功'
    }
  } else {
    appContentRef.value.footerMessage = 'Post GIs失败: ' + (data.message || '未知错误')
  }
}

/**
 * @description 处理详情页面的enter事件
 */
async function handleEnterFromNodeItemDetail(_node: VarNode, _value: string, _data: any) {
  // 标记数据已更改，需要验证
  const node = itemDetailTree.findNodeByPath(['item'])!
  if (node.config.data?.validation) {
    return
  }
  await itemsTabQuery([node])
}

/**
 * @description 处理详情页面的input事件
 */
async function handleInputFromNodeItemDetail(_node: VarNode, _value: string, _data: any) {
  // 标记数据已更改，需要验证
  const node = itemDetailTree.findNodeByPath(['item'])!
  if (node.config.data) {
    node.config.data.validation = false
  } else {
    node.config.data = {
      validation: false
    }
  }
}

/**
 * @description 保存详情页面数据
 */
async function saveItemDetail() {
  const isValid = await updateCurrentItemDetailData()
  if (isValid) {
    // 返回列表页面
    appContentRef.value.goToStage(0)
  }
}

/**
 * @description 取消详情页面编辑
 */
function cancelItemDetail() {
  appContentRef.value.goToStage(0)
}

const selectedTab = ref(0)
/**
 * @description 切换显示
 */
function selectTab(index: number) {
  selectedTab.value = index
}

/**
 * @description GI tab的信息
 */
const giSummaryContent = computed(() => {
  giSummaryKey.value; // 强制依赖 giSummaryKey

  const posted = deliveryDetailTree.findNodeByPath(['meta','posted'])?.getValue() as boolean || false
  const readyToPost = deliveryDetailTree.findNodeByPath(['meta','readyToPost'])?.getValue() as boolean || false
  const status = posted ? 'Posted' : readyToPost ? 'Ready to Post' : 'Not Ready to Post'
  const plannedGIDate = deliveryDetailTree.findNodeByPath(['plannedGIDate'])?.getValue() as string ?? ''
  const grossWeight = `${deliveryDetailTree.findNodeByPath(['grossWeight'])?.getValue() as string ?? ''}${deliveryDetailTree.findNodeByPath(['grossWeightUnit'])?.getValue() as string ?? ''}`
  const netWeight = `${deliveryDetailTree.findNodeByPath(['netWeight'])?.getValue() as string ?? ''}${deliveryDetailTree.findNodeByPath(['netWeightUnit'])?.getValue() as string ?? ''}`
  const volume = `${deliveryDetailTree.findNodeByPath(['volume'])?.getValue() as string ?? ''}${deliveryDetailTree.findNodeByPath(['volumeUnit'])?.getValue() as string ?? ''}`
  const priority = deliveryDetailTree.findNodeByPath(['priority'])?.getValue() as string ?? ''
  const shipToParty = deliveryDetailTree.findNodeByPath(['shipToParty'])?.getValue() as string ?? ''
  const address = deliveryDetailTree.findNodeByPath(['address'])?.getValue() as string ?? ''
  const result = {
    status,
    plannedGIDate,
    grossWeight,
    netWeight,
    volume,
    priority,
    shipToParty,
    address
  }
  console.log('giSummaryContent 重新计算:', result)
  return result
})
const giSummaryKey = ref(0)

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
  return false // 阻止自动切换，使用自定义按钮控制
}

</script>

<template>
  <AppContent
    :stages="['picking', 'itemDetail']"
    :before-next="handleExecute"
    :before-prev="handleCancel"
    :footer-config="[
      { nextText:'/hide' },
      { prevText:'/hide', nextText:'/hide' }
    ]"
    ref="appContentRef"
  >
    <template #[`stage-picking`]>
      <!-- 输入参数部分 -->
      <VarBox
        :tree="initialInputTree"
      ></VarBox>
      <div class="stage-buttons">
        <button class="go-button" @click="handleGoClick">Go</button>
      </div>

      <!-- HeaderTree -->
      <VarBox
        :tree="deliveryDetailTree"
      >
      </VarBox>
      <FilterTabs
        :tabs="[{label:'Picking',value:0},{label:'GI',value:1}]"
        :initial-active-tab="1"
        @tab-selected="selectTab"
        class="reverse hide-bottom-line"
      />
      <VarBox
        :tree="deliveryItemsTree"
        v-if="selectedTab == 0"
      >
        <template v-for="index in deliveryItemsTree.findNodeByPath(['items'])?.children?.length || 0" #[`deliveryItems-items-${index-1}-details--wrapper`]="{ currentNode, allProps }">
          <button
            class="details-button"
            @click="handleItemDetailsClick(currentNode, allProps.nodePath, allProps.varTree)"
          >
            >
          </button>
        </template>
      </VarBox>
      <div 
        v-else
        :key="giSummaryKey"
        class = "gi-summary-table-container"
      >
        <table class="gi-summary-table">
          <tbody>
            <tr>
              <td><span class="gi-summary-key">Status:</span> <span class="gi-summary-value">{{ giSummaryContent.status }}</span></td>
              <td><span class="gi-summary-key">Planned GI Date:</span> <span class="gi-summary-value">{{ giSummaryContent.plannedGIDate }}</span></td>
              <td><span class="gi-summary-key">Ship-To Party:</span> <span class="gi-summary-value">{{ giSummaryContent.shipToParty }}</span></td>
            </tr>
            <tr>
              <td></td>
              <td><span class="gi-summary-key">Gross Weight:</span> <span class="gi-summary-value">{{ giSummaryContent.grossWeight }}</span></td>
              <td><span class="gi-summary-key">Address:</span> <span class="gi-summary-value">{{ giSummaryContent.address }}</span></td>
            </tr>
            <tr>
              <td></td> 
              <td><span class="gi-summary-key">Net Weight:</span> <span class="gi-summary-value">{{ giSummaryContent.netWeight }}</span></td>
            </tr>
            <tr>
              <td></td> 
              <td><span class="gi-summary-key">Volume:</span> <span class="gi-summary-value">{{ giSummaryContent.volume }}</span></td>
            </tr>
            <tr>
              <td></td> 
              <td><span class="gi-summary-key">Priority:</span> <span class="gi-summary-value">{{ giSummaryContent.priority }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template #[`stage-itemDetail`]>
      <div class="item-detail-container">
        <!-- 标题栏 -->
        <div class="detail-header">
          <h2>Item Detail</h2>
          <div class="item-info">Item: {{ (selectedItems[currentItemIndex]?.getValue() as any)?.item || '' }}</div>
        </div>

        <VarBox
          :tree="itemDetailTree"
          @enter-from-node="handleEnterFromNodeItemDetail"
          @input-from-node="handleInputFromNodeItemDetail"
        ></VarBox>
      </div>
    </template>

    <template #[`footer-content-right`]>
      {{ appContentRef?.getCurrentStageName() }}

      <!-- 操作按钮 -->
       
      <button
        class="next-button"
        @click="handlePostGIs"
        v-if="appContentRef?.currentStage == 0"
      >
        Post
      </button>
      <slot :name="`extra-bottom-elements`"></slot>
      <div class="detail-buttons" v-if="appContentRef?.currentStage == 1">
        <button class="cancel-button" @click="cancelItemDetail">Cancel</button>
        <button class="save-button" @click="saveItemDetail">Save</button>
      </div>
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

/* Tree Grid */
:deep(.deliveryDetail--dict-leaf-section) {
  display: grid;
  grid-template-columns: 18% 25% 14% 25% 5% 13%;
  column-gap: 0;
  grid-template-rows: auto auto auto auto auto 50px auto auto auto auto;
  --deliveryDetail-left-col-index: 2;
  --deliveryDetail-right-col-index: 4;
  --deliveryDetail-unit-col-index: 5;
}

:deep(.deliveryDetail-actualGIDate--wrapper) { grid-row: 1; }
:deep(.deliveryDetail-plannedGIDate--wrapper) { grid-row: 2; }
:deep(.deliveryDetail-actualDate--wrapper) { grid-row: 3; }
:deep(.deliveryDetail-loadingDate--wrapper) { grid-row: 4; }
:deep(.deliveryDetail-deliveryDate--wrapper) { grid-row: 5; }
:deep(.deliveryDetail-pickingStatus--wrapper) { grid-row: 7; }
:deep(.deliveryDetail-overallStatus--wrapper) { grid-row: 8; }
:deep(.deliveryDetail-giStatus--wrapper) { grid-row: 9; }
:deep(.deliveryDetail-shipToParty--wrapper) { grid-row: 10; }
:deep(.deliveryDetail-address--wrapper) { grid-row: 11; }
:deep(.deliveryDetail-actualGIDate--wrapper),:deep(.deliveryDetail-plannedGIDate--wrapper),:deep(.deliveryDetail-actualDate--wrapper),:deep(.deliveryDetail-loadingDate--wrapper),:deep(.deliveryDetail-deliveryDate--wrapper),:deep(.deliveryDetail-pickingStatus--wrapper),:deep(.deliveryDetail-overallStatus--wrapper),:deep(.deliveryDetail-giStatus--wrapper),:deep(.deliveryDetail-shipToParty--wrapper),:deep(.deliveryDetail-address--wrapper) { grid-column: var(--deliveryDetail-left-col-index); }

:deep(.deliveryDetail-grossWeight--wrapper) { grid-row: 1; }
:deep(.deliveryDetail-netWeight--wrapper) { grid-row: 2; }
:deep(.deliveryDetail-volume--wrapper) { grid-row: 3; }
:deep(.deliveryDetail-priority--wrapper) { grid-row: 4; }
:deep(.deliveryDetail-shippingPoint--wrapper) { grid-row: 5; }
:deep(.deliveryDetail-grossWeight--wrapper),:deep(.deliveryDetail-netWeight--wrapper),:deep(.deliveryDetail-volume--wrapper),:deep(.deliveryDetail-priority--wrapper),:deep(.deliveryDetail-shippingPoint--wrapper) { grid-column: var(--deliveryDetail-right-col-index); }

:deep(.deliveryDetail-grossWeightUnit--wrapper) { grid-row: 1; }
:deep(.deliveryDetail-netWeightUnit--wrapper) { grid-row: 2; }
:deep(.deliveryDetail-volumeUnit--wrapper) { grid-row: 3; }
:deep(.deliveryDetail-grossWeightUnit--wrapper),:deep(.deliveryDetail-netWeightUnit--wrapper),:deep(.deliveryDetail-volumeUnit--wrapper) { grid-column: var(--deliveryDetail-unit-col-index); }

/* 详情按钮样式 */
.details-button {
  padding: 2px 8px;
  background-color: var(--theme-color-dark);
  color: var(--theme-color-page);
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.details-button:hover {
  background-color: var(--theme-color-darker);
}

/* 物品详情页面样式 */
.item-detail-container {
  padding: 20px;
}

:deep(.displayController-item--dict-leaf-section) {
  display: grid;
  grid-template-columns: 18% 25% 5% 9% 25% 18%;
  column-gap: 0;
  grid-template-rows: auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto;
  --itemDetail-left-col-index: 2;
  --itemDetail-right-col-index: 5;
  --itemDetail-unit-col-index: 3;
}

/* col left - 左列字段 */
:deep(.displayController-item-salesOrder--wrapper) { grid-row: 1; grid-column: var(--itemDetail-left-col-index); }
:deep(.displayController-item-item--wrapper) { grid-row: 2; grid-column: var(--itemDetail-left-col-index); }
:deep(.displayController-item-itemType--wrapper) { grid-row: 3; grid-column: var(--itemDetail-left-col-index); }
/* empty 4th row */
:deep(.displayController-item-originalDelivertyQuantity--wrapper) { grid-row: 5; grid-column: var(--itemDetail-left-col-index); }
:deep(.displayController-item-pickingQuantity--wrapper) { grid-row: 6; grid-column: var(--itemDetail-left-col-index); }
:deep(.displayController-item-deliveryQuantity--wrapper) { grid-row: 7; grid-column: var(--itemDetail-left-col-index); }
:deep(.displayController-item-conversionRate--wrapper) { grid-row: 8; grid-column: var(--itemDetail-left-col-index); }
:deep(.displayController-item-baseUnitDeliveryQuantity--wrapper) { grid-row: 9; grid-column: var(--itemDetail-left-col-index); }

/* col unit1 - 单位列 */
:deep(.displayController-item-pickingQuantityUnit--wrapper) { grid-row: 6; grid-column: var(--itemDetail-unit-col-index); }
:deep(.displayController-item-deliveryQuantityUnit--wrapper) { grid-row: 7; grid-column: var(--itemDetail-unit-col-index); }

/* col right - 右列字段 */
:deep(.displayController-item-material--wrapper) { grid-row: 1; grid-column: var(--itemDetail-right-col-index); }
:deep(.displayController-item-grossWeight--wrapper) { grid-row: 2; grid-column: var(--itemDetail-right-col-index); }
:deep(.displayController-item-netWeight--wrapper) { grid-row: 3; grid-column: var(--itemDetail-right-col-index); }
:deep(.displayController-item-volume--wrapper) { grid-row: 4; grid-column: var(--itemDetail-right-col-index); }
:deep(.displayController-item-plant--wrapper) { grid-row: 5; grid-column: var(--itemDetail-right-col-index); }
:deep(.displayController-item-storageLocation--wrapper) { grid-row: 6; grid-column: var(--itemDetail-right-col-index); }
:deep(.displayController-item-storageBin--wrapper) { grid-row: 8; grid-column: var(--itemDetail-right-col-index); }
:deep(.displayController-item-materialAvailability--wrapper) { grid-row: 9; grid-column: var(--itemDetail-right-col-index); }

:deep(.displayController-item-storageLocationDescription--wrapper) { grid-row: 7; grid-column: var(--itemDetail-right-col-index); }

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--theme-color-dark);
}

.detail-header h2 {
  margin: 0;
  color: var(--theme-color-dark);
}

.item-info {
  font-weight: bold;
  color: var(--theme-color-dark);
}

.detail-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button, .save-button {
  padding: 0px 0px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.save-button {
  background-color: var(--theme-color-dark);
  color: white;
}

.save-button:hover {
  background-color: var(--theme-color-darker);
}

.gi-summary-table-container {
  display: flex;
  justify-content: center;
}

.gi-summary-table {
  width: 80%;
  border-collapse: collapse;
  table-layout: fixed;
}

.gi-summary-table td {
  padding: 10px;
  vertical-align: top;
  text-align: left;
}

.gi-summary-table .gi-summary-key {
  font-weight: 600;
  white-space: nowrap;
  padding-right: 5px;
}

</style>