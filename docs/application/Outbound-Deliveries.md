# Outbound Deliveries 出库交货单管理系统接口文档

## 概述

Outbound Deliveries出库交货单管理系统包含三个主要应用：

1. **Create Outbound Delivery** - 创建出库交货单 (路由: `/application/create-outbound-delivery`)
2. **Manage Outbound Deliveries** - 管理出库交货单 (路由: `/application/manage-outbound-deliveries`)
3. **Pick Outbound Delivery** - 拣配出库交货单 (路由: `/application/pick-outbound-delivery`)

这三个应用分别负责出库交货单的创建、管理和拣配流程，形成完整的出库交货业务链条。

本文档描述了这些应用与后端服务的交互接口规范。

## 接口列表

### 1. 获取销售订单列表 - `/outbound-delivery/get-sales-orders`

**请求方法**: POST

**功能**: 根据查询条件获取可用于创建出库交货单的销售订单列表

**请求参数**:

```json
{
  "shipToParty": "string",
  "plannedCreationDate": "string",
  "relevantForTM": "string"
}
```

**响应格式**:

```json
{
  "success": true,
  "message": "获取销售订单成功",
  "data": {
    "orders": [
      {
        "id": "1",
        "plannedCreationDate": "2024-01-15",
        "plannedGIDate": "2024-01-20",
        "shippingPoint": "1000",
        "shipToParty": "CUST-12345",
        "grossWeight": "125.5 KG"
      } // 原来提交的数据，summary级的数据
    ]
  }
}
```

### 2. 从销售订单创建出库交货单 - `/outbound-delivery/create-from-orders`

**请求方法**: POST

**功能**: 从选中的销售订单创建出库交货单

**请求参数**:

```json
{
  "selectedOrders": [
    {
      "id": "1", // sales order的唯一标识，和get-sales-orders接口返回的id对应
      // 以下数据不应该被用到
      "plannedCreationDate": "2024-01-15",
      "plannedGIDate": "2024-01-20",
      "shippingPoint": "1000",
      "shipToParty": "CUST-12345",
      "grossWeight": "125.5 KG"
    }
  ]
}
```

**响应格式**:

```json
{
  "success": true,
  "message": "Successfully created 1 outbound deliveries: DEL-2024-100",
  "data": {
    "message": "Successfully created 1 outbound deliveries: DEL-2024-100",
    "createdDeliveries": ["DEL-2024-100"] // 按请求的顺序返回生成的id，需要保证index对应，失败/重复创建的返回一个异常值/原id，并在message说明
  }
}
```

### 3. 获取出库交货单汇总列表 - `/outbound-delivery/get-deliveries-summary`

**请求方法**: POST

**功能**: 根据查询条件获取出库交货单汇总信息

**请求参数**:

```json
{
  "overallStatus": "string",
  "createdBy": "string"
  // 后续可能增加更多，负责数据库工作的人员可以给出一些筛选字段的建议
}
```

**响应格式**:

```json
{
  "success": true,
  "message": "获取出库交货单成功",
  "data": {
    "deliveries": [
      {
        "outboundDelivery": "DEL-2024-100", // 唯一标识
        "pickingDate": "2024-01-20",
        "pickingStatus": "Completed",
        "giStatus": "Not Started",
        "pick": "Pick"
      }
    ]
  }
}
```

### 4. 获取出库交货单详情 - `/outbound-delivery/get-detail`

**请求方法**: POST

**功能**: 根据交货单ID获取完整的交货单详细信息

**请求参数**:

```json
{
  "deliveryId": "string"
}
```

**响应格式**:

```json
{
  "success": true,
  "message": "获取交货单详情成功",
  "data": {
    "detail": {
      "meta": {
        "id": "DEL-2024-100",
        "posted": false,
        "readyToPost": true
      },
      "actualGIDate": "01/20/2024",
      "plannedGIDate": "01/20/2024",
      "actualDate": "01/20/2024",
      "loadingDate": "01/22/2024",
      "deliveryDate": "01/25/2024",
      "pickingStatus": "Completed",
      "overallStatus": "In Process",
      "giStatus": "Not Started",
      "shipToParty": "CUST-12345",
      "address": "123 Main St, City, State 12345",
      "grossWeight": "125.5",
      "grossWeightUnit": "KG",
      "netWeight": "120.0",
      "netWeightUnit": "KG",
      "volume": "2.5",
      "volumeUnit": "M3",
      "priority": "High",
      "shippingPoint": "1000" // 任何字段可能缺省/非法
    },
    "items": {
      "items": [
        {
          "dlvId": "xxx", // 与上面的id对应
          "item": "10",
          "material": "MAT-001",
          "deliveryQuantity": "100",
          "deliveryQuantityUnit": "EA",
          "pickingQuantity": "100",
          "pickingQuantityUnit": "EA",
          "pickingStatus": "Completed",
          "confirmationStatus": "Confirmed",
          "salesOrder": "SO-2024-001",
          "itemType": "TAN",
          "originalDelivertyQuantity": "100 EA",
          "conversionRate": "1.000",
          "baseUnitDeliveryQuantity": "100 EA",
          "grossWeight": "50.0 KG",
          "netWeight": "48.0 KG",
          "volume": "1.2 M3",
          "plant": "1000",
          "storageLocation": "0001",
          "storageLocationDescription": "Main Warehouse",
          "storageBin": "A-01-01",
          "materialAvailability": "2024-01-15",
        } // ref/as  OutboundItem
      ]
    }
  }
}
```

