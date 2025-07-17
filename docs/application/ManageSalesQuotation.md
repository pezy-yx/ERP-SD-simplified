## 前后端接口文档

### 1. 获取报价单详情 (Fetch Quotation Details)

* **URL:** `/api/quotation/details`
* **方法:** `POST`
* **用途:** 用于根据销售报价单ID获取单个报价单的详细信息。

* **请求体 (Request Body):**
    * `Content-Type`: `application/json`

    ```json
    {
        "salesQuotationId": 12345 // number, 销售报价单号
    }
    ```

* **成功响应 (Success Response):**
    * `Content-Type`: `application/json`

    ```json
    {
        "success": true, // boolean, 表示请求是否成功
        "data": {
            "quotationData": { // VarNodeValue 类型，包含报价单的完整数据结构
                // ... 详细报价单数据，例如：
                "meta": {
                    "id": "string" // ID
                },
                "basicInfo": {
                    "quotation": "string", // 报价单ID
                    "soldToParty": "string", // 售达方
                    "shipToParty": "string", // 送达方
                    "customerReference": "string", // 客户参考
                    "netValue": "string", // 净值
                    "netValueUnit": "string", // 净值单位
                    "customerReferenceDate": "date" // 客户参考日期
                },
                "itemOverview": {
                    "validFrom": "date", // 有效期从
                    "validTo": "date", // 有效期至
                    "reqDelivDate": "date", // 请求交货日期
                    "expectOralVal": "string", // 预期口头值
                    "expectOralValUnit": "string", // 预期口头值单位
                    "items": [ // 报价单项目列表
                        {
                            "item": "string", // 项目
                            "material": "string", // 物料
                            "orderQuantity": "string", // 订单数量
                            "orderQuantityUnit": "string", // SU
                            "description": "string", // 描述
                            "reqDelivDate": "date", // 请求交货日期
                            "netValue": "string", // 净值
                            "netValueUnit": "string", // 净值单位
                            "taxValue": "string", // 税值
                            "taxValueUnit": "string", // 税值单位
                            "pricingDate": "date", // 定价日期
                            "orderProbability": "string", // 订单概率
                            "pricingElements": [ // 定价元素列表
                                {
                                    "cnty": "string", // 国家
                                    "name": "string", // 名称
                                    "amount": "string", // 金额
                                    "city": "string", // 城市
                                    "per": "string", // 每
                                    "uom": "string", // 计量单位
                                    "conditionValue": "string", // 条件值
                                    "curr": "string", // 货币
                                    "status": "string", // 状态
                                    "numC": "string",
                                    "atoMtsComponent": "string",
                                    "oun": "string",
                                    "cconDe": "string",
                                    "un": "string",
                                    "conditionValue2": "string",
                                    "cdCur": "string",
                                    "stat": "boolean" // 统计
                                }
                            ]
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
        "success": false, // boolean, 表示请求是否失败
        "message": "Error message" // string, 错误信息
    }
    ```

### 2. 搜索报价单 (Search Quotations)

* **URL:** `/api/quotation/search`
* **方法:** `POST`
* **用途:** 根据查询条件搜索报价单列表。

* **请求体 (Request Body):**
    * `Content-Type`: `application/json`

    ```json
    {
        "salesQuotation": 12345, // number (可选), 销售报价单号
        "soldToParty": "string" // string (可选), 售达方
        "customerReference": "string", // string (可选), 客户参考
        "overallStatus": "string", // string (可选), 整体状态 (例如: 'New', 'Open', 'In Process', 'Completed')
        "latestExpiration": "date" // date (可选), 最新过期日期
    }
    ```

* **成功响应 (Success Response):**
    * `Content-Type`: `application/json`

    ```json
    {
        "success": true, // boolean, 表示请求是否成功
        "data": {
            "quotationStruct": { // NodeStructure 类型
                "currentValue": [ // QuotationData[] 或 QuotationData，报价单数据列表或单个对象
                    {
                        "salesQuotation": 12345, // number, 销售报价单号
                        "soldToParty": "string", // string, 售达方
                        "customerReference": "string", // string, 客户参考
                        "overallStatus": "string", // string, 整体状态
                        "latestExpiration": "string", // string, 最新过期日期
                        "id": "number | string (可选)", // 可选的 ID 字段
                        "items": "any[] (可选)" // 假设报价单详情有物品列表
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
        "success": false, // boolean, 表示请求是否失败
        "message": "Error message" // string, 错误信息 (例如: "未找到报价单信息!")
    }
    ```

### 3. 更新报价单 (Update Quotation)

* **URL:** `/api/quotation/update`
* **方法:** `POST`
* **用途:** 用于更新现有报价单的信息。

