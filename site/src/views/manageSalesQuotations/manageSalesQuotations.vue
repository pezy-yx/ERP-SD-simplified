<script setup lang="ts">
import { ref } from 'vue';
import AppContent from '@/components/applicationContent/AppContent.vue';
import VarBox from '@/components/varbox/VarBox.vue';
import {
    cns,
    createTreeFromConfig,
    createNodeFromConfig,
    isNodeStructure,
    NodeStructure
} from '@/utils/VarTree';
import { toRaw } from 'vue';

interface QuotationData {
    salesQuotation: number;
    soldToParty: string;
    customerReference: string;
    overallStatus: string;
    latestExpiration: string;
    id?: number | string; 
}

interface QuotationNodeStructure extends NodeStructure {
    currentValue: QuotationData;
}

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '';
const appContentRef = ref(null) as any;

// 查询条件树
const queryTree = createTreeFromConfig(
    cns('dict', 'dict', 'query', {}, false, {}, [
        cns('number','leaf','salesQuotation','', false, {searchMethods: null}, [], 'Sales Quotation:'),
        cns('string', 'leaf', 'soldToParty', '', false, {searchMethods: null}, [], 'Sold-To Party:'),
        cns('string', 'leaf', 'customerReference', '', false, {}, [], 'Customer Reference:'),
        cns('selection', 'leaf', 'overallStatus', '', false, {
            options: [
                'New',
                'Open',
                'In Process',
                'Completed',
            ]
        }, [], 'Overall Status:'),
        cns('date','leaf','latestExpiration','', false, {}, [], 'Latest Expiration:'),
    ])
);

// 报价单详细信息树
const quotationTree = createTreeFromConfig(
    cns('dict', 'dict', 'quotation', {}, false, {}, [])
);

// 存储查询结果的响应式变量
const searchResults = ref<QuotationData[]|null>(null);

const searchResultsTree = ref(null)

const quotationDetail = ref<QuotationNodeStructure | null>(null);

function getStatusClass(status: string) {
    if (!status) return '';
    switch (status.toLowerCase()) {
        case 'new': return 'status-new';
        case 'open': return 'status-open';
        case 'in process': return 'status-in-process';
        case 'completed': return 'status-completed';
        default: return '';
    }
}

function formatDate(dateString: string) {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
        return dateString;
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function viewDetails(quotation: QuotationData) {
    // 明确地指定 response 的类型
    const response: QuotationNodeStructure | null = await fetchQuotationDetails(quotation.salesQuotation);

    if (response) {
        quotationDetail.value = response;
        appContentRef.value.goToStage(1);
        
        alert(`成功获取到ID为${quotationDetail.value.currentValue.salesQuotation}的详情`);
    } else {
        alert('无法获取报价单详情或数据格式不正确！');
    }
}

// 修改 fetchQuotationDetails 的返回类型
async function fetchQuotationDetails(id: number): Promise<QuotationNodeStructure | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/quotation/details/${id}`, {
            method: 'GET'
        }).then(res => res.json());

        if (response.success && response.data?.quotationStruct) {
            return response.data.quotationStruct;
        } else {
            console.error('API responded with an error:', response.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching quotation details:', error);
        return null;
    }
}



/**
 * 处理“Go”按钮的点击事件，专门负责搜索。
 */
async function handleSearch() {
    const queryData = queryTree.root?.currentValue;
    
    // 使用 try...catch 捕获可能的网络或解析错误
    try {
        const response = await fetch(`${API_BASE_URL}/api/quotation/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(queryData),
        }).then(res => res.json());

        // 打印整个响应对象
        console.log('API Response:', response);

        // 检查 `success` 字段的值
        console.log('response.success:', response.success);

        // 检查 `isNodeStructure` 的返回值
        const isStructureValid = isNodeStructure(response.data?.quotationStruct);
        console.log('isNodeStructure result:', isStructureValid);

        if (response.success && isNodeStructure(response.data?.quotationStruct)) {
            const currentValue = response.data.quotationStruct.currentValue;
            let results: QuotationData[] = [];

            if (Array.isArray(currentValue)) {
                // 如果后端返回的是一个数组，就直接使用它
                results = currentValue as QuotationData[];
            } else if (currentValue && typeof currentValue === 'object') {
                // 如果后端返回的是一个对象（即单条记录），就把它放到数组里
                results = [currentValue as QuotationData];
            }
            
            searchResults.value = results;
            searchResultsTree.value = response.data.quotationStruct;

            alert(`查询成功，共找到 ${results.length} 条报价单！`);
        } else {
            alert('未找到报价单信息!');
            searchResults.value = null;
            searchResultsTree.value = null;
        }
    } catch (error) {
        // 捕获网络或其他错误
        console.error('An error occurred during search:', error);
        alert('请求失败，请检查网络或服务器');
    }
}

