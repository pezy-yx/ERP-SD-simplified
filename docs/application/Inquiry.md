# Inquiry 询价单管理系统接口文档

## 概述

Inquiry询价单管理系统包含三个主要应用：
1. **Create Inquiry** - 创建询价单 (路由: `/application/create-inquiry`)
2. **Display Inquiry** - 查看询价单 (路由: `/application/display-inquiry`)
3. **Change Inquiry** - 修改询价单 (路由: `/application/change-inquiry`)

这三个应用共享相同的主组件 `Main.vue`，通过不同的状态模式 (`create`/`display`/`change`) 来控制界面行为和数据交互。

本文档描述了这些应用与后端服务的交互接口规范。

## 接口列表

### 1. 初始化询价单 - `/inquiry/initialize`

**请求方法**: POST

**功能**: 初始化新询价单的默认值

**请求参数**:
```json
{
  "inquiryType": "string",
  "salesOrganization": "string", 
  "distributionChannel": "string",
  "division": "string"
}
```

**响应格式**:
```json
{
  "success": true,
  "message": "初始化询价单成功",
  "data": {
    "content": {
      "itemOverview": {
        "reqDelivDate": "2033-03-14" // 一个默认值
      }
    }
  }
}
```

### 2. 获取询价单详情 - `/inquiry/get`

**请求方法**: POST

**功能**: 根据询价单ID获取完整的询价单信息

**请求参数**:
```json
{
  "inquiryId": "string"
}
```

**响应格式**:
```json
{
  "success": true,
  "message": "获取询价单成功",
  "data": {
    "content": {
      "meta": {
        "id": "INQ-2024-001"
      },
      "basicInfo": {
        "inquiry": "INQ-2024-001",
        "soldToParty": "CUST-12345",
        "shipToParty": "SHIP-67890", 
        "customerReference": "REF-ABC123",
        "netValue": 15800.50,
        "netValueUnit": "USD",
        "customerReferenceDate": "2024-01-15"
      },
      "itemOverview": {
        "validFrom": "2024-01-01",
        "validTo": "2024-12-31",
        "reqDelivDate": "2024-02-15",
        "expectOralVal": "16000.00",
        "expectOralValUnit": "USD",
        "items": [
          {
            "item": "1",
            "material": "MAT-001",
            "orderQuantity": "100",
            "orderQuantityUnit": "EA",
            "description": "高品质电子元件",
            "reqDelivDate": "2024-02-15",
            "netValue": "1500.00",
            "netValueUnit": "USD",
            "taxValue": "225.00",
            "taxValueUnit": "USD",
            "pricingDate": "2024-01-15",
            "orderProbability": "95",
            "pricingElements": [
              {
                "cnty": "US",
                "name": "Base Price",
                "amount": "1500.00",
                "city": "USD",
                "per": "1",
                "uom": "EA",
                "conditionValue": "1500.00",
                "curr": "USD",
                "status": "Active",
                "numC": "1",
                "atoMtsComponent": "",
                "oun": "",
                "cconDe": "",
                "un": "",
                "conditionValue2": "1500.00",
                "cdCur": "USD",
                "stat": true
              }
            ]
          }
        ]
      }
    }
  }
}
```

### 3. 编辑询价单 - `/inquiry/edit`

**请求方法**: POST

**功能**: 创建新询价单或修改现有询价单

**请求参数**:
```json
{
  "meta": {
    "id": "string" // 空字符串表示创建，非空表示修改
  },
  "basicInfo": {
    "inquiry": "string",
    "soldToParty": "string",
    "shipToParty": "string",
    "customerReference": "string",
    "netValue": "number",
    "netValueUnit": "string",
    "customerReferenceDate": "string"
  },
  "itemOverview": {
    "validFrom": "string",
    "validTo": "string", 
    "reqDelivDate": "string",
    "expectOralVal": "string",
    "expectOralValUnit": "string",
    "items": [
      // 物品数组，结构同获取接口
    ]
  }
}
```

**响应格式**:

创建成功:
```json
{
  "success": true,
  "message": "创建询价单成功",
  "data": {
    "message": "Inquiry INQ-2024-033 has been created successfully",
    "content": {
      "id": "INQ-2024-033"
    }
  }
}
```

修改成功:
```json
{
  "success": true,
  "message": "修改询价单成功", 
  "data": {
    "message": "Inquiry INQ-2024-001 has been updated successfully"
  }
}
```

### 4. 物品批量查询 - `/inquiry/items-tab-query`

**请求方法**: POST

**功能**: 批量查询物品详细信息，包括定价元素

**请求参数**:
```json
[
  {
    "item": "string",
    "material": "string",
    "orderQuantity": "string",
    "orderQuantityUnit": "string",
    "description": "string",
    "reqDelivDate": "string",
    "netValue": "string",
    "pricingDate": "string",
    "orderProbability": "string"
  }
]
```

