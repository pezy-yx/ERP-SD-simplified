搜索服务接口文档
接口概述
该文档描述了前端应用中用于数据搜索的后端接口。这些接口为用户在各种表单字段中输入数据时提供搜索、校验和自动填充功能，支持多种业务对象（如公司代码、物料、客户等）的查询。

接口列表
1. 通用搜索接口
接口地址： GET /api/search/general/${type}

type类型:
    | 'plantName'
    | 'materialDescription' 
    | 'material'
    | 'countryKey'

接口描述： 根据不同的业务对象类型（type）进行通用搜索。支持对数值类型字段的包含、等于、起始于、结束于、小于、大于等多种过滤条件进行搜索。

使用场景： 在物料、物料描述、工厂名称和国家码等字段中使用。

请求参数： 动态参数，基于 generalParamSearchStructure 定义的树形结构。

JSON

{
  "include": {
    "contains": "number",
    "equal to": "number",
    "starts with": "number",
    "ends with": "number",
    "less than": "number",
    "greater than": "number"
  },
  "exclude": {
    "contains": "number",
    "equal to": "number",
    "starts with": "number",
    "ends with": "number",
    "less than": "number",
    "greater than": "number"
  }
}
响应结果：

JSON

{
  "success": true,
  "data": [
    // 搜索结果列表，具体结构根据type动态变化
  ]
}
2. 公司代码搜索接口
接口地址： GET /api/search/company-code

接口描述： 根据公司代码、城市、公司名称或货币等条件搜索可用的公司代码。

使用场景： 在需要选择公司代码的字段中使用，例如 G/L Account 搜索。

请求参数： 动态参数，基于 companyCodeSearchStructure 定义的树形结构。

JSON

{
  "companyCode": "string",
  "city": "string",
  "companyName": "string",
  "currency": "string"
}
响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "companyCode": "string",
      "companyName": "string",
      "city": "string",
      "currency": "string"
    }
    // ...
  ]
}
3. 国家搜索接口
接口地址： GET /api/search/country

接口描述： 根据国家名称搜索可用的国家。

使用场景： 在需要选择国家的字段中使用。

请求参数： 动态参数，基于 countryParamSearchStructure 定义的树形结构。

JSON

{
  "Country Name Search": {
    "country name": "string"
  }
}
响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "country": "string"
    }
    // ...
  ]
}
4. 客户搜索接口
接口地址： GET /api/search/customer

接口描述： 根据客户编号、邮政编码、公司代码、城市、搜索词或客户名称搜索客户。

使用场景： 在需要选择客户的字段中使用，例如业务伙伴搜索。

请求参数： 动态参数，基于 customerSearchStructure 定义的树形结构。

JSON

{
  "customer": "string",
  "postalCode": "string",
  "companyCode": "string",
  "city": "string",
  "searchTerm": "string",
  "customerName": "string"
}
响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "customerId": "string",
      "name": "string"
    }
    // ...
  ]
}
5. 业务伙伴搜索接口
接口地址： GET /api/search/business-partner

接口描述： 根据客户、城市、名称、国家码、邮政编码或业务伙伴 ID 搜索业务伙伴。

使用场景： 在需要选择业务伙伴的字段中使用。

请求参数： 动态参数，基于 bpParamSearchStructure 定义的树形结构。

JSON

{
  "Condition Search": {
    "Customer": "string",
    "City": "string",
    "Name": "string",
    "Country Key": "string",
    "Postal Code": "string"
  },
  "ID Search": {
    "include": {
      "contains": "number",
      "equal to": "number",
      "starts with": "number",
      "ends with": "number",
      "less than": "number",
      "greater than": "number"
    },
    "exclude": {
      "contains": "number",
      "equal to": "number",
      "starts with": "number",
      "ends with": "number",
      "less than": "number",
      "greater than": "number"
    }
  }
}
响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "customerId": "string",
      "name": "string",
      "companyCode": "string"
    }
    // ...
  ]
}
6. G/L Account 搜索接口
接口地址： GET /api/search/gl-account

接口描述： 根据 G/L Account、科目表、短文本、公司代码或长文本搜索 G/L Account。

使用场景： 在需要选择 G/L Account 的字段中使用。

请求参数： 动态参数，基于 glAccountParamSearchStructure 定义的树形结构。

JSON

{
  "glAccount": "string",
  "chartOfAccounts": "string",
  "shortText": "string",
  "companyCode": "string",
  "longText": "string"
}
响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "glAccount": "string",
      "chartOfAccounts": "string",
      "shortText": "string",
      "companyCode": "string",
      "longText": "string"
    }
    // ...
  ]
}
7. 货币单位搜索接口 //缺请求参数
接口地址： GET /api/search/currency-unit

接口描述： 搜索可用的货币单位。

使用场景： 在需要选择货币单位的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    // 货币单位列表
  ]
}
8. 关系搜索接口 //缺请求参数
接口地址： GET /api/search/relation

接口描述： 搜索可用的业务伙伴关系类型。

使用场景： 在需要选择关系类型的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "Relation": "string",
      "Direction": "string",
      "Description": "string"
    }
    // ...
  ]
}
9. 询价类型搜索接口 //缺请求参数
接口地址： GET /api/search/inquiry-type

接口描述： 搜索可用的询价类型。

使用场景： 在需要选择询价类型的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "SaTy": "string",
      "Description": "string"
    }
    // ...
  ]
}
10. 销售组织搜索接口 //缺请求参数
接口地址： GET /api/search/sales-org

