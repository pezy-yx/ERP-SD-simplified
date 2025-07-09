# ERP-SD-simplified

## 项目简介
本项目为ERP系统SD模块的简化版前端，支持变量树结构配置、动态表单渲染与自定义输入组件。适合学习、实验和快速原型开发哟！

## 主要功能
- 变量树结构可视化与编辑
- 动态表单自动生成
- 支持自定义输入组件
- 变量校验与类型约束
- 适配多种业务场景

## 技术栈
- Vue 3 + Composition API
- TypeScript
- Element Plus
- Vite

## 目录结构
```
site/
├── src/                # 源码目录
│   ├── components/     # 组件
│   ├── utils/          # 工具函数
│   ├── views/          # 页面
│   └── test/           # 测试用例
├── public/             # 静态资源
├── package.json        # 项目依赖
└── ...
```

## 前端运行指南
确保你已安装 Node.js 和 npm
```bash
cd site
npm install --force      # 安装依赖，必须使用force参数
npm run serve    # 启动开发服务器
```

## 部署与打包说明
开发环境启动见下方，若需生产部署：
```bash
cd site
npm run build   # 生成dist目录
# 可将dist部署到任意静态服务器
```

## 团队协作开发指南 🌟

### 1. 准备工作
```bash
# 1. 确保在 main 分支上
git checkout main

# 2. 获取最新代码
git fetch
git pull origin main
```

### 2. 创建新分支进行开发
```bash
# 创建并切换到新分支
# 分支命名规范: feature/功能名 或 fix/问题描述
# 例如: feature/user-login 或 fix/navigation-error
git checkout -b feature/your-feature-name

# 查看当前分支（确认已切换到新分支）
git status
```

### 3. 开发流程
```bash
# 1. 查看改动的文件
git status

# 2. 添加修改的文件到暂存区
git add .     # 添加所有修改
# 或
git add 文件名  # 添加指定文件

# 3. 提交修改
# commit 信息要简洁清晰地描述这次改动
git commit -m "feat: 添加用户登录功能"

# 4. 推送到远程仓库
git push -u origin feature/your-feature-name
```

### 4. 创建 Pull Request
1. 推送后，终端会显示创建 Pull Request 的链接，点击该链接
2. 或直接在 GitHub 仓库页面的 "Pull requests" 标签页中点击 "New pull request"
3. 在 PR 描述中：
   - 简要说明实现的功能或修复的问题
   - 如果有相关的设计文档或讨论，请附上链接
   - 如果有特殊的测试说明，也请一并说明

### 5. 等待代码审查
1. 在右侧 "Reviewers" 选择审查者
2. 等待审查反馈
3. 如果需要修改：
   - 在原分支上继续修改代码
   - 提交并推送修改
   - PR 会自动更新

### 常见问题解决方案 💡

1. 如果提交时遇到 "Changes must be made through a pull request" 错误：
   - 说明不能直接推送到 main 分支
   - 需要创建新的功能分支进行开发

2. 如何处理代码冲突：
   ```bash
   # 1. 切换到你的功能分支
   git checkout feature/your-feature-name
   
   # 2. 获取最新的 main 分支代码
   git fetch origin main
   
   # 3. 将 main 分支的更新合并到你的分支
   git merge origin/main
   
   # 4. 解决冲突后，提交并推送
   git add .
   git commit -m "fix: resolve conflicts with main"
   git push
   ```

3. 如何更新已经创建的分支：
   ```bash
   # 获取远程更新
   git fetch
   
   # 合并远程更新
   git merge origin/main
   ```

### 提交信息规范 📝
- feat: 新功能
- fix: 修复问题
- docs: 文档变更
- style: 代码格式修改
- refactor: 代码重构
- test: 测试用例相关变更
- chore: 构建过程或辅助工具的变更

示例：`feat: 添加用户登录验证功能`

需要帮助或有任何问题，欢迎随时在群里讨论 (｀・ω・´)ノ

# CodeBase

## 1. 变量树

### 1.1. VarTree和VarNode核心类

