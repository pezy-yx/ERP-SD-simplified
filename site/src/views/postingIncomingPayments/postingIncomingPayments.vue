<template>
    <AppContent
        :stages="['input','post']"
        :before-next="handleExecute"
        :before-prev="handleCancel"
        :after-next="handleAfterNext"
        :after-prev="handleAfterPrev"
        :footer-config="[
        { nextText: 'Propose items' },
        { prevText: 'Cancel', nextText: 'Post' },
        ]"
        ref="appContentRef"
    >
        <template #[`stage-input`]>
            <div class="total">
                <div id="generalInfo">
                    <VarBox
                        :tree="generalInfoTree!"
                        v-show="onInputState"
                    ></VarBox> 
                </div>
                <div id="bankData">
                    <VarBox
                        :tree="bankDataTree!"
                        v-show="onInputState"
                    ></VarBox>
                </div>
                <div id="openItemSelection">
                    <VarBox
                        :tree="openItemSelectionTree!"
                        v-show="onInputState"
                    ></VarBox>
                </div>
            </div>
        </template>
        <template #[`stage-post`]>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
                <div>
                    <span style="font-weight:bold">Open Items</span>
                </div>
                <div style="display: flex; justify-content: flex-end;">
                    <span style="font-weight:bold">Balance:&nbsp;&nbsp;{{balance + ' ' + balanceUnit}}</span>
                </div>  
            </div>
            <div v-if="openItems && openItems.length > 0" class="query-results-list" style="width: 100%;">
                <div class="material-document-rows-container">
                    <div class="material-document-row-header">
                        <div class="header-item checkbox-header">No.</div>
                        <div class="header-item company-code">Company Code</div>
                        <div class="header-item account">Account</div>
                        <div class="header-item journal-entry">Journal Entry</div>
                        <div class="header-item journal-entry-type">Journal Entry Type</div>
                        <div class="header-item journal-entry-date">Journal Entry Date</div>
                        <div class="header-item net-due-date">Net Due Date</div>
                        <div class="header-item amount">Amount</div>
                        <div class="header-item assignment">Assignment</div>
                        <div class="header-item"></div>
                    </div>
                    <div v-for="(item,index) in openItems" :key="index" class="material-document-row" @click="toggleRowSelection(item)">
                        <div class="row-item checkbox-cell">
                            <input type="checkbox" @click.stop v-model="item.selected">
                        </div>
                        <span class="row-item company-code">{{item.companyCode}}</span>
                        <span class="row-item account">{{item.account}}</span>
                        <span class="row-item journal-entry">{{item.journalEntry}}</span>
                        <span class="row-item journal-entry-type">{{item.journalEntryType}}</span>
                        <span class="row-item journal-entry-date">{{item.journalEntryDate}}</span>
                        <span class="row-item net-due-date">{{item.netDueDate}}</span>
                        <span class="row-item amount">{{item.amount}}</span>
                        <span class="row-item assignment">{{item.assignment}}</span>
                        <span class="row-item arrow-icon">▶</span>
                    </div>
                </div>
            </div>
            <div v-else class="query-results-list" style="width: 100%;text-align: center; padding: 20px;">
                <p>No open items found.</p>
            </div>
            <div class="table-footer-bar">
                <div class="select-all-checkbox">
                    <input type="checkbox" v-model="allSelected_openItems" :disabled="openItems.length === 0">
                    <span>Select All</span>
                </div>
                <div class="selected-items-count">
                    <span>Already Selected {{ selectedOpenItems.length }} / Total {{ openItems.length }}</span>
                </div>
            </div>

            <div class="btn-container">
                <button class="btn" @click="clearSelectedItems">
                    clear
                </button>
                <button class="btn" @click="removeItemsToBeCleared">
                    remove
                </button>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
                <span style="font-weight:bold">Items to be cleared</span>
            </div>
            <div v-if="itemsToBeCleared && itemsToBeCleared.length > 0" class="query-results-list" style="width: 100%;">
                <div class="material-document-rows-container">
                    <div class="material-document-row-header">
                        <div class="header-item checkbox-header">No.</div>
                        <div class="header-item company-code">Company Code</div>
                        <div class="header-item account">Account</div>
                        <div class="header-item journal-entry">Journal Entry</div>
                        <div class="header-item journal-entry-type">Journal Entry Type</div>
                        <div class="header-item journal-entry-date">Journal Entry Date</div>
                        <div class="header-item net-due-date">Net Due Date</div>
                        <div class="header-item amount">Amount</div>
                        <div class="header-item assignment">Assignment</div>
                        <div class="header-item"></div>
                    </div>
                    <div v-for="(item,index) in itemsToBeCleared" :key="index" class="material-document-row" @click="toggleRowSelection(item)">
                        <div class="row-item checkbox-cell">
                            <input type="checkbox" @click.stop v-model="item.selected">
                        </div>
                        <span class="row-item company-code">{{item.companyCode}}</span>
                        <span class="row-item account">{{item.account}}</span>
                        <span class="row-item journal-entry">{{item.journalEntry}}</span>
                        <span class="row-item journal-entry-type">{{item.journalEntryType}}</span>
                        <span class="row-item journal-entry-date">{{item.journalEntryDate}}</span>
                        <span class="row-item net-due-date">{{item.netDueDate}}</span>
                        <span class="row-item amount">{{item.amount}}</span>
                        <span class="row-item assignment">{{item.assignment}}</span>
                        <span class="row-item arrow-icon">▶</span>
                    </div>
                </div>
            </div>
            <div v-else class="query-results-list" style="width: 100%;text-align: center; padding: 20px;">
                <p>No items to be cleared.</p>
            </div>
            <div class="table-footer-bar">
                <div class="select-all-checkbox">
                    <input type="checkbox" v-model="allSelected_itemsToBeCleared" :disabled="itemsToBeCleared.length === 0">
                    <span>Select All</span>
                </div>
                <div class="selected-items-count">
                    <span>Already Selected {{ selectedItemsToBeCleared.length }} / Total {{ itemsToBeCleared.length }}</span>
                </div>
            </div>
            <div v-if="showPostSuccessModal" class="modal-overlay">
                <div class="modal-content">
                    <h2>Success</h2>
                    <span>Journal Entry&nbsp;<span>{{ postedJournalEntryNumber }}</span>&nbsp;Successfully Posted</span>
                    <div class="modal-actions">
                        <button class="btn" @click="viewJournalEntryDetails">View Details</button>
                        <button class="btn" @click="closePostSuccessModal">Close</button>
                    </div>
                </div>
            </div>
        </template>

        <template #[`footer-content-right`]>
        {{ appContentRef?.getCurrentStageName() }}
        </template>

    </AppContent>
