## ManageSalesQuotation接口文档

### 1\. 获取报价单详情 (Fetch Quotation Details)

  * [cite\_start]**URL:** `/api/quotation/details` [cite: 287]

  * [cite\_start]**方法:** `POST` [cite: 287]

  * [cite\_start]**用途:** 用于根据销售报价单ID获取单个报价单的详细信息。 [cite: 287, 289, 290]

  * **请求体 (Request Body):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 287]

    <!-- end list -->

    ```json
    {
        [cite_start]"salesQuotationId": 12345 // number, 销售报价单号 [cite: 287]
    }
    ```

  * **成功响应 (Success Response):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 287]

    <!-- end list -->

    ```json
    {
        [cite_start]"success": true, // boolean, 表示请求是否成功 [cite: 288]
        "data": {
            [cite_start]"quotationData": { // VarNodeValue 类型，包含报价单的完整数据结构 [cite: 291]
                // ... 详细报价单数据，例如：
                "meta": {
                    [cite_start]"id": "string" // ID [cite: 270, 276]
                },
                "basicInfo": {
                    [cite_start]"quotation": "string", // 报价单ID [cite: 270, 276]
                    [cite_start]"soldToParty": "string", // 售达方 [cite: 270, 276]
                    [cite_start]"shipToParty": "string", // 送达方 [cite: 270, 276]
                    [cite_start]"customerReference": "string", // 客户参考 [cite: 270, 276]
                    [cite_start]"netValue": "string", // 净值 [cite: 270, 276]
                    [cite_start]"netValueUnit": "string", // 净值单位 [cite: 270, 276]
                    [cite_start]"customerReferenceDate": "date" // 客户参考日期 [cite: 270, 276]
                },
                "itemOverview": {
                    [cite_start]"validFrom": "date", // 有效期从 [cite: 271, 277]
                    [cite_start]"validTo": "date", // 有效期至 [cite: 271, 277]
                    [cite_start]"reqDelivDate": "date", // 请求交货日期 [cite: 271, 277]
                    [cite_start]"expectOralVal": "string", // 预期口头值 [cite: 271, 277]
                    [cite_start]"expectOralValUnit": "string", // 预期口头值单位 [cite: 271, 277]
                    [cite_start]"items": [ // 报价单项目列表 [cite: 271, 277]
                        {
                            [cite_start]"item": "string", // 项目 [cite: 271, 277]
                            [cite_start]"material": "string", // 物料 [cite: 271, 277]
                            [cite_start]"orderQuantity": "string", // 订单数量 [cite: 271, 277]
                            [cite_start]"orderQuantityUnit": "string", // SU [cite: 271, 277]
                            [cite_start]"description": "string", // 描述 [cite: 271, 277]
                            [cite_start]"reqDelivDate": "date", // 请求交货日期 [cite: 271, 277]
                            [cite_start]"netValue": "string", // 净值 [cite: 271, 277]
                            [cite_start]"netValueUnit": "string", // 净值单位 [cite: 271, 277]
                            [cite_start]"taxValue": "string", // 税值 [cite: 271, 277]
                            [cite_start]"taxValueUnit": "string", // 税值单位 [cite: 271, 277]
                            [cite_start]"pricingDate": "date", // 定价日期 [cite: 271, 277]
                            [cite_start]"orderProbability": "string", // 订单概率 [cite: 271, 277]
                            [cite_start]"pricingElements": [ // 定价元素列表 [cite: 271, 277]
                                {
                                    [cite_start]"cnty": "string", // 国家 [cite: 271, 277]
                                    [cite_start]"name": "string", // 名称 [cite: 271, 277]
                                    [cite_start]"amount": "string", // 金额 [cite: 271, 277]
                                    [cite_start]"city": "string", // 城市 [cite: 271, 277]
                                    [cite_start]"per": "string", // 每 [cite: 271, 277]
                                    [cite_start]"uom": "string", // 计量单位 [cite: 271, 277]
                                    [cite_start]"conditionValue": "string", // 条件值 [cite: 271, 277]
                                    [cite_start]"curr": "string", // 货币 [cite: 271, 277]
                                    [cite_start]"status": "string", // 状态 [cite: 271, 277]
                                    "numC": "string",
                                    "atoMtsComponent": "string",
                                    "oun": "string",
                                    "cconDe": "string",
                                    "un": "string",
                                    "conditionValue2": "string",
                                    "cdCur": "string",
                                    [cite_start]"stat": "boolean" // 统计 [cite: 271, 277]
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

      * [cite\_start]`Content-Type`: `application/json` [cite: 287]

    <!-- end list -->

    ```json
    {
        [cite_start]"success": false, // boolean, 表示请求是否失败 [cite: 288]
        [cite_start]"message": "Error message" // string, 错误信息 [cite: 288]
    }
    ```

### 2\. 搜索报价单 (Search Quotations)

  * [cite\_start]**URL:** `/api/quotation/search` [cite: 294]

  * [cite\_start]**方法:** `POST` [cite: 294]

  * [cite\_start]**用途:** 根据查询条件搜索报价单列表。 [cite: 293]

  * **请求体 (Request Body):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 294]

    <!-- end list -->

    ```json
    {
        [cite_start]"salesQuotation": 12345, // number (可选), 销售报价单号 [cite: 275]
        [cite_start]"soldToParty": "string" // string (可选), 售达方 [cite: 275]
        [cite_start]"customerReference": "string", // string (可选), 客户参考 [cite: 275]
        [cite_start]"overallStatus": "string", // string (可选), 整体状态 (例如: 'New', 'Open', 'In Process', 'Completed') [cite: 275]
        [cite_start]"latestExpiration": "date" // date (可选), 最新过期日期 [cite: 275]
    }
    ```

  * **成功响应 (Success Response):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 294]

    <!-- end list -->

    ```json
    {
        [cite_start]"success": true, // boolean, 表示请求是否成功 [cite: 296]
        "data": {
            [cite_start]"quotationStruct": { // NodeStructure 类型 [cite: 295]
                [cite_start]"currentValue": [ // QuotationData[] 或 QuotationData，报价单数据列表或单个对象 [cite: 297, 298, 299, 500]
                    {
                        [cite_start]"salesQuotation": 12345, // number, 销售报价单号 [cite: 264]
                        [cite_start]"soldToParty": "string", // string, 售达方 [cite: 265]
                        [cite_start]"customerReference": "string", // string, 客户参考 [cite: 265]
                        [cite_start]"overallStatus": "string", // string, 整体状态 [cite: 265]
                        [cite_start]"latestExpiration": "string", // string, 最新过期日期 [cite: 266]
                        [cite_start]"id": "number | string (可选)", // 可选的 ID 字段 [cite: 266]
                        [cite_start]"items": "any[] (可选)" // 假设报价单详情有物品列表 [cite: 267]
                    }
                ]
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 294]

    <!-- end list -->

    ```json
    {
        [cite_start]"success": false, // boolean, 表示请求是否失败 [cite: 296]
        [cite_start]"message": "Error message" // string, 错误信息 (例如: "未找到报价单信息!") [cite: 299]
    }
    ```

### 3\. 更新报价单 (Update Quotation)

  * [cite\_start]**URL:** `/api/quotation/update` [cite: 309]

  * [cite\_start]**方法:** `POST` [cite: 309]

  * [cite\_start]**用途:** 用于更新现有报价单的信息。 [cite: 308]

  * **请求体 (Request Body):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 309]

    <!-- end list -->

    ```json
    {
        [cite_start]"quotation": { // VarNodeValue 类型，包含要更新的报价单的完整数据结构 [cite: 308]
            // ... 与 "获取报价单详情" 成功响应中 `quotationData` 相同的结构
            // 确保包含 `id` 或 `salesQuotation` 以标识要更新的报价单
        }
    }
    ```

  * **成功响应 (Success Response):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 309]

    <!-- end list -->

    ```json
    {
        [cite_start]"success": true, // boolean, 表示请求是否成功 [cite: 310]
        "data": {
            [cite_start]"quotationData": { // VarNodeValue 类型，包含更新后的报价单数据 [cite: 310]
                // ... 与 "获取报价单详情" 成功响应中 `quotationData` 相同的结构
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 309]

    <!-- end list -->

    ```json
    {
        [cite_start]"success": false, // boolean, 表示请求是否失败 [cite: 311]
        [cite_start]"message": "Error message" // string, 错误信息 (例如: "保存失败！") [cite: 311]
    }
    ```

### 4\. 创建报价单 (Create Quotation)

  * [cite\_start]**URL:** `/api/quotation/create` [cite: 313]

  * [cite\_start]**方法:** `POST` [cite: 313]

  * [cite\_start]**用途:** 用于创建新的报价单。 [cite: 312]

  * **请求体 (Request Body):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 313]

    <!-- end list -->

    ```json
    {
        [cite_start]"quotation": { // VarNodeValue 类型，包含新报价单的完整数据结构 [cite: 312]
            // ... 与 "获取报价单详情" 成功响应中 `quotationData` 相同的结构
            // 通常不包含 `id` 或 `salesQuotation`，由后端生成
        }
    }
    ```

  * \*\*成功响应 (Success Response):\</b\>

      * [cite\_start]`Content-Type`: `application/json` [cite: 313]

    <!-- end list -->

    ```json
    {
        [cite_start]"success": true, // boolean, 表示请求是否成功 [cite: 314]
        "data": {
            [cite_start]"quotationData": { // VarNodeValue 类型，包含新创建的报价单数据（通常会包含后端生成的ID/销售报价单号） [cite: 314]
                // ... 与 "获取报价单详情" 成功响应中 `quotationData` 相同的结构
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 313]

    <!-- end list -->

    ```json
    {
        [cite_start]"success": false, // boolean, 表示请求是否失败 [cite: 315]
        [cite_start]"message": "Error message" // string, 错误信息 (例如: "创建失败！") [cite: 315]
    }
    ```

### 5\. 物品条件批量查询/验证 (Items Tab Query)

  * [cite\_start]**URL:** `/api/app/inquiry/items-tab-query` [cite: 334]

  * [cite\_start]**方法:** `POST` [cite: 334]

  * **用途:** 询价单批量查询，向后端发送 `VarNode[]` (物品节点数组)，返回 `Net Value` 和 `Expect. [cite_start]Oral Val` (包括值和单位)，以及每个物品的详细信息。该方法还会根据返回的 `badRecordIndices` 设置每个 `VarNode` 的 `config.data.validation` 属性。 [cite: 333, 334]

  * **请求体 (Request Body):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 334]

    <!-- end list -->

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

      * [cite\_start]`Content-Type`: `application/json` [cite: 334]

    <!-- end list -->

    ```json
    {
        [cite_start]"success": true, // boolean, 表示请求是否成功 [cite: 335]
        "data": {
            "generalData": {
                [cite_start]"netValue": "string", // 净值 [cite: 334]
                [cite_start]"netValueUnit": "string", // 净值单位 [cite: 334]
                [cite_start]"expectOralVal": "string", // 预期口头值 [cite: 334]
                [cite_start]"expectOralValUnit": "string" // 预期口头值单位 [cite: 334]
            },
            [cite_start]"breakdowns": [ // 每个物品的详细信息 [cite: 335]
                {
                    // ... 与请求体中物品对象相同的结构，可能包含更新后的值
                    "pricingElements": [
                        [cite_start]// ... 定价元素，可能包含更新后的值 [cite: 335]
                    ]
                }
                // ... 更多物品的详细信息
            ],
            "result": {
                "allDataLegal": 0 | [cite_start]1, // number (1表示所有数据合法，0表示存在不合法数据) [cite: 335]
                [cite_start]"badRecordIndices": [ // number[], 存在不合法数据的物品索引列表 (从0开始) [cite: 335]
                    // 例如: 0, 2
                ]
            }
        }
    }
    ```

  * **错误响应 (Error Response):**

      * [cite\_start]`Content-Type`: `application/json` [cite: 334]

    <!-- end list -->

    ```json
    {
        [cite_start]"success": false, // boolean, 表示请求是否失败 [cite: 334]
        [cite_start]"message": "Error message" // string, 错误信息 (例如: "批量查询失败") [cite: 334]
    }
    ```