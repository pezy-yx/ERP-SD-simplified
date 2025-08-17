清账未清项App管理前后端接口文档
概述
本文档旨在详细描述前端与后端交互的 API 接口。所有接口均采用 POST 方法，请求和响应的数据格式均为 application/json。

通用响应结构
所有接口的成功响应都包含 success 字段指示操作结果，以及一个 data 字段承载具体业务数据。错误响应则包含 success: false 和 message 字段。

// 成功响应示例
{
    "success": true,
    "message": "操作成功信息", // 可选
    "data": {
        // 具体业务数据
    }
}

// 错误响应示例
{
    "success": false,
    "message": "错误信息"
}

接口详情

1. 搜索未清项
   URL: /api/finance/searchOpenItems

方法: POST

用途: 根据筛选条件搜索某公司的未清项

请求体 (Request Body):

Content-Type: application/json

{
    generalInformation：{
        companyCode:"string",
        journalEntryDate:'string',
        journalEntryType:'string',
        period:'string',
        postingDate:'string'
    },
    bankData:{
        G/LAccount:'string',
        amount:{
            amount:'float',
            unit:'string'
        }
    },
    openItemSelection:{
        accountID:'float',
        accountType:'string'//只有customer和vendor
    }
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message":'find open items successfully'
    "data": {
        balance:'string', // 示例:'5203.25'
        balanceUnit:'string', // 示例:'EUR'
        openItems:[
            {
                account:"string",
                amount:'float',
                assignment:"string",
                companyCode:"string",
                journalEntry:"string",
                journalEntryDate:"string",//date
                journalEntryType:"string"//固定的，找前端
                netDueDate:"string"//date
            },
            ...
        ]
    }
}

若不理解openItem里的意思，可以参考以下这个示例，自己去数据库结构里找到合适的返回
{
    "success": true,
    "message": "成功找到未清项",
    "data": {
        "balance": "6525.95",
        "balanceUnit": "EUR",
        "openItems": [
            {
                "companyCode": "1000",
                "account": "CUST-1001",
                "journalEntry": "JE-CUST-001",
                "journalEntryType": "DR(Customer Invoice)",
                "journalEntryDate": "2024/07/01",
                "netDueDate": "2024/07/31",
                "amount": 1500,
                "assignment": "INV-A123"
            },
            {
                "companyCode": "1000",
                "account": "CUST-1001",
                "journalEntry": "JE-CUST-002",
                "journalEntryType": "DA(Customer Document)",
                "journalEntryDate": "2024/07/05",
                "netDueDate": "2024/08/04",
                "amount": 250.75,
                "assignment": "PAY-B456"
            }
        ]
    }
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "failed to find matched open items",
    "error": "错误信息" // 后端返回的具体错误信息
}

2. 过账未清项（posting open items）
   URL: /api/finance/postOpenItems

方法: Post

用途: 将前端选中的未清项过账

请求体 (Request Body): (POST)

Content-Type: application/json

[
    {
        account:"string",
        amount:'float',
        assignment:"string",
        companyCode:"string",
        journalEntry:"string",
        journalEntryDate:"string",//date
        journalEntryType:"string"//固定的，找前端
        netDueDate:"string"//date
        selected: 'boolean' // 可能没啥用，自己看着办
    },
    ...
]

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message":"post open items successfully"
    "data": {
        JournalEntry:{
                journalEntryId: 'string',
                companyCode: 'string', // 可以用"req.body.companyCode"
                account: "string", // 可以用"req.body.account"
                journalEntryType: "string", // 可以用"req.body.journalEntryType"
                journalEntryDate: "string", // 可以用"req.body.journalEntryDate"
                postingDate: "string"//使用当前的日期 "2025/08/07"
                postingPeriod: 'string', // 当前的会计周期 like "08/2025"
                amount: "string", // 可以用"req.body.account"
                assignment: "string", // 可以用"req.body.assignment"
                currency: 'string', // like "EUR"
                createdBy: 'string', // 创建人，就"system"也行
                lineItems: {
                    item1:{
                        postingViewItem:'string',
                        glAccount:'string',
                        credit:'string', // 数字字符串
                        debit:'string', // 数字字符串
                        currency:'string',
                    },
                    item2:{
                        postingViewItem:'string',
                        glAccount:'string',
                        credit:'string', // 数字字符串
                        debit:'string', // 数字字符串
                        currency:'string',
                    },
                    ...
                }
        }
    }
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Failed to post." // 或其他错误信息
}

3. 查看日记账细节（check journal entry details）
   URL: /api/finance/journalEntryDetails

方法: Post

用途: 查看一下自动生成的日记账的细节

请求体 (Request Body): (如果使用 POST)

Content-Type: application/json

{
    journalEntryId:'string'
}

成功响应 (Success Response):

Content-Type: application/json

{
    "success": true,
    "message":"Journal Entry details fetched successfully."
    "data": {
        journalEntryId: 'string',
        companyCode: 'string',
        account: "string",
        journalEntryType: "string",
        journalEntryDate: "string",//date
        postingDate: "string"//使用当前的日期
        postingPeriod: 'string', // 当前的会计周期
        amount: "string",
        assignment: "string",
        currency: 'string', 
        createdBy: 'string', // 创建人
        lineItems: {
            item1:{
                postingViewItem:'string',
                glAccount:'string',
                credit:'float',
                debit:'float',
                currency:'string',
            },
            item2:{
                postingViewItem:'string',
                glAccount:'string',
                credit:'float',
                debit:'float',
                currency:'string',
            },
            ...
        }
    }   
}

错误响应 (Error Response):

Content-Type: application/json

{
    "success": false,
    "message": "Failed to check." // 或其他错误信息
}