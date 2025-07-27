# 开票凭证管理应用接口文档

## 应用概述

开票凭证管理应用是SD模块中用于管理开票凭证的核心应用，支持创建、查看和修改三种操作模式。该应用采用统一的Main.vue组件实现三种模式的业务逻辑，通过状态切换实现不同操作模式的统一管理。应用基于VarBox/VarTree架构实现动态表单渲染和数据管理，采用两阶段流程设计。

## 操作模式

### 1. 创建模式 (create)
- 用于创建新的开票凭证
- 初始阶段：填写开票到期清单查询条件
- 信息阶段：录入开票详细信息并保存

### 2. 查看模式 (display)
- 用于查看现有开票凭证
- 初始阶段：输入开票凭证号进行查询
- 信息阶段：只读显示开票详细信息

### 3. 修改模式 (change)
- 用于修改现有开票凭证
- 从查看模式切换而来
- 信息阶段：可编辑开票详细信息并保存

## 业务流程

### 创建模式流程

#### 阶段0：开票到期清单初始化 (initialScreen)
1. 用户填写开票到期清单查询条件：
   - 开票日期 (billingDate)
   - 售达方 (soldToParty) - 支持搜索功能
2. 点击"Initialize"按钮
3. 系统调用初始化接口，返回符合条件的开票到期清单
4. 自动生成开票凭证的基本信息结构

#### 阶段1：开票信息录入 (information)
1. 显示开票凭证基本信息（可编辑）：
   - 凭证类型 (type): 默认为"Invoice"
   - 开票凭证号 (id): 系统生成
   - 净值 (netValue) 和货币单位 (netValueUnit)
   - 付款方 (payer)
   - 开票日期 (billingDate)
2. 显示项目概览信息：
   - 开票项目明细列表
3. 点击"Create"按钮保存开票凭证
4. 保存成功后自动切换到显示模式

### 查看模式流程

#### 阶段0：开票凭证查询 (initialScreen)
1. 用户输入开票凭证查询条件：
   - 开票凭证号 (billingDocumentId) - 支持搜索功能
2. 点击"Load"按钮
3. 系统调用查询接口，获取开票凭证详细信息
4. 加载成功后自动进入信息显示阶段

#### 阶段1：开票信息显示 (information)
1. 以只读模式显示开票凭证基本信息
2. 以只读模式显示开票项目明细列表
3. 可点击"Edit"按钮切换到修改模式

### 修改模式流程

#### 阶段0：开票凭证查询 (initialScreen)
1. 与查看模式相同的查询流程

#### 阶段1：开票信息编辑 (information)
1. 以可编辑模式显示开票凭证基本信息
2. 以可编辑模式显示开票项目明细列表
3. 点击"Save"按钮保存修改
4. 保存成功后自动切换到查看模式

## 接口列表

### 1. 开票到期清单初始化接口

**接口地址：** `POST /api/app/billing/initialize`

**接口描述：** 根据开票日期和售达方条件，查询符合条件的开票到期清单，并生成开票凭证的初始数据结构。

**使用场景：** 创建模式下的第一阶段初始化操作

**请求参数：**
```json
{
  "billingDueList": {
    "billingDate": "2024-01-15",        // 开票日期 (YYYY-MM-DD格式)
    "soldToParty": "C001 - ABC Company" // 售达方 (可选，支持模糊搜索)
  }
}
```

**响应结果：**
```json
{
  "success": true,
  "data": {
    "content": {
      "meta": {
        "id": ""                        // 新创建时为空
      },
      "basicInfo": {
        "type": "Invoice",              // 开票凭证类型
        "id": "",                       // 开票凭证号，创建时为空
        "netValue": "0.00",             // 净值
        "netValueUnit": "USD",          // 货币单位
        "payer": "C001 - ABC Company",  // 付款方
        "billingDate": "2024-01-15"     // 开票日期
      },
      "itemOverview": {
        "items": [                      // 开票项目列表
          {
            "item": "10",               // 项目号
            "salesDocument": "SO001",   // 销售凭证
            "salesDocumentItem": "10",  // 销售凭证项目
            "material": "MAT001",       // 物料号
            "description": "Product A", // 物料描述
            "billingQuantity": "10",    // 开票数量
            "quantityUnit": "PC",       // 数量单位
            "netValue": "1000.00",      // 净值
            "taxValue": "100.00",       // 税值
            "grossValue": "1100.00",    // 毛值
            "currency": "USD"           // 货币
          }
        ]
      }
    },
    "message": "Billing due list loaded successfully"
  }
}
```

**响应字段说明：**
- `success`: 操作是否成功
- `data.content`: 开票凭证的完整数据结构，用于初始化VarTree
- `data.content.meta.id`: 元数据ID，创建时为空
- `data.content.basicInfo`: 开票凭证基本信息
- `data.content.itemOverview`: 项目概览信息，包含开票项目明细列表
- `data.message`: 操作结果消息

