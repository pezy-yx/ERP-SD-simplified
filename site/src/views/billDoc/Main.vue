<script lang="ts" setup>
import {ref, Ref, computed, onMounted} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'
import {createTreeFromConfig, cns, VarNodeValue, VarNode} from '@/utils/VarTree';
import {
  billingDocumentIdSearch,
  CurrencyUnitSearch,
  customerSearch,
  deliveryIdSearch,
} from '@/utils/searchMethods'
import { createItemConditionKit, type ItemConditionKit } from '@/utils/ItemConditionKit'
import ItemConditionDetail from '@/components/itemCondition/ItemConditionDetail.vue'
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
  if (appContentRef.value) {
    appContentRef.value.forceUpdate()
  }
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

defineExpose({
  appToState,
})

/**
 * @description 初始阶段-创建-开票到期清单查询
 */
const initialCreationTree = createTreeFromConfig(
  cns('dict','dict','initialScreen',{},false,{hideLabel:true},[
    cns('dict','dict','billingDueList',{},false,{hideLabel:true},[
      cns('date','leaf','billingDate','',false,{},[],"Billing Date:"),
      cns('string','leaf','soldToParty','',false,{searchMethods:customerSearch},[],"Sold-To Party:"),
      cns('string','leaf','deliveryId','',false,{searchMethods:deliveryIdSearch},[],"Delivery:"),
    ]),
  ])
)

/**
 * @description 初始阶段-查询/修改-搜索开票凭证
 */
const initialSearchTree = createTreeFromConfig(
  cns('dict','dict','initialScreen',{},false,{hideLabel:true},[
    cns('string','leaf','billingDocumentId','',false,{searchMethods:billingDocumentIdSearch},[],"Billing Document:"),
  ])
)

/**
 * @description 主信息-开票凭证信息主树
 */
const billingDataTree = createTreeFromConfig(
  cns('dict','dict','billingData',{},false,{hideLabel:true},[
    cns('dict','dict','meta',{},false,{hideSelf:true},[
      cns('string','leaf','id','',false,{},[]),
    ]),
    cns('dict','dict','basicInfo',{},false,{
      hideLabel:true,
      hideList:['type','netValueUnit']
    },[
      cns('selection','leaf','type','',false,{options:["Invoice"], hideLabel:true},[]," "),
      cns('string','leaf','id','',false,{},[]," "),
      cns('string','leaf','netValue','',true,{},[],"Net Value: "),
      cns('string','leaf','netValueUnit','',true,{hideLabel:true, searchMethods:CurrencyUnitSearch},[]," "),
      cns('string','leaf','payer','',false,{searchMethods:customerSearch},[],"Payer: "),
      cns('date','leaf','billingDate','',false,{},[],"Billing Date: "),
      cns('string','leaf','deliveryId','',true,{searchMethods:deliveryIdSearch},[],"Delivery:"),
    ]),
    cns('dict','dict','itemOverview',{},false,{},[
      // items节点将通过ItemConditionKit动态创建
    ],'Item Overview')
  ])
)

// 创建 ItemConditionKit 实例
const itemConditionKit = createItemConditionKit({
  // validationEndpoint: '/api/app/billing/items-tab-query',
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
      body: JSON.stringify(billingDataTree.findNodeByPath(['itemOverview','items'])?.getValue() ?? [])
    }).then(async (response) => {
      const data = await response.json()
      // 更新销售订单数据树
      billingDataTree.findNodeByPath(['basicInfo','netValue'])?.forceSetValue(data?.data?.netValue)
      billingDataTree.findNodeByPath(['basicInfo','netValueUnit'])?.forceSetValue(data?.data?.netValueUnit)
      billingDataTree.forceUpdate()
    })
  }
})

// 使用 ItemConditionKit 创建 items 节点（使用默认模板）
itemConditionKit.summonItemsNode(
  billingDataTree,
  ['itemOverview', 'items']
)

/**
 * @description 开票凭证的可写树，用于显示状态和编辑状态的切换
 */
