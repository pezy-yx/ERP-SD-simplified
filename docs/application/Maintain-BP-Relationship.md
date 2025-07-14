MaintainBusinessPartnerView 页面接口文档
页面概述
MaintainBusinessPartnerView.vue 页面用于查询和创建不同类型的业务伙伴（例如个人、组织、组）。它通过用户界面收集数据，并与后端 API 进行交互以执行搜索或创建操作。

接口列表

1. 业务伙伴查询接口
接口地址： POST /api/app/bp-search

接口描述： 用于根据用户输入的查询条件，搜索现有业务伙伴。

请求参数：

{
  "customer_id": "string" 
}

响应结果：

{
  "success": true,
  "data": {},
  "message": "string",
  "error": "string"
}

响应字段说明：

success: 请求是否成功。

data: 查询结果数据，具体结构取决于后端定义。

message: 成功或失败消息。

error: 错误信息（如果 success 为 false）。

示例请求：

{
  "customer_id": "BP12345"
}

示例响应：

// 成功响应
{
  "success": true,
  "data": {
    "bpId": "BP12345",
    "name": "Example Business Partner",
    "status": "Active"
  },
  "message": "Business partner found successfully."
}
// 失败响应
{
  "success": false,
  "error": "BP_NOT_FOUND",
  "message": "Business partner with ID 'BP12345' not found."
}

3. 创建个人业务伙伴接口
接口地址： POST /api/app/bp-create

接口描述： 用于提交表单数据以创建新的个人业务伙伴。

请求参数：

{
  "customer": { 
    "bpIdAndRoleSection": {
      "customer_id": "string", // 业务伙伴ID
      "bp_role": "string"      // 业务伙伴角色
    },
    "name": {
      "title": "string",     // 称谓
      "name": "string"       // 姓名
    },
    "searchTerms": {
      "searchTerm": "string" // 搜索词
    },
    "address": {
      "country": "string",   // 国家
      "street": "string",    // 街道
      "postalCode": "string",// 邮政编码
      "city": "string"       // 城市
    }
    "customer": {
        "type": "string", // 客户类型（数据表可能需要补充）
    }
  }
}

响应结果：

{
  "success": true,
  "data": {},
  "message": "string",
  "error": "string"
}

响应字段说明：

success: 创建是否成功。

data: 创建成功后的业务伙伴数据或确认信息。

message: 成功或失败消息。

error: 错误信息（如果 success 为 false）。

5. 创建组业务伙伴接口
接口地址： POST /api/app/group/create

接口描述： 用于提交表单数据以创建新的组业务伙伴。

请求参数：

{
  "test": { // 对应 customerCreateStructure 中的根 'test' 字典
    "bpIdAndRoleSection": { /* 结构同创建个人业务伙伴 */ },
    "name": {
      "name": "string" // 组名称
      // ... 可能还包含其他组特有字段
    },
    "searchTerms": { /* 结构同创建个人业务伙伴 */ },
    "address": { /* 结构同创建个人业务伙伴 */ }
  }
}

响应结果：

{
  "success": true,
  "data": {},
  "message": "string",
  "error": "string"
}

响应字段说明：

success: 创建是否成功。

data: 创建成功后的业务伙伴数据或确认信息。

message: 成功或失败消息。

error: 错误信息（如果 success 为 false）