### 2. 开票凭证查询接口

**接口地址：** `POST /api/app/billing/get`

**接口描述：** 根据开票凭证号查询现有开票凭证的详细信息。

**使用场景：** 查看模式和修改模式下的初始化操作

**请求参数：**
```json
{
  "billingDocumentId": "BD001"          // 开票凭证号
}
```

**响应结果：**
```json
{
  "success": true,
  "data": {
    "content": {
      "meta": {
        "id": "BD001"                   // 开票凭证ID
      },
      "basicInfo": {
        "type": "Invoice",              // 开票凭证类型
        "id": "BD001",                  // 开票凭证号
        "netValue": "1500.00",          // 净值
        "netValueUnit": "USD",          // 货币单位
        "payer": "C001 - ABC Company",  // 付款方
        "billingDate": "2024-01-15"     // 开票日期
      },
      "itemOverview": {
        "items": [                      // 开票项目列表
          {
            "item": "10",               // 项目号
            "salesDocument": "SO001",   // 销售凭证
            "salesDocumentItem": "10",  // 销售凭证项目
            "material": "MAT001",       // 物料号
            "description": "Product A", // 物料描述
            "billingQuantity": "10",    // 开票数量
            "quantityUnit": "PC",       // 数量单位
            "netValue": "1000.00",      // 净值
            "taxValue": "100.00",       // 税值
            "grossValue": "1100.00",    // 毛值
            "currency": "USD"           // 货币
          }
        ]
      }
    }
  }
}
```

**错误响应：**
```json
{
  "success": false,
  "message": "Billing document not found"
}
```

**响应字段说明：**
- `success`: 查询是否成功
- `data.content`: 开票凭证的完整数据结构
- `data.content.meta.id`: 开票凭证的唯一标识
- `data.content.basicInfo`: 开票凭证基本信息
- `data.content.itemOverview`: 项目概览信息，包含开票项目明细列表

### 3. 创建/编辑开票凭证接口

**接口地址：** `POST /api/app/billing/edit`

**接口描述：** 创建新的开票凭证或修改现有开票凭证。

**使用场景：** 创建模式和修改模式下的保存操作

**请求参数：**
```json
{
  "meta": {
    "id": ""                            // 创建时为空，修改时包含现有ID
  },
  "basicInfo": {
    "type": "Invoice",                  // 开票凭证类型
    "id": "",                           // 开票凭证号，创建时为空
    "netValue": "1500.00",              // 净值
    "netValueUnit": "USD",              // 货币单位
    "payer": "C001 - ABC Company",      // 付款方
    "billingDate": "2024-01-15"         // 开票日期
  },
  "itemOverview": {
    "items": [                          // 开票项目列表
      {
        "item": "10",                   // 项目号
        "salesDocument": "SO001",       // 销售凭证
        "salesDocumentItem": "10",      // 销售凭证项目
        "material": "MAT001",           // 物料号
        "description": "Product A",     // 物料描述
        "billingQuantity": "10",        // 开票数量
        "quantityUnit": "PC",           // 数量单位
        "netValue": "1000.00",          // 净值
        "taxValue": "100.00",           // 税值
        "grossValue": "1100.00",        // 毛值
        "currency": "USD"               // 货币
      }
    ]
  }
}
```

**响应结果：**
```json
{
  "success": true,
  "data": {
    "message": "Billing document BD001 has been created successfully", // 或 "updated successfully"
    "content": {
      "id": "BD001"                     // 开票凭证号
    }
  }
}
```

**响应字段说明：**
- `success`: 操作是否成功
- `data.message`: 详细的成功消息，包含开票凭证号
- `data.content.id`: 开票凭证号（创建时为新生成，修改时为原ID）

## 搜索接口集成

### 1. 售达方搜索接口

**接口地址：** `GET /api/search/sold-to-party`

**接口描述：** 为售达方字段提供搜索功能，支持按客户号和客户名称搜索。

**使用场景：** 在创建模式的开票到期清单查询阶段的soldToParty字段中使用

### 2. 开票凭证搜索接口

**接口地址：** `GET /api/search/billing-document`

**接口描述：** 为开票凭证号字段提供搜索功能，支持按开票凭证号、售达方、参考号搜索。

**使用场景：** 在查看模式和修改模式的开票凭证查询阶段的billingDocumentId字段中使用

**搜索方法配置：**
```javascript
import {
  soldToPartySearch,
  billingDocumentIdSearch
} from '@/utils/searchMethods'

// 在VarTree配置中使用
// 创建模式 - 售达方搜索
cns('string','leaf','soldToParty','',false,{
  searchMethods: [soldToPartySearch]
},[])

// 查看/修改模式 - 开票凭证搜索
cns('string','leaf','billingDocumentId','',false,{
  searchMethods: [billingDocumentIdSearch]
},[])
```

