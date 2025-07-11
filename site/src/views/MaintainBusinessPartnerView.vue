<template>
  <div class="maintain-business-partner-view">
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
          </div>
      </div>
    </div>
    <div class="bottom-actions">
      <button class="search-enter-button" @click="performBusinessPartnerSearch">Enter</button>
    </div>
  </div>
</template>

<script>
import FilterTabs from '@/components/FilterTabs.vue';
import { VarTree, createTreeFromConfig, cns } from '../utils/VarTree';
// 导入 VarInput 组件
import VarInput from '../components/varbox/VarBox.vue';

// -----------------------------------------------------------
// 定义客户ID的 NodeStructure（放在组件定义之外，因为它是一个静态配置）
// -----------------------------------------------------------
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
  name: 'MaintainBusinessPartnerView',
  components: {
    FilterTabs,
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
      customerQueryTree: createTreeFromConfig(customerQueryStructure),
    };
  },
  methods: {
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