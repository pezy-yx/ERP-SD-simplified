// src/api/bp.js
const express = require('express');
const router = express.Router();

// 模拟的业务伙伴详细数据，与 customerCreateStructure 的结构保持一致
const mockBusinessPartnersDetail = [ // 使用 let 以便可以修改
  {
    bpIdAndRoleSection: { customerId: 'BP0001', bpRole: 'Customer', type: 'person' },
    name: { title: 'Mr.', firstName: 'John', lastName: 'Doe' },
    searchTerms: { searchTerm: 'JD Holdings' },
    address: { country: 'USA', street: '123 Main St', postalCode: '10001', city: 'New York' }
  },
  {
    bpIdAndRoleSection: { customerId: 'BP0002', bpRole: 'Business Partner', type: 'person' },
    name: { title: 'Ms.', firstName: 'Jane', lastName: 'Smith' },
    searchTerms: { searchTerm: 'Smith Co' },
    address: { country: 'CAN', street: '456 Oak Ave', postalCode: 'V6B 1K4', city: 'Vancouver' }
  },
  {
    bpIdAndRoleSection: { customerId: 'BP0003', bpRole: 'FI Customer', type: 'org' },
    name: { title: 'Company', name: 'Global Corp' },
    searchTerms: { searchTerm: 'GC Services' },
    address: { country: 'DEU', street: '789 Pine Ln', postalCode: '10115', city: 'Berlin' }
  },
  {
    bpIdAndRoleSection: { customerId: 'BP0004', bpRole: 'Customer', type: 'group' },
    name: { title: 'Company', name: 'Alice Brown Group' },
    searchTerms: { searchTerm: 'AB Consulting' },
    address: { country: 'FRA', street: '10 Rue de la Paix', postalCode: '75001', city: 'Paris' }
  }
];

// Helper function: Transforms mock data to the format expected by the frontend search results list
const transformBpDataForSearch = (data) => {
  // 修改了这里，确保返回的数据结构包含了 firstName 和 name 字段
  return {
    customerId: data.bpIdAndRoleSection.customerId,
    name: data.name.name, // 组织和团体的名字
    firstName: data.name.firstName, // 个人的名字
    lastName: data.name.lastName,
    city: data.address.city,
    country: data.address.country,
    bpRole: data.bpIdAndRoleSection.bpRole,
    type: data.bpIdAndRoleSection.type
  };
};

// Business Partner Search - Mock API
router.post('/search', (req, res) => {
  try {
    const { customerId } = req.body; // 从请求体获取 customerId

    console.log('Business Partner Search Params:', req.body);

    let results = [...mockBusinessPartnersDetail]; // 从完整的模拟数据开始

    // 根据 customerId 过滤
    if (customerId && customerId.trim()) {
      const searchCustomerId = customerId.toLowerCase();
      results = results.filter(bp =>
        bp.bpIdAndRoleSection.customerId.toLowerCase().includes(searchCustomerId)
      );
    }

    // 格式化结果，只返回列表页所需的核心字段
    const formattedResults = results.map(transformBpDataForSearch);

    res.json({
      success: true,
      data: formattedResults,
      message: 'Business partners found successfully.'
    });

  } catch (error) {
    console.error('Error during business partner search:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search business partners.',
      error: error.message
    });
  }
});

// Business Partner Detail Fetch - Mock API
router.get('/get/:customerId', (req, res) => {
  try {
    const { customerId } = req.params; // 从 URL 参数获取 customerId
    console.log('Fetching Business Partner by ID:', customerId);

    // 在 mockBusinessPartnersDetail 数组中查找匹配的业务伙伴
    const foundBp = mockBusinessPartnersDetail.find(bp =>
      bp.bpIdAndRoleSection.customerId.toLowerCase() === customerId.toLowerCase()
    );

    if (foundBp) {
      // 返回完整的详情数据，因为前端详情页需要
      res.json({
        success: true,
        data: foundBp,
        message: `Business Partner ${customerId} found successfully.`
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Business Partner ${customerId} not found.`
      });
    }
  } catch (error) {
    console.error('Error fetching business partner by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business partner details.',
      error: error.message
    });
  }
});

// Business Partner Creation - Mock API
router.post('/create', (req, res) => {
  try {
    const newBpData = req.body;
    console.log('Creating Business Partner with data:', newBpData);

    // 简单模拟成功创建，返回一个模拟的业务伙伴 ID
    const newCustomerId = `BP${(mockBusinessPartnersDetail.length + 1).toString().padStart(4, '0')}`;
    // 确保新数据包含 customerId 和 type
    const createdBp = {
      ...newBpData,
      bpIdAndRoleSection: {
        ...newBpData.bpIdAndRoleSection,
        customerId: newCustomerId
      }
    };
    mockBusinessPartnersDetail.push(createdBp); // 将新业务伙伴添加到模拟数据中

    res.json({
      success: true,
      data: { customerId: newCustomerId },
      message: `Business Partner ${newCustomerId} created successfully.`
    });
  } catch (error) {
    console.error('Error creating business partner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create business partner.',
      error: error.message
    });
  }
});

// Business Partner Edit - Mock API
router.post('/edit', (req, res) => {
  try {
    const updatedBpData = req.body;
    // 获取要更新的业务伙伴 ID
    const bpIdToUpdate = updatedBpData?.bpIdAndRoleSection?.customerId;
    console.log('Editing Business Partner with ID:', bpIdToUpdate, 'Data:', updatedBpData);

    const index = mockBusinessPartnersDetail.findIndex(bp =>
      String(bp.bpIdAndRoleSection.customerId).toLowerCase() === String(bpIdToUpdate).toLowerCase()
    );

    if (index !== -1) {
      // 更新现有业务伙伴
      mockBusinessPartnersDetail[index] = {
        ...mockBusinessPartnersDetail[index], // 保留现有数据
        ...updatedBpData // 用新数据覆盖
      };

      res.json({
        success: true,
        data: { customerId: bpIdToUpdate },
        message: `Business Partner ${bpIdToUpdate} updated successfully.`
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Business Partner ${bpIdToUpdate} not found for update.`
      });
    }
  } catch (error) {
    console.error('Error editing business partner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to edit business partner.',
      error: error.message
    });
  }
});

module.exports = router; // 导出 router 实例