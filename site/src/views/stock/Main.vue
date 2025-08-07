<template>
  <AppContent
    :stages="['display']"
    :footer-config="[
      {nextText:'/hide'}
    ]"
    ref="appContentRef"
  >
    <template #[`stage-display`]>
      <VarBox
        :tree="materialInfoTree"
      >
      </VarBox>
      <div class="searchButtonContainer">
        <button
          class="execute-button"
          :onclick="handleSearch"
        >
          Search
        </button>
      </div>
      <VarBox
        :tree="stockDisplayTree"
      >
        <template #[`stock-stockTree--extra-buttons`]>
          <button
            class="execute-button"
            :onclick="showDetailModal"
          >
            Display Detail
          </button>
        </template>
        <template
          v-for="index in stockDisplayTree.findNodeByPath(['stockTree'])?.children?.length || 0"
          #[`stock-stockTree-${index-1}-level--wrapper`]="{ currentNode, allProps }"
        >
          <button
            class="details-button"
            @click="handleDetailButtonClick(currentNode, index-1)"
          >
            <div class="level-text-container">
              <input type="text" :value="(()=>{
                const node = stockDisplayTree.findNodeByPath(['stockTree'])!.children![index-1]
                if(!node.config.data || node.config.data.tree.depth==undefined ||node.config.data.collapse == undefined ) return ''
                const prefix = '\t'.repeat(node.config.data.tree.depth)
                const mark = node.config.data.collapse? '>':'v' 
                return `${prefix}${mark} ${(node.getValue()! as {level:string}).level}`
              })()" :readonly="true">
            </div>
          </button>
        </template>
      </VarBox>
      <teleport to="body">
        <div v-if="showDetailModalFlag" class="detailModalContainer">
          <span
            class="grayBgLayer"
            :onclick = "hideDetailModal"
          >
          </span>
          <div class="detailBox">
            <div class="header">
              Stock Detail
            </div>
            <div class="box">
              <VarBox
                :tree="stockDetailTree"
              >
              </VarBox>
            </div>
            <span class="spacer"></span>
            <div class="footer">
              <button class="execute-button" :onclick="hideDetailModal">Close</button>
            </div>
          </div>
        </div>
      </teleport>
    </template>
  </AppContent>
</template>
<script lang="ts" setup>
import { createTreeFromConfig, cns, VarNode } from '@/utils/VarTree';
import { computed, onMounted, ref, watch } from 'vue';
import VarBox from '@/components/varbox/VarBox.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'

onMounted(async ()=>{
  await initializeTrees()
})

const appContentRef = ref(null) as any
/**
 * @description 向后端获取stock的合法阶段，给stockStages和stockLevelString赋值
 */
async function initializeTrees() {
  const stagesRes = await fetch(`${window.getAPIBaseUrl()}/api/stock/getStockStages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({})
  })
  if(!stagesRes.ok){
    alert('Network Error')
    return
  }
  const stagesResJson = await stagesRes.json()
  stockStages.value = stagesResJson.data ?? []

  const levelsRes = await fetch(`${window.getAPIBaseUrl()}/api/stock/getStockLevels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({})
  })
  if(!levelsRes.ok){
    alert('Network Error')
    return
  }
  const levelsResJson = await levelsRes.json()
  stockLevels.value = levelsResJson.data ?? []
}