#### 1.1.1 核心概念
- **VarTree类**：变量树管理器，管理整个递归变量结构
- **VarNode类**：变量节点，表示树中的单个节点，支持三种节点类型（dict/list/leaf）
- **NodeStructure接口**：节点结构定义，用于快速构建变量树

#### 1.1.2 VarTree类主要属性和方法
**属性：**
- `root: VarNode | null`：根节点
- `nodeIndex: number`：节点索引计数器

**核心方法：**
- `findNodeByPath(path: string[]): VarNode | null`：根据路径查找节点
- `findPathToNode(node: VarNode): string[] | null`：根据节点查找路径
- `getAllNodes(): VarNode[]`：获取所有节点
- `setRoot(rootNode: VarNode): void`：设置根节点

#### 1.1.3 VarNode类主要属性和方法
**核心属性：**
- `nodeType: NodeTypeString`：节点类型（"dict"|"list"|"leaf"）
- `varType: VarTypeString`：变量类型（"string"|"number"|"date"|"selection"|"dict"|"dynamiclist"|"fixlist"）
- `name: string`：变量名称
- `nameDisplay: string`：显示名称
- `defaultValue: VarNodeValue`：默认值
- `readonly: boolean`：只读状态
- `children: VarNode[]`：子节点数组
- `config: VarNodeConfig`：配置对象

**核心方法：**
- `currentValue` getter/setter：自动聚合/分发子节点值
- `addChild(child: VarNode): void`：添加子节点
- `removeChild(index: number): void`：移除子节点
- `clone(): VarNode`：克隆节点
- `template(): VarNode`：生成模板节点（清空值，保留结构）

#### 1.1.4 工具函数
- `createNodeStructure()/cns()`：快速构建NodeStructure
- `createTreeFromConfig(struct: NodeStructure): VarTree`：从配置创建VarTree

```typescript
import { cns, createTreeFromConfig } from '@/utils/VarTree'

// 使用cns快速构建结构
const nodeStructure = cns('dict', 'dict', 'userInfo', null, false, {}, [
  cns('string', 'leaf', 'username', 'John', false),
  cns('number', 'leaf', 'age', 25, false)
])

// 创建变量树
const tree = createTreeFromConfig(nodeStructure)
```

### 1.2. VarInput和VarBox组件标准接口

#### 1.2.1 VarInput组件Props详解
- **`varTree: VarTree`**：要渲染的变量树实例（与VarTree类对应）
- **`nodePath: string[]`**：当前节点在树中的路径（用于VarTree.findNodeByPath()）
- **`readonly?: boolean`**：是否只读模式（对应VarNode.readonly）
- **`config?: VarNodeConfig`**：节点配置（扩展VarNode.config，支持组件级覆盖）
- **`indentLevel?: number`**：缩进级别（用于递归渲染的视觉层次）
- **`showLabel?: boolean`**：是否显示标签（对应VarNode.nameDisplay）
- **`wrapperStyle?: Record<string, any>`**：容器样式

#### 1.2.2 VarBox组件Props详解
- **`tree: VarTree`**：变量树实例（直接传递给VarInput）
- **其他props**：透传给VarInput的配置项（indentLevel、showLabel、wrapperStyle）

#### 1.2.3 基础输入组件接口（varbox/inputs）
**组件类型：**
- **StringInput**：字符串输入组件
- **NumberInput**：数字输入组件
- **DateInput**：日期输入组件
- **SelectionInput**：选择输入组件
- **BooleanInput**：布尔值输入组件（复选框形式）

**标准Props：**
- `modelValue`：当前值
- `readonly`：是否只读
- `placeholder`：占位符文本
- `config`：配置对象
- `node`：当前VarNode实例
- `tree`：VarTree实例
- `nodePath`：节点路径

**标准Emits：**
- `update:modelValue`：值更新事件
- `blur`：失焦事件
- `enter`：回车事件
- `validation-error`：校验错误事件

### 1.3. 功能分类介绍

#### 1.3.1 基础读写功能
VarInput通过`varTree`和`nodePath`定位到具体的VarNode，实现双向数据绑定：

```vue
<var-input
  :varTree="userTree"
  :nodePath="[]"
  @update="handleUpdate"
/>
```