</template>

<script setup lang="ts">
import {ref, Ref, computed, onMounted,watch} from 'vue'
import VarBox from '@/components/varbox/VarBox.vue';
import AppContent from '@/components/applicationContent/AppContent.vue'
import {createTreeFromConfig, cns, VarNode, VarTree, NodeStructure} from '@/utils/VarTree';
import {
    bpSearch,
    GLAccountSearch,
    CurrencyUnitSearch,
    companyCodeSearch,
    customerSearch
} from '@/utils/searchMethods'
import router from '@/router';

const journalEntryTypeOptions = ['AA(Asset Posting)','AB(Accounting Document)','AF(Depreciation Pstngs)',
    'AN(Net Asset Posting)','AP','CG','CH(Contract Settlement)','CR',
    'DA(Customer Document)','DG(Customer Credit Memo)','DR(Customer Invoice)',
    'DV','EU(Euro Rounding Diff.)','EX(External Number)','KA(Vendor Document)',
    'KG(Vendor Credit Memo)','KN(Net Vendors)','KO','KP (Account Maintenance)',
    'KR (Vendor Invoice)','KX','KZ (Vendor Payment)','M1 (MCA Journal)','M2 (FX Swap)',
    'M3 (P&L Lock)','M4 (P&L Close)','M5 (P&L Transformation)','M6 (FX Valuation)',
    'M7 (MAR & Restatement)','M8 (IFX Correction)','M9 (Reversal)',
    'MD (Data Load)','ML (ML Settlement)','MR','P1','P3','P4','PR (Price Change)',
    'RA (Sub.Cred.Memo Stlmt)','RB (Reserve for Bad Debt)','RE (Invoice - Gross)',
    'RN (Invoice - Net)','RV (Billing Doc.Transfer)','SA (G/L Account Document)',
    'SB (G/L Account Posting)','SK (Cash Document)','SU (Adjustment Document)',
    'UE (Data Transfer)','WA (Goods Issue)','WE (Goods Receipt)','WI (Inventory Document)',
    'WL (Goods Issue/Delivery)','WN (Net Goods Receipt)','XX','Y1','ZP (Payment Posting)',
    'ZR (Bank Reconciliation)','ZS (Payment by Check)','ZV (Payment Clearing)',
    'ZZ'
]