* **请求体 (Request Body):**
    * `Content-Type`: `application/json`

    ```json
    {
        "quotation": { // VarNodeValue 类型，包含要更新的报价单的完整数据结构
            // ... 与 "获取报价单详情" 成功响应中 `quotationData` 相同的结构
            // 确保包含 `id` 或 `salesQuotation` 以标识要更新的报价单
        }
    }
    ```

* **成功响应 (Success Response):**
    * `Content-Type`: `application/json`

    ```json
    {
        "success": true, // boolean, 表示请求是否成功
        "data": {
            "quotationData": { // VarNodeValue 类型，包含更新后的报价单数据
                // ... 与 "获取报价单详情" 成功响应中 `quotationData` 相同的结构
            }
        }
    }
    ```

* **错误响应 (Error Response):**
    * `Content-Type`: `application/json`

    ```json
    {
        "success": false, // boolean, 表示请求是否失败
        "message": "Error message" // string, 错误信息 (例如: "保存失败！")
    }
    ```

### 4. 创建报价单 (Create Quotation)

* **URL:** `/api/quotation/create`
* **方法:** `POST`
* **用途:** 用于创建新的报价单。

* **请求体 (Request Body):**
    * `Content-Type`: `application/json`

    ```json
    {
        "quotation": { // VarNodeValue 类型，包含新报价单的完整数据结构
            // ... 与 "获取报价单详情" 成功响应中 `quotationData` 相同的结构
            // 通常不包含 `id` 或 `salesQuotation`，由后端生成
        }
    }
    ```

* **成功响应 (Success Response):**
    * `Content-Type`: `application/json`

    ```json
    {
        "success": true, // boolean, 表示请求是否成功
        "data": {
            "quotationData": { // VarNodeValue 类型，包含新创建的报价单数据（通常会包含后端生成的ID/销售报价单号）
                // ... 与 "获取报价单详情" 成功响应中 `quotationData` 相同的结构
            }
        }
    }
    ```

* **错误响应 (Error Response):**
    * `Content-Type`: `application/json`

    ```json
    {
        "success": false, // boolean, 表示请求是否失败
        "message": "Error message" // string, 错误信息 (例如: "创建失败！")
    }
    ```

### 5. 物品条件批量查询/验证 (Items Tab Query)

* **URL:** `/api/app/inquiry/items-tab-query`
* **方法:** `POST`
* **用途:** 询价单批量查询，向后端发送 `VarNode[]` (物品节点数组)，返回 `Net Value` 和 `Expect. Oral Val` (包括值和单位)，以及每个物品的详细信息。该方法还会根据返回的 `badRecordIndices` 设置每个 `VarNode` 的 `config.data.validation` 属性。

* **请求体 (Request Body):**
    * `Content-Type`: `application/json`

    ```json
    [
        {
            // VarNode 的值结构，代表一个物品
            // 例如 (部分字段):
            "item": "string",
            "material": "string",
            "orderQuantity": "string",
            "orderQuantityUnit": "string",
            "description": "string",
            "reqDelivDate": "date",
            "netValue": "string",
            "netValueUnit": "string",
            "taxValue": "string",
            "taxValueUnit": "string",
            "pricingDate": "date",
            "orderProbability": "string",
            "pricingElements": [
                {
                    "cnty": "string",
                    "name": "string",
                    "amount": "string",
                    // ... 其他定价元素字段
                }
            ]
        }
        // ... 更多物品对象
    ]
    ```

* **成功响应 (Success Response):**
    * `Content-Type`: `application/json`

    ```json
    {
        "success": true, // boolean, 表示请求是否成功
        "data": {
            "generalData": {
                "netValue": "string", // 净值
                "netValueUnit": "string", // 净值单位
                "expectOralVal": "string", // 预期口头值
                "expectOralValUnit": "string" // 预期口头值单位
            },
            "breakdowns": [ // 每个物品的详细信息
                {
                    // ... 与请求体中物品对象相同的结构，可能包含更新后的值
                    "pricingElements": [
                        // ... 定价元素，可能包含更新后的值
                    ]
                }
                // ... 更多物品的详细信息
            ],
            "result": {
                "allDataLegal": 0 | 1, // number (1表示所有数据合法，0表示存在不合法数据)
                "badRecordIndices": [ // number[], 存在不合法数据的物品索引列表 (从0开始)
                    // 例如: 0, 2
                ]
            }
        }
    }
    ```

* **错误响应 (Error Response):**
    * `Content-Type`: `application/json`

    ```json
    {
        "success": false, // boolean, 表示请求是否失败
        "message": "Error message" // string, 错误信息 (例如: "批量查询失败")
    }
    ```