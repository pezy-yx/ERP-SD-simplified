# Item组件接口文档

## 概述

Item组件是SD模块中用于管理物品条件的核心组件，提供了统一的物品数据结构和验证服务接口。该组件被广泛应用于销售订单、报价单、询价单和开票凭证等业务场景中，支持物品的详细信息管理、定价元素计算和数据验证功能。

## 核心功能

### 1. ItemConditionKit组件
ItemConditionKit是一个可复用的物品条件管理工具，提供以下功能：
- **物品列表管理**：支持多物品的选择、导航和编辑
- **详细信息页面**：为每个物品提供详细的条件编辑界面
- **数据验证**：集成后端验证服务，确保数据的准确性
- **导航控制**：提供上一步/下一步导航，支持物品间的快速切换

### 2. 数据结构标准化
所有使用Item组件的应用都采用统一的数据结构，确保：
- **一致性**：跨应用的数据格式保持一致
- **可扩展性**：支持定价元素等复杂数据结构
- **兼容性**：与现有VarTree/VarNode系统完全兼容

## 物品数据结构

### 基础物品结构 (Item)
```json
{
  "item": "string",                    // 项目号
  "material": "string",                // 物料号
  "orderQuantity": "string",           // 订单数量
  "orderQuantityUnit": "string",       // 订单数量单位
  "description": "string",             // 物料描述
  "reqDelivDate": "string",            // 要求交货日期 (YYYY-MM-DD)
  "netValue": "string",                // 净值
  "netValueUnit": "string",            // 净值单位
  "taxValue": "string",                // 税值
  "taxValueUnit": "string",            // 税值单位
  "pricingDate": "string",             // 定价日期 (YYYY-MM-DD)
  "orderProbability": "string",        // 订单概率
  "pricingElements": []                // 定价元素列表
}
```

### 定价元素结构 (PricingElement)
```json
{
  "cnty": "string",                    // 国家代码
  "name": "string",                    // 条件名称 (例如: "Base Price", "Tax", "Discount")
  "amount": "string",                  // 金额
  "city": "string",                    // 城市/货币标识
  "per": "string",                     // 每 (例如: "1")
  "uom": "string",                     // 计量单位 (例如: "EA", "KG")
  "conditionValue": "string",          // 条件值
  "curr": "string",                    // 货币代码 (例如: "USD", "EUR")
  "status": "string",                  // 状态 (例如: "Active", "Inactive")
  "numC": "string",                    // 数量条件
  "atoMtsComponent": "string",         // ATO/MTS组件标识
  "oun": "string",                     // OUn字段
  "cconDe": "string",                  // CConDe字段
  "un": "string",                      // Un字段
  "conditionValue2": "string",         // 条件值2
  "cdCur": "string",                   // CdCur字段
  "stat": "boolean"                    // 统计标志
}
```

## 物品验证服务接口

### 接口规范

**接口地址：** `POST {validationEndpoint}/items-tab-query`

**功能描述：** 批量验证和计算物品的定价信息，返回详细的定价元素和验证结果。

**使用场景：**
- 用户修改物品信息后的实时验证
- 物品条件页面的数据计算
- 保存前的数据完整性检查

### 请求参数

**Content-Type:** `application/json`

**请求体格式：**
```json
[
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
    "pricingElements": [
      {
        "cnty": "string",
        "name": "string",
        "amount": "string",
        "city": "string",
        "per": "string",
        "uom": "string",
        "conditionValue": "string",
        "curr": "string",
        "status": "string",
        "numC": "string",
        "atoMtsComponent": "string",
        "oun": "string",
        "cconDe": "string",
        "un": "string",
        "conditionValue2": "string",
        "cdCur": "string",
        "stat": "boolean"
      }
    ]
  }
]
```

### 响应结果