const balance = ref(0 as number) // 用于存储余额
const balanceUnit = ref('EUR') // 用于存储余额单位
let API_BASE_URL = window.API_BASE_URL || ''
onMounted(() => {
    API_BASE_URL = window.API_BASE_URL || ''
})
const appContentRef = ref(null) as any
interface OpenItem {
    companyCode: string;
    account: string;
    journalEntry: string;
    journalEntryType: string;
    journalEntryDate: string;
    netDueDate: string;
    amount: number;
    assignment: string;
    selected?: boolean;
}
const openItems : Ref<OpenItem[]> = ref([]) // 用于存储查询结果

const itemsToBeCleared: Ref<OpenItem[]> = ref([]) // 用于存储已选中的未清项

const selectedOpenItems = computed(() => {
    return openItems.value.filter(item => item.selected);
});

const selectedItemsToBeCleared = computed(() => {
    return itemsToBeCleared.value.filter(item => item.selected);
});

const allSelected_openItems = computed({
    // getter: 判断是否所有项都被选中
    get() {
        // 如果没有 openItems，则全选框应为未选中状态 (或禁用)
        if (openItems.value.length === 0) {
            return false;
        }
        // 检查是否所有 openItems 都被选中
        return selectedOpenItems.value.length === openItems.value.length;
    },
    // setter: 当全选勾选框改变时，更新所有项的选中状态
    set(value: boolean) {
        openItems.value.forEach(item => {
            item.selected = value;
        });
    }
});

const allSelected_itemsToBeCleared = computed({
    // getter: 判断是否所有项都被选中
    get() {
        // 如果没有 itemsToBeCleared，则全选框应为未选中状态 (或禁用)
        if (itemsToBeCleared.value.length === 0) {
            return false;
        }
        // 检查是否所有 itemsToBeCleared 都被选中
        return selectedItemsToBeCleared.value.length === itemsToBeCleared.value.length;
    },
    // setter: 当全选勾选框改变时，更新所有项的选中状态
    set(value: boolean) {
        itemsToBeCleared.value.forEach(item => {
            item.selected = value;
        });
    }
});

const showPostSuccessModal = ref(false);
const postedJournalEntryNumber = ref('');

// 原始的大的 VarTree 定义 (作为整体数据结构的基础)
const inputTree = createTreeFromConfig(
    cns('dict','dict','payment',null,false,{},[
        cns('dict','dict','generalInformation',null,false,{},[
            cns('string','leaf','companyCode',null,false,{searchMethods:companyCodeSearch},[],'Company Code'),
            cns('date','leaf','postingDate',null,false,{},[],'Posting Date'),
            cns('date','leaf','journalEntryDate',null,false,{},[],'Journal Entry Date'),
            cns('selection','leaf','journalEntryType',null,false,{
                options:journalEntryTypeOptions
            },[],'Journal Entry Type'),
            cns('string','leaf','period',null,false,{},[],'Period'),
        ],'General Information'),
        cns('dict','dict','bankData',null,false,{},[
            cns('number','leaf','G/LAccount',null,false,{searchMethods:GLAccountSearch},[],'G/L Account'),
            cns('dict','dict','amount',null,false,{hideLabel:true},[
                cns('number','leaf','amount',null,false,{},[],'Amount'),
                cns('string','leaf','unit','EUR',false,{searchMethods:CurrencyUnitSearch,hideLabel:true},[],'Unit'),
            ],'Amount')
        ],'Bank Data'),
        cns('dict','dict','openItemSelection',null,false,{},[
            cns('selection','leaf','accountType',null,false,{
                options:['Customer','Vendor']
            },[],'Account Type'),
            cns('number','leaf','accountId',null,false,{searchMethods:customerSearch,hideLabel:true},[],'Account ID'),
        ],'Open Item Selection'),
    ],'Payment'),
)

