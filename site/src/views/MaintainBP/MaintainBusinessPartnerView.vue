<template>
  <div class="maintain-business-partner-view">
    <FilterTabs :tabs="businessPartnerTabs" @tab-selected="handleTabSelected"/>

    <div class="bp-page-content">
      <div v-if="activeContentKey === 'sales_and_dist' && !showDetailView" class="business-partner-search" style="width: 100%;">
        <div class="input-with-icon" style="width: 100%;">
          <VarBox
            :tree="customerQueryTree"
            class="bp-input-var-input"
          />
        </div>

        <div v-if="searchPerformed && businessPartnerResults && businessPartnerResults.length > 0" class="query-results-list">
          <div class="business-partner-rows-container">
            <div class="business-partner-row-header">
                <div class="header-item customer-id">Customer ID</div>
                <div class="header-item name">Name</div>
                <div class="header-item city">City</div>
                <div class="header-item country">Country</div>
                <div class="header-item bp-role">BP Role</div>
                <div class="header-item"></div>
            </div>
            <div v-for="bp in businessPartnerResults" :key="bp.customerId" class="business-partner-row" @click="viewBusinessPartnerDetail(bp.customerId)">
              <span class="row-item customer-id">{{ bp.customerId }}</span>
              <span class="row-item name">{{ bp.name }}</span>
              <span class="row-item city">{{ bp.city }}</span>
              <span class="row-item country">{{ bp.country }}</span>
              <span class="row-item bp-role">{{ bp.bpRole }}</span>
              <span class="row-item arrow-icon">▶</span>
            </div>
          </div>
        </div>
        <div v-else-if="searchPerformed && businessPartnerResults && businessPartnerResults.length === 0" class="no-results">
          <p>No business partners found matching your criteria.</p>
        </div>
        <div v-else class="initial-output-message">
          <p>Enter query criteria and click "Execute" to see results.</p>
        </div>
      </div>

      <div v-else-if="(activeContentKey === 'sales_and_dist' && showDetailView) || ['person', 'org', 'group'].includes(activeContentKey)" class="business-partner-detail-view">
        <div v-if="activeContentKey === 'sales_and_dist' && showDetailView" class="detail-page-actions">
          <button class="back-button" @click="backToSearchResults">← Back to Search Results</button>
        </div>
        <VarBox
          :tree="activeContentKey === 'sales_and_dist' && showDetailView ? customerDetailTree : customerCreateTree"
          class="bp-detail-var-input"
          :key="customerVarBoxKey"
        />
      </div>
    </div>

    <div class="bottom-actions">
      <button class="search-enter-button" @click="handleActionButtonClick">
        {{ actionButtonText }}
      </button>
    </div>
  </div>
</template>

<script>
import FilterTabs from '@/components/FilterTabs.vue';
import VarBox from '@/components/varbox/VarBox.vue';
import { createTreeFromConfig, cns, VarTree, VarNodeValue, VarNode, createNodeFromConfig } from '@/utils/VarTree';
import { bpSearch, relationSearch } from '@/utils/searchMethods';

// 定义一个基础的API URL，你可以根据你的项目配置进行调整
// 在实际项目中，这通常通过环境变量配置
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '';

const customerQueryStructure = cns("dict", "dict", "query", null, false, {hideLabel: true}, [
  cns("string", "leaf", "customerId", '', false, { searchMethods: bpSearch }, [], "Customer ID")
]);

