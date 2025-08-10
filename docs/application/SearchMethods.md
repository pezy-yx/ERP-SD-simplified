# 搜索服务接口文档

## 📋 接口概述

该文档描述了前端应用中用于数据搜索的后端接口。这些接口为用户在各种表单字段中输入数据时提供搜索、校验和自动填充功能，支持多种业务对象（如公司代码、物料、客户等）的查询。

## 📚 接口目录

| 接口名称 | 接口地址 | 描述 |
|---------|---------|------|
| generalSearch | `/api/search/general/${type}` | 根据不同业务对象类型进行通用搜索 |
| companyCodeSearch | `/api/search/company-code` | 搜索公司代码信息 |
| countrySearch | `/api/search/country` | 搜索国家信息 | 
| customerSearch | `/api/search/customer` | 搜索客户信息 |
| bpSearch | `/api/search/business-partner` | 搜索业务伙伴信息 |
| GLAccountSearch | `/api/search/gl-account` | 搜索总账科目信息 |
| CurrencyUnitSearch | `/api/search/currency-unit` | 搜索货币单位信息 | 
| relationSearch | `/api/search/relation` | 搜索业务伙伴关系类型 |
| inquiryTypeSearch | `/api/search/inquiry-type` | 搜索询价类型信息 |
| salesOrgSearch | `/api/search/sales-org` | 搜索销售组织信息 | 
| distributionChannelSearch | `/api/search/distribution-channel` | 搜索分销渠道信息 | 
| divisionSearch | `/api/search/division` | 搜索部门信息 | 
| inquiryIdSearch | `/api/search/inquiry-id` | 搜索询价单ID |
| deliveryIdSearch | `/api/search/delivery-id` | 搜索交货单ID |
| materialSearch | `/api/search/material` | 搜索物料信息 | 
| materialDocumentSearch | `/api/search/material-description` | 搜索物料文档信息 |
| plantSearch | `/api/search/plant` | 搜索工厂信息 | 
| storageLocationSearch | `/api/search/storage-location` | 搜索存储位置信息 | 
| quotationIdSearch | `/api/search/quotation-id` | 搜索报价单ID |
| billingDocumentIdSearch | `/api/search/billing-document-id` | 搜索开票凭证信息 |
| soldToPartySearch | `/api/search/sold-to-party` | 搜索售达方信息 |
| salesOrderIdSearch | `/api/search/salesOrder-id` | 搜索销售订单信息 |
| relationIdSearch | `/api/search/relation-id` | 搜索关系ID |
| materialUnitSearch | `/api/search/material-unit` | 搜索物料单位信息 |

> **注意**: 以下接口已注释，暂未启用
> - 开票方搜索: `/api/search/bill-to-party`
> - 付款方搜索: `/api/search/payer-party`
---

## 🔍 接口详细说明

### 1. 通用搜索接口

**接口地址**: `POST /api/search/general/${type}`

**支持的type类型**:
- `plantName` - 工厂名称
- `materialDescription` - 物料描述
- `material` - 物料
- `countryKey` - 国家码

**接口描述**: 根据不同的业务对象类型（type）进行通用搜索。支持对数值类型字段的包含、等于、起始于、结束于、小于、大于等多种过滤条件进行搜索。

**使用场景**: 在物料、物料描述、工厂名称和国家码等字段中使用。

**请求参数**: 动态参数，基于 generalParamSearchStructure 定义的树形结构。

```json
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
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    // 搜索结果列表，具体结构根据type动态变化
  ]
}
```
### 2. 公司代码搜索接口

**接口地址**: `POST /api/search/company-code`

**接口描述**: 根据公司代码、城市、公司名称或货币等条件搜索可用的公司代码。

**使用场景**: 在需要选择公司代码的字段中使用，例如 G/L Account 搜索。

**请求参数**: 动态参数，基于 companyCodeSearchStructure 定义的树形结构。

```json
{
  "companyCode": "string",
  "city": "string",
  "companyName": "string",
  "currency": "string"
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // Company Code
      "name": "string",
      "city": "string",
      "currency": "string"
    }
    // ...
  ]
}
```
### 3. 国家搜索接口

**接口地址**: `POST /api/search/country`

