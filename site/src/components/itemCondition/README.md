# ItemCondition 组件系统

这是一个可复用的 ItemCondition 组件系统，用于处理 items 列表的选择、验证和详细信息显示。

## 架构设计

### 1. ItemConditionKit 工具类

`ItemConditionKit` 是核心工具类，提供完整的配套设施：

```typescript
import { createItemConditionKit } from '@/utils/ItemConditionKit'

// 创建 kit 实例
const kit = createItemConditionKit({
  validationEndpoint: '/api/app/inquiry/items-tab-query',
  readonly: false,
  navigationLabels: {
    cancel: 'Cancel',
    save: 'Save',
    previous: '← Previous',
    next: 'Next →'
  }
})
```

### 2. 三个核心元素

#### summonItemsNode 函数
用于在 VarTree 中创建与 kit 实例绑定的 items 节点：

```typescript
// 在现有的 VarTree 中添加 items 节点
const itemsNode = kit.summonItemsNode(
  myVarTree, 
  ['itemOverview', 'items']  // 路径
)
```

#### ItemConditionDetail 组件
用于详细信息页面的组件：

```vue
<template>
  <ItemConditionDetail
    :kit="kit"
    @save="handleSave"
    @cancel="handleCancel"
    @validation-success="handleValidationSuccess"
  >
    <!-- 自定义插槽 -->
    <template #[`itemDetailConditions-pricingElements--extra-buttons`]>
      <button @click="addPricingElement">New</button>
      <button @click="deletePricingElement">Delete</button>
    </template>
  </ItemConditionDetail>
</template>
```

#### detailPageConfig 配置
通过 `kit.detailPageConfig` 获取详细信息页面的配置。

## 使用示例

### 完整使用流程

```vue
<script setup>
import { createTreeFromConfig, cns } from '@/utils/VarTree'
import { createItemConditionKit } from '@/utils/ItemConditionKit'
import { ItemConditionDetail } from '@/components/itemCondition'

// 1. 创建基础数据树（不包含 items）
const mainDataTree = createTreeFromConfig(
  cns('dict','dict','mainData',{},false,{hideLabel:true},[
    cns('dict','dict','basicInfo',{},false,{hideLabel:true},[
      cns('string','leaf','inquiry','INQ-001',false,{},[],"Inquiry:"),
      cns('string','leaf','soldToParty','CUST-001',false,{},[],"Sold-To Party:"),
    ]),
    cns('dict','dict','itemOverview',{},false,{},[
      cns('date','leaf','validFrom','',false,{},[],"Valid From:"),
      cns('date','leaf','validTo','',false,{},[],"Valid To:"),
      // items 节点将通过 kit.summonItemsNode 添加
    ],'Item Overview')
  ])
)

// 2. 创建 ItemConditionKit 实例
const kit = createItemConditionKit({
  validationEndpoint: '/api/app/inquiry/items-tab-query',
  readonly: false
})

// 3. 使用 kit 创建 items 节点
const itemsNode = kit.summonItemsNode(mainDataTree, ['itemOverview', 'items'])

// 4. 处理事件
function handleItemsTableClick() {
  itemConditionDetailRef.value?.handleItemsTableClick()
}

function handleSave() {
  console.log('保存数据')
}

function handleValidationSuccess(items) {
  console.log('验证成功，切换到详细信息页面')
  // 切换到详细信息阶段
}
</script>

<template>
  <AppContent :stages="['basicInfo', 'itemOverview', 'itemCondition']">
    <!-- Items 列表阶段 -->
    <template #[`stage-itemOverview`]>
      <VarBox :tree="mainDataTree">
        <template #[`itemOverview-items--extra-buttons`]>
          <button @click="handleItemsTableClick">...</button>
        </template>
      </VarBox>
    </template>

    <!-- Item 详细信息阶段 -->
    <template #[`stage-itemCondition`]>
      <ItemConditionDetail
        ref="itemConditionDetailRef"
        :kit="kit"
        @save="handleSave"
        @cancel="handleCancel"
        @validation-success="handleValidationSuccess"
      />
    </template>
  </AppContent>
</template>
```

## 特性

### 1. 自动数据管理
- 数据隔离：使用 clone() 创建编辑副本
- 验证机制：可配置的后端验证端点
- 同步策略：验证成功后同步到原始数据

### 2. 灵活配置
- 自定义验证端点
- 自定义导航标签
- 自定义详细信息结构
- 只读模式支持

### 3. 完整功能
- 多 item 导航
- 标签页切换（Sales/Conditions）
- 插槽透传
- 事件系统

## 与 inquiry 应用的兼容性

这个新架构完全兼容现有的 inquiry 应用逻辑：
- 相同的验证机制
- 相同的数据结构
- 相同的用户交互流程
- 相同的样式和布局

## 测试

访问测试页面：
- `/application/test/item-condition-kit` - 新架构测试
- `/application/test/item-condition` - 原始组件测试

## 迁移指南

从现有实现迁移到新架构：

1. 替换详细信息树的定义为 `ItemConditionKit`
2. 使用 `summonItemsNode` 创建 items 节点
3. 替换详细信息页面组件为 `ItemConditionDetail`
4. 更新事件处理逻辑

这样可以大大简化代码，提高复用性。