**支持的变量类型：**
- `string`：字符串类型
- `number`：数字类型
- `date`：日期类型
- `selection`：选择类型
- `boolean`：布尔值类型
- `dict`：字典类型（对象）
- `dynamiclist`：动态列表
- `fixlist`：固定列表

**递归渲染机制：**
- `leaf`节点：渲染对应的基础输入组件
- `dict`节点：递归渲染所有子节点
- `list`节点：渲染列表容器和子项

#### 1.3.2 插槽与自定义外观功能

**插槽命名规则：**
基于`getPathString()`生成的路径字符串：
- `${pathString}--wrapper`：完全自定义整个节点容器
- `${pathString}--main`：自定义主要内容区域
- `${pathString}--extra`：额外组件插槽
- `${pathString}--simple`：自定义基础输入组件

```vue
<var-input :varTree="tree" :nodePath="[]">
  <!-- 为用户名字段添加额外按钮 -->
  <template #用户名--extra="slotProps">
    <button @click="clearField(slotProps)">清除</button>
  </template>

  <!-- 自定义输入组件 -->
  <template #用户名--simple="slotProps">
    <input v-model="slotProps.allProps.modelValue" class="custom-input" />
  </template>
</var-input>
```

**CSS类名系统：**
```vue
<var-input
  :varTree="tree"
  :config="{ classPrefix: 'search-input' }"
/>
```

classPrefix缺省则使用路径字符串作为前缀

生成类名：
- `search-input--wrapper`：容器类名
- `search-input--main`：主要内容类名
- `search-input--extra`：额外组件类名

在父组件中使用`:deep()`定制样式：
```vue
<style scoped>
:deep(.search-input--wrapper) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.search-input--extra) {
  display: flex;
  gap: 4px;
}
</style>
```

**TestPage中的实际应用案例：**

1. **水平布局的搜索输入框**：
```vue
<!-- 通过classPrefix精确定位到特定节点 -->
<var-input
  :varTree="tree"
  :config="{ classPrefix: 'search-input' }"
>
  <template #用户名--extra="allProps">
    <button class="search-btn">🔍 搜索</button>
    <button class="clear-btn">✖️ 清除</button>
  </template>
</var-input>

<style scoped>
:deep(.search-input--wrapper) {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
}
</style>
```

2. **垂直布局的数值输入框**：
```vue
<var-input
  :varTree="numberTree"
  :config="{ classPrefix: 'number-input' }"
>
  <template #年龄--extra="allProps">
    <div class="number-controls">
      <button @click="increment(allProps)">+ 增加</button>
      <button @click="decrement(allProps)">- 减少</button>
    </div>
  </template>
</var-input>

<style scoped>
:deep(.number-input--wrapper) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #E4E7ED;
  border-radius: 6px;
  padding: 12px;
}
</style>
```

**自定义组件钩子：**
```vue
<var-input
  :varTree="tree"
  :config="{ customComponent: markRaw(MyCustomInput) }"
/>
```

#### 1.3.3 校验器功能

**校验器接口：**
```typescript
type VarNodeValueValidator = {
  creteria: (value: VarNodeValue) => boolean,
  message?: string
}
```

**配置方式：**
```typescript
const validators = [
  {
    creteria: (v) => typeof v === 'string' && v.length > 0,
    message: '不能为空'
  },
  {
    creteria: (v) => typeof v === 'string' && v.length <= 50,
    message: '长度不能超过50个字符'
  }
]

const nodeStructure = cns('string', 'leaf', 'username', '', false, {
  validators: validators
})
```

**触发时机：**
- 在简单输入组件的`@enter`事件中自动触发校验
- 校验失败时通过`validation-error`事件传递错误信息

#### 1.3.4 动态列表

**动态列表配置：**
```typescript
const dynamicListNode = cns('dynamiclist', 'list', 'hobbies', [], false, {
  maxLength: 5,  // 最大长度限制
  childTemplate: cns('string', 'leaf', '', '', false)  // 子项模板
})
```