**接口描述**: 根据国家名称搜索可用的国家。

**使用场景**: 在需要选择国家的字段中使用。

**请求参数**: 动态参数，基于 countryParamSearchStructure 定义的树形结构。

```json
{
  "Country Name Search": {
    "country name": "string"
  }
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string" // Country
    }
    // ...
  ]
}
```

### 4. 客户搜索接口

**接口地址**: `POST /api/search/customer`

**接口描述**: 根据客户编号、邮政编码、公司代码、城市、搜索词或客户名称搜索客户。

**使用场景**: 在需要选择客户的字段中使用，例如业务伙伴搜索。

**请求参数**: 动态参数，基于 customerSearchStructure 定义的树形结构。

```json
{
  "customer": "string",
  "postalCode": "string",
  "companyCode": "string",
  "city": "string",
  "searchTerm": "string",
  "customerName": "string"
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // ID
      "name": "string"
    }
    // ...
  ]
}
```
### 5. 业务伙伴搜索接口

**接口地址**: `POST /api/search/business-partner`

**接口描述**: 根据客户、城市、名称、国家码、邮政编码或业务伙伴 ID 搜索业务伙伴。

**使用场景**: 在需要选择业务伙伴的字段中使用。

**请求参数**: 动态参数，基于 bpParamSearchStructure 定义的树形结构。

```json
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
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // ID
      "name": "string",
      "companyCode": "string"
    }
    // ...
  ]
}
```
### 6. G/L Account 搜索接口

**接口地址**: `POST /api/search/gl-account`

**接口描述**: 根据 G/L Account、科目表、短文本、公司代码或长文本搜索 G/L Account。

**使用场景**: 在需要选择 G/L Account 的字段中使用。

**请求参数**: 动态参数，基于 glAccountParamSearchStructure 定义的树形结构。

```json
{
  "glAccount": "string",
  "chartOfAccounts": "string",
  "shortText": "string",
  "companyCode": "string",
  "longText": "string"
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // glAccount
      "chartOfAccounts": "string",
      "shortText": "string",
      "companyCode": "string",
      "longText": "string"
    }
    // ...
  ]
}
```

### 7. 货币单位搜索接口 

> **注意**: 无请求参数，请求体为{}

**接口地址**: `POST /api/search/currency-unit`

**接口描述**: 搜索可用的货币单位。

**使用场景**: 在需要选择货币单位的字段中使用。

**请求参数**: `null`

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string" // Unit
    }
  ]
}
```
### 8. 关系搜索接口 

> **注意**: 无请求参数，请求体为{}

**接口地址**: `POST /api/search/relation`

**接口描述**: 搜索可用的业务伙伴关系类型。

**使用场景**: 在需要选择关系类型的字段中使用。

**请求参数**: `null`

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // Relation Catogory (not the id)
      "direction": "string",
      "desription": "string"
    }
    // ...
  ]
}
```

### 9. 询价类型搜索接口 

> **注意**: 无请求参数，请求体为{}

**接口地址**: `POST /api/search/inquiry-type`

**接口描述**: 搜索可用的询价类型。

**使用场景**: 在需要选择询价类型的字段中使用。

**请求参数**: `null`

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // Inquiry Type
      "description": "string"
    }
    // ...
  ]
}
```

### 10. 销售组织搜索接口 

> **注意**: 无请求参数，请求体为{}

**接口地址**: `POST /api/search/sales-org`

**接口描述**: 搜索可用的销售组织。

**使用场景**: 在需要选择销售组织的字段中使用。

**请求参数**: `null`

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // sales-org
      "description": "string"
    }
    // ...
  ]
}
```
### 11. 分销渠道搜索接口 

> **注意**: 无请求参数，请求体为{}

**接口地址**: `POST /api/search/distribution-channel`

**接口描述**: 搜索可用的分销渠道。

**使用场景**: 在需要选择分销渠道的字段中使用。

**请求参数**: `null`

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // Distribution Channel
      "dchl": "string",
      "description": "string"
    }
    // ...
  ]
}
```

### 12. 部门搜索接口 

> **注意**: 无请求参数，请求体为{}

**接口地址**: `POST /api/search/division`

**接口描述**: 搜索可用的部门。

**使用场景**: 在需要选择部门的字段中使用。

**请求参数**: `null`

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // division
      "dchl": "string",
      "dv": "string",
      "description": "string"
    }
    // ...
  ]
}
```

