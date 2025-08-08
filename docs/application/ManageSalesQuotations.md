销售报价单管理前后端接口文档
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

1. 根据询价单创建报价单
   URL: /api/quotation/create-quotation-from-inquiry

方法: POST

用途: 根据inquiry（询价单）创建报价单

请求体 (Request Body):

Content-Type: application/json

{
    "inquiryId":"string"
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message":'根据inquiry{id}成功创建报价单{id}'
    "data": {
        quotationData:{
            meta:{
                id:'string'
            },
            basicInfo:{
                quotation:'string',//quotation的id
                soldToParty:'string',
                shipToParty:'string',
                customerReference:'string',
                netValue:'float',
                netValueUnit:'string',
                customerReferenceDate:'string' //此处为日期
            },
            itemOverview:{
                validFrom:'string',//此处为日期
                validTo:'string',//此处为日期
                reqDelivDate:'string'//此处还为日期
                expectedOralVal:'string',
                expectedOralValUnit:'string',
                items:[
                    {
                        item:'string',//id
                        material:'string',
                        orderQuantity:'string',
                        orderQuantityUnit:'string',
                        description:'string',
                        su:'number',
                        altItm:'number'
                    },
                    ...
                ]
            }
        }
    }
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Quotation creation failed, please try again later.",
    "error": "错误信息" // 后端返回的具体错误信息
}

2. 获取报价单详情 (Get quotation Details)
   URL: /api/quotation/details

方法: Post

用途: 根据报价单ID获取单个报价单的详细信息。

请求体 (Request Body): (如果使用 POST)

Content-Type: application/json

{
    "salesQuotationId": "string"
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message":"初始化quotation{id}成功"
    "data": {
        "meta": {
            "id": "string" // quotation的id
        },
        "basicInfo": {
            "inquiry"?:"string"//询价单号（如果从询价单创建）
            "quotation": "string", // 报价单号
            "soldToParty": "string", // 售达方
            "shipToParty": "string", // 送达方
            "customerReference": "string", //原数据库关系没有，需要补充
            "netValue": "string", // 净值，同net_value
            "netValueUnit": "string", // 净值单位，原数据库关系没有，需要补充
            "customerReferenceDate": "string" // 客户参考日期 (YYYY-MM-DD) //原数据库关系没有，需要补充
        },
        "itemOverview": {
            "validFrom": 'string',
            "validTo": 'string',
            "reqDelivDate": 'string',
            "expectOralVal": 'string',
            "expectOralValUnit": 'string',
            "items": [
                {
                    "material":"string",
                    "orderQuantity":"string",
                    "su":"number",
                    "altItm":"number",
                    "description":"string"
                },
                ...
            ]
        }
    }
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Failed to load quotation details." // 或其他错误信息
}

3. 修改报价单 (Edit quotation)
   URL: /api/quotation/update

方法: POST

用途: 修改现有报价单的信息。

请求体 (Request Body):

Content-Type: application/json

{
    "quotation":{
                    "meta": {
                        "id": "string" // quotation的id
                    },
                    "basicInfo": {
                        "inquiry"?:"string"//询价单号（如果从询价单创建）
                        "quotation": "string", // 报价单号
                        "soldToParty": "string", // 售达方
                        "shipToParty": "string", // 送达方
                        "customerReference": "string", //原数据库关系没有，需要补充
                        "netValue": "string", // 净值，同net_value
                        "netValueUnit": "string", // 净值单位，原数据库关系没有，需要补充
                        "customerReferenceDate": "string" // 客户参考日期 (YYYY-MM-DD) //原数据库关系没有，需要补充
                    },
                    "itemOverview": {
                        "validFrom": 'string',
                        "validTo": 'string',
                        "reqDelivDate": 'string',
                        "expectOralVal": 'string',
                        "expectOralValUnit": 'string',
                        "items": [
                            {
                                "material":"string",
                                "orderQuantity":"string",
                                "su":"number",
                                "altItm":"number",
                                "description":"string"
                            },
                            ...
                        ]
                    }
                }
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message": "Sales Order saved successfully!" // 或其他成功信息
    "data": {
        quotationData:{
            "meta": {
                "id": "string" // quotation的id
            },
            "basicInfo": {
                "inquiry"?:"string"//询价单号（如果从询价单创建）
                "quotation": "string", // 报价单号
                "soldToParty": "string", // 售达方
                "shipToParty": "string", // 送达方
                "customerReference": "string", //原数据库关系没有，需要补充
                "netValue": "string", // 净值，同net_value
                "netValueUnit": "string", // 净值单位，原数据库关系没有，需要补充
                "customerReferenceDate": "string" // 客户参考日期 (YYYY-MM-DD) //原数据库关系没有，需要补充
            },
            "itemOverview": {
                "validFrom": 'string',
                "validTo": 'string',
                "reqDelivDate": 'string',
                "expectOralVal": 'string',
                "expectOralValUnit": 'string',
                "items": [
                    {
                        "material":"string",
                        "orderQuantity":"string",
                        "su":"number",
                        "altItm":"number",
                        "description":"string"
                    },
                    ...
                ]
            }
        }
    }
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Update failed." // 或其他错误信息
}

4. 搜索报价单（search for quotations）
   URL: /api/quotation/search

方法: POST

用途: 根据筛选条件搜索满足条件的报价单

请求体 (Request Body):

Content-Type: application/json

{
    customerReference:"string",
    latestExpiration:"string",//是date
    overallStatus:"string",
    salesQuotation:"string",
    soldToParty:"string"
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message": "Quotation data loaded.", // 或其他成功信息
    "data": {
        quotationStruct:{
            varType: 'dict',
            nodeType: 'dict',
            name: 'quotation',
            currentValue: [
                {
                    salesQuotation: "string",
                    soldToParty: 'string',
                    customerReference: 'string',
                    overallStatus: 'string',
                    latestExpiration: 'string'
                },
                ...
            ],//放查询的结果的地方
            config:{},
            isEditable:false,
            children: [
                {
                    varType: 'number',
                    nodeType: 'leaf',
                    name: 'salesQuotation',
                    isEditable: false
                },
                {
                    varType: 'string',
                    nodeType: 'leaf',
                    name: 'soldToParty',
                    isEditable: true
                },
                {
                    varType: 'string',
                    nodeType: 'leaf',
                    name: 'customerReference',
                    isEditable: false
                },
                {
                    varType: 'selection',
                    nodeType: 'leaf',
                    name: 'overallStatus',
                    isEditable: true,
                    config: {
                        options: ['New', 'Open', 'In Process', 'Completed']
                    }
                },
                {
                    varType: 'date',
                    nodeType: 'leaf',
                    name: 'latestExpiration',
                    isEditable: false
                }
            ]
        }
    }
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Quotation not found" // 或其他错误信息
}

5. 物品条件批量查询/验证 (Items Tab Query)
   URL: /api/quotation/items-tab-query

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