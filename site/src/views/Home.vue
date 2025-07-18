<template>
    <div class="home-page-layout">
        <NavigationBar :pageTitle="currentPageTitle" @search="handleGlobalSearch"/>

        <div class="home-content">
            <div class="horizontal-line top-line"></div>
                <div class="app-dashboard-container">
                    <div class="app-categories">
                        <div v-for="categoryNode in appCategories" :key="categoryNode.name" class="app-category">
                            <h3>{{ <string>(categoryNode.name) }}</h3>
                            <div class="app-list">
                                <SingleApp
                                    v-for="app in categoryNode.children"
                                    :key="app.name"
                                    :pageName="app.name"
                                    :pagePath="`/application/${app.name.toLowerCase().replace(/\s/g, '-')}`"
                                    :iconPath="app.iconPath"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>

<script lang="ts" setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SingleApp from '@/components/SingleApp.vue'; // 导入 SingleApp 组件
import { ref, computed, watch } from 'vue';
import { VarTree, createTreeFromConfig, cns, validators } from '@/utils/VarTree'; // 导入 VarTree 相关的工具函数
import { useRoute } from 'vue-router'; // 导入 useRoute 用于路由相关的标题更新
import { iconProps } from 'element-plus';

// 现有功能保持不变
const currentPageTitle = ref('Sales and Distribution');

function handleGlobalSearch(query: string) {
    console.log('全局搜索:', query);
    // 处理全局搜索逻辑
    // 可以通过事件总线或状态管理传递给子组件
}

// 定义 VarTree 结构来管理应用类别和每个类别下的应用列表
const appTree = createTreeFromConfig({
    varType: 'dict', // 根节点类型
    nodeType: 'dict', // 根节点类型
    name: 'appCategories', // 根节点名称
    children: [
        // 客户管理类别
        cns('dict', 'dict', 'Customers', null, true, {}, [
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Maintain Business Partner',
                readonly: true,
                iconPath: '@/assets/icons/maintain-BP.svg', 
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Create BP Relationship',
                readonly: true,
                iconPath: '@/assets/icons/create-BP-relationship.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Display BP Relationship',
                readonly: true,
                iconPath: '@/assets/icons/create-BP-relationship.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Change BP Relationship',
                readonly: true,
                iconPath: '@/assets/icons/create-BP-relationship.svg',
            },
        ], 'Customer Management'),
        
        //订单管理
        cns('dict', 'dict', 'Orders', null, true, {}, [
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Create Inquiry',
                readonly: true,
                iconPath: '@/assets/icons/create-inquiry.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Display Inquiry',
                readonly: true,
                iconPath: '@/assets/icons/create-inquiry.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Change Inquiry',
                readonly: true,
                iconPath: '@/assets/icons/create-inquiry.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Manage Sales Quotations',
                readonly: true,
                iconPath: '@/assets/icons/manage-sales-quotations.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Manage Sales Orders',
                readonly: true,
                iconPath: '@/assets/icons/manage-sales-orders.svg',
            },
        ], 'order management'),
        
        //物流管理
        cns('dict', 'dict', 'Logistics', null, true, {}, [
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Create Outbound Delivery',
                readonly: true,
                iconPath: '@/assets/icons/create-outbound-deliveries.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Pick Outbound Delivery',
                readonly: true,
                iconPath: '@/assets/icons/create-outbound-deliveries.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Manage Outbound Deliveries',
                readonly: true,
                iconPath: '@/assets/icons/manage-outbound-deliveries.svg',
            }
        ], 'logistics management'),

        //财务管理
        cns('dict', 'dict', 'Finance', null, true, {}, [
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Create Billing Documents',
                readonly: true,
                iconPath: '@/assets/icons/create-billing-documents.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Posting Incoming Payments',
                readonly: true,
                iconPath: '@/assets/icons/posting-incoming-payments.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Material Documents Overview',
                readonly: true,
                iconPath: '@/assets/icons/material-documents-overview.svg',
            }
        ], 'finance management'),
    ]
});
console.log('应用树结构:', appTree.getRoot()?.children);
// 计算属性，用于在模板中方便地遍历所有类别节点
const appCategories = computed(() => appTree.getRoot()?.children);

