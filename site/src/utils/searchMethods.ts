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

/**
 * @description 后端返回可用的存储位置
 * @vakesamahere
 */
export const storageLocationSearch: SearchMethod[] = [
  {
    name: '存储位置搜索',
    paramTree: null,
    serviceUrl: '/api/search/storage-location',
    resultHeaderDisplay: {
      result: "Location",
      description: "Description"
    }
  }
]

/**
 * @description diliveryId搜索
 * @vakesamahere
 */

export const deliveryIdSearch: SearchMethod[] = [
  {
    name: 'delivery-id搜索',
    paramTree: createTreeFromConfig(cns('dict','dict','searchInput',{},false,{hideLabel:true},[
      cns('selection','leaf','state','All',false,{options:['All','GI Not Posted','GI Posted']},[],'Outbound Delivery: '),
      cns('string','leaf','shippingPoint','',false,{searchMethods:storageLocationSearch},[],'Shipping Point: '),
      cns('string','leaf','shipToParty','',false,{searchMethods:customerSearch},[],'Ship to Party: '),
      cns('date','leaf','pickingDate','',false,{},[],'Picking Date: '),
      cns('date','leaf','loadingDate','',false,{},[],'Loading Date: '),
      cns('date','leaf','plannedGIDate','',false,{},[],'Planned GI Date: '),
      cns('date','leaf','deliveryDate','',false,{},[],'Delivery Date: '),
      cns('dynamiclist','list','containPickingStatus',[
        {status:'Not Relevant'},
        {status:'Not Yet Processed'},
        {status:'Partially Processed'},
        {status:'Completely Processed'},
      ],false,{
        rowProvided:4,
        childTemplate: cns('dict','dict','row',{},false,{},[
          cns('selection','leaf','status','',false,{options:['Not Relevant','Not Yet Processed','Partially Processed','Completely Processed']},)
        ])
      },[],'Picking Status: '),
    ])),
    serviceUrl: '/api/search/delivery-id',
    resultHeaderDisplay: {
      result: 'ID',
      description: 'Description',
      shippingPoint: 'Shipping Point',
      shipToParty: 'Ship-To Party',
      pickingDate: 'Picking Date',
      loadingDate: 'Loading Date',
      plannedGIDate: 'Planned GI Date',
      deliveryDate: 'Delivery Date',
      pickingStatus: 'Picking Status Name',
    }
  }
]

/**
 * @description billdocId搜索
 * @vakesamahere
 */
export const billingDocumentIdSearch: SearchMethod[] = [
  {
    name: '开票凭证搜索',
    paramTree: createTreeFromConfig(cns('dict','dict','searchInput',{},false,{hideLabel:true},[
      cns('string','leaf','soldToParty','',false,{searchMethods:customerSearch},[],'Sold-To Party: '),
      cns('date','leaf','billingDate','',false,{},[],'Billing Date: '),     
    ])),
    serviceUrl: '/api/search/billing-document-id',
    resultHeaderDisplay: {
      result: 'ID',
      soldToParty: 'Sold-To Party: ',
      netValue: 'Net Value',
      billingDate:'Billing Date',
      currency: 'Currency'
    }
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

export const quotationIdSearch: SearchMethod[] = [
  {
    name: '报价单搜索',
    paramTree: quotationIdParamSearchTree,
    serviceUrl: '/api/search/quotation-id'
  }
]

/**
 * @description inquiry-id
 * @vakesamahere
 */
export const inquiryIdSearch: SearchMethod[] = [
  {
    name: '询价单搜索',
    paramTree: createTreeFromConfig(cns('dict','dict','searchInput',{},false,{hideLabel:true},[
      cns('string','leaf','purchaseOrderNumber','',false,{searchMethods:customerSearch},[],'Purchase Order No.: '),
      cns('string','leaf','soldToParty','',false,{searchMethods:customerSearch},[],'Sold-To Party: '),
      cns('string','leaf','shipToParty','',false,{searchMethods:customerSearch},[],'Ship-To Party: '),
      cns('string','leaf','customerRef','',false,{},[],'Cust. Reference: '),
      cns('date','leaf','customerRefDate','',false,{},[],'Cust. Ref. Date: '),
      cns('dynamiclist','list','containMaterials','',false,{
        childTemplate: cns('dict','dict','row',null,false,{},[
          cns('string','leaf','id','',false,{searchMethods:materialSearch},[],'ID')
        ])
      },[],'Materials: '),
    ])),
    serviceUrl: '/api/search/inquiry-id',
    resultHeaderDisplay: {
      result: 'Inquiry ID',
      purchaseOrderNumber: 'Purchase Order Number',
      soldToParty: 'Sold-To Party',
      shipToParty: 'Ship-To Party',
      customerRef: 'Customer Reference',
      customerRefDate: 'Customer Reference Date'
    }
  }
]

/**
 * @description realtion-id
 * @vakesamahere
 */
export const relationIdSearch: SearchMethod[] = [
  {
    name: 'Relation Search',
    paramTree: createTreeFromConfig(cns('dict','dict','searchInput',{},false,{hideLabel:true},[
      cns('string','leaf','BP1','',false,{searchMethods:customerSearch},[],'Sold-To Party: '),
      cns('string','leaf','BP2','',false,{searchMethods:customerSearch},[],'Ship-To Party: '),
      cns('string','leaf','validFrom','',false,{},[],'Valid From: '),
      cns('date','leaf','validTo','',false,{},[],'Valid To: '),
      cns('dynamiclist','list','containCategory','',false,{
        childTemplate: cns('dict','dict','row',null,false,{},[
          cns('string','leaf','relation','',false,{searchMethods:relationSearch},[],'Relation Category')
        ])
      },[],'Relation Category: '),
    ])),
    serviceUrl: '/api/search/relation-id',
    resultHeaderDisplay: {
      result: 'Relation ID',
      BP1: 'Sold-To Party',
      BP2: 'Ship-To Party',
      validFrom: 'Valid From',
      validTo: 'Valid To',
      relation: 'Relation Category'
    }
  }
]

/**
 * @description material-unit，直接返回
 * @vakesamahere
 */
export const materialUnitSearch: SearchMethod[] = [
  {
    name: '统计单位搜索',
    paramTree: null,
    serviceUrl: '/api/search/material-unit',
    resultHeaderDisplay: {
      result: 'Unit Name',
      description: 'Description',
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