### 13. 询价单搜索接口 

**接口地址**: `POST /api/search/inquiry-id`

**接口描述**: 搜索可用的询价单 ID。

**使用场景**: 在需要选择询价单 ID 的字段中使用。

**请求参数**: 

```json
{
  "purchaseOrderNumber": "string",
  "soldToParty": "string",
  "shipToParty": "string",
  "customerRef": "string",
  "customerRefDate": "string",
  "containMaterials": [
    {
      "id": "string"
    }
  ]
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // inquiry-id
      "purchaseOrderNumber": "string",
      "soldToParty": "string",
      "shipToParty": "string",
      "customerRef": "string",
      "customerRefDate": "string"
    }
  ]
}
```

### 14. 交货单搜索接口 

**接口地址**: `POST /api/search/delivery-id`

**接口描述**: 搜索可用的交货单 ID。

**使用场景**: 在需要选择交货单 ID 的字段中使用。

**请求参数**: 

```json
{
  "state": "string",
  "shippingPoint": "string",
  "shipToParty": "string",
  "pickingDate": "string",
  "loadingDate": "string",
  "plannedGIDate": "string",
  "deliveryDate": "string",
  "pickingStatus": [
    {
      "status": "string"
    }
  ]
}
```
pickingStatus取或

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // delivery-id
      "description": "string",
      "shippingPoint": "string",
      "shipToParty": "string",
      "pickingDate": "string",
      "loadingDate": "string",
      "plannedGIDate": "string",
      "deliveryDate": "string",
      "pickingStatus": "string"
    }
  ]
}
```
### 15. 物料搜索接口

**接口地址**: `POST /api/search/material`

**接口描述**: 根据物料和物料描述搜索可用的物料。

**使用场景**: 在需要选择物料的字段中使用。

**请求参数**: 动态参数，基于 materialSearchStructure 定义的树形结构。

```json
{
  "material": "string",
  "materialDescription": "string"
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // material name like DXTR1003
      "matDesc": "string"
    }
    // ...
  ]
}
```

### 16. 物料文档搜索接口

**接口地址**: `POST /api/search/material-description`

**接口描述**: 根据物料文档和物料文档年份搜索可用的物料文档。

**使用场景**: 在需要选择物料文档的字段中使用。

**请求参数**: 采用 generalParamSearch 的请求结构。

```json
{
  "include": {
    "contains": "string",
    "equal to": "string",
    "starts with": "string",
    "ends with": "string",
    "less than": "string",
    "greater than": "string"
  },
  "exclude": {
    "contains": "string",
    "equal to": "string",
    "starts with": "string",
    "ends with": "string",
    "less than": "string",
    "greater than": "string"
  }
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // material-document
      "materialDocumentYear": "string"
    }
    // ...
  ]
}
```

### 17. 工厂搜索接口

**接口地址**: `POST /api/search/plant`

**接口描述**: 根据工厂名称搜索可用的工厂。

**使用场景**: 在需要选择工厂的字段中使用。

**请求参数**: 动态参数，基于 plantSearchStructure 定义的树形结构。

```json
{
  "plantName": "string"
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // plant
      "plantName": "string",
      "city": "string"
    }
    // ...
  ]
}
```
### 18. 存储位置搜索接口 

> **注意**: 无请求参数，请求体为{}

**接口地址**: `POST /api/search/storage-location`

**接口描述**: 搜索可用的存储位置。

**使用场景**: 在需要选择存储位置的字段中使用。

**请求参数**: `null`

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // storage-location
      "description": "string"
    }
  ]
}
```

### 19. 报价单搜索接口

**接口地址**: `POST /api/search/quotation-id`

**接口描述**: 根据报价单 ID 搜索可用的报价单。

**使用场景**: 在需要选择报价单 ID 的字段中使用。

**请求参数**: 采用 quotationIdParamSearchTree 定义的请求参数