**功能特性：**
- 运行时添加/删除子项
- 通过`config.maxLength`控制列表最大长度
- 通过`config.childTemplate`定义新增子项的结构，这个参数强烈建议传入
- 自动生成添加/删除按钮
- **列表选择功能**：现代化的表格交互体验
  - 第一列为复选框选择列，替代原有的单行删除按钮
  - 表头复选框支持全选/清除全选操作
  - 删除按钮移至添加按钮旁边，支持批量删除选中行
  - 删除按钮显示选中行数：`删除选中 (2)`
  - 自动管理选择状态，删除行后重新映射索引

```vue
<var-input
  :varTree="dynamicListTree"
  :nodePath="[]"
  :config="{ maxLength: 5 }"
  @update="handleListUpdate"
/>
```

#### 1.3.5 特性说明

**路径字符串生成与类名系统：**

VarInput为每个节点自动生成基于路径的类名前缀，支持精确的样式定位：

```typescript
// 路径 ['user', 'profile', 'name']
// 生成插槽名称：'user-profile-name--extra'
// 生成类名前缀：'user-profile-name'
```

**类名生成规则（共30余种，仅展示部分，可在VarInput组件中查看）：**
- `${baseClassPrefix}--wrapper`：节点容器类名
- `${baseClassPrefix}--main`：主要内容区域类名
- `${baseClassPrefix}--extra`：额外组件区域类名
- `${baseClassPrefix}--leaf-node`：叶子节点类名
- `${baseClassPrefix}--dict-item`：字典项类名
- `${baseClassPrefix}--list-row`：列表行类名

**自定义类名前缀：**
```vue
<!-- 使用config.classPrefix覆盖默认的路径前缀 -->
<var-input
  :varTree="tree"
  :config="{ classPrefix: 'custom-prefix' }"
/>
<!-- 生成类名：custom-prefix--wrapper, custom-prefix--main 等 -->
```

**透传机制：**
所有插槽在递归组件中自动透传，确保深层嵌套的节点也能接收到自定义插槽。

**响应式支持：**
与Vue 3响应式系统完全兼容，支持ref包装的VarTree对象：
```typescript
import { ref } from 'vue'

const treeRef = ref(createTreeFromConfig(nodeStructure))
// 自动响应数据变化
```

**TestPage实践指南：**

TestPage展示了多种高级用法，包括：
- 通过路径精确定位节点并应用自定义样式
- 使用`:deep()`穿透作用域样式，改变叶子节点的布局方式
- 组合使用插槽和CSS类名实现复杂的UI需求
- 不同布局模式的实现（水平、垂直、网格等）

查看`site/src/test/varbox/TestPage.vue`, `site/src/test/varbox/TestPageErp.vue`获取更多实现示例。

### 1.4. 在复杂ERP系统前端中可能可以解决的问题

- **任意深度嵌套数据的统一渲染**：一套组件解决所有层级的数据展示需求
- **高度可定制的用户界面**：通过插槽系统实现业务特定的UI需求
- **配置驱动的表单生成**：通过NodeStructure配置快速构建复杂表单
- **数据录入表单**：根据业务规则动态生成的录入界面
- **递归组件设计**：避免了硬编码的层级限制
- **标准化接口**：确保了组件间的一致性和可维护性


## 2. 搜索模态框 (SearchModal)

### 2.1. 核心概念
`SearchModal`是一个与`VarInput`紧密集成的高度可复用搜索组件。其核心思想是将**搜索的定义（需要哪些参数）**、**搜索的执行（调用哪个后端服务）** 与**搜索的触发（在哪个输入框上）** 完全解耦。

通过在`VarNode`的`config`中提供一个`SearchMethod`对象，任何`VarInput`都可以被赋予一个搜索功能，用于帮助用户查找并填充该输入框的值。

### 2.2. SearchMethod 接口详解
`SearchMethod`是配置搜索功能的核心接口，它定义了一个完整搜索操作所需的所有信息。

```typescript
// 定义于: src/api/searchService.ts (示例)
export interface SearchMethod {
  name: string;
  paramTree: VarTree | null;
  serviceUrl: string;
}
```

**参数详解:**

