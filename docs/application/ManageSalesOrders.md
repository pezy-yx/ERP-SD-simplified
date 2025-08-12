销售订单管理前后端接口文档
概述
本文档旨在详细描述前端与后端交互的 API 接口。所有接口均采用 POST 方法，请求和响应的数据格式均为 application/json。

通用响应结构
所有接口的成功响应都包含 success 字段指示操作结果，以及一个 data 字段承载具体业务数据。错误响应则包含 success: false 和 message 字段。

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

接口详情

1. 销售订单搜索 (Search Sales Orders)
   URL: /api/so/search

方法: POST

用途: 根据提供的查询条件搜索销售订单列表。

请求体 (Request Body):

Content-Type: application/json

{
        "so_id": "string", //
        "status": "string", //
        "customer_no": "string", //
        "customer_reference": "string" //
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "data": [
        {
                "meta": {
                    "id": "string" // 对应`meta.id`，在成功响应中可能需要新增
                },
                "basicInfo": {
                    "quotation_id": "string", // 在成功响应中可能需要新增
                    "so_id": "string",
                    "soldToParty": "string", // 对应`customer_no`
                    "customerReference": "string", // 对应`customer_reference`
                    "netValue": "string", // 对应`net_value`
                    "netValueUnit": "string", // 对应`currency`
                    "customerReferenceDate": "string",
                    "status": "string",
                },
                "itemOverview": {
                    "reqDelivDate": "string", // 对应`req_delivery_date`
                }
            }
    ]
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Sales order search failed, please try again later.",
    "error": "错误信息" // 后端返回的具体错误信息
}

2. 获取销售订单详情 (Get Sales Order Details)
   URL: /api/so/get/{so_id}

方法: GET (前端代码中实际是 POST，但 RESTful API 通常用 GET 获取详情，这里以前端实际调用为准，但建议后端改为 GET)

用途: 根据销售订单ID获取单个销售订单的详细信息。

请求体 (Request Body): (如果使用 POST)

Content-Type: application/json

{
    "so_id": "string" // 销售订单号
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "data": {
        "meta": {
            "id": "string" // 销售订单的唯一ID
        },
        "basicInfo": {
            "quotation_id": "string", // 报价单号 (如果从报价单创建)
            "so_id": "string", // 销售订单号
            "soldToParty": "string", // 售达方
            "shipToParty": "string", // 送达方
            "customerReference": "string", //原数据库关系没有，需要补充
            "netValue": "string", // 净值，同net_value
            "netValueUnit": "string", // 净值单位，原数据库关系没有，需要补充
            "customerReferenceDate": "string" // 客户参考日期 (YYYY-MM-DD) //原数据库关系没有，需要补充
        },
        "itemOverview": {
            "reqDelivDate": "string", // 请求交货日期 (YYYY-MM-DD)
            "items": [ // 销售订单项目列表
                {
                    "item": "string", // 项目号，原数据库关系没有
                    "material": "string", // 物料号，同mat_id
                    "orderQuantity": "string", // 订单数量，同quantity
                    "orderQuantityUnit": "string", // 订单数量单位,同su
                    "description": "string", // 描述,原数据库关系没有
                    "reqDelivDate": "string", // 请求交货日期 (YYYY-MM-DD)
                    "netValue": "string", // 净值，同net_price
                    "netValueUnit": "string", // 净值单位，原数据库关系没有
                    "taxValue": "string", // 税值。原数据库关系没有
                    "taxValueUnit": "string", // 税值单位，原数据库关系没有
                    "pricingDate": "string", // 定价日期 ，原数据库关系没有(YYYY-MM-DD)
                    "orderProbability": "string", // 订单概率，原数据库关系没有
                    "pricingElements": [ // 定价元素列表，原数据库关系没有，可能需要创建新表
                        {
                            "cnty": "string", // 国家
                            "name": "string", // 条件名称 (例如: "Base Price", "Tax")
                            "amount": "string", // 金额
                            "city": "string", // 城市 (这里可能表示货币，需与后端确认)
                            "per": "string", // 每 (例如: "1")
                            "uom": "string", // 单位 (例如: "EA")
                            "conditionValue": "string", // 条件值
                            "curr": "string", // 货币
                            "status": "string", // 状态 (例如: "Active")
                            "numC": "string", // 数量条件 (例如: "1", "2")
                            "atoMtsComponent": "string", // ATO/MTS 组件
                            "oun": "string", // OUn
                            "cconDe": "string", // CConDe
                            "un": "string", // Un
                            "conditionValue2": "string", // 条件值2
                            "cdCur": "string", // CdCur
                            "stat": "boolean" // 状态布尔值
                        }
                    ]
                }
            ]
        }
    }
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Failed to load sales order details." // 或其他错误信息
}

3. 创建销售订单 (Create Sales Order)
   URL: /api/so/create

方法: POST

用途: 创建新的销售订单。

请求体 (Request Body):

Content-Type: application/json