const writableTrees = [billingDataTree]

const initializeResult = ref(false)
/**
 * @description 创建-初始化开票到期清单
 */
async function initializeByCreation() {
  const data = await fetch(`${window.getAPIBaseUrl()}/api/app/billing/initialize`, {
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
  if(data.message) {
    appContentRef.value?.setFooterMsg(data.message, 5)
  }
  if(data.data?.message) {
    appContentRef.value?.setFooterMsg(data.data?.message, 5)
  }
  if(!data.success) return false

  if(data.data.content) {
    billingDataTree.forceSetValue(data.data.content)
    await itemsTabQueryAll()
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
  const data = await fetch(`${window.getAPIBaseUrl()}/api/app/billing/get`, {
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
  const message = data.message ?? data.data?.message ?? ''
  if(message) {
    appContentRef.value?.setFooterMsg(message)
  }
  if(!data.success) return false
  if(!data.data.content) {
    return false
  }
  const billingData: VarNodeValue = data.data.content
  billingDataTree.forceSetValue(billingData)
  await itemsTabQueryAll()
  return true
}

/**
 * @description 开票凭证变量树的enter-from-node事件处理（对齐 inquiry）
 */
async function handleEnterFromNodeBillingTree(node: VarNode, value: string, data: any) {
  if (data.nodePath.length > 2 && data.nodePath[0] === 'itemOverview' && data.nodePath[1] === 'items') {
    await itemsTabQueryAll()
  }
}

/**
 * @description 封装itemsTabQuery-查询所有（复用 kit）
 */
async function itemsTabQueryAll() {
  return await (itemConditionKit as any).validateItemsInTree(
    billingDataTree,
    ['itemOverview','items'],
    { forceUpdateTree: billingDataTree }
  )
}


/**
 * @description 状态管理的after-next钩子
 */
async function handleAfterNext(_currentStage: number, _targetStage: number) {
}

/**
 * @description 状态管理的after-prev钩子
 */
async function handleAfterPrev(_currentStage: number, _targetStage: number) {
}

/**
 * @description 状态管理的before-prev钩子
 */
async function handleCancel(currentStage: number, _targetStage: number) {
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
      console.log(billingDataTree.getValue())
      // 向后端发送stage 1的所有树，创建/保存开票凭证
      await itemsTabQueryAll()
      const treeValue = billingDataTree.getValue()
      // 去除netValue的千分位分隔符，保证后端能正确解析为数字
      treeValue.basicInfo.netValue = treeValue.basicInfo.netValue.replace(/,/g, '')
      const data = await fetch(`${window.getAPIBaseUrl()}/api/app/billing/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(treeValue)
      }).then(response => {
        console.log('正常返回', response)
        return response.json()
      }).catch(error => {
        console.error('创建开票凭证失败:', error)
        return { success: false }
      })
      console.log('返回的数据',data)
      // footer
      if (data.success){
        appContentRef.value.footerMessage = data.data.message
        if (data.data.content) {
          billingDataTree.forceSetValue(data.data.content)
        }
        appToState('display')
      }
    }
    return false
  }

  return false
}

/**
 * ItemConditionDetail 事件处理函数
 */
function handleItemConditionValidationSuccess(items: VarNode[]) {
  console.log('Item condition validation success:', items)
}

function handleItemConditionValidationFailed(items: VarNode[]) {
  console.log('Item condition validation failed:', items)
}

function handleItemConditionSave() {
  console.log('Item condition save')
  // 返回到主页面
  appContentRef.value.goToStage(1) // 返回到information阶段
}

function handleItemConditionCancel() {
  console.log('Item condition cancel')
  // 返回到主页面
  appContentRef.value.goToStage(1) // 返回到information阶段
}

/**
 * 处理 Items Table 的按钮点击事件（使用ItemConditionKit）
 */
async function handleItemsTableClick() {
  const itemsNode = billingDataTree.findNodeByPath(['itemOverview', 'items'])!;
  const selectedChildren = [...itemsNode.getSelectedChildren()]; // 获取所有选中的子节点

  if (selectedChildren && selectedChildren.length > 0) {
    // 检查是否有未验证的items
    const unvalidatedItems = selectedChildren.filter(item =>
      item.config.data?.validation !== true
    );

    if (unvalidatedItems.length > 0) {
      console.log('发现未验证的items，正在验证...');
      // 这里可以添加验证逻辑，暂时跳过
    }

    // 切换到详情页面
    appContentRef.value.goToStage(2); // Stage 2 是itemCondition
  } else {
    console.log('没有选中任何物品。');
  }
}

</script>

<template>
  <AppContent
    :stages="['initialScreen','information','itemCondition']"
    :before-next="handleExecute"
    :before-prev="handleCancel"
    :after-next="handleAfterNext"
    :after-prev="handleAfterPrev"
    :footer-config="[
      { nextText:initializeStageNextButtonLabel },
      { prevText:informationStagePrevButtonLabel, nextText:informationStageNextButtonLabel },
      { prevText:'Back', nextText:'/hide' },
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
        :tree="billingDataTree"
        @enter-from-node="handleEnterFromNodeBillingTree"
      >
        <template #[`billingData-basicInfo-netValue--extra`]>
          <VarBox
            :tree="billingDataTree"
            :path="['basicInfo','netValueUnit']"
          ></VarBox>
        </template>
        <template #[`billingData-basicInfo-id--var-label`]>
          <VarBox
            :tree="billingDataTree"
            :path="['basicInfo','type']"
          ></VarBox>
        </template>
        <template #[`billingData-itemOverview-items--extra-buttons`]>
          <button
            class="execute-button table-extra-button"
            @click="handleItemsTableClick"
            :disabled="billingDataTree.findNodeByPath(['itemOverview','items'])?.getSelectedChildren().length === 0"
          >
            ...
          </button>
        </template>
      </VarBox>
    </template>

    <template #stage-itemCondition>
      <ItemConditionDetail
        :kit="itemConditionKit"
        :config="{
          navigationLabels: {
            cancel: 'Cancel',
            save: 'Save',
            previous: '← Previous',
            next: 'Next →'
          }
        }"
        @validation-success="handleItemConditionValidationSuccess"
        @validation-failed="handleItemConditionValidationFailed"
        @save="handleItemConditionSave"
        @cancel="handleItemConditionCancel"
      >
        <!-- teleport目标插槽 -->
        <template #footer-content-right>
          <slot name="footer-content-right"></slot>
        </template>
      </ItemConditionDetail>
    </template>

    <template #[`footer-content-right`]>
      
    </template>

  </AppContent>
</template>

<style scoped>
:deep(.billingData-basicInfo--dict-leaf-section) {
  display: grid;
  grid-template-columns: 1% 0% 25% 0% 45% 5% 15%;
  grid-template-rows: auto auto auto auto;
  --first-col: 2 / 4;
  --first-col-left: 2;
  --first-col-right: 3;
  --second-col: 5;
  --second-col-after: 6;
}

:deep(.billingData-basicInfo-type--leaf-node) {
  display: flex;
}
:deep(.billingData-basicInfo-id--wrapper) {
  grid-column: var(--first-col-right);
  grid-row: 1;
}
:deep(.billingData-basicInfo-payer--wrapper) {
  grid-column: var(--first-col-right);
  grid-row: 2;
}
:deep(.billingData-basicInfo-billingDate--wrapper) {
  grid-column: var(--first-col-right);
  grid-row: 3;
}
:deep(.billingData-basicInfo-deliveryId--wrapper) {
  grid-column: var(--first-col-right);
  grid-row: 4;
}
:deep(.billingData-basicInfo-netValue--wrapper) {
  grid-column: var(--second-col);
  grid-row: 1;
}

:deep(.billingData-basicInfo-netValue--extra) {
  flex: 1
}
</style>