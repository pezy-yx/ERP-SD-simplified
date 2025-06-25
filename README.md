# ERP-SD-simplified

## 前端运行指南
确保你已安装 Node.js 和 npm
```bash
cd site
npm install --force      # 安装依赖，必须使用force参数
npm run serve    # 启动开发服务器
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