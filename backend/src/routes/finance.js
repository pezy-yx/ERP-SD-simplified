const express = require('express');
const router = express.Router();

// 假数据列表 - 更新为新的 OpenItem 结构
const mockOpenItems = [
    {
        companyCode: '1000',
        account: 'CUST-1001',
        journalEntry: 'JE-CUST-001',
        journalEntryType: 'DR(Customer Invoice)',
        journalEntryDate: '2024-07-01',
        netDueDate: '2024-07-31',
        amount: 1500.00,
        assignment: 'INV-A123'
    },
    {
        companyCode: '1000',
        account: 'CUST-1001',
        journalEntry: 'JE-CUST-002',
        journalEntryType: 'DA(Customer Document)',
        journalEntryDate: '2024-07-05',
        netDueDate: '2024-08-04',
        amount: 250.75,
        assignment: 'PAY-B456'
    },
    {
        companyCode: '1000',
        account: 'VEND-2001',
        journalEntry: 'JE-VEND-001',
        journalEntryType: 'KR (Vendor Invoice)',
        journalEntryDate: '2024-06-10',
        netDueDate: '2024-07-10',
        amount: 500.00,
        assignment: 'BILL-X789'
    },
    {
        companyCode: '1000',
        account: 'VEND-2001',
        journalEntry: 'JE-VEND-002',
        journalEntryType: 'KA(Vendor Document)',
        journalEntryDate: '2024-06-20',
        netDueDate: '2024-07-20',
        amount: 75.20,
        assignment: 'REC-Y101'
    },
    {
        companyCode: '2000',
        account: 'CUST-1002',
        journalEntry: 'JE-CUST-003',
        journalEntryType: 'DR(Customer Invoice)',
        journalEntryDate: '2024-07-15',
        netDueDate: '2024-08-14',
        amount: 3000.00,
        assignment: 'INV-C333'
    },
    {
        companyCode: '2000',
        account: 'VEND-2002',
        journalEntry: 'JE-VEND-003',
        journalEntryType: 'KR (Vendor Invoice)',
        journalEntryDate: '2024-07-10',
        netDueDate: '2024-08-09',
        amount: 1200.00,
        assignment: 'BILL-Z222'
    }
];

const mockJournalEntry = {
    journalEntryId: 'JE-POST',
    companyCode: 'req.body.companyCode',
    account: "req.body.account",
    journalEntryType: "req.body.journalEntryType",
    journalEntryDate: "req.body.journalEntryDate",
    postingDate: new Date().toISOString().split('T')[0], // 使用当前日期
    postingPeriod: '07/2025', // 假设为2024年7月
    amount: "req.body.amount",
    assignment: "req.body.assignment",
    currency: 'EUR', // 默认货币为EUR
    createdBy: 'system', // 模拟创建人
    lineItems: {
        item1:{
            postingViewItem:'US00',
            glAccount:'25069',
            credit:'0',
            debit:'6600',
            currency:'EUR',
        },
        item2:{
            postingViewItem:'US00',
            glAccount:'25069',
            credit:'6600',
            debit:'0',
            currency:'EUR',
        }
    }
};


