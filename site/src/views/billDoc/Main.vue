<script lang="ts" setup>
import {ref, Ref, computed} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
import FilterTabs from '@/components/FilterTabs.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'
import {createTreeFromConfig, createNodeFromConfig, cns, VarTree, VarNode, NodeStructure, isNodeStructure, VarNodeValue} from '@/utils/VarTree';
import {
  billingDocumentIdSearch,
  soldToPartySearch,
  billToPartySearch,
  payerPartySearch,
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
      cns('string','leaf','soldToParty','',false,{searchMethods:soldToPartySearch},[],"Sold-To Party:"),
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
      cns('string','leaf','netValue','',false,{},[],"Net Value: "),
      cns('string','leaf','netValueUnit','',false,{hideLabel:true},[]," "),
      cns('string','leaf','payer','',false,{},[],"Payer: "),
      cns('date','leaf','billingDate','',false,{},[],"Billing Date: "),
    ]),
    cns('dict','dict','itemOverview',{},false,{},[
      cns('dynamiclist','list','items',null,false,{
        hideLabel:true,
        childTemplate:cns('dict','dict','item',null,false,{},[
          cns('string','leaf','item','',true,{},[],"Item"),
          cns('string','leaf','salesDocument','',false,{},[],"Sales Document"),
          cns('string','leaf','salesDocumentItem','',false,{},[],"S.Doc.Item"),
          cns('string','leaf','material','',false,{},[],"Material"),
          cns('string','leaf','description','',false,{},[],"Description"),
          cns('string','leaf','billingQuantity','',false,{},[],"Billing Qty"),
          cns('string','leaf','quantityUnit','',false,{hideLabel:true},[],"Unit"),
          cns('string','leaf','netValue','',true,{},[],"Net Value"),
          cns('string','leaf','taxValue','',true,{},[],"Tax"),
          cns('string','leaf','grossValue','',true,{},[],"Gross Value"),
          cns('string','leaf','currency','',true,{hideLabel:true},[],"Curr."),
        ]),
      },[],"Items")
    ],'Item Overview')
  ])
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
  const data = await fetch(`${API_BASE_URL}/api/app/billing/initialize`, {
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
  
  if(data.data.content) {
    billingDataTree.forceSetValue(data.data.content)
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
  const data = await fetch(`${API_BASE_URL}/api/app/billing/get`, {
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
  const billingData: VarNodeValue = data.data.content
  billingDataTree.forceSetValue(billingData)
  return true
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
      const data = await fetch(`${API_BASE_URL}/api/app/billing/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billingDataTree.getValue())
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
        if (data.data.content?.id) {
          billingDataTree.findNodeByPath(['meta','id'])!.setValue(data.data.content?.id)
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
    :stages="['initialScreen','information']"
    :before-next="handleExecute"
    :before-prev="handleCancel"
    :after-next="handleAfterNext"
    :after-prev="handleAfterPrev"
    :footer-config="[
      { nextText:initializeStageNextButtonLabel },
      { prevText:informationStagePrevButtonLabel, nextText:informationStageNextButtonLabel },
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
      </VarBox>
    </template>

    <template #[`footer-content-right`]>
      {{ appContentRef?.getCurrentStageName() }}
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
:deep(.billingData-basicInfo-netValue--wrapper) {
  grid-column: var(--second-col);
  grid-row: 1;
}

:deep(.billingData-basicInfo-netValue--extra) {
  flex: 1
}
</style>