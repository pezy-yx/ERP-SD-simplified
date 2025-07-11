const express = require('express');
const router = express.Router();

// 模拟员工数据存储
let mockEmployees = [];
let employeeIdCounter = 1;

// 创建员工 - Mock API
router.post('/create', (req, res) => {
  try {
    const { basicInfo, departmentInfo, skillsInfo } = req.body;
    
    console.log('创建员工请求:', req.body);
    
    // 验证必填字段
    if (!basicInfo || !basicInfo.name || !basicInfo.email || !basicInfo.phone) {
      return res.status(400).json({
        success: false,
        message: '基本信息不完整，请检查姓名、邮箱和电话字段'
      });
    }
    
    if (!departmentInfo || !departmentInfo.department || !departmentInfo.position) {
      return res.status(400).json({
        success: false,
        message: '部门职位信息不完整，请检查部门和职位字段'
      });
    }
    
    // 检查邮箱是否已存在
    const existingEmployee = mockEmployees.find(emp => emp.basicInfo.email === basicInfo.email);
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被其他员工使用'
      });
    }
    
    // 生成员工ID
    const employeeId = `EMP${String(employeeIdCounter).padStart(6, '0')}`;
    employeeIdCounter++;
    
    // 创建员工记录
    const newEmployee = {
      id: employeeId,
      basicInfo: {
        ...basicInfo,
        // 处理地址信息
        fullAddress: basicInfo.address ? 
          `${basicInfo.address.province || ''} ${basicInfo.address.city || ''} ${basicInfo.address.district || ''} ${basicInfo.address.street || ''}`.trim() 
          : ''
      },
      departmentInfo: {
        ...departmentInfo,
        // 计算工龄（如果有入职日期）
        workYears: departmentInfo.hireDate ? 
          Math.floor((new Date() - new Date(departmentInfo.hireDate)) / (365.25 * 24 * 60 * 60 * 1000)) 
          : 0
      },
      skillsInfo: {
        ...skillsInfo,
        // 计算技能总数
        totalSkills: skillsInfo?.skills ? skillsInfo.skills.length : 0,
        // 计算工作经历总数
        totalExperience: skillsInfo?.workExperience ? skillsInfo.workExperience.length : 0
      },
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    // 保存到模拟数据库
    mockEmployees.push(newEmployee);
    
    console.log(`员工创建成功: ${employeeId}`);
    
    // 模拟处理延迟
    setTimeout(() => {
      res.json({
        success: true,
        data: {
          employeeId: employeeId,
          message: '员工信息创建成功',
          employee: newEmployee
        }
      });
    }, 1000); // 1秒延迟模拟真实API
    
  } catch (error) {
    console.error('创建员工错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误，请稍后重试',
      error: error.message
    });
  }
});

// 获取员工列表 - Mock API
router.get('/list', (req, res) => {
  try {
    const { page = 1, limit = 10, department, status } = req.query;
    
    let results = [...mockEmployees];
    
    // 根据部门筛选
    if (department) {
      results = results.filter(emp => emp.departmentInfo.department === department);
    }
    
    // 根据状态筛选
    if (status) {
      results = results.filter(emp => emp.status === status);
    }
    
    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedResults = results.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: results.length,
        totalPages: Math.ceil(results.length / limit)
      }
    });
    
  } catch (error) {
    console.error('获取员工列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取员工列表失败',
      error: error.message
    });
  }
});

// 获取员工详情 - Mock API
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = mockEmployees.find(emp => emp.id === id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: '员工不存在'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
    
  } catch (error) {
    console.error('获取员工详情错误:', error);
    res.status(500).json({
      success: false,
      message: '获取员工详情失败',
      error: error.message
    });
  }
});

// 更新员工信息 - Mock API
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { basicInfo, departmentInfo, skillsInfo } = req.body;
    
    const employeeIndex = mockEmployees.findIndex(emp => emp.id === id);
    
    if (employeeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '员工不存在'
      });
    }
    
    // 更新员工信息
    mockEmployees[employeeIndex] = {
      ...mockEmployees[employeeIndex],
      basicInfo: basicInfo || mockEmployees[employeeIndex].basicInfo,
      departmentInfo: departmentInfo || mockEmployees[employeeIndex].departmentInfo,
      skillsInfo: skillsInfo || mockEmployees[employeeIndex].skillsInfo,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: mockEmployees[employeeIndex],
      message: '员工信息更新成功'
    });
    
  } catch (error) {
    console.error('更新员工信息错误:', error);
    res.status(500).json({
      success: false,
      message: '更新员工信息失败',
      error: error.message
    });
  }
});

// 删除员工 - Mock API
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const employeeIndex = mockEmployees.findIndex(emp => emp.id === id);
    
    if (employeeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '员工不存在'
      });
    }
    
    // 软删除：标记为已删除
    mockEmployees[employeeIndex].status = 'deleted';
    mockEmployees[employeeIndex].deletedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: '员工删除成功'
    });
    
  } catch (error) {
    console.error('删除员工错误:', error);
    res.status(500).json({
      success: false,
      message: '删除员工失败',
      error: error.message
    });
  }
});

// 获取统计信息 - Mock API
router.get('/stats/overview', (req, res) => {
  try {
    const activeEmployees = mockEmployees.filter(emp => emp.status === 'active');
    
    // 按部门统计
    const departmentStats = {};
    activeEmployees.forEach(emp => {
      const dept = emp.departmentInfo.department;
      if (!departmentStats[dept]) {
        departmentStats[dept] = 0;
      }
      departmentStats[dept]++;
    });
    
    // 按职位级别统计
    const levelStats = {};
    activeEmployees.forEach(emp => {
      // 从技能信息中获取最高技能级别
      const skills = emp.skillsInfo?.skills || [];
      const maxLevel = skills.reduce((max, skill) => {
        const levels = ['初级', '中级', '高级', '专家'];
        const currentLevelIndex = levels.indexOf(skill.level);
        const maxLevelIndex = levels.indexOf(max);
        return currentLevelIndex > maxLevelIndex ? skill.level : max;
      }, '初级');
      
      if (!levelStats[maxLevel]) {
        levelStats[maxLevel] = 0;
      }
      levelStats[maxLevel]++;
    });
    
    res.json({
      success: true,
      data: {
        totalEmployees: activeEmployees.length,
        departmentStats,
        levelStats,
        averageSalary: activeEmployees.reduce((sum, emp) => sum + (emp.departmentInfo.salary || 0), 0) / activeEmployees.length,
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '获取统计信息失败',
      error: error.message
    });
  }
});

module.exports = router;
