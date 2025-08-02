<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
let API_BASE_URL = window.API_BASE_URL || '';
onMounted(() => {
  API_BASE_URL = window.API_BASE_URL || ''
})

const journalEntryNumber = ref<string | null>(null);
const journalEntryDetails = ref<JournalEntryDetailData | null>(null); // 明确类型
const isLoading = ref(true);
const error = ref<string | null>(null);

// >>> 修改：更新 JournalEntryDetailData 接口以匹配新的后端结构 <<<
interface LineItem {
    postingViewItem: string;
    glAccount: string;
    credit: string; // 根据您的mock，这些是字符串，如果实际是数字，请改为 number
    debit: string;  // 根据您的mock，这些是字符串，如果实际是数字，请改为 number
    currency: string;
}

interface JournalEntryDetailData {
    journalEntryId: string;
    companyCode: string;
    account: string;
    journalEntryType: string;
    journalEntryDate: string;
    postingDate: string;
    postingPeriod: string;
    amount: string; // 根据您的mock，这里是字符串，如果实际是数字，请改为 number
    assignment: string;
    currency: string;
    createdBy: string;
    lineItems: { // 现在 lineItems 是一个对象
        [key: string]: LineItem; // 键是 'item1', 'item2' 等，值是 LineItem 类型
    };
}
// >>> 修改结束 <<<

onMounted(async () => {
    journalEntryNumber.value = route.params.id as string;

    if (!journalEntryNumber.value) {
        error.value = 'Journal Entry Number not provided.';
        isLoading.value = false;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/finance/journalEntryDetails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ journalEntryId: journalEntryNumber.value })
        });

        if (!response.ok) {
            console.log("no ok");
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.success && result.data) {
            journalEntryDetails.value = result.data as JournalEntryDetailData;
        } else {
            error.value = result.message || 'Failed to load journal entry details.';
        }
    } catch (e: any) {
        error.value = 'Error fetching details: ' + e.message;
        console.error(e);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
<div class="journal-entry-detail-page">
    <header class="detail-header">
    <h1>Journal Entry Details</h1>
    <p v-if="journalEntryNumber">For Journal Entry: <strong>{{ journalEntryNumber }}</strong></p>
    </header>

    <div v-if="isLoading" class="loading-state">
    Loading details...
    </div>

    <div v-else-if="error" class="error-state">
    <p>{{ error }}</p>
    <button @click="$router.go(-1)">Go Back</button>
    </div>

    <div v-else-if="journalEntryDetails" class="details-content">
    <section class="overview-section">
        <h3>Overview</h3>
        <div class="detail-grid">
        <div><strong>Journal Entry ID:</strong> {{ journalEntryDetails.journalEntryId }}</div>
        <div><strong>Company Code:</strong> {{ journalEntryDetails.companyCode }}</div>
        <div><strong>Account:</strong> {{ journalEntryDetails.account }}</div>
        <div><strong>Entry Type:</strong> {{ journalEntryDetails.journalEntryType }}</div>
        <div><strong>Journal Entry Date:</strong> {{ journalEntryDetails.journalEntryDate }}</div>
        <div><strong>Posting Date:</strong> {{ journalEntryDetails.postingDate }}</div>
        <div><strong>Posting Period:</strong> {{ journalEntryDetails.postingPeriod }}</div>
        <div><strong>Amount:</strong> {{ journalEntryDetails.amount }} {{ journalEntryDetails.currency }}</div>
        <div><strong>Assignment:</strong> {{ journalEntryDetails.assignment }}</div>
        <div><strong>Created By:</strong> {{ journalEntryDetails.createdBy }}</div>
        </div>
    </section>

    <section class="line-items-section">
        <h3>Line Items</h3>
        <div v-if="journalEntryDetails.lineItems" class="query-results-list" style="width: 100%;">
            <div class="material-document-rows-container">
                <div class="material-document-row-header">
                    <div class="header-item company-code">Posting View Item</div>
                    <div class="header-item account">G/L Account</div>
                    <div class="header-item journal-entry">Debit</div>
                    <div class="header-item journal-entry-type">Credit</div>
                    <div class="header-item journal-entry-date">Currency</div>
                    <div class="header-item"></div>
                </div>
                <div v-for="(item,index) in journalEntryDetails.lineItems" :key="index" class="material-document-row">
                    <span class="row-item company-code">{{ item.postingViewItem }}</span>
                    <span class="row-item account">{{ item.glAccount }}</span>
                    <span class="row-item journal-entry">{{ item.debit }}</span>
                    <span class="row-item journal-entry-type">{{ item.credit }}</span>
                    <span class="row-item journal-entry-date">{{ item.currency }}</span>
                    <span class="row-item arrow-icon">▶</span>
                </div>
            </div>
        </div>
    </section>

    <div class="actions-footer">
        <button @click="$router.go(-1)" class="btn">Back to Payment</button>
    </div>
    </div>
    <div v-else class="no-data-state">
    No details found.
    </div>
</div>
</template>

<style scoped>
/* ... (样式代码保持不变，如果需要调整表格列宽或间距，请自行调整) ... */
.journal-entry-detail-page {
height: 100%;
padding: 20px;
margin: 20px;
background-color: var(--theme-color-page);
border-radius: 8px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
min-height: calc(100vh - 80px); /* 确保页面有最小高度 */
}

.detail-header {
padding-bottom: 15px;
margin-bottom: 20px;
text-align: center;
}

.detail-header h1 {
color: var(--theme-color-dark);
margin-bottom: 5px;
}

.detail-header p {
color: #666;
font-size: 1.1em;
}

.loading-state, .error-state, .no-data-state {
text-align: center;
padding: 50px 0;
color: #888;
}

.error-state p {
    color: red;
    margin-bottom: 15px;
}

.detail-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 15px;
margin-bottom: 30px;
padding: 10px;
border-radius: 5px;
background-color: var(--theme-color-page);
}

