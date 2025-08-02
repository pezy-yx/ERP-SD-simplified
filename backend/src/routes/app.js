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

// bp-relationship/get
router.post('/bp-relationship/get', (req, res) => {
  console.log('查询BP关系:', req.body);
  const relationshipId = req.body.relationshipId

  if (!relationshipId) {
    res.json({
      success: false,
      message: 'Relationship ID is required'
    })
    return
  }

  // 模拟返回BP关系数据
  const mockBPRelationshipData = {
    meta: {
      id: relationshipId
    },
    basicInfo: {
      relation: {
        relationShipCategory: 'test'
      },
      default: {
        businessPartner1: 'BP001',
        businessPartner2: 'BP002',
        validFrom: '2024-01-01',
        validTo: '2024-12-31'
      }
    }
  }

  const mockGeneralData = {
    testField: 'Sample test data'
  }

  
  let formStruct = {

  }
  if(1 || relationCategoty === 'test') {
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
    message: '查询BP关系成功',
    data: {
      content: {
        basicInfo: mockBPRelationshipData,
        generalData: mockGeneralData,
      },
      formStruct: formStruct
    }
  })
})

// bp-relationship/edit
router.post('/bp-relationship/edit', (req, res) => {
  console.log('编辑BP关系:', req.body);
  const bpRelationshipData = req.body.bpRelationshipData

  // 如果有ID，则是修改，否则是创建
  if(bpRelationshipData && bpRelationshipData.meta && bpRelationshipData.meta.id) {
    res.json({
      success: true,
      message: '修改BP关系成功',
      data: {
        message: `BP relationship ${bpRelationshipData.meta.id} has been updated successfully`
      }
    })
    return
  }

  // 创建新的BP关系
  const relationId = "REL-2024-001"
  res.json({
    success: true,
    message: '创建BP关系成功',
    data: {
      message: `BP relationship ${relationId} has been created successfully`,
      content: {
        id: relationId
      }
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

// outbound-delivery/get-sales-orders - 获取销售订单列表
router.post('/outbound-delivery/get-sales-orders', (req, res) => {
  console.log('获取销售订单列表:', req.body);

  // 模拟销售订单数据
  const mockSalesOrders = [
    {
      id: '1',
      plannedCreationDate: '2024-01-15',
      plannedGIDate: '2024-01-20',
      shippingPoint: '1000',
      shipToParty: 'CUST-12345',
      grossWeight: '125.5 KG'
    },
    {
      id: '2',
      plannedCreationDate: '2024-01-16',
      plannedGIDate: '2024-01-21',
      shippingPoint: '1000',
      shipToParty: 'CUST-67890',
      grossWeight: '89.2 KG'
    },
    {
      id: '3',
      plannedCreationDate: '2024-01-17',
      plannedGIDate: '2024-01-22',
      shippingPoint: '2000',
      shipToParty: 'CUST-11111',
      grossWeight: '203.8 KG'
    }
  ];

  res.json({
    success: true,
    message: '获取销售订单成功',
    data: {
      orders: mockSalesOrders
    }
  })
})

// outbound-delivery/create-from-orders - 从销售订单创建出库交货单
router.post('/outbound-delivery/create-from-orders', (req, res) => {
  console.log('从销售订单创建出库交货单:', req.body);

  const { selectedOrders } = req.body;
  const createdDeliveries = [];

  selectedOrders.forEach((order, index) => {
    const deliveryId = `DEL-2024-${String(100 + index).padStart(3, '0')}`;
    createdDeliveries.push(deliveryId);
  });

  res.json({
    success: true,
    message: `Successfully created ${createdDeliveries.length} outbound deliveries: ${createdDeliveries.join(', ')}`,
    data: {
      message: `Successfully created ${createdDeliveries.length} outbound deliveries: ${createdDeliveries.join(', ')}`,
      createdDeliveries: createdDeliveries
    }
  })
})

// outbound-delivery/get-deliveries - 获取出库交货单列表
router.post('/outbound-delivery/get-deliveries-summary', (req, res) => {
  console.log('获取出库交货单列表:', req.body);

  const mockDeliveries = [
    {
      outboundDelivery: 'DEL-2024-100',
      pickingDate: '2024-01-20',
      pickingStatus: 'Completed',
      giStatus: 'Not Started',
      pick: 'Pick',
      // 添加详细信息以支持详情页面
      detail: {
        meta: {
          posted: false,
          readyToPost: true
        },
        actualGIDate: '01/20/2024',
        plannedGIDate: '01/20/2024',
        actualDate: '01/20/2024',
        loadingDate: '01/20/2024',
        deliveryDate: '01/20/2024',
        pickingStatus: 'Completed',
        overallStatus: 'In Progress',
        giStatus: 'Not Started',
        shipToParty: 'Customer A (CUST-001)',
        address: '123 Main St, New York, NY 10001, USA',
        grossWeight: '150.000',
        grossWeightUnit: 'KG',
        netWeight: '140.000',
        netWeightUnit: 'KG',
        volume: '1.2',
        volumeUnit: 'm3',
        priority: 'Normal Items',
        shippingPoint: 'NY Shipping Point'
      },
      items: [
        {
          item: '000010',
          material: 'MAT-100',
          deliveryQuantity: '10',
          deliveryQuantityUnit: 'EA',
          pickingQuantity: '10',
          pickingQuantityUnit: 'EA',
          pickingStatus: 'Completed',
          confirmationStatus: 'Confirmed'
        }
      ]
    },
    {
      outboundDelivery: 'DEL-2024-101',
      pickingDate: '2024-01-21',
      pickingStatus: 'In Progress',
      giStatus: 'Not Started',
      pick: 'Pick',
      detail: {
        meta: {
          posted: false,
          readyToPost: false
        },
        actualGIDate: '01/21/2024',
        plannedGIDate: '01/21/2024',
        actualDate: '01/21/2024',
        loadingDate: '01/21/2024',
        deliveryDate: '01/21/2024',
        pickingStatus: 'In Progress',
        overallStatus: 'In Progress',
        giStatus: 'Not Started',
        shipToParty: 'Customer B (CUST-002)',
        address: '456 Business Ave, Los Angeles, CA 90001, USA',
        grossWeight: '200.000',
        grossWeightUnit: 'KG',
        netWeight: '190.000',
        netWeightUnit: 'KG',
        volume: '1.8',
        volumeUnit: 'm3',
        plant: 'Los Angeles',
        shippingPoint: 'LA Shipping Point'
      },
      items: [
        {
          item: '000020',
          material: 'MAT-200',
          deliveryQuantity: '15',
          deliveryQuantityUnit: 'EA',
          pickingQuantity: '8',
          pickingQuantityUnit: 'EA',
          pickingStatus: 'In Progress',
          confirmationStatus: 'Partially Confirmed'
        }
      ]
    },
    {
      outboundDelivery: 'DEL-2024-102',
      pickingDate: '2024-01-22',
      pickingStatus: 'Not Started',
      giStatus: 'Not Started',
      pick: 'Pick',
      detail: {
        meta: {
          posted: false,
          readyToPost: false
        },
        actualGIDate: '01/22/2024',
        plannedGIDate: '01/22/2024',
        actualDate: '01/22/2024',
        loadingDate: '01/22/2024',
        deliveryDate: '01/22/2024',
        pickingStatus: 'Not Started',
        overallStatus: 'Open',
        giStatus: 'Not Started',
        shipToParty: 'Customer C (CUST-003)',
        address: '789 Industrial Blvd, Chicago, IL 60601, USA',
        grossWeight: '300.000',
        grossWeightUnit: 'KG',
        netWeight: '280.000',
        netWeightUnit: 'KG',
        volume: '2.5',
        volumeUnit: 'm3',
        plant: 'Chicago',
        shippingPoint: 'CHI Shipping Point'
      },
      items: [
        {
          item: '000030',
          material: 'MAT-300',
          deliveryQuantity: '20',
          deliveryQuantityUnit: 'EA',
          pickingQuantity: '0',
          pickingQuantityUnit: 'EA',
          pickingStatus: 'Not Started',
          confirmationStatus: 'Not Confirmed'
        }
      ]
    }
  ];

  res.json({
    success: true,
    message: '获取出库交货单成功',
    data: {
      deliveries: mockDeliveries
    }
  })
})

// outbound-delivery/items-tab-query - 验证交货单数据
router.post('/outbound-delivery/items-tab-query', (req, res) => {
  console.log('验证交货单数据:', req.body);

  // 模拟验证逻辑 - 总是返回成功
  const isValid = true;

  breakdowns = req.body

  res.json({
    success: isValid,
    message: isValid ? '数据验证通过' : '数据验证失败',
    data: {
      result: {
        allDataLegal: 1, // 1表示所有数据合法，0表示有不合法数据
        badRecordIndices: []
      },
      generalData: {

      },
      breakdowns: breakdowns
    }
  })
})

// outbound-delivery/get-detail - 获取交货单详情
router.post('/outbound-delivery/get-detail', (req, res) => {
  console.log('获取交货单详情:', req.body);

  const { deliveryId } = req.body;

  // 模拟交货单详情数据
  const mockDeliveryDetail = {
    meta: {
      id: deliveryId,
      posted: (deliveryId=='33'||deliveryId=='DEL-2024-101')?true:false,
      readyToPost: true
    },
    actualGIDate: '06/17/2018',
    plannedGIDate: '06/17/2018',
    actualDate: '06/17/2018',
    loadingDate: '06/17/2018',
    deliveryDate: '06/17/2018',
    pickingStatus: 'Completely Processed',
    overallStatus: 'Completely Processed',
    giStatus: 'Not Started',
    shipToParty: 'Domestic Elec (USNY)',
    address: '123 Business St, Bronx NY, 10453, USA',
    grossWeight: '100.000',
    grossWeightUnit: 'KG',
    netWeight: '95.000',
    netWeightUnit: 'KG',
    volume: '0.5',
    volumeUnit: 'm3',
    priority: 'Normal Items',
    shippingPoint: 'NY Delivery (USNY)'
  };

  const mockDeliveryItems = {
    items: [
      {
        item: '000010',
        material: 'MAT-001',
        deliveryQuantity: '5',
        deliveryQuantityUnit: 'EA',
        pickingQuantity: '5',
        pickingQuantityUnit: 'EA',
        pickingStatus: 'Completely Processed',
        confirmationStatus: 'Confirmed',
        salesOrder: 'SO-2024-001',
        itemType: 'Standard',
        originalDelivertyQuantity: '5',
        conversionRate: '1',
        baseUnitDeliveryQuantity: '5',
        grossWeight: '10.000',
        netWeight: '9.500',
        volume: '0.1',
        plant: 'New York',
        storageLocation: '0001',
        storageLocationDescription: 'Main Storage',
        storageBin: 'A-01-01',
        materialAvailability: '2024-01-15'
      },
      {
        item: '000020',
        material: 'MAT-002',
        deliveryQuantity: '10',
        deliveryQuantityUnit: 'EA',
        pickingQuantity: '8',
        pickingQuantityUnit: 'EA',
        pickingStatus: 'Partially Processed',
        confirmationStatus: 'Partially Confirmed',
        salesOrder: 'SO-2024-002',
        itemType: 'Standard',
        originalDelivertyQuantity: '10',
        conversionRate: '1',
        baseUnitDeliveryQuantity: '10',
        grossWeight: '20.000',
        netWeight: '19.000',
        volume: '0.2',
        plant: 'New York',
        storageLocation: '0001',
        storageLocationDescription: 'Main Storage',
        storageBin: 'A-01-02',
        materialAvailability: '2024-01-15'
      }
    ]
  };

  res.json({
    success: true,
    message: `获取交货单 ${deliveryId} 详情成功`,
    data: {
      detail: mockDeliveryDetail,
      items: mockDeliveryItems
    }
  })
})

// outbound-delivery/post-gis - 提交GI数据
router.post('/outbound-delivery/post-gis', (req, res) => {
  console.log('提交GI数据:', req.body);

  const inputData = req.body;

  // 模拟处理GI数据，返回breakdown结构，包含详细数据
  const breakdowns = inputData.map((deliveryData, index) => {
    // 更新状态为已过账
    const updatedDeliveryDetail = {
      ...deliveryData.deliveryDetail,
      meta: {
        ...deliveryData.deliveryDetail.meta,
        posted: true,
        readyToPost: false
      },
      giStatus: 'Completed',
      overallStatus: 'Completed'
    };

    // 更新物品状态
    const updatedItems = deliveryData.items.map(item => ({
      ...item,
      pickingStatus: 'Completed',
      confirmationStatus: 'Confirmed'
    }));

    return {
      detail: updatedDeliveryDetail,
      items: updatedItems
    };
  });

  res.json({
    success: true,
    message: 'GI数据提交成功',
    data: {
      result: {
        allDataLegal: 1,
        badRecordIndices: []
      },
      breakdowns: breakdowns
    }
  })
})

// outbound-delivery/post-gis-by-id - 提交GI数据
router.post('/outbound-delivery/post-gis-by-id', (req, res) => {
  console.log('提交GI数据:', req.body);

  const { deliveryIds } = req.body; //是id的列表

  // 模拟处理GI数据，返回breakdown结构，包含summary数据
  const breakdowns = deliveryIds.map(deliveryId => {
    return {
      outboundDelivery: deliveryId,
      pickingDate: '2024-01-20',
      pickingStatus: 'Completed',
      giStatus: 'Completed',
    };
  });

  res.json({
    success: true,
    message: 'GI数据提交成功',
    data: {
      result: {
        allDataLegal: 1,
        badRecordIndices: []
      },
      breakdowns: breakdowns
    }
  })
})

module.exports = router;