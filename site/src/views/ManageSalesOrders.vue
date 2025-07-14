<template>
  <div class="manage-sales-orders-view">

    <div class="page-content">
      <!-- 查询区域，现在使用 VarBox 绑定 tree -->
       
      <div class="sales-order-search">
        <VarBox
          :tree="salesOrderQueryTree"
          class="sales-order-query-varbox"
        />
        
        <div class="go-button-container">
          <button class="search-enter-button go-button" @click="performSalesOrderSearch">Go</button>
        </div>
      </div>

      <!-- 输出区域 -->
      <div class="sales-order-output">
        <h2>Output</h2>
        <!-- 这里将是销售订单查询结果的展示区域 -->
      </div>
    </div>

    <!-- 底部操作按钮，复用 bottom-actions 和 search-enter-button 样式 -->
    <div class="bottom-actions">
      <button class="search-enter-button create-sales-order-button" @click="createSalesOrder">Create Sales Order</button>
    </div>
  </div>
</template>

<script>
// 导入必要的组件和 VarTree 工具函数
import NavigationBar from '@/components/NavigationBar.vue';
import VarBox from '../components/varbox/VarBox.vue'; // 确保 VarBox 路径正确
import { createTreeFromConfig, cns } from '@/utils/VarTree';
import { bpSearch } from '@/utils/searchMethods'; // 假设 bpSearch 可用于 Sales Order 和 Sold-To Party

// -----------------------------------------------------------
// 定义销售订单查询的 VarTree 结构
// -----------------------------------------------------------
const salesOrderQueryStructure = cns(
  "dict", "dict", "salesOrderQuery", null, false, { hideLabel: true }, 
  [
    // Sales Order
    cns("string", "leaf", "salesOrder", '', false, { searchMethods: bpSearch }, [], "Sales Order:"),
    // Overall Status
    cns("string", "leaf", "overallStatus", '', false, {searchMethods: bpSearch}, [], "Overall Status:"),
    // Sold-To Party
    cns("string", "leaf", "soldToParty", '', false, { searchMethods: bpSearch }, [], "Sold-To Party:"),
    // Customer Reference
    cns("string", "leaf", "customerReference", '', false, {searchMethods: bpSearch}, [], "Customer Reference:"),//暂时都用一个搜索方式，后面再改
  ]
);

export default {
  name: 'ManageSalesOrdersView',
  components: {
    NavigationBar,
    VarBox,
  },
  data() {
    return {
      // 创建销售订单查询的 VarTree 实例
      salesOrderQueryTree: createTreeFromConfig(salesOrderQueryStructure),
      // salesOrdersResult: [], // 用于存储查询结果，暂时不需要
    };
  },
  methods: {
    handleGlobalSearch() {
      console.log('Global search triggered from NavigationBar');
    },
    performSalesOrderSearch() {
      // 获取 VarTree 中的当前值
      const queryData = this.salesOrderQueryTree.root?.currentValue;
      console.log('执行销售订单查询，提交数据:', JSON.stringify(queryData, null, 2));
      // 这里可以添加实际的 API 调用逻辑
    },
    createSalesOrder() {
      console.log('创建销售订单');
      // 这里可以添加跳转到创建页面或打开模态框的逻辑
    }
  }
};
</script>

<style scoped>
/* 继承 MaintainBusinessPartnerView.vue 的通用布局和颜色 */
.manage-sales-orders-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #25484C; /* 主背景色 */
  width: 100%;
}

.page-content {
  flex-grow: 1;
  background-color: #e6e5d8; /* 页面内容区域背景色 */
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px; /* 调整顶部内边距 */
  gap: 20px; /* 增加内容块之间的间距 */
}

/* 销售订单查询区域样式，基于 business-partner-search 调整 */
.sales-order-search {
  display: flex;
  flex-direction: column; /* VarBox 默认垂直布局其子项 */
  align-items: flex-start;
  background-color: transparent; /* 查询区域背景色 */
  width: 100%;
  box-sizing: border-box;
  gap: 0px; /* VarBox 内部的字典项之间会用到这个 gap */
}

:deep(.salesOrderQuery-salesOrder--wrapper) {
    grid-row: 1;
}
:deep(.salesOrderQuery-overallStatus--wrapper) { 
    grid-row: 1;
}
:deep(.salesOrderQuery-soldToParty--wrapper) { 
    grid-row: 1;
}
:deep(.salesOrderQuery-customerReference--wrapper) { 
    grid-row: 1;
}


/* 复用 MaintainBusinessPartnerView 中的 input-with-icon 样式 */
.input-with-icon {
  display: flex;
  width: 100%;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-with-icon:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 复用 bp-input 样式，应用于 VarBox 内部的实际 input */
.sales-order-query-varbox :deep(.var-input--main input) {
  flex-grow: 1;
  padding: 12px 15px;
  border: none;
  outline: none;
  font-size: 1em;
  color: #333;
  background-color: transparent;
  box-sizing: border-box;
}

/* 复用 bp-search-button 样式，应用于 VarBox 内部的搜索按钮 */
.sales-order-query-varbox :deep(.bp-search-button) {
  background-color: transparent;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.sales-order-query-varbox :deep(.bp-search-button:hover) {
  background-color: #f5f7fa;
  border-radius: 4px;
}

.sales-order-query-varbox :deep(.search-icon) {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

/* Go 按钮容器 */
.go-button-container {
  width: 80px;
  height: 40px;
  display: flex;
  align-self:flex-end;
  background-color: #25484C;
  margin-top: 10px; /* 与上方输入框的间距 */
  transition: background-color 0.3s ease;
  color: #e6e5d8;
  font-weight: bold;
  justify-content: center;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
}

.go-button-container:hover {
    background-color: #25584C;
}

.go-button {
  font-size: 1.0em;
  text-align: center;
}

/* 输出区域样式 */
.sales-order-output {
  width: 80%;
  max-width: 800px; /* 与查询区域宽度保持一致 */
  background-color: #ffffff; /* 输出区域背景色 */
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-height: 200px; /* 最小高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #25484C;
  font-size: 1.5em;
  font-weight: bold;
}

/* 底部操作按钮区域，复用 MaintainBusinessPartnerView 的样式 */
.bottom-actions {
  display: flex;
  justify-content: flex-end; /* 靠右对齐 */
  padding: 40px 20px;
  background-color: #25484c;
}

/* 底部创建按钮，复用 search-enter-button 样式 */
.create-sales-order-button {
  background-color: #e6e5d8;
  color: #25484c;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-sales-order-button:hover {
  background-color: #d1d0c4;
}
</style>