接口描述： 搜索可用的销售组织。

使用场景： 在需要选择销售组织的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "SOrg.": "string",
      "Name": "string"
    }
    // ...
  ]
}
11. 分销渠道搜索接口 //缺请求参数
接口地址： GET /api/search/distribution-channel

接口描述： 搜索可用的分销渠道。

使用场景： 在需要选择分销渠道的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "SOrg.": "string",
      "DChl": "string",
      "Name": "string"
    }
    // ...
  ]
}
12. 部门搜索接口 //缺请求参数
接口地址： GET /api/search/division

接口描述： 搜索可用的部门。

使用场景： 在需要选择部门的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "SOrg.": "string",
      "DChl": "string",
      "Dv": "string",
      "Name": "string"
    }
    // ...
  ]
}
13. 询价单搜索接口 //缺请求参数
接口地址： GET /api/search/inquiry-id

接口描述： 搜索可用的询价单 ID。

使用场景： 在需要选择询价单 ID 的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    // 询价单 ID 列表
  ]
}
14. 交货单搜索接口 //缺请求参数
接口地址： GET /api/search/delivery-id

接口描述： 搜索可用的交货单 ID。

使用场景： 在需要选择交货单 ID 的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    // 交货单 ID 列表
  ]
}
15. 物料搜索接口
接口地址： GET /api/search/material

接口描述： 根据物料和物料描述搜索可用的物料。

使用场景： 在需要选择物料的字段中使用。

请求参数： 动态参数，基于 materialSearchStructure 定义的树形结构。

JSON

{
  "material": "string",
  "materialDescription": "string"
}
响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "material": "string",
      "matDesc": "string"
    }
    // ...
  ]
}
16. 物料文档搜索接口
接口地址： GET /api/search/material-description

接口描述： 根据物料文档和物料文档年份搜索可用的物料文档。

使用场景： 在需要选择物料文档的字段中使用。

请求参数： 动态参数，基于 generalParamSearchTree 定义的树形结构。

响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "materialDocument": "string",
      "materialDocumentYear": "string"
    }
    // ...
  ]
}
17. 工厂搜索接口
接口地址： GET /api/search/plant

接口描述： 根据工厂名称搜索可用的工厂。

使用场景： 在需要选择工厂的字段中使用。

请求参数： 动态参数，基于 plantSearchStructure 定义的树形结构。

JSON

{
  "plantName": "string"
}
响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "plantId": "string",
      "plantName": "string",
      "city": "string"
    }
    // ...
  ]
}
18. 存储位置搜索接口 //缺请求参数
接口地址： GET /api/search/storage-location

接口描述： 搜索可用的存储位置。

使用场景： 在需要选择存储位置的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    // 存储位置列表
  ]
}
19. 报价单搜索接口
接口地址： GET /api/search/quotation-id

接口描述： 根据报价单 ID 搜索可用的报价单。

使用场景： 在需要选择报价单 ID 的字段中使用。

请求参数： 动态参数，基于 quotationIdParamSearchTree 定义的树形结构。

响应结果：

JSON

{
  "success": true,
  "data": [
    // 报价单 ID 列表
  ]
}
20. 开票凭证搜索接口 //缺请求参数
接口地址： GET /api/search/billing-document-id

接口描述： 搜索可用的开票凭证。

使用场景： 在需要选择开票凭证的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "开票凭证号": "string",
      "售达方": "string",
      "净值": "number",
      "货币": "string"
    }
    // ...
  ]
}
21. 售达方搜索接口
接口地址： GET /api/search/sold-to-party

接口描述： 根据客户、城市、名称、国家码或邮政编码搜索可用的售达方。

使用场景： 在需要选择售达方的字段中使用。

请求参数： 动态参数，基于 soldToPartySearchStructure 定义的树形结构。

JSON

{
  "customer": "string",
  "city": "string",
  "name": "string",
  "countryKey": "string",
  "postalCode": "string"
}
响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "售达方": "string",
      "城市": "string",
      "国家": "string"
    }
    // ...
  ]
}
22. 销售订单搜索接口
接口地址： GET /api/search/salesOrder-id

接口描述： 根据报价单 ID、售达方、送达方或搜索词搜索可用的销售订单。

使用场景： 在需要选择销售订单的字段中使用。

请求参数： 动态参数，基于 soParamSearchStructure 定义的树形结构。

JSON

{
  "quotation_id": "string",
  "soldToParty": "string",
  "shipToParty": "string",
  "search_term": "string"
}
响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "so_id": "string",
      "soldToParty": "string",
      "netValue": "number",
      "customerReference": "string"
    }
    // ...
  ]
}
23. 开票方搜索接口 //缺请求参数
接口地址： GET /api/search/bill-to-party

接口描述： 搜索可用的开票方。

使用场景： 在需要选择开票方的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "开票方": "string",
      "城市": "string",
      "国家": "string"
    }
    // ...
  ]
}
24. 付款方搜索接口 //缺请求参数
接口地址： GET /api/search/payer-party

接口描述： 搜索可用的付款方。

使用场景： 在需要选择付款方的字段中使用。

请求参数： null

响应结果：

JSON

{
  "success": true,
  "data": [
    {
      "付款方": "string",
      "城市": "string",
      "国家": "string"
    }
    // ...
  ]
}