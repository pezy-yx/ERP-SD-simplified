const express = require('express');
const router = express.Router();

// Mock数据
const mockBillingDocuments = [
  {
    type: 'Invoice',
    id: 'BD001',
    payer: 'C001 - ABC Company',
    netValue: '1500.00',
    netValueUnit: 'USD',
    billingDate: '2024-01-15',
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
  },
  {
    type: 'Invoice',
    id: 'BD002',
    payer: 'C002 - XYZ Corp',
    netValue: '2500.00',
    netValueUnit: 'EUR',
    billingDate: '2024-01-20',
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
];

// 初始化开票到期清单
router.post('/initialize', (req, res) => {
  try {
    const { billingDate, soldToParty } = req.body.billingDueList || {};

    console.log('Billing initialize request:', req.body);

    // 返回第一个开票凭证的数据作为初始化模板
    const templateDoc = mockBillingDocuments[0];

    const billingData = {
      meta: {
        id: ''
      },
      basicInfo: {
        type: templateDoc.type,
        id: '',
        netValue: '0.00',
        netValueUnit: templateDoc.netValueUnit,
        payer: soldToParty || templateDoc.payer,
        billingDate: billingDate || templateDoc.billingDate
      },
      itemOverview: {
        items: templateDoc.items.map((item) => ({
          item: item.item,
          material: item.material,
          orderQuantity: item.orderQuantity,
          orderQuantityUnit: item.orderQuantityUnit,
          description: item.description,
          reqDelivDate: item.reqDelivDate,
          netValue: item.netValue,
          netValueUnit: item.netValueUnit,
          taxValue: item.taxValue,
          taxValueUnit: item.taxValueUnit,
          pricingDate: item.pricingDate,
          orderProbability: item.orderProbability,
          pricingElements: item.pricingElements
        }))
      }
    };

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
      doc.id === billingDocumentId
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
        type: billingDoc.type,
        id: billingDoc.id,
        netValue: billingDoc.netValue,
        netValueUnit: billingDoc.netValueUnit,
        payer: billingDoc.payer,
        billingDate: billingDoc.billingDate
      },
      itemOverview: {
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
        type: billingData.basicInfo.type,
        id: newId,
        payer: billingData.basicInfo.payer,
        netValue: billingData.basicInfo.netValue,
        netValueUnit: billingData.basicInfo.netValueUnit,
        billingDate: billingData.basicInfo.billingDate,
        items: billingData.itemOverview.items
      };

      mockBillingDocuments.push(newBillingDoc);
      
      // 返回完整的创建后数据
      const createdBillingData = {
        meta: {
          id: newId
        },
        basicInfo: {
          type: newBillingDoc.type,
          id: newId,
          netValue: newBillingDoc.netValue,
          netValueUnit: newBillingDoc.netValueUnit,
          payer: newBillingDoc.payer,
          billingDate: newBillingDoc.billingDate
        },
        itemOverview: {
          items: newBillingDoc.items
        }
      };

      res.json({
        success: true,
        data: {
          content: createdBillingData,
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
        type: billingData.basicInfo.type,
        payer: billingData.basicInfo.payer,
        netValue: billingData.basicInfo.netValue,
        netValueUnit: billingData.basicInfo.netValueUnit,
        billingDate: billingData.basicInfo.billingDate,
        items: billingData.itemOverview.items
      };
      
      // 返回完整的更新后数据
      const updatedBillingData = {
        meta: {
          id: billingData.meta.id
        },
        basicInfo: {
          type: mockBillingDocuments[existingIndex].type,
          id: mockBillingDocuments[existingIndex].id,
          netValue: mockBillingDocuments[existingIndex].netValue,
          netValueUnit: mockBillingDocuments[existingIndex].netValueUnit,
          payer: mockBillingDocuments[existingIndex].payer,
          billingDate: mockBillingDocuments[existingIndex].billingDate
        },
        itemOverview: {
          items: mockBillingDocuments[existingIndex].items
        }
      };

      res.json({
        success: true,
        data: {
          content: updatedBillingData,
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
        doc.id.toLowerCase().includes(query.toLowerCase()) ||
        doc.payer.toLowerCase().includes(query.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: {
        results: results.map(doc => ({
          result: doc.id,
          soldToParty: doc.payer,
          netValue: doc.netValue,
          currency: doc.netValueUnit
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