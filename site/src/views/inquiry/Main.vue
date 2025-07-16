<script lang="ts" setup>
import {ref, Ref, computed} from 'vue'
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
} from '@/utils/searchMethods'

const API_BASE_URL = window.API_BASE_URL || ''
const appContentRef = ref(null) as any

type State = 'create' | 'change' | 'display'
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
      cns('string','leaf','soldToParty','',false,{},[],"Sold-To Party:"),
      cns('string','leaf','shipToParty','',false,{},[],"Ship-To Party:"),
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
      cns('dynamiclist','list','items',null,false,{
        hideLabel:true, 
        hideList: ['netValue', 'netValueUnit', 'pricingDate', 'orderProbability','reqDelivDate','taxValue','taxValueUnit','pricingElements'],
        childTemplate:cns('dict','dict','item',null,false,{},[
          cns('string','leaf','item','',true,{},[],"Item"),
          cns('string','leaf','material','',false,{},[],"Material"),
          cns('string','leaf','orderQuantity','',false,{},[],"Order Quantity"),
          cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[],"SU"),
          cns('string','leaf','description','',false,{},[],"Description"),
          cns('date','leaf','reqDelivDate','',false,{},[],"Req. Deliv Date"),
          cns('string','leaf','netValue','',true,{},[],"Net: "),
          cns('string','leaf','netValueUnit','',true,{hideLabel:true},[],"Net Value Unit"),
          cns('string','leaf','taxValue','',true,{},[],"Tax: "),
          cns('string','leaf','taxValueUnit','',true,{hideLabel:true},[],"Tax Value Unit"),
          cns('date','leaf','pricingDate','',false,{},[],"Pricing Date"),
          cns('string','leaf','orderProbability','',false,{},[],"Order Probability"),
          cns('dynamiclist','list','pricingElements',null,true,{
            rowProvided:0,
            childTemplate:cns('dict','dict','condition',null,false,{},[
              cns('string','leaf','cnty','',false,{},[],"Cnty"),
              cns('string','leaf','name','',false,{},[],"Name"),
              cns('string','leaf','amount','',false,{},[],"Amount"),
              cns('string','leaf','city','',false,{},[],"City"),
              cns('string','leaf','per','',false,{},[],"per"),
              cns('string','leaf','uom','',false,{},[],"UoM"),
              cns('string','leaf','conditionValue','',false,{},[],"Condition Value"),
              cns('string','leaf','curr','',false,{},[],"Curr."),
              cns('string','leaf','status','',false,{},[],"Status"),
              cns('string','leaf','numC','',false,{},[],"NumC"),
              cns('string','leaf','atoMtsComponent','',false,{},[],"ATO/MTS Component"),
              cns('string','leaf','oun','',false,{},[],"OUn"),
              cns('string','leaf','cconDe','',false,{},[],"CConDe"),
              cns('string','leaf','un','',false,{},[],"Un"),
              cns('string','leaf','conditionValue2','',false,{},[],"Condition Value"),
              cns('string','leaf','cdCur','',false,{},[],"CdCur"),
              cns('boolean','leaf','stat',false,false,{},[],"Stat"),
            ]),
          },[],"Pricing Elements"),
        ]),
      },[],"Items")
    ],'Item Overview')
  ])
)

/**
 * @description 询价单物品详细信息-头部
 */
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

/**
 * @description 询价单物品详细信息-Sales
 */
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
        pricingDate: 'Pricing Date: ',
        orderProbability: 'Order Probability: '
      }
    },[
      cns('string','leaf','netValue','',true,{},[]),
      cns('string','leaf','netValueUnit','',true,{hideLabel:true},[]),
      cns('string','leaf','pricingDate','',false,{},[]),
      cns('string','leaf','orderProbability','1',false,{},[]),
    ])
  ])
)

/**
 * @description 询价单物品详细信息-Conditions
 */
