const express = require('express');
const router = express.Router();

// 模拟业务伙伴数据
const mockBusinessPartners = [
  {
    id: 'BP001',
    companyName: '华为技术有限公司',
    bpType: '客户',
    contactPerson: '张经理',
    phone: '13800138001',
    email: 'zhang@huawei.com',
    address: '深圳市南山区华为总部',
    createDate: '2024-01-15',
    status: '活跃'
  },
  {
    id: 'BP002', 
    companyName: '腾讯科技有限公司',
    bpType: '客户',
    contactPerson: '李总监',
    phone: '13800138002',
    email: 'li@tencent.com',
    address: '深圳市南山区腾讯大厦',
    createDate: '2024-02-20',
    status: '活跃'
  },
  {
    id: 'BP003',
    companyName: '富士康科技集团',
    bpType: '供应商',
    contactPerson: '王主管',
    phone: '13800138003', 
    email: 'wang@foxconn.com',
    address: '深圳市宝安区富士康园区',
    createDate: '2024-01-10',
    status: '活跃'
  },
  {
    id: 'BP004',
    companyName: '比亚迪股份有限公司',
    bpType: '合作伙伴',
    contactPerson: '赵副总',
    phone: '13800138004',
    email: 'zhao@byd.com', 
    address: '深圳市坪山区比亚迪路',
    createDate: '2024-03-05',
    status: '活跃'
  },
  {
    id: 'BP005',
    companyName: '中兴通讯股份有限公司',
    bpType: '客户',
    contactPerson: '刘经理',
    phone: '13800138005',
    email: 'liu@zte.com',
    address: '深圳市南山区中兴通讯大厦',
    createDate: '2024-02-28',
    status: '暂停'
  }
];

// 模拟产品数据
const mockProducts = [
  {
    id: 'PRD001',
    productCode: 'PHONE-001',
    productName: '智能手机Pro Max',
    category: '电子产品',
    price: 6999,
    stock: 150,
    supplier: '华为技术有限公司',
    createDate: '2024-01-20',
    status: '在售'
  },
  {
    id: 'PRD002',
    productCode: 'LAPTOP-001', 
    productName: '商务笔记本电脑',
    category: '电子产品',
    price: 8999,
    stock: 80,
    supplier: '联想集团',
    createDate: '2024-02-15',
    status: '在售'
  },
  {
    id: 'PRD003',
    productCode: 'TABLET-001',
    productName: '平板电脑Air',
    category: '电子产品', 
    price: 3999,
    stock: 200,
    supplier: '苹果公司',
    createDate: '2024-01-25',
    status: '在售'
  },
  {
    id: 'PRD004',
    productCode: 'WATCH-001',
    productName: '智能手表运动版',
    category: '可穿戴设备',
    price: 2499,
    stock: 300,
    supplier: '小米科技',
    createDate: '2024-03-01',
    status: '在售'
  },
  {
    id: 'PRD005',
    productCode: 'HEADPHONE-001',
    productName: '无线降噪耳机',
    category: '音频设备',
    price: 1999,
    stock: 120,
    supplier: 'BOSE公司',
    createDate: '2024-02-10',
    status: '缺货'
  }
];