// -- END NEW CONTENT --

// 保持原有的标题更新逻辑，可以根据 Home 页面作为应用入口来设置。
// 由于 Home 页面现在自身承载内容，我们可以固定其标题，或根据需要从路由 meta 获取
const route = useRoute();
watch(() => route.path, () => {
    // 如果 Home 页面本身是顶层路由，通常其标题是固定的
    // 但如果你希望它能响应路由 meta，可以这样写：
    const routeMeta = route.meta;
    if (routeMeta && routeMeta.title) {
        currentPageTitle.value = routeMeta.title as string;
    } else {
        currentPageTitle.value = 'Sales and Distribution'; // 默认标题
    }
}, { immediate: true }); // immediate 确保组件加载时立即执行一次

</script>

<style scoped>
.home-page-layout {
    width: 100%;
    min-height: 100vh;
    height: 100vh;
    max-height: 100vh;
    background-color: var(--theme-color-dark);
    display: flex; /* 让导航栏和内容区能够垂直排列 */
    flex-direction: column;
}

.home-content{
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* 让 home-content 占据除了导航栏外的所有可用垂直空间 */
    background-color: var(--theme-color-dark);
    width: 100%;
    padding: 20px; /* 为内容添加整体内边距 */
    box-sizing: border-box; /* 确保 padding 不会增加总宽度 */
    overflow-y: auto; /* 当内容超出时允许垂直滚动 */
}

.horizontal-line {
  height: 2px; /* 横线高度 */
  background-color: rgba(255, 255, 255, 0.3); /* 白色半透明横线 */
  margin: 0 0 20px 0; /* 仅在底部留白，因为 home-content 已经有左右 padding */
}

.app-dashboard-container {
  padding-top: 20px; /* 与上方横线和页面标题的间距 */
  flex-grow: 1; /* 让仪表盘容器占据剩余空间 */
  background-color: var(--theme-color-page);
  border-radius: 10px;
}

h2 {
    font-size: 2em;
    margin-bottom: 30px;
    text-align: center;
    color: var(--theme-color-text); /* 主要文字颜色，假设已全局定义 */
}

.app-categories {
    display: flex;
    flex-wrap: wrap; /* 允许分类容器在空间不足时换行 */
    gap: 10px; /* 各个分类容器之间的间距 */
    justify-content: center; /* 让分类容器在主轴（水平方向）上居中 */
    align-items: flex-start; /* 确保所有分类从顶部对齐 */
    min-height: auto;
}

.app-category {
    padding-top: 25px;
    padding-bottom: 25px;
    display: flex;
    flex-direction: column; /* 分类内的应用 (SingleApp) 竖向排列 */
    gap: 15px; /* 分类内各个 SingleApp 之间的间距 */
    min-width: 280px; /* 确保每个分类有最小宽度 */
    max-width: 400px; /* 限制分类容器的最大宽度 */
    flex: 1; /* 允许分类容器在 Flex 容器中伸缩，但会尝试占据等量空间 */
    min-height: auto;
}

h3 {
    font-size: 1.5em;
    color: var(--theme-color-dark); /* 分类标题的颜色 */
    text-align: center;
    padding-bottom: 10px;
}

.app-list {
    display: flex;
    flex-direction: column; /* 应用列表（SingleApp 集合）竖向排列 */
    align-items: center; /* 列表内的应用居中对齐 */
    gap: 25px; /* 列表内各个 SingleApp 之间的间距 */
}

/* 默认图标样式，确保它在 SingleApp 内部的 icon 插槽中正确显示 */
.default-icon {
    width: 100%; /* 填充 SingleApp 的图标容器 */
    height: 100%;
    object-fit: contain; /* 保持图片比例 */
    filter: grayscale(100%) brightness(150%); /* 示例：默认图标可以灰度化并提亮 */
}

</style>