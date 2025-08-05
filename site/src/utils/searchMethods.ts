import { VarTree,SearchMethod, SearchResultHandler, createTreeFromConfig, cns } from '@/utils/VarTree'

const generalParamSearchStructure = cns('dict','dict','Search',null,false,{hideLabel:true},[
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

const generalParamSearchTree = createTreeFromConfig(generalParamSearchStructure);

type generalSearchType = 
| 'plantName' //原数据库关系没有
| 'materialDescription' 
| 'material'
export const generalSearch = (type: generalSearchType) => {
  return [
    {
      name: '通用搜索',
      paramTree: generalParamSearchTree,
      serviceUrl: `/api/search/general/${type}`,
    }
  ];
};

const countryParamSearchStructure = cns('dict','dict','Search',null,false,{hideLabel:true},[
  cns('dict','dict','Country Name Search',null,false,{},[
    cns('string','leaf','country name',null,false,{},[]),
  ]),
]);

const countryParamSearchTree = createTreeFromConfig(countryParamSearchStructure);

export const countrySearch:SearchMethod[] = [
  {
    name: '国家搜索',
    paramTree: countryParamSearchTree,
    serviceUrl: '/api/search/country',
  }
]

//下面这个结构写的太宽了，已经弄到general search里面了@Pezy
const customerIdParamSearchStructure = cns('dict','dict','Search',null,false,{hideLabel:true},[
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

const customerIdParamSearchTree = createTreeFromConfig(customerIdParamSearchStructure);

export const customerSearch:SearchMethod[] = [
  {
    name: '顾客搜索',
    paramTree: customerIdParamSearchTree,
    serviceUrl: '/api/search/customer'
  }
]

const bpParamSearchStructure = cns('dict', 'dict', 'Search', null, false, {hideLabel:true}, [
  cns('dict','dict','Condition Search',null,false,{},[
    cns('string','leaf','Customer',null,false,{searchMethods:customerSearch},[]),
    cns('string','leaf','City',null,false,{},[]),
    cns('string','leaf','Name',null,false,{},[]),
    cns('string','leaf','Country Key',null,false,{searchMethods:countrySearch},[]),
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

const quotationIdParamSearchStructure = cns('dict','dict','Search',null,false,{hideLabel:true},[
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

export const GLAccountSearch: SearchMethod[] = [
  {
    name: 'G/L Account search',
    paramTree: null,
    serviceUrl: '/api/search/gl-account',
  }
]

export const CurrencyUnitSearch: SearchMethod[] = [
  {
    name: 'Currency Unit search',
    paramTree: null,
    serviceUrl: '/api/search/currency-unit',
  }
]

/**
 * @description 后端直接返回可用的bp关系
 * @vakesamahere
 */
export const relationSearch: SearchMethod[] = [
  {
    name: '关系搜索',
    paramTree: null,
    serviceUrl: '/api/search/relation',
    resultHeaderDisplay: {
      result: 'Relation',
      direction: 'Direction',
      desription: 'Description',
    }
  }
]

/**
 * @description 后端直接返回可用的inquiry类型
 * @vakesamahere
 */
export const inquiryTypeSearch: SearchMethod[] = [
  {
    name: '询价类型搜索',
    paramTree: null,
    serviceUrl: '/api/search/inquiry-type',
    resultHeaderDisplay:{
      result: 'SaTy',
      description: 'Description'
    }
  }
]

/**
 * @description 后端直接返回可用的销售组织
 * @vakesamahere
 */
export const salesOrgSearch: SearchMethod[] = [
  {
    name: '销售组织搜索',
    paramTree: null,
    serviceUrl: '/api/search/sales-org',
    resultHeaderDisplay: {
      result: 'SOrg.',
      description: 'Name',
    }
  }
]

/**
 * @description 后端直接返回可用的渠道
 * @vakesamahere
 */
export const distributionChannelSearch: SearchMethod[] = [
  {
    name: '分销渠道搜索',
    paramTree: null,
    serviceUrl: '/api/search/distribution-channel',
    resultHeaderDisplay: {
      result: 'SOrg.',
      dchl: 'DChl',
      description: 'Name',
    }
  }
]

/**
 * @description 后端直接返回可用的部门
 * @vakesamahere
 */
export const divisionSearch: SearchMethod[] = [
  {
    name: '部门搜索',
    paramTree: null,
    serviceUrl: '/api/search/division',
    resultHeaderDisplay: {
      result: 'SOrg.',
      dchl: 'DChl',
      dv: 'Dv',
      description: 'Name',
    }
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

const materialSearchStructure  = cns('dict', 'dict', 'Search', null, false, {hideLabel:true}, [
  cns('string', 'leaf', 'material', '', false,{searchMethods: generalSearch('material')},[],'Material'),
  cns('string','leaf','materialDescription','',false,{searchMethods: generalSearch('materialDescription')},[],'Material Description'),
]);

const materialSearchTree = createTreeFromConfig(materialSearchStructure);

export const materialSearch: SearchMethod[] = [
  {
    name: '物料搜索',
    paramTree: materialSearchTree,
    serviceUrl: '/api/search/material'
  }
]

export const materialDocumentSearch: SearchMethod[] = [
  {
    name: '物料文档搜索',
    paramTree: generalParamSearchTree,
    serviceUrl: '/api/search/material-description'
  }
]

const plantSearchStructure  = cns('dict', 'dict', 'Search', null, false, {hideLabel:true}, [
  cns('string', 'leaf', 'plantName', '', false,{searchMethods: generalSearch('plantName')},[],'Plant Name'),
]);

const plantSearchTree = createTreeFromConfig(plantSearchStructure);

export const plantSearch: SearchMethod[] = [
  {
    name: '工厂搜索',
    paramTree: plantSearchTree,
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

export const billingDocumentIdSearch: SearchMethod[] = [
  {
    name: '开票凭证搜索',
    paramTree: null,
    serviceUrl: '/api/search/billing-document-id',
    resultHeaderDisplay: {
      'result': '开票凭证号',
      'soldToParty': '售达方',
      'netValue': '净值',
      'currency': '货币'
    }
  }
]

export const soldToPartySearch: SearchMethod[] = [
  {
    name: '售达方搜索',
    paramTree: null,
    serviceUrl: '/api/search/sold-to-party',
    resultHeaderDisplay: {
      'result': '售达方',
      'city': '城市',
      'country': '国家'
    }
  }
]

const soParamSearchStructure  = cns('dict', 'dict', 'Search', null, false, {hideLabel: true}, [
  cns('string', 'leaf', 'quotation_id', '', false,{searchMethods:quotationIdSearch}),
  cns('string','leaf','soldToParty','',false,{searchMethods: soldToPartySearch}),
  cns('string','leaf','shipToParty','',false,{searchMethods:soldToPartySearch}),
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

export const billToPartySearch: SearchMethod[] = [
  {
    name: '开票方搜索',
    paramTree: null,
    serviceUrl: '/api/search/bill-to-party',
    resultHeaderDisplay: {
      'result': '开票方',
      'city': '城市',
      'country': '国家'
    }
  }
]

export const payerPartySearch: SearchMethod[] = [
  {
    name: '付款方搜索',
    paramTree: null,
    serviceUrl: '/api/search/payer-party',
    resultHeaderDisplay: {
      'result': '付款方',
      'city': '城市',
      'country': '国家'
    }
  }
]
