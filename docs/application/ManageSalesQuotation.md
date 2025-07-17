# 报价单管理 API 文档

本API文档描述了用于管理销售报价单的接口，包括查询、获取详情、创建、更新报价单以及查询项目明细。

## 基础URL

`[API_BASE_URL]`

-----

## 1\. 报价单搜索 (Search Quotations)

URL: `/api/quotation/search`

方法: `POST`
用途: 根据提供的查询条件搜索报价单列表。

### 请求体 (Request Body)

Content-Type: `application/json`
说明: 包含用于过滤报价单的条件。

```json
{
    "salesQuotation": 12345, // number (可选), 销售报价单号
    "soldToParty": "string", // string (可选), 售达方
    "customerReference": "string", // string (可选), 客户参考
    "overallStatus": "string", // string (可选), 整体状态 (例如: 'New', 'Open', 'In Process', 'Completed')
    "latestExpiration": "2025-07-20" // string (可选), 最新过期日期 (日期字符串，建议ISO 8601)
}
```

### 成功响应 (Success Response)

Content-Type: `application/json`
说明: 后端将搜索到的报价单数据封装在一个 `NodeStructure` 类型的 `quotationStruct` 对象中返回。实际的报价单列表位于 `quotationStruct.currentValue` 数组中。

```json
{
    "success": true,
    "message": "查询成功",
    "data": {
        "quotationStruct": { // NodeStructure 类型
            "varType": "dict", // 固定为 'dict'
            "nodeType": "dict", // 固定为 'dict'
            "name": "quotation", // 固定为 'quotation'
            "currentValue": [ // 实际的报价单数据列表
                {
                    "salesQuotation": 987654321, // number
                    "soldToParty": "Global Corp Inc.", // string
                    "customerReference": "PO-XYZ-789", // string
                    "overallStatus": "In Process", // string
                    "latestExpiration": "2025-12-31" // string (日期字符串)
                },
                {
                    "salesQuotation": 100000001,
                    "soldToParty": "ACME Ltd.",
                    "customerReference": "REF-ACME-001",
                    "overallStatus": "New",
                    "latestExpiration": "2025-07-20"
                }
            ]
        }
    }
}
```

### 错误响应 (Error Response)

Content-Type: `application/json`

```json
{
    "success": false,
    "message": "未找到报价单信息!" // 或其他错误信息
}
```

-----

## 2\. 获取报价单详情 (Get Quotation Details)

URL: `/api/quotation/details`

方法: `POST`
用途: 根据销售报价单ID获取单个报价单的详细信息。

### 请求体 (Request Body)

Content-Type: `application/json`
说明: 包含要查询的报价单ID。

```json
{
  "salesQuotationId": 987654321 // number, 销售报价单号
}
```

### 成功响应 (Success Response)

Content-Type: `application/json`
说明: 返回指定报价单的详细数据。