.detail-grid div strong {
color: #333;
}

.detail-grid div {
    font-size: 0.95em;
    color: #555;
    margin-right: auto;
}

.actions-footer {
margin-top: 40px;
text-align: right;
border-top: 1px solid #eee;
padding-top: 20px;
}

.btn {
    min-width: 120px;
    display: inline-flex; /* 使内容居中更方便 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    padding: 8px 25px;
    border: 2px solid transparent; /* 初始透明边框 */
    border-radius: 5px;
    background-color: var(--btn-default-bg); 
    color:var(--btn-default-text);
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    text-decoration: none; /* 移除可能的下划线（如果是a标签）*/
    cursor:default;
    outline: none; /* 移除默认焦点轮廓 */
    transition: all 0.3s ease; /* 平滑过渡所有属性 */
}

.btn:hover {
    background-color: var(--btn-hover-bg); /* 悬停时改变背景色 */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 悬停时加深阴影 */
    transform: translateY(-2px); /* 悬停时轻微上浮 */
    color: var(--btn-hover-text); /* 悬停时改变文字颜色 */
}

.btn:active {
    background-color: var(--btn-active-bg); /* 点击时改变背景色 */
    box-shadow: 0 2px 4px var(--btn-active-shadow);
    transform: translateY(0); /* 点击时恢复位置 */
}

.btn:focus {
    border-color: var(--btn-focus-border); /* 获得焦点时显示蓝色边框 */
    box-shadow: 0 0 0 0.2rem var(--btn-focus-shadow); /* 焦点光晕 */
}

.query-results-list {
    width: 100%;
    font-size: 1em;
    color: var(--color-text-primary);
}

.material-document-rows-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.header-item, .row-item {
    align-self: center;
    padding: 0 10px; /* Add horizontal padding for text */
    box-sizing: border-box; /* Include padding in width calculation */
}

/* 调整列宽比例以适应新增的勾选框列 */
.checkbox-header, .checkbox-cell {
    flex-basis: 3%;
    text-align: center;
}
.company-code { flex-basis: 20%; text-align: center;}
.account { flex-basis: 20%; text-align: center;}
.journal-entry { flex-basis: 20%; text-align: center;}
.journal-entry-type { flex-basis: 18%; text-align: center;} /* 调整 */
.journal-entry-date { flex-basis: 18%; text-align: center;}
.arrow-icon { flex: 0 0 4%; text-align: right; padding-right: 20px;} /* 调整 */

.material-document-row-header,
.material-document-row {
    width: 100%;
    display: flex;
    align-items: center;
    /* border-bottom: 1px solid var(--theme-color-lighter); */
    padding: 8px 0; /* Add padding for better spacing */
    transition: all 0.3s ease; /* 添加过渡效果 */
}

.material-document-row {
    cursor: pointer; /* 将光标设置为指针，表示可点击 */
    position: relative; /* 确保 box-shadow 在堆叠上下文中正确显示 */
    transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.material-document-row:hover {
    background-color: var(--theme-color-lighter);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* 悬停时阴影更明显，模拟“浮起” */
    transform: translateY(-2px); /* 悬停时轻微上移，增加层次感 */
}

.material-document-row:active {
    /* 点击时下沉效果 */
    background-color: var(--theme-color-table-header-bg); /* 可以选择更深一点的颜色 */
    transform: translateY(1px); /* 向下移动1px，模拟“下沉” */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* 阴影变小或移除，模拟“压平” */
}
.material-document-row:last-child {
    border-bottom: none;
}

.material-document-row-header {
    background-color: var(--theme-color-table-header-bg);
    font-weight: bold;
    color: var(--theme-color-table-header-text);
}
</style>