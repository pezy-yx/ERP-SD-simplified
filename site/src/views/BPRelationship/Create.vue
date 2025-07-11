<script lang="ts" setup>
import {ref} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'
import {createTreeFromConfig, createNodeFromConfig, cns, VarTree, VarNode, NodeStructure, isNodeStructure} from '@/utils/VarTree';
import {
  bpSearch,
  relationSearch
} from '@/utils/searchMethods'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || ''
const appContentRef = ref(null) as any

const initialScreenTree = createTreeFromConfig(
  // root
  cns('dict','dict','createBpInput',{},false,{hideLabel:true},[
    // relation
    cns('dict','dict','relation',{},false,{hideLabel:true},[
      cns('string','leaf','relationShipCategory','',false,{searchMethods:relationSearch},[],"Relationship Category:")
    ]),
    // default
    cns('dict','dict','default',{},false,{},[
      cns('string','leaf','businessPartner1','',false,{searchMethods:bpSearch},[],"Business Partner 1:"),
      cns('string','leaf','businessPartner2','',false,{searchMethods:bpSearch},[],"Business Partner 2:"),
      cns('date','leaf','validFrom','',false,{},[],"Valid From:"),
      cns('date','leaf','validTo','',false,{},[],"Valid To:"),
    ],'Default')
  ],"")
)

const basicInfoTree = createTreeFromConfig(
  cns('dict','dict','basicInfo',{},false,{},[],"Basic Info")
)

const generalDataTree = createTreeFromConfig(
  cns('dict','dict','generalData',{},false,{},[
    cns('string','leaf','vip','',false,{},[],"(Default) VIP: "),
    cns('string','leaf','department','',false,{},[],"(Default) Department: "),
    cns('string','leaf','function','',false,{},[],"(Default) Function: "),
  ],"(Default) General Data")
)

async function handleCancel(currentStage: number, targetStage: number) {
  if (currentStage === 1) { // from general data
    const confirmValue = confirm('Cancel the creation?')
    if(confirmValue) {    
      appContentRef.value.footerMessage = ''
    }
    return confirmValue
  }
  return true
}

async function handleExecute(currentStage: number, targetStage: number) {
  console.log(initialScreenTree.root?.currentValue)
  console.log('try: stage change:',currentStage,'->',targetStage)
  if (currentStage === 0) { // from initial screen
    const data = await fetch(`${API_BASE_URL}/api/app/bp-relationship/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(initialScreenTree.root?.currentValue)
    }).then(response => {
      console.log('正常返回', response)
      return response.json()
    }).catch(error => {
      console.error('申请失败:', error)
      return { success: false }
    })
    console.log('返回的数据',data)
    const struct = data.data.formStruct
    if (isNodeStructure(struct)) {
      generalDataTree.setRoot(createNodeFromConfig(struct))
    }

    basicInfoTree.setRoot(initialScreenTree.cloneRoot())
    basicInfoTree.root!.readonly = true
    return data.success
  }

  if (currentStage === 1) { // from general data
    console.log('general data:', generalDataTree.root?.currentValue)
    const body = {
      basicInfo: basicInfoTree.root?.currentValue,
      generalData: generalDataTree.root?.currentValue,
    }
    const data = await fetch(`${API_BASE_URL}/api/app/bp-relationship/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }).then(response => {
      console.log('正常返回', response)
      return response.json()
    }).catch(error => {
      console.error('创建BP关系失败:', error)
      return { success: false }
    })
    console.log('返回的数据',data)
    if(data.success) {
      appContentRef.value.footerMessage = data.data.message
    }
    return false // 不切换状态
  }


  return false
}

</script>

<template>
  <AppContent
    :stages="['initialScreen','generalData']"
    :before-next="handleExecute"
    :before-prev="handleCancel"
    :footer-config="[
      {},
      { prevText:'Cancel', nextText:'Save'}
    ]"
    ref="appContentRef"
  >
    <template #[`stage-initialScreen`]>
      <VarBox
        :tree="initialScreenTree"
      ></VarBox>
    </template>
    <template #[`stage-generalData`]>
      <VarBox
        :tree="basicInfoTree"
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