// customerCreateStructure 定义了业务伙伴的完整详情结构
// 这将用于创建和显示详情页
const customerCreateStructure = cns("dict","dict","customer",null,false,{hideLabel:true},[ // 顶层 'customer' 字典
  cns("dict","dict","bpIdAndRoleSection",null,false,{hideLabel:true},[
    cns("string","leaf","customerId",null,true,{},[],"Business Partner:"),
    cns("selection","leaf","bpRole",'',false,{options:['Business Partner','Customer','FI Customer']},[],"Create in BP role:"),
  ],""),

  cns("dict","dict","name",null,false,{},[
    cns("selection","leaf","title",null,false,{options:['Mr.','Mrs.','Ms.','Company']},[],"Title:"),
    cns("string","leaf","name",null,false,{},[],"Name:"),
  ],"Name"),
  cns("dict","dict","searchTerms",null,false,{},[
    cns("string","leaf","searchTerm",null,false,{},[],"Search Term:"),
  ],"Search Terms"),
  cns("dict","dict","address",null,false,{},[
    cns("string","leaf","country","",false,{searchMethods:bpSearch},[]),
    cns("string","leaf","street",null,false,{},[],"Street:"),
    cns("string","leaf","postalCode",null,false,{},[],"Postal Code:"),
    cns("string","leaf","city",null,false,{},[],"City:"),
  ],"Address"),
]);


