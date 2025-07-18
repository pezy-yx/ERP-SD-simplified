import { VarTree,SearchMethod, SearchResultHandler, createTreeFromConfig, cns } from '@/utils/VarTree'

const customerIdParamSearchStructure = cns('dict','dict','Search',null,false,{},[
  cns('dict','dict','include',null,false,{},[
    cns('number','leaf','contains',null,false,{},[]),
    cns('number','leaf','equal to',null,false,{},[]),
    cns('number','leaf','starts with',null,false,{},[]),
    cns('number','leaf','ends with',null,false,{},[]),
    cns('number','leaf','less than',null,false,{},[]),
    cns('number','leaf','greater than',null,false,{},[]),
  ]),
  cns('dict','dict','exclude',null,false,{},[
    cns('number','leaf','contains',null,false,{},[]),
    cns('number','leaf','equal to',null,false,{},[]),
    cns('number','leaf','starts with',null,false,{},[]),
    cns('number','leaf','ends with',null,false,{},[]),
    cns('number','leaf','less than',null,false,{},[]),
    cns('number','leaf','greater than',null,false,{},[]),
  ]),
])
const customerIdParamSearchTree = createTreeFromConfig(customerIdParamSearchStructure);

export const customerSearch:SearchMethod[] = [
  {
    name: '顾客搜索',
    paramTree: customerIdParamSearchTree,
    serviceUrl: '/api/search/customer'
  }
]

const bpParamSearchStructure = cns('dict', 'dict', 'params', null, false, {}, [
  cns('dict','dict','Condition Search',null,false,{},[
    cns('string','leaf','Customer',null,false,{searchMethods:customerSearch},[]),
    cns('string','leaf','City',null,false,{},[]),
    cns('string','leaf','Name',null,false,{},[]),
    cns('string','leaf','Country Key',null,false,{},[]),
    cns('string','leaf','Postal Code',null,false,{},[]),
  ],),
  cns('dict','dict','ID Search',null,false,{},[
    cns('dict','dict','include',null,false,{},[
    cns('number','leaf','contains',null,false,{},[]),
    cns('number','leaf','equal to',null,false,{},[]),
    cns('number','leaf','starts with',null,false,{},[]),
    cns('number','leaf','ends with',null,false,{},[]),
    cns('number','leaf','less than',null,false,{},[]),
    cns('number','leaf','greater than',null,false,{},[]),
    ]),
    cns('dict','dict','exclude',null,false,{},[
      cns('number','leaf','contains',null,false,{},[]),
      cns('number','leaf','equal to',null,false,{},[]),
      cns('number','leaf','starts with',null,false,{},[]),
      cns('number','leaf','ends with',null,false,{},[]),
      cns('number','leaf','less than',null,false,{},[]),
      cns('number','leaf','greater than',null,false,{},[]),
    ]),
  ])
],"");
const bpParamSearchTree = createTreeFromConfig(bpParamSearchStructure);

const quotationIdParamSearchStructure = cns('dict','dict','Search',null,false,{},[
  cns('dict','dict','include',null,false,{},[
    cns('number','leaf','contains',null,false,{},[]),
    cns('number','leaf','equal to',null,false,{},[]),
    cns('number','leaf','starts with',null,false,{},[]),
    cns('number','leaf','ends with',null,false,{},[]),
    cns('number','leaf','less than',null,false,{},[]),
    cns('number','leaf','greater than',null,false,{},[]),
  ]),
  cns('dict','dict','exclude',null,false,{},[
    cns('number','leaf','contains',null,false,{},[]),
    cns('number','leaf','equal to',null,false,{},[]),
    cns('number','leaf','starts with',null,false,{},[]),
    cns('number','leaf','ends with',null,false,{},[]),
    cns('number','leaf','less than',null,false,{},[]),
    cns('number','leaf','greater than',null,false,{},[]),
  ]),
]);
const quotationIdParamSearchTree = createTreeFromConfig(quotationIdParamSearchStructure);


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

export const deliveryIdSearch: SearchMethod[] = [
  {
    name: '交货单搜索',
    paramTree: null,
    serviceUrl: '/api/search/delivery-id'
  }
]

export const materialSearch: SearchMethod[] = [
  {
    name: '物料搜索',
    paramTree: null,
    serviceUrl: '/api/search/material'
  }
]

export const plantSearch: SearchMethod[] = [
  {
    name: '工厂搜索',
    paramTree: null,
    serviceUrl: '/api/search/plant'
  }
]

export const storageLocationSearch: SearchMethod[] = [
  {
    name: '存储位置搜索',
    paramTree: null,
    serviceUrl: '/api/search/storage-location'
  }
]

export const quotationIdSearch: SearchMethod[] = [
  {
    name: '报价单搜索',
    paramTree: quotationIdParamSearchTree,
    serviceUrl: '/api/search/quotation-id'
  }
]

const soParamSearchStructure  = cns('dict', 'dict', 'params', null, false, {}, [
  cns('string', 'leaf', 'quotation_id', '', false,{searchMethods:quotationIdSearch}),
  cns('string','leaf','soldToParty','',false,{searchMethods: bpSearch}),
  cns('string','leaf','soldToParty','',false,{searchMethods:bpSearch}),
  cns('string','leaf',"search_term",'',false),
]);
const soParamSearchTree = createTreeFromConfig(soParamSearchStructure);

export const salesOrderIdSearch: SearchMethod[] = [
  {
    name: '销售订单搜索',
    paramTree: soParamSearchTree,
    serviceUrl: '/api/search/salesOrder-id'
  }
]