### 5. 物品批量查询验证 - `/outbound-delivery/items-tab-query`

**请求方法**: POST

**功能**: 批量验证和补全交货单物品信息

**请求参数**:

```json
[
  // ref Outbound-Item[]
]
```

**响应格式**:

```json
{
  "success": true,
  "message": "批量查询成功",
  "data": {
    "result": {
      "allDataLegal": 1,
      "badRecordIndices": []
    },
    "breakdowns": [
      // ref Outbound-Item[]
    ]
  }
}
```

### 6. 按ID批量提交发货过账 - `/outbound-delivery/post-gis-by-id`

**请求方法**: POST

**功能**: 根据交货单ID列表批量提交发货过账

**请求参数**:

```json
{
  "deliveryIds": ["DEL-2024-100", "DEL-2024-101"]
}
```

**响应格式**:

```json
{
  "success": true,
  "message": "Post GIs成功",
  "data": {
    "breakdowns": [
      {
        "outboundDelivery": "DEL-2024-100",
        "pickingDate": "2024-01-20",
        "pickingStatus": "Completed",
        "giStatus": "Posted"
      },
      {
        "outboundDelivery": "DEL-2024-101",
        "pickingDate": "2024-01-21",
        "pickingStatus": "Completed",
        "giStatus": "Posted"
      } // 这里返回的是summary数据
    ]
  }
}
```

### 7. 提交发货过账 - `/outbound-delivery/post-gis`

**请求方法**: POST

**功能**: 提交发货过账数据，更新交货单状态。
**说明，这里是一个复合的服务地址**: 提交新的详细数据，并触发post。可以直接符合items-tab-query并用新的数据进行post-gis-by-id

**请求参数**:

```json
[
  {
    "deliveryDetail": {
      "meta": {
        "id": "DEL-2024-100",
        "posted": false,
        "readyToPost": true
      },
      "actualGIDate": "01/20/2024",
      "plannedGIDate": "01/20/2024",
      "grossWeight": "125.5",
      "grossWeightUnit": "KG",
      "netWeight": "120.0",
      "netWeightUnit": "KG",
      "volume": "2.5",
      "volumeUnit": "M3" // 任何字段可能缺省/非法
    },
    "items": [
      // ref OutboundItem[]
    ]
  }
]
```

**响应格式**:

```json
{
  "success": true,
  "message": "Post GIs成功",
  "data": {
    "breakdowns": [
      {
        "detail": {
          "meta": {
            "id": "DEL-2024-100",
            "posted": true,
            "readyToPost": true
          },
          "actualGIDate": "01/20/2024",
          "plannedGIDate": "01/20/2024",
          "pickingStatus": "Completed",
          "overallStatus": "Completed",
          "giStatus": "Posted"
        },
        "items": [
          {
            "item": "10",
            "material": "MAT-001",
            "pickingStatus": "Completed",
            "confirmationStatus": "Posted"
          }
        ]
      }
    ]
  }
}
```

## 数据字段说明

- 这里为AI生成，释义的参考价值有限

### 销售订单字段 (Sales Orders)

- `id`: 唯一表示
- `plannedCreationDate`: 计划创建日期
- `plannedGIDate`: 计划发货日期
- `shippingPoint`: 装运点
- `shipToParty`: 送达方
- `grossWeight`: 毛重

### 交货单头部字段 (Delivery Detail)

- `meta.id`: 交货单号
- `meta.posted`: 是否已过账
- `meta.readyToPost`: 是否准备过账
- `actualGIDate`: 实际发货日期
- `plannedGIDate`: 计划发货日期
- `actualDate`: 实际日期
- `loadingDate`: 装载日期
- `deliveryDate`: 交货日期
- `pickingStatus`: 拣配状态
- `overallStatus`: 总体状态
- `giStatus`: 发货状态
- `shipToParty`: 送达方
- `address`: 地址
- `grossWeight`: 毛重
- `grossWeightUnit`: 毛重单位
- `netWeight`: 净重
- `netWeightUnit`: 净重单位
- `volume`: 体积
- `volumeUnit`: 体积单位
- `priority`: 优先级
- `shippingPoint`: 装运点

