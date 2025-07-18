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
            data : 
            {
                quotationData: mockQuotationData    
            }
        };

    console.log(`返回quotation成功`);
    res.json(response);
})

router.post('/create-quotation-from-inquiry', (req, res) => {
    console.log('接收到根据 Inquiry 创建报价单的请求:', req.body);
    const { inquiryId } = req.body;

    if (!inquiryId) {
        return res.status(400).json({
            success: false,
            message: 'Inquiry ID 是必需的。'
        });
    }

    // --- 模拟根据 Inquiry ID 获取数据并创建报价单的逻辑 ---
    // 在真实场景中，这里会涉及到：
    // 1. 调用其他服务或数据库查询 inquiryId 对应的询价单详情
    // 2. 将询价单数据（例如物料、数量、客户信息等）映射到报价单数据结构
    // 3. 生成新的报价单ID
    // 4. 将新生成的报价单保存到数据库

    // 假设的询价单数据，通常会从数据库中根据 inquiryId 查询得到
    const mockInquiryData = {
        inquiryId: inquiryId,
        customerName: 'Sample Customer for ' + inquiryId,
        materialRequests: [
            { material: 'MAT-A01', quantity: '50', unit: 'EA', description: 'Inquiry Item A' },
            { material: 'MAT-B02', quantity: '20', unit: 'PC', description: 'Inquiry Item B' }
        ]
    };

    // 模拟生成一个新的报价单ID
    const newQuotationId = `QUO-INQ-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
    const newCustomerReference = `INQ-REF-${inquiryId}`;

    // 模拟创建报价单的完整数据结构
    const newQuotationData = {
        meta: {
            id: newQuotationId
        },
        basicInfo: {
            quotation: newQuotationId,
            soldToParty: mockInquiryData.customerName, // 从询价单获取客户信息
            shipToParty: 'SHIP-99999', // 假设默认
            customerReference: newCustomerReference, // 可以关联到询价单ID
            netValue: 0, // 初始为0，可能需要根据items计算
            netValueUnit: 'USD',
            customerReferenceDate: new Date().toISOString().slice(0, 10)
        },
        itemOverview: {
            validFrom: new Date().toISOString().slice(0, 10),
            validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
            reqDelivDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 10),
            expectOralVal: '0.00',
            expectOralValUnit: 'USD',
            items: mockInquiryData.materialRequests.map((req, index) => ({
                item: (index + 1) * 10 + '',
                material: req.material,
                orderQuantity: req.quantity,
                orderQuantityUnit: req.unit,
                description: req.description,
                su: 0, // 初始值，可能需要计算
                altItm: index + 1
            }))
        }
    };

    // 在实际应用中，这里应该把 newQuotationData 保存到数据库

    res.json({
        success: true,
        message: `根据 Inquiry ${inquiryId} 成功创建报价单 ${newQuotationId}`,
        data: {
            quotationData: newQuotationData // 返回新生成的报价单完整数据 (可选)
        }
    });
});

// ... (您现有的 router.post('quotation/items-tab-query', ...) 等其他路由) ...

router.post('/items-tab-query',(req,res) =>{
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
})

module.exports = router;