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
        hideList: ['netValue', 'netValueUnit', 'pricingDate', 'orderProbability','reqDelivDate','pricingElements','taxValue','taxValueUnit'],
        childTemplate:createNodeFromConfig(cns('dict','dict','item',null,false,{},[
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
            childTemplate:createNodeFromConfig(cns('dict','dict','condition',null,false,{},[
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
            ])),
          },[],"Pricing Elements"),
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
      childTemplate:createNodeFromConfig(cns('dict','dict','condition',null,false,{},[
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
        cns('string','leaf','cdCur',false,false,{},[],"CdCur"),
        cns('boolean','leaf','stat',false,false,{},[],"Stat"),
      ])),
    },[],"Pricing Elements")
  ])
)

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
  // inquiryData-itemOverview-reqDelivDate
  if(data.data.defaultValue?.itemOverview?.reqDelivDate) {
    // inquiryDataTree.findNodeByPath(['itemOverview','reqDelivDate'])?.setValue(data.data.defaultValue.itemOverview.reqDelivDate)
    inquiryDataTree.setValueByJson(data.data.defaultValue)
  }
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

async function itemsTabQueryAll() {
  const items = inquiryDataTree.getValue().itemOverview.items
  return await itemsTabQuery(items)
}
async function itemsTabQuerySelection() {
  if (selectedItems.value.length === 0) return false
  return await itemsTabQuery(selectedItems.value as VarNode[])
}
/**
 * @description 询价单批量查询，向后端发送VarNode[]，返回Net Value: 和 Expect. Oral Val: 包括值和单位，还有每个item的详细信息
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

    appContentRef.value.forceUpdate()
    return data.data.result.allDataLegal === 1
  }

  return false
}

/**
 * 物品的详细信息
 */

const selectedItems = ref<VarNode[]>([])
const currentItemIndex = ref(0)


// 移除了本地的validateFieldWithCallbacks函数，现在使用DataProtectionManager的方法

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

  // 使用值拷贝而不是引用设置
  const setValueFromItem = (sourcePath: string[], targetPath: string[], targetTree: VarTree) => {
    const sourceNode = currentItem.findNodeByPath(sourcePath)
    if (sourceNode) {
      const targetNode = targetTree.findNodeByPath(targetPath)
      if (targetNode) {
        // 使用setValue进行值拷贝，而不是replaceNodeByPath的引用设置
        targetNode.setValue(sourceNode.getValue())
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

// 不再需要辅助函数

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
 * 切换到上一个item（需要验证当前数据）
 */
async function switchToPreviousItem() {
  if (currentItemIndex.value > 0) {
    const isValid = await validateCurrentItemConditionData()
    if (isValid) {
      switchToItem(currentItemIndex.value - 1)
    } else {
      console.log('数据验证失败，无法切换')
    }
  }
}

/**
 * 切换到下一个item（需要验证当前数据）
 */
async function switchToNextItem() {
  if (currentItemIndex.value < selectedItems.value.length - 1) {
    const isValid = await validateCurrentItemConditionData()
    if (isValid) {
      switchToItem(currentItemIndex.value + 1)
    } else {
      console.log('数据验证失败，无法切换')
    }
  }
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
  // 不保存数据，直接返回stage1
  appContentRef.value.goToStage(1)
  console.log('已取消itemCondition编辑')
}

// 移除不再需要的singleItemTabQuery函数

/**
 * 验证当前itemCondition数据并同步到原始item
 */
async function validateCurrentItemConditionData(): Promise<boolean> {
  // 获取itemDetailConditionTree中的数据
  const conditionData = itemDetailConditionTree.getValue()

  try {
    const response = await fetch(`${API_BASE_URL}/api/app/inquiry/item-tab-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conditionData)
    })

    const result = await response.json()

    if (result.success) {
      // 验证成功，更新itemDetailConditionTree数据
      if (result.data) {
        // 更新itemDetailConditionTree
        itemDetailConditionTree.forceSetValue(result.data)

        // 设置validation状态
        const nodes = itemDetailConditionTree.getAllNodes()
        nodes.forEach(node => {
          if (!node.config.data) {
            node.config.data = {}
          }
          node.config.data.validation = true
        })

        // 同步到原始item
        if (selectedItems.value.length > 0) {
          const currentItem = selectedItems.value[currentItemIndex.value]
          currentItem.forceSetValue(result.data)
        }
      }
      return true
    } else {
      console.warn('数据验证失败:', result.message)
      return false
    }
  } catch (error) {
    console.error('验证请求失败:', error)
    return false
  }
}

/**
 * 验证当前原始item数据
 */
async function validateCurrentItemCondition(): Promise<boolean> {
  if (selectedItems.value.length === 0) return false

  const currentItem = selectedItems.value[currentItemIndex.value]

  // 如果已经验证过且有效，直接返回true
  if (currentItem.config.data?.validation === true) {
    return true
  }

  try {
    // 获取当前item的值
    const itemData = currentItem.getValue()

    const response = await fetch(`${API_BASE_URL}/api/app/inquiry/item-tab-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData)
    })

    const result = await response.json()

    if (result.success) {
      // 验证成功，更新item数据
      if (result.data) {
        // 更新数据
        currentItem.forceSetValue(result.data)

        // 设置validation状态
        if (!currentItem.config.data) {
          currentItem.config.data = {}
        }
        currentItem.config.data.validation = true

        // 更新UI
        updateItemDetailTrees()
      }
      return true
    } else {
      console.warn('数据验证失败:', result.message)
      return false
    }
  } catch (error) {
    console.error('验证请求失败:', error)
    return false
  }
}

/**
 * 处理用户输入事件，立即标记为未验证
 */
function handleInputFromNodeItemCondition(_node: VarNode, value: string, data: any) {
  // 用户输入时，直接更新VarBox中的节点，不更新原始item
  const nodePath = data.nodePath
  if (nodePath && nodePath.length > 0) {
    // 直接更新itemDetailConditionTree中的节点
    const targetNode = itemDetailConditionTree.findNodeByPath(nodePath)
    if (targetNode) {
      // 设置validation为false
      if (!targetNode.config.data) {
        targetNode.config.data = {}
      }
      targetNode.config.data.validation = false

      // 更新值
      targetNode.setValue(value)
    }
  }
}

/**
 * 处理itemCondition页面的数据变更事件（回车或失去焦点）
 */
async function handleEnterFromNodeItemCondition(_node: VarNode, value: string, data: any) {
  // 更新itemDetailConditionTree中的数据
  const nodePath = data.nodePath
  if (nodePath && nodePath.length > 0) {
    const targetNode = itemDetailConditionTree.findNodeByPath(nodePath)
    if (targetNode) {
      targetNode.setValue(value)
    }
  }

  // 关键操作：回车时验证数据
  const isValid = await validateCurrentItemConditionData()
  if (!isValid) {
    // 验证失败，不做任何操作
    console.log('验证失败，保持当前状态')
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
      { prevText:'/hide', nextText:'/hide'}
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
      ></VarBox>
      <!-- Conditions -->
      <VarBox
        v-else
        :tree="itemDetailConditionTree"
        @enter-from-node="handleEnterFromNodeItemCondition"
        @input-from-node="handleInputFromNodeItemCondition"
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
      <template v-if="appContentRef?.currentStage == 2">
        <button class="cancel-button" @click="cancelItemCondition">Cancel</button>
        <button class="save-button" @click="saveItemConditionData">Save</button>
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
.item-condition-button {
  width: 24px;
  height: 24px;
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