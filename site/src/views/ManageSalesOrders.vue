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
        <!-- 这里将是销售订单查询结果的展示区域 -->
        <div v-if="searchPerformed && salesOrdersResult && salesOrdersResult.length > 0" class="query-results-list">
          <div class="sales-order-rows-container">
            <!-- Header Row (optional, or style the first row as header if needed) -->
            <div class="sales-order-row-header">
                <div class="header-item sales-order-id">Sales Order</div>
                <div class="header-item sold-to-party">Sold-To Party</div>
                <div class="header-item customer-reference">Customer Reference</div>
                <div class="header-item req-delivery-date">Requested Delivery Date</div>
                <div class="header-item overall-status">Overall Status</div>
                <div class="header-item net-value">Net Value</div>
                <div class="header-item doc-date ">Document Date</div>
                <div class="header-item"></div> <!-- For the arrow -->
            </div>

            <!-- Data Rows -->
            <div v-for="order in salesOrdersResult" :key="order.so_id" class="sales-order-row" @click="viewSalesOrderDetail(order.so_id)">
              <span class="row-item sales-order-id">{{ order.so_id }}</span>
              <span class="row-item sold-to-party">{{ order.soldToPartyName }} ({{ order.customer_no }})</span>
              <span class="row-item customer-reference">{{ order.customer_reference }}</span>
              <span class="row-item req-delivery-date">{{ order.req_delivery_date }}</span>
              <span :class="['row-item overall-status', { 'status-open': order.status === 'Open', 'status-completed': order.status === 'Completed', 'status-in-progress': order.status === 'In Progress', 'status-new': order.status === 'New' }]">
                {{ order.status }}
              </span>
              <span class="row-item net-value">{{ order.net_value }} {{ order.currency }}</span>
              <span class="row-item doc-date">{{ order.doc_date }}</span>
              <span class="row-item arrow-icon">▶</span>
            </div>
          </div>
        </div>
        <div v-else-if="searchPerformed && salesOrdersResult && salesOrdersResult.length === 0" class="no-results">
          <p>No sales orders found matching your criteria.</p>
        </div>
        <div v-else class="initial-output-message">
          <p>Enter query criteria and click "Go" to see results.</p>
        </div>
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
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || ''; 