## 数据结构说明

### VarTree数据结构

#### 初始创建树 (initialCreationTree)
```javascript
const initialCreationTree = createTreeFromConfig(
  cns('dict','dict','billingDueList',{},false,{hideLabel:true},[
    cns('date','leaf','billingDate','',false,{},[]),
    cns('string','leaf','soldToParty','',false,{
      searchMethods: [soldToPartySearch]
    },[])
  ])
)
```

#### 初始搜索树 (initialSearchTree)
```javascript
const initialSearchTree = createTreeFromConfig(
  cns('dict','dict','billingDocumentSearch',{},false,{hideLabel:true},[
    cns('string','leaf','billingDocumentId','',false,{
      searchMethods: [billingDocumentIdSearch]
    },[])
  ])
)
```

#### 开票数据树 (billingDataTree)
```javascript
const billingDataTree = createTreeFromConfig(
  cns('dict','dict','billingData',{},false,{hideLabel:true},[
    cns('dict','dict','meta',{},false,{hideSelf:true},[
      cns('string','leaf','id','',false,{},[])
    ]),
    cns('dict','dict','basicInfo',{},false,{
      hideLabel:true,
      hideList:['type','netValueUnit']
    },[
      cns('selection','leaf','type','',false,{options:["Invoice"], hideLabel:true},[]),
      cns('string','leaf','id','',false,{},[]),
      cns('string','leaf','netValue','',false,{},[]),
      cns('string','leaf','netValueUnit','',false,{hideLabel:true},[]),
      cns('string','leaf','payer','',false,{},[]),
      cns('date','leaf','billingDate','',false,{},[])
    ]),
    cns('dict','dict','itemOverview',{},false,{},[
      cns('dynamiclist','list','items',null,false,{
        hideLabel:true,
        childTemplate:cns('dict','dict','item',null,false,{},[
          cns('string','leaf','item','',true,{},[]),
          cns('string','leaf','salesDocument','',false,{},[]),
          cns('string','leaf','salesDocumentItem','',false,{},[]),
          cns('string','leaf','material','',false,{},[]),
          cns('string','leaf','description','',false,{},[]),
          cns('string','leaf','billingQuantity','',false,{},[]),
          cns('string','leaf','quantityUnit','',false,{hideLabel:true},[]),
          cns('string','leaf','netValue','',true,{},[]),
          cns('string','leaf','taxValue','',true,{},[]),
          cns('string','leaf','grossValue','',true,{},[]),
          cns('string','leaf','currency','',true,{hideLabel:true},[])
        ])
      },[])
    ])
  ])
)
```

## 状态管理

### 状态切换逻辑
- **create → display**: 创建成功后自动切换
- **display → change**: 点击"Edit"按钮手动切换
- **change → display**: 保存成功后自动切换，或点击"Cancel"按钮手动切换

### 只读状态控制
- 查看模式下所有表单字段为只读状态
- 创建模式和修改模式下表单字段可编辑
- 状态切换时自动更新所有VarTree的readonly属性

```javascript
function appToState(newState: State) {
  state.value = newState
  let readonly = newState === 'display'
  writableTrees.forEach(tree => {
    tree.root!.readonly = readonly
  })
  if (appContentRef.value) {
    appContentRef.value.forceUpdate()
  }
}
```

## 错误处理

### 网络错误
- 所有API调用包含错误捕获
- 网络异常时返回 `{ success: false }`
- 控制台输出详细错误信息

### 业务错误
- 初始化失败时阻止进入下一阶段
- 查询失败时显示错误消息
- 保存失败时显示错误消息
- 用户可通过"取消"按钮中止操作
- 修改模式下取消操作会弹出确认对话框

## 组件结构

### Main.vue (主组件)
- 统一的开票凭证管理界面
- 支持三种操作模式的状态切换
- 包含所有业务逻辑和API调用
- 实现分阶段流程控制和状态管理

### Create.vue (创建页面入口)
- 简单的包装组件
- 自动将Main.vue设置为创建模式
- 通过onMounted钩子调用appToState('create')

### Display.vue (查看页面入口)
- 简单的包装组件
- 自动将Main.vue设置为查看模式
- 通过onMounted钩子调用appToState('display')

### Change.vue (修改页面入口)
- 简单的包装组件
- 自动将Main.vue设置为修改模式
- 通过onMounted钩子调用appToState('change')

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
- `searchMethods`: 搜索方法配置（soldToPartySearch, billingDocumentIdSearch）
- `VarTree`: 表单数据树管理工具
