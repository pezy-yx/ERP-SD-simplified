const express = require('express');
const router = express.Router();

// 模拟销售订单数据，每个对象都遵循 mockSOData 的结构，并补充了 status 字段
const mockSalesOrdersData = [
  {
    meta: { id: 'SO001' },
    basicInfo: {
      quotation_id: 'QUO-2024-001',
      soldToParty: '200001',
      shipToParty: 'SHIP-67890',
      customerReference: 'PO-HW-001',
      netValue: 13000.00,
      netValueUnit: 'CNY',
      customerReferenceDate: '2024-07-01'
    },
    itemOverview: {
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      reqDelivDate: '2024-07-15',
      expectOralVal: '15000.00',
      expectOralValUnit: 'CNY',
      items: [
        {
          item: '10',
          material: 'MAT-001',
          orderQuantity: '100',
          orderQuantityUnit: 'EA',
          description: '高品质电子元件',
          reqDelivDate: '2024-07-15',
          netValue: '10000.00',
          netValueUnit: 'CNY',
          taxValue: '1500.00',
          taxValueUnit: 'CNY',
          pricingDate: '2024-07-01',
          orderProbability: '100',
          pricingElements: [
            {
              cnty: 'CN', name: 'Base Price', amount: '100.00', city: 'CNY', per: '1', uom: 'EA',
              conditionValue: '10000.00', curr: 'CNY', status: 'Active', numC: '1', atoMtsComponent: '',
              oun: '', cconDe: '', un: '', conditionValue2: '10000.00', cdCur: 'CNY', stat: true
            },
            {
              cnty: 'CN', name: 'Tax', amount: '15.00', city: 'CNY', per: '1', uom: 'EA',
              conditionValue: '1500.00', curr: 'CNY', status: 'Active', numC: '2', atoMtsComponent: '',
              oun: '', cconDe: '', un: '', conditionValue2: '1500.00', cdCur: 'CNY', stat: true
            }
          ]
        },
        {
          item: '20',
          material: 'MAT-002',
          orderQuantity: '50',
          orderQuantityUnit: 'EA',
          description: '精密传感器模块',
          reqDelivDate: '2024-07-16',
          netValue: '3000.00',
          netValueUnit: 'CNY',
          taxValue: '450.00',
          taxValueUnit: 'CNY',
          pricingDate: '2024-07-01',
          orderProbability: '100',
          pricingElements: [
            {
              cnty: 'CN', name: 'Base Price', amount: '60.00', city: 'CNY', per: '1', uom: 'EA',
              conditionValue: '3000.00', curr: 'CNY', status: 'Active', numC: '1', atoMtsComponent: '',
              oun: '', cconDe: '', un: '', conditionValue2: '3000.00', cdCur: 'CNY', stat: true
            },
            {
              cnty: 'CN', name: 'Tax', amount: '9.00', city: 'CNY', per: '1', uom: 'EA',
              conditionValue: '450.00', curr: 'CNY', status: 'Active', numC: '2', atoMtsComponent: '',
              oun: '', cconDe: '', un: '', conditionValue2: '450.00', cdCur: 'CNY', stat: true
            }
          ]
        }
      ]
    },
    status: 'Open'
  },
  {
    meta: { id: 'SO002' },
    basicInfo: {
      quotation_id: 'QUO-2024-002',
      soldToParty: '200002',
      shipToParty: 'SHIP-67891',
      customerReference: 'PO-TX-002',
      netValue: 8000.00,
      netValueUnit: 'USD',
      customerReferenceDate: '2024-07-05'
    },
    itemOverview: {
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      reqDelivDate: '2024-07-20',
      expectOralVal: '8999.00',
      expectOralValUnit: 'USD',
      items: [
        {
          item: '10',
          material: 'MAT-003',
          orderQuantity: '50',
          orderQuantityUnit: 'EA',
          description: '普通螺丝钉',
          reqDelivDate: '2024-07-20',
          netValue: '8000.00',
          netValueUnit: 'USD',
          taxValue: '1200.00',
          taxValueUnit: 'USD',
          pricingDate: '2024-07-05',
          orderProbability: '100',
          pricingElements: [
            {
              cnty: 'US', name: 'Base Price', amount: '160.00', city: 'USD', per: '1', uom: 'EA',
              conditionValue: '8000.00', curr: 'USD', status: 'Active', numC: '1', atoMtsComponent: '',
              oun: '', cconDe: '', un: '', conditionValue2: '8000.00', cdCur: 'USD', stat: true
            },
            {
              cnty: 'US', name: 'Tax', amount: '24.00', city: 'USD', per: '1', uom: 'EA',
              conditionValue: '1200.00', curr: 'USD', status: 'Active', numC: '2', atoMtsComponent: '',
              oun: '', cconDe: '', un: '', conditionValue2: '1200.00', cdCur: 'USD', stat: true
            }
          ]
        }
      ]
    },
    status: 'In Progress'
  },
  {
    meta: { id: 'SO003' },
    basicInfo: {
      quotation_id: 'QUO-2024-003',
      soldToParty: '200001', // Same customer as SO001
      shipToParty: 'SHIP-67892',
      customerReference: 'PO-HW-002',
      netValue: 2000.00,
      netValueUnit: 'CNY',
      customerReferenceDate: '2024-06-20'
    },
    itemOverview: {
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      reqDelivDate: '2024-07-01',
      expectOralVal: '2499.00',
      expectOralValUnit: 'CNY',
      items: [
        {
          item: '10',
          material: 'MAT-004',
          orderQuantity: '20',
          orderQuantityUnit: 'EA',
          description: '高级工具箱',
          reqDelivDate: '2024-07-01',
          netValue: '2000.00',
          netValueUnit: 'CNY',
          taxValue: '300.00',
          taxValueUnit: 'CNY',
          pricingDate: '2024-06-20',
          orderProbability: '100',
          pricingElements: [
            {
              cnty: 'CN', name: 'Base Price', amount: '100.00', city: 'CNY', per: '1', uom: 'EA',
              conditionValue: '2000.00', curr: 'CNY', status: 'Active', numC: '1', atoMtsComponent: '',
              oun: '', cconDe: '', un: '', conditionValue2: '2000.00', cdCur: 'CNY', stat: true
            },
            {
              cnty: 'CN', name: 'Tax', amount: '15.00', city: 'CNY', per: '1', uom: 'EA',
              conditionValue: '300.00', curr: 'CNY', status: 'Active', numC: '2', atoMtsComponent: '',
              oun: '', cconDe: '', un: '', conditionValue2: '300.00', cdCur: 'CNY', stat: true
            }
          ]
        }
      ]
    },
    status: 'Completed'
  },
  {
    meta: { id: 'SO004' },
    basicInfo: {
      quotation_id: 'QUO-2024-004',
      soldToParty: '200004',
      shipToParty: 'SHIP-67893',
      customerReference: 'PO-BYD-001',
      netValue: 3500.00,
      netValueUnit: 'CNY',
      customerReferenceDate: '2024-07-10'
    },
    itemOverview: {
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      reqDelivDate: '2024-07-25',
      expectOralVal: '3999.00',
      expectOralValUnit: 'CNY',
      items: [
        {
          item: '10',
          material: 'MAT-005',
          orderQuantity: '80',
          orderQuantityUnit: 'EA',
          description: '塑料管材',
          reqDelivDate: '2024-07-25',
          netValue: '3500.00',
          netValueUnit: 'CNY',
          taxValue: '525.00',
          taxValueUnit: 'CNY',
          pricingDate: '2024-07-10',
          orderProbability: '100',
          pricingElements: [
            {
              cnty: 'CN', name: 'Base Price', amount: '43.75', city: 'CNY', per: '1', uom: 'EA',
              conditionValue: '3500.00', curr: 'CNY', status: 'Active', numC: '1', atoMtsComponent: '',
              oun: '', cconDe: '', un: '', conditionValue2: '3500.00', cdCur: 'CNY', stat: true
            },
            {
              cnty: 'CN', name: 'Tax', amount: '6.56', city: 'CNY', per: '1', uom: 'EA',
              conditionValue: '525.00', curr: 'CNY', status: 'Active', numC: '2', atoMtsComponent: '',
              oun: '', cconDe: '', un: '', conditionValue2: '525.00', cdCur: 'CNY', stat: true
            }
          ]
        }
      ]
    },
    status: 'Open'
  },
  {
    meta: { id: 'SO005' },
    basicInfo: {
      quotation_id: 'QUO-2024-005',
      soldToParty: '200005',
      shipToParty: 'SHIP-67894',
      customerReference: 'PO-ZTE-001',
      netValue: 0.00,
      netValueUnit: 'CNY',
      customerReferenceDate: '2024-07-12'
    },
    itemOverview: {
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      reqDelivDate: '2024-07-28',
      expectOralVal: '0.00',
      expectOralValUnit: 'CNY',
      items: []
    },
    status: 'New'
  }
];

