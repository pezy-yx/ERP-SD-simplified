const express = require('express');
const router = express.Router();

const mockSalesOrders = [
  {
    so_id: 'SO001', // 销售订单ID (自增) - 对应 Sales Order:
    quote_id: 1001, // 报价单ID
    customer_no: 200001, // 客户编号 - 对应 Sold-To Party:
    contact_id: 3001, // 联系人ID
    doc_date: '2024-07-01', // 单据日期
    req_delivery_date: '2024-07-15', // 要求交货日期
    currency: 'CNY', // 货币
    net_value: 13000.00, // 净值
    tax_value: 2000.00, // 税额
    gross_value: 15000.00, // 总金额
    incoterms: 'FOB', // 国际贸易术语
    payment_terms: 'NET30', // 付款条件
    status: 'Open', // 状态 - 对应 Overall Status:
    customer_reference: 'PO-HW-001' // 客户参考 - 对应 Customer Reference:
  },
  {
    so_id: 'SO002',
    quote_id: 1002,
    customer_no: 200002,
    contact_id: 3002,
    doc_date: '2024-07-05',
    req_delivery_date: '2024-07-20',
    currency: 'USD',
    net_value: 8000.00,
    tax_value: 999.00,
    gross_value: 8999.00,
    incoterms: 'CIF',
    payment_terms: 'COD',
    status: 'In Progress',
    customer_reference: 'PO-TX-002'
  },
  {
    so_id: 'SO003',
    quote_id: 1003,
    customer_no: 200001,
    contact_id: 3001,
    doc_date: '2024-06-20',
    req_delivery_date: '2024-07-01',
    currency: 'CNY',
    net_value: 2000.00,
    tax_value: 499.00,
    gross_value: 2499.00,
    incoterms: 'EXW',
    payment_terms: 'NET60',
    status: 'Completed',
    customer_reference: 'PO-HW-002'
  },
  {
    so_id: 'SO004',
    quote_id: 1004,
    customer_no: 200004,
    contact_id: 3004,
    doc_date: '2024-07-10',
    req_delivery_date: '2024-07-25',
    currency: 'CNY',
    net_value: 3500.00,
    tax_value: 499.00,
    gross_value: 3999.00,
    incoterms: 'DAP',
    payment_terms: 'NET30',
    status: 'Open',
    customer_reference: 'PO-BYD-001'
  },
  {
    so_id: 'SO005',
    quote_id: 1005,
    customer_no: 200005,
    contact_id: 3005,
    doc_date: '2024-07-12',
    req_delivery_date: '2024-07-28',
    currency: 'CNY',
    net_value: 0.00,
    tax_value: 0.00,
    gross_value: 0.00,
    incoterms: 'EXW',
    payment_terms: 'NET30',
    status: 'New',
    customer_reference: 'PO-ZTE-001'
  }
];

// 销售订单搜索 - Mock API
router.post('/search', (req, res) => {
  try {
    const { salesOrder, overallStatus, soldToParty, customerReference } = req.body;
    
    console.log('Sales Order Search Params:', req.body);
    
    // 初始化 results 为所有订单，然后逐个应用筛选条件
    let results = [...mockSalesOrders]; // 每次请求都从完整的模拟数据开始

    // Filter by Sales Order ID (so_id)
    if (salesOrder && salesOrder.trim()) {
      const searchSoId = salesOrder.toLowerCase();
      results = results.filter(order => 
        order.so_id.toLowerCase().includes(searchSoId)
      );
    }
    
    // Filter by Overall Status (status)
    if (overallStatus && overallStatus.trim()) {
      const searchStatus = overallStatus.toLowerCase();
      results = results.filter(order => 
        order.status.toLowerCase() === searchStatus // 这里使用 === 进行精确匹配
      );
    }
    
    // Filter by Sold-To Party (customer_no)
    if (soldToParty && soldToParty.trim()) {
      const searchCustomerNo = soldToParty.toLowerCase();
      results = results.filter(order => 
        String(order.customer_no).includes(searchCustomerNo)
      );
    }
    
    // Filter by Customer Reference (customer_reference)
    if (customerReference && customerReference.trim()) {
      const searchCustomerRef = customerReference.toLowerCase();
      results = results.filter(order => 
        order.customer_reference.toLowerCase().includes(searchCustomerRef)
      );
    }
    
    // ... (rest of the code for formatting and sending response) ...
    const formattedResults = results.map(order => ({
      id: order.so_id, 
      result: order.so_id, 
      description: `Status: ${order.status} | Customer No: ${order.customer_no} | Ref: ${order.customer_reference} | Total: ${order.gross_value} ${order.currency}`,
      ...order 
    }));
    
    res.json({
      success: true,
      data: formattedResults,
      total: formattedResults.length,
      message: `Found ${formattedResults.length} sales orders.`
    });
    
  } catch (error) {
    console.error('Sales Order Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Sales order search failed, please try again later.',
      error: error.message
    });
  }
});

module.exports = router;