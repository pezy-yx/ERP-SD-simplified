<template>
  <div class="manage-sales-orders-view">
    <!-- NavigationBar 标题将根据状态动态变化 -->
    <NavigationBar :pageTitle="pageTitle" @search="handleGlobalSearch"/>

    <div class="page-content">
      <!-- 
        此区域将根据 currentState 动态显示内容。
        在后续步骤中，我们将在这里添加 v-if 来切换搜索/列表、创建、详情/修改的UI。
        目前保持原有结构，只是引入了状态变量和新的VarTree定义。
      -->
      <div class="sales-order-search">
        <VarBox
          :tree="salesOrderQueryTree"
          class="sales-order-query-varbox"
        />
        <div class="go-button-container">
          <button class="search-enter-button go-button" @click="performSalesOrderSearch">Go</button>
        </div>
      </div>
      <div class="sales-order-output">
        <h2>Output</h2>
        <div v-if="searchPerformed && salesOrdersResult && salesOrdersResult.length > 0" class="query-results-list">
          <h3>Query Results:</h3>
          <div class="sales-order-rows-container">
            <div class="sales-order-row-header">
                <div class="header-item sales-order-id">Sales Order</div>
                <div class="header-item sold-to-party">Sold-To Party</div>
                <div class="header-item customer-reference">Customer Reference</div>
                <div class="header-item req-delivery-date">Requested Delivery Date</div>
                <div class="header-item overall-status">Overall Status</div>
                <div class="header-item net-value">Net Value</div>
                <div class="header-item doc-date ">Document Date</div>
                <div class="header-item"></div>
            </div>
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
    <!-- 底部操作按钮 -->
    <div class="bottom-actions">
      <button class="search-enter-button create-sales-order-button" @click="createSalesOrder">Create Sales Order</button>
    </div>
  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import VarBox from '@/components/varbox/VarBox.vue';
import { createTreeFromConfig, cns, VarTree } from '@/utils/VarTree'; // 引入 VarTree 类型
import { bpSearch } from '@/utils/searchMethods';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '';

// --- VarTree Structures (保持不变) ---
const salesOrderQueryStructure = cns(
  "dict", "dict", "salesOrderQuery", null, false, { hideLabel: true }, 
  [
    cns("string", "leaf", "so_id", '', false, { searchMethods: bpSearch }, [], "Sales Order:"),
    cns("selection", "leaf", "status", '', false, {options:['New','Open','In Progress','Completed','Cancelled']}, [], "Overall Status:"), // 修正 'In progress' 为 'In Progress'
    cns("string", "leaf", "customer_no", '', false, { searchMethods: bpSearch }, [], "Sold-To Party:"),
    cns("string", "leaf", "customer_reference", '', false, {searchMethods: bpSearch}, [], "Customer Reference:"),
  ]
);

// --- 新增：销售订单创建的 VarTree 结构 (简化版，只包含关键字段) ---
const salesOrderCreateStructure = cns(
  "dict", "dict", "newSalesOrder", null, false, { hideLabel: true },
  [
    cns("string", "leaf", "customer_no", '', false, { searchMethods: bpSearch }, [], "Sold-To Party:"),
    cns("date", "leaf", "doc_date", '', false, {}, [], "Document Date:"),
    cns("date", "leaf", "req_delivery_date", '', false, {}, [], "Requested Delivery Date:"),
    cns("string", "leaf", "customer_reference", '', false, {}, [], "Customer Reference:"),
    cns("number", "leaf", "net_value", 0, false, {}, [], "Net Value:"),
    cns("string", "leaf", "currency", 'CNY', false, {}, [], "Currency:"),
    cns("selection", "leaf", "incoterms", '', false, {options:['FOB','CIF','EXW','DAP']}, [], "Incoterms:"),
    cns("selection", "leaf", "payment_terms", '', false, {options:['NET30','COD','NET60']}, [], "Payment Terms:"),
    cns("string", "leaf", "status", 'New', true, {}, [], "Overall Status:"), // 创建时状态通常由后端设置，或默认为 'New'，这里设为只读
  ]
);

// --- 新增：销售订单详情显示的 VarTree 结构 (所有字段只读) ---
const salesOrderDetailStructure = cns(
  "dict", "dict", "salesOrderDetail", null, true, { hideLabel: true }, // 根节点设为只读
  [
    cns("string", "leaf", "so_id", '', true, {}, [], "Sales Order:"), // 只读
    cns("string", "leaf", "customer_no", '', true, {}, [], "Sold-To Party:"), // 只读
    cns("date", "leaf", "doc_date", '', true, {}, [], "Document Date:"), // 只读
    cns("date", "leaf", "req_delivery_date", '', true, {}, [], "Requested Delivery Date:"), // 只读
    cns("string", "leaf", "customer_reference", '', true, {}, [], "Customer Reference:"), // 只读
    cns("number", "leaf", "net_value", 0, true, {}, [], "Net Value:"), // 只读
    cns("string", "leaf", "currency", '', true, {}, [], "Currency:"), // 只读
    cns("string", "leaf", "incoterms", '', true, {}, [], "Incoterms:"), // 只读
    cns("string", "leaf", "payment_terms", '', true, {}, [], "Payment Terms:"), // 只读
    cns("string", "leaf", "status", '', true, {}, [], "Overall Status:"), // 只读
  ]
);

