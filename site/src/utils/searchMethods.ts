import { VarTree,SearchMethod, SearchResultHandler, createTreeFromConfig, cns } from '@/utils/VarTree'

const bpParamSearchStructure = cns('dict', 'dict', 'params', null, false, {}, [
  cns('string', 'leaf', 'customer_id', '', false),
  cns('string','leaf',"search_term",'001',false)
]);
const bpParamSearchTree = createTreeFromConfig(bpParamSearchStructure);

export const bpSearch: SearchMethod[] = [
  {
    name: '业务伙伴搜索',
    paramTree: bpParamSearchTree,
    serviceUrl: '/api/search/business-partner'
  }
]

export const relationSearch: SearchMethod[] = [
  {
    name: '关系搜索',
    paramTree: null,
    serviceUrl: '/api/search/relation'
  }
]

export const inquiryTypeSearch: SearchMethod[] = [
  {
    name: '询价类型搜索',
    paramTree: null,
    serviceUrl: '/api/search/inquiry-type'
  }
]

export const salesOrgSearch: SearchMethod[] = [
  {
    name: '销售组织搜索',
    paramTree: null,
    serviceUrl: '/api/search/sales-org'
  }
]

export const distributionChannelSearch: SearchMethod[] = [
  {
    name: '分销渠道搜索',
    paramTree: null,
    serviceUrl: '/api/search/distribution-channel'
  }
]

export const divisionSearch: SearchMethod[] = [
  {
    name: '部门搜索',
    paramTree: null,
    serviceUrl: '/api/search/division'
  }
]

export const inquiryIdSearch: SearchMethod[] = [
  {
    name: '询价单搜索',
    paramTree: null,
    serviceUrl: '/api/search/inquiry-id'
  }
]
