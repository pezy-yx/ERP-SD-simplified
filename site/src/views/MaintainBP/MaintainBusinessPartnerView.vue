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
                <div class="header-item bp-role">Type</div>
                <div class="header-item"></div>
            </div>
            <div v-for="bp in businessPartnerResults" :key="bp.customerId" class="business-partner-row" @click="viewBusinessPartnerDetail(bp.customerId)">
              <span class="row-item customer-id">{{ bp.customerId }}</span>
              <span class="row-item name">{{bp.firstName + " " + bp.lastName }}</span>
              <span class="row-item city">{{ bp.city }}</span>
              <span class="row-item country">{{ bp.country }}</span>
              <span class="row-item bp-role">{{ bp.type }}</span>
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
          :tree="currentVarTree"
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
import { bpSearch, countrySearch, relationSearch } from '@/utils/searchMethods';

const customerQueryStructure = cns("dict", "dict", "query", null, false, {hideLabel: true}, [
  cns("dict","dict","query",null,false,{hideLabel:true},[
  cns("string", "leaf", "customerId", '', false, { searchMethods: bpSearch }, [], "Customer ID"),
],""),
]);

// 封装成一个函数，用于根据类型创建不同的表单结构
function createCustomerTreeStructure(type = 'org') {
  const isPerson = type === 'person';
  return cns("dict","dict","customer",null,false,{hideLabel:true},[
    cns("dict","dict","bpIdAndRoleSection",null,false,{hideLabel:true},[
      cns("string","leaf","customerId",null,true,{},[],"Business Partner:"),
      cns("selection","leaf","bpRole",'',false,{options:['Business Partner','Customer','FI Customer']},[],"Create in BP role:"),
      cns("string","leaf","type",type,true,{hideSelf:true},[],"BP Type:"),
    ],""),

    cns("dict","dict","name",null,false,{},[
      cns("selection","leaf","title",null,false,{options:['MR','MRS','MS','COMP']},[],"Title:"), //后面做title_id到title_name的转换
      cns("string","leaf","name",null,false,{hideSelf: isPerson},[],"Name:"),
      cns("string","leaf","firstName",null,false,{hideSelf: !isPerson},[],"First Name:"),
      cns("string","leaf","lastName",null,false,{hideSelf: !isPerson},[],"Last Name:"),
    ],"Name"),
    cns("dict","dict","searchTerms",null,false,{},[
      cns("string","leaf","searchTerm",null,false,{},[],"Search Term:"),
    ],"Search Terms"),
    cns("dict","dict","address",null,false,{},[
      cns("string","leaf","country","",false,{searchMethods:countrySearch},[],"Country:"),
      cns("string","leaf","street",null,false,{},[],"Street:"),
      cns("string","leaf","postalCode",null,false,{},[],"Postal Code:"),
      cns("string","leaf","city",null,false,{},[],"City:"),
    ],"Address"),
  ]);
}


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
      customerCreateTree: null, // 将其初始化为null
      customerDetailTree: null, // 将其初始化为null
      businessPartnerResults: [],
      searchPerformed: false,
      showDetailView: false,
      selectedBusinessPartnerId: null,
      customerVarBoxKey: 0,
    };
  },
  computed: {
    actionButtonText() {
      if (['person', 'group', 'org'].includes(this.activeContentKey)) {
        return 'Save';
      }
      if (this.activeContentKey === 'sales_and_dist' && this.showDetailView) {
        return 'Save';
      }
      return 'Execute';
    },
    // 根据当前状态动态返回要显示的VarTree
    currentVarTree() {
      if (['person', 'group', 'org'].includes(this.activeContentKey)) {
        return this.customerCreateTree;
      }
      if (this.activeContentKey === 'sales_and_dist' && this.showDetailView) {
        return this.customerDetailTree;
      }
      return this.customerQueryTree; // 默认返回查询树，以防万一
    }
  },
  watch: {
    // 监听 activeContentKey 的变化，动态创建树
    activeContentKey(newKey) {
      if (['person', 'group', 'org'].includes(newKey)) {
        this.customerCreateTree = createTreeFromConfig(createCustomerTreeStructure(newKey));
        this.customerVarBoxKey++;
      }
    }
  },
  created() {
    // 组件创建时，初始化创建表单的树（默认一个类型）
    this.customerCreateTree = createTreeFromConfig(createCustomerTreeStructure('person'));
  },
  methods: {
    handleTabSelected(selectedTabValue) {
      this.activeContentKey = selectedTabValue;
      this.showDetailView = false;
      this.searchPerformed = false;
      this.businessPartnerResults = [];
      // 切换标签时重置详情树，为下一次查询做准备
      this.customerDetailTree = null;
      this.selectedBusinessPartnerId = null;
      this.customerVarBoxKey++;
      console.log('Tab selected:', selectedTabValue);
    },
    async handleActionButtonClick() {
      console.log('--- 准备执行操作 ---');
      console.log('当前激活内容键 (activeContentKey):', this.activeContentKey);
      console.log('是否显示详情页 (showDetailView):', this.showDetailView);

      if (this.activeContentKey === 'sales_and_dist' && !this.showDetailView) {
        await this.performBusinessPartnerSearch();
      } else if (['person', 'group', 'org'].includes(this.activeContentKey)) {
        await this.createBusinessPartner(this.activeContentKey);
      } else if (this.activeContentKey === 'sales_and_dist' && this.showDetailView) {
        await this.saveBusinessPartnerDetail();
      }
      console.log('--- 操作流程结束 ---');
    },
    async performBusinessPartnerSearch() {
      console.log('执行业务伙伴查询...');
      this.searchPerformed = true;
      this.businessPartnerResults = [];

      const queryData = this.customerQueryTree.root?.getValue();
      console.log('提交的查询数据结构:', JSON.stringify(queryData, null, 2));

      try {
        const response = await fetch(`${window.getAPIBaseUrl()}/api/bp/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(queryData),
        });
        const result = await response.json();

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
      this.customerVarBoxKey++;
      await this.fetchBusinessPartnerDetail(customerId);
    },
    async fetchBusinessPartnerDetail(customerId) {
      console.log(`获取业务伙伴 ${customerId} 的详情数据...`);
      try {
        const response = await fetch(`${window.getAPIBaseUrl()}/api/bp/get/${customerId}`);
        const result = await response.json();

        if (result.success && result.data) {
          // 1. 根据返回的数据类型，动态生成对应的 VarTree 结构
          const bpType = result.data.bpIdAndRoleSection?.type || 'org'; // 假设类型存在于此，如果不存在则使用默认值
          console.log(`获取到业务伙伴类型: ${bpType}`);
          this.customerDetailTree = createTreeFromConfig(createCustomerTreeStructure(bpType));

          // 2. 将数据填充到新生成的树中
          this.customerDetailTree.root?.forceSetValue(result.data);
          console.log('业务伙伴详情数据加载成功:', result.data);
        } else {
          console.error('获取业务伙伴详情失败:', result.message || 'API返回数据异常');
          this.showDetailView = false;
          alert('获取业务伙伴详情失败: ' + (result.message || '未知错误'));
        }
      } catch (error) {
        console.error('获取业务伙伴详情发生错误:', error);
        this.showDetailView = false;
        alert('获取业务伙伴详情失败: ' + (error.message || '网络错误'));
      }
    },
    backToSearchResults() {
      console.log('返回搜索结果列表');
      this.showDetailView = false;
      this.selectedBusinessPartnerId = null;
      this.customerDetailTree = null; // 清空详情页数据树
      this.customerVarBoxKey++;
    },
    async createBusinessPartner(type) {
      console.log(`执行创建 ${type} 业务伙伴...`);
      const createData = this.customerCreateTree.root?.getValue();

      if (createData) {
         if (!createData.bpIdAndRoleSection) {
           createData.bpIdAndRoleSection = {};
        }
        if (createData.bpIdAndRoleSection.type === 'person') {
          // 自动填充name字段
          createData.name.name = `${createData.name.firstName} ${createData.name.lastName}`;
          console.log('自动生成 name 字段:', createData.name.name);
         }
         if (!createData.name.firstName && !createData.name.lastName && createData.name.name) {
          createData.name.firstName = createData.name.name ;
          createData.name.lastName = "";
         }
         createData.bpIdAndRoleSection.type = type;
       }
      console.log('提交的创建数据:', JSON.stringify(createData, null, 2));

      try {
        const response = await fetch(`${window.getAPIBaseUrl()}/api/bp/edit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData),
        });
        const result = await response.json();

        if (result.success) {
          alert(result.message + ' New Customer ID: ' + result.data.customerId);
          this.customerCreateTree.root?.forceSetValue({});
          this.customerVarBoxKey++;
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
      if (detailData.bpIdAndRoleSection.type === 'person') {
          // 自动填充name字段
          detailData.name.name = `${detailData.name.firstName} ${detailData.name.lastName}`;
         }
         else{
          detailData.name.firstName = detailData.name.name;
         }
      if (!this.selectedBusinessPartnerId) {
        alert('无法保存：未选择业务伙伴ID。');
        return;
      }
      if (detailData && detailData.bpIdAndRoleSection) {
        detailData.bpIdAndRoleSection.customerId = this.selectedBusinessPartnerId;
      } else {
        alert('无法保存：数据结构异常。');
        return;
      }

      console.log('提交的详情数据进行保存:', JSON.stringify(detailData, null, 2));

      try {
        const response = await fetch(`${window.getAPIBaseUrl()}/api/bp/edit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(detailData),
        });
        const result = await response.json();

        if (result.success) {
          alert(result.message);
          this.backToSearchResults();
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
  height: 100vh; /* 使用 100vh 确保全屏高度 */
  background-color: var(--theme-color-dark);
  width:100%;
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
  overflow-y: auto; /* 允许内容区域垂直滚动 */
  padding-bottom: 80px; /* 为固定的底部操作栏留出空间，这个值应略大于底部栏的高度 */
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

/* 修改后的底部操作栏样式 */
.bottom-actions {
  position: fixed; /* 固定定位 */
  bottom: 0; /* 固定在底部 */
  left: 0; /* 固定在左侧 */
  width: 100%; /* 宽度占满 */
  padding: 10px; /* 增加内边距 */
  display: flex;
  justify-content: flex-end;
  background-color: var(--theme-color-dark); /* 设置背景色以防内容透出 */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  z-index: 100; /* 确保它位于其他内容之上 */
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

:deep(.customer-address-country--wrapper){
  max-width: 150px;
}

</style>