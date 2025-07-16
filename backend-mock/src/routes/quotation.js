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
    console.log('Received update data:', req.body);
    const responseData = {
        success: true,
        message: 'Quotation updated successfully.'
    };
    res.json(responseData);
});

// 销售报价单详情页 - 新的 Mock API
router.get('/details/:id', (req, res) => {
    try {
        const quotationId = parseInt(req.params.id, 10);
        console.log(`Received request for quotation details with ID: ${quotationId}`);

        // 从伪数据中查找匹配的报价单
        const foundQuotation = fakeQuotationData.currentValue.find(q => q.salesQuotation === quotationId);

        if (foundQuotation) {
            // 找到后，构建一个完整的 NodeStructure 对象返回
            const responseData = {
                varType: 'dict',
                nodeType: 'dict',
                name: 'quotation',
                isEditable: true, // 详情页通常是可编辑的
                currentValue: foundQuotation,
                children: fakeQuotationData.children // 沿用之前定义的结构
            };

            res.json({
                success: true,
                data: {
                    quotationStruct: responseData
                }
            });
        } else {
            // 如果未找到，返回失败信息
            res.status(404).json({
                success: false,
                message: `Quotation with ID ${quotationId} not found.`
            });
        }
    } catch (error) {
        console.error('Quotation details API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve quotation details.',
            error: error.message
        });
    }
});

module.exports = router;