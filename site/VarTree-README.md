# VarTree 组件系统重写说明 🐱

## 项目概述

本项目重写了原有的变量输入组件，基于全新的 `VarTree` 和 `VarNode` 类设计，提供了更规范、更灵活的变量管理和展示方案。

## 核心类设计

### VarNode 类
变量节点类，每个节点包含以下属性：

- **nodeType**: `"dict"|"list"|"leaf"` - 节点类型
- **varType**: 变量类型，对应组件的具体类型（如 `string`, `number`, `date` 等）
- **name**: 变量名称，为空时自动生成 `value_index` 格式
- **defaultValue**: 默认值
- **readonly**: 是否只读，默认 false
- **children**: 子节点数组 `VarNode[]`
- **index**: 中序遍历位置，初始化时自动设置

### VarTree 类
变量结构树类，由 VarNode 节点组成：

- 自动管理节点索引和默认名称
- 提供中序遍历、路径查找等功能
- 支持 JSON 序列化和反序列化
- 包含树的各种操作方法

## 组件结构

### VarInput 主组件
- **路径**: `src/components/VarInput/VarInput.vue`
- **功能**: 根据 VarTree 结构递归渲染输入组件
- **支持类型**:
  - 叶子节点：基础类型输入框
  - 字典节点：缩进显示的子组件
  - 列表节点：表格或列表形式的子组件

### 基础输入组件
位于 `src/components/VarInput/inputs/` 目录：

1. **StringInput.vue** - 字符串输入框
2. **NumberInput.vue** - 数字输入框  
3. **DateInput.vue** - 日期输入框（文本+日期选择器）
4. **SelectionInput.vue** - 选择下拉框
5. **StringArrayInput.vue** - 字符串数组输入

## 支持的变量类型

### 基础类型
- `string`: 文本输入框
- `number`: 数字输入框
- `date`: 日期选择器
- `selection`: 下拉选择框
- `string[]`: 字符串数组

### 复杂类型  
- `dict`: 字典结构，显示为缩进的子组件
- `fixlist`: 固定长度列表，表格形式显示
- `dynamiclist`: 动态列表，可添加删除项目

## 核心特性

### 1. 数据同步
- 父子组件的变量寄存器自动同步
- 支持深度嵌套的数据结构
- 实时更新和验证

### 2. 只读支持
- 支持节点级别的只读控制
- 只读属性可向下级联到子组件
- 灵活的权限控制

### 3. 内容验证
- 支持自定义验证函数
- 内置常用验证器（日期、数字、邮箱等）
- 实时验证和错误提示

### 4. 动态操作
- 动态列表支持添加/删除项目
- 支持长度限制和类型约束
- 表格和列表两种显示模式

## 测试用例

### 简单类型测试
- 单个 VarNode 的各种基础类型
- 验证器功能测试
- 只读模式测试

### 复杂类型测试
- 三层字典嵌套
- 三层列表嵌套  
- 混合字典和列表结构

### 功能特性测试
- 动态列表操作
- 数据同步验证
- 组件交互测试

## 快速开始

### 1. 创建简单的字符串输入
```javascript
import { VarTree, VarNodeFactory } from '@/utils/VarTree'
import VarInput from '@/components/VarInput/VarInput.vue'

// 创建节点
const root = VarNodeFactory.createStringNode('用户名', '', false)
const tree = new VarTree(root)

// 在模板中使用
<var-input 
  :varTree="tree" 
  :nodePath="[]"
  @update="handleUpdate"
/>
```

### 2. 创建复杂字典结构
```javascript
// 创建字典节点
const address = VarNodeFactory.createDictNode('address', [
  VarNodeFactory.createStringNode('province', '广东省'),
  VarNodeFactory.createStringNode('city', '深圳市')
])

const user = VarNodeFactory.createDictNode('user', [
  VarNodeFactory.createStringNode('name', '张三'),
  VarNodeFactory.createNumberNode('age', 25),
  address
])

const tree = new VarTree(user)
```

### 3. 创建动态列表
```javascript
const dynamicList = VarNodeFactory.createListNode('students', [], false, 'dynamiclist')
const tree = new VarTree(dynamicList)

// 配置列表项类型
const configs = {
  itemType: 'dict',
  maxLength: 5,
  itemConfig: {
    children: {
      name: 'string',
      score: 'number'
    }
  }
}
```

## 工厂函数

`VarNodeFactory` 提供了便捷的节点创建方法：

- `createStringNode(name, defaultValue, readonly)`
- `createNumberNode(name, defaultValue, readonly)`
- `createDateNode(name, defaultValue, readonly)`
- `createSelectionNode(name, defaultValue, readonly)`
- `createDictNode(name, children, readonly)`
- `createListNode(name, children, readonly, listType)`

## 验证器

内置验证器位于 `validators` 对象：

- `validators.date` - 日期格式检查
- `validators.number` - 数字检查
- `validators.required` - 非空检查
- `validators.email` - 邮箱格式检查
- `validators.url` - URL格式检查

## 运行测试

```bash
cd site
npm run serve
```

访问 http://localhost:8080 查看测试页面，可以在"新版VarTree测试"标签中体验所有功能。

## 文件结构

```
site/src/
├── utils/
│   └── VarTree.js          # 核心类定义
├── components/VarInput/
│   ├── VarInput.vue        # 主组件
│   └── inputs/             # 基础输入组件
│       ├── StringInput.vue
│       ├── NumberInput.vue
│       ├── DateInput.vue
│       ├── SelectionInput.vue
│       └── StringArrayInput.vue
└── views/
    └── NewTestPage.vue     # 测试页面
```

## 设计优势

1. **类型安全**: 严格的类型定义和验证
2. **可扩展**: 易于添加新的输入类型和验证器
3. **数据一致性**: 统一的数据结构和同步机制
4. **用户友好**: 直观的UI设计和交互体验
5. **性能优化**: 高效的更新机制和内存管理

---

*祝您使用愉快！有任何问题请随时联系~ 🐱*