**响应格式**:
```json
{
  "success": true,
  "message": "批量查询成功",
  "data": {
    "summary": {
      "totalNetValue": 4300.00,
      "totalExpectOralVal": 4730.00,
      "currency": "USD"
    },
    "breakdowns": [
      {
        "item": "1",
        "material": "MAT-001", 
        "orderQuantity": "100",
        "orderQuantityUnit": "EA",
        "description": "物料描述 1",
        "reqDelivDate": "2024-02-15",
        "netValue": 1500.00,
        "netValueUnit": "USD",
        "taxValue": 225.00,
        "taxValueUnit": "USD",
        "pricingDate": "2024-01-15",
        "orderProbability": "100",
        "pricingElements": [
          {
            "cnty": "US",
            "name": "Base Price",
            "amount": "1500.00",
            "city": "USD",
            "per": "1",
            "uom": "EA",
            "conditionValue": "1500.00",
            "curr": "USD",
            "status": "Active",
            "numC": "1",
            "atoMtsComponent": "",
            "oun": "",
            "cconDe": "",
            "un": "",
            "conditionValue2": "1500.00",
            "cdCur": "USD",
            "stat": true
          }
        ]
      }
    ],
    "badRecordIndices": []
  }
}
```

## 数据字段说明

### 基本信息字段 (basicInfo)
- `inquiry`: 询价单号
- `soldToParty`: 售达方
- `shipToParty`: 送达方  
- `customerReference`: 客户参考
- `netValue`: 净值
- `netValueUnit`: 净值单位
- `customerReferenceDate`: 客户参考日期

### 物品概览字段 (itemOverview)
- `validFrom`: 有效起始日期
- `validTo`: 有效结束日期
- `reqDelivDate`: 要求交货日期
- `expectOralVal`: 期望口头价值
- `expectOralValUnit`: 期望口头价值单位

### 物品详细字段 (items)
- `item`: 物品行号
- `material`: 物料号
- `orderQuantity`: 订单数量
- `orderQuantityUnit`: 订单数量单位
- `description`: 物料描述
- `reqDelivDate`: 要求交货日期
- `netValue`: 净值
- `netValueUnit`: 净值单位
- `taxValue`: 税额
- `taxValueUnit`: 税额单位
- `pricingDate`: 定价日期
- `orderProbability`: 订单概率

### 定价元素字段 (pricingElements)
- `cnty`: 国家
- `name`: 条件名称
- `amount`: 金额
- `city`: 城市/货币
- `per`: 每
- `uom`: 计量单位
- `conditionValue`: 条件值
- `curr`: 货币
- `status`: 状态
- `numC`: 编号
- `atoMtsComponent`: ATO/MTS组件
- `oun`: OUn
- `cconDe`: CConDe
- `un`: Un
- `conditionValue2`: 条件值2
- `cdCur`: CdCur
- `stat`: 统计标志

## 业务流程说明

### 创建询价单流程
1. **初始化阶段**: 用户选择询价类型和组织数据，调用 `/inquiry/initialize` 获取默认值
2. **信息录入阶段**: 用户填写基本信息和物品概览，系统调用 `/inquiry/items-tab-query` 实时计算定价
3. **物品条件阶段**: 用户可以查看和调整每个物品的详细定价条件
4. **保存提交**: 调用 `/inquiry/edit` 创建新询价单

### 查看询价单流程  
1. **搜索阶段**: 用户输入询价单ID
2. **获取数据**: 调用 `/inquiry/get` 获取完整询价单信息
3. **展示阶段**: 系统以只读模式展示询价单的所有信息

### 修改询价单流程
1. **搜索阶段**: 用户输入要修改的询价单ID
2. **获取数据**: 调用 `/inquiry/get` 获取现有数据
3. **编辑阶段**: 用户修改信息，系统调用 `/inquiry/items-tab-query` 重新计算定价
4. **保存更新**: 调用 `/inquiry/edit` 更新询价单

### 关键业务规则
- 物品的净值和税额会根据定价元素自动计算
- 询价单的总净值是所有物品净值的汇总
- 期望口头价值通常比净值高10-15%
- 定价元素包含基础价格、税费、折扣等多种条件类型
- 系统支持多货币处理，但单个询价单内货币应保持一致

## 技术实现说明

### 前端架构
- **共享主组件**: 三个应用共享 `Main.vue` 组件，通过状态切换实现不同功能
- **VarTree数据管理**: 使用VarTree/VarNode系统管理复杂的嵌套数据结构
- **阶段式工作流**: 使用AppContent组件实现三阶段工作流 (`initialScreen` → `information` → `itemCondition`)
- **实时数据验证**: 通过 `items-tab-query` 接口实现物品数据的实时验证和计算

### 状态管理
- `create`: 创建模式，所有字段可编辑，调用 `initialize` 接口获取默认值
- `display`: 查看模式，所有字段只读，调用 `get` 接口获取数据
- `change`: 修改模式，字段可编辑，调用 `get` 接口获取现有数据

### 数据流向
1. **初始化**: `initialize` 或 `get` → VarTree数据结构
2. **实时计算**: 用户输入 → `items-tab-query` → 更新VarTree
3. **保存提交**: VarTree数据 → `edit` 接口 → 后端处理

### 错误处理
- 所有接口调用都包含 `success` 字段用于状态判断
- `items-tab-query` 返回 `badRecordIndices` 数组标识验证失败的记录
- 前端根据验证结果设置 `config.data.validation` 属性控制UI显示
