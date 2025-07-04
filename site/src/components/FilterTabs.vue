<template>
  <div class="filter-tabs-container">
    <div class="horizontal-line top-line"></div>

    <div class="filter-tabs-row">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab-button', { 'active': activeTab === tab.value }]"
        @click="selectTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="horizontal-line bottom-line"></div>
  </div>
</template>

<script>
export default {
  name: 'FilterTabs', // 组件名称
  props: {
    // 标签按钮的配置数组
    tabs: {
      type: Array,
      required: true,
      default: () => [
        { label: 'sales and dist', value: 'sales_and_dist' },
        { label: 'person', value: 'person' },
        { label: 'group', value: 'group' },
        { label: 'org', value: 'org' },
        { label: 'company code', value: 'company_code' },
        { label: 'more', value: 'more' },
      ]
    },
    // 初始选中的标签值
    initialActiveTab: {
      type: String,
      default: 'sales_and_dist' // 默认选中第一个
    }
  },
  data() {
    return {
      activeTab: this.initialActiveTab, // 当前激活的标签
    };
  },
  watch: {
    // 监听 initialActiveTab 变化，外部可以控制激活状态
    initialActiveTab(newValue) {
      this.activeTab = newValue;
    }
  },
  methods: {
    selectTab(tabValue) {
      if (this.activeTab !== tabValue) {
        this.activeTab = tabValue;
        // 向父组件发出事件，通知当前选中的标签值
        this.$emit('tab-selected', tabValue);
        console.log('Tab selected:', tabValue);
      }
    }
  },
  // 在组件创建后，立即发出初始选中的标签
  created() {
    this.$emit('tab-selected', this.activeTab);
  }
};
</script>

<style scoped>
.filter-tabs-container {
  width: 100%;
  background-color: #25484c; /* 与导航栏相同的深绿色背景 */
  padding-bottom: 5px; /* 留出横线和按钮之间的空间 */
}

.horizontal-line {
  height: 2px; /* 横线高度 */
  background-color: rgba(255, 255, 255, 0.3); /* 白色半透明横线 */
  margin: 0 20px; /* 两侧留白，与导航栏padding对应 */
}

.top-line {
  margin-bottom: 10px; /* 上横线与按钮行的间距 */
}

.bottom-line {
  margin-top: 10px; /* 下横线与按钮行的间距 */
}

.filter-tabs-row {
  display: flex;
  justify-content: flex-start; /* 按钮靠左对齐 */
  padding: 0 20px; /* 与横线对齐 */
  gap: 10px; /* 按钮之间的间距 */
  flex-wrap: wrap; /* 允许按钮换行，以防内容过多 */
}

.tab-button {
  background-color: rgba(255, 255, 255, 0.1); /* 默认按钮的半透明背景 */
  color: #e6e5d8; /* 按钮文字颜色 */
  border: none;
  border-radius: 5px; /* 轻微圆角 */
  padding: 8px 15px;
  cursor: pointer;
  font-size: 0.9em;
  white-space: nowrap; /* 防止按钮文字换行 */
  transition: background-color 0.3s ease, color 0.3s ease;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.tab-button:hover {
  background-color: rgba(255, 255, 255, 0.2); /* 鼠标悬停效果 */
}

.tab-button.active {
  background-color: #e6e5d8; /* 选中状态的浅色背景 */
  color: #3b5952; /* 选中状态的深色文字 */
  font-weight: bold;
}
</style>