# 搜索方法API文档

本文档详细描述了ERP系统中@vakesamahere的相关11个搜索方法的API接口，包括请求参数和响应格式。

## 目录
1. [顾客搜索 (Customer Search)](#1-顾客搜索-customer-search)
2. [业务伙伴搜索 (Business Partner Search)](#2-业务伙伴搜索-business-partner-search)
3. [物料搜索 (Material Search)](#3-物料搜索-material-search)
4. [工厂搜索 (Plant Search)](#4-工厂搜索-plant-search)
5. [关系搜索 (Relation Search)](#5-关系搜索-relation-search)
6. [询价类型搜索 (Inquiry Type Search)](#6-询价类型搜索-inquiry-type-search)
7. [销售组织搜索 (Sales Organization Search)](#7-销售组织搜索-sales-organization-search)
8. [分销渠道搜索 (Distribution Channel Search)](#8-分销渠道搜索-distribution-channel-search)
9. [部门搜索 (Division Search)](#9-部门搜索-division-search)
10. [存储位置搜索 (Storage Location Search)](#10-存储位置搜索-storage-location-search)
11. [统计单位搜索 (Material Unit Search)](#11-统计单位搜索-material-unit-search)

## 通用响应格式

所有搜索API都遵循统一的响应格式：

```json
{
  "success": boolean,
  "data": Array<SearchResult>,
  "total": number,
  "message": string
}
```

其中 `SearchResult` 的基本结构为：
```json
{
  "id": string,
  "result": string,
  "description": string,
  // ... 其他特定字段
}
```

---

## 1. 顾客搜索 (Customer Search)

### 基本信息
- **名称**: 顾客搜索
- **服务URL**: `/api/search/customer`
- **方法**: POST
- **参数树**: 支持复杂搜索条件

### 请求参数
```json
{
  "include": {
    "contains": number,
    "equal to": number,
    "starts with": number,
    "ends with": number,
    "less than": number,
    "greater than": number
  },
  "exclude": {
    "contains": number,
    "equal to": number,
    "starts with": number,
    "ends with": number,
    "less than": number,
    "greater than": number
  }
}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "id": "CUST-12345",
      "result": "CUST-12345",
      "description": "北京科技有限公司"
    },
    {
      "id": "CUST-67890",
      "result": "CUST-67890", 
      "description": "上海贸易公司"
    }
  ],
  "total": 2,
  "message": "找到 2 个客户"
}
```

---

## 2. 业务伙伴搜索 (Business Partner Search)

### 基本信息
- **名称**: 业务伙伴搜索
- **服务URL**: `/api/search/business-partner`
- **方法**: POST
- **参数树**: 支持条件搜索和ID搜索

### 请求参数
```json
{
  "Condition Search": {
    "Customer": string,
    "City": string,
    "Name": string,
    "Country Key": string,
    "Postal Code": string
  },
  "ID Search": {
    "include": {
      "contains": number,
      "equal to": number,
      "starts with": number,
      "ends with": number,
      "less than": number,
      "greater than": number
    },
    "exclude": {
      "contains": number,
      "equal to": number,
      "starts with": number,
      "ends with": number,
      "less than": number,
      "greater than": number
    }
  }
}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "id": "BP001",
      "result": "华为技术有限公司",
      "description": "类型: 客户 | 联系人: 张经理 | 状态: 活跃",
      "bpType": "客户",
      "contactPerson": "张经理",
      "phone": "13800138001",
      "email": "zhang@huawei.com",
      "address": "深圳市南山区华为总部",
      "createDate": "2024-01-15",
      "status": "活跃"
    }
  ],
  "total": 1,
  "message": "找到 1 个业务伙伴"
}
```

---

## 3. 物料搜索 (Material Search)

### 基本信息
- **名称**: 物料搜索
- **服务URL**: `/api/search/material`
- **方法**: POST
- **参数树**: 支持物料编码和描述搜索

### 请求参数
```json
{
  "material": string,
  "materialDescription": string
}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "id": "MAT-001",
      "result": "MAT-001",
      "description": "笔记本电脑 - ThinkPad X1"
    },
    {
      "id": "MAT-002", 
      "result": "MAT-002",
      "description": "无线鼠标 - 罗技MX Master"
    }
  ],
  "total": 2,
  "message": "找到 2 个物料"
}
```

---

## 4. 工厂搜索 (Plant Search)

### 基本信息
- **名称**: 工厂搜索
- **服务URL**: `/api/search/plant`
- **方法**: POST
- **参数树**: 支持工厂名称搜索

### 请求参数
```json
{
  "plantName": string
}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "id": "1000",
      "result": "1000",
      "description": "北京工厂"
    },
    {
      "id": "2000",
      "result": "2000", 
      "description": "上海工厂"
    }
  ],
  "total": 2,
  "message": "找到 2 个工厂"
}
```

---

## 5. 关系搜索 (Relation Search)

### 基本信息
- **名称**: 关系搜索
- **服务URL**: `/api/search/relation`
- **方法**: POST
- **参数树**: 无参数（直接返回可用关系）

### 请求参数
```json
{}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "result": "BBP002",
      "direction": "->",
      "description": "Has the Invoicing Party"
    },
    {
      "result": "BUR001",
      "direction": "->", 
      "description": "Has Contact Person"
    },
    {
      "result": "BUR004",
      "direction": "<->",
      "description": "Is Married To"
    }
  ],
  "total": 3,
  "message": "3 results found"
}
```

### 结果显示字段映射
- `result`: "Relation"
- `direction`: "Direction"
- `description`: "Description"

---

## 6. 询价类型搜索 (Inquiry Type Search)

### 基本信息
- **名称**: 询价类型搜索
- **服务URL**: `/api/search/inquiry-type`
- **方法**: POST
- **参数树**: 无参数（直接返回可用询价类型）

### 请求参数
```json
{}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "result": "IN",
      "description": "Inquiry"
    },
    {
      "result": "RAF",
      "description": "Stock Inquiry"
    }
  ],
  "total": 2,
  "message": "2 results found"
}
```

### 结果显示字段映射
- `result`: "SaTy"
- `description`: "Description"

---

## 7. 销售组织搜索 (Sales Organization Search)

### 基本信息
- **名称**: 销售组织搜索
- **服务URL**: `/api/search/sales-org`
- **方法**: POST
- **参数树**: 无参数（直接返回可用销售组织）

### 请求参数
```json
{}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "result": "DN00",
      "description": "Germany North"
    },
    {
      "result": "UE00",
      "description": "US East"
    }
  ],
  "total": 2,
  "message": "2 results found"
}
```

### 结果显示字段映射
- `result`: "SOrg."
- `description`: "Name"

---

## 8. 分销渠道搜索 (Distribution Channel Search)

### 基本信息
- **名称**: 分销渠道搜索
- **服务URL**: `/api/search/distribution-channel`
- **方法**: POST
- **参数树**: 无参数（直接返回可用分销渠道）

### 请求参数
```json
{}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "result": "DN00",
      "dchl": "IN",
      "description": "Internet"
    },
    {
      "result": "UE00",
      "dchl": "WH",
      "description": "Wholesale"
    }
  ],
  "total": 2,
  "message": "2 results found"
}
```

### 结果显示字段映射
- `result`: "SOrg."
- `dchl`: "DChl"
- `description`: "Name"

---

## 9. 部门搜索 (Division Search)

### 基本信息
- **名称**: 部门搜索
- **服务URL**: `/api/search/division`
- **方法**: POST
- **参数树**: 无参数（直接返回可用部门）

### 请求参数
```json
{}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "result": "DN00",
      "dchl": "IN",
      "dv": "AS",
      "description": "Accessories"
    },
    {
      "result": "UE00",
      "dchl": "WH",
      "dv": "AS",
      "description": "Accessories"
    },
    {
      "result": "UE00",
      "dchl": "WH",
      "dv": "BI",
      "description": "Bicycles"
    }
  ],
  "total": 3,
  "message": "3 results found"
}
```

### 结果显示字段映射
- `result`: "SOrg."
- `dchl`: "DChl"
- `dv`: "Dv"
- `description`: "Name"

---

## 10. 存储位置搜索 (Storage Location Search)

### 基本信息
- **名称**: 存储位置搜索
- **服务URL**: `/api/search/storage-location`
- **方法**: POST
- **参数树**: 无参数（直接返回可用存储位置）

### 请求参数
```json
{}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "result": "0001",
      "description": "主仓库A区"
    },
    {
      "result": "0002",
      "description": "主仓库B区"
    },
    {
      "result": "0003",
      "description": "备用仓库"
    }
  ],
  "total": 3,
  "message": "找到 3 个存储位置"
}
```

### 结果显示字段映射
- `result`: "Location"
- `description`: "Description"

---

## 11. 统计单位搜索 (Material Unit Search)

### 基本信息
- **名称**: 统计单位搜索
- **服务URL**: `/api/search/material-unit`
- **方法**: POST
- **参数树**: 无参数（直接返回可用统计单位）

### 请求参数
```json
{}
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "result": "EA",
      "description": "Each (单件)"
    },
    {
      "result": "KG",
      "description": "Kilogram (千克)"
    },
    {
      "result": "BOX",
      "description": "Box (盒)"
    },
    {
      "result": "SET",
      "description": "Set (套)"
    },
    {
      "result": "L",
      "description": "Liter (升)"
    },
    {
      "result": "M",
      "description": "Meter (米)"
    },
    {
      "result": "PCS",
      "description": "Pieces (件)"
    }
  ],
  "total": 7,
  "message": "找到 7 个物料单位"
}
```

### 结果显示字段映射
- `result`: "Unit Name"
- `description`: "Description"

---

## 附加搜索方法

除了上述11个主要搜索方法外，系统还提供了以下辅助搜索方法：

### 售达方搜索 (Sold-To Party Search)
- **服务URL**: `/api/search/sold-to-party`
- **结果字段**: `result` (售达方), `city` (城市), `country` (国家)

### 开票方搜索 (Bill-To Party Search)
- **服务URL**: `/api/search/bill-to-party`
- **结果字段**: `result` (开票方), `city` (城市), `country` (国家)

### 付款方搜索 (Payer Party Search)
- **服务URL**: `/api/search/payer-party`
- **结果字段**: `result` (付款方), `city` (城市), `country` (国家)

### 交货单搜索 (Delivery ID Search)
- **服务URL**: `/api/search/delivery-id`
- **复杂参数**: 支持状态、发货点、收货方、各种日期和拣配状态筛选

### 开票凭证搜索 (Billing Document ID Search)
- **服务URL**: `/api/search/billing-document-id`
- **参数**: `soldToParty`, `billingDate`

### 询价单搜索 (Inquiry ID Search)
- **服务URL**: `/api/search/inquiry-id`
- **复杂参数**: 支持采购订单号、售达方、收货方、客户参考等筛选

### 关系ID搜索 (Relation ID Search)
- **服务URL**: `/api/search/relation-id`
- **复杂参数**: 支持BP1、BP2、有效期和关系类别筛选

---

## 错误处理

当搜索失败时，API会返回以下格式的错误响应：

```json
{
  "success": false,
  "message": "搜索失败，请稍后重试",
  "error": "具体错误信息"
}
```

常见错误状态码：
- `400`: 请求参数错误
- `500`: 服务器内部错误

---

## 使用说明

1. **参数树结构**: 带有 `paramTree` 的搜索方法支持复杂的搜索条件，可以通过前端的搜索表单进行配置
2. **直接搜索**: `paramTree` 为 `null` 的搜索方法直接返回所有可用选项，无需额外参数
3. **结果显示**: `resultHeaderDisplay` 定义了搜索结果在前端表格中的列标题映射
4. **嵌套搜索**: 某些搜索方法的参数支持嵌套其他搜索方法，形成搜索链

---

## 技术实现

### 前端实现
- 搜索方法定义在 `site/src/utils/searchMethods.ts`
- 使用 `SearchMethod` 接口统一管理
- 通过 `VarTree` 结构定义复杂搜索参数

### 后端实现
- Mock API 实现在 `backend-mock/src/routes/search.js`
- 统一的响应格式和错误处理
- 支持多种筛选条件和模糊匹配