// --- 新增：销售订单修改的 VarTree 结构 (部分字段可编辑) ---
const salesOrderEditStructure = cns(
  "dict", "dict", "salesOrderEdit", null, false, { hideLabel: true }, // 根节点可编辑
  [
    cns("string", "leaf", "so_id", '', true, {}, [], "Sales Order:"), // ID通常只读
    cns("string", "leaf", "customer_no", '', false, { searchMethods: bpSearch }, [], "Sold-To Party:"), // 可编辑
    cns("date", "leaf", "doc_date", '', false, {}, [], "Document Date:"), // 可编辑
    cns("date", "leaf", "req_delivery_date", '', false, {}, [], "Requested Delivery Date:"), // 可编辑
    cns("string", "leaf", "customer_reference", '', false, {}, [], "Customer Reference:"), // 可编辑
    cns("number", "leaf", "net_value", 0, true, {}, [], "Net Value:"), // 净值通常计算而来，设为只读
    cns("string", "leaf", "currency", '', true, {}, [], "Currency:"), // 货币通常只读
    cns("selection", "leaf", "incoterms", '', false, {options:['FOB','CIF','EXW','DAP']}, [], "Incoterms:"), // 可编辑
    cns("selection", "leaf", "payment_terms", '', false, {options:['NET30','COD','NET60']}, [], "Payment Terms:"), // 可编辑
    cns("selection", "leaf", "status", '', false, {options:['New','Open','In Progress','Completed','Cancelled']}, [], "Overall Status:"), // 状态可能可修改
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
      // --- 状态管理 ---
      currentState: 'search', // 'search', 'create', 'display', 'change'
      currentSalesOrderData: null, // 用于存储当前查看/编辑的销售订单数据

      // --- VarTree Instances ---
      salesOrderQueryTree: createTreeFromConfig(salesOrderQueryStructure),
      salesOrdersResult: [],
      searchPerformed: false,

      // 新增：用于创建、显示、修改的 VarTree 实例
      salesOrderCreateTree: createTreeFromConfig(salesOrderCreateStructure),
      salesOrderDetailTree: createTreeFromConfig(salesOrderDetailStructure),
      salesOrderEditTree: createTreeFromConfig(salesOrderEditStructure),
    };
  },
  computed: {
    // 动态页面标题
    pageTitle() {
      switch (this.currentState) {
        case 'search': return 'Manage Sales Orders';
        case 'create': return 'Create Sales Order';
        case 'display': return `Sales Order Details: ${this.currentSalesOrderData?.so_id || ''}`;
        case 'change': return `Change Sales Order: ${this.currentSalesOrderData?.so_id || ''}`;
        default: return 'Sales Orders';
      }
    },
    // 方便的布尔值判断当前状态
    isSearchState() { return this.currentState === 'search'; },
    isCreateState() { return this.currentState === 'create'; },
    isDisplayState() { return this.currentState === 'display'; },
    isChangeState() { return this.currentState === 'change'; },
  },
  methods: {
    // --- 状态切换核心方法 (将在后续步骤中完善) ---
    updateAppState(newState, data = null) {
      this.currentState = newState;
      this.currentSalesOrderData = data; 
      console.log(`App state changed to: ${newState}`);
      // 这里的 VarTree 数据填充和只读设置将在后续步骤中添加
    },

    // --- 搜索功能 (保持不变) ---
    handleGlobalSearch() {
      console.log('Global search triggered from NavigationBar');
    },
    async performSalesOrderSearch() {
      console.log('Executing sales order query...');
      const fullUrl = `${API_BASE_URL}/api/so/search`;
      console.log('Attempting to fetch from URL:', fullUrl);
      const queryData = this.salesOrderQueryTree.root?.currentValue;
      console.log('Submitting query data:', JSON.stringify(queryData, null, 2));

      this.searchPerformed = true;
      this.salesOrdersResult = [];

      try {
        const response = await fetch(fullUrl, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(queryData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(`HTTP Error ${response.status}: ${errorData.message || response.statusText}`);
        }
        const result = await response.json();
        console.log('Query result:', result);

        if (result.success && Array.isArray(result.data)) {
          this.salesOrdersResult = result.data;
        } else {
          console.warn('API response did not contain expected data array:', result);
          this.salesOrdersResult = [];
          alert(`Query successful, but no valid data returned: ${result.message || 'Unknown issue'}`);
        }
      } catch (error) {
        console.error('Sales order query failed:', error);
        this.salesOrdersResult = [];
        alert(`Sales order query failed: ${error.message || 'Network error'}`);
      }
    },

    // --- 新增/修改/查看功能入口 (将修改为调用 updateAppState) ---

    // 1. 点击 'Create Sales Order' 按钮进入 Create 状态
    createSalesOrder() {
      console.log('Switching to Create Sales Order state.');
      this.updateAppState('create'); // 切换状态
    },

    // 2. viewSalesOrderDetail 进入 Display 步骤 (将修改为调用 updateAppState)
    viewSalesOrderDetail(soId) {
      console.log(`Navigating to sales order detail page for SO ID: ${soId}`);
      // 实际应用中这里会调用后端 API 获取订单详情，然后调用 updateAppState('display', fetchedData)
      alert(`Viewing details for Sales Order: ${soId} (功能待完善)`);
      // 暂时模拟切换到 display 状态，实际数据填充将在后续步骤中添加
      this.updateAppState('display', { so_id: soId, customer_no: 'Loading...', status: 'Loading...' }); 
    },

    // 3. 在 Display 页面有按钮能够实现 Change 状态的切换 (将在后续步骤中添加)
    switchToChangeState() {
      console.log('Switching to Change Sales Order state. (功能待完善)');
      alert('Switch to Change State (功能待完善)');
    },

    // 4. 保存功能 (用于 Create 和 Change 状态) (将在后续步骤中添加)
    saveSalesOrder() {
      console.log('Saving Sales Order. (功能待完善)');
      alert('Save Sales Order (功能待完善)');
    },

    // 5. 取消创建或返回搜索 (将在后续步骤中添加)
    cancelCreate() {
      console.log('Cancelling creation. (功能待完善)');
      alert('Cancel Create (功能待完善)');
    },

    // 6. 从详情/修改页面返回搜索列表 (将在后续步骤中添加)
    backToSearch() {
      console.log('Returning to search. (功能待完善)');
      alert('Back to Search (功能待完善)');
    },
  }
};
</script>

