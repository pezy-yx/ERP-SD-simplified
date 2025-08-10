<script lang="ts" setup>
import { ref } from 'vue'
import VarBox from '@/components/varbox/VarBox.vue'
import AppContent from '@/components/applicationContent/AppContent.vue'
import ItemConditionDetail from '@/components/itemCondition/ItemConditionDetail.vue'
import { createTreeFromConfig, createNodeFromConfig, cns, VarNode } from '@/utils/VarTree'
import { createItemConditionKit, type ItemConditionKit } from '@/utils/ItemConditionKit'
import {
  generalSearch,
  companyCodeSearch,
  countrySearch,
  customerSearch,
  bpSearch,
  GLAccountSearch,
  CurrencyUnitSearch,
  relationSearch,
  inquiryTypeSearch,
  salesOrgSearch,
  distributionChannelSearch,
  divisionSearch,
  inquiryIdSearch,
  deliveryIdSearch,
  materialSearch,
  materialDocumentSearch,
  plantSearch,
  storageLocationSearch,
  quotationIdSearch,
  billingDocumentIdSearch,
  soldToPartySearch,
  salesOrderIdSearch,
  relationIdSearch,
  materialUnitSearch
} from '@/utils/searchMethods'

const appContentRef = ref(null) as any

// 创建基础数据树
const searchMethodsTestTree = createTreeFromConfig(
  cns('dict','dict','methods',{},false,{hideLabel:true},[
    cns('string','leaf','| generalSearch | `/api/search/general/plantName` | 根据不同业务对象类型进行通用搜索 |',null,false,{searchMethods:generalSearch('plantName')}),
    cns('string','leaf','| generalSearch | `/api/search/general/materialDescription` | 根据不同业务对象类型进行通用搜索 |',null,false,{searchMethods:generalSearch('materialDescription')}),
    cns('string','leaf','| generalSearch | `/api/search/general/material` | 根据不同业务对象类型进行通用搜索 |',null,false,{searchMethods:generalSearch('material')}),
    cns('string','leaf','| generalSearch | `/api/search/general/countryKey` | 根据不同业务对象类型进行通用搜索 |',null,false,{searchMethods:generalSearch('countryKey')}),
    cns('string','leaf','| companyCodeSearch | `/api/search/company-code` | 搜索公司代码信息 |',null,false,{searchMethods:companyCodeSearch}),
    cns('string','leaf','| countrySearch | `/api/search/country` | 搜索国家信息 |',null,false,{searchMethods:countrySearch}),
    cns('string','leaf','| customerSearch | `/api/search/customer` | 搜索客户信息 |',null,false,{searchMethods:customerSearch}),
    cns('string','leaf','| bpSearch | `/api/search/business-partner` | 搜索业务伙伴信息 |',null,false,{searchMethods:bpSearch}),
    cns('string','leaf','| GLAccountSearch | `/api/search/gl-account` | 搜索总账科目信息 |',null,false,{searchMethods:GLAccountSearch}),
    cns('string','leaf','| CurrencyUnitSearch | `/api/search/currency-unit` | 搜索货币单位信息 |',null,false,{searchMethods:CurrencyUnitSearch}),
    cns('string','leaf','| relationSearch | `/api/search/relation` | 搜索业务伙伴关系类型 |',null,false,{searchMethods:relationSearch}),
    cns('string','leaf','| inquiryTypeSearch | `/api/search/inquiry-type` | 搜索询价类型信息 |',null,false,{searchMethods:inquiryTypeSearch}),
    cns('string','leaf','| salesOrgSearch | `/api/search/sales-org` | 搜索销售组织信息 |',null,false,{searchMethods:salesOrgSearch}),
    cns('string','leaf','| distributionChannelSearch | `/api/search/distribution-channel` | 搜索分销渠道信息 |',null,false,{searchMethods:distributionChannelSearch}),
    cns('string','leaf','| divisionSearch | `/api/search/division` | 搜索部门信息 |',null,false,{searchMethods:divisionSearch}),
    cns('string','leaf','| inquiryIdSearch | `/api/search/inquiry-id` | 搜索询价单ID |',null,false,{searchMethods:inquiryIdSearch}),
    cns('string','leaf','| deliveryIdSearch | `/api/search/delivery-id` | 搜索交货单ID |',null,false,{searchMethods:deliveryIdSearch}),
    cns('string','leaf','| materialSearch | `/api/search/material` | 搜索物料信息 |',null,false,{searchMethods:materialSearch}),
    cns('string','leaf','| materialDocumentSearch | `/api/search/material-description` | 搜索物料文档信息 |',null,false,{searchMethods:materialDocumentSearch}),
    cns('string','leaf','| plantSearch | `/api/search/plant` | 搜索工厂信息 |',null,false,{searchMethods:plantSearch}),
    cns('string','leaf','| storageLocationSearch | `/api/search/storage-location` | 搜索存储位置信息 |',null,false,{searchMethods:storageLocationSearch}),
    cns('string','leaf','| quotationIdSearch | `/api/search/quotation-id` | 搜索报价单ID |',null,false,{searchMethods:quotationIdSearch}),
    cns('string','leaf','| billingDocumentIdSearch | `/api/search/billing-document-id` | 搜索开票凭证信息 |',null,false,{searchMethods:billingDocumentIdSearch}),
    cns('string','leaf','| soldToPartySearch | `/api/search/sold-to-party` | 搜索售达方信息 |',null,false,{searchMethods:soldToPartySearch}),
    cns('string','leaf','| salesOrderIdSearch | `/api/search/salesOrder-id` | 搜索销售订单信息 |',null,false,{searchMethods:salesOrderIdSearch}),
    cns('string','leaf','| relationIdSearch | `/api/search/relation-id` | 搜索关系ID |',null,false,{searchMethods:relationIdSearch}),
    cns('string','leaf','| materialUnitSearch | `/api/search/material-unit` | 搜索物料单位信息 |',null,false,{searchMethods:materialUnitSearch}),
  ])
)

</script>

<template>
  <AppContent
    :stages="['test']"
    :footer-config="[
      { prevText: '/hide', nextText: '/hide' },
    ]"
    ref="appContentRef"
  >
    <!-- Items 列表阶段 -->
    <template #[`stage-test`]>
      <VarBox :tree="searchMethodsTestTree">
      </VarBox>
    </template>
  </AppContent>
</template>

<style scoped>
</style>
