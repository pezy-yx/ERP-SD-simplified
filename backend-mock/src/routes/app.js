const express = require('express');
const router = express.Router();

// bp-relation/register
router.post('/bp-relationship/register', (req, res) => {
  // 直接返回成功
  console.log('创建BP关系:', req.body);
  const relationCategoty = req.body.relation.relationShipCategory
  let formStruct = {
  }
  if(relationCategoty === 'test') {
    formStruct = {
      nodeType: 'dict',
      varType: 'dict',
      name: 'generalData',
      nameDisplay: 'General Data',
      children:[
        {
          nodeType: 'leaf',
          varType: 'string',
          name: 'testField',
          nameDisplay: 'Test Field: ',
        }
      ]
    }
  }
  res.json({
    success: true,
    message: '创建BP关系成功',
    data: {
      formStruct
    }
  })
})

// bp-relation/create
router.post('/bp-relationship/create', (req, res) => {
  // 直接返回成功
  console.log('创建BP关系:', req.body);
  const relationId = "33"
  res.json({
    success: true,
    message: '创建BP关系成功',
    data: {
      message: `BP realtion ${relationId} has been created successfully`
    }
  })
})

// inquiry/initialize
router.post('/inquiry/initialize', (req, res) => {
  // 直接返回成功
  console.log('初始化询价单:', req.body);
  
  // // 模拟询价数据常量
  // const mockInquiryData = {
  //   basicInfo: {
  //     inquiry: 'INQ-2024-001',
  //     soldToParty: 'CUST-12345',
  //     shipToParty: 'SHIP-67890',
  //     customerReference: 'REF-ABC123',
  //     netValue: 15800.50,
  //     netValueUnit: 'USD',
  //     customerReferenceDate: '2024-01-15'
  //   },
  //   itemOverview: {
  //     validFrom: '2024-01-01',
  //     validTo: '2024-12-31',
  //     reqDelivDate: '2024-02-15',
  //     expectOralVal: '16000.00',
  //     expectOralValUnit: 'USD',
  //     items: [
  //       {
  //         material: 'MAT-001',
  //         orderQuantity: '100',
  //         su: 10,
  //         altItm: 1,
  //         description: '高品质电子元件'
  //       },
  //       {
  //         material: 'MAT-002',
  //         orderQuantity: '50',
  //         su: 5,
  //         altItm: 2,
  //         description: '精密传感器模块'
  //       }
  //     ]
  //   }
  // };
  
  res.json({
    success: true,
    message: '初始化询价单成功',
    // data: {
    //   inquiryData: mockInquiryData
    // }
  })
})
// inquiry/initialize
router.post('/inquiry/create', (req, res) => {
  // 直接返回成功
  console.log('创建询价单:', req.body);
  const inquiryId = 'INQ-2024-033'
  res.json({
    success: true,
    message: '创建询价单成功',
    data: {
      message: `Inquiry ${inquiryId} has been created successfully`
    }
  })
})

// inquiry/price-query
router.post('/inquiry/price-query', (req, res) => {
  console.log('询价单价格查询:', req.body);
  res.json({
    success: true,
    message: '询价单价格查询成功',
    data: {
      netValue: 15800.50,
      netValueUnit: 'USD',
      expectOralVal: '16000.00',
      expectOralValUnit: 'USD'
    }
  })
})

module.exports = router;