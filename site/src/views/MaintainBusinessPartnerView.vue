<template>
  <div class="maintain-business-partner-view">
    <FilterTabs :tabs="businessPartnerTabs" @tab-selected="handleTabSelected"/>

    <div class="page-content">
      <div v-if="activeContentKey === 'sales_and_dist' || !activeContentKey" class="business-partner-search">
        <label for="businessPartnerInput">Business Partner:</label>
        <div class="input-with-icon">
          <VarBox
            :tree="customerQueryTree"
            class="bp-input-var-input"
          />
        </div>
      </div>

      <div v-else-if ="activeContentKey === 'person' || activeContentKey === 'org' || activeContentKey === 'group'" class="business-partner-search">
        <div class="input-with-icon">
          <VarBox
            :tree="customerCreateTree"
            class="bp-input-var-input"
          />
        </div>
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
import VarBox from '../components/varbox/VarBox.vue';
import {createTreeFromConfig, createNodeFromConfig, cns, VarTree, VarNode, NodeStructure, isNodeStructure} from '@/utils/VarTree';
import {
  bpSearch,
  relationSearch
} from '@/utils/searchMethods'

// 定义一个基础的API URL，你需要根据你的项目配置进行调整
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || ''; 

const customerQueryStructure = cns(
  "string", "leaf", "customer_id",'',false,{searchMethods:bpSearch},[],
);

const customerCreateStructure = cns("dict","dict","customer",null,false,{hideLabel:true},[ // 顶层 'test' 字典保持不变
  // 新增一个字典节点 'bpIdAndRoleSection'，用于包裹 customer_id 和 bp_role
  // 这个字典节点的 hideLabel:true 和 nameDisplay: "" 可以隐藏它自身的标签，使其看起来更自然
  cns("dict","dict","bpIdAndRoleSection",null,false,{hideLabel:true},[ // <--- 新增的父级字典
    cns("string","leaf","customer_id",null,false,{},[],"Business Partner:"),
    cns("string","leaf","bp_role",null,false,{},[],"Create in BP role:")
  ],""), // nameDisplay 设置为空字符串，避免显示此区域的标题

  cns("dict","dict","name",null,false,{},[
    cns("string","leaf","title",null,false,{},[],"Title:"),
    cns("string","leaf","name",null,false,{},[],"Name:"),
  ],"Name"),
  cns("dict","dict","searchTerms",null,false,{},[
    cns("string","leaf","searchTerm",null,false,{},[],"Search Term:"),
  ],"Search Terms"),
  cns("dict","dict","address",null,false,{},[
    cns("string","leaf","country","",false,{searchMethods:bpSearch},[]),// 这里后面改成国家搜索方法
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
      customerCreateTree: createTreeFromConfig(customerCreateStructure)
    };
  },
  computed: {
    actionButtonText() {
      // 根据 activeContentKey 动态改变按钮文本
      if (['person', 'group', 'org'].includes(this.activeContentKey)) {
        return 'Save';
      }
      return 'Execute';
    }
  },
  methods: {
    handleTabSelected(selectedTabValue) {
      this.activeContentKey = selectedTabValue;
      console.log('Tab selected:', selectedTabValue);
    },
    async handleActionButtonClick() {
      console.log('--- 准备提交表单 ---'); 
      console.log('当前激活内容键 (activeContentKey):', this.activeContentKey); 

      if (this.activeContentKey === 'sales_and_dist' || !this.activeContentKey) {
        // 如果是查询页面，执行查询操作
        await this.performBusinessPartnerSearch();
      } else if (['person', 'group', 'org'].includes(this.activeContentKey)) {
        // 如果是创建页面，执行创建操作
        await this.createBusinessPartner(this.activeContentKey);
      }
      console.log('--- 表单提交流程结束 ---'); 
    },
     async performBusinessPartnerSearch() {
      console.log('执行业务伙伴查询...');
      // 从 customerQueryTree 获取查询数据
      const queryData = this.customerQueryTree.root?.currentValue;
      console.log('提交的查询数据结构:', JSON.stringify(queryData, null, 2)); // 在这里打印查询表单结构

      // 示例：调用查询接口
      try {
        const response = await fetch(`${API_BASE_URL}/api/app/bp-search`, {
          method: 'POST', // 或 GET，取决于你的API设计
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryData),
        });
        const result = await response.json();
        console.log('查询结果:', result);
        // 这里可以处理查询结果，例如显示在页面上
      } catch (error) {
        console.error('业务伙伴查询失败:', error);
      }
    },
    // 创建业务伙伴的通用函数
    async createBusinessPartner(type) {
      console.log(`执行创建 ${type} 业务伙伴...`);
      // 从 customerCreateTree 获取创建数据
      const createData = this.customerCreateTree.root?.currentValue;
      
      // !!! 新增逻辑：根据创建类型添加 'title' 属性 !!!
      if (createData && createData.customer) { // 确保 test 字典存在
          createData.customer.type = type;
      } else if (createData) {
          createData.customer = { type: type };
      } else { 
          createData = { customer: { type: type } };
      }
      
      console.log(`提交的创建 (${type}) 数据结构:`, JSON.stringify(createData, null, 2)); // 在这里打印创建表单结构

      let apiUrl = `${API_BASE_URL}/api/app/bp-create`;

      // 示例：调用创建接口
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createData),
        });
        const result = await response.json();
        console.log('创建结果:', result);
        // 这里可以处理创建结果，例如显示成功消息或重定向
        if (result.success) {
          alert(`成功创建 ${type} 业务伙伴！`);
          // 可选：创建成功后清空表单
          // this.customerCreateTree.root.currentValue = {};
        } else {
          alert(`创建 ${type} 业务伙伴失败: ${result.message || '未知错误'}`);
        }
      } catch (error) {
        console.error(`创建 ${type} 业务伙伴失败:`, error);
        alert(`创建 ${type} 业务伙伴时发生网络错误！`);
      }
    }
  }
};
</script>

