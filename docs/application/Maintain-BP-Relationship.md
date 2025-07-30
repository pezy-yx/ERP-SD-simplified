BP 维护页面接口文档
页面概述
BP 维护页面 (MaintainBusinessPartnerView.vue) 是一个用于管理业务伙伴信息的界面。它支持业务伙伴的搜索、查看和创建/编辑功能，通过不同的 Tab 和视图状态来切换操作模式。

操作模式
1. 业务伙伴搜索模式 (sales_and_dist tab)
用于搜索现有业务伙伴。

用户输入查询条件，点击“Execute”按钮执行搜索。

搜索结果以列表形式展示，点击列表项可进入详情查看模式。

2. 业务伙伴详情/编辑模式 (sales_and_dist tab, showDetailView)
用于查看或修改现有业务伙伴的详细信息。

从搜索结果列表点击进入。

详情信息以表单形式展示，可进行编辑并保存。

3. 业务伙伴创建模式 (person, org, group tabs)
用于创建新的业务伙伴。

用户切换到“person”、“org”或“group”Tab 后，填写业务伙伴的详细信息。

点击“Save”按钮保存创建的业务伙伴。

接口列表
1. 业务伙伴搜索接口
接口地址： POST /api/bp/search

接口描述： 根据查询条件搜索业务伙伴列表。

使用场景： sales_and_dist Tab 下，执行业务伙伴查询操作。

请求参数：

JSON

{
  "query": {
    "customerId": "string" // 业务伙伴ID，支持模糊查询
  }
}
响应结果：

JSON

{
  "success": true,
  "message": "查询成功",
  "data": [
    {
      "customerId": "string", // 业务伙伴ID，跟数据库关系中customer_id相同
      "name": "string",       // 业务伙伴名称
      "city": "string",       // 城市
      "country": "string",    // 国家
      "bpRole": "string"      // BP角色，同bp_role
    },
    // ...更多业务伙伴对象
  ]
}
响应字段说明：

success: 请求是否成功。

message: 响应消息。

data: 业务伙伴列表，每个对象包含业务伙伴的简要信息。

2. 获取业务伙伴详情接口
接口地址： GET /api/bp/get/:customerId

接口描述： 根据业务伙伴 ID 获取其详细信息。

使用场景： 从搜索结果列表点击业务伙伴进入详情页时，用于加载业务伙伴的完整数据。

请求参数： (通过 URL 路径传递)

customerId: string // 业务伙伴 ID

响应结果：

JSON

{
  "success": true,
  "message": "查询成功",
  "data": {
    "bpIdAndRoleSection": {
      "customerId": "string",
      "bpRole": "string" //
    },
    "name": {
      "title": "string", //
      "name": "string"
    },
    "searchTerms": {
      "searchTerm": "string" //原数据库关系里没有，需要注意，需要补充在customer表后面
    },
    "address": {
      "country": "string",
      "street": "string",
      "postalCode": "string", //同postal_code
      "city": "string"
    }
  }
}
响应字段说明：

success: 请求是否成功。

message: 响应消息。

data: 业务伙伴的详细信息，结构与 customerCreateStructure 定义的表单结构一致。

3. 创建/编辑业务伙伴接口
接口地址： POST /api/bp/edit

接口描述： 用于创建新的业务伙伴或修改现有业务伙伴的详细信息。

使用场景：

在 person, org, group Tab 下点击“Save”按钮创建新的业务伙伴。

在 sales_and_dist Tab 的详情页中点击“Save”按钮保存业务伙伴的修改。

请求参数：

JSON

{
  "bpIdAndRoleSection": {
    "customerId": "string", 
    "bpRole": "string",     
    "type": "string"        //  "person", "group", "org"三种，原数据库关系里没有，需要注意
  },
  "name": {
    "title": "string",
    "name": "string"
  },
  "searchTerms": {
    "searchTerm": "string"
  },
  "address": {
    "country": "string",
    "street": "string",
    "postalCode": "string",
    "city": "string"
  }
}
响应结果：

JSON

{
  "success": true,
  "message": "操作成功",
  "data": {
    "customerId": "string" // 创建时返回新生成的ID，修改时返回原ID
  }
}
响应字段说明：

success: 操作是否成功。

message: 响应消息。

data.customerId: 业务伙伴的 ID。

搜索辅助接口 (由 searchMethods 提供)
这些接口由前端 src/utils/searchMethods.js 中的 bpSearch 和 relationSearch 方法调用，后端需要提供相应的搜索服务。

1. 业务伙伴搜索辅助接口 (用于下拉选择/输入建议)
接口地址： GET /api/search/business-partner

接口描述： 用于为 customerId 字段提供搜索建议或校验。

使用场景： 在业务伙伴搜索输入框中，当用户输入时进行实时搜索或提供建议。

2. 关系搜索辅助接口 (未在当前组件中直接使用，但为通用搜索方法)
接口地址： GET /api/search/relation

接口描述： 用于搜索关系类型，为关系分类字段提供搜索功能。

使用场景： (MaintainBusinessPartnerView.vue 未直接使用此接口，但在其他可能涉及关系类型选择的页面可能会用到)。

页面流程
业务伙伴搜索流程 (sales_and_dist Tab)
用户在“Customer ID”输入框中输入查询条件。

点击“Execute”按钮。

前端调用 POST /api/bp/search 接口，发送查询数据。

根据接口返回的 data 渲染业务伙伴列表。

如果搜索结果为空，显示“No business partners found”消息。

业务伙伴详情/编辑流程 (sales_and_dist Tab)
用户在搜索结果列表中点击某个业务伙伴行。

前端获取点击行的 customerId。

设置 showDetailView 为 true，并调用 GET /api/bp/get/:customerId 接口，加载该业务伙伴的详细信息。

根据接口返回的 data 填充详情表单（customerDetailTree）。

用户可以修改表单中的信息。

点击“Save”按钮，前端调用 POST /api/bp/edit 接口，发送包含修改数据的请求。

保存成功后，显示成功消息并返回搜索结果列表（backToSearchResults）。

点击“← Back to Search Results”按钮可直接返回搜索结果列表。

业务伙伴创建流程 (person, org, group Tabs)
用户切换到“person”、“org”或“group”Tab。

前端显示一个空的业务伙伴创建表单（customerCreateTree）。

用户填写表单中的各项详细信息。

点击“Save”按钮。

前端调用 POST /api/bp/edit 接口，发送创建数据（此时 bpIdAndRoleSection.customerId 通常为空或不传）。

创建成功后，显示成功消息并清空表单。

错误处理
所有接口调用都应包含错误捕获。

当 API 返回 success: false 或发生网络错误时，前端会通过 alert 提示用户失败信息。

具体错误消息 (message) 由后端提供。