/** @description 搜索并展示material基本信息 */
const materialInfoTree = createTreeFromConfig(cns("dict","dict","materialInfo",null,false,{hideLabel:true},[
  cns("string","leaf","id","",false,{},[],"Material ID: "),
  cns("dict","dict","info","",true,{},[
    cns("string","leaf","name","",false,{},[],"Name: "),
    cns("string","leaf","materialType","",false,{},[],"Material Type: "),
    cns("string","leaf","unit","",false,{},[],"Unit Of Measure: "),
  ],"Info")
]))
/** @description 展示material库存信息 */
const stockDisplayTree = createTreeFromConfig(cns("dict","dict","stock",null,false,{hideLabel:true},[
  cns('dynamiclist','list','stockTree',[],true,{
    childTemplate: cns('dict','dict','row',null,false,{},[
      cns('string','leaf','level','',false,{},[],''), //动态获取nameDisplay
      // 后端动态添加各个stage, name=stage${k}
    ]),
    rowProvided: 3
  },[],"Stock Detail")
]))
/** @description 库存详细信息 */
const stockDetailTree = createTreeFromConfig(cns("dict","dict","stockDetail",null,false,{hideLabel:true},[
  cns('dynamiclist','list','stockByStages',[],true,{
    childTemplate: cns('dict','dict','row',null,false,{},[
      cns('string','leaf','stage','',false,{},[],'Stage'),
      cns('string','leaf','value','',false,{},[],'Stock'),
    ]),
    rowProvided: 0,
    hideLabel:true,
  },[],"Stock Detail")
]))

/**
 * @description 搜索材料库存
 */
async function handleSearch() {
  const info = await fetch(`${window.getAPIBaseUrl()}/api/stock/materialInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(materialInfoTree.getValue())
  }).then(response => {
    return response.json()
  }).catch(error => {
    return {success: false}
  })
  if(!info.success) return
  materialInfoTree.findNodeByPath(['info'])!.forceSetValue(info.data)
  appContentRef.value?.forceUpdate()
  materialInfoTree.forceUpdate()

  const data = await fetch(`${window.getAPIBaseUrl()}/api/stock/searchStock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(materialInfoTree.getValue())
  }).then(response => {
    console.log('正常返回', response)
    return response.json()
  }).catch(error => {
    console.error('申请失败:', error)
    return { success: false }
  })
  console.log('返回的数据',data)
  if(!data.success) return
  type StockTree = {
    data: {
      level: string
      [key: string]: any
    },
    depth: number
  }[]
  if(data.data.content) {
    const tree: StockTree = data.data.content
    const content = tree.map((item)=>{
      const data = item.data
      return data
    })
    stockDisplayTree.findNodeByPath(['stockTree'])!.forceSetValue(content)
    const preOrderWalk = stockDisplayTree.findNodeByPath(['stockTree'])!.children!
    let parent: VarNode | null = null
    let parentDepth = -1
    const depthArray = tree.map((item)=>item.depth)
    for (let i = 0; i < preOrderWalk.length; i++) {
      const node = preOrderWalk[i];
      const depth = depthArray[i]
      node.config.data = {
        ...(node.config.data??{}),
        collapse: true,
        tree: {
          depth: depth
        }
      }
      // node.config.data.tree.chilren = []
      // let times = 0
      // while(parent && (depth - parentDepth == 1) && times++ < preOrderWalk.length) {
      //   parent = (parent as VarNode)?.config.data.tree.parent ?? null
      //   parentDepth = parent?.config.data.tree.depth ?? -1
      // }
      // node.config.data.tree.parent = parent ?? null
      // if(parent) {
      //   (parent.config.data.tree.chilren as VarNode[]).push(node)
      // }
    }
    // if(appContentRef.value) {
    //   appContentRef.value?.forceUpdate()
    // } else {
    //   stockDetailTree.forceUpdate()
    // }
    updateStockTreeDisplay()
  }
}

function handleDetailButtonClick(_node:VarNode, index: number) {
  const node = stockDisplayTree.findNodeByPath(['stockTree'])!.children![index]
  node.config.data.collapse = !node.config.data.collapse
  updateStockTreeDisplay()
}