<style scoped>
/* 样式部分保持不变，因为用户明确要求不修改已有结构和样式。
  新状态下的表单样式将在 VarBox 内部通过 :deep() 调整，
  或者依赖 VarBox 自身的默认样式。
*/

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
  width: 100%;
  max-width: 800px; /* Limit width of the search box itself */
}

/* Adjust layout for VarBox's internal content to display all query fields in a single row */
.sales-order-query-varbox :deep(.var-box--content) {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  width: 100%;
}

.sales-order-query-varbox :deep(.var-input--wrapper) {
  flex: 0 0 auto;
  min-width: 150px;
  max-width: 200px;
  box-sizing: border-box;
  margin-bottom: 0;
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
  background-color: var(--theme-color-dark);
  margin-top: 10px;
  transition: background-color 0.3s ease;
  color: var(--theme-color-text);
  font-weight: bold;
  justify-content: center;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
}

.go-button-container:hover {
    background-color: var(--theme-color-execute-button-hover);
}

.go-button {
  font-size: 1.0em;
  text-align: center;
}

/* Output area style */
.sales-order-output {
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  color: var(--theme-color-dark);
  font-size: 1.6em;
  font-weight: bold;
  overflow-y: auto;
  background-color: #ffffff; /* Specific background color */
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.sales-order-output h2 {
  margin-bottom: 15px;
  color: var(--theme-color-dark);
}

.sales-order-output .query-results-list {
  width: 100%;
  text-align: left;
  font-size: 0.6em;
  color: var(--color-text-primary);
  font-weight: normal;
}

.sales-order-output .query-results-list h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--theme-color-dark);
  font-size: 1.1em;
}

.sales-order-rows-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.sales-order-row-header,
.sales-order-row {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid var(--theme-color-lighter);
}

.sales-order-row-header {
  background-color: var(--theme-color-table-header-bg);
  font-weight: bold;
  color: var(--theme-color-table-header-text);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.sales-order-row {
  background-color: transparent;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
}

.sales-order-row:hover {
  background-color: var(--theme-color-lighter);
}

.sales-order-row:last-child {
  border-bottom: none;
}

.header-item, .row-item {
  align-self: center;
  padding: 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  color: #ffffff;
  display: inline-block;
  text-align: center;
  border-radius: 4px;
}

.status-open { background-color: #f0ad4e; }
.status-completed { background-color: var(--theme-color-dark); }
.status-in-progress { background-color: #5bc0de; }
.status-new { background-color: #409eff; }
.status-cancelled { background-color: #d9534f; }


.arrow-icon {
  font-size: 0.8em;
  color: #666;
}

.sales-order-output .no-results,
.sales-order-output .initial-output-message {
  font-size: 1em;
  color: #666;
  font-weight: normal;
  text-align: center;
  margin-top: 20px;
}

/* Bottom action buttons area, reusing MaintainBusinessPartnerView styles */
.bottom-actions {
  display: flex;
  justify-content: flex-end;
  padding: 40px 20px;
  background-color: var(--theme-color-dark);
}

.create-sales-order-button {
  background-color: var(--btn-default-bg);
  color: var(--btn-default-text);
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-sales-order-button:hover {
  background-color: var(--btn-hover-bg);
  color: var(--btn-hover-text);
}
</style>
