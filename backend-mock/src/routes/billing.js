const express = require('express');
const router = express.Router();

// Mock数据
const mockBillingDocuments = [
  {
    id: 'BD001',
    billingDocument: 'BD001',
    soldToParty: 'C001 - ABC Company',
    billToParty: 'C001 - ABC Company',
    payerParty: 'C001 - ABC Company',
    netValue: '1500.00',
    currency: 'USD',
    billingDate: '2024-01-15',
    reference: 'REF001',
    totalNetValue: '1500.00',
    totalTaxValue: '150.00',
    totalGrossValue: '1650.00',
    items: [
      {
        item: '10',
        salesDocument: 'SO001',
        salesDocumentItem: '10',
        material: 'MAT001',
        description: 'Product A',
        billingQuantity: '10',
        quantityUnit: 'PC',
        netValue: '1000.00',
        taxValue: '100.00',
        grossValue: '1100.00',
        currency: 'USD'
      },
      {
        item: '20',
        salesDocument: 'SO001',
        salesDocumentItem: '20',
        material: 'MAT002',
        description: 'Product B',
        billingQuantity: '5',
        quantityUnit: 'PC',
        netValue: '500.00',
        taxValue: '50.00',
        grossValue: '550.00',
        currency: 'USD'
      }
    ]
  },
  {
    id: 'BD002',
    billingDocument: 'BD002',
    soldToParty: 'C002 - XYZ Corp',
    billToParty: 'C002 - XYZ Corp',
    payerParty: 'C002 - XYZ Corp',
    netValue: '2500.00',
    currency: 'EUR',
    billingDate: '2024-01-20',
    reference: 'REF002',
    totalNetValue: '2500.00',
    totalTaxValue: '500.00',
    totalGrossValue: '3000.00',
    items: [
      {
        item: '10',
        salesDocument: 'SO002',
        salesDocumentItem: '10',
        material: 'MAT003',
        description: 'Product C',
        billingQuantity: '20',
        quantityUnit: 'PC',
        netValue: '2500.00',
        taxValue: '500.00',
        grossValue: '3000.00',
        currency: 'EUR'
      }
    ]
  }
];

// Mock开票到期清单数据
const mockBillingDueList = [
  {
    salesDocument: 'SO001',
    soldToParty: 'C001 - ABC Company',
    netValue: '1500.00',
    currency: 'USD',
    deliveryDate: '2024-01-10',
    items: [
      {
        item: '10',
        material: 'MAT001',
        description: 'Product A',
        deliveredQuantity: '10',
        quantityUnit: 'PC',
        netValue: '1000.00'
      },
      {
        item: '20',
        material: 'MAT002',
        description: 'Product B',
        deliveredQuantity: '5',
        quantityUnit: 'PC',
        netValue: '500.00'
      }
    ]
  },
  {
    salesDocument: 'SO002',
    soldToParty: 'C002 - XYZ Corp',
    netValue: '2500.00',
    currency: 'EUR',
    deliveryDate: '2024-01-15',
    items: [
      {
        item: '10',
        material: 'MAT003',
        description: 'Product C',
        deliveredQuantity: '20',
        quantityUnit: 'PC',
        netValue: '2500.00'
      }
    ]
  }
];