```json
{
  "success": true,
  "message": "获取报价单详情成功",
  "data": {
    "quotationData": {
      "meta": {
        "id": "123456789" // string, 元数据ID
      },
      "basicInfo": {
        "quotation": "987654321", // string, 报价单ID
        "soldToParty": "Global Corp Inc.", // string, 售达方
        "shipToParty": "Global Corp Inc. - Warehouse A", // string, 收货方
        "customerReference": "PO-XYZ-789", // string, 客户参考
        "netValue": 150000.00, // number, 净值
        "netValueUnit": "USD", // string, 净值单位
        "customerReferenceDate": "2024-01-10" // string (日期字符串), 客户参考日期
      },
      "itemOverview": {
        "validFrom": "2024-01-15", // string (日期字符串), 有效期从
        "validTo": "2025-12-31", // string (日期字符串), 有效期到
        "reqDelivDate": "2024-02-01", // string (日期字符串), 要求交货日期
        "expectOralVal": "150000", // string, 预期口头值
        "expectOralValUnit": "USD", // string, 预期口头值单位
        "items": [ // array, 报价单项目列表
          {
            "item": "10", // string, 项目
            "material": "PROD-A", // string, 物料
            "orderQuantity": "100", // string, 订单数量
            "orderQuantityUnit": "EA", // string, 订单数量单位
            "description": "产品A", // string, 描述
            "netValue": 100000.00, // number, 净值
            "netValueUnit": "USD", // string, 净值单位
            "taxValue": 15000.00, // number, 税值
            "taxValueUnit": "USD", // string, 税值单位
            "pricingDate": "2024-01-15", // string (日期字符串), 定价日期
            "orderProbability": "100", // string, 订单概率
            "pricingElements": [ // array, 定价元素列表
              {
                "cnty": "US", // string, 国家/地区
                "name": "BASE PRICE", // string, 名称
                "amount": "1000.00", // string, 金额
                "city": "NY", // string, 城市
                "per": "1", // string, 每
                "uom": "EA", // string, 计量单位
                "conditionValue": "100000.00", // string, 条件值
                "curr": "USD", // string, 货币
                "status": "Active", // string, 状态
                "numC": "1", // string, NumC
                "atoMtsComponent": "", // string, ATO/MTS 组件
                "oun": "", // string, OUn
                "cconDe": "", // string, CConDe
                "un": "", // string, Un
                "conditionValue2": "0.00", // string, 条件值2
                "cdCur": "USD", // string, CdCur
                "stat": false // boolean, 统计
              }
            ]
          }
        ]
      }
    }
  }
}
```

### 错误响应 (Error Response)

Content-Type: `application/json`

```json
{
    "success": false,
    "message": "报价单未找到!" // 或其他错误信息
}
```

-----

## 3\. 更新报价单 (Update Quotation)

URL: `/api/quotation/update`

方法: `POST`
用途: 更新现有报价单的信息。

### 请求体 (Request Body)

Content-Type: `application/json`
说明: 包含完整的报价单数据对象，其中包含要更新的字段。

```json
{
  "quotation": {
    "meta": {
      "id": "123456789" // string, 元数据ID
    },
    "basicInfo": {
      "quotation": "987654321", // string, 报价单ID
      "soldToParty": "Global Corp Inc. (Updated)", // string, 售达方
      "shipToParty": "Global Corp Inc. - Warehouse A", // string, 收货方
      "customerReference": "PO-XYZ-789-V2", // string, 客户参考
      "netValue": 150000.00, // number, 净值
      "netValueUnit": "USD", // string, 净值单位
      "customerReferenceDate": "2024-01-10" // string (日期字符串), 客户参考日期
    },
    "itemOverview": {
      "validFrom": "2024-01-15", // string (日期字符串), 有效期从
      "validTo": "2025-12-31", // string (日期字符串), 有效期到
      "reqDelivDate": "2024-02-01", // string (日期字符串), 要求交货日期
      "expectOralVal": "150000", // string, 预期口头值
      "expectOralValUnit": "USD", // string, 预期口头值单位
      "items": [ // array, 报价单项目列表
        {
          "item": "10", // string, 项目
          "material": "PROD-A", // string, 物料
          "orderQuantity": "100", // string, 订单数量
          "orderQuantityUnit": "EA", // string, 订单数量单位
          "description": "产品A (Updated)", // string, 描述
          "pricingElements": [ // array, 定价元素列表
            {
              "cnty": "US", // string, 国家/地区
              "name": "BASE PRICE", // string, 名称
              "amount": "1000.00", // string, 金额
              "city": "NY", // string, 城市
              "per": "1", // string, 每
              "uom": "EA", // string, 计量单位
              "conditionValue": "100000.00", // string, 条件值
              "curr": "USD", // string, 货币
              "status": "Active", // string, 状态
              "numC": "1", // string, NumC
              "atoMtsComponent": "", // string, ATO/MTS 组件
              "oun": "", // string, OUn
              "cconDe": "", // string, CConDe
              "un": "", // string, Un
              "conditionValue2": "0.00", // string, 条件值2
              "cdCur": "USD", // string, CdCur
              "stat": false // boolean, 统计
            }
          ]
        }
      ]
    }
  }
}
```

### 成功响应 (Success Response)

Content-Type: `application/json`
说明: 返回更新后的报价单数据。

