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
          nameDisplay: 'Test Field: '
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
  const defaultValue = {
    itemOverview: {
      reqDelivDate: '2033-03-14'
    }
  }
  
  res.json({
    success: true,
    message: '初始化询价单成功',
    data : {
      defaultValue
    }
  })
})

// inquiry/get
router.post('/inquiry/get', (req, res) => {
  // 直接返回成功
  console.log('初始化询价单:', req.body);
  
  // 模拟询价数据常量
  const mockInquiryData = {
    meta: {
      id: 'INQ-2024-001'
    },
    basicInfo: {
      inquiry: 'INQ-2024-001',
      soldToParty: 'CUST-12345',
      shipToParty: 'SHIP-67890',
      customerReference: 'REF-ABC123',
      netValue: 15800.50,
      netValueUnit: 'USD',
      customerReferenceDate: '2024-01-15'
    },
    itemOverview: {
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      reqDelivDate: '2024-02-15',
      expectOralVal: '16000.00',
      expectOralValUnit: 'USD',
      items: [
        {
          material: 'MAT-001',
          orderQuantity: '100',
          su: 10,
          altItm: 1,
          description: '高品质电子元件'
        },
        {
          material: 'MAT-002',
          orderQuantity: '50',
          su: 5,
          altItm: 2,
          description: '精密传感器模块'
        }
      ]
    }
  };
  
  res.json({
    success: true,
    message: '初始化询价单成功',
    data : {
      inquiryData: mockInquiryData
    }
  })
})


// inquiry/edit
router.post('/inquiry/edit', (req, res) => {
  // 直接返回成功
  console.log('创建询价单:', req.body);
  // 如果body的meta.id不是''，则是修改，否则是创建
  if(req.body.meta.id) {
    res.json({
      success: true,
      message: '修改询价单成功',
      data: {
        message: `Inquiry ${req.body.meta.id} has been updated successfully`
      }
    })
    return
  }
  // else
  const inquiryId = 'INQ-2024-033'
  res.json({
    success: true,
    message: '创建询价单成功',
    data: {
      message: `Inquiry ${inquiryId} has been created successfully`
    }
  })
})

// inquiry/item-tab-query - 单个item的信息补全和验证
router.post('/inquiry/item-tab-query', (req, res) => {
  console.log('单个物品信息补全:', req.body);

  const inputItem = req.body;

  // 模拟验证逻辑 - 检查必要字段
  if (!inputItem.material || !inputItem.orderQuantity) {
    return res.json({
      success: false,
      message: '物品信息不完整，缺少必要字段',
      error: 'Missing required fields: material or orderQuantity'
    });
  }

  // 模拟根据material查找完整信息
  const materialDatabase = {
    'MAT-001': {
      description: '高品质电子元件',
      netValue: '10000.50',
      netValueUnit: 'USD',
      taxValue: '1500.08',
      taxValueUnit: 'USD',
      pricingElements: [
        {
          cnty: 'US',
          name: 'Base Price',
          amount: '100.00',
          city: 'USD',
          per: '1',
          uom: 'EA',
          conditionValue: '10000.50',
          curr: 'USD',
          status: 'Active',
          numC: '1',
          atoMtsComponent: '',
          oun: '',
          cconDe: '',
          un: '',
          conditionValue2: '10000.50',
          cdCur: 'USD',
          stat: true
        },
        {
          cnty: 'US',
          name: 'Tax',
          amount: '15.00',
          city: 'USD',
          per: '1',
          uom: 'EA',
          conditionValue: '1500.08',
          curr: 'USD',
          status: 'Active',
          numC: '2',
          atoMtsComponent: '',
          oun: '',
          cconDe: '',
          un: '',
          conditionValue2: '1500.08',
          cdCur: 'USD',
          stat: true
        }
      ]
    },
    'MAT-002': {
      description: '精密传感器模块',
      netValue: '5800.50',
      netValueUnit: 'USD',
      taxValue: '870.08',
      taxValueUnit: 'USD',
      pricingElements: [
        {
          cnty: 'US',
          name: 'Base Price',
          amount: '116.01',
          city: 'USD',
          per: '1',
          uom: 'EA',
          conditionValue: '5800.50',
          curr: 'USD',
          status: 'Active',
          numC: '1',
          atoMtsComponent: '',
          oun: '',
          cconDe: '',
          un: '',
          conditionValue2: '5800.50',
          cdCur: 'USD',
          stat: true
        }
      ]
    }
  };

  const materialInfo = materialDatabase[inputItem.material];

  if (!materialInfo) {
    return res.json({
      success: false,
      message: '未找到该物料信息',
      error: `Material ${inputItem.material} not found in database`
    });
  }

  // 返回补全的信息
  const completedItem = {
    ...inputItem,
    ...materialInfo,
    pricingDate: inputItem.pricingDate || '2024-01-15',
    orderProbability: inputItem.orderProbability || '100'
  };

  res.json({
    success: true,
    message: '物品信息补全成功',
    data: completedItem
  });
});