// -----------------------------------------------------------
// 定义销售订单查询的 VarTree 结构
// -----------------------------------------------------------
const salesOrderQueryStructure = cns(
  "dict", "dict", "salesOrderQuery", null, false, { hideLabel: true }, 
  [
    // Sales Order
    cns("string", "leaf", "so_id", '', false, { searchMethods: bpSearch }, [], "Sales Order:"),
    // Overall Status
    cns("selection", "leaf", "status", '', false, {options:['New','Open','In progress','Completed']}, [], "Overall Status:"),
    // Sold-To Party
    cns("string", "leaf", "customer_no", '', false, { searchMethods: bpSearch }, [], "Sold-To Party:"),
    // Customer Reference
    cns("string", "leaf", "customer_reference", '', false, {searchMethods: bpSearch}, [], "Customer Reference:"),//暂时都用一个搜索方式，后面再改
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
      // Create VarTree instance for sales order query
      salesOrderQueryTree: createTreeFromConfig(salesOrderQueryStructure),
      salesOrdersResult: [], // Property to store query results
      searchPerformed: false, // Flag to indicate if a search has been performed
    };
  },
  methods: {
    handleGlobalSearch() {
      console.log('Global search triggered from NavigationBar');
    },
    async performSalesOrderSearch() { // Make this method async
      console.log('Executing sales order query...');
      const fullUrl = `${API_BASE_URL}/api/so/search`;
      console.log('Attempting to fetch from URL:', fullUrl);
      const queryData = this.salesOrderQueryTree.root?.currentValue;
      console.log('Submitting query data:', JSON.stringify(queryData, null, 2));

      this.searchPerformed = true; 
      this.salesOrdersResult = []; 

      // Example: Call query API
      try {
        const response = await fetch(`${API_BASE_URL}/api/so/search`, { 
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(`HTTP Error ${response.status}: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        console.log('Query result:', result);

        if (result.success && Array.isArray(result.data)) {
          this.salesOrdersResult = result.data; // Store results
        } else {
          console.warn('API response did not contain expected data array:', result);
          this.salesOrdersResult = []; // Ensure it's an empty array if data is not as expected
          alert(`Query successful, but no valid data returned: ${result.message || 'Unknown issue'}`);
        }
      } catch (error) {
        console.error('Sales order query failed:', error);
        this.salesOrdersResult = []; // Clear results on error
        alert(`Sales order query failed: ${error.message || 'Network error'}`);
      }
    },
    // New method to handle clicking on a sales order row
    viewSalesOrderDetail(soId) {
      console.log(`Navigating to sales order detail page for SO ID: ${soId}`);
      alert(`Viewing details for Sales Order: ${soId}`);
    },
    createSalesOrder() {
      console.log('Creating sales order');
      alert('Navigate to Sales Order Creation Page');
    }
  }
};
</script>

<style scoped>
/* Inherited general layout and colors from _base.css and MaintainBusinessPartnerView.vue */
.manage-sales-orders-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--theme-color-dark); /* Using global variable */
  width: 100%;
}

.page-content {
  flex-grow: 1;
  background-color: var(--theme-color-page); /* Using global variable */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Sales order query area style, adjusted based on business-partner-search */
.sales-order-search {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  box-sizing: border-box;
  align-items: center;
  padding: 30px;
}

/* Reuse input-with-icon style from MaintainBusinessPartnerView */
.input-with-icon {
  display: flex;
  width: 100%;
  align-items: center;
  border: 1px solid #dcdfe6; /* Specific border color, could be a variable if available */
  overflow: hidden;
  background-color: #ffffff; /* Specific background color */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-with-icon:focus-within {
  border-color: #409eff; /* Specific focus color */
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2); /* Specific focus shadow */
}

/* Reuse bp-input style, applied to the actual input inside VarBox */
/* Relying on _base.css for font-family, font-size, line-height, color, border, background, outline */
.sales-order-query-varbox :deep(.var-input--main input) {
  flex-grow: 1;
  padding: 12px 15px;
  box-sizing: border-box;
  /* Removed redundant border, outline, background-color, font-size, color as they are in _base.css */
}

/* Reuse bp-search-button style, applied to the search button inside VarBox */
.sales-order-query-varbox :deep(.bp-search-button) {
  background-color: transparent; /* Specific background color */
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
  background-color: #f5f7fa; /* Specific hover background */
}

.sales-order-query-varbox :deep(.search-icon) {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

/* Go button container */
.go-button-container {
  width: 80px;
  height: 40px;
  display: flex;
  align-self:flex-end;
  background-color: var(--theme-color-dark); /* Using global variable */
  margin-top: 10px;
  transition: background-color 0.3s ease;
  color: var(--theme-color-text); /* Using global variable */
  font-weight: bold;
  justify-content: center;
  font-size: 1em;
  cursor: pointer;
}

.go-button-container:hover {
    background-color: var(--theme-color-execute-button-hover); /* Using global variable */
}

.go-button {
  font-size: 1.0em;
  text-align: center;
}

/* Output area style */
.sales-order-output {
  width: 101%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  color: var(--theme-color-dark); /* Using global variable */
  font-size: 1.6em;
  font-weight: bold;
  overflow-y: auto;
}

.sales-order-output .query-results-list {
  width: 100%;
  text-align: left;
  font-size: 0.6em;
  color: var(--color-text-primary); /* Using global variable */
  font-weight: normal;
}

.sales-order-output .query-results-list h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--theme-color-dark); /* Using global variable */
  font-size: 1.1em;
}

.sales-order-rows-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.sales-order-row-header,
.sales-order-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--theme-color-lighter); /* Using global variable for border */
}

.sales-order-row-header {
  background-color: var(--theme-color-table-header-bg); /* Using global variable */
  font-weight: bold;
  color: var(--theme-color-table-header-text); /* Using global variable */
}

.sales-order-row {
  background-color: transparent; /* Specific background color */
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
}

.sales-order-row:hover {
  background-color: var(--theme-color-lighter); /* Specific hover background */
}

.sales-order-row:last-child {
  border-bottom: none;
}

.header-item, .row-item {
  align-self: center;
}

.sales-order-id { flex-basis: 10%; text-align: center;}
.sold-to-party { flex-basis: 10%; text-align: center;}
.customer-reference { flex-basis: 15%; text-align: center;}
.req-delivery-date { flex-basis: 15%; text-align: center;}
.overall-status { flex-basis: 10%; text-align: center;}
.net-value { flex-basis: 15%; text-align: center;}
.doc-date { flex-basis: 15%; text-align: center;}
.arrow-icon { flex: 0 0 20px; text-align: right; }


/* Status specific styling */
.overall-status {
  padding: 4px 8px;
  font-weight: bold;
  font-size: 1em;
  color: #ffffff; /* Specific color */
  display: inline-block;
  text-align: center;
}
:deep(.salesOrderQuery-so_id--wrapper) {
    grid-row: 1;
    max-width: 300px;
}
:deep(.salesOrderQuery-status--wrapper) { 
    grid-row: 1;
    max-width: 300px;
}
:deep(.salesOrderQuery-customer_no--wrapper) { 
    grid-row: 1;
    max-width: 300px;
}
:deep(.salesOrderQuery-customer_reference--wrapper) { 
    grid-row: 1;
    max-width: 300px;
}
.status-open {
  background-color: #f0ad4e; /* Specific color */
}

.status-completed {
  background-color: var(--theme-color-dark); /* Specific color */
}

.status-in-progress {
  background-color: #5bc0de; /* Specific color */
}

.status-new {
  background-color: #409eff; /* Specific color */
}

.arrow-icon {
  font-size: 0.8em;
  color: #666; /* Specific color */
}

.sales-order-output .no-results,
.sales-order-output .initial-output-message {
  font-size: 1em;
  color: #666; /* Specific color */
  font-weight: normal;
  text-align: center;
  margin-top: 20px;
}

/* Bottom action buttons area, reusing MaintainBusinessPartnerView styles */
.bottom-actions {
  display: flex;
  justify-content: flex-end;
  padding: 40px 20px;
  background-color: var(--theme-color-dark); /* Using global variable */
}

/* Bottom create button, reusing search-enter-button style */
.create-sales-order-button {
  background-color: var(--btn-default-bg); /* Using global variable */
  color: var(--btn-default-text); /* Using global variable */
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-sales-order-button:hover {
  background-color: var(--btn-hover-bg); /* Using global variable */
  color: var(--btn-hover-text); /* Using global variable */
}
</style>