{
    "meta": {
        "id": "string" // 可选，如果前端有预设ID，否则后端生成
    },
    "basicInfo": {
        "quotation_id": "string", // (可选), 如果从报价单创建，则传入报价单号
        "so_id": "string", // (可选), 如果前端有预设ID，否则后端生成
        "soldToParty": "string",
        "shipToParty": "string",
        "customerReference": "string",
        "netValue": "string",
        "netValueUnit": "string",
        "customerReferenceDate": "string"
    },
    "itemOverview": {
        "reqDelivDate": "string",
        "items": [
            {
                "item": "string",
                "material": "string",
                "orderQuantity": "string",
                "orderQuantityUnit": "string",
                "description": "string",
                "reqDelivDate": "string",
                "netValue": "string",
                "netValueUnit": "string",
                "taxValue": "string",
                "taxValueUnit": "string",
                "pricingDate": "string",
                "orderProbability": "string",
                "pricingElements": [] // 初始创建时可能为空或包含部分数据
            }
        ]
    }
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message": "Sales Order created successfully!", // 或其他成功信息
    "data": {
        "so_id": "string" // 后端生成的销售订单号
        // ... 其他可能回显的数据
    }
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Operation failed." // 或其他错误信息
}

4. 修改销售订单 (Edit Sales Order)
   URL: /api/so/edit

方法: POST

用途: 修改现有销售订单的信息。

请求体 (Request Body):

Content-Type: application/json

{
    "meta": {
        "id": "string" // 必须，销售订单的唯一ID
    },
    "basicInfo": {
        "quotation_id": "string",
        "so_id": "string", // 必须，要修改的销售订单号
        "soldToParty": "string",
        "shipToParty": "string",
        "customerReference": "string",
        "netValue": "string",
        "netValueUnit": "string",
        "customerReferenceDate": "string"
    },
    "itemOverview": {
        "reqDelivDate": "string",
        "items": [
            {
                "item": "string",
                "material": "string",
                "orderQuantity": "string",
                "orderQuantityUnit": "string",
                "description": "string",
                "reqDelivDate": "string",
                "netValue": "string",
                "netValueUnit": "string",
                "taxValue": "string",
                "taxValueUnit": "string",
                "pricingDate": "string",
                "orderProbability": "string",
                "pricingElements": []
            }
        ]
    }
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message": "Sales Order saved successfully!" // 或其他成功信息
    // "data": {} // 可能回显更新后的数据，或为空
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Operation failed." // 或其他错误信息
}

5. 物品条件批量查询/验证 (Items Tab Query)
   URL: /api/so/items-tab-query

方法: POST

用途: 批量物品查询

请求体 (Request Body):

Content-Type: application/json

{
    {
        description:"string"，
        item:"string",
        material:"string",
        netValue:"string",
        netValueUnit:"string",
        orderProbability:"string",
        orderQuantity:"string",
        orderQuantityUnit:"string",
        pricingDate:"string",//date
        pricingElements:[],
        reqDelivDate:"string",
        taxValue:"string",
        taxValueUnit:"string"
    },
    ...
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message": "Quotation data loaded successfully.", // 或其他成功信息
    "data": {
        result:{
            allDataLegal:"int",//1为合法，0为不合法
            badRecordIndices:[]
        },
        generalData:{
            netValue:"float",
            netValueUnit:"string",
            expectedOralVal:"string",
            expectedOralValUnit:"string"
        },
        breakdowns:[
            {
                description:"string"，
                item:"string",
                material:"string",
                netValue:"string",
                netValueUnit:"string",
                orderProbability:"string",
                orderQuantity:"string",
                orderQuantityUnit:"string",
                pricingDate:"string",//date
                pricingElements:[],
                reqDelivDate:"string",
                taxValue:"string",
                taxValueUnit:"string"
            },
            ...
        ]
    }
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "items not found" // 或其他错误信息
}

6. 获取报价单详情 (Get Quotation Details for Creation)
   URL: /api/quotation/details

方法: POST

用途: 在创建销售订单时，根据报价单号获取报价单的详细信息，用于自动填充销售订单的字段。

请求体 (Request Body):

Content-Type: application/json

{
    "quotation_id": "string" // 报价单号
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message": "Quotation data loaded.", // 或其他成功信息
    "data": {
        "quotationData": { // 包含报价单的完整数据结构
            "meta": {
                "id": "string" // 报价单的唯一ID
            },
            "basicInfo": {
                "quotation": "string", // 报价单号
                "soldToParty": "string", // 售达方
                "shipToParty": "string", // 送达方
                "customerReference": "string", // 客户参考
                "netValue": "string", // 净值
                "netValueUnit": "string", // 净值单位
                "customerReferenceDate": "string" // 客户参考日期 (YYYY-MM-DD)
            },
            "itemOverview": {
                "reqDelivDate": "string", // 请求交货日期 (YYYY-MM-DD)
                "items": [ // 报价单项目列表
                    {
                        "item": "string", // 项目号
                        "material": "string", // 物料号
                        "orderQuantity": "string", // 订单数量
                        "orderQuantityUnit": "string", // 订单数量单位
                        "description": "string", // 描述
                        "reqDelivDate": "string", // 请求交货日期 (YYYY-MM-DD)
                        "netValue": "string", // 净值
                        "netValueUnit": "string", // 净值单位
                        "taxValue": "string", // 税值
                        "taxValueUnit": "string", // 税值单位
                        "pricingDate": "string", // 定价日期 (YYYY-MM-DD)
                        "orderProbability": "string", // 订单概率
                        "pricingElements": [] // 定价元素列表 (可能为空或包含数据)
                    }
                ]
            }
        }
    }
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Quotation not found or API error." // 或其他错误信息
}