// 新增的 /searchOpenItems 接口
router.post('/searchOpenItems', (req, res) => {
    console.log('收到前端查询请求:', req.body);

    const { openItemSelection, generalInformation, bankData } = req.body;
    const { accountType, accountId } = openItemSelection || {}; // accountType 是 Customer/Vendor, accountId 是具体ID
    const companyCode = generalInformation?.['Company Code'];

    let filteredItems = [...mockOpenItems]; // 复制一份假数据

    // 根据 Company Code 过滤
    if (companyCode) {
        filteredItems = filteredItems.filter(item => item.companyCode === companyCode);
    }

    // 根据 accountType 和 accountId 过滤假数据
    // 注意：mockOpenItems 中没有直接的 accountType 字段，我们根据 account 字段的格式模拟判断
    // 假设以 'CUST-' 开头的 account 是 Customer 类型，以 'VEND-' 开头的是 Vendor 类型
    if (accountType === 'Customer') {
        filteredItems = filteredItems.filter(item => item.account.startsWith('CUST-'));
    } else if (accountType === 'Vendor') {
        filteredItems = filteredItems.filter(item => item.account.startsWith('VEND-'));
    }

    if (accountId) {
        filteredItems = filteredItems.filter(item => item.account === accountId);
    }
    
    // 模拟计算总余额
    let totalBalance = 0;
    let balanceUnit = bankData?.amount?.unit || 'EUR'; // 使用bankData中的单位，默认为EUR

    if (filteredItems.length > 0) {
        // 为了简化，我们假设所有过滤出来的项目的货币单位都是 balanceUnit 定义的，
        // 实际中这里需要复杂的货币转换逻辑
        // 如果想让 balanceUnit 动态取决于第一个找到的项，可以这样：
        // balanceUnit = filteredItems[0].currency || balanceUnit; 
        
        // 由于新的 OpenItem 结构没有 currency 字段，这里直接使用 bankData 中的 unit
        // 或者固定一个单位
        // totalBalance = filteredItems.reduce((sum, item) => sum + item.amount, 0);

        // 如果想模拟不同账户类型的余额
        if (accountType === 'Customer') {
            totalBalance = filteredItems.reduce((sum, item) => sum + item.amount, 0); // 客户应收
        } else if (accountType === 'Vendor') {
            totalBalance = filteredItems.reduce((sum, item) => sum - item.amount, 0); // 供应商应付，模拟为负数
        } else {
            totalBalance = filteredItems.reduce((sum, item) => sum + item.amount, 0);
        }
        
    }

    // 模拟异步请求的延迟
    setTimeout(() => {
        if (filteredItems.length > 0) {
            res.json({
                success: true,
                message: '成功找到未清项',
                data: {
                    balance: totalBalance.toFixed(2), // 格式化为两位小数
                    balanceUnit: balanceUnit, // 这里使用从前端传入的单位
                    openItems: filteredItems.map(item => ({ // 确保返回的字段与前端 OpenItem 接口完全匹配
                        companyCode: item.companyCode,
                        account: item.account,
                        journalEntry: item.journalEntry,
                        journalEntryType: item.journalEntryType,
                        journalEntryDate: item.journalEntryDate,
                        netDueDate: item.netDueDate,
                        amount: item.amount,
                        assignment: item.assignment,
                    }))
                }
            });
        } else {
            // 没有找到匹配项
            res.json({
                success: true,
                message: '未找到匹配的未清项',
                data: {
                    balance: 0,
                    balanceUnit: bankData?.amount?.unit || 'EUR', 
                    openItems: []
                }
            });
        }
    }, 500); // 模拟500毫秒的网络延迟
});

router.post('/postOpenItems', (req, res) => {
    console.log('收到前端提交请求:', req.body);

    // 这里可以添加逻辑来处理前端提交的未清项数据
    // 例如保存到数据库或进行其他处理
    // 模拟成功响应
    setTimeout(() => {
        res.json({
            success: true,
            message: '未清项提交成功',
            data: {
                mockJournalEntry: mockJournalEntry // 返回模拟的过账数据
            }
        });
    }, 500); // 模拟500毫秒的网络延迟
});

router.post('/journalEntryDetails', (req, res) => {

    console.log('收到前端请求的 Journal Entry ID:', req.body);
    const journalEntryId = req.body.journalEntryId;

    if (!journalEntryId) {
        return res.status(400).json({
            success: false,
            message: 'Journal Entry ID is required in the request body.'
        });
    }

    // 模拟数据
    if (journalEntryId.startsWith('JE-POST')) { // 确保这里匹配你前端发过来的ID前缀
        // >>> 修改：使用您提供的mockJournalEntry结构 <<<
        const mockJournalEntry = {
            journalEntryId: journalEntryId, // 使用实际请求的ID
            companyCode: '1000', // 这里可以是req.body.companyCode或其他模拟值
            account: "113100", // 模拟值
            journalEntryType: "SA", // 模拟值
            journalEntryDate: "2024-07-28", // 模拟值
            postingDate: new Date().toISOString().split('T')[0], // 使用当前日期
            postingPeriod: '07/2025', // 假设为2025年7月
            amount: "6600.00", // 模拟值，如果实际是数字，请注意类型
            assignment: "ABC-123", // 模拟值
            currency: 'EUR', // 默认货币为EUR
            createdBy: 'system', // 模拟创建人
            lineItems: { // lineItems 现在是对象
                item1:{
                    postingViewItem:'US00',
                    glAccount:'25069',
                    credit:'0.00',
                    debit:'6600.00',
                    currency:'EUR',
                },
                item2:{
                    postingViewItem:'US00',
                    glAccount:'25069',
                    credit:'6600.00',
                    debit:'0.00',
                    currency:'EUR',
                }
            }
        };

        res.json({
            success: true,
            message: 'Journal Entry details fetched successfully.',
            data: mockJournalEntry
        });
        // >>> 修改结束 <<<
    } else {
        res.status(404).json({
            success: false,
            message: `Journal Entry with ID ${journalEntryId} not found.`,
            data: null
        });
    }
});

module.exports = router;