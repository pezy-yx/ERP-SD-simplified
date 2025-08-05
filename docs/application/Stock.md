# Display Stock 出库交货单管理系统接口文档

## 概述

本系统包含一个应用，Display Stock用于查看材料的库存

## 接口列表

### 1. 获取库存的阶段名称 - `/api/stock/getStockStages`

**请求方法**: POST

**功能**: 从后端获取库存的各个阶段名称

**请求参数**:
```json
{}
```

**响应格式**:
```json
{
  "success": true,
  "data": ["stage name 0","stage name 1","stage name 2"],
  "message": "success"
}
```

### 2. 获取库存的显示级别 - `/api/stock/getStockStages`

**请求方法**: POST

**功能**: 从后端获取展示库存的各个级别

**请求参数**:
```json
{}
```

**响应格式**:
```json
{
  "success": true,
  "data": ["Client","Company Code","Plant"],
  "message": "success"
}
```


### 3. 获取材料基础信息 - `/api/stock/materialInfo`

**请求方法**: POST

**功能**: 获取指定材料的基础信息

**请求参数**:
```json
{
  "id": "DXTR1033"
}
```

**响应格式**:
```json
{
  "success": true,
  "data": {
    "name": "Deluxe Touring Bike (black)",
    "materialType": "FERT",
    "unit": "EA"
  },
  "message": "success"
}
```

### 4. 获取给定材料的库存信息 - `/api/stock/searchStock`

**请求方法**: POST

**功能**: 获取库存信息，返回分层、分阶段的库存量
**注意**: stage的个数和getStockStages返回的长度相同，但是本服务的响应中stage的命名采用`stage${k}`而不是getStockStages中的显示名称。

**请求参数**:
```json
{
  "id": "DXTR1033"
}
```

**响应格式**:
```json
{
  "success": true,
  "data": {
    "content":[
      {"data": {"level": "Full",      "stage0": "130", "stage1": "230", "stage2": "0"}, "depth": 0},
        {"data": {"level": "CN00",    "stage0": "50",  "stage1": "100", "stage2": "0"}, "depth": 1},
          {"data": {"level": "PLT0",  "stage0": "35",  "stage1": "70",  "stage2": "0"}, "depth": 2},
          {"data": {"level": "PLT1",  "stage0": "15",  "stage1": "30",  "stage2": "0"}, "depth": 2},
        {"data": {"level": "CN01",    "stage0": "10",  "stage1": "20",  "stage2": "0"}, "depth": 1},
          {"data": {"level": "PLT0",  "stage0": "5",   "stage1": "10",  "stage2": "0"}, "depth": 2},
          {"data": {"level": "PLT1",  "stage0": "1",   "stage1": "2",   "stage2": "0"}, "depth": 2},
          {"data": {"level": "PLT2",  "stage0": "4",   "stage1": "8",   "stage2": "0"}, "depth": 2},
        {"data": {"level": "CN02",    "stage0": "20",  "stage1": "40",  "stage2": "0"}, "depth": 1},
          {"data": {"level": "PLT0",  "stage0": "20",  "stage1": "40",  "stage2": "0"}, "depth": 2},
        {"data": {"level": "US00",    "stage0": "20",  "stage1": "40",  "stage2": "0"}, "depth": 1},
          {"data": {"level": "PLT0",  "stage0": "20",  "stage1": "40",  "stage2": "0"}, "depth": 2},
        {"data": {"level": "US01",    "stage0": "30",  "stage1": "30",  "stage2": "0"}, "depth": 1},
          {"data": {"level": "PLT0",  "stage0": "30",  "stage1": "30",  "stage2": "0"}, "depth": 2},
    ]
  },
  "message": "success"
}
```