const itemDetailConditionTree = createTreeFromConfig(
  cns('dict','dict','itemDetailConditions',{},false,{
    childNameDisplayTranslation: {
      orderQuantity: 'Quantity',
    }
  },[
    cns('string','leaf','orderQuantity','',false,{},[]),
    cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[]),
    cns('string','leaf','netValue','',true,{},[]),
    cns('string','leaf','netValueUnit','',true,{hideLabel:true},[]),
    cns('string','leaf','taxValue','',true,{},[]),
    cns('string','leaf','taxValueUnit','',true,{hideLabel:true},[]),
    cns('dynamiclist','list','pricingElements',null,true,{
      // never mind because it had to be replaced with some item in inquiryData.itemOverview.items[x]
    },[],"Pricing Elements")
  ])
)

/**
 * @description 询价单物品的可写树，即stage1 stage2，用于显示状态和编辑状态的切换
 * @description 特别说明，不包括inquiryDetailHeader
 * @returns {VarTree[]} 
 */
const writableTrees = [inquiryDataTree, itemDetailSalesTree, itemDetailConditionTree]

const initializeResult = ref(false)
/**
 * @description 创建-初始化
 */
async function initializeByCreation() {
  const data = await fetch(`${API_BASE_URL}/api/app/inquiry/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(initialCreationTree.getValue())
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
  const data = await fetch(`${API_BASE_URL}/api/app/inquiry/get`, {
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
  return true
}

/**
 * @description 封装itemsTabQuery-查询所有
 */
async function itemsTabQueryAll() {
  const items = inquiryDataTree.findNodeByPath(['itemOverview','items'])?.children || []
  return await itemsTabQuery(items)
}
/**
 * @description 询价单批量查询，向后端发送VarNode[]，返回Net Value: 和 Expect. Oral Val: 包括值和单位，还有每个item的详细信息
 * @description 该方法会更新入参VarNode[]中的数据
 * @param {Array<VarNode>} itemNodes 
 * 同时根据返回的badRecordIndices设置每个VarNode的config.data.validation
 */
async function itemsTabQuery(itemNodes: VarNode[]) {
  // 提取每个VarNode的值
  const itemValues = itemNodes.map(node => node.getValue())

  const data = await fetch(`${API_BASE_URL}/api/app/inquiry/items-tab-query`, {
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
    // 更新总体数据
    inquiryDataTree.findNodeByPath(['basicInfo','netValue'])?.setValue(data.data.generalData?.netValue)
    inquiryDataTree.findNodeByPath(['basicInfo','netValueUnit'])?.setValue(data.data.generalData?.netValueUnit)
    inquiryDataTree.findNodeByPath(['itemOverview','expectOralVal'])?.setValue(data.data.generalData?.expectOralVal)
    inquiryDataTree.findNodeByPath(['itemOverview','expectOralValUnit'])?.setValue(data.data.generalData?.expectOralValUnit)

    // 更新每个item的详细信息，使用forceSetValue确保完整更新
    if (data.data.breakdowns && Array.isArray(data.data.breakdowns)) {
      data.data.breakdowns.forEach((breakdown: any, index: number) => {
        if (index < itemNodes.length) {
          // 调试：打印breakdown数据结构
          console.log('Breakdown data for item', index, ':', breakdown)
          if (breakdown.pricingElements) {
            console.log('PricingElements structure:', breakdown.pricingElements)
          }
          // 使用forceSetValue确保包括pricingElements在内的所有字段都被正确更新
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

    writableTrees.map(tree => tree.forceUpdate())
    itemDetailHeaderTree.forceUpdate()
    return data.data.result.allDataLegal === 1
  }

  return false
}

/**
 * 物品的详细信息
 */
const selectedItems = ref<VarNode[]>([])
const currentItemIndex = ref(0)
const editingNode = {
  node: createNodeFromConfig(inquiryDataTree.findNodeByPath(['itemOverview','items'])!.config.childTemplate!)
}

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
  const selectedChildren = [...items.getSelectedChildren()]

  if (selectedChildren && selectedChildren.length > 0) {
    // 先检查所有选中的item是否有validation状态
    const itemsWithoutValidation = selectedChildren.filter(item =>
      item.config.data?.validation === undefined
    )

    // 如果有未验证的item，先进行验证
    if (itemsWithoutValidation.length > 0) {
      console.log('发现未验证的item，进行验证...')
      const result = await itemsTabQuery(itemsWithoutValidation as VarNode[])
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

    // 所有验证都通过，继续执行
    selectedItems.value = selectedChildren
    currentItemIndex.value = 0

    // 更新详情页面的数据
    updateItemDetailTrees()

    // 切换到详情页面
    appContentRef.value.goToStage(2)

    // 成功进入详情页面后，清空items表格的选中状态
    items.children.forEach(child => {
      child.setSelection(false)
    })
  } else {
    console.log('No items selected')
  }
}

/**
 * 更新详情页面的树结构数据
 * @description 把editingNode.node设为正在编辑节点的一个拷贝，将itemCondition中的输入框指向这个拷贝中的节点
 */
function updateItemDetailTrees() {
  if (selectedItems.value.length === 0) return

  const currentItem = selectedItems.value[currentItemIndex.value]
  editingNode.node = currentItem.clone()
  const node = editingNode.node

  // 使用值拷贝而不是引用设置
  const setValueFromItem = (sourcePath: string[], targetPath: string[], targetTree: VarTree) => {
    const sourceNode = node.findNodeByPath(sourcePath)
    if (sourceNode) {
      const targetNode = targetTree.findNodeByPath(targetPath)
      if (targetNode) {
        // replaceNodeByPath
        targetTree.replaceNodeByPath(sourceNode, targetPath)
        // targetNode.forceSetValue(sourceNode.getValue())
      }
    }
  }

  // Header数据
  setValueFromItem(['item'], ['item'], itemDetailHeaderTree)
  setValueFromItem(['material'], ['material'], itemDetailHeaderTree)

  // Sales数据
  setValueFromItem(['orderQuantity'], ['orderQuantityAndDeliveryDate', 'orderQuantity'], itemDetailSalesTree)
  setValueFromItem(['orderQuantityUnit'], ['orderQuantityAndDeliveryDate', 'orderQuantityUnit'], itemDetailSalesTree)
  setValueFromItem(['reqDelivDate'], ['orderQuantityAndDeliveryDate', 'reqDelivDate'], itemDetailSalesTree)
  setValueFromItem(['netValue'], ['generalSalesData', 'netValue'], itemDetailSalesTree)
  setValueFromItem(['netValueUnit'], ['generalSalesData', 'netValueUnit'], itemDetailSalesTree)
  setValueFromItem(['pricingDate'], ['generalSalesData', 'pricingDate'], itemDetailSalesTree)
  setValueFromItem(['orderProbability'], ['generalSalesData', 'orderProbability'], itemDetailSalesTree)

  // Condition数据 - 也使用值拷贝
  setValueFromItem(['orderQuantity'], ['orderQuantity'], itemDetailConditionTree)
  setValueFromItem(['orderQuantityUnit'], ['orderQuantityUnit'], itemDetailConditionTree)
  setValueFromItem(['netValue'], ['netValue'], itemDetailConditionTree)
  setValueFromItem(['netValueUnit'], ['netValueUnit'], itemDetailConditionTree)
  setValueFromItem(['taxValue'], ['taxValue'], itemDetailConditionTree)
  setValueFromItem(['taxValueUnit'], ['taxValueUnit'], itemDetailConditionTree)
  setValueFromItem(['pricingElements'], ['pricingElements'], itemDetailConditionTree)

  // 强制更新界面显示
  if (appContentRef.value) {
    appContentRef.value.forceUpdate()
  }
}

/**
 * @description Pricing Element Rules
 * @description Deletion: 删除后传入后端，进行验证并返回规范化的数据/破坏的值则把validation设为false
 */
async function handlePricingElementsDeletion() {
  const pricingElementsNode = itemDetailConditionTree.findNodeByPath(['pricingElements'])!
  const deletionNodes = pricingElementsNode.getSelectedChildren()
  pricingElementsNode.children = pricingElementsNode.children.filter(child => !deletionNodes.includes(child))
  await validateCurrentItemConditionData()
  itemDetailConditionTree.forceUpdate()
}

/**
 * @description 尝试添加一个新行 
 */
async function handlePricingElementsAdditionButtonClick() {
  const pricingElementsNode = itemDetailConditionTree.findNodeByPath(['pricingElements'])!
  const newItem = createNodeFromConfig(pricingElementsNode.config.childTemplate!)
  newItem.readonly = false
  pricingElementsNode.addChild(newItem)
  itemDetailConditionTree.forceUpdate()
}
/**
 * @description 调用handlePricingElementsDeletion删除选中的记录并验证
 */
async function handlePricingElementsRemoveButtonClick() {
  await handlePricingElementsDeletion()
}

/**
 * @description Pricing Element Rules
 * @description Addition: 直接传入后端进行验证并返回规范化的数据/破坏的值则把validation设为false
 * @description 无需编写，直接跟着handleEnterFromNodeItemCondition走验证逻辑即可
 */

/**
 * 验证当前itemCondition数据并同步到原始item
 * @description 把editingNode.node中的数据发送给后端验证，验证成功后更新原始item的数据
 * @description 统一使用了itemstabquery
 */
async function validateCurrentItemConditionData() {
  // 如果未更改过(config.data.validation is true) 直接返回
  if (editingNode.node.config.data?.validation) {
    console.log('数据未更改，无需验证', editingNode.node)
    return true
  }
  const nodeList = [editingNode.node]
  const isValidate = await itemsTabQuery(nodeList)
  if (isValidate) {
    console.log('数据验证成功')
    // 同步数据
    const currentNode = selectedItems.value[currentItemIndex.value]
    currentNode.forceSetValue(editingNode.node.getValue())
  } else {
    console.log('数据验证失败')
  }
  return isValidate
}

/**
 * 处理用户输入事件，立即将维护的节点标记为未验证
 */
function handleInputFromNodeItemCondition(_node: VarNode, value: string, data: any) {
  if (!editingNode.node.config.data) {
    editingNode.node.config.data = {}
  }
  editingNode.node.config.data.validation = false
}

/**
 * 切换到上一个/下一个选中的item
 * @description 安全的方法，会先验证当前数据
 */
async function switchToItem(index: number) {
  const isValid = await validateCurrentItemConditionData()
  if (isValid) {
    _switchToItemWhenValidate(index)
  } else {
    console.log('数据验证失败，无法切换')
  }
}
function _switchToItemWhenValidate(index: number) {
  if (index >= 0 && index < selectedItems.value.length) {
    currentItemIndex.value = index
    updateItemDetailTrees()
  }
}

/**
 * 切换到上一个item
 * @description 包装switchToItem方法
 */
async function switchToPreviousItem() {
  switchToItem(currentItemIndex.value - 1)
}

/**
 * 切换到下一个item
 * @description 包装switchToItem方法
 */
async function switchToNextItem() {
  switchToItem(currentItemIndex.value + 1)
}

/**
 * 保存itemCondition数据并返回stage1
 */
async function saveItemConditionData(): Promise<boolean> {
  const isValid = await validateCurrentItemConditionData()
  if (isValid) {
    // 验证成功，返回stage1
    appContentRef.value.goToStage(1)
    console.log('数据已验证并返回stage1')
    return true
  } else {
    console.log('数据验证失败，无法保存')
    return false
  }
}

/**
 * 取消itemCondition编辑，返回stage1
 */
function cancelItemCondition() {
  // 重置当前选中items的validation状态，避免因为未完成的编辑导致下次无法进入
  if (selectedItems.value.length > 0) {
    selectedItems.value.forEach(item => {
      if (item.config.data?.validation === false) {
        // 将validation状态重置为undefined，表示需要重新验证
        item.config.data.validation = undefined
      }
    })
  }
  selectedItems.value = []
  // 不保存数据，直接返回stage1
  appContentRef.value.goToStage(1)
}

/**
 * 处理itemCondition页面的数据变更事件（回车或失去焦点）
 */
async function handleEnterFromNodeItemCondition(_node: VarNode, value: string, data: any) {
  // 关键操作：回车时验证数据
  await validateCurrentItemConditionData()
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
      console.log(inquiryDataTree.getValue())
      // 向后端发送stage 1的所有树，创建inquiry
      const data = await fetch(`${API_BASE_URL}/api/app/inquiry/edit`, {
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
      <!-- Item切换导航 -->
      <div class="item-navigation" v-if="selectedItems.length > 1">
        <button
          class="item-nav-button item-prev-button"
          @click="switchToPreviousItem"
          :disabled="currentItemIndex === 0"
        >
          ← Previous
        </button>
        <span class="item-counter">
          Item {{ currentItemIndex + 1 }} of {{ selectedItems.length }}
        </span>
        <button
          class="item-nav-button item-next-button"
          @click="switchToNextItem"
          :disabled="currentItemIndex === selectedItems.length - 1"
        >
          Next →
        </button>
      </div>

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
        @enter-from-node="handleEnterFromNodeItemCondition"
        @input-from-node="handleInputFromNodeItemCondition"
      ></VarBox>
      <!-- Conditions -->
      <VarBox
        v-else
        :tree="itemDetailConditionTree"
        @enter-from-node="handleEnterFromNodeItemCondition"
        @input-from-node="handleInputFromNodeItemCondition"
      >
        <template #[`itemDetailConditions-pricingElements--extra-buttons`]>
          <button
            class = "execute-button table-extra-button item-condition-button"
            @click="handlePricingElementsAdditionButtonClick"
            :disabled="onDisplayState"
          >
            New
          </button>
          <button
            class = "execute-button table-extra-button item-condition-button"
            @click="handlePricingElementsRemoveButtonClick"
            :disabled="itemDetailConditionTree.findNodeByPath(['pricingElements'])?.getSelectedChildren().length == 0"
          >
            Delete
          </button>
        </template>
      </VarBox>
    </template>

    <template #[`footer-content-right`]>
      {{ appContentRef?.getCurrentStageName() }}
      <!-- <button
        v-if="appContentRef?.currentStage == 0"
        class="nav-button next-button"
        @click = "initializeCreation"
      >
        Continue
      </button> -->
      <template v-if="appContentRef?.currentStage == 2">
        <button class="cancel-button" @click="cancelItemCondition">{{itemDetailStageCancelButtonLabel}}</button>
        <button class="save-button" @click="saveItemConditionData" v-if="itemDetailStageExecuteButtonVisible">Save</button>
      </template>
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

/* 定价条件表格样式 */
:deep(.itemDetailConditions--dict-leaf-section) {
  display: grid;
  grid-template-columns: 30% 10% 10% 30% 10%;
  grid-template-rows: auto auto;
  gap: 0
}
:deep(.itemDetailConditions-orderQuantity--wrapper) {
  grid-column: 1;
  grid-row: 1;
}
:deep(.itemDetailConditions-orderQuantityUnit--wrapper) {
  grid-column: 2;
  grid-row: 1;
}
:deep(.itemDetailConditions-netValue--wrapper) {
  grid-column: 4;
  grid-row: 1;
}
:deep(.itemDetailConditions-netValueUnit--wrapper) {
  grid-column: 5;
  grid-row: 1;
}
:deep(.itemDetailConditions-taxValue--wrapper) {
  grid-column: 4;
  grid-row: 2;
}
:deep(.itemDetailConditions-taxValueUnit--wrapper) {
  grid-column: 5;
  grid-row: 2;
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