// inquiry/items-tab-query - 批量查询
router.post('/inquiry/items-tab-query', (req, res) => {
  console.log('批量物品查询:', req.body);

  const items = req.body;
  let totalNetValue = 0;
  let totalExpectOralVal = 0;
  const breakdowns = [];

  items.forEach((item, index) => {
    const itemNetValue = parseFloat(item.netValue) || 0;
    totalNetValue += itemNetValue;
    totalExpectOralVal += itemNetValue * 1.1; // 期望值比净值高10%

    // 生成模拟的pricingElements
    const pricingElements = [
      {
        cnty: 'US',
        name: 'Base Price',
        amount: itemNetValue.toFixed(2),
        city: 'USD',
        per: '1',
        uom: 'EA',
        conditionValue: itemNetValue.toFixed(2),
        curr: 'USD',
        status: 'Active',
        numC: '1',
        atoMtsComponent: '',
        oun: '',
        cconDe: '',
        un: '',
        conditionValue2: itemNetValue.toFixed(2),
        cdCur: 'USD',
        stat: true
      },
      {
        cnty: 'US',
        name: 'Tax',
        amount: (itemNetValue * 0.15).toFixed(2),
        city: 'USD',
        per: '1',
        uom: 'EA',
        conditionValue: (itemNetValue * 0.15).toFixed(2),
        curr: 'USD',
        status: 'Active',
        numC: '2',
        atoMtsComponent: '',
        oun: '',
        cconDe: '',
        un: '',
        conditionValue2: (itemNetValue * 0.15).toFixed(2),
        cdCur: 'USD',
        stat: true
      }
    ];

    breakdowns.push({
      item: item.item || (index + 1).toString(),
      material: item.material || `MAT-${String(index + 1).padStart(3, '0')}`,
      orderQuantity: item.orderQuantity || '1',
      orderQuantityUnit: item.orderQuantityUnit || 'EA',
      description: item.description || `物料描述 ${index + 1}`,
      reqDelivDate: item.reqDelivDate || '2024-02-15',
      netValue: itemNetValue,
      netValueUnit: 'USD',
      taxValue: itemNetValue * 0.15, // 15%税率
      taxValueUnit: 'USD',
      pricingDate: item.pricingDate || '2024-01-15',
      orderProbability: item.orderProbability || '100',
      pricingElements: pricingElements
    });
  });

  res.json({
    success: true,
    message: '价格查询成功',
    data: {
      result: {
        allDataLegal: 1, // 1表示所有数据合法，0表示有不合法数据
        badRecordIndices: []
      },
      generalData: {
        netValue: totalNetValue.toFixed(2),
        netValueUnit: 'USD',
        expectOralVal: totalExpectOralVal.toFixed(2),
        expectOralValUnit: 'USD',
      },
      breakdowns: breakdowns
    }
  });
});

module.exports = router;