// 定义三个新的 VarTree 引用，用于存储子树实例
const generalInfoTree: Ref<VarTree | null> = ref(null);
const bankDataTree: Ref<VarTree | null> = ref(null);
const openItemSelectionTree: Ref<VarTree | null> = ref(null);

// 在组件挂载后，从原始的 inputTree 中提取子节点并创建新的 VarTree
onMounted(() => {
    // 1. 获取 'generalInformation' 节点并创建 VarTree
    const generalInformationNode = inputTree.findNodeByPath(['generalInformation']);
    if (generalInformationNode) {
        generalInfoTree.value = new VarTree(generalInformationNode);
    } else {
        console.error("未能找到 generalInformation 节点");
    }

    // 2. 获取 'bankData' 节点并创建 VarTree
    const bankDataNode = inputTree.findNodeByPath(['bankData']);
    if (bankDataNode) {
        bankDataTree.value = new VarTree(bankDataNode);
    } else {
        console.error("未能找到 bankData 节点");
    }

    // 3. 获取 'openItemSelection' 节点并创建 VarTree
    const openItemSelectionNode = inputTree.findNodeByPath(['openItemSelection']);
    if (openItemSelectionNode) {
        openItemSelectionTree.value = new VarTree(openItemSelectionNode);
    } else {
        console.error("未能找到 openItemSelection 节点");
    }
});


type State = 'input' | 'post'
/**
 * @description 应用模式-输入、发布
 */
const state: Ref<State> = ref('input')
const onInputState = computed(() => state.value === 'input')
const onPostState = computed(() => state.value === 'post')
function appToState(newState: State) {
    state.value = newState
}

/**
 * @description 状态管理的before-next钩子
 */
async function handleExecute(currentStage: number, targetStage: number) {
    console.log('try: stage change:',currentStage,'->',targetStage)
    
    //当从 'input' (0) 阶段点击 'Propose items' (即进入 'post' 阶段)
    if(currentStage === 0){
        //1. 获取输入数据
        const inputData = inputTree.getValue();
        console.log('待发送的输入数据:', inputData)

        //2. 发送数据到后端
        try{
            const requestBody = {
                generalInformation: inputData.generalInformation,
                bankData: inputData.bankData,
                openItemSelection: inputData.openItemSelection
            };

            const response = await fetch(`${API_BASE_URL}/api/finance/searchOpenItems`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('后端的查询结果:', result);

            //3. 处理响应数据
            if (result.success && result.data) {
                // 更新 openItems ref，用于在 post 阶段渲染
                openItems.value = result.data.openItems ? result.data.openItems.map((item: OpenItem) => ({
                    ...item,
                    selected: false // 默认为未勾选
                })) : [];
                // 更新 balance 和 balanceUnit
                balance.value = typeof result.data.balance === 'number' ? result.data.balance : parseFloat(result.data.balance || '0');
                balanceUnit.value = result.data.balanceUnit || 'EUR';
                
                // 如果成功获取数据，允许跳转到下一阶段
                return true; 
            } else {
                // 后端返回成功但数据不符合预期
                console.error('后端返回数据格式不正确:', result);
                alert('查询未清项失败：' + (result.message || '数据格式错误'));
                openItems.value = []; // 清空之前的可能数据
                balance.value = 0;
                balanceUnit.value = 'EUR';
                return false; // 阻止跳转
            }
        } catch (error){
            console.error('发送请求或处理响应时发生错误:', error);
            alert('查询未清项失败，请检查网络或联系管理员。');
            openItems.value = []; // 清空之前的可能数据
            balance.value = 0;
            balanceUnit.value = 'EUR';
            return false; // 阻止跳转
        }
    }

    if(currentStage === 1) {
        // 当从 'post' (1) 阶段点击 'Post'，即提交数据
        // 获取所有待清除的未清项
        const itemsToPost = itemsToBeCleared.value;
        console.log('准备提交的未清项:', itemsToPost);

        if(balance.value < 0) {
            alert('客户少付款，无法提交未清项。');
            return false;
        } else if(balance.value > 0) {
            alert('客户多付款，无法提交未清项。');
            return false;
        } else {
            try {
                const response = await fetch(`${API_BASE_URL}/api/finance/postOpenItems`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemsToPost)
                });
                
                const result = await response.json();

                if (result.success) {
                    postedJournalEntryNumber.value = result.data.JournalEntry.journalEntryId || 'N/A'; // 获取过账后的 Journal Entry Number
                    showPostSuccessModal.value = true; // 显示过账成功的模态框
                    appContentRef.value.footerMessage = ''; // 提供反馈
                    console.log('过账成功:', result);
                    return true;
                } else {
                    alert('过账失败：' + (result.message || '未知错误'));
                    return false;
                }   
            } catch (error) {
                console.error('过账时发生错误:', error);
                alert('过账失败，请检查网络。');
                return false;
            }
        }
    }

    return true;
}

