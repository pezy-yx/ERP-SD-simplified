const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'ERP Backend API is running!' });
});

// API路由
app.use('/api/search', require('./routes/search'));
app.use('/api/app', require('./routes/app'));
app.use('/api/employee', require('./routes/employee'));
app.use('/api/quotation', require('./routes/quotation'));
app.use('/api/so', require('./routes/so'));
app.use('/api/bp', require('./routes/bp'));
app.use('/api/app/billing', require('./routes/billing'));
app.use('/api/material', require('./routes/material'));

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 API documentation available at http://localhost:${PORT}/api`);
});

module.exports = app;