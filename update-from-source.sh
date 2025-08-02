#!/bin/bash

# 从源分支更新deploy分支的脚本

SOURCE_BRANCH=${1:-"test/fake-main"}

echo "🔄 从 $SOURCE_BRANCH 更新deploy分支..."

# 检查当前分支
current_branch=$(git branch --show-current)
if [ "$current_branch" != "deploy" ]; then
    echo "❌ 错误：请在deploy分支上运行此脚本"
    exit 1
fi

# 保存当前工作状态
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "💾 保存当前工作状态..."
    git stash push -m "Auto stash before update $(date)"
    STASHED=true
else
    STASHED=false
fi

# 获取源分支最新代码
echo "📥 获取源分支最新代码..."
git fetch origin $SOURCE_BRANCH

# 合并源分支更改（只合并源码，不包括构建文件）
echo "🔀 合并源分支更改..."
git merge origin/$SOURCE_BRANCH --no-edit || {
    echo "❌ 合并冲突！请手动解决冲突后重新运行"
    exit 1
}

# 重新构建
echo "🔨 重新构建..."
./build-for-docker.sh

# 提交更新
echo "💾 提交更新..."
git add frontend/ backend/ README-DOCKER.md
git commit -m "deploy: 从 $SOURCE_BRANCH 更新 ($(date '+%Y-%m-%d %H:%M:%S'))" || echo "ℹ️  没有新的更改需要提交"

# 恢复工作状态
if [ "$STASHED" = true ]; then
    echo "🔄 恢复工作状态..."
    git stash pop || echo "⚠️  无法自动恢复工作状态"
fi

echo "✅ 更新完成！"
echo "📁 前端文件: frontend/"
echo "📁 后端文件: backend/"
