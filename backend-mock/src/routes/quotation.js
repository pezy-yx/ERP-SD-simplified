const express = require('express');
const router = express.Router();

const fakeQuotationData = {
    varType: 'dict',
    nodeType: 'dict',
    name: 'quotation',
    currentValue: [ 
        {
            salesQuotation: 987654321,
            soldToParty: 'Global Corp Inc.',
            customerReference: 'PO-XYZ-789',
            overallStatus: 'In Process',
            latestExpiration: '2025-12-31'
        },
        {
            salesQuotation: 100000001,
            soldToParty: 'ACME Ltd.',
            customerReference: 'REF-ACME-001',
            overallStatus: 'New',
            latestExpiration: '2025-07-20'
        },
        {
            salesQuotation: 100000002,
            soldToParty: 'Tech Solutions Inc.',
            customerReference: 'TS-998',
            overallStatus: 'Open',
            latestExpiration: '2025-08-15'
        },
        {
            salesQuotation: 100000003,
            soldToParty: 'Innovate Co.',
            customerReference: 'INV-A-123',
            overallStatus: 'Completed',
            latestExpiration: '2025-06-01'
        },
        {
            salesQuotation: 100000004,
            soldToParty: 'ACME Ltd.',
            customerReference: 'REF-ACME-002',
            overallStatus: 'In Process',
            latestExpiration: '2025-09-01'
        }
    ],
    config: {},
    isEditable: false,
    children: [
        {
            varType: 'number',
            nodeType: 'leaf',
            name: 'salesQuotation',
            isEditable: false
        },
        {
            varType: 'string',
            nodeType: 'leaf',
            name: 'soldToParty',
            isEditable: true
        },
        {
            varType: 'string',
            nodeType: 'leaf',
            name: 'customerReference',
            isEditable: false
        },
        {
            varType: 'selection',
            nodeType: 'leaf',
            name: 'overallStatus',
            isEditable: true,
            config: {
                options: ['New', 'Open', 'In Process', 'Completed']
            }
        },
        {
            varType: 'date',
            nodeType: 'leaf',
            name: 'latestExpiration',
            isEditable: false
        }
    ]
};

// ... (其他路由代码保持不变)

router.post('/search', (req, res) => {
    try {
        const { salesQuotation, overallStatus, soldToParty, customerReference } = req.body;
        
        console.log('Quotation Search Params:', req.body);
        
        // 每次搜索都从完整的模拟数据开始
        let results = [...fakeQuotationData.currentValue];

        // 筛选：销售报价单号 (salesQuotation)
        if (salesQuotation) {
            results = results.filter(quotation =>
                String(quotation.salesQuotation).includes(String(salesQuotation))
            );
        }
        
        // 筛选：总体状态 (overallStatus)
        if (overallStatus && overallStatus.trim()) {
            results = results.filter(quotation =>
                quotation.overallStatus.toLowerCase() === overallStatus.toLowerCase()
            );
        }
        
        // 筛选：客户 (soldToParty)
        if (soldToParty && soldToParty.trim()) {
            results = results.filter(quotation =>
                quotation.soldToParty.toLowerCase().includes(soldToParty.toLowerCase())
            );
        }
        
        // 筛选：客户参考号 (customerReference)
        if (customerReference && customerReference.trim()) {
            results = results.filter(quotation =>
                quotation.customerReference.toLowerCase().includes(customerReference.toLowerCase())
            );
        }

        // 构造返回的响应
        const finalResponseData = {
            ...fakeQuotationData,
            currentValue: results,
            children: fakeQuotationData.children // 保持子节点结构不变
        };
        
        const response = {
            success: true,
            data: {
                quotationStruct: finalResponseData
            }
        };

        console.log(`Found ${results.length} matching quotations.`);
        res.json(response);
        
    } catch (error) {
        console.error('Quotation Search Error:', error);
        res.status(500).json({
            success: false,
            message: 'Quotation search failed, please try again later.',
            error: error.message
        });
    }
});

router.post('/update', (req, res) => {
    console.log('要更新啦', req.body);
    const mockData = {
        meta: {
        id: 'QUO-2024-001'
        },
        basicInfo: {
        quotation: '114514',
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
    }

    res.json({
        success:true,
        message:"创建新的quotation成功",
        data:{
            quotationData:mockData
        }
    })
});

router.post('/create',(req,res) =>{
    console.log('创建新的quotation',req.body);

    const mockData = {
        meta: {
        id: 'QUO-2024-001'
        },
        basicInfo: {
        quotation: 'QUO-2024-001',
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
    }

    res.json({
        success:true,
        message:"创建新的quotation成功",
        data:{
            quotationData:mockData
        }
    })
})

router.post('/details', (req, res) => {
    // 直接返回成功
    console.log('初始化quotation:', req.body);
    
    const mockQuotationData = {
        meta: {
        id: 'QUO-2024-001'
        },
        basicInfo: {
        quotation: 'QUO-2024-001',
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
        
    const response = {
            success: true,
            message: '初始quotation成功',
            data : {
            quotationData: mockQuotationData
                }
        };

    console.log(`返回quotation成功`);
    res.json(response);
})

module.exports = router;