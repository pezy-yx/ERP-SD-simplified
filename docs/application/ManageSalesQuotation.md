# ManageSalesQuotation接口文档

## 概述

本文档旨在详细描述前端与后端交互的 API 接口。所有接口均采用 `POST` 方法，请求和响应的数据格式均为 `application/json`。

## 通用响应结构

除了 `/api/app/inquiry/items-tab-query` 接口外，大部分接口的成功响应都包含 `success` 字段指示操作结果，以及一个 `data` 字段承载具体业务数据。错误响应则包含 `success: false` 和 `message` 字段。

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

  * **URL:** `/api/quotation/search`

  * **方法:** `POST`

  * **用途:** 根据提供的查询条件搜索报价单列表。

  * **请求体 (Request Body):**

      * `Content-Type`: `application/json`
      * **说明:** 包含用于过滤报价单的条件。

    <!-- end list -->

    ```json
    {
        "salesQuotation": 12345, // number (可选), 销售报价单号
        "soldToParty": "string", // string (可选), 售达方
        "customerReference": "string", // string (可选), 客户参考
        "overallStatus": "string", // string (可选), 整体状态 (例如: 'New', 'Open', 'In Process', 'Completed')
        "latestExpiration": "date" // date (可选), 最新过期日期 (日期字符串，格式待定，建议ISO 8601)
    }
    ```

  * **成功响应 (Success Response):**

      * `Content-Type`: `application/json`
      * **说明:** 后端将搜索到的报价单数据封装在一个 `NodeStructure` 类型的 `quotationStruct` 对象中返回。实际的报价单列表位于 `quotationStruct.currentValue` 数组中。

    <!-- end list -->

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
                        // ... 其他 QuotationData 字段 (如果有，后端实际数据为准)
                    },
                    {
                        "salesQuotation": 100000001,
                        "soldToParty": "ACME Ltd.",
                        "customerReference": "REF-ACME-001",
                        "overallStatus": "New",
                        "latestExpiration": "2025-07-20"
                    }
                    // ... 更多 QuotationData 对象
                ]
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * `Content-Type`: `application/json`

    <!-- end list -->

    ```json
    {
        "success": false,
        "message": "未找到报价单信息!" // 或其他错误信息
    }
    ```

-----