```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "quotationData": {
      "meta": {
        "id": "123456789"
      },
      "basicInfo": {
        "quotation": "987654321",
        "soldToParty": "Global Corp Inc. (Updated)",
        "shipToParty": "Global Corp Inc. - Warehouse A",
        "customerReference": "PO-XYZ-789-V2",
        "netValue": 150000.00,
        "netValueUnit": "USD",
        "customerReferenceDate": "2024-01-10"
      },
      "itemOverview": {
        "validFrom": "2024-01-15",
        "validTo": "2025-12-31",
        "reqDelivDate": "2024-02-01",
        "expectOralVal": "150000",
        "expectOralValUnit": "USD",
        "items": [
          {
            "item": "10",
            "material": "PROD-A",
            "orderQuantity": "100",
            "orderQuantityUnit": "EA",
            "description": "产品A (Updated)",
            "pricingElements": [
              {
                "cnty": "US",
                "name": "BASE PRICE",
                "amount": "1000.00",
                "city": "NY",
                "per": "1",
                "uom": "EA",
                "conditionValue": "100000.00",
                "curr": "USD",
                "status": "Active",
                "numC": "1",
                "atoMtsComponent": "",
                "oun": "",
                "cconDe": "",
                "un": "",
                "conditionValue2": "0.00",
                "cdCur": "USD",
                "stat": false
              }
            ]
          }
        ]
      }
    }
  }
}
```

### 错误响应 (Error Response)

Content-Type: `application/json`

```json
{
    "success": false,
    "message": "更新失败!" // 或其他错误信息
}
```

-----

## 4\. 创建报价单 (Create Quotation)

URL: `/api/quotation/create`

方法: `POST`
用途: 创建一个新的报价单。

### 请求体 (Request Body)

Content-Type: `application/json`
说明: 包含要创建的报价单的初始数据。

```json
{
  "quotation": {
    "meta": {
      "id": "NEW_QUOTATION_ID" // string (占位符), 新报价单的元数据ID
    },
    "basicInfo": {
      "quotation": "NEW_QUOTATION_NUM", // string (占位符), 新报价单的编号
      "soldToParty": "New Customer Corp.", // string, 售达方
      "shipToParty": "New Customer Corp. - HQ", // string, 收货方
      "customerReference": "NEW-REF-001", // string, 客户参考
      "netValue": 75000.00, // number, 净值
      "netValueUnit": "USD", // string, 净值单位
      "customerReferenceDate": "2025-01-01" // string (日期字符串), 客户参考日期
    },
    "itemOverview": {
      "validFrom": "2025-01-01", // string (日期字符串), 有效期从
      "validTo": "2025-12-31", // string (日期字符串), 有效期到
      "reqDelivDate": "2025-01-15", // string (日期字符串), 要求交货日期
      "expectOralVal": "75000", // string, 预期口头值
      "expectOralValUnit": "USD", // string, 预期口头值单位
      "items": [ // array, 报价单项目列表
        {
          "item": "10", // string, 项目
          "material": "NEW-PROD-X", // string, 物料
          "orderQuantity": "50", // string, 订单数量
          "orderQuantityUnit": "EA", // string, 订单数量单位
          "description": "新产品X", // string, 描述
          "pricingElements": [] // array, 定价元素列表
        }
      ]
    }
  }
}
```

### 成功响应 (Success Response)

Content-Type: `application/json`
说明: 返回新创建的报价单数据，通常包含后端生成的ID和编号。

```json
{
  "success": true,
  "message": "创建成功",
  "data": {
    "quotationData": {
      "meta": {
        "id": "GENERATED_ID_12345" // string, 后端生成的ID
      },
      "basicInfo": {
        "quotation": "GENERATED_NUM_98765", // string, 后端生成的报价单编号
        "soldToParty": "New Customer Corp.",
        "shipToParty": "New Customer Corp. - HQ",
        "customerReference": "NEW-REF-001",
        "netValue": 75000.00,
        "netValueUnit": "USD",
        "customerReferenceDate": "2025-01-01"
      },
      "itemOverview": {
        "validFrom": "2025-01-01",
        "validTo": "2025-12-31",
        "reqDelivDate": "2025-01-15",
        "expectOralVal": "75000",
        "expectOralValUnit": "USD",
        "items": [
          {
            "item": "10",
            "material": "NEW-PROD-X",
            "orderQuantity": "50",
            "orderQuantityUnit": "EA",
            "description": "新产品X",
            "pricingElements": [],
            "netValue": 65000,
            "netValueUnit": "USD",
            "taxValue": 9750,
            "taxValueUnit": "USD",
            "pricingDate": "2025-01-01",
            "orderProbability": "100"
          }
        ]
      }
    }
  }
}
```

