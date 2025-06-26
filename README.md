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

## VarTree 类说明

VarTree 负责描述变量树结构。核心类型如下：

- `VarNode`：变量节点，包含类型/节点类型、名称/显示名称、默认值、只读状态、子节点、其他参数等属性。
- `NodeStructure`：节点结构定义，支持嵌套。
- 支持类型：`string`、`date`、`selection`、`dict`、`dynamiclist`、`fixlist`、`number`。

示例结构：

```typescript
const exampleTree: NodeStructure = {
  varType: 'dict', // 类型
  nodeType: 'dict', // 节点类型，缺省根据类型自动判断
  name: 'root', // 变量名称，缺省根据规则生成
  nameDisplay: '根节点变量', // 显示的名称，缺省使用name值
  children: [ // 子节点
    {
      varType: 'string',
      name: 'username',
      defaultValue: '', // 默认值，可以缺省
    },
    {
      varType: 'number',
      name: 'age',
      defaultValue: 18,
    },
    {
      varType: 'date',
      name: 'birthday',
      defaultValue: null,
      config: { minDate: '2020-01-01', maxDate: '2030-12-31' } // 其他属性
    }
  ]
}
```

## VarInput 组件说明

VarInput 用于渲染和编辑 VarTree 结构的变量节点，支持递归渲染字典、列表、叶子节点。支持自定义组件钩子（`config.customComponent`）。

主要 props：

- `varTree`：VarTree 实例或 NodeStructure。
- `nodePath`：当前节点路径（数组）。
- `readonly`：是否只读。
- `config`：节点配置（选项、日期范围等，以及校验函数、组件钩子）。

典型用例：

```vue
<var-input
  :varTree="simpleStringTree"
  :nodePath="[]"
  @update="handleUpdate('simpleString', $event)"
/>
<var-input
  :varTree="simpleNumberTree"
  :nodePath="[]"
  @update="handleUpdate('simpleNumber', $event)"
/>
<var-input
  :varTree="simpleDateTree"
  :nodePath="[]"
  :config="{ minDate: '2024-01-01', maxDate: '2025-12-31' }"
  @update="handleUpdate('simpleDate', $event)"
/>
```

### 详细用法
#### 使用 createNodeStructure 快速构建NodeStructure

推荐使用 [`createNodeStructure()`简称`cns()`](site/src/utils/VarTree.ts) 快速生成变量树结构。

```typescript
import { cns } from '@/utils/VarTree'

const exampleNode: NodeStructure =
cns('string','leaf','exampleString','Hello, World!',false,{},[
    cns('number', 'leaf', 'exampleNumber', 42, false),
    cns('dict', 'dict', 'exampleDict', null, false, {}, [
      cns('string', 'leaf', 'nestedString', 'Nested Value', false),
      cns('date', 'leaf', 'nestedDate', '2023-10-01T00:00:00Z', false, {
        minDate: '2023-01-01T00:00:00Z',
        maxDate: '2024-01-01T00:00:00Z'
      })
    ])
  ]
)
```

#### 使用createTreeFromConfig快速从NodeStructure构建变量树

`createTreeFromConfig(struct: NodeStructure): VarTree` 可将变量结构描述直接转为可用的 VarTree 实例。

**用法示例：**

```typescript
import { createTreeFromConfig } from '@/utils/VarTree'

const simpleNodeStructure = {
  varType: 'string',
  nodeType: 'leaf',
  name: 'exampleString',
  defaultValue: 'Hello, World!',
  readonly: false,
  config: {},
  children: []
}

const tree = createTreeFromConfig(simpleNodeStructure)
// tree 即为可用的 VarTree 实例
```

支持复杂嵌套结构，推荐配合 [`createNodeStructure()`](site/src/utils/VarTree.ts) 

#### 使用外部钩子展示变量（叶子或子树）

VarInput 支持通过 `config.customComponent` 外部钩子渲染变量节点（叶子或子树）。自定义组件需实现 `@update` 事件。

示例：

```vue
<var-input
  :varTree="tree"
  :nodePath="[]"
  :config="{ customComponent: MyCustomInput }"
/>
```

#### 传入一个变量校验器

可通过 `config.validators` 传入校验函数数组，对变量输入进行严格校验。每个校验器需返回布尔值。

示例：

```typescript
const notEmpty = (v) => typeof v === 'string' && v.length > 0
const node: NodeStructure = {
  varType: 'string',
  name: 'username',
  config: { validators: [notEmpty] }
}
```