/**
 * @description 状态管理的before-prev钩子
 */
async function handleCancel(currentStage: number, _targetStage: number) {
    if (currentStage === 1) { 
        const confirmValue = confirm('Cancel?')
        if(confirmValue) {    
            appContentRef.value.footerMessage = '';
            openItems.value = [];
            balance.value = 0;
            balanceUnit.value = 'EUR';
        }
        console.log('取消操作，返回到输入阶段');
        console.log('当前阶段:', currentStage, '目标阶段:', _targetStage);
        console.log('确认值:', confirmValue);

        appToState('input'); // 切换内部状态，控制 template 渲染

        return confirmValue 
    }
    return true 
}

/**
 * @description 状态管理的after-next钩子
 */
async function handleAfterNext(_currentStage: number, _targetStage: number) {
    // 导航到下一阶段后执行
    if (_currentStage === 0) { // 如果导航到了 'post' 阶段
        appToState('post'); // 切换内部状态，控制 template 渲染
        appContentRef.value.footerMessage = 'Open items have been loaded'; // 可以在这里提供反馈
    }
}

/**
 * @description 状态管理的after-prev钩子
 */
async function handleAfterPrev(_currentStage: number, _targetStage: number) {
    // console.log('try: after-prev钩子被触发:', _currentStage, '->', _targetStage);
    // // 导航到上一阶段后执行
    // if (_targetStage === 0) { // 如果导航回到了 'input' 阶段
    //     console.log('返回到输入阶段, handleAfterPrev钩子被触发');
    //     appToState('input'); // 切换内部状态，控制 template 渲染
    //     appContentRef.value.footerMessage = '输入信息！'; // 清空消息
    // }
}


/**
 * @description 切换当前行的选中状态
 * @param item 当前行数据
 */
function toggleRowSelection(item: OpenItem) {
    // 切换当前行的 selected 状态
    item.selected = !item.selected;
}


/**
 * @description 清账选中的未清项
 */
function clearSelectedItems() {
    const selectedItems = openItems.value.filter(item => item.selected);

    if (selectedItems.length === 0) {
        alert('请先选择要清除的未清项！');
        return;
    }

    // 计算被清除项的总金额
    let clearedAmount = 0;
    selectedItems.forEach(item => {
        clearedAmount += item.amount;
    });

    // 将选中的项添加到 itemsToBeCleared
    itemsToBeCleared.value.push(...selectedItems);

    // 从 openItems 中移除这些项
    openItems.value = openItems.value.filter(item => !item.selected);

    // 更新 balance：从当前余额中减去被清除项的总金额
    balance.value -= clearedAmount;

    // 重置 itemsToBeCleared 中项的 selected 状态
    itemsToBeCleared.value.forEach(item => {
        item.selected = false;
    });

    console.log(`成功清除 ${selectedItems.length} 项未清项。`);
}

/**
 * @description 移除 itemsToBeCleared 中的选中项
 */