export default {
  name: 'MaintainBusinessPartnerView',
  components: {
    FilterTabs,
    VarBox,
  },
  data() {
    return {
      activeContentKey: 'sales_and_dist',
      businessPartnerTabs: [
        { label: 'sales and dist', value: 'sales_and_dist' },
        { label: 'person', value: 'person' },
        { label: 'group', value: 'group' },
        { label: 'org', value: 'org' },
      ],
      customerQueryTree: createTreeFromConfig(customerQueryStructure),
      customerCreateTree: createTreeFromConfig(customerCreateStructure),
      customerDetailTree: createTreeFromConfig(customerCreateStructure), // 用于详情页的树，结构与创建页相同
      businessPartnerResults: [], // 存储搜索结果（简要信息）
      searchPerformed: false, // 标记是否已执行搜索
      showDetailView: false, // 控制是否显示详情页
      selectedBusinessPartnerId: null, // 存储当前选中的业务伙伴ID
      customerVarBoxKey: 0, // 用于强制刷新 VarBox
    };
  },
  computed: {
    actionButtonText() {
      if (['person', 'group', 'org'].includes(this.activeContentKey)) {
        return 'Save'; // 创建/编辑模式下的保存
      }
      if (this.activeContentKey === 'sales_and_dist' && this.showDetailView) {
        return 'Save'; // 详情页的保存
      }
      return 'Execute'; // 查询页的执行
    }
  },
  methods: {
    handleTabSelected(selectedTabValue) {
      this.activeContentKey = selectedTabValue;
      this.showDetailView = false; // 切换标签时隐藏详情页
      this.searchPerformed = false; // 重置搜索状态
      this.businessPartnerResults = []; // 清空搜索结果
      this.customerCreateTree.root?.forceSetValue({}); // 清空创建表单数据
      this.customerDetailTree.root?.forceSetValue({}); // 清空详情页数据
      this.selectedBusinessPartnerId = null; // 清空选中ID
      this.customerVarBoxKey++; // 强制刷新 VarBox
      console.log('Tab selected:', selectedTabValue);
    },
    async handleActionButtonClick() {
      console.log('--- 准备执行操作 ---');
      console.log('当前激活内容键 (activeContentKey):', this.activeContentKey);
      console.log('是否显示详情页 (showDetailView):', this.showDetailView);

      if (this.activeContentKey === 'sales_and_dist' && !this.showDetailView) {
        // 如果是查询页面且不是详情页，执行查询操作
        await this.performBusinessPartnerSearch();
      } else if (['person', 'group', 'org'].includes(this.activeContentKey)) {
        // 如果是创建页面，执行创建操作
        await this.createBusinessPartner(this.activeContentKey);
      } else if (this.activeContentKey === 'sales_and_dist' && this.showDetailView) {
        // 如果是详情页，执行保存操作
        await this.saveBusinessPartnerDetail();
      }
      console.log('--- 操作流程结束 ---');
    },
    async performBusinessPartnerSearch() {
      console.log('执行业务伙伴查询...');
      this.searchPerformed = true;
      this.businessPartnerResults = []; // 清空之前的搜索结果

      const queryData = this.customerQueryTree.root?.getValue();
      console.log('提交的查询数据结构:', JSON.stringify(queryData, null, 2));

      try {
        // 模拟调用 /api/bp/search 接口
        const response = await fetch(`${API_BASE_URL}/api/bp/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(queryData),
        });
        const result = await response.json(); // 解析 JSON 响应

        if (result.success && Array.isArray(result.data)) {
          this.businessPartnerResults = result.data;
          console.log('查询结果:', this.businessPartnerResults);
        } else {
          console.error('业务伙伴查询失败:', result.message || 'API返回数据异常');
          this.businessPartnerResults = [];
        }
      } catch (error) {
        console.error('业务伙伴查询发生错误:', error);
        this.businessPartnerResults = [];
        alert('查询业务伙伴失败: ' + (error.message || '网络错误'));
      }
    },
    async viewBusinessPartnerDetail(customerId) {
      console.log(`进入业务伙伴详情页，ID: ${customerId}`);
      this.selectedBusinessPartnerId = customerId;
      this.showDetailView = true;
      this.customerVarBoxKey++; // 强制刷新 VarBox

      await this.fetchBusinessPartnerDetail(customerId);
    },
    async fetchBusinessPartnerDetail(customerId) {
      console.log(`获取业务伙伴 ${customerId} 的详情数据...`);
      try {
        // 模拟调用 /api/bp/get/:customerId 接口
        const response = await fetch(`${API_BASE_URL}/api/bp/get/${customerId}`);
        const result = await response.json(); // 解析 JSON 响应

        if (result.success && result.data) {
          // 使用 forceSetValue 来填充 VarTree，因为返回的数据结构与树定义一致
          this.customerDetailTree.root?.forceSetValue(result.data);
          console.log('业务伙伴详情数据加载成功:', result.data);
        } else {
          console.error('获取业务伙伴详情失败:', result.message || 'API返回数据异常');
          this.showDetailView = false; // 加载失败则返回列表
          alert('获取业务伙伴详情失败: ' + (result.message || '未知错误'));
        }
      } catch (error) {
        console.error('获取业务伙伴详情发生错误:', error);
        this.showDetailView = false; // 错误则返回列表
        alert('获取业务伙伴详情失败: ' + (error.message || '网络错误'));
      }
    },
    backToSearchResults() {
      console.log('返回搜索结果列表');
      this.showDetailView = false;
      this.selectedBusinessPartnerId = null;
      this.customerDetailTree.root?.forceSetValue({}); // 清空详情页数据
      this.customerVarBoxKey++; // 强制刷新 VarBox
    },
    async createBusinessPartner(type) {
      console.log(`执行创建 ${type} 业务伙伴...`);
      const createData = this.customerCreateTree.root?.getValue();

      // 在模拟数据中添加类型字段，如果需要区分 person/group/org
      // 注意：customerCreateStructure 本身没有 'type' 字段，如果需要在后端区分，这里需要自行处理
      // 这里的 'type' 只是为了演示区分，实际应根据 customerCreateStructure 调整
      if (createData) {
        // 确保 bpIdAndRoleSection 存在，并在其下添加一个虚拟的 type 字段用于模拟区分
        if (!createData.bpIdAndRoleSection) {
          createData.bpIdAndRoleSection = {};
        }
        createData.bpIdAndRoleSection.type = type; // 模拟添加类型信息
      }

      console.log('提交的创建数据:', JSON.stringify(createData, null, 2));

      try {
        // 模拟调用 /api/bp/create 接口
        const response = await fetch(`${API_BASE_URL}/api/bp/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData),
        });
        const result = await response.json();

        if (result.success) {
          alert(result.message + ' New Customer ID: ' + result.data.customerId);
          this.customerCreateTree.root?.forceSetValue({}); // 清空表单
          this.customerVarBoxKey++; // 强制刷新 VarBox
          // 创建成功后可以考虑导航到详情页或者返回列表页
        } else {
          alert('创建失败: ' + (result.message || '未知错误'));
        }
      } catch (error) {
        console.error('创建业务伙伴失败:', error);
        alert('创建业务伙伴失败: ' + (error.message || '网络错误'));
      }
    },
    async saveBusinessPartnerDetail() {
      console.log(`执行保存业务伙伴 ${this.selectedBusinessPartnerId} 的详情...`);
      const detailData = this.customerDetailTree.root?.getValue();

      // 确保有 customerId 进行保存
      if (!this.selectedBusinessPartnerId) {
        alert('无法保存：未选择业务伙伴ID。');
        return;
      }
      // 将选中的 ID 放入数据中，以便后端识别要更新哪个业务伙伴
      if (detailData && detailData.bpIdAndRoleSection) {
        detailData.bpIdAndRoleSection.customerId = this.selectedBusinessPartnerId;
      } else {
        alert('无法保存：数据结构异常。');
        return;
      }

      console.log('提交的详情数据进行保存:', JSON.stringify(detailData, null, 2));

      try {
        // 模拟调用 /api/bp/edit 接口
        const response = await fetch(`${API_BASE_URL}/api/bp/edit`, {
          method: 'POST', // 或者 PUT，根据后端约定
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(detailData),
        });
        const result = await response.json();

        if (result.success) {
          alert(result.message);
          this.backToSearchResults(); // 保存成功后返回搜索列表
        } else {
          alert('保存失败: ' + (result.message || '未知错误'));
        }
      } catch (error) {
        console.error('保存业务伙伴详情失败:', error);
        alert('保存业务伙伴详情失败: ' + (error.message || '网络错误'));
      }
    }
  }
};
</script>

