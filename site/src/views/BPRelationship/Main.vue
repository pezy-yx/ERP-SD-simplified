<script lang="ts" setup>
import {ref, Ref, computed, onMounted} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'
import {createTreeFromConfig, createNodeFromConfig, cns, VarTree, VarNode, NodeStructure, isNodeStructure, VarNodeValue} from '@/utils/VarTree';
import {
  bpSearch,
  relationSearch
} from '@/utils/searchMethods'

let API_BASE_URL = window.API_BASE_URL || ''
onMounted(() => {
  API_BASE_URL = window.API_BASE_URL || ''
})
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

/**
 * @description 初始阶段-创建-初始化BP关系
 */
const initialCreationTree = createTreeFromConfig(
  cns('dict','dict','initialScreen',{},false,{hideLabel:true},[
    cns('dict','dict','relation',{},false,{hideLabel:true},[
      cns('string','leaf','relationShipCategory','',false,{searchMethods:relationSearch},[],"Relationship Category:")
    ]),
    cns('dict','dict','default',{},false,{},[
      cns('string','leaf','businessPartner1','',false,{searchMethods:bpSearch},[],"Business Partner 1:"),
      cns('string','leaf','businessPartner2','',false,{searchMethods:bpSearch},[],"Business Partner 2:"),
      cns('date','leaf','validFrom','',false,{},[],"Valid From:"),
      cns('date','leaf','validTo','',false,{},[],"Valid To:"),
    ],'Default')
  ])
)

/**
 * @description 初始阶段-查询/修改-搜索BP关系
 */
const initialSearchTree = createTreeFromConfig(
  cns('dict','dict','initialScreen',{},false,{hideLabel:true},[
    cns('string','leaf','relationshipId','',false,{},[],"Relationship ID:"),
  ])
)

/**
 * @description 主信息-BP关系信息主树
 */
const bpRelationshipDataTree = createTreeFromConfig(
  cns('dict','dict','bpRelationshipData',{},false,{hideLabel:true},[
    cns('dict','dict','meta',{},false,{hideSelf:true},[
      cns('string','leaf','id','',false,{},[]),
    ]),
    cns('dict','dict','basicInfo',{},false,{},[
      cns('dict','dict','relation',{},false,{hideLabel:true},[
        cns('string','leaf','relationShipCategory','',false,{searchMethods:relationSearch},[],"Relationship Category:")
      ]),
      cns('dict','dict','default',{},false,{},[
        cns('string','leaf','businessPartner1','',false,{searchMethods:bpSearch},[],"Business Partner 1:"),
        cns('string','leaf','businessPartner2','',false,{searchMethods:bpSearch},[],"Business Partner 2:"),
        cns('date','leaf','validFrom','',false,{},[],"Valid From:"),
        cns('date','leaf','validTo','',false,{},[],"Valid To:"),
      ],'Default')
    ],'Basic Information'),
  ])
)

/**
 * @description 动态表单数据树
 */
const generalDataTree = createTreeFromConfig(
  cns('dict','dict','generalData',{},false,{},[
    cns('string','leaf','vip','',false,{},[],"(Default) VIP: "),
    cns('string','leaf','department','',false,{},[],"(Default) Department: "),
    cns('string','leaf','function','',false,{},[],"(Default) Function: "),
  ],"(Default) General Data")
)

/**
 * @description BP关系的可写树，用于显示状态和编辑状态的切换
 */
const writableTrees = [bpRelationshipDataTree, generalDataTree]

const initializeResult = ref(false)
/**
 * @description 创建-初始化
 */