**成功响应：**
```json
{
  "success": true,
  "message": "批量验证成功",
  "data": {
    "result": {
      "allDataLegal": 1,               // 1表示所有数据合法，0表示存在不合法数据
      "badRecordIndices": []           // 不合法数据的索引列表 (从0开始)
    },
    "generalData": {
      "netValue": "string",            // 总净值
      "netValueUnit": "string",        // 总净值单位
      "expectOralVal": "string",       // 总预期口头值
      "expectOralValUnit": "string"    // 总预期口头值单位
    },
    "breakdowns": [
      {
        "item": "string",
        "material": "string",
        "orderQuantity": "string",
        "orderQuantityUnit": "string",
        "description": "string",
        "reqDelivDate": "string",
        "netValue": "number",          // 计算后的净值
        "netValueUnit": "string",
        "taxValue": "number",          // 计算后的税值
        "taxValueUnit": "string",
        "pricingDate": "string",
        "orderProbability": "string",
        "pricingElements": [
          {
            "cnty": "string", // 定价元素的唯一标识，例如：BASE（基础价格），DISC（固定折扣），DISCP（百分比折扣）。-> 新增时，一般由用户输入
            "name": "string", // 定价元素的文字说明，如：基础价格，现金折扣，百分比折扣。新增时根据输入的cnty生成。
            "amount": "string", // 该定价元素的金额。可以是货币值（如 $10.00）或百分比（如 10%）。-> 新增时，一般由用户输入
            "city": "string", // 应该改名叫crcy，上一行对应的单位，比如打折那就是用商品的单位，百分比打折那就是用%。新增时由cnty生成。
            "per": "string", // 指示上面的金额是每单位的数量。例如每两件，那就是2。默认是1，用户可以改。
            "uom": "string", // 上一行数量的单位。例如每两件，那就是EA（每件）。默认是EA，用户可以改。
            "conditionValue": "string", // 本行定价元素的金额，参与最后的netValue计算，例如打折造成了减25，那就是-25。后端计算得到
            "curr": "string", // 金额的币种单位，和material的单位是一样的，由material生成。

            "status": "string", // 留空
            "numC": "string", // 留空
            "atoMtsComponent": "string", // 留空
            "oun": "string", // 留空
            "cconDe": "string", // 留空
            "un": "string", // 留空
            "conditionValue2": "string", // 留空
            "cdCur": "string", // 留空
            "stat": "boolean" // 默认是true
          }
        ]
      }
    ]
  }
}
```

**错误响应：**
```json
{
  "success": false,
  "message": "验证失败，请检查输入数据"
}
```

### 响应字段说明

#### result字段
- `allDataLegal`: 整体验证结果，1表示通过，0表示失败
- `badRecordIndices`: 验证失败的物品索引数组，用于前端标记错误项

#### generalData字段
- `netValue`: 所有物品的总净值
- `netValueUnit`: 总净值的货币单位
- `expectOralVal`: 预期口头价值（通常比净值高10-15%）
- `expectOralValUnit`: 预期口头价值的货币单位

#### breakdowns字段
- 包含每个物品的详细计算结果
- `netValue`和`taxValue`为计算后的数值类型
- `pricingElements`包含完整的定价元素明细

## ItemConditionKit配置

### 基础配置接口
```typescript
interface ItemConditionKitConfig {
  validationEndpoint: string           // 验证服务端点
  readonly?: boolean                   // 是否只读模式
  navigationLabels?: {                 // 导航按钮标签
    cancel?: string
    save?: string
    previous?: string
    next?: string
  }
  detailStructures?: {                 // 自定义详细信息页面结构
    header?: NodeStructure
    sales?: NodeStructure
    conditions?: NodeStructure
  }
}
```

### 使用示例
```typescript
import { createItemConditionKit } from '@/utils/ItemConditionKit'

// 创建ItemConditionKit实例
const itemKit = createItemConditionKit({
  validationEndpoint: '/api/app/inquiry',
  readonly: false,
  navigationLabels: {
    cancel: '取消',
    save: '保存',
    previous: '上一项',
    next: '下一项'
  }
})

// 设置物品节点
itemKit.setItemsNode(itemsNode)

// 获取详细页面配置
const detailConfig = itemKit.detailPageConfig()
```

## 应用集成指南

### 1. 在应用中集成ItemConditionKit

#### 步骤1：导入和配置
```typescript
import { createItemConditionKit } from '@/utils/ItemConditionKit'

const itemConditionKit = createItemConditionKit({
  validationEndpoint: '/api/app/your-app',  // 替换为具体应用的端点
  readonly: computed(() => state.value === 'display')
})
```

#### 步骤2：设置物品节点
```typescript
// 在适当的时机设置物品节点
itemConditionKit.setItemsNode(yourItemsNode)
```

#### 步骤3：配置详细页面
```typescript
// 获取详细页面的VarBox配置
const itemConditionConfig = itemConditionKit.detailPageConfig()
```

### 2. VarTree数据结构配置