function updateStockTreeDisplay() {
  const preOrderWalk = stockDisplayTree.findNodeByPath(['stockTree'])!.children!
  preOrderWalk.forEach(item => {
    item.config.hideSelf=false
  });
  let currentDepth = 0
  let next = 0
  for (let i = 0; i < preOrderWalk.length-1; i++) {
    if(next > i) continue
    const item = preOrderWalk[i];
    if(item.config.data.collapse) {
      currentDepth = preOrderWalk.length+1
      next = i+1
      let childNode = preOrderWalk[next]
      while(childNode.config.data.tree.depth>item.config.data.tree.depth) {
        childNode.config.hideSelf = true
        if(++next>=preOrderWalk.length) break
        childNode = preOrderWalk[next]
      }
    }
  }
  // console.log(`collapse/display: ${preOrderWalk.map((item)=>{return `\n${item.config.data.collapse}; ${!item.config.hideSelf}`})}`)
  appContentRef.value?.forceUpdate()
}

const showDetailModalFlag = ref(false)
const showDetailModal = () => {
  if(stockStages.value.length == 0) {
    return
  }
  const listNode = stockDisplayTree.findNodeByPath(['stockTree'])!
  const selected = listNode.getSelectedChildren()
  if(selected.length == 0) {
    return
  }
  const targetNode = selected[0]
  const stockDetail = targetNode.children.filter((node,index)=>node.name!='level').map((node)=>{
    return {
      stage: node.getNameDisplay(),
      value: node.getValue()
    }
  })
  stockDetailTree.findNodeByPath(['stockByStages'])!.forceSetValue(stockDetail)
  showDetailModalFlag.value = true
}
const hideDetailModal = () => {showDetailModalFlag.value = false}

/**
 * @description 维护stock的阶段表，由后端定义，在onMounted阶段初始化，是stockTree的列名
 */
const stockStages = ref([] as string[])
/**
 * @description 更新stockTree的结构
 */
function updateStockTreeTemplate(stages: string[]) {
  const listNode = stockDisplayTree.findNodeByPath(['stockTree'])!
  const childTemplate = listNode.config.childTemplate!
  const children = childTemplate.children!
  if(children.length == 0) return
  const node = children[0]
  const stageColNodes = stages.map((stageName,index) => {
    return cns('string','leaf',`stage${index}`,"",true,{},[],stageName)
  })
  childTemplate.children = [node,...stageColNodes] 
  listNode.forceSetValue([]) // force: trigger rowProvided update
  stockDisplayTree.forceUpdate()
}
watch(stockStages, (newStages) => {
  updateStockTreeTemplate(newStages)
})
/**
 * @description 维护stock的层级表，由后端定义，在onMounted阶段初始化
 * @description 可用于生成stockTree第一列的列名
 */
const stockLevels = ref([] as string[])
/**
 * @description stockTree第一列的列名
 */
const stockLevelString = computed(() => {
  return stockLevels.value.join('/')
})
/**
 * @description 更新stockTree第一列的列名
 */
function updateStockLevelColNameDisplay(name: string) {
  const childTemplate = stockDisplayTree.findNodeByPath(['stockTree'])!.config.childTemplate!
  const children = childTemplate.children!
  if(children.length == 0) return
  const node = children[0]
  node.nameDisplay = name
  stockDisplayTree.forceUpdate()
}
watch(stockLevelString, (newValue) => {
  updateStockLevelColNameDisplay(newValue)
})
</script>
<style scoped>
.searchButtonContainer {
  display: flex;
  width: 100%;
  justify-content: end;
}
.detailBox {
  position: fixed;
  width: 50%;
  height: 50%;
  left: 50%;
  top: 0;
  transform: translate(-50%,20%);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);
  background-color: var(--theme-color-page);
  z-index: 60;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
}
.detailBox > .header {
  display: flex;
  width: 100%;
  height: 10%;
  background-color: var(--theme-color-dark);
  color: var(--theme-color-page);
  padding: 1% 2%;
}
.detailBox > .box {
  width: 100%;
  padding: 0 2%;
}
.detailBox > .spacer {
  flex: 1;
}
.detailBox > .footer {
  height: 10%;
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1% 2%;
  justify-content: end;
}
.grayBgLayer {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 50;
}
.level-text-container {
  display: flex;
  justify-content: start;
  width: 100%;
}
.details-button {
  width: 100%;
}
</style>