async function initializeByCreation() {
  const data = await fetch(`${API_BASE_URL}/api/app/bp-relationship/register`, {
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
  if(!data.success) return false
  
  // 设置基本信息
  const basicInfoValue = initialCreationTree.getValue()
  bpRelationshipDataTree.findNodeByPath(['basicInfo'])?.forceSetValue(basicInfoValue)
  
  // 设置动态表单结构
  const struct = data.data.formStruct
  if (isNodeStructure(struct)) {
    generalDataTree.setRoot(createNodeFromConfig(struct))
    generalDataTree.root!.readonly = onDisplayState.value
  }
  
  return true
}

/**
 * @description 查询/修改-初始化
 */
async function initializeByGet() {
  const data = await fetch(`${API_BASE_URL}/api/app/bp-relationship/get`, {
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

  const bpRelationshipData: VarNodeValue = data.data.content.basicInfo
  bpRelationshipDataTree.forceSetValue(bpRelationshipData)
  
  // 设置动态表单结构
  const struct = data.data.formStruct
  if (isNodeStructure(struct)) {
    generalDataTree.setRoot(createNodeFromConfig(struct))
    generalDataTree.root!.readonly = onDisplayState.value
  }
  if(data.data.content.generalData) {
    console.log('generalData',data.data.content.generalData)
    console.log('cur',generalDataTree.getValue())
    generalDataTree.forceSetValue(data.data.content.generalData)
  }
  appContentRef.value.forceUpdate()
  
  return true
}

// 计算属性：初始化阶段按钮标签
const initializeStageNextButtonLabel = computed(() => {
  if (onCreateState.value) {
    return 'Initialize'
  } else {
    return 'Load'
  }
})

// 计算属性：信息阶段按钮标签
const informationStagePrevButtonLabel = computed(() => {
  if (onCreateState.value) {
    return 'Back'
  } else {
    return 'Back'
  }
})

const informationStageNextButtonLabel = computed(() => {
  if (onDisplayState.value) {
    return 'Edit'
  } else if (onCreateState.value) {
    return 'Create'
  } else {
    return 'Save'
  }
})

async function handleCancel(currentStage: number, targetStage: number) {
  if (currentStage === 1) {
    if (onCreateState.value) {
      const confirmValue = confirm('Cancel the creation?')
      if(confirmValue) {    
        appContentRef.value.footerMessage = ''
      }
      return confirmValue
    } else if (onChangeState.value) {
      const confirmValue = confirm('Cancel the changes?')
      if(confirmValue) {    
        appContentRef.value.footerMessage = ''
        appToState('display')
      }
      return confirmValue
    }
  }
  return true
}

async function handleExecute(currentStage: number, targetStage: number) {
  console.log('try: stage change:',currentStage,'->',targetStage)
  
  if (currentStage === 0) {
    if (onCreateState.value) {
      initializeResult.value = await initializeByCreation()
    } else {
      initializeResult.value = await initializeByGet()
    }
    return initializeResult.value
  }

  if (currentStage === 1) {
    if (onDisplayState.value) {
      console.log('切换到修改状态')
      appToState('change')
      return false
    }
    if (onCreateState.value || onChangeState.value) {
      console.log(bpRelationshipDataTree.getValue())
      // 向后端发送数据，创建或修改BP关系
      const body = {
        bpRelationshipData: bpRelationshipDataTree.getValue(),
        generalData: generalDataTree.getValue(),
      }
      const data = await fetch(`${API_BASE_URL}/api/app/bp-relationship/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }).then(response => {
        console.log('正常返回', response)
        return response.json()
      }).catch(error => {
        console.error('创建/修改BP关系失败:', error)
        return { success: false }
      })
      console.log('返回的数据',data)
      if (data.success){
        appContentRef.value.footerMessage = data.data.message
        if (data.data.content?.id) {
          bpRelationshipDataTree.findNodeByPath(['meta','id'])?.setValue(data.data.content.id)
        }
        console.log(bpRelationshipDataTree.getValue())
        appToState('display')
      }
    }
    return false
  }

  return false
}

// 暴露方法给子组件调用
defineExpose({
  appToState
})

</script>

<template>
  <AppContent
    :stages="['initialScreen','information']"
    :before-next="handleExecute"
    :before-prev="handleCancel"
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
        :tree="bpRelationshipDataTree"
      ></VarBox>
      <VarBox
        :tree="generalDataTree"
      ></VarBox>
    </template>

    <template #[`footer-content-right`]>
      {{ appContentRef?.getCurrentStageName() }}
    </template>

  </AppContent>
</template>

<style scoped>
</style>