-   **`name: string`**
    -   **描述**: 搜索模态框的标题。
    -   **作用**: 用于向用户明确当前正在搜索什么内容，例如“搜索客户”或“选择物料”。

-   **`paramTree: VarTree | null`**
    -   **描述**: 一个`VarTree`实例，用于动态生成搜索参数的输入表单。
    -   **作用**: 这是`SearchModal`强大灵活性的关键。开发者可以通过构建一个`VarTree`来定义搜索需要的所有参数，包括参数的类型、名称、默认值、校验规则等。`SearchModal`内部会使用`VarBox`组件将这个`VarTree`渲染成一个交互式表单。如果某个搜索不需要参数，可以设为`null`。

-   **`serviceUrl: string`**
    -   **描述**: 后端提供搜索服务的API端点URL。
    -   **作用**: 当用户在模态框中点击“搜索”时，`SearchModal`会收集`paramTree`表单中的所有参数，并将它们作为请求体发送到这个URL。

### 2.3. 使用与集成

#### 2.3.1 定义一个SearchMethod
首先，你需要在一个统一的地方（例如 `src/api/searchService.ts`）定义具体的搜索方法对象。

```typescript
// src/api/searchService.ts
import { VarTree, cns, createTreeFromConfig } from '@/utils/VarTree';

// 1. 为“搜索客户”功能定义参数树
const customerSearchParamStruct = cns('dict', 'dict', 'params', null, false, {}, [
  cns('string', 'leaf', 'customerName', '客户名称', false),
  cns('string', 'leaf', 'customerCode', '客户代码', false)
]);
const customerSearchParamTree = createTreeFromConfig(customerSearchParamStruct);

// 2. 创建SearchMethod对象
export const searchCustomer: SearchMethod = {
  name: '搜索客户',
  paramTree: customerSearchParamTree,
  serviceUrl: '/api/search/customer' // 后端搜索客户的API地址
};
```

#### 2.3.2 在VarNode中配置
然后，在你的业务页面中，将这个`SearchMethod`对象配置到需要搜索功能的`VarNode`的`config`属性中。

```typescript
// 在你的视图组件中
import { cns } from '@/utils/VarTree';
import { searchCustomer } from '@/api/searchService'; // 引入定义好的搜索方法

// 在构建NodeStructure时，为customerId字段配置searchMethod
const orderStruct = cns('dict', 'dict', 'order', null, false, {}, [
  cns('string', 'leaf', 'orderId', '订单号', true),
  cns('string', 'leaf', 'customerId', '客户ID', false, {
    // 将searchMethod对象传入config
    searchMethod: searchCustomer
  })
]);
```

### 2.4. 数据流转说明
1.  **触发**: 用户点击`VarInput`输入框（如“客户ID”）旁边的搜索图标。
2.  **识别**: `VarInput`组件检测到其对应的`VarNode`的`config`中存在`searchMethod`属性。
3.  **打开模态框**: `VarInput`触发一个全局事件，打开`SearchModal`组件，并将`searchCustomer`对象作为参数传入。
4.  **渲染表单**: `SearchModal`根据`searchCustomer.name`设置标题，并使用`searchCustomer.paramTree`通过`ParamInput`组件渲染出“客户名称”和“客户代码”两个输入框。
5.  **执行搜索**: 用户填写参数后点击“搜索”，`SearchModal`将参数发送到`searchCustomer.serviceUrl` (`/api/search/customer`)，并展示返回的数据列表。
6.  **回填数据**: 用户从列表中选择一行并点击“确认”，`SearchModal`关闭，并将选中行的数据返回给最初的`VarInput`，自动填充“客户ID”字段的值。

## 3. 应用内容区 (ApplicationContent)

### 3.1. 设计理念：多阶段流程控制器
`ApplicationContent` (组件: `AppContent.vue`) 是一个用于构建复杂、分步骤业务流程的核心容器。它并非简单的内容展示区，而是一个**多阶段流程管理器**，旨在将一个完整的业务操作（如“创建订单”、“物料入库”）分解为多个逻辑清晰、有序的**阶段 (Stage)**。