### 2\. 获取报价单详情 (Get Quotation Details)

  * **URL:** `/api/quotation/details`

  * **方法:** `POST`

  * **用途:** 根据销售报价单ID获取单个报价单的详细信息。

  * **请求体 (Request Body):**

      * `Content-Type`: `application/json`
      * **说明:** 包含要查询的销售报价单ID。

    <!-- end list -->

    ```json
    {
        "salesQuotationId": 12345 // number, 销售报价单号
    }
    ```

  * **成功响应 (Success Response):**

      * `Content-Type`: `application/json`
      * **说明:** 返回一个包含报价单完整详细数据的 `quotationData` 对象。

    <!-- end list -->

    ```json
    {
        "success": true,
        "message": "获取详情成功",
        "data": {
            "quotationData": { // 包含报价单的完整数据结构
                "meta": {
                    "id": "QUO-2024-001" // string, 报价单内部ID
                },
                "basicInfo": {
                    "quotation": "QUO-2024-001", // string, 报价单号
                    "soldToParty": "CUST-12345", // string, 售达方
                    "shipToParty": "SHIP-67890", // string, 送达方
                    "customerReference": "REF-ABC123", // string, 客户参考
                    "netValue": 15800.50, // number, 净值
                    "netValueUnit": "USD", // string, 净值单位
                    "customerReferenceDate": "2024-01-15" // string, 客户参考日期 (日期字符串)
                },
                "itemOverview": {
                    "validFrom": "2024-01-01", // string, 有效期从
                    "validTo": "2024-12-31", // string, 有效期至
                    "reqDelivDate": "2024-02-15", // string, 请求交货日期
                    "expectOralVal": "16000.00", // string, 预期口头值
                    "expectOralValUnit": "USD", // string, 预期口头值单位
                    "items": [ // 报价单项目列表
                        {
                            "item": "10", // string, 项目号 (前端 `code.txt` 有 `item` 字段)
                            "material": "MAT-001", // string, 物料
                            "orderQuantity": "100", // string, 订单数量
                            "orderQuantityUnit": "EA", // string, 订单数量单位 (后端`su`对应前端`orderQuantityUnit`)
                            "description": "物料描述 1", // string, 描述
                            "reqDelivDate": "2024-02-15", // string, 请求交货日期
                            "netValue": 10000, // number, 净值
                            "netValueUnit": "USD", // string, 净值单位
                            "taxValue": 1500, // number, 税值
                            "taxValueUnit": "USD", // string, 税值单位
                            "pricingDate": "2024-01-15", // string, 定价日期
                            "orderProbability": "100", // string, 订单概率
                            "pricingElements": [ // 定价元素列表
                                {
                                    "cnty": "USA", // string, 国家 (示例)
                                    "name": "BASE", // string, 名称
                                    "amount": "10000", // string, 金额
                                    "city": "NY", // string, 城市 (示例)
                                    "per": "1", // string, 每...
                                    "uom": "EA", // string, 计量单位
                                    "conditionValue": "10000", // string, 条件值
                                    "curr": "USD", // string, 货币
                                    "status": "Active", // string, 状态
                                    "numC": "1", // string
                                    "atoMtsComponent": "", // string
                                    "oun": "", // string
                                    "cconDe": "", // string
                                    "un": "", // string
                                    "conditionValue2": "10000", // string
                                    "cdCur": "USD", // string
                                    "stat": true // boolean, 统计
                                }
                            ]
                        }
                        // ... 更多项目
                    ]
                }
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * `Content-Type`: `application/json`

    <!-- end list -->

    ```json
    {
        "success": false,
        "message": "获取详情失败!" // 或其他错误信息
    }
    ```

-----

### 3\. 更新报价单 (Update Quotation)

  * **URL:** `/api/quotation/update`

  * **方法:** `POST`

  * **用途:** 更新现有报价单的信息。

  * **请求体 (Request Body):**

      * `Content-Type`: `application/json`
      * **说明:** 包含要更新的报价单的完整数据结构。该结构应与 `获取报价单详情` 接口的 `data.quotationData` 保持一致，并包含用于标识报价单的唯一字段（如 `meta.id` 或 `basicInfo.quotation`）。

    <!-- end list -->

    ```json
    {
        "quotation": { // 完整报价单数据结构，与 '获取报价单详情' 响应中的 quotationData 结构相同
            "meta": {
                "id": "QUO-2024-001" // string, 必须，用于标识要更新的报价单
            },
            "basicInfo": {
                // ... 更新后的基本信息
            },
            "itemOverview": {
                // ... 更新后的项目总览和项目详情
            }
        }
    }
    ```

  * **成功响应 (Success Response):**

      * `Content-Type`: `application/json`
      * **说明:** 返回更新成功的消息，并可能回显更新后的报价单数据。

    <!-- end list -->

    ```json
    {
        "success": true,
        "message": "保存成功",
        "data": {
            "quotationData": { // 回显更新后的报价单数据
                // ... 与请求体中的 `quotation` 结构相同
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * `Content-Type`: `application/json`

    <!-- end list -->

    ```json
    {
        "success": false,
        "message": "保存失败！" // 或其他错误信息
    }
    ```

-----

### 4\. 创建报价单 (Create Quotation)

  * **URL:** `/api/quotation/create`

  * **方法:** `POST`

  * **用途:** 创建新的报价单。

  * **请求体 (Request Body):**

      * `Content-Type`: `application/json`
      * **说明:** 包含新报价单的初始数据结构。通常不包含由后端生成的 ID 或报价单号。

    <!-- end list -->

    ```json
    {
        "quotation": { // 新报价单的初始数据结构，与 '获取报价单详情' 响应中的 quotationData 结构相同
            // "meta": { "id": "" }, // 预留或空
            "basicInfo": {
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
      * **说明:** 返回创建成功的消息，并回显新创建的报价单数据，其中应包含后端生成的 ID 或报价单号。

    <!-- end list -->

    ```json
    {
        "success": true,
        "message": "创建新的quotation成功",
        "data": {
            "quotationData": { // 回显新创建的报价单数据，包含后端生成的 ID
                "meta": {
                    "id": "NEW-QUO-2024-XXX" // string, 后端生成的 ID
                },
                "basicInfo": {
                    "quotation": "NEW-QUO-2024-XXX" // string, 后端生成的报价单号
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

    <!-- end list -->

    ```json
    {
        "success": false,
        "message": "创建失败！" // 或其他错误信息
    }
    ```

-----

### 5\. 物品条件批量查询/验证 (Items Tab Query)

  * **URL:** `/api/app/inquiry/items-tab-query`

  * **方法:** `POST`

  * **用途:** 询价单批量查询，用于获取或验证一组物品的净值、预期口头值以及详细的定价元素。

  * **请求体 (Request Body):**

      * `Content-Type`: `application/json`
      * **说明:** 一个数组，每个元素代表一个物品的详细信息。

    <!-- end list -->

    ```json
    [
        {
            "item": "10", // string, 项目号
            "material": "MAT-001", // string, 物料
            "orderQuantity": "10", // string, 订单数量
            "orderQuantityUnit": "EA", // string, 订单数量单位
            "description": "物料描述 A", // string, 描述
            "reqDelivDate": "2024-07-20", // string, 请求交货日期
            "netValue": "0", // string, 初始净值
            "netValueUnit": "", // string, 初始净值单位
            "taxValue": "0", // string, 初始税值
            "taxValueUnit": "", // string, 初始税值单位
            "pricingDate": "2024-07-15", // string, 定价日期
            "orderProbability": "100", // string, 订单概率
            "pricingElements": [ // 可选，如果前端有初始的定价元素
                {
                    "cnty": "USA",
                    "name": "PR00",
                    "amount": "100",
                    "curr": "USD"
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
            "netValue": "0",
            "netValueUnit": "",
            "taxValue": "0",
            "taxValueUnit": "",
            "pricingDate": "2024-07-15",
            "orderProbability": "80",
            "pricingElements": []
        }
        // ... 更多物品对象
    ]
    ```

  * **成功响应 (Success Response):**

      * `Content-Type`: `application/json`
      * **说明:** 返回查询的整体结果 (`generalData`)，每个物品的详细信息 (`breakdowns`)，以及数据合法性检查 (`result`)。

    <!-- end list -->

    ```json
    {
        "success": true,
        "message": "价格查询成功",
        "data": {
            "generalData": { // 整体数据概览
                "netValue": "15800.50", // string, 总净值
                "netValueUnit": "USD", // string, 总净值单位
                "expectOralVal": "16000.00", // string, 总预期口头值
                "expectOralValUnit": "USD" // string, 总预期口头值单位
            },
            "breakdowns": [ // 每个物品的详细信息，包含计算后的值
                {
                    "item": "10", // string, 项目号
                    "material": "MAT-001", // string, 物料
                    "orderQuantity": "10", // string, 订单数量
                    "orderQuantityUnit": "EA", // string, 订单数量单位
                    "description": "物料描述 A", // string, 描述
                    "reqDelivDate": "2024-07-20", // string, 请求交货日期
                    "netValue": 10000, // number, 计算后的净值
                    "netValueUnit": "USD", // string, 计算后的净值单位
                    "taxValue": 1500, // number, 计算后的税值 (示例按15%)
                    "taxValueUnit": "USD", // string, 计算后的税值单位
                    "pricingDate": "2024-07-15", // string, 定价日期
                    "orderProbability": "100", // string, 订单概率
                    "pricingElements": [ // 计算后的定价元素列表
                        {
                            "cnty": "USA",
                            "name": "BASE",
                            "amount": "10000",
                            "city": "NY",
                            "per": "1",
                            "uom": "EA",
                            "conditionValue": "10000",
                            "curr": "USD",
                            "status": "Active",
                            "numC": "1",
                            "atoMtsComponent": "",
                            "oun": "",
                            "cconDe": "",
                            "un": "",
                            "conditionValue2": "10000",
                            "cdCur": "USD",
                            "stat": true
                        },
                        { // 示例，可能添加税费等其他定价元素
                            "cnty": "USA",
                            "name": "TAX",
                            "amount": "1500",
                            "city": "NY",
                            "per": "1",
                            "uom": "EA",
                            "conditionValue": "1500",
                            "curr": "USD",
                            "status": "Active",
                            "numC": "2",
                            "atoMtsComponent": "",
                            "oun": "",
                            "cconDe": "",
                            "un": "",
                            "conditionValue2": "1500",
                            "cdCur": "USD",
                            "stat": true
                        }
                    ]
                }
                // ... 更多物品的详细信息
            ],
            "result": {
                "allDataLegal": 1, // number (1表示所有数据合法，0表示存在不合法数据)
                "badRecordIndices": [] // number[], 存在不合法数据的物品索引列表 (从0开始，如果 allDataLegal 为 0 则有值)
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * `Content-Type`: `application/json`

    <!-- end list -->

    ```json
    {
        "success": false,
        "message": "价格查询失败" // 或其他错误信息
    }
    ```