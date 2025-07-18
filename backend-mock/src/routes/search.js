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

// 部门搜索 - Mock API
router.post('/mock/department', (req, res) => {
  try {
    const { deptName, deptType } = req.body;

    console.log('部门搜索参数:', req.body);

    const mockDepartments = [
      { id: 'DEPT001', name: '技术部', type: '技术部', description: '负责产品研发和技术创新', headCount: 45 },
      { id: 'DEPT002', name: '产品部', type: '产品部', description: '负责产品规划和设计', headCount: 20 },
      { id: 'DEPT003', name: '市场部', type: '市场部', description: '负责市场推广和品牌建设', headCount: 15 },
      { id: 'DEPT004', name: '人事部', type: '人事部', description: '负责人力资源管理', headCount: 8 },
      { id: 'DEPT005', name: '财务部', type: '财务部', description: '负责财务管理和会计核算', headCount: 12 },
      { id: 'DEPT006', name: '运营部', type: '运营部', description: '负责日常运营和客户服务', headCount: 25 },
    ];

    let results = [...mockDepartments];

    // 根据部门名称筛选
    if (deptName && deptName.trim()) {
      results = results.filter(dept =>
        dept.name.includes(deptName)
      );
    }

    // 根据部门类型筛选
    if (deptType && deptType.trim()) {
      results = results.filter(dept => dept.type === deptType);
    }

    // 转换为前端期望的格式
    const formattedResults = results.map(dept => ({
      id: dept.id,
      result: dept.name,
      description: `${dept.description} | 人数: ${dept.headCount}`,
      deptType: dept.type,
      headCount: dept.headCount
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: formattedResults.length,
      message: `找到 ${formattedResults.length} 个部门`
    });

  } catch (error) {
    console.error('部门搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 职位搜索 - Mock API
router.post('/mock/position', (req, res) => {
  try {
    const { positionName, level, minSalary, maxSalary } = req.body;

    console.log('职位搜索参数:', req.body);

    const mockPositions = [
      { id: 'POS001', name: '前端工程师', level: '中级', salary: 15000, department: '技术部', requirements: 'Vue.js, React' },
      { id: 'POS002', name: '后端工程师', level: '高级', salary: 20000, department: '技术部', requirements: 'Java, Spring Boot' },
      { id: 'POS003', name: '产品经理', level: '高级', salary: 18000, department: '产品部', requirements: '产品规划, 需求分析' },
      { id: 'POS004', name: 'UI设计师', level: '中级', salary: 12000, department: '产品部', requirements: 'Figma, Sketch' },
      { id: 'POS005', name: '市场专员', level: '初级', salary: 8000, department: '市场部', requirements: '市场推广, 文案策划' },
      { id: 'POS006', name: '人事专员', level: '中级', salary: 10000, department: '人事部', requirements: '招聘, 员工关系' },
      { id: 'POS007', name: '财务分析师', level: '高级', salary: 16000, department: '财务部', requirements: '财务分析, Excel' },
      { id: 'POS008', name: '运营专员', level: '初级', salary: 9000, department: '运营部', requirements: '数据分析, 用户运营' },
    ];

    let results = [...mockPositions];

    // 根据职位名称筛选
    if (positionName && positionName.trim()) {
      results = results.filter(pos =>
        pos.name.includes(positionName)
      );
    }

    // 根据职位级别筛选
    if (level && level.trim()) {
      results = results.filter(pos => pos.level === level);
    }

    // 根据薪资范围筛选
    if (minSalary !== null && minSalary !== undefined && minSalary !== '') {
      results = results.filter(pos => pos.salary >= Number(minSalary));
    }

    if (maxSalary !== null && maxSalary !== undefined && maxSalary !== '') {
      results = results.filter(pos => pos.salary <= Number(maxSalary));
    }

    // 转换为前端期望的格式
    const formattedResults = results.map(pos => ({
      id: pos.id,
      result: pos.name,
      description: `${pos.level} | ${pos.department} | ¥${pos.salary} | ${pos.requirements}`,
      level: pos.level,
      department: pos.department,
      suggestedSalary: pos.salary,
      requirements: pos.requirements
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: formattedResults.length,
      message: `找到 ${formattedResults.length} 个职位`
    });

  } catch (error) {
    console.error('职位搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 员工搜索 - Mock API
router.post('/mock/employee', (req, res) => {
  try {
    const { employeeName, employeeId, department } = req.body;

    console.log('员工搜索参数:', req.body);

    const mockEmployees = [
      { id: 'EMP001', name: '张三', position: '技术总监', department: '技术部', level: '管理' },
      { id: 'EMP002', name: '李四', position: '产品总监', department: '产品部', level: '管理' },
      { id: 'EMP003', name: '王五', position: '市场总监', department: '市场部', level: '管理' },
      { id: 'EMP004', name: '赵六', position: '人事经理', department: '人事部', level: '管理' },
      { id: 'EMP005', name: '钱七', position: '财务经理', department: '财务部', level: '管理' },
      { id: 'EMP006', name: '孙八', position: '运营经理', department: '运营部', level: '管理' },
      { id: 'EMP007', name: '周九', position: '高级前端工程师', department: '技术部', level: '高级' },
      { id: 'EMP008', name: '吴十', position: '高级后端工程师', department: '技术部', level: '高级' },
    ];

    let results = [...mockEmployees];

    // 根据员工姓名筛选
    if (employeeName && employeeName.trim()) {
      results = results.filter(emp =>
        emp.name.includes(employeeName)
      );
    }

    // 根据员工ID筛选
    if (employeeId && employeeId.trim()) {
      results = results.filter(emp =>
        emp.id.toLowerCase().includes(employeeId.toLowerCase())
      );
    }

    // 根据部门筛选
    if (department && department.trim()) {
      results = results.filter(emp => emp.department === department);
    }

    // 转换为前端期望的格式
    const formattedResults = results.map(emp => ({
      id: emp.id,
      result: emp.name,
      description: `${emp.position} | ${emp.department} | ${emp.level}`,
      position: emp.position,
      department: emp.department,
      level: emp.level
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: formattedResults.length,
      message: `找到 ${formattedResults.length} 个员工`
    });

  } catch (error) {
    console.error('员工搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 技能搜索 - Mock API
router.post('/mock/skill', (req, res) => {
  try {
    const { skillName, category, level } = req.body;

    console.log('技能搜索参数:', req.body);

    const mockSkills = [
      { id: 'SKILL001', name: 'JavaScript', category: '编程语言', suggestedLevel: '中级', description: '前端开发必备语言' },
      { id: 'SKILL002', name: 'Vue.js', category: '框架技术', suggestedLevel: '中级', description: '流行的前端框架' },
      { id: 'SKILL003', name: 'React', category: '框架技术', suggestedLevel: '中级', description: 'Facebook开发的前端框架' },
      { id: 'SKILL004', name: 'Java', category: '编程语言', suggestedLevel: '高级', description: '企业级开发语言' },
      { id: 'SKILL005', name: 'Spring Boot', category: '框架技术', suggestedLevel: '高级', description: 'Java微服务框架' },
      { id: 'SKILL006', name: 'MySQL', category: '数据库', suggestedLevel: '中级', description: '关系型数据库' },
      { id: 'SKILL007', name: 'Redis', category: '数据库', suggestedLevel: '中级', description: '内存数据库' },
      { id: 'SKILL008', name: 'Docker', category: '工具软件', suggestedLevel: '中级', description: '容器化技术' },
      { id: 'SKILL009', name: '项目管理', category: '软技能', suggestedLevel: '高级', description: '团队协作和项目推进' },
      { id: 'SKILL010', name: 'PMP认证', category: '认证证书', suggestedLevel: '专家', description: '项目管理专业认证' },
    ];

    let results = [...mockSkills];

    // 根据技能名称筛选
    if (skillName && skillName.trim()) {
      results = results.filter(skill =>
        skill.name.toLowerCase().includes(skillName.toLowerCase())
      );
    }

    // 根据技能分类筛选
    if (category && category.trim()) {
      results = results.filter(skill => skill.category === category);
    }

    // 根据要求级别筛选
    if (level && level.trim()) {
      results = results.filter(skill => skill.suggestedLevel === level);
    }

    // 转换为前端期望的格式
    const formattedResults = results.map(skill => ({
      id: skill.id,
      result: skill.name,
      description: `${skill.category} | 建议级别: ${skill.suggestedLevel} | ${skill.description}`,
      category: skill.category,
      suggestedLevel: skill.suggestedLevel
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: formattedResults.length,
      message: `找到 ${formattedResults.length} 个技能`
    });

  } catch (error) {
    console.error('技能搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 公司搜索 - Mock API
router.post('/mock/company', (req, res) => {
  try {
    const { companyName, industry, scale } = req.body;

    console.log('公司搜索参数:', req.body);

    const mockCompanies = [
      { id: 'COMP001', name: '腾讯科技', industry: '互联网', scale: '跨国公司', description: '中国领先的互联网公司' },
      { id: 'COMP002', name: '阿里巴巴', industry: '互联网', scale: '跨国公司', description: '电商和云计算巨头' },
      { id: 'COMP003', name: '华为技术', industry: '互联网', scale: '跨国公司', description: '全球领先的通信设备供应商' },
      { id: 'COMP004', name: '招商银行', industry: '金融', scale: '大型企业', description: '中国领先的商业银行' },
      { id: 'COMP005', name: '中国平安', industry: '金融', scale: '大型企业', description: '综合金融服务集团' },
      { id: 'COMP006', name: '比亚迪', industry: '制造业', scale: '大型企业', description: '新能源汽车制造商' },
      { id: 'COMP007', name: '富士康', industry: '制造业', scale: '跨国公司', description: '全球最大的电子制造服务商' },
      { id: 'COMP008', name: '新东方', industry: '教育', scale: '大型企业', description: '知名教育培训机构' },
      { id: 'COMP009', name: '好未来', industry: '教育', scale: '大型企业', description: '在线教育平台' },
      { id: 'COMP010', name: '字节跳动', industry: '互联网', scale: '大型企业', description: '抖音、今日头条母公司' },
    ];

    let results = [...mockCompanies];

    // 根据公司名称筛选
    if (companyName && companyName.trim()) {
      results = results.filter(company =>
        company.name.includes(companyName)
      );
    }

    // 根据行业筛选
    if (industry && industry.trim()) {
      results = results.filter(company => company.industry === industry);
    }

    // 根据公司规模筛选
    if (scale && scale.trim()) {
      results = results.filter(company => company.scale === scale);
    }

    // 转换为前端期望的格式
    const formattedResults = results.map(company => ({
      id: company.id,
      result: company.name,
      description: `${company.industry} | ${company.scale} | ${company.description}`,
      industry: company.industry,
      scale: company.scale
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: formattedResults.length,
      message: `找到 ${formattedResults.length} 个公司`
    });

  } catch (error) {
    console.error('公司搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 交货单搜索 - Mock API
router.post('/delivery-id', (req, res) => {
  try {
    console.log('交货单搜索参数:', req.body);

    const mockDeliveries = [
      {
        id: 'DEL-2024-001',
        result: 'DEL-2024-001',
        description: '出库交货单 - 客户CUST-12345'
      },
      {
        id: 'DEL-2024-002',
        result: 'DEL-2024-002',
        description: '出库交货单 - 客户CUST-67890'
      },
      {
        id: 'DEL-2024-003',
        result: 'DEL-2024-003',
        description: '出库交货单 - 客户CUST-11111'
      }
    ];

    res.json({
      success: true,
      data: mockDeliveries,
      total: mockDeliveries.length,
      message: `找到 ${mockDeliveries.length} 个交货单`
    });

  } catch (error) {
    console.error('交货单搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 客户搜索 - Mock API
router.post('/customer', (req, res) => {
  try {
    console.log('客户搜索参数:', req.body);

    const mockCustomers = [
      {
        id: 'CUST-12345',
        result: 'CUST-12345',
        description: '北京科技有限公司'
      },
      {
        id: 'CUST-67890',
        result: 'CUST-67890',
        description: '上海贸易公司'
      },
      {
        id: 'CUST-11111',
        result: 'CUST-11111',
        description: '深圳制造企业'
      }
    ];

    res.json({
      success: true,
      data: mockCustomers,
      total: mockCustomers.length,
      message: `找到 ${mockCustomers.length} 个客户`
    });

  } catch (error) {
    console.error('客户搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 物料搜索 - Mock API
router.post('/material', (req, res) => {
  try {
    console.log('物料搜索参数:', req.body);

    const mockMaterials = [
      {
        id: 'MAT-001',
        result: 'MAT-001',
        description: '笔记本电脑 - ThinkPad X1'
      },
      {
        id: 'MAT-002',
        result: 'MAT-002',
        description: '无线鼠标 - 罗技MX Master'
      },
      {
        id: 'MAT-003',
        result: 'MAT-003',
        description: '机械键盘 - Cherry MX'
      }
    ];

    res.json({
      success: true,
      data: mockMaterials,
      total: mockMaterials.length,
      message: `找到 ${mockMaterials.length} 个物料`
    });

  } catch (error) {
    console.error('物料搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 工厂搜索 - Mock API
router.post('/plant', (req, res) => {
  try {
    console.log('工厂搜索参数:', req.body);

    const mockPlants = [
      {
        id: '1000',
        result: '1000',
        description: '北京工厂'
      },
      {
        id: '2000',
        result: '2000',
        description: '上海工厂'
      },
      {
        id: '3000',
        result: '3000',
        description: '深圳工厂'
      }
    ];

    res.json({
      success: true,
      data: mockPlants,
      total: mockPlants.length,
      message: `找到 ${mockPlants.length} 个工厂`
    });

  } catch (error) {
    console.error('工厂搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

// 存储位置搜索 - Mock API
router.post('/storage-location', (req, res) => {
  try {
    console.log('存储位置搜索参数:', req.body);

    const mockStorageLocations = [
      {
        id: '0001',
        result: '0001',
        description: '主仓库A区'
      },
      {
        id: '0002',
        result: '0002',
        description: '主仓库B区'
      },
      {
        id: '0003',
        result: '0003',
        description: '备用仓库'
      }
    ];

    res.json({
      success: true,
      data: mockStorageLocations,
      total: mockStorageLocations.length,
      message: `找到 ${mockStorageLocations.length} 个存储位置`
    });

  } catch (error) {
    console.error('存储位置搜索错误:', error);
    res.status(500).json({
      success: false,
      message: '搜索失败，请稍后重试',
      error: error.message
    });
  }
});

module.exports = router;
