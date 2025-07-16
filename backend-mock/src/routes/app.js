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
      content: defaultValue
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
          item: '1',
          material: 'MAT-001',
          orderQuantity: '100',
          orderQuantityUnit: 'EA',
          description: '高品质电子元件',
          reqDelivDate: '2024-02-15',
          netValue: '1500.00',
          netValueUnit: 'USD',
          taxValue: '225.00',
          taxValueUnit: 'USD',
          pricingDate: '2024-01-15',
          orderProbability: '95',
          pricingElements: [
            {
              cnty: 'US',
              name: 'Base Price',
              amount: '1500.00',
              city: 'USD',
              per: '1',
              uom: 'EA',
              conditionValue: '1500.00',
              curr: 'USD',
              status: 'Active',
              numC: '1',
              atoMtsComponent: '',
              oun: '',
              cconDe: '',
              un: '',
              conditionValue2: '1500.00',
              cdCur: 'USD',
              stat: true
            },
            {
              cnty: 'US',
              name: 'Tax',
              amount: '225.00',
              city: 'USD',
              per: '1',
              uom: 'EA',
              conditionValue: '225.00',
              curr: 'USD',
              status: 'Active',
              numC: '2',
              atoMtsComponent: '',
              oun: '',
              cconDe: '',
              un: '',
              conditionValue2: '225.00',
              cdCur: 'USD',
              stat: true
            }
          ]
        },
        {
          item: '2',
          material: 'MAT-002',
          orderQuantity: '50',
          orderQuantityUnit: 'EA',
          description: '精密传感器模块',
          reqDelivDate: '2024-02-20',
          netValue: '2800.00',
          netValueUnit: 'USD',
          taxValue: '420.00',
          taxValueUnit: 'USD',
          pricingDate: '2024-01-15',
          orderProbability: '90',
          pricingElements: [
            {
              cnty: 'US',
              name: 'Base Price',
              amount: '2800.00',
              city: 'USD',
              per: '1',
              uom: 'EA',
              conditionValue: '2800.00',
              curr: 'USD',
              status: 'Active',
              numC: '1',
              atoMtsComponent: '',
              oun: '',
              cconDe: '',
              un: '',
              conditionValue2: '2800.00',
              cdCur: 'USD',
              stat: true
            },
            {
              cnty: 'US',
              name: 'Tax',
              amount: '420.00',
              city: 'USD',
              per: '1',
              uom: 'EA',
              conditionValue: '420.00',
              curr: 'USD',
              status: 'Active',
              numC: '2',
              atoMtsComponent: '',
              oun: '',
              cconDe: '',
              un: '',
              conditionValue2: '420.00',
              cdCur: 'USD',
              stat: true
            }
          ]
        }
      ]
    }
  };
  
  res.json({
    success: true,
    message: '初始化询价单成功',
    data : {
      content: mockInquiryData
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
      message: `Inquiry ${inquiryId} has been created successfully`,
      content: {
        id: inquiryId
      }
    }
  })
})

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