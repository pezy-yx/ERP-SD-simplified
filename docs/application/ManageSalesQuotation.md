# 前后端接口文档

## 概述

本文档旨在详细描述前端与后端交互的 API 接口。所有接口均采用 `POST` 方法，请求和响应的数据格式均为 `application/json`。

## 通用响应结构

所有接口的成功响应都包含 `success` 字段指示操作结果，以及一个 `data` 字段承载具体业务数据。错误响应则包含 `success: false` 和 `message` 字段。

```json
// 成功响应示例
{
    "success": true,
    "message": "操作成功信息", // 可选
    "data": {
        // 具体业务数据
    }
}

// 错误响应示例
{
    "success": false,
    "message": "错误信息"
}

```

-----

## 接口详情

### 1\. 报价单搜索 (Search Quotations)

  * **URL:** `/search`

  * **方法:** `POST`

  * **用途:** 根据提供的查询条件搜索报价单列表。

  * **请求体 (Request Body):**

      * `Content-Type`: `application/json`

    ```json
    {
        "salesQuotation": 12345, // number (可选), 销售报价单号
        "soldToParty": "string", // string (可选), 售达方
        "customerReference": "string", // string (可选), 客户参考
        "overallStatus": "string", // string (可选), 整体状态 (例如: 'New', 'Open', 'In Process', 'Completed')
        "latestExpiration": "date" // string (可选), 最新过期日期 (从前端搜索树结构推断)
    }
    ```

  * **成功响应 (Success Response):**

      * `Content-Type`: `application/json`

    ```json
    {
        "success": true,
        "data": {
            "quotationStruct": { // NodeStructure 类型
                "varType": "dict",
                "nodeType": "dict",
                "name": "quotation",
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
                    // ... 更多 QuotationData 对象
                ],
                "config": {},
                "isEditable": false,
                "children": [ // 定义了每个字段的类型和属性
                    {
                        "varType": "number",
                        "nodeType": "leaf",
                        "name": "salesQuotation",
                        "isEditable": false
                    },
                    {
                        "varType": "string",
                        "nodeType": "leaf",
                        "name": "soldToParty",
                        "isEditable": true
                    },
                    {
                        "varType": "string",
                        "nodeType": "leaf",
                        "name": "customerReference",
                        "isEditable": false
                    },
                    {
                        "varType": "selection",
                        "nodeType": "leaf",
                        "name": "overallStatus",
                        "isEditable": true,
                        "config": {
                            "options": ["New", "Open", "In Process", "Completed"]
                        }
                    },
                    {
                        "varType": "date",
                        "nodeType": "leaf",
                        "name": "latestExpiration",
                        "isEditable": false
                    }
                ]
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * `Content-Type`: `application/json`

    ```json
    {
        "success": false,
        "message": "Quotation search failed, please try again later.",
        "error": "错误信息" // 后端返回的具体错误信息
    }
    ```

### 2\. 获取报价单详情 (Get Quotation Details)

  * **URL:** `/details`

  * **方法:** `POST`

  * **用途:** 根据销售报价单ID获取单个报价单的详细信息。

  * **请求体 (Request Body):**

      * `Content-Type`: `application/json`

    ```json
    {
        "salesQuotationId": 12345 // number, 销售报价单号 (推断)
    }
    ```

  * **成功响应 (Success Response):**

      * `Content-Type`: `application/json`

    ```json
    {
        "success": true,
        "message": "初始quotation成功",
        "data": {
            "quotationData": { // 包含报价单的完整数据结构
                "meta": {
                    "id": "QUO-2024-001"
                },
                "basicInfo": {
                    "quotation": "QUO-2024-001",
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
                    "items": [ // 报价单项目列表
                        {
                            "material": "MAT-001",
                            "orderQuantity": "100",
                            "su": 10,
                            "altItm": 1,
                            "description": "高品质电子元件"
                        },
                        {
                            "material": "MAT-002",
                            "orderQuantity": "50",
                            "su": 5,
                            "altItm": 2,
                            "description": "精密传感器模块"
                        }
                    ]
                }
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * `Content-Type`: `application/json`

    ```json
    {
        "success": false,
        "message": "获取详情失败!" // 或其他错误信息
    }
    ```

### 3\. 更新报价单 (Update Quotation)

  * **URL:** `/update`

  * **方法:** `POST`

  * **用途:** 更新现有报价单的信息。

  * **请求体 (Request Body):**

      * `Content-Type`: `application/json`

    ```json
    {
        "quotation": { // 完整报价单数据结构，与 '获取报价单详情' 响应中的 quotationData 结构相似
            "meta": {
                "id": "QUO-2024-001" // string, 必须，用于标识要更新的报价单 (推断)
            },
            "basicInfo": {
                "quotation": "114514", // string (后端 mock 数据中的示例值)
                "soldToParty": "CUST-12345",
                // ... 其他基本信息
            },
            "itemOverview": {
                // ... 项目总览和项目详情
            }
        }
    }
    ```

  * **成功响应 (Success Response):**

      * `Content-Type`: `application/json`

    ```json
    {
        "success": true,
        "message": "更新成功",
        "data": {
            "quotationData": { // 回显更新后的报价单数据
                "meta": {
                    "id": "QUO-2024-001"
                },
                "basicInfo": {
                    "quotation": "114514",
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
                            "material": "MAT-001",
                            "orderQuantity": "100",
                            "su": 10,
                            "altItm": 1,
                            "description": "高品质电子元件"
                        },
                        {
                            "material": "MAT-002",
                            "orderQuantity": "50",
                            "su": 5,
                            "altItm": 2,
                            "description": "精密传感器模块"
                        }
                    ]
                }
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * `Content-Type`: `application/json`

    ```json
    {
        "success": false,
        "message": "更新失败！" // 或其他错误信息
    }
    ```

### 4\. 创建报价单 (Create Quotation)

  * **URL:** `/create`

  * **方法:** `POST`

  * **用途:** 创建新的报价单。

  * **请求体 (Request Body):**

      * `Content-Type`: `application/json`

    ```json
    {
        "quotation": { // 新报价单的初始数据结构
            // "meta": { "id": "" }, // 可选，预留或为空
            "basicInfo": {
                "quotation": "QUO-2024-001",
                "soldToParty": "NEW_CUSTOMER",
                // ... 其他基本信息
            },
            "itemOverview": {
                // ... 初始项目信息
            }
        }
    }
    ```

  * **成功响应 (Success Response):**

      * `Content-Type`: `application/json`
    ```json
    {
        "success": true,
        "message": "创建新的quotation成功",
        "data": {
            "quotationData": { // 回显新创建的报价单数据，应包含后端生成的 ID
                "meta": {
                    "id": "NEW-QUO-2024-XXX" // string, 后端生成的 ID (示例值)
                },
                "basicInfo": {
                    "quotation": "NEW-QUO-2024-XXX", // string, 后端生成的报价单号 (示例值)
                    // ... 其他数据
                },
                "itemOverview": {
                    // ...
                }
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * `Content-Type`: `application/json`

    ```json
    {
        "success": false,
        "message": "创建失败！" // 或其他错误信息
    }
    ```

### 5\. 物品条件批量查询/验证 (Items Tab Query)

  * **URL:** `quotation/items-tab-query`

  * **方法:** `POST`

  * **用途:** 批量查询，用于获取或验证一组物品的净值、预期口头值以及详细的定价元素。

  * **请求体 (Request Body):**

      * `Content-Type`: `application/json`

    ```json
    [
        {
            "item": "10", // string, 项目号 (从请求体或后端生成)
            "material": "MAT-001", // string, 物料 (从请求体或后端生成)
            "orderQuantity": "10", // string, 订单数量 (从请求体或后端生成)
            "orderQuantityUnit": "EA", // string, 订单数量单位 (前端 SU 对应)
            "description": "物料描述 A", // string, 描述 (从请求体或后端生成)
            "reqDelivDate": "2024-07-20", // string, 请求交货日期 (从请求体或后端生成)
            "netValue": "100", // string, 初始净值 (前端传入，后端用于计算)
            "netValueUnit": "USD", // string, 初始净值单位 (推断)
            "taxValue": "0", // string, 初始税值 (推断)
            "taxValueUnit": "USD", // string, 初始税值单位 (推断)
            "pricingDate": "2024-07-15", // string, 定价日期 (从请求体或后端生成)
            "orderProbability": "100", // string, 订单概率 (从请求体或后端生成)
            "pricingElements": [ // 可选，如果前端有初始的定价元素
                {
                    "cnty": "US",
                    "name": "Base Price",
                    "amount": "100",
                    "curr": "USD"
                    // ... 其他定价元素字段 (推断)
                }
            ]
        },
        {
            "item": "20",
            "material": "MAT-002",
            "orderQuantity": "5",
            "orderQuantityUnit": "PC",
            "description": "物料描述 B",
            "reqDelivDate": "2024-07-25",
            "netValue": "50",
            "netValueUnit": "USD",
            "taxValue": "0",
            "taxValueUnit": "USD",
            "pricingDate": "2024-07-15",
            "orderProbability": "80",
            "pricingElements": []
        }
        // ... 更多物品对象
    ]
    ```

  * **成功响应 (Success Response):**

      * `Content-Type`: `application/json`

    ```json
    {
        "success": true,
        "message": "价格查询成功",
        "data": {
            "result": {
                "allDataLegal": 1, // number (1表示所有数据合法，0表示存在不合法数据)
                "badRecordIndices": [] // number[], 存在不合法数据的物品索引列表 (从0开始，如果 allDataLegal 为 0 则有值)
            },
            "generalData": { // 整体数据概览
                "netValue": "150.00", // string, 总净值 (后端计算 `totalNetValue.toFixed(2)`)
                "netValueUnit": "USD", // string, 总净值单位
                "expectOralVal": "165.00", // string, 总预期口头值 (后端计算 `totalExpectOralVal.toFixed(2)`)
                "expectOralValUnit": "USD" // string, 总预期口头值单位
            },
            "breakdowns": [ // 每个物品的详细信息，包含计算后的值
                {
                    "item": "10", // string, 项目号 (从请求体或后端生成)
                    "material": "MAT-001", // string, 物料 (从请求体或后端生成)
                    "orderQuantity": "10", // string, 订单数量 (从请求体或后端生成)
                    "orderQuantityUnit": "EA", // string, 订单数量单位 (从请求体或后端生成)
                    "description": "物料描述 A", // string, 描述 (从请求体或后端生成)
                    "reqDelivDate": "2024-07-20", // string, 请求交货日期 (从请求体或后端生成)
                    "netValue": 100, // number, 计算后的净值 (后端计算 `parseFloat(item.netValue) || 0`)
                    "netValueUnit": "USD", // string, 计算后的净值单位
                    "taxValue": 15, // number, 计算后的税值 (后端计算 `itemNetValue * 0.15`)
                    "taxValueUnit": "USD", // string, 计算后的税值单位
                    "pricingDate": "2024-07-15", // string, 定价日期 (从请求体或后端生成)
                    "orderProbability": "100", // string, 订单概率 (从请求体或后端生成)
                    "pricingElements": [ // 计算后的定价元素列表
                        {
                            "cnty": "US",
                            "name": "Base Price",
                            "amount": "100.00",
                            "city": "USD",
                            "per": "1",
                            "uom": "EA",
                            "conditionValue": "100.00",
                            "curr": "USD",
                            "status": "Active",
                            "numC": "1",
                            "atoMtsComponent": "",
                            "oun": "",
                            "cconDe": "",
                            "un": "",
                            "conditionValue2": "100.00",
                            "cdCur": "USD",
                            "stat": true
                        },
                        {
                            "cnty": "US",
                            "name": "Tax",
                            "amount": "15.00",
                            "city": "USD",
                            "per": "1",
                            "uom": "EA",
                            "conditionValue": "15.00",
                            "curr": "USD",
                            "status": "Active",
                            "numC": "2",
                            "atoMtsComponent": "",
                            "oun": "",
                            "cconDe": "",
                            "un": "",
                            "conditionValue2": "15.00",
                            "cdCur": "USD",
                            "stat": true
                        }
                    ]
                }
                // ... 更多物品的详细信息
            ]
        }
    }
    ```