<style scoped>
/* 保持原有的样式，确保列表和详情页的显示效果 */
.maintain-business-partner-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #25484C;
  width:100%
}

.bp-page-content {
  flex-grow: 1;
  background-color: var(--theme-color-page);
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

.business-partner-search label {
  display: block;
  font-weight: bold;
}

.input-with-icon {
  display: flex;
  align-items: center;
}

.bp-input-var-input,
.bp-detail-var-input {
  flex-grow: 1;
  margin-right: 10px;
}

.bottom-actions {
  padding: 40px 20px;
  display: flex;
  justify-content: flex-end;
}

.search-enter-button {
  padding: 10px 20px;
  background-color: var(--theme-color-page);
  color: var(--theme-color-dark);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.search-enter-button:hover {
  background-color: #25984C;
  color: var(--theme-color-page);
}

/* 搜索结果列表样式 (参考 ManageSalesOrders.vue) */
.query-results-list {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.business-partner-rows-container {
  display: flex;
  flex-direction: column;
}

.business-partner-row-header,
.business-partner-row {
  display: flex;
  padding: 10px 15px;
  border-bottom: 1px solid var(--theme-color-page);
  align-items: center;
}

.business-partner-row-header {
  background-color: var(--theme-color-dark);
  font-weight: bold;
}

.business-partner-row {
  cursor: pointer;
}

.business-partner-row:hover {
  background-color: #ccc;
  transition: background-color 0.4s;
}

.header-item{
  flex: 1;
  padding: 0 5px;
  word-break: break-all;
  color: var(--theme-color-page);
}
.row-item {
  flex: 1;
  padding: 0 5px;
  word-break: break-all;
  color: var(--theme-color-dark);
}

.header-item.customer-id, .row-item.customer-id { flex-basis: 10%; text-align: center; }
.header-item.name, .row-item.name { flex-basis: 10%; text-align: center;}
.header-item.city, .row-item.city { flex-basis: 10%; text-align: center; }
.header-item.country, .row-item.country { flex-basis: 10%; text-align: center; }
.header-item.bp-role, .row-item.bp-role { flex-basis: 10%; text-align: center; }
.header-item:last-child, .row-item.arrow-icon {flex: 0 0 20px; text-align: right;}

.no-results, .initial-output-message {
  text-align: center;
  color: #666;
}

/* 详情页样式 */
.business-partner-detail-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-page-actions {
  padding-bottom: 15px;
  border-bottom: 2px solid #555;
  margin-bottom: 20px;
}

.back-button {
  padding: 8px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.back-button:hover {
  background-color: #5a6268;
}
</style>