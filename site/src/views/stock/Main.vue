<template>
  <AppContent
    :stages="['display']"
    :footer-config="[
      {nextText:'/hide'}
    ]"
  >
    <template #[`stage-display`]>
      <VarBox
        :tree="materialInfoTree"
      >
      </VarBox>
      <VarBox
        :tree="stockDisplayTree"
      >
      </VarBox>
      <div v-if="showDetailModalFlag" class="detailModalContainer">
        <VarBox
          :tree="stockDisplayTree"
        >
        </VarBox>
      </div>
    </template>
  </AppContent>
</template>
<script lang="ts" setup>
import { createTreeFromConfig, cns } from '@/utils/VarTree';
import { computed, onMounted, ref, watch } from 'vue';
import VarBox from '@/components/varbox/VarBox.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'

onMounted(async ()=>{
  await initializeTrees()
})

/**
 * @description 向后端获取stock的合法阶段，给stockStages和stockLevelString赋值
 */
async function initializeTrees() {
  
}

/** @description 搜索并展示material基本信息 */
const materialInfoTree = createTreeFromConfig(cns("dict","dict","materialInfo",null,false,{hideLabel:true},[
  cns("string","leaf","id","",false,{},[],"Material ID: ")
]))
/** @description 展示material库存信息 */
const stockDisplayTree = createTreeFromConfig(cns("dict","dict","stock",null,false,{hideLabel:true},[
  cns('dynamiclist','list','stockTree',[],true,{
    childTemplate: cns('dict','dict','row',null,false,{},[
      cns('string','leaf','level','',false,{},[],''), //动态获取nameDisplay
      // 后端动态添加各个stage
    ]),
    rowProvided: 0
  },[],"Stock Detail")
]))
/** @description 库存详细信息 */
const stockDetailTree = createTreeFromConfig(cns("dict","dict","stockDetail",null,false,{hideLabel:true},[
  cns('dynamiclist','list','stockByStages',[],true,{
    childTemplate: cns('dict','dict','row',null,false,{},[
      cns('string','leaf','stage','',false,{},[],'Stage'),
      cns('string','leaf','value','',false,{},[],'Stock'),
    ]),
    rowProvided: 0
  },[],"Stock Detail")
]))

const showDetailModalFlag = ref(false)
const showDetailModal = () => {showDetailModalFlag.value = true}
const hideDetailModal = () => {showDetailModalFlag.value = false}

/**
 * @description 维护stock的阶段表，由后端定义，在onMounted阶段初始化，是stockTree的列名
 */
const stockStages = ref([] as string[])
/**
 * @description 更新stockTree的结构
 */
function updateStockTreeTemplate(stages: string[]) {
  const childTemplate = stockDisplayTree.findNodeByPath(['stockTree'])!.config.childTemplate!
  const children = childTemplate.children!
  if(children.length == 0) return
  const node = children[0]
  const stageColNodes = stages.map((stageName,index) => {
    return cns('string','leaf',`stage${index}`,"",true,{},[],stageName)
  })
  childTemplate.children = [node,...stageColNodes] 
  stockDetailTree.forceUpdate()
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
  stockDetailTree.forceUpdate()
}
watch(stockLevelString, (newValue) => {
  updateStockLevelColNameDisplay(newValue)
})
</script>