// 业务伙伴搜索 - Mock API
router.post('/mock/business-partner', (req, res) => {
  try {
    const { bpId, companyName, bpType } = req.body;
    
    console.log('业务伙伴搜索参数:', req.body);
    
    let results = [...mockBusinessPartners];
    
    // 根据业务伙伴ID筛选
    if (bpId && bpId.trim()) {
      results = results.filter(bp => 
        bp.id.toLowerCase().includes(bpId.toLowerCase())
      );
    }
    
    // 根据公司名称筛选
    if (companyName && companyName.trim()) {
      results = results.filter(bp => 
        bp.companyName.includes(companyName)
      );
    }
    
    // 根据业务伙伴类型筛选
    if (bpType && bpType.trim()) {
      results = results.filter(bp => bp.bpType === bpType);
    }
    
    // 转换为前端期望的格式
    const formattedResults = results.map(bp => ({
      id: bp.id,
      result: bp.companyName,
      description: `类型: ${bp.bpType} | 联系人: ${bp.contactPerson} | 状态: ${bp.status}`,
      bpType: bp.bpType,
      contactPerson: bp.contactPerson,
      phone: bp.phone,
      email: bp.email,
      address: bp.address,
      createDate: bp.createDate,
      status: bp.status
    }));
    
    res.json({
      success: true,
      data: formattedResults,
      total: formattedResults.length,
      message: `找到 ${formattedResults.length} 个业务伙伴`
    });
    
  } catch (error) {
    console.error('业务伙伴搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 产品搜索 - Mock API
router.post('/mock/product', (req, res) => {
  try {
    const { productCode, productName, minPrice, maxPrice } = req.body;
    
    console.log('产品搜索参数:', req.body);
    
    let results = [...mockProducts];
    
    // 根据产品编码筛选
    if (productCode && productCode.trim()) {
      results = results.filter(product => 
        product.productCode.toLowerCase().includes(productCode.toLowerCase())
      );
    }
    
    // 根据产品名称筛选
    if (productName && productName.trim()) {
      results = results.filter(product => 
        product.productName.includes(productName)
      );
    }
    
    // 根据价格范围筛选
    if (minPrice !== null && minPrice !== undefined && minPrice !== '') {
      results = results.filter(product => product.price >= Number(minPrice));
    }
    
    if (maxPrice !== null && maxPrice !== undefined && maxPrice !== '') {
      results = results.filter(product => product.price <= Number(maxPrice));
    }
    
    // 转换为前端期望的格式
    const formattedResults = results.map(product => ({
      id: product.id,
      result: product.productName,
      description: `编码: ${product.productCode} | 价格: ¥${product.price} | 库存: ${product.stock} | 状态: ${product.status}`,
      productCode: product.productCode,
      category: product.category,
      price: product.price,
      stock: product.stock,
      supplier: product.supplier,
      createDate: product.createDate,
      status: product.status
    }));
    
    res.json({
      success: true,
      data: formattedResults,
      total: formattedResults.length,
      message: `找到 ${formattedResults.length} 个产品`
    });
    
  } catch (error) {
    console.error('产品搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 简单搜索 - Mock API (保持兼容原有测试)
router.post('/mock/simple', (req, res) => {
  try {
    const { query } = req.body;
    
    console.log('简单搜索参数:', req.body);
    
    // 合并所有数据进行简单搜索
    const allData = [
      ...mockBusinessPartners.map(bp => ({
        id: bp.id,
        result: bp.companyName,
        description: `业务伙伴 - ${bp.bpType}`,
        type: 'business-partner'
      })),
      ...mockProducts.map(product => ({
        id: product.id,
        result: product.productName,
        description: `产品 - ¥${product.price}`,
        type: 'product'
      }))
    ];
    
    let results = allData;
    
    if (query && query.trim()) {
      results = allData.filter(item => 
        item.result.includes(query) || item.description.includes(query)
      );
    }
    
    res.json({
      success: true,
      data: results,
      total: results.length,
      message: `找到 ${results.length} 个结果`
    });
    
  } catch (error) {
    console.error('简单搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 高级搜索 - Mock API (保持兼容原有测试)
router.post('/mock/advanced', (req, res) => {
  try {
    const { keyword, category, startDate, endDate, strict } = req.body;
    
    console.log('高级搜索参数:', req.body);
    
    // 这里可以实现更复杂的搜索逻辑
    const results = [
      {
        id: 'ADV001',
        result: '高级搜索结果示例',
        description: `关键词: ${keyword || '无'} | 分类: ${category || '无'} | 严格匹配: ${strict ? '是' : '否'}`,
        keyword,
        category,
        startDate,
        endDate,
        strict
      }
    ];
    
    res.json({
      success: true,
      data: results,
      total: results.length,
      message: '高级搜索完成'
    });
    
  } catch (error) {
    console.error('高级搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

module.exports = router;
