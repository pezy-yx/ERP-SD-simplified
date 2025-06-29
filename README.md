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

```vue
<var-input
  :varTree="dynamicListTree"
  :nodePath="[]"
  :config="{ maxLength: 5 }"
  @update="handleListUpdate"
/>
```

#### 1.3.5 特性说明

**路径字符串生成：**
`getPathString()`函数处理特殊字符转义，确保插槽名称在同一棵树内部的唯一性：
```typescript
// 路径 ['user', 'profile', 'name']
// 生成插槽名称：'user-profile-name--extra'
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

### 1.4. 在复杂ERP系统前端中可能可以解决的问题

- **任意深度嵌套数据的统一渲染**：一套组件解决所有层级的数据展示需求
- **高度可定制的用户界面**：通过插槽系统实现业务特定的UI需求
- **配置驱动的表单生成**：通过NodeStructure配置快速构建复杂表单
- **数据录入表单**：根据业务规则动态生成的录入界面
- **递归组件设计**：避免了硬编码的层级限制
- **标准化接口**：确保了组件间的一致性和可维护性