```json
{
  "include": {
    "contains": "string",
    "equal to": "string",
    "starts with": "string",
    "ends with": "string",
    "less than": "string",
    "greater than": "string"
  },
  "exclude": {
    "contains": "string",
    "equal to": "string",
    "starts with": "string",
    "ends with": "string",
    "less than": "string",
    "greater than": "string"
  }
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string" // quotation-id
    }
  ]
}
```

### 20. 开票凭证搜索接口 

**接口地址**: `POST /api/search/billing-document-id`

**接口描述**: 搜索可用的开票凭证。

**使用场景**: 在需要选择开票凭证的字段中使用。

**请求参数**:

```json
{
  "soldToParty": "string",
  "billingDate": "string"
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // billing-document-id
      "soldToParty": "string",
      "netValue": "number",
      "billingDate": "string",
      "currency": "string"
    }
    // ...
  ]
}
```
### 21. 售达方搜索接口

**接口地址**: `POST /api/search/sold-to-party`

**接口描述**: 根据客户、城市、名称、国家码或邮政编码搜索可用的售达方。

**使用场景**: 在需要选择售达方的字段中使用。

**请求参数**: 动态参数，基于 soldToPartySearchStructure 定义的树形结构。

```json
{
  "customer": "string",
  "city": "string",
  "name": "string",
  "countryKey": "string",
  "postalCode": "string"
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // customer
      "city": "string",
      "country": "string"
    }
    // ...
  ]
}
```

### 22. 销售订单搜索接口

**接口地址**: `POST /api/search/salesOrder-id`

**接口描述**: 根据报价单 ID、售达方、送达方或搜索词搜索可用的销售订单。

**使用场景**: 在需要选择销售订单的字段中使用。

**请求参数**: 动态参数，基于 soParamSearchStructure 定义的树形结构。

```json
{
  "quotation_id": "string",
  "soldToParty": "string",
  "shipToParty": "string",
  "search_term": "string"
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // sales order id
      "soldToParty": "string",
      "netValue": "string",
      "customerReference": "string"
    }
    // ...
  ]
}
```

### 23. 关系ID搜索接口

**接口地址**: `POST /api/search/relation-id`

**接口描述**: 根据业务伙伴、有效期和关系类别搜索业务伙伴关系ID。

**使用场景**: 在需要查找业务伙伴之间关系的字段中使用。

**请求参数**:

```json
{
  "BP1": "string",
  "BP2": "string",
  "validFrom": "string",
  "validTo": "string",
  "containCategory": [
    {
      "relation": "string"
    }
  ]
}
```

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // Relation ID (not category)
      "BP1": "string",
      "BP2": "string",
      "validFrom": "string",
      "validTo": "string",
      "relation": "string"
    }
    // ...
  ]
}
```

### 24. 物料单位搜索接口

**接口地址**: `POST /api/search/material-unit`

**接口描述**: 搜索可用的物料计量单位。

**使用场景**: 在需要选择物料计量单位的字段中使用。

**请求参数**: `null`

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // Unit e.g. EA
      "description": "string" // e.g. Each (单件)
    }
  ]
}
```
### 25. 开票方搜索接口 

> **注意**: 无请求参数，请求体为{}，接口已注释

**接口地址**: `POST /api/search/bill-to-party`

**接口描述**: 搜索可用的开票方。

**使用场景**: 在需要选择开票方的字段中使用。

**请求参数**: `null`

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // 开票方 customer
      "city": "string", // 城市
      "country": "string" // 国家
    }
    // ...
  ]
}
```

### 26. 付款方搜索接口 

> **注意**: 无请求参数，请求体为{}，接口已注释

**接口地址**: `POST /api/search/payer-party`

**接口描述**: 搜索可用的付款方。

**使用场景**: 在需要选择付款方的字段中使用。

**请求参数**: `null`

**响应结果**:

```json
{
  "success": true,
  "data": [
    {
      "result": "string", // 付款方 customer
      "city": "string", // 城市
      "country": "string" // 国家
    }
    // ...
  ]
}
```

---

## 📝 备注说明

-  标记的接口表示无请求参数，请求体为{}或接口详情待补充
- 所有接口均返回统一的响应格式，包含 `success` 状态和 `data` 数据数组
- 动态参数接口基于相应的搜索结构定义，具体结构请参考对应的参数定义文件
- 部分接口（如开票方、付款方）目前已注释，暂未启用