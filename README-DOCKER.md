# ERP-SD-simplified Docker部署文件

这个分支包含为Docker部署准备的编译文件。

## 目录结构

```
deploy分支/
├── frontend/          # 前端编译文件
│   ├── index.html     # 前端入口
│   ├── css/           # 样式文件
│   ├── js/            # JavaScript文件
│   └── img/           # 图片资源
├── backend/           # 后端源码
│   ├── src/           # 后端源码
│   ├── package.json   # 后端依赖
│   └── ...
└── build-for-docker.sh # 构建脚本
```

## 使用方法

### 构建新版本
```bash
# 切换到deploy分支
git checkout deploy

# 运行构建脚本
./build-for-docker.sh
```

### 更新版本
```bash
# 从源分支更新
./update-from-source.sh [源分支名]
```

## Docker部署

前端文件位于 `frontend/` 目录，可以直接用于静态文件服务。
后端文件位于 `backend/` 目录，需要在Docker容器中运行 `npm install` 和 `npm start`。

## 注意事项

1. 前端文件已经编译完成，可以直接部署
2. 后端需要在Docker容器中安装依赖
3. 确保Docker容器中的Node.js版本兼容
4. 后端默认端口为3000，前端需要配置正确的API地址
