<script lang="ts" setup>
import {ref} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
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
      cns('dynamiclist','list','items',null,false,{hideLabel:true, childTemplate:createNodeFromConfig(cns('dict','dict','item',null,false,{},[
          cns('string','leaf','material','',false,{},[],"Material"),
          cns('string','leaf','orderQuantity','',false,{},[],"Order Quantity"),
          cns('number','leaf','su','',false,{},[],"SU"),
          cns('number','leaf','altItm','',false,{},[],"AltItm"),
          cns('number','leaf','description','',false,{},[],"Description"),
        ]))
      },[],"Items")
    ],'Item Overview')
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
    :stages="['initialScreen','information']"
    :before-next="handleExecute"
    :before-prev="handleCancel"
    :footer-config="[
      { nextText:'/hide' }, // 使用插槽自定义第一步的按钮
      { prevText:'Cancel' }
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
</style>