// Helper function: Transforms mock data to the format expected by the frontend search results list
const transformSODataForSearch = (data) => {
  return {
    so_id: data.meta.id,
    soldToPartyName: data.basicInfo.soldToParty, // Use soldToParty as name
    customer_no: data.basicInfo.soldToParty, // Use soldToParty as customer number
    customer_reference: data.basicInfo.customerReference,
    req_delivery_date: data.itemOverview.reqDelivDate,
    status: data.status, // Directly use status from mock data
    net_value: data.basicInfo.netValue,
    currency: data.basicInfo.netValueUnit,
    doc_date: data.basicInfo.customerReferenceDate,
    id: data.meta.id, // For VarBox result item 'id'
    result: data.meta.id, // For VarBox result item 'result'
    description: `Status: ${data.status} | Customer No: ${data.basicInfo.soldToParty} | Ref: ${data.basicInfo.customerReference} | Total: ${data.basicInfo.netValue} ${data.basicInfo.netValueUnit}`
  };
};

// Helper function: Transforms mock data to the format expected by the frontend detail page VarBox
const transformSODataForGet = (data) => {
  return {
    meta: {
      id: data.meta.id
    },
    basicInfo: {
      so_id: data.meta.id,
      quotation_id: data.basicInfo.quotation_id,
      soldToParty: data.basicInfo.soldToParty,
      shipToParty: data.basicInfo.shipToParty,
      customerReference: data.basicInfo.customerReference,
      netValue: data.basicInfo.netValue,
      netValueUnit: data.basicInfo.netValueUnit,
      customerReferenceDate: data.basicInfo.customerReferenceDate,
    },
    itemOverview: {
      reqDelivDate: data.itemOverview.reqDelivDate,
      items: data.itemOverview.items // Ensure items array is passed correctly, now it contains detailed info
    }
  };
};