// 初始化开票到期清单
router.post('/initialize', (req, res) => {
  try {
    const { billingDate, soldToParty } = req.body.billingDueList || {};
    
    console.log('Billing initialize request:', req.body);
    
    // 模拟根据条件筛选到期清单
    let filteredList = mockBillingDueList;
    
    if (soldToParty) {
      filteredList = filteredList.filter(item => 
        item.soldToParty.toLowerCase().includes(soldToParty.toLowerCase())
      );
    }
    
    // 模拟创建开票凭证的初始数据
    const billingData = {
      meta: {
        id: ''
      },
      basicInfo: {
        type: 'Invoice',
        id: '',
        netValue: '0.00',
        netValueUnit: 'USD',
        payer: soldToParty || '',
        billingDate: billingDate || new Date().toISOString().split('T')[0]
      },
      itemOverview: {
        totalNetValue: '0.00',
        totalTaxValue: '0.00',
        totalGrossValue: '0.00',
        currency: 'USD',
        items: filteredList.length > 0 ? filteredList[0].items.map((item, index) => ({
          item: (index + 1) * 10,
          salesDocument: filteredList[0].salesDocument,
          salesDocumentItem: item.item,
          material: item.material,
          description: item.description,
          billingQuantity: item.deliveredQuantity,
          quantityUnit: item.quantityUnit,
          netValue: item.netValue,
          taxValue: (parseFloat(item.netValue) * 0.1).toFixed(2),
          grossValue: (parseFloat(item.netValue) * 1.1).toFixed(2),
          currency: filteredList[0].currency
        })) : []
      }
    };
    
    // 计算总计
    const totalNet = billingData.itemOverview.items.reduce((sum, item) => sum + parseFloat(item.netValue), 0);
    const totalTax = billingData.itemOverview.items.reduce((sum, item) => sum + parseFloat(item.taxValue), 0);
    const totalGross = billingData.itemOverview.items.reduce((sum, item) => sum + parseFloat(item.grossValue), 0);
    
    billingData.basicInfo.netValue = totalNet.toFixed(2);
    billingData.basicInfo.netValueUnit = filteredList.length > 0 ? filteredList[0].currency : 'USD';
    billingData.itemOverview.totalNetValue = totalNet.toFixed(2);
    billingData.itemOverview.totalTaxValue = totalTax.toFixed(2);
    billingData.itemOverview.totalGrossValue = totalGross.toFixed(2);
    
    res.json({
      success: true,
      data: {
        content: billingData,
        message: 'Billing due list loaded successfully'
      }
    });
  } catch (error) {
    console.error('Error in billing initialize:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// 获取开票凭证
router.post('/get', (req, res) => {
  try {
    const { billingDocumentId } = req.body;
    
    console.log('Billing get request:', req.body);
    
    if (!billingDocumentId) {
      return res.json({
        success: false,
        message: 'Billing document ID is required'
      });
    }
    
    const billingDoc = mockBillingDocuments.find(doc => 
      doc.billingDocument === billingDocumentId || doc.id === billingDocumentId
    );
    
    if (!billingDoc) {
      return res.json({
        success: false,
        message: 'Billing document not found'
      });
    }
    
    const billingData = {
      meta: {
        id: billingDoc.id
      },
      basicInfo: {
        type: 'Invoice',
        id: billingDoc.billingDocument,
        netValue: billingDoc.netValue,
        netValueUnit: billingDoc.currency,
        payer: billingDoc.payerParty,
        billingDate: billingDoc.billingDate
      },
      itemOverview: {
        totalNetValue: billingDoc.totalNetValue,
        totalTaxValue: billingDoc.totalTaxValue,
        totalGrossValue: billingDoc.totalGrossValue,
        currency: billingDoc.currency,
        items: billingDoc.items
      }
    };
    
    res.json({
      success: true,
      data: {
        content: billingData
      }
    });
  } catch (error) {
    console.error('Error in billing get:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// 创建/编辑开票凭证
router.post('/edit', (req, res) => {
  try {
    const billingData = req.body;
    
    console.log('Billing edit request:', billingData);
    
    // 模拟创建或更新开票凭证
    const isCreate = !billingData.meta?.id;
    
    if (isCreate) {
      // 创建新的开票凭证
      const newId = 'BD' + String(mockBillingDocuments.length + 1).padStart(3, '0');
      const newBillingDoc = {
        id: newId,
        billingDocument: newId,
        soldToParty: billingData.basicInfo.payer,
        billToParty: billingData.basicInfo.payer,
        payerParty: billingData.basicInfo.payer,
        netValue: billingData.basicInfo.netValue,
        currency: billingData.basicInfo.netValueUnit,
        billingDate: billingData.basicInfo.billingDate,
        reference: '',
        totalNetValue: billingData.itemOverview.totalNetValue,
        totalTaxValue: billingData.itemOverview.totalTaxValue,
        totalGrossValue: billingData.itemOverview.totalGrossValue,
        items: billingData.itemOverview.items
      };
      
      mockBillingDocuments.push(newBillingDoc);
      
      res.json({
        success: true,
        data: {
          content: {
            id: newId
          },
          message: `Billing document ${newId} created successfully`
        }
      });
    } else {
      // 更新现有开票凭证
      const existingIndex = mockBillingDocuments.findIndex(doc => doc.id === billingData.meta.id);
      
      if (existingIndex === -1) {
        return res.json({
          success: false,
          message: 'Billing document not found'
        });
      }
      
      mockBillingDocuments[existingIndex] = {
        ...mockBillingDocuments[existingIndex],
        soldToParty: billingData.basicInfo.payer,
        billToParty: billingData.basicInfo.payer,
        payerParty: billingData.basicInfo.payer,
        netValue: billingData.basicInfo.netValue,
        currency: billingData.basicInfo.netValueUnit,
        billingDate: billingData.basicInfo.billingDate,
        reference: '',
        totalNetValue: billingData.itemOverview.totalNetValue,
        totalTaxValue: billingData.itemOverview.totalTaxValue,
        totalGrossValue: billingData.itemOverview.totalGrossValue,
        items: billingData.itemOverview.items
      };
      
      res.json({
        success: true,
        data: {
          content: {
            id: billingData.meta.id
          },
          message: `Billing document ${billingData.meta.id} updated successfully`
        }
      });
    }
  } catch (error) {
    console.error('Error in billing edit:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// 搜索开票凭证
router.post('/search', (req, res) => {
  try {
    const { query } = req.body;
    
    console.log('Billing search request:', req.body);
    
    let results = mockBillingDocuments;
    
    if (query) {
      results = results.filter(doc => 
        doc.billingDocument.toLowerCase().includes(query.toLowerCase()) ||
        doc.soldToParty.toLowerCase().includes(query.toLowerCase()) ||
        doc.reference.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: {
        results: results.map(doc => ({
          id: doc.id,
          billingDocument: doc.billingDocument,
          soldToParty: doc.soldToParty,
          netValue: doc.netValue,
          currency: doc.currency,
          billingDate: doc.billingDate,
          reference: doc.reference
        }))
      }
    });
  } catch (error) {
    console.error('Error in billing search:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;