function removeItemsToBeCleared() {
    const selectedItems = itemsToBeCleared.value.filter(item => item.selected);

    if (selectedItems.length === 0) {
        alert('请先选择要移除的项！');
        return;
    }

    openItems.value.push(...selectedItems); // 将选中的项重新添加到 openItems

    // 从 itemsToBeCleared 中移除选中的项
    itemsToBeCleared.value = itemsToBeCleared.value.filter(item => !item.selected);

    // 更新 balance：将被移除项的金额加回到余额中
    let removedAmount = 0;
    selectedItems.forEach(item => {
        removedAmount += item.amount;
    });
    balance.value += removedAmount;

    // 重置 itemsToBeCleared 中项的 selected 状态
    itemsToBeCleared.value.forEach(item => {
        item.selected = false;
    });

    console.log(`成功移除 ${selectedItems.length} 项已清除项。`);
}

/**
 * @description 关闭过账成功模态框
 */
function closePostSuccessModal() {
    showPostSuccessModal.value = false;

    console.log('关闭过账成功模态框');
    openItems.value = [];
    itemsToBeCleared.value = [];
    balance.value = 0;
    balanceUnit.value = 'EUR';
    appContentRef.value.goToStage(0); // 返回到输入阶段
    appToState('input'); // 切换内部状态，控制 template 渲染
}


/**
 * @description 查看过账成功的 Journal Entry 详情
 */
function viewJournalEntryDetails() {
    // 隐藏成功提示模态框
    showPostSuccessModal.value = false;

    if (postedJournalEntryNumber.value) {
        // 跳转到新的详情路由，并传递凭证编号作为参数
        router.push({
            name: 'DisplayJournalEntry', // 路由名称
            params: { id: postedJournalEntryNumber.value } // 传递参数
        });
    } else {
        alert('无法获取凭证编号进行查看。');
    }
}
</script>

<style scoped>
.total {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

#generalInfo {
    grid-column: 1;
    grid-row: 1 / 3; 
}

#bankData {
    grid-column: 2;
    grid-row: 1;
}

#openItemSelection {
    grid-column: 2;
    grid-row: 2; 
}