### 交货单物品字段 (Delivery Items) ref/as Sales-Order-Item

- `item`: 行项目号
- `material`: 物料号
- `deliveryQuantity`: 交货数量
- `deliveryQuantityUnit`: 交货数量单位
- `pickingQuantity`: 拣配数量
- `pickingQuantityUnit`: 拣配数量单位
- `pickingStatus`: 拣配状态
- `confirmationStatus`: 确认状态
- `salesOrder`: 销售订单号
- `itemType`: 项目类型
- `originalDelivertyQuantity`: 原始交货数量
- `conversionRate`: 转换率
- `baseUnitDeliveryQuantity`: 基本单位交货数量
- `grossWeight`: 毛重
- `netWeight`: 净重
- `volume`: 体积
- `plant`: 工厂
- `storageLocation`: 库存地点
- `storageLocationDescription`: 库存地点描述
- `storageBin`: 储位
- `materialAvailability`: 物料可用性日期

## 业务流程说明

### 创建出库交货单流程 (Create Outbound Delivery)

1. **参数输入阶段**: 用户输入送达方、计划创建日期、TM相关性等查询条件
2. **获取销售订单**: 调用 `/outbound-delivery/get-sales-orders` 获取符合条件的销售订单列表
3. **选择订单**: 用户从列表中选择需要创建交货单的销售订单
4. **创建交货单**: 调用 `/outbound-delivery/create-from-orders` 创建出库交货单

### 管理出库交货单流程 (Manage Outbound Deliveries)

1. **查询阶段**: 用户输入总体状态、创建人等查询条件
2. **获取交货单列表**: 调用 `/outbound-delivery/get-deliveries-summary` 获取交货单汇总列表
3. **拣配操作**: 用户可以点击"Pick"按钮进入拣配界面
4. **批量过账**: 用户可以选择多个交货单进行批量发货过账，调用 `/outbound-delivery/post-gis-by-id`

### 拣配出库交货单流程 (Pick Outbound Delivery)

1. **获取详情阶段**: 输入交货单ID，调用 `/outbound-delivery/get-detail` 获取完整交货单信息
2. **拣配信息查看**:
   - **Picking标签页**: 显示物品列表，支持查看和编辑物品详情
   - **GI标签页**: 显示发货汇总信息
3. **物品详情编辑**:
   - 用户可以点击">"按钮进入物品详情页面
   - 编辑交货数量、库存地点等信息
   - 系统调用 `/outbound-delivery/items-tab-query` 进行实时验证
4. **发货过账**: 调用 `/outbound-delivery/post-gis` 提交发货过账

### 关键业务规则

- 只有拣配完成的交货单才能进行发货过账
- 发货过账后交货单状态变为"Posted"，不能再修改
- 物品数据修改时需要实时验证，验证失败的记录会在 `badRecordIndices` 中标识
- 交货单的总重量和体积会根据物品明细自动计算
- 支持多种计量单位的转换和显示

## 技术实现说明

### 前端架构

- **Create应用**: 单阶段应用，使用VarTree管理查询条件和销售订单列表
- **Manage应用**: 集成Pick应用的复合应用，支持应用间切换
- **Pick应用**: 双阶段应用，支持列表查看和物品详情编辑

### 状态管理

- **Create**: 通过选择销售订单创建交货单
- **Manage**: 查看交货单列表，支持拣配和批量过账操作
- **Pick**: 详细的拣配和发货过账操作

### 数据流向

1. **查询流**: 查询条件 → 后端接口 → VarTree数据结构
2. **验证流**: 用户输入 → `items-tab-query` → 实时验证反馈
3. **过账流**: 交货单数据 → `post-gis` 接口 → 状态更新

### 错误处理

- 所有接口调用都包含 `success` 字段用于状态判断
- `items-tab-query` 返回 `badRecordIndices` 数组标识验证失败的记录
- 前端根据验证结果设置 `config.data.validation` 属性控制UI显示
- 发货过账失败时显示具体错误信息

### 界面特性

- **FilterTabs组件**: Pick应用中的Picking/GI标签页切换
- **动态按钮**: 根据交货单状态动态显示操作按钮
- **实时计算**: GI标签页中的汇总信息实时计算显示
- **数据验证**: 物品编辑时的实时数据验证和错误提示
