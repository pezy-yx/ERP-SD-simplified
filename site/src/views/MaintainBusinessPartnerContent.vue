<template>
 <div class="maintain-business-partner-content">
   <FilterTabs :tabs="businessPartnerTabs" @tab-selected="handleTabSelected"/>

<div class="page-content">
  <div v-if="activeContentKey === 'sales_and_dist' || !activeContentKey" class="business-partner-search">
    <label for="businessPartnerInput">Business Partner:</label>
    <div class="input-with-icon">
      <var-input
        :tree="customerQueryTree"
        :nodePath="[]"
        class="bp-input-var-input"
      />
      
      <button class="bp-search-button" @click="performBusinessPartnerSearch">
        <img src="../assets/search-plus.png" alt="Search" class="search-icon" />
      </button>

      </div>
  </div>

  <AdvancedSearchModal
    v-if="showAdvancedSearchModal"
    @close="toggleAdvancedSearchModal"
  />
</div>

   <div class="bottom-actions">
     <button class="search-enter-button" @click="performBusinessPartnerSearch">Enter</button>
   </div>
 </div>
</template>

<script>
import FilterTabs from '@/components/FilterTabs.vue';
import AdvancedSearchModal from '@/components/AdvancedSearchModal.vue'; // 引用高级搜索弹窗组件
import { VarTree, createTreeFromConfig, cns } from '../utils/VarTree';
// 导入 VarInput 组件
import VarInput from '../components/varbox/VarBox.vue';

const customerQueryStructure = cns(
  "string", "leaf", "customer_id", null, false, {
    validators: [
      {
        creteria: (val) => typeof val === 'string' && /^\d{6}$/.test(val),
        message: "客户ID必须是六位数字"
      }
    ]
  }
);

export default {
  name: 'MaintainBusinessPartnerContent',
  components: {
    FilterTabs,
    AdvancedSearchModal, // 注册高级搜索弹窗组件
    VarInput // 注册 VarInput 组件，以便在模板中使用
  },
  data() {
    return {
      activeContentKey: '',
      businessPartnerTabs: [
        { label: 'sales and dist', value: 'sales_and_dist' },
        { label: 'person', value: 'person' },
        { label: 'group', value: 'group' },
        { label: 'org', value: 'org' },
        { label: 'company code', value: 'company_code' },
        { label: 'more', value: 'more' },
      ],
      businessPartnerQuery: '', // 绑定业务伙伴查询输入框（如果不再使用，可以删除）
      showAdvancedSearchModal: false, // 控制高级搜索弹窗的显示
      advancedSearchCriteria: {}, // 存储高级搜索条件
      // -----------------------------------------------------------
      // 新增或修改的部分：为客户ID查询创建 VarTree 实例
      // -----------------------------------------------------------
      customerQueryTree: createTreeFromConfig(customerQueryStructure),
    };
  },
  methods: {
    handleTabSelected(tabValue) {
      this.activeContentKey = tabValue;
    },
    toggleAdvancedSearchModal() {
      this.showAdvancedSearchModal = !this.showAdvancedSearchModal;
    },
    applyAdvancedSearch(criteria) {
      this.advancedSearchCriteria = criteria;
      this.showAdvancedSearchModal = false;
      console.log('应用高级搜索条件:', criteria);
      // 注意：这里可能需要调整，高级搜索如果也是通过 VarTree 管理，则逻辑会有不同
      // 这里为了兼容性，暂时保持原样，但高级搜索的实现可能也需要一个独立的 VarTree
      this.performBusinessPartnerSearch(true); // 执行带高级搜索的查询
    },
    // -----------------------------------------------------------
    // 修改 performBusinessPartnerSearch 方法来从 VarTree 中获取值并进行验证
    // -----------------------------------------------------------
    performBusinessPartnerSearch(isAdvanced = false) {
      // 从 customerQueryTree 中获取客户ID的值
      const customerId = this.customerQueryTree.root?.currentValue;

      // 执行 VarTree 内部的验证
      const isValid = this.customerQueryTree.root?.validateAll();
      if (!isValid) {
        alert('客户ID格式不正确，请检查！');
        console.error('验证失败:', this.customerQueryTree.root?.getAllErrors());
        return; // 验证失败，停止搜索
      }

      console.log(`执行客户ID查询: ${customerId}`, '高级搜索:', isAdvanced ? this.advancedSearchCriteria : '否');
      // TODO: 在这里添加实际的查询逻辑，使用 customerId 进行 API 调用
      alert(`执行业务伙伴搜索: ${customerId} (高级: ${isAdvanced ? JSON.stringify(this.advancedSearchCriteria) : '否'})`);
    }
  }
};
</script>

<style scoped>
.maintain-business-partner-content {
 display: flex;
 flex-direction: column;
 min-height: 100vh;
 /* 背景色由Application.vue提供 */
}

.page-content {
 flex-grow: 1;
 background-color: #e6e5d8;
 padding: 20px;
 margin: 20px;
 border-radius: 8px;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
 display: flex;
 flex-direction: column;
 align-items: center;
 padding-top: 50px; /* 调整顶部内边距 */
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

.bp-input-var-input :deep(.var-input--main input) {
  width: 100%; /* 让内部输入框占据 VarInput 容器的全部宽度 */
  padding: 12px 15px; /* 设置内边距，与你原有的 bp-input 保持一致 */
  border: none; /* 移除 VarInput 内部可能有的默认边框，因为它由 .input-with-icon 提供 */
  outline: none; /* 移除焦点时的默认轮廓 */
  background-color: transparent; 
  
  font-size: 1em; /* 字体大小 */
  color: #333; /* 常用深灰色，如果你的其他文本颜色不同，请调整 */
}

/* 搜索按钮的样式 */
.bp-search-button {
  background-color: #25484C;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.bp-search-button:hover {
  background-color: #9897BC; /* 鼠标悬停时，按钮区域显示浅灰色背景 */
  border-radius: 4px; /* 让按钮在悬停时也有圆角 */
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

.search-icon {
 width: 16px;
 height: 16px;
 object-fit: contain;
 /* 这里不需要反转颜色，因为按钮背景是浅色 */
}

.bottom-actions {
 display: flex;
 justify-content: flex-end;
 padding: 15px 20px;
 background-color: #25484c;
}

.search-enter-button {
 background-color: #e6e5d8;
 color: #25484c;
 border: none;
 border-radius: 5px;
 padding: 10px 20px;
 font-size: 1em;
 cursor: pointer;
 transition: background-color 0.3s ease;
}

.search-enter-button:hover {
 background-color: #d1d0c4;
}

/* 其他占位内容的样式 */
.page-content > div {
 margin: 20px;
 padding: 20px;
 background-color: #e6e5d8;
 border-radius: 4px;
}
</style>