/**
 * 处理“下一步”按钮的点击事件，只负责页面切换。
 */
async function handleExecute(currentStage: number, targetStage: number) {
    if (currentStage === 0) {
        if (searchResultsTree.value) {
            quotationTree.setRoot(createNodeFromConfig(searchResultsTree.value));
            return true;
        } else {
            alert('请先点击 Go 按钮查询报价单');
            return false;
        }
    }

    if (currentStage === 1) {
        const body = {
            quotation: quotationTree.root?.currentValue
        };
        const res = await fetch(`${API_BASE_URL}/api/quotation/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(r => r.json());

        if (res.success) {
            appContentRef.value.footerMessage = `报价单${quotationDetail.value?.currentValue.salesQuotation}更新成功!`;
        } else {
            alert('保存失败');
        }
        return false;
    }
    return false;
}

/**
 * 处理“取消”或“返回”的点击事件。
 */
async function handleCancel(currentStage: number, targetStage: number) {
    if (currentStage === 1) {
        return confirm('确定取消修改？');
    }
    return true;
}
</script>

<template>
    <div class="manageSalesQuotations">
        <AppContent
        ref="appContentRef"
        :stages="['initialScreen', 'quotationDetail']"
        :before-next="handleExecute"
        :before-prev="handleCancel"
        :footer-config="[
            { nextText: 'Create new quotation' },
            { prevText: 'Cancel', nextText: 'Save' }
        ]"
    >
        <template #stage-initialScreen>
            <VarBox :tree="queryTree" />
            <button class="go-btn" @click="handleSearch">Go</button>
            
            <div v-if="searchResults && searchResults.length > 0" class="search-results-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sales Quotation</th>
                            <th>Sold-To Party</th>
                            <th>Customer Reference</th>
                            <th>Overall Status</th>
                            <th>Latest Expiration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="quotation in searchResults" :key="quotation.salesQuotation">
                            <td>{{ quotation.salesQuotation }}</td>
                            <td>{{ quotation.soldToParty }}</td>
                            <td>{{ quotation.customerReference }}</td>
                            <td>
                                <span :class="['status-badge', getStatusClass(quotation.overallStatus)]">
                                    {{ quotation.overallStatus }}
                                </span>
                            </td>
                            <td>
                                {{ formatDate(quotation.latestExpiration) }}
                            </td>
                            <td>
                                <button class="detail-btn" @click="viewDetails(quotation)">View Details</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>请点击“Go”按钮查询报价单。</p>
            </div>
        </template>     

        <template #stage-quotationDetail>
            <VarBox v-if="quotationTree.root" :tree="quotationTree" />
            <div v-else class="no-data-message">
                <p>没有找到报价单详情。</p>
            </div>
        </template>

        <template #footer-content-right>
            {{ appContentRef?.getCurrentStageName() }}
        </template>
    </AppContent>
    </div>
</template>

<style scoped>
.manageSalesQuotations {
    max-height: 90vh;
    overflow-y: auto;
}

.go-btn {
    margin-left: auto;
    padding: 5px 10px;
    border: 2px solid transparent;
    border-radius: 5px;
    background-color: var(--btn-default-bg);
    color:var(--btn-default-text);
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    cursor:default;
    transition: all 0.3s ease;
}

.go-btn:hover {
    background-color: var(--btn-hover-bg);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    color: var(--btn-hover-text);
}

.go-btn:active {
    background-color: var(--btn-active-bg);
    box-shadow: 0 2px 4px var(--btn-active-shadow);
    transform: translateY(0);
}

.go-btn:focus {
    border-color: var(--btn-focus-border);
    box-shadow: 0 0 0 0.2rem var(--btn-focus-shadow);
}
</style>

<style scoped>
.go-btn {
    margin-left: auto;
    padding: 5px 10px;
    border: 2px solid transparent; /* 初始透明边框 */
    border-radius: 5px;
    background-color: var(--btn-default-bg); 
    color:var(--btn-default-text);
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    cursor:default;
    transition: all 0.3s ease; /* 平滑过渡所有属性 */
}

.go-btn:hover {
    background-color: var(--btn-hover-bg); /* 悬停时改变背景色 */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 悬停时加深阴影 */
    transform: translateY(-2px); /* 悬停时轻微上浮 */
    color: var(--btn-hover-text); /* 悬停时改变文字颜色 */
}

.go-btn:active {
    background-color: var(--btn-active-bg); /* 点击时改变背景色 */
    box-shadow: 0 2px 4px var(--btn-active-shadow);
    transform: translateY(0); /* 点击时恢复位置 */
}

.go-btn:focus {
    border-color: var(--btn-focus-border); /* 获得焦点时显示蓝色边框 */
    box-shadow: 0 0 0 0.2rem var(--btn-focus-shadow); /* 焦点光晕 */
}

.detail-btn {
    margin-left: auto;
    padding: 5px 10px;
    border: 2px solid transparent; /* 初始透明边框 */
    border-radius: 5px;
    background-color: transparent; 
    color:var(--btn-default-text);
    font-size: 16px;
    text-align: center;
    cursor:default;
    transition: all 0.3s ease; /* 平滑过渡所有属性 */
}

.detail-btn:hover {
    background-color: var(--btn-hover-bg); /* 悬停时改变背景色 */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 悬停时加深阴影 */
    transform: translateY(-2px); /* 悬停时轻微上浮 */
    color: var(--btn-hover-text); /* 悬停时改变文字颜色 */
}

.detail-btn:active {
    background-color: var(--btn-active-bg); /* 点击时改变背景色 */
    box-shadow: 0 2px 4px var(--btn-active-shadow);
    transform: translateY(0); /* 点击时恢复位置 */
}

.detail-btn:focus {
    border-color: var(--btn-focus-border); /* 获得焦点时显示蓝色边框 */
    box-shadow: 0 0 0 0.2rem var(--btn-focus-shadow); /* 焦点光晕 */
}

/* 添加到你的 <style scoped> 中 */

/* 包裹表格的容器，增加一些空间和阴影 */
.search-results-table-container {
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden; /* 确保圆角和阴影效果正确 */
}

/* 表格主体样式 */
table {
    width: 100%;
    border-collapse: collapse; /* 合并单元格边框 */
    font-family: Arial, sans-serif;
    font-size: 14px;
}

/* 表头样式 */
thead {
    background-color: #f0f4f8; /* 浅灰色背景 */
    color: #4a5568; /* 深色文字 */
    font-weight: 600;
    text-transform: uppercase; /* 字母大写 */
    letter-spacing: 0.5px;
}

th, td {
    padding: 12px 15px; /* 增加内边距 */
    text-align: left;
    border-bottom: 1px solid #e2e8f0; /* 柔和的底部边框线 */
}

/* 斑马纹效果，让行更易读 */
tbody tr:nth-child(even) {
    background-color: #f7fafc; /* 偶数行使用浅色背景 */
}

/* 行悬停效果 */
tbody tr:hover {
    background-color: #ebf4ff; /* 悬停时使用更亮的蓝色背景 */
    cursor: pointer;
    transform: scale(1.005); /* 轻微放大，增加交互感 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease-in-out;
}

/* 按钮样式 */
.view-details-btn {
    padding: 6px 12px;
    border: 1px solid #4299e1; /* 蓝色边框 */
    border-radius: 4px;
    background-color: #4299e1; /* 蓝色背景 */
    color: #ffffff; /* 白色文字 */
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.view-details-btn:hover {
    background-color: #2b6cb0; /* 悬停时颜色变深 */
    border-color: #2b6cb0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.view-details-btn:active {
    background-color: #1a4f80; /* 点击时颜色更深 */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

/* 调整 StatusBadge 的位置，让其在单元格内居中对齐 */
td .status-badge {
    display: flex;
    justify-content: left;
    align-items: center;
}
</style>