:deep(.generalInformation--dict-leaf-section) {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

:deep(.openItemSelection--dict-leaf-section) {
    grid-template-columns: 50% 50%;;
}

:deep(.openItemSelection-accountType--wrapper) {
    grid-column: 1;
}

:deep(.openItemSelection-accountId--wrapper) {
    margin-left: auto;
    grid-column: 2;
}

:deep(.bankData-amount--dict-leaf-section) {
    display: grid;
    grid-template-columns: 50% 50%;
}

:deep(.bankData-amount-amount--wrapper) {
    grid-column: 1;
}

:deep(.bankData-amount-unit--wrapper) {
    grid-column: 2;
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
.company-code { flex-basis: 10%; text-align: center;}
.account { flex-basis: 12%; text-align: center;}
.journal-entry { flex-basis: 12%; text-align: center;}
.journal-entry-type { flex-basis: 16%; text-align: center;} /* 调整 */
.journal-entry-date { flex-basis: 10%; text-align: center;}
.net-due-date { flex-basis: 10%; text-align: center;}
.amount { flex-basis: 8%; text-align: right; padding-right: 10px;}
.assignment { flex-basis: 12%; text-align: center;}
.arrow-icon { flex: 0 0 2%; text-align: right; padding-right: 20px;} /* 调整 */

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

.checkbox-cell {
    display: flex; /* 让勾选框居中 */
    align-items: center;
    justify-content: center;
}

.checkbox-cell input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none; /* 兼容性前缀 */
    -moz-appearance: none; /* 兼容性前缀 */

    /* 1. 设置勾选框的基础尺寸和边框 */
    width: 18px; /* 自定义宽度 */
    height: 18px; /* 自定义高度 */
    background-color: white;
    border: 1px solid var(--theme-color-dark); /* 边框颜色 */
    border-radius: 5px; /* 轻微圆角 */
    cursor: pointer; /* 显示手型光标 */
    position: relative; /* 为伪元素定位 */
    outline: none; /* 移除点击时的外边框 */
    transition: background-color 0.5s, border-color 0.5s; /* 添加过渡效果 */
}

/* 2. 勾选框被选中时的样式 */
.checkbox-cell input[type="checkbox"]:checked {
    background-color: var(--theme-color-dark); /* 勾选时的背景色 */
    border-color: var(--theme-color-dark); /* 勾选时的边框色 */
}

/* 3. 使用伪元素创建勾选标记 */
.checkbox-cell input[type="checkbox"]::before {
    content: '';
    display: block;
    width: 10px; /* 勾选标记宽度 */
    height: 5px; /* 勾选标记高度 */
    border-left: 2px solid white; /* 勾选标记左边 */
    border-bottom: 2px solid white; /* 勾选标记下边 */
    transform: rotate(-45deg); /* 旋转形成勾的形状 */
    position: absolute;
    top: 4px; /* 微调位置 */
    left: 3px; /* 微调位置 */
    opacity: 0; /* 默认隐藏 */
    transition: opacity 0.5s; /* 添加过渡效果 */
}

/* 4. 勾选框被选中时显示勾选标记 */
.checkbox-cell input[type="checkbox"]:checked::before {
    opacity: 1; /* 勾选时显示 */
}

.table-footer-bar {
    display: flex;
    justify-content: space-between; /* 使两边的内容分散对齐 */
    align-items: center;
    padding: 10px 15px; /* 内边距 */
    background-color: var(--theme-color-table-header-bg); /* 与表头背景色一致 */
    margin-top: 10px; /* 与表格顶部留些距离 */
    color: var(--theme-color-table-header-text); /* 文字颜色 */
    font-size: 0.9em;
}

.select-all-checkbox {
    display: flex;
    align-items: center;
    gap: 10px; /* 勾选框和文字之间的间距 */
}

.select-all-checkbox input[type="checkbox"] {
    background-color: white;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 18px;
    height: 18px;
    border: 1px solid var(--theme-color-table-header-text);
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    outline: none;
    transition: background-color 0.5s, border-color 0.5s;
    flex-shrink: 0; /* 防止勾选框被压缩 */
}

.select-all-checkbox input[type="checkbox"]:checked {
    background-color: var(--theme-color-table-header-text);
    border-color: var(--theme-color-table-header-text);
}

.select-all-checkbox input[type="checkbox"]::before {
    content: '';
    display: block;
    width: 10px;
    height: 5px;
    border-left: 2px solid var(--theme-color-dark);
    border-bottom: 2px solid var(--theme-color-dark);
    transform: rotate(-45deg);
    position: absolute;
    top: 4px;
    left: 3px;
    opacity: 0;
    transition: opacity 0.2s;
}

.select-all-checkbox input[type="checkbox"]:checked::before {
    opacity: 1;
}

/* 禁用状态下的全选勾选框样式 */
.select-all-checkbox input[type="checkbox"]:disabled {
    cursor: not-allowed;
    background-color: var(--theme-color-disabled-bg, #f0f0f0); /* 禁用时的背景色 */
    border-color: var(--theme-color-disabled-border, #ccc); /* 禁用时的边框色 */
    opacity: 0.6; /* 降低透明度表示禁用 */
}

.select-all-checkbox input[type="checkbox"]:disabled::before {
    border-left-color: var(--theme-color-disabled-text, #aaa);
    border-bottom-color: var(--theme-color-disabled-text, #aaa);
}

.selected-items-count {
    font-weight: bold;
}

.btn-container {
    display: flex;
    justify-content: flex-end;
    gap:10px;
    margin-top: 20px; /* 与表格底部留些距离 */
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

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 确保模态窗口在最上层 */
}

.modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-width: 400px;
    width: 90%;
    animation: fadeIn 0.3s ease-out; /* 添加出现动画 */
}

.modal-content h2 {
    color: var(--theme-color-dark); /* 使用你的主题颜色 */
    margin-top: 0;
    margin-bottom: 20px;
}

.modal-content p {
    font-size: 1.1em;
    color: var(--color-text-primary);
    margin-bottom: 25px;
}

.modal-actions {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 15px; /* 按钮之间的间距 */
}

/* 模态框出现动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>