#### 物品列表配置
```typescript
cns('dynamiclist','list','items',null,false,{
  hideLabel: true,
  hideList: ['netValueUnit', 'pricingDate', 'orderProbability', 'reqDelivDate', 'taxValueUnit', 'pricingElements'],
  childTemplate: cns('dict','dict','item',null,false,{},[
    cns('string','leaf','item','',true,{},[]),
    cns('string','leaf','material','',false,{},[]),
    cns('string','leaf','orderQuantity','',false,{},[]),
    cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[]),
    cns('string','leaf','description','',false,{},[]),
    cns('date','leaf','reqDelivDate','',false,{},[]),
    cns('string','leaf','netValue','',true,{},[]),
    cns('string','leaf','netValueUnit','',true,{hideLabel:true},[]),
    cns('string','leaf','taxValue','',true,{},[]),
    cns('string','leaf','taxValueUnit','',true,{hideLabel:true},[]),
    cns('date','leaf','pricingDate','',false,{},[]),
    cns('string','leaf','orderProbability','',false,{},[]),
    cns('dynamiclist','list','pricingElements',null,true,{
      rowProvided: 0,
      hideLabel: true,
      childTemplate: cns('dict','dict','pricingElement',null,false,{},[
        cns('string','leaf','cnty','',true,{},[]),
        cns('string','leaf','name','',true,{},[]),
        cns('string','leaf','amount','',true,{},[]),
        cns('string','leaf','city','',true,{},[]),
        cns('string','leaf','per','',true,{},[]),
        cns('string','leaf','uom','',true,{},[]),
        cns('string','leaf','conditionValue','',true,{},[]),
        cns('string','leaf','curr','',true,{},[]),
        cns('string','leaf','status','',true,{},[]),
        cns('string','leaf','numC','',true,{},[]),
        cns('string','leaf','atoMtsComponent','',true,{},[]),
        cns('string','leaf','oun','',true,{},[]),
        cns('string','leaf','cconDe','',true,{},[]),
        cns('string','leaf','un','',true,{},[]),
        cns('string','leaf','conditionValue2','',true,{},[]),
        cns('string','leaf','cdCur','',true,{},[]),
        cns('boolean','leaf','stat','',true,{},[])
      ])
    },[])
  ])
},[])
```

## 验证服务端点配置

### 各应用的验证端点

| 应用类型 | 验证端点 | 说明 |
|---------|---------|------|
| 销售订单 | `/api/app/so/items-tab-query` | 销售订单物品验证服务 |
| 报价单 | `/api/app/quotation/items-tab-query` | 报价单物品验证服务 |
| 询价单 | `/api/app/inquiry/items-tab-query` | 询价单物品验证服务 |
| 开票凭证 | `/api/app/billing/items-tab-query` | 开票凭证物品验证服务 |

### 端点实现要求

每个应用的验证端点都必须：
1. **接受标准的物品数组作为输入**
2. **返回标准的验证响应格式**
3. **支持定价元素的计算和验证**
4. **提供详细的错误信息和索引**

## 业务规则

### 1. 数据验证规则
- **必填字段验证**：item、material、orderQuantity等关键字段不能为空
- **数值格式验证**：数量、金额等字段必须为有效数值
- **日期格式验证**：日期字段必须符合YYYY-MM-DD格式
- **业务逻辑验证**：根据具体业务场景进行逻辑校验

### 2. 定价计算规则
- **基础价格计算**：根据物料和数量计算基础价格
- **税费计算**：根据税率和基础价格计算税费
- **折扣应用**：应用相关的折扣条件
- **总价汇总**：计算物品的最终净值和税值

### 3. 数据同步规则
- **实时验证**：用户修改数据时触发验证
- **批量处理**：支持多物品的批量验证
- **错误标记**：验证失败的物品会被标记并阻止保存
- **数据回滚**：验证失败时可回滚到上次有效状态

## 错误处理

### 1. 网络错误
- 验证服务不可用时的降级处理
- 超时重试机制
- 用户友好的错误提示

### 2. 数据错误
- 无效数据的标记和提示
- 错误字段的高亮显示
- 详细的错误信息展示

### 3. 业务错误
- 业务规则违反的处理
- 数据不一致的解决方案
- 用户操作指导

## 性能优化

### 1. 数据缓存
- 验证结果的本地缓存
- 重复请求的避免
- 智能的缓存失效策略

### 2. 批量处理
- 多物品的批量验证
- 减少网络请求次数
- 优化数据传输量

### 3. 用户体验
- 异步验证不阻塞用户操作
- 渐进式数据加载
- 响应式界面更新

## 扩展性设计

### 1. 自定义字段支持
- 支持业务特定的额外字段
- 灵活的数据结构扩展
- 向后兼容性保证

### 2. 多业务场景适配
- 不同应用的个性化配置
- 可插拔的验证逻辑
- 统一的接口标准

### 3. 国际化支持
- 多语言的字段标签
- 本地化的数据格式
- 区域特定的业务规则

## 总结

Item组件为SD模块提供了统一、可靠、可扩展的物品管理解决方案。通过标准化的数据结构、统一的验证接口和灵活的配置选项，Item组件确保了跨应用的一致性和可维护性。

### 主要优势
- **标准化**：统一的数据结构和接口规范
- **可复用**：ItemConditionKit可在多个应用中复用
- **可扩展**：支持自定义字段和业务逻辑
- **可靠性**：完善的验证和错误处理机制
- **用户友好**：直观的界面和流畅的操作体验

### 适用场景
- 销售订单管理
- 报价单管理  
- 询价单管理
- 开票凭证管理
- 其他需要物品条件管理的业务场景

通过使用Item组件，开发者可以快速构建功能完整、用户体验良好的物品管理界面，同时确保数据的准确性和业务流程的一致性。