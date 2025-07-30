
物料凭证概览页面接口文档
页面概述
物料凭证概览页面 (Overview.vue) 是一个用于查询、显示物料凭证及其相关业务流程的界面。页面主要分为两个部分：物料凭证搜索与列表显示，以及物料凭证详情与流程追溯。

操作模式
1. 搜索模式 (Search)
用于输入查询条件并执行物料凭证搜索。

显示搜索结果列表。

2. 详情查看模式 (Display Detail)
用于查看单个物料凭证的详细信息。

显示物料凭证的基本数据、物料项目列表和业务流程追溯。

此模式下所有信息只读。

接口列表
1. 物料凭证搜索接口
接口地址： POST /api/material/search

接口描述： 根据用户提供的查询条件，搜索符合条件的物料凭证列表。

使用场景： 搜索模式下，用户点击“Go”按钮执行查询操作。

请求参数：

JSON

{
  "materialDocument": "string", // 物料凭证号码 (可选)原数据库关系不存在，需要补充
  "plant": "string",            // 工厂 (可选)同plant_name
  "materialDocumentYear": "string", // 物料凭证年份 (可选)原数据库关系不存在，需要补充
  "material": "string",         // 物料 (可选)同mat_id
  "postingDate": "string",      // 过账日期 (ISO 8601格式, 可选)原数据库关系不存在，需要补充
  "documentDate": "string"      // 凭证日期 (ISO 8601格式, 可选)原数据库关系不存在，需要补充
}
响应结果：

JSON

{
  "success": true,
  "message": "成功",
  "data": [
    {
      "materialDocument": "string", // 物料凭证号码
      "plant": "string",            // 工厂
      "postingDate": "string",      // 过账日期 (ISO 8601格式)
      "documentDate": "string"      // 凭证日期 (ISO 8601格式)
    },
    // ... 更多物料凭证对象
  ]
}
响应字段说明：

success: 请求是否成功

message: 响应消息

data: 物料凭证列表，每个元素包含物料凭证的基本概览信息

2. 物料凭证详情查询接口
接口地址： GET /api/material/get/{materialDocumentId}

接口描述： 根据物料凭证ID查询单个物料凭证的详细信息，包括其项目和关联的业务流程数据。

使用场景： 详情查看模式下，用户点击物料凭证列表中的某一行时。

请求参数：

materialDocumentId: 路径参数，string 类型，必填。表示要查询的物料凭证的唯一标识。

响应结果：

JSON

{
  "success": true,
  "message": "成功",
  "data": {
    "materialDocument": "string",     // 物料凭证号码
    "plant": "string",                // 工厂
    "postingDate": "string",          // 过账日期 (ISO 8601格式)
    "documentDate": "string",         // 凭证日期 (ISO 8601格式)
    "materialDocumentYear": "string", // 物料凭证年份

    "items": [                        // 物料凭证项目列表
      {
        "item": "string",             // 项目编号，同item_no
        "material": "string",         // 物料号码
        "orderQuantity": "string",    // 订单数量，同quantity
        "orderQuantityUnit": "string" // 订单数量单位，同su
      },
      // ... 更多项目
    ],
    "processFlow": [                  // 业务流程数据
      {
        "dlvId": "string",            // 交货单ID (可选)，同dlv_id
        "materialDocument": "string", // 物料凭证ID
        "billId": "string"            // 会计凭证ID (可选)，同bill_id
      }
    ]
  }
}
响应字段说明：

success: 请求是否成功

message: 响应消息

data: 包含物料凭证所有详细信息的数据对象

materialDocument, plant, postingDate, documentDate, materialDocumentYear: 物料凭证的基本信息

items: 物料凭证中的所有项目列表，每个项目包含其编号、物料、数量及单位

processFlow: 与该物料凭证相关的业务流程信息，当前设计为包含交货单ID (dlvId)、物料凭证ID (materialDocument) 和会计凭证ID (billId)