其核心设计思想是：
-   **流程分解**: 将庞大、复杂的表单和操作分解为一系列引导式的步骤，降低用户的认知负荷。
-   **状态隔离与集成**: 每个阶段都可以拥有独立的上下文和UI（通常是一个配置好的`VarBox`），同时组件又提供了统一的导航控制和生命周期钩子，将所有阶段串联成一个整体。
-   **与`VarTree`生态深度集成**: `ApplicationContent`的每个阶段都是为承载`VarTree`实例而设计的。通过在不同阶段的插槽中放入不同的`VarBox`组件，可以轻松构建出向导式的动态表单。

### 3.2. 核心Props与配置

#### 3.2.1 `stages: string[]`
-   **描述**: (必需) 一个字符串数组，用于定义流程的所有阶段名称。数组的顺序决定了流程的步骤顺序。
-   **示例**: `['填写基本信息', '确认物料清单', '完成']`

#### 3.2.2 `footerConfig?: any[]`
-   **描述**: 一个数组，用于为每个阶段自定义底部导航按钮的行为和文本。
-   **作用**: 可以为特定阶段修改“上一步”、“下一步”按钮的文本，或者隐藏它们。
-   **示例**: `[{ nextText: '下一步：确认清单' }, { prevText: '返回修改信息', nextText: '提交订单' }]`

#### 3.2.3 导航钩子: `beforeNext` & `beforePrev`
-   **类型**: `(currentStage: number, targetStage: number) => boolean | Promise<boolean>`
-   **描述**: 在用户点击“下一步”或“上一步”时触发的生命周期钩子。
-   **作用**: 这是实现阶段性校验或数据提交的关键。你可以在这里执行`VarTree`的校验方法，或者向后端发送当前阶段的数据。如果钩子函数返回`false`或一个解析为`false`的Promise，导航将被阻止。
-   **示例**:
    ```javascript
    async function handleBeforeNext(currentStage, targetStage) {
      if (currentStage === 0) {
        // 假设 firstStepTree 是第一阶段的 VarTree 实例
        const isValid = await firstStepTree.validate(); // 执行校验
        if (!isValid) {
          alert('请检查基本信息是否填写正确！');
          return false; // 阻止导航
        }
      }
      return true; // 允许导航
    }
    ```

### 3.3. 应用模式：通过插槽构建流程

`ApplicationContent`通过具名插槽来填充每个阶段的内容。插槽的名称遵循`stage-阶段名`的格式。

**示例：一个两阶段的订单创建流程**
```vue
<template>
  <AppContent
    ref="appContentRef"
    :stages="['填写客户信息', '添加商品']"
    :before-next="onBeforeNext"
  >
    <!-- 阶段一：填写客户信息 -->
    <template #stage-填写客户信息="{ next, prev, goToStage }">
      <h1>第一步：客户信息</h1>
      <VarBox :tree="customerInfoTree" />
    </template>

    <!-- 阶段二：添加商品 -->
    <template #stage-添加商品="{ next, prev, goToStage }">
      <h1>第二步：选择商品</h1>
      <VarBox :tree="productSelectionTree" />
    </template>
  </AppContent>
</template>

<script setup>
import { ref } from 'vue';
import AppContent from '@/components/applicationContent/AppContent.vue';
import VarBox from '@/components/varbox/VarBox.vue';
// 假设 customerInfoTree 和 productSelectionTree 是已创建的 VarTree 实例
const appContentRef = ref(null);

async function onBeforeNext(currentStage) {
  if (currentStage === 0) {
    // 校验第一步的VarTree
    const valid = await customerInfoTree.validate();
    return valid;
  }
  return true;
}
</script>
```

### 3.4. 暴露的接口与方法
可以通过`ref`获取`AppContent`组件实例，并调用其暴露的方法来编程式地控制流程。

-   `goToStage(index: number)`: 跳转到指定索引的阶段。
-   `next()` / `prev()`: 触发“下一步”/“上一步”操作（会执行导航钩子）。
-   `getCurrentStageName(): string`: 获取当前阶段的名称。
-   `isFirstStage(): boolean` / `isLastStage(): boolean`: 判断是否处于首/末阶段。
-   `reset()`: 重置到第一个阶段。