// Sales Order Search - Mock API
router.post('/search', (req, res) => {
  try {
    const { so_id, status, customer_no, customer_reference } = req.body;

    console.log('Sales Order Search Params:', req.body);

    let results = [...mockSalesOrdersData]; // Start with full mock data

    // Filter by Sales Order ID (so_id)
    if (so_id && so_id.trim()) {
      const searchSoId = so_id.toLowerCase();
      results = results.filter(order =>
        order.meta.id.toLowerCase().includes(searchSoId) // Use includes for flexible search
      );
    }

    // Filter by Overall Status (status)
    if (status && status.trim()) {
      const searchStatus = status.toLowerCase();
      results = results.filter(order =>
        order.status.toLowerCase() === searchStatus
      );
    }

    // Filter by Sold-To Party (customer_no)
    if (customer_no && customer_no.trim()) {
      const searchCustomerNo = customer_no.toLowerCase();
      results = results.filter(order =>
        String(order.basicInfo.soldToParty).toLowerCase().includes(searchCustomerNo) // Use includes
      );
    }

    // Filter by Customer Reference (customer_reference)
    if (customer_reference && customer_reference.trim()) {
      const searchCustomerRef = customer_reference.toLowerCase();
      results = results.filter(order =>
        order.basicInfo.customerReference.toLowerCase().includes(searchCustomerRef) // Use includes
      );
    }

    const formattedResults = results.map(transformSODataForSearch);

    res.json({
      success: true,
      data: formattedResults,
      message: 'Sales orders found successfully.'
    });

  } catch (error) {
    console.error('Error during sales order search:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search sales orders.',
      error: error.message
    });
  }
});

// Sales Order Detail Fetch - Mock API
router.get('/get/:soId', (req, res) => {
  try {
    const { soId } = req.params;
    console.log('Fetching Sales Order by ID:', soId);

    // Find the matching sales order in mockSalesOrdersData array
    const foundOrder = mockSalesOrdersData.find(order =>
      order.meta.id.toLowerCase() === soId.toLowerCase()
    );

    if (foundOrder) {
      // Transform data structure to match frontend VarTree expectations
      const transformedData = transformSODataForGet(foundOrder);

      res.json({
        success: true,
        data: transformedData,
        message: `Sales order ${soId} found successfully.`
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Sales order ${soId} not found.`
      });
    }
  } catch (error) {
    console.error('Error fetching sales order by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales order details.',
      error: error.message
    });
  }
});

// Sales Order Creation - Mock API
router.post('/create', (req, res) => {
  try {
    const newOrderData = req.body;
    console.log('Creating Sales Order with data:', newOrderData);

    // Simple mock for successful creation, return a mock order ID
    const newSoId = `SO${(mockSalesOrdersData.length + 1).toString().padStart(3, '0')}`;
    const createdOrder = {
      meta: { id: newSoId },
      ...newOrderData, // Merge incoming data
      status: 'New' // Default status is New
    };
    mockSalesOrdersData.push(createdOrder); // Add the new order to mock data

    res.json({
      success: true,
      data: { so_id: newSoId },
      message: `Sales Order ${newSoId} created successfully.`
    });
  } catch (error) {
    console.error('Error creating sales order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sales order.',
      error: error.message
    });
  }
});

// Sales Order Edit - Mock API
router.post('/edit', (req, res) => {
  try {
    const updatedOrderData = req.body;
    // Get order ID, prioritize meta.id or basicInfo.so_id
    const soIdToUpdate = updatedOrderData?.meta?.id || updatedOrderData?.basicInfo?.so_id;
    console.log('Editing Sales Order with ID:', soIdToUpdate, 'Data:', updatedOrderData);

    const index = mockSalesOrdersData.findIndex(order => String(order.meta.id).toLowerCase() === String(soIdToUpdate).toLowerCase());

    if (index !== -1) {
      // Update existing order
      mockSalesOrdersData[index] = {
        ...mockSalesOrdersData[index], // Keep existing data
        ...updatedOrderData, // Overwrite with new data
        meta: { id: soIdToUpdate } // Ensure meta.id remains unchanged
      };

      res.json({
        success: true,
        data: { so_id: soIdToUpdate },
        message: `Sales Order ${soIdToUpdate} updated successfully.`
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Sales Order ${soIdToUpdate} not found for update.`
      });
    }
  } catch (error) {
    console.error('Error editing sales order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to edit sales order.',
      error: error.message
    });
  }
});

module.exports = router;
