# BP关系管理页面接口文档

## 页面概述

BP关系管理页面（Main.vue）是一个统一的业务伙伴关系管理界面，支持创建、查看和修改三种操作模式。页面采用分步骤的方式，包含初始信息录入和详细信息补充两个阶段，通过状态切换实现不同操作模式的统一管理。

## 操作模式

### 1. 创建模式 (create)
- 用于创建新的业务伙伴关系
- 初始阶段：填写关系基本信息
- 信息阶段：补充详细信息并保存

### 2. 查看模式 (display)
- 用于查看现有业务伙伴关系
- 初始阶段：输入关系ID进行查询
- 信息阶段：只读显示关系详细信息

### 3. 修改模式 (change)
- 用于修改现有业务伙伴关系
- 从查看模式切换而来
- 信息阶段：可编辑关系详细信息并保存

## 接口列表

### 1. 业务伙伴关系注册接口

**接口地址：** `POST /api/app/bp-relationship/register`

**接口描述：** 用于初始化业务伙伴关系创建流程，验证基本信息并返回对应的表单结构。

**使用场景：** 创建模式下的初始化操作

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

### 2. 业务伙伴关系查询接口

**接口地址：** `POST /api/app/bp-relationship/get`

**接口描述：** 用于根据关系ID查询现有业务伙伴关系的详细信息。

**使用场景：** 查看模式和修改模式下的初始化操作

**请求参数：**
```json
{
  "relationshipId": "string"  // 业务伙伴关系ID
}
```

**响应结果：**
```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "content": {
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
        // 根据formStruct结构的动态数据
      }
    },
    "formStruct": {
      "nodeType": "dict",
      "varType": "dict",
      "name": "generalData",
      "nameDisplay": "General Data",
      "children": [
        // 动态表单结构定义
      ]
    }
  }
}
```

**响应字段说明：**
- `success`: 查询是否成功
- `message`: 响应消息
- `data.content.basicInfo`: 基本关系信息
- `data.content.generalData`: 动态表单数据
- `data.formStruct`: 动态表单结构配置

### 3. 业务伙伴关系编辑接口

**接口地址：** `POST /api/app/bp-relationship/edit`

**接口描述：** 用于创建新的业务伙伴关系或修改现有关系。

**使用场景：** 创建模式和修改模式下的保存操作

**请求参数：**
```json
{
  "bpRelationshipData": {
    "meta": {
      "id": "string"  // 修改时包含现有ID，创建时为空
    },
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
    }
  },
  "generalData": {
    // 根据formStruct结构的动态数据
  }
}
```

**响应结果：**
```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    "message": "BP relation 33 has been created successfully", // 或 "BP relation 33 has been updated successfully"
    "content": {
      "id": "33"  // 创建时返回新生成的ID，修改时返回原ID
    }
  }
}
```

**响应字段说明：**
- `success`: 操作是否成功
- `message`: 响应消息
- `data.message`: 详细的成功消息，包含关系ID
- `data.content.id`: 业务伙伴关系的ID

## 搜索接口(仅作需求说明，后端完成搜索服务的文档时确保覆盖到这些搜索功能就好)

### 1. 业务伙伴搜索接口

**接口地址：** `GET /api/search/business-partner`

**接口描述：** 用于搜索业务伙伴，为业务伙伴1和业务伙伴2字段提供搜索功能。

**使用场景：** 在BP关系管理页面的businessPartner1和businessPartner2字段中使用

### 2. 关系搜索接口

**接口地址：** `GET /api/search/relation`

**接口描述：** 用于搜索关系类型，为关系分类字段提供搜索功能。

**使用场景：** 在BP关系管理页面的relationShipCategory字段中使用

## 页面流程

### 创建模式流程

#### 第一阶段：初始信息录入
1. 用户填写关系类型分类
2. 用户选择业务伙伴1和业务伙伴2（支持搜索）
3. 用户设置有效期开始和结束日期
4. 点击"Initialize"按钮
5. 系统调用 `/api/app/bp-relationship/register` 接口
6. 根据返回的表单结构配置第二阶段表单

#### 第二阶段：详细信息补充
1. 显示第一阶段的基本信息（可编辑）
2. 根据第一阶段返回的表单结构渲染动态表单
3. 用户填写VIP状态、部门、职能等信息
4. 点击"Create"按钮
5. 系统调用 `/api/app/bp-relationship/edit` 接口
6. 显示创建成功消息，自动切换到查看模式

### 查看模式流程

#### 第一阶段：关系查询
1. 用户输入业务伙伴关系ID
2. 点击"Load"按钮
3. 系统调用 `/api/app/bp-relationship/get` 接口
4. 加载关系数据和表单结构

#### 第二阶段：信息展示
1. 以只读模式显示基本信息
2. 以只读模式显示动态表单数据
3. 点击"Edit"按钮可切换到修改模式

### 修改模式流程

#### 第一阶段：关系查询
1. 与查看模式相同的查询流程

#### 第二阶段：信息编辑
1. 以可编辑模式显示基本信息
2. 以可编辑模式显示动态表单数据
3. 点击"Save"按钮保存修改
4. 系统调用 `/api/app/bp-relationship/edit` 接口
5. 显示保存成功消息，自动切换到查看模式

## 状态管理

### 状态切换逻辑
- **create → display**: 创建成功后自动切换
- **display → change**: 点击"Edit"按钮手动切换
- **change → display**: 保存成功后自动切换，或点击"Cancel"按钮手动切换

### 只读状态控制
- 查看模式下所有表单字段为只读状态
- 创建模式和修改模式下表单字段可编辑
- 状态切换时自动更新所有VarTree的readonly属性

## 错误处理

- 所有接口调用都包含错误捕获
- 网络错误时返回 `{ success: false }`
- 操作失败时在控制台输出错误信息
- 用户可以通过"取消"按钮中止当前操作
- 修改模式下取消操作会弹出确认对话框

## 技术实现

- 使用 Vue 3 Composition API
- 使用 VarTree 工具进行表单数据管理
- 使用 VarBox 组件进行动态表单渲染
- 使用 AppContent 组件进行分步骤流程控制
- 支持搜索功能集成
- 统一的状态管理和模式切换

## 依赖组件

- `VarBox`: 动态表单渲染组件
- `AppContent`: 分步骤应用内容组件
- `searchMethods`: 搜索方法配置（bpSearch, relationSearch）
- `VarTree`: 表单数据树管理工具

## 组件结构

### Main.vue (主组件)
- 统一的业务伙伴关系管理界面
- 支持三种操作模式的状态切换
- 包含所有业务逻辑和API调用

### Display.vue (查看页面入口)
- 简单的包装组件
- 自动将Main.vue设置为查看模式

### Create.vue (创建页面入口)
- 简单的包装组件
- 自动将Main.vue设置为创建模式

### Change.vue (修改页面入口)
- 简单的包装组件
- 自动将Main.vue设置为修改模式