<style scoped>
.maintain-business-partner-view {
display: flex;
flex-direction: column;
min-height: 100vh;
background-color: #25484C;
width:100%
}

.page-content {
flex-grow: 1;
background-color: #e6e5d8;
padding: 20px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
display: flex;
flex-direction: column;
align-items: center;
padding-top: 0px; /* 调整顶部内边距 */
}

.business-partner-search {
display: flex;
flex-direction: column;
align-items: flex-start;
background-color: transparent;
padding: 30px;
border-radius: 8px;
width: 100%;
max-width: 600px;
}

.business-partner-search label {
margin-bottom: 10px;
font-weight: bold;
color: #25484C;
}


.input-with-icon {
display: flex;
width: 100%;
align-items: center;
}
.bp-input-var-input {
  flex-grow: 1;
  background-color: #e6e5d8;
}

/* 搜索按钮的样式 */
.bp-search-button {
  background-color: var(--btn-default-bg);
  border: 1px solid #ccc;
  padding: 10px 15px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.bp-search-button:hover {
  background-color: var(--btn-hover-bg); /* 鼠标悬停时，按钮区域显示浅灰色背景 */
  border-radius: 4px; /* 让按钮在悬停时也有圆角 */
  border:1px solid #ccc; /* 添加边框 */
}

.bp-input {
flex-grow: 1;
padding: 12px 15px;
border: 1px solid #ccc;
border-radius: 4px;
font-size: 1em;
margin-right: 10px;
box-sizing: border-box;
}

.bottom-actions {
display: flex;
justify-content: flex-end;
padding: 40px 20px;
background-color: #25484c;
}

.search-enter-button {
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

.search-enter-button:hover {
background-color: #d1d0c4;
}

/* 其他占位内容的样式 */
.page-content > div {
padding: 20px;
background-color: #e6e5d8;
border-radius: 4px;
}
</style>