### 错误响应 (Error Response)

Content-Type: `application/json`

```json
{
    "success": false,
    "message": "创建失败!" // 或其他错误信息
}
```

-----

## 5\. 查询项目明细 (Query Item Details)

URL: `/api/quotation/items-tab-query`

方法: `POST`
用途: 查询报价单中项目的详细信息，包括定价元素等。

### 请求体 (Request Body)

Content-Type: `application/json`
说明: 包含要查询的报价单ID和需要计算明细的项目列表。

```json
{
  "quotationId": "987654321", // string, 报价单ID
  "itemOverview": {
    "items": [ // array, 项目列表 (可包含部分或全部字段)
      {
        "item": "10", // string (可选), 项目
        "material": "PROD-A", // string (可选), 物料
        "orderQuantity": "100", // string (可选), 订单数量
        "orderQuantityUnit": "EA", // string (可选), 订单数量单位
        "description": "产品A", // string (可选), 描述
        "reqDelivDate": "2024-02-15", // string (日期字符串，可选), 要求交货日期
        "pricingDate": "2024-01-15", // string (日期字符串，可选), 定价日期
        "orderProbability": "100" // string (可选), 订单概率
      },
      {
        "item": "20",
        "material": "PROD-B",
        "orderQuantity": "50",
        "orderQuantityUnit": "EA",
        "description": "产品B",
        "reqDelivDate": "2024-02-15",
        "pricingDate": "2024-01-15",
        "orderProbability": "100"
      }
    ]
  }
}
```

### 成功响应 (Success Response)

Content-Type: `application/json`
说明: 返回包含每个项目计算后的详细信息和定价明细。

```json
{
  "success": true,
  "message": "价格查询成功",
  "data": {
    "result": {
      "allDataLegal": 1, // number (1表示所有数据合法，0表示部分不合法)
      "breakdowns": [ // array, 处理后的项目明细列表
        {
          "item": "10", // string, 项目
          "material": "PROD-A", // string, 物料
          "orderQuantity": "100", // string, 订单数量
          "orderQuantityUnit": "EA", // string, 订单数量单位
          "description": "产品A", // string, 描述
          "reqDelivDate": "2024-02-15", // string (日期字符串), 要求交货日期
          "netValue": 100000, // number, 净值
          "netValueUnit": "USD", // string, 净值单位
          "taxValue": 15000, // number, 税值
          "taxValueUnit": "USD", // string, 税值单位
          "pricingDate": "2024-01-15", // string (日期字符串), 定价日期
          "orderProbability": "100", // string, 订单概率
          "pricingElements": [ // array, 定价元素列表
            {
              "cnty": "US", // string, 国家/地区
              "name": "BASE PRICE", // string, 名称
              "amount": "1000.00", // string, 金额
              "city": "NY", // string, 城市
              "per": "1", // string, 每
              "uom": "EA", // string, 计量单位
              "conditionValue": "100000.00", // string, 条件值
              "curr": "USD", // string, 货币
              "status": "Active", // string, 状态
              "numC": "1", // string, NumC
              "atoMtsComponent": "", // string, ATO/MTS 组件
              "oun": "", // string, OUn
              "cconDe": "", // string, CConDe
              "un": "", // string, Un
              "conditionValue2": "15000.00", // string, 条件值2
              "cdCur": "USD", // string, CdCur
              "stat": true // boolean, 统计
            }
          ]
        }
      ]
    }
  }
}
```

### 错误响应 (Error Response)

Content-Type: `application/json`

```json
{
    "success": false,
    "message": "项目明细查询失败!" // 或其他错误信息
}
```