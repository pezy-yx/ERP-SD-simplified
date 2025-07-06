<script lang="ts" setup>
import VarBox from '@/components/varbox/VarBox.vue';
import {createTreeFromConfig, cns, VarTree} from '@/utils/VarTree';

const initialScreenTree = createTreeFromConfig(
  // root
  cns('dict','dict','createBpInput',{},false,{hideLabel:true},[
    // relation
    cns('dict','dict','relation',{},false,{hideLabel:true},[
      cns('string','leaf','relationShipCategory','',false,{},[],"Relationship Category:")
    ]),
    // default
    cns('dict','dict','default',{},false,{},[
      cns('string','leaf','businessPartner1','',false,{},[],"Business Partner 1:"),
      cns('string','leaf','businessPartner2','',false,{},[],"Business Partner 2:"),
      cns('date','leaf','validFrom','',false,{},[],"Valid From:"),
      cns('date','leaf','validTo','',true,{},[],"Valid To:"),
    ],'Default')
  ],"")
)

/**
 * @description 检查数据是否输入完毕且合法
 * @description 显示错误信息/进入General Data
 */
function handleInitialScreenExecute() {
  console.log(initialScreenTree.root?.currentValue)
}

</script>

<template>
  <div class="layout">
    <div class="page-content">
      <VarBox
        :tree="initialScreenTree"
      >
      </VarBox>
    </div>
    <div class="bottom-bar">
      <div class="bottom-bar-spacer"></div>
      <button
        class="execute-button"
        :onclick="handleInitialScreenExecute"
      >
        Execute
      </button>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>