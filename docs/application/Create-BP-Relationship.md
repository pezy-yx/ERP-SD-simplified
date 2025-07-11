# Create.vue 页面接口文档

## 页面概述

Create.vue 是业务伙伴关系创建页面，用于创建和管理业务伙伴之间的关系。页面采用分步骤的方式，包含初始信息录入和详细信息补充两个阶段。

## 接口列表

### 1. 业务伙伴关系注册接口

**接口地址：** `POST /api/app/bp-relationship/register`

**接口描述：** 用于初始化业务伙伴关系创建流程，验证基本信息并返回对应的表单结构。

**请求参数：**
```json
{
  "relation": {
    "relationShipCategory": "string"  // 关系类型分类
  },
  "default": {
    "businessPartner1": "string",     // 业务伙伴1
    "businessPartner2": "string",     // 业务伙伴2
    "validFrom": "string",            // 有效期开始日期 (ISO 8601格式)
    "validTo": "string"               // 有效期结束日期 (ISO 8601格式)
  }
}
```

**响应结果：**
```json
{
  "success": true,
  "message": "成功",
  "data": {
    "formStruct": {
      "nodeType": "dict",
      "varType": "dict", 
      "name": "generalData",
      "nameDisplay": "General Data",
      "children": [
        {
          "nodeType": "leaf",
          "varType": "string",
          "name": "testField",
          "nameDisplay": "Test Field: "
        }
      ]
    }
  }
}
```

**响应字段说明：**
- `success`: 请求是否成功
- `message`: 响应消息
- `data.formStruct`: 动态表单结构配置，用于渲染第二阶段的表单。要根据请求参数动态生成表单结构，这里展示示例，使用NodeStructure类型接口。

### 2. 业务伙伴关系创建接口

**接口地址：** `POST /api/app/bp-relationship/create`

**接口描述：** 完成业务伙伴关系的最终创建，保存所有信息。

**请求参数：**
```json
{
  "basicInfo": {
    "relation": {
      "relationShipCategory": "string"
    },
    "default": {
      "businessPartner1": "string",
      "businessPartner2": "string", 
      "validFrom": "string",
      "validTo": "string"
    }
  },
  "generalData": {
    // 这里的字段根据第一步返回的formStruct决定
  }
}
```

**响应结果：**
```json
{
  "success": true,
  "message": "创建BP关系成功",
  "data": {
    "message": "BP relation 33 has been created successfully" // 33是数据库中生成的id
  }
}
```

**响应字段说明：**
- `success`: 创建是否成功
- `message`: 响应消息
- `data.message`: 详细的成功消息，包含创建的关系ID

## 搜索接口(仅作需求说明，后端完成搜索服务的文档时确保覆盖到这些搜索功能就好)

### 1. 业务伙伴搜索接口

**接口地址：** `GET /api/search/business-partner`

**接口描述：** 用于搜索业务伙伴，为业务伙伴1和业务伙伴2字段提供搜索功能。

**使用场景：** 在Create.vue页面的businessPartner1和businessPartner2字段中使用

### 2. 关系搜索接口

**接口地址：** `GET /api/search/relation`

**接口描述：** 用于搜索关系类型，为关系分类字段提供搜索功能。

**使用场景：** 在Create.vue页面的relationShipCategory字段中使用

## 页面流程

### 第一阶段：初始信息录入
1. 用户填写关系类型分类
2. 用户选择业务伙伴1和业务伙伴2（支持搜索）
3. 用户设置有效期开始和结束日期
4. 点击"下一步"按钮
5. 系统调用 `/api/app/bp-relationship/register` 接口
6. 根据返回的表单结构配置第二阶段表单

### 第二阶段：详细信息补充
1. 显示第一阶段的基本信息（只读）
2. 根据第一阶段返回的表单结构渲染动态表单
3. 用户填写VIP状态、部门、职能等信息
4. 点击"保存"按钮
5. 系统调用 `/api/app/bp-relationship/create` 接口
6. 显示创建成功消息

## 错误处理

- 所有接口调用都包含错误捕获
- 网络错误时返回 `{ success: false }`
- 创建失败时在控制台输出错误信息
- 用户可以通过"取消"按钮中止创建流程

## 技术实现

- 使用 Vue 3 Composition API
- 使用 VarTree 工具进行表单数据管理
- 使用 VarBox 组件进行动态表单渲染
- 使用 AppContent 组件进行分步骤流程控制
- 支持搜索功能集成

## 依赖组件

- `VarBox`: 动态表单渲染组件
- `AppContent`: 分步骤应用内容组件
- `searchMethods`: 搜索方法配置
- `VarTree`: 表单数据树管理工具