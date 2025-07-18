<template>
    <div class="manageSalesQuotations">
        <AppContent
            ref="appContentRef"
            :stages="['initialScreen', 'quotationDetail','itemCondition']"
            :before-next="handleExecute"
            :before-prev="handleCancel"
            :footer-config="footerConfig"
        >
            <template #stage-initialScreen>
                <VarBox :tree="initialCreationTree" v-if="onCreateState"></VarBox>
                <VarBox :tree="initialSearchTree" v-else-if="onSearchState"></VarBox>
                
                <div v-if="searchResults && searchResults.length > 0 && onSearchState" class="search-results-table-container">
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
                <div v-else-if="onSearchState">
                    <p>请点击“search”按钮查询报价单。</p>
                </div>
            </template>
            
            <template #stage-quotationDetail>
                <VarBox v-if="quotationDataTree.root" :tree="quotationDataTree" >
                    <template #[`quotationData-itemOverview-items--extra-buttons`]>
                        <button
                            class = "execute-button table-extra-button"
                            @click="handleItemsTableClick()"
                        >
                            ...
                        </button>
                    </template> 
                </VarBox>
                <div v-else class="no-data-message">
                    <p>没有找到报价单详情。</p>
                </div>
            </template>

            <template #stage-itemCondition>
                <div class="item-navigation" v-if="selectedItems.length > 1">
                    <button
                        class="item-nav-button item-prev-button"
                        @click="switchToPreviousItem"
                        :disabled="currentItemIndex === 0"
                    > < </button>
                    <span class="item-counter">
                        Item {{ currentItemIndex + 1 }} of {{ selectedItems.length }}
                    </span>
                    <button
                        class="item-nav-button item-next-button"
                        @click="switchToNextItem"
                        :disabled="currentItemIndex === selectedItems.length - 1"
                    > > </button>
                </div>

                <VarBox
                    :tree="itemDetailHeaderTree"
                ></VarBox>

                <FilterTabs
                    :tabs="[{label:'Sales',value:0},{label:'Conditions',value:1}]"
                    @tab-selected="handleItemConditionTabClick"
                    class="reverse middle hide-bottom-line"
                    :initialActiveTab="0"
                />

                <VarBox
                    v-if="itemConditionTabBarStage == 0"
                    :tree="itemDetailSalesTree"
                    @enter-from-node="handleEnterFromNodeItemCondition"
                    @input-from-node="handleInputFromNodeItemCondition"
                ></VarBox>

                <VarBox
                    v-else
                    :tree="itemDetailConditionTree"
                    @enter-from-node="handleEnterFromNodeItemCondition"
                    @input-from-node="handleInputFromNodeItemCondition"
                >
                    <template #[`itemDetailConditions-pricingElements--extra-buttons`]>
                        <button
                            class="execute-button table-extra-button"
                            @click="handlePricingElementsRemoveButtonClick"
                            :disabled="itemDetailConditionTree.findNodeByPath(['pricingElements'])?.getSelectedChildren().length === 0"
                        >
                            Delete
                        </button>
                    </template>
                </VarBox>
            </template>

            <template #footer-content-right>
                {{ appContentRef?.getCurrentStageName() }}
                <template v-if="appContentRef?.currentStage === 0">
                    <button v-if="onSearchState" class="nav-button" @click="initializeCreation()">Create New</button>
                </template>
                <template v-if="appContentRef?.currentStage == 2">
                    <button class="nav-button" @click="cancelItemCondition">{{itemDetailStageCancelButtonLabel}}</button>
                    <button class="nav-button" @click="saveItemConditionData" v-if="itemDetailStageExecuteButtonVisible">Save</button>
                </template>
            </template>
        </AppContent>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue';
import AppContent from '@/components/applicationContent/AppContent.vue';
import VarBox from '@/components/varbox/VarBox.vue';
import { bpSearch, quotationIdSearch } from '@/utils/searchMethods';
import {
    cns,                   // 用于创建 NodeStructure 的辅助函数
    createTreeFromConfig,  // 用于从配置创建 VarTree 实例
    createNodeFromConfig,  // 用于从配置创建单个 VarNode
    isNodeStructure,       // 判断是否为 NodeStructure 类型
    NodeStructure,         // NodeStructure 类型定义
    VarNodeValue,          // VarNode 值类型定义
    VarTree,               // VarTree 类或类型定义
    VarNode
} from '@/utils/VarTree';
import { toRaw } from 'vue'; // 用于获取非响应式原始数据
import FilterTabs from '@/components/FilterTabs.vue';

// ====================================================================
// 1. 应用状态定义
// ====================================================================

// 定义应用的不同操作状态
type State = 'create' | 'change' | 'display' | 'search';
const state: Ref<State> = ref('search'); // 默认初始状态为搜索模式

// Computed 属性，用于方便判断当前的应用状态
const onCreateState = computed(() => state.value === 'create');
const onChangeState = computed(() => state.value === 'change');
const onDisplayState = computed(() => state.value === 'display');
const onSearchState = computed(() => state.value === 'search');

// ====================================================================
// 2. 类型定义
// ====================================================================

// 定义报价单数据的接口
interface QuotationData {
    salesQuotation: number;    // 销售报价单号
    soldToParty: string;       // 售达方
    customerReference: string; // 客户参考
    overallStatus: string;     // 整体状态
    latestExpiration: string;  // 最新过期日期
    id?: number | string;      // 可选的 ID 字段
    items?: any[];             // 假设报价单详情有物品列表
}

// 扩展 NodeStructure，用于表示报价单数据的树形结构，其 currentValue 可能是单个对象或对象数组
interface QuotationNodeStructure extends NodeStructure {
    currentValue: QuotationData | QuotationData[];
}

// ====================================================================
// 3. 响应式变量和引用
// ====================================================================

// API 基础 URL，从环境变量获取，如果未设置则为空字符串
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '';
// 对 AppContent 组件的引用，用于调用其内部方法（如 goToStage）
const appContentRef = ref(null) as Ref<any>; // 明确指定 Ref 的类型为 any，以便访问 AppContent 暴露的方法

// 报价单详情信息树：用于创建、修改和查看报价单数据
// 使用 createTreeFromConfig 初始化一个 VarTree 实例，定义了报价单的完整数据结构
const quotationDataTree = createTreeFromConfig(
    cns('dict','dict','quotationData',{},false,{hideLabel:true},[ // 根节点：报价单数据
        cns('dict','dict','meta',{},false,{hideSelf:true},[ // 元数据
            cns('string','leaf','id','',false,{},[]), // ID
        ]),
        cns('dict','dict','basicInfo',{},false,{hideLabel:true},[ // 基本信息
            cns('string','leaf','quotation','',false,{},[],"Quotation ID:"),
            cns('string','leaf','soldToParty','',false,{},[],"Sold-To Party:"),
            cns('string','leaf','shipToParty','',false,{},[],"Ship-To Party:"),
            cns('string','leaf','customerReference','',false,{},[],"Cust. Reference:"),
            cns('string','leaf','netValue','0.0',true,{},[],"Net Value:"),
            cns('string','leaf','netValueUnit','',true,{hideLabel:true},[],"Net Value Unit:"),
            cns('date','leaf','customerReferenceDate','',false,{},[],"Cust. Ref. Date:"),
        ]),
        cns('dict','dict','itemOverview',{},false,{},[ // 项目概览
            cns('date','leaf','validFrom','',false,{},[],"Valid From:"),
            cns('date','leaf','validTo','',false,{},[],"Valid To:"),
            cns('date','leaf','reqDelivDate','',false,{},[],"Req. Deliv Date:"),
            cns('string','leaf','expectOralVal','0.0',true,{},[],"Expect. Oral Val:"),
            cns('string','leaf','expectOralValUnit','',true,{hideLabel:true},[],"Expect. Oral Val Unit:"),
            // 动态列表：报价单项目
            cns('dynamiclist','list','items',null,false,{
                hideLabel:true, 
                // 在 VarBox 中隐藏列表项的某些字段
                hideList: ['netValue', 'netValueUnit', 'pricingDate', 'orderProbability','reqDelivDate','taxValue','taxValueUnit','pricingElements'],
                // 定义列表项的模板结构
                childTemplate:cns('dict','dict','item',null,false,{},[
                    cns('string','leaf','item','',true,{},[],"Item"),
                    cns('string','leaf','material','',false,{},[],"Material"),
                    cns('string','leaf','orderQuantity','',false,{},[],"Order Quantity"),
                    cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[],"SU"),
                    cns('string','leaf','description','',false,{},[],"Description"),
                    cns('date','leaf','reqDelivDate','',false,{},[],"Req. Deliv Date"),
                    cns('string','leaf','netValue','',true,{},[],"Net: "),
                    cns('string','leaf','netValueUnit','',true,{hideLabel:true},[],"Net Value Unit"),
                    cns('string','leaf','taxValue','',true,{},[],"Tax: "),
                    cns('string','leaf','taxValueUnit','',true,{hideLabel:true},[],"Tax Value Unit"),
                    cns('date','leaf','pricingDate','',false,{},[],"Pricing Date"),
                    cns('string','leaf','orderProbability','',false,{},[],"Order Probability"),
                    // 嵌套动态列表：定价元素
                    cns('dynamiclist','list','pricingElements',null,true,{
                        rowProvided:0,
                        childTemplate:cns('dict','dict','condition',null,false,{},[
                            cns('string','leaf','cnty','',false,{},[],"Cnty"),
                            cns('string','leaf','name','',false,{},[],"Name"),
                            cns('string','leaf','amount','',false,{},[],"Amount"),
                            cns('string','leaf','city','',false,{},[],"City"),
                            cns('string','leaf','per','',false,{},[],"per"),
                            cns('string','leaf','uom','',false,{},[],"UoM"),
                            cns('string','leaf','conditionValue','',false,{},[],"Condition Value"),
                            cns('string','leaf','curr','',false,{},[],"Curr."),
                            cns('string','leaf','status','',false,{},[],"Status"),
                            cns('string','leaf','numC','',false,{},[],"NumC"),
                            cns('string','leaf','atoMtsComponent','',false,{},[],"ATO/MTS Component"),
                            cns('string','leaf','oun','',false,{},[],"OUn"),
                            cns('string','leaf','cconDe','',false,{},[],"CConDe"),
                            cns('string','leaf','un','',false,{},[],"Un"),
                            cns('string','leaf','conditionValue2','',false,{},[],"Condition Value"),
                            cns('string','leaf','cdCur','',false,{},[],"CdCur"),
                            cns('boolean','leaf','stat',false,false,{},[],"Stat"),
                        ]),
                    },[],"Pricing Elements"),
                ]),
            },[],"Items")
        ]), // 'Item Overview' 结束
    ])
);

// 存储 API 返回的查询结果列表
const searchResults = ref<QuotationData[] | null>(null);

// 用于在 handleExecute 中传递给 quotationTree 的完整 NodeStructure（此变量似乎未直接使用在 `VarBox :tree` 中，
// 而是将 `quotationDataTree` 的 `root` 更新，但保留在此以匹配原代码意图）
const searchResultsTree = ref<NodeStructure | null>(null);

// 存储单个报价单详情的响应式变量 (当从列表点击查看时，此变量似乎未直接使用在 `VarBox :tree` 中，
// 而是将 `quotationDataTree` 的 `root` 更新，但保留在此以匹配原代码意图)
const quotationDetail = ref<QuotationNodeStructure | null>(null);

// 可写入的 VarTree 实例列表，如果组件需要操作多个可编辑的树
const writableTrees = [quotationDataTree];

// ====================================================================
// 4. 初始屏幕的 VarTree 定义 (根据模式切换)
// ====================================================================

// 初始阶段 - 搜索报价单的 VarTree 配置
const initialSearchTree = createTreeFromConfig(
    cns('dict', 'dict', 'query', {}, false, {}, [
        cns('number','leaf','salesQuotation','', false, {searchMethods: quotationIdSearch}, [], 'Sales Quotation:'),
        cns('string', 'leaf', 'soldToParty', '', false, {searchMethods: bpSearch}, [], 'Sold-To Party:'),
        cns('string', 'leaf', 'customerReference', '', false, {}, [], 'Customer Reference:'),
        cns('selection', 'leaf', 'overallStatus', '', false, {
            options: [
                'New', 'Open', 'In Process', 'Completed', // 预定义的状态选项
            ]
        }, [], 'Overall Status:'),
        cns('date','leaf','latestExpiration','', false, {}, [], 'Latest Expiration:'),
    ])
);

// 初始阶段 - 创建新报价单的 VarTree 配置 (一个空的表单模板，用于清空和初始化数据)
const initialCreationTree = createTreeFromConfig(
    cns('dict','dict','quotationData',{},false,{hideLabel:true},[ // 根节点：报价单数据
        cns('dict','dict','meta',{},false,{hideSelf:true},[ // 元数据
            cns('string','leaf','id','',false,{},[]), // ID
        ]),
        cns('dict','dict','basicInfo',{},false,{hideLabel:true},[ // 基本信息
            cns('string','leaf','quotation','',true,{searchMethods:quotationIdSearch},[],"Quotation ID:"),
            cns('string','leaf','soldToParty','',false,{searchMethods: bpSearch},[],"Sold-To Party:"),
            cns('string','leaf','shipToParty','',false,{searchMethods: bpSearch},[],"Ship-To Party:"),
            cns('string','leaf','customerReference','',false,{},[],"Cust. Reference:"),
            cns('string','leaf','netValue','0.0',true,{},[],"Net Value:"),
            cns('string','leaf','netValueUnit','',true,{hideLabel:true},[],"Net Value Unit:"),
            cns('date','leaf','customerReferenceDate','',false,{},[],"Cust. Ref. Date:"),
        ]),
        cns('dict','dict','itemOverview',{},false,{},[ // 项目概览
            cns('date','leaf','validFrom','',false,{},[],"Valid From:"),
            cns('date','leaf','validTo','',false,{},[],"Valid To:"),
            cns('date','leaf','reqDelivDate','',false,{},[],"Req. Deliv Date:"),
            cns('string','leaf','expectOralVal','0.0',true,{},[],"Expect. Oral Val:"),
            cns('string','leaf','expectOralValUnit','',true,{hideLabel:true},[],"Expect. Oral Val Unit:"),
            cns('dynamiclist','list','items',null,false,{
                hideLabel:true, 
                hideList: ['netValue', 'netValueUnit', 'pricingDate', 'orderProbability','reqDelivDate','taxValue','taxValueUnit','pricingElements'],
                childTemplate:cns('dict','dict','item',null,false,{},[
                    cns('string','leaf','item','',true,{},[],"Item"),
                    cns('string','leaf','material','',false,{},[],"Material"),
                    cns('string','leaf','orderQuantity','',false,{},[],"Order Quantity"),
                    cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[],"SU"),
                    cns('string','leaf','description','',false,{},[],"Description"),
                    cns('date','leaf','reqDelivDate','',false,{},[],"Req. Deliv Date"),
                    cns('string','leaf','netValue','',true,{},[],"Net: "),
                    cns('string','leaf','netValueUnit','',true,{hideLabel:true},[],"Net Value Unit"),
                    cns('string','leaf','taxValue','',true,{},[],"Tax: "),
                    cns('string','leaf','taxValueUnit','',true,{hideLabel:true},[],"Tax Value Unit"),
                    cns('date','leaf','pricingDate','',false,{},[],"Pricing Date"),
                    cns('string','leaf','orderProbability','',false,{},[],"Order Probability"),
                    cns('dynamiclist','list','pricingElements',null,true,{
                        rowProvided:0,
                        childTemplate:cns('dict','dict','condition',null,false,{},[
                            cns('string','leaf','cnty','',false,{},[],"Cnty"),
                            cns('string','leaf','name','',false,{},[],"Name"),
                            cns('string','leaf','amount','',false,{},[],"Amount"),
                            cns('string','leaf','city','',false,{},[],"City"),
                            cns('string','leaf','per','',false,{},[],"per"),
                            cns('string','leaf','uom','',false,{},[],"UoM"),
                            cns('string','leaf','conditionValue','',false,{},[],"Condition Value"),
                            cns('string','leaf','curr','',false,{},[],"Curr."),
                            cns('string','leaf','status','',false,{},[],"Status"),
                            cns('string','leaf','numC','',false,{},[],"NumC"),
                            cns('string','leaf','atoMtsComponent','',false,{},[],"ATO/MTS Component"),
                            cns('string','leaf','oun','',false,{},[],"OUn"),
                            cns('string','leaf','cconDe','',false,{},[],"CConDe"),
                            cns('string','leaf','un','',false,{},[],"Un"),
                            cns('string','leaf','conditionValue2','',false,{},[],"Condition Value"),
                            cns('string','leaf','cdCur','',false,{},[],"CdCur"),
                            cns('boolean','leaf','stat',false,false,{},[],"Stat"),
                        ]),
                    },[],"Pricing Elements"),
                ]),
            },[],"Items")
        ]), // 'Item Overview' 结束
    ])
);

// ====================================================================
// 5. 辅助函数 (样式和日期格式化)
// ====================================================================

// 根据报价单状态返回对应的 CSS 类名
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

// 格式化日期字符串为本地短日期格式
function formatDate(dateString: string) {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) { // 检查日期是否有效
        return dateString;
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ====================================================================
// 6. 应用状态切换函数
// ====================================================================

/**
 * @description 切换应用的主状态 (搜索、创建、修改、显示)
 * @param newState 要切换到的新状态
 */
function appToState(newState: State) {
    state.value = newState;
    // 根据新状态设置 quotationDataTree 的只读属性
    // 如果是 'display' 模式，则将整个报价单数据树设置为只读
    const readonly = newState === 'display';
    if (quotationDataTree.root) {
        quotationDataTree.root.readonly = readonly;
    }
}

// ====================================================================
// 7. 动态页脚按钮标签
// ====================================================================

// 计算属性：初始屏幕的“下一步”按钮文本
const searchScreenNextButtonLabel = computed(() => {
    if (onCreateState.value) {
        return 'Create New'; // 创建模式下的按钮文本
    }
    if (onSearchState.value) {
        return 'Search'; // 搜索模式下的按钮文本
    }
    return '/hide'; // 其他情况隐藏按钮
});

// 计算属性：报价单详情页的“上一步”按钮文本
const quotationDetailPrevButtonLabel = computed(() => {
    if (onDisplayState.value) {
        return 'Back to Search'; // 查看模式下返回搜索列表
    }
    return 'Cancel'; // 创建/修改模式下取消
});

// 计算属性：报价单详情页的“下一步”按钮文本
const quotationDetailNextButtonLabel = computed(() => {
    if (onDisplayState.value) {
        return 'Switch to Edit'; // 查看模式下切换到编辑模式
    }
    if (onChangeState.value) {
        return 'Save Changes'; // 修改模式下保存更改
    }
    if (onCreateState.value) {
        return 'Submit Quotation'; // 创建模式下提交报价单
    }
    return '/hide'; // 其他情况隐藏按钮
});

// ====================================================================
// 8. API 调用函数
// ====================================================================

/**
 * @description 调用 API 获取单个报价单的详细信息
 * @param id 报价单的 ID
 * @returns 成功时返回响应数据，失败时返回 null
 */
async function fetchQuotationDetails(id: number) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/quotation/details`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({salesQuotationId:id}),
        }).then(res => res.json());

        if (response.success) {
            return response;
        } else {
            console.error('API responded with an error:', response.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching quotation details:', error);
        return null;
    }
}

// ====================================================================
// 9. 业务逻辑函数
// ====================================================================

/**
 * @description 处理列表项的“View Details”点击事件，获取并显示报价单详情。
 * @param quotation 从列表中获取的报价单数据
 */
async function viewDetails(quotation: QuotationData) {
    const responseData = await fetchQuotationDetails(quotation.salesQuotation);
    if(responseData){
        const quotationData: VarNodeValue = responseData.data.quotationData;
        // 使用 forceSetValue 更新 quotationDataTree 的数据，使其反映详情数据
        quotationDataTree.forceSetValue(quotationData);
        
        console.log('更新后的 quotationDataTree:', quotationDataTree.root);
        
        // 切换到 AppContent 的第二个阶段 (quotationDetail)
        appContentRef.value.goToStage(1);
        // 设置应用状态为“显示”模式 (只读)
        appToState('display');
    } else {
        alert('无法获取报价单详情或数据格式不正确！');
    }
}

/**
 * @description 处理“Go”按钮（在搜索模式下）的点击事件，执行报价单搜索。
 */
async function handleSearch() {
    // 从搜索表单树获取查询条件
    const queryData = initialSearchTree.root?.currentValue; 
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/quotation/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(queryData),
        }).then(res => res.json());

        console.log('API Response:', response);
        // 验证 API 返回的数据结构是否符合 NodeStructure 类型
        const isStructureValid = isNodeStructure(response.data?.quotationStruct);
        console.log('isNodeStructure result:', isStructureValid);

        if (response.success && isStructureValid) {
            // 从返回的 NodeStructure 中提取 currentValue (报价单数据)
            const currentValue = response.data.quotationStruct.currentValue;
            let results: QuotationData[] = [];

            // 处理 currentValue 可能是数组或单个对象的情况
            if (Array.isArray(currentValue)) {
                results = currentValue as QuotationData[];
            } else if (currentValue && typeof currentValue === 'object') {
                results = [currentValue as QuotationData];
            }
            
            searchResults.value = results; // 更新搜索结果列表，供表格渲染
            searchResultsTree.value = response.data.quotationStruct; // 存储完整的 NodeStructure (备用，当前未直接使用)
            
            alert(`查询成功，共找到 ${results.length} 条报价单！`);
        } else {
            alert('未找到报价单信息!');
            searchResults.value = null; // 清空搜索结果
            searchResultsTree.value = null; // 清空结构
        }
    } catch (error) {
        console.error('An error occurred during search:', error);
        alert('请求失败，请检查网络或服务器');
    }
}

/**
 * @description 处理“创建新报价单”的初始化逻辑，切换到创建模式并准备空表单。
 */
async function initializeCreation() {
    // 使用 initialCreationTree 的根节点配置，重新设置 quotationDataTree 的根节点，从而清空并初始化表单
    quotationDataTree.setRoot(createNodeFromConfig(initialCreationTree.root!));
    
    appContentRef.value.goToStage(1); // 切换到详情页 (阶段 1)
    appToState('create'); // 设置应用状态为“创建”模式 (可编辑)
    alert('已进入创建新报价单模式。');
    return false; // 返回 false 阻止 AppContent 自动前进到下一个阶段（因为已手动处理）
}


/**
 * @description AppContent 组件的 `before-next` 钩子函数，处理“下一步”按钮的点击逻辑。
 * 根据当前阶段和应用状态执行不同的操作。
 * @param currentStage 当前阶段的索引
 * @param targetStage 目标阶段的索引
 * @returns {boolean | Promise<boolean>} 返回 true 允许 AppContent 自动前进，false 阻止。
 */
async function handleExecute(currentStage: number, targetStage: number): Promise<boolean> {
    console.log('handleExecute: stage change:', currentStage, '->', targetStage, 'State:', state.value);

    // 阶段 0 (initialScreen) 的操作逻辑
    if (currentStage === 0) {
        if (onCreateState.value) {
            // 在创建模式下，点击“Create New”按钮（由 footer-content-right 里的自定义按钮触发）
            return await initializeCreation(); // 初始化创建流程，并返回 false 阻止自动前进
        } else if (onSearchState.value) {
            // 在搜索模式下，点击“Search”按钮
            await handleSearch(); // 执行搜索操作
            return false; // 返回 false 停留在当前阶段显示搜索结果
        }
    }

    // 阶段 1 (quotationDetail) 的操作逻辑
    if (currentStage === 1) {
        if (onDisplayState.value) {
            // 从查看模式切换到修改模式
            appToState('change');
            appContentRef.value.footerMessage = '已切换到修改模式';
            return false; // 返回 false 停留在当前阶段 (VarBox 变为可编辑)
        } else if (onChangeState.value) {
            // 在修改模式下，点击“Save Changes”按钮，执行更新 API 调用
            const body = {
                quotation: toRaw(quotationDataTree.root?.currentValue) // 获取原始数据以发送到后端
            };
            const res = await fetch(`${API_BASE_URL}/api/quotation/update`, { // 假设这是更新 API
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }).then(r => r.json());

            if (res.success) {
                appContentRef.value.footerMessage = `报价单${res.data.quotationData.basicInfo.quotation}更新成功!`;
                const newQuotationData: VarNodeValue = res.data.quotationData;
                quotationDataTree.forceSetValue(newQuotationData); // 使用后端返回的最新数据更新树
                appToState('display'); // 保存后切换回查看模式
            } else {
                alert('保存失败！');
                appContentRef.value.footerMessage = '保存失败！';
            }
            return false; // 返回 false 停留在当前阶段
        } else if (onCreateState.value) {
            // 在创建模式下，点击“Submit Quotation”按钮，执行创建 API 调用
            const body = {
                quotation: toRaw(quotationDataTree.root?.currentValue) // 获取原始数据以发送到后端
            };
            const res = await fetch(`${API_BASE_URL}/api/quotation/create`, { // 假设这是创建 API
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }).then(r => r.json());
            const quotationData: VarNodeValue = res.data.quotationData; // 假设后端返回新创建的报价单数据
            if (res.success) {
                appContentRef.value.footerMessage = `新报价单${res.data.quotationData.basicInfo.quotation}创建成功!`;
                appToState('display'); // 创建后切换到查看模式
                quotationDataTree.forceSetValue(quotationData); // 使用后端返回的最新数据更新树
            } else {
                alert('创建失败！');
                appContentRef.value.footerMessage = '创建失败！';
            }
            return false; // 返回 false 停留在当前阶段
        }
    }
    return false; // 默认情况下，阻止 AppContent 自动前进
}

/**
 * @description AppContent 组件的 `before-prev` 钩子函数，处理“上一步”按钮的点击逻辑。
 * 根据当前阶段和应用状态执行不同的操作。
 * @param currentStage 当前阶段的索引
 * @param targetStage 目标阶段的索引
 * @returns {boolean | Promise<boolean>} 返回 true 允许 AppContent 自动后退，false 阻止。
 */
async function handleCancel(currentStage: number, targetStage: number): Promise<boolean> {
    console.log('handleCancel: stage change:', currentStage, '->', targetStage, 'State:', state.value);

    // 阶段 0 (initialScreen) 的操作
    if (currentStage === 0) {
        // 从初始屏幕返回，通常允许直接返回（例如，回到上一页或关闭应用）
        return true; 
    }

    // 阶段 1 (quotationDetail) 的操作
    if (currentStage === 1) {
        if (onDisplayState.value) {
            // 从查看模式返回：直接回到搜索列表
            appContentRef.value.goToStage(0);
            appToState('search'); // 切换回搜索模式
            searchResults.value = null; // 清空搜索结果
            appContentRef.value.footerMessage = ''; // 清空页脚消息
            return false; // 返回 false 阻止 AppContent 自动后退，因为已手动处理阶段切换
        } else if (onCreateState.value || onChangeState.value) {
            // 从创建或修改模式返回：需要确认是否放弃更改
            const confirmValue = confirm('确定要取消并放弃所有更改吗？');
            if (confirmValue) {
                appContentRef.value.goToStage(0);
                appToState('search'); // 切换回搜索模式
                searchResults.value = null; // 清空搜索结果
                appContentRef.value.footerMessage = ''; // 清空页脚消息
            }
            return false; // 返回 false 阻止 AppContent 自动后退，因为已手动处理阶段切换
        }
    }
    return true; // 默认允许取消
}

// AppContent 组件的 footerConfig 配置，用于动态设置底部按钮的文本和显示
const footerConfig = [
    // 阶段 0 (initialScreen) 的配置
    {
        showPrev: false, // 初始屏幕不显示“上一步”按钮
        nextText: searchScreenNextButtonLabel // “下一步”按钮文本根据搜索/创建模式动态变化
    },
    // 阶段 1 (quotationDetail) 的配置
    {
        showPrev: true, // 详情页显示“上一步”按钮
        prevText: quotationDetailPrevButtonLabel, // “上一步”按钮文本根据显示/编辑模式动态变化
        nextText: quotationDetailNextButtonLabel // “下一步”按钮文本根据显示/编辑/创建模式动态变化
    },
    //阶段 2
    {
        prevText: '/hide',
        nextText: '/hide'
    }
];


// ====================================================================
// 10. 暴露给父组件的方法 (如果这个组件是子组件)
// ====================================================================



//=====================================================================
// 开始做items详情页
//=====================================================================
const selectedItems = ref<VarNode[]>([])
const currentItemIndex = ref(0)
//临时的 VarNode，它是当前正在编辑的物品的一个克隆
const editingNode = {
    node: createNodeFromConfig(quotationDataTree.findNodeByPath(['itemOverview','items'])!.config.childTemplate!)
}

const itemDetailStageCancelButtonLabel = computed(() => {
    if (onCreateState.value) {
        return 'Cancel'
    }
    if (onChangeState.value) {
        return 'Cancel'
    }
    if (onDisplayState.value) {
        return 'Back'
    }
    return 'Back'
})

const itemDetailStageExecuteButtonVisible = computed(() => {
    return onCreateState.value || onChangeState.value
})

const itemConditionTabBarStage = ref(0); // 确保这个 ref 已经被定义，并且默认值为 0，对应 Sales Tab

/**
 * @description 处理 Item 详情页中 Sales/Conditions Tab 的点击事件
 * @param index 选中的 Tab 的索引 (0 为 Sales, 1 为 Conditions)
 */
function handleItemConditionTabClick(index: number) {
    itemConditionTabBarStage.value = index;
    console.log(`切换到 Item Condition Tab: ${index === 0 ? 'Sales' : 'Conditions'}`);
    // 可以在这里根据需要添加强制更新，但在 Vue 的响应式系统中，通常不需要，因为 v-if 会自动响应
    // appContentRef.value.forceUpdate(); // 如果遇到渲染问题可以尝试添加
}

/**
 * @description Quotation物品详细信息-头部
 */
const itemDetailHeaderTree = createTreeFromConfig(
    cns('dict','dict','itemDetailHeader',{},true,
    {
        childNameDisplayTranslation: {
            item: 'Sales Document Item',
            material: 'Material'
        }
    },
    [
        cns('string','leaf','item','',false,{},[]),
        cns('string','leaf','material','',false,{},[]),
    ])
)

/**
 * @description Quotation物品详细信息-Sales
 */
const itemDetailSalesTree = createTreeFromConfig(
    cns('dict','dict','itemDetailSales',{},false,{hideLabel:true},[
        cns('dict','dict','orderQuantityAndDeliveryDate',{},false,
                {
                    childNameDisplayTranslation: {
                        orderQuantity: 'Quantity',
                        reqDelivDate: 'First Delivery Date'
                    }
                },
                [
                    cns('string','leaf','orderQuantity','',false,{},[]),
                    cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[]),
                    cns('date','leaf','reqDelivDate','',false,{},[]),
                ],
                'Order Quantity and Delivery Date'
            ),
        cns('dict','dict','generalSalesData',{},false,
                {
                    childNameDisplayTranslation: {
                        pricingDate: 'Pricing Date: ',
                        orderProbability: 'Order Probability: '
                    }
                },
                [
                    cns('string','leaf','netValue','',true,{},[]),
                    cns('string','leaf','netValueUnit','',true,{hideLabel:true},[]),
                    cns('string','leaf','pricingDate','',false,{},[]),
                    cns('string','leaf','orderProbability','1',false,{},[]),
                ]
        )
    ])
)

/**
 * @description Quotation物品详细信息-Conditions
 */
const itemDetailConditionTree = createTreeFromConfig(
    cns('dict','dict','itemDetailConditions',{},false,
        {
            childNameDisplayTranslation: {
                orderQuantity: 'Quantity',  
            }
        },
        [
            cns('string','leaf','orderQuantity','',false,{},[]),
            cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[]),
            cns('string','leaf','netValue','',true,{},[]),
            cns('string','leaf','netValueUnit','',true,{hideLabel:true},[]),
            cns('string','leaf','taxValue','',true,{},[]),
            cns('string','leaf','taxValueUnit','',true,{hideLabel:true},[]),
            cns('dynamiclist','list','pricingElements',null,true,{},[],"Pricing Elements")
        ]
    )
)

/**
 * 验证当前itemCondition数据并同步到原始item
 * @description 把editingNode.node中的数据发送给后端验证，验证成功后更新原始item的数据
 * @description 统一使用了itemstabquery
 */
async function validateCurrentItemConditionData(): Promise<boolean> {
    // 如果当前编辑节点已经被标记为已验证且未修改，则无需再次验证
    if (editingNode.node.config.data?.validation === true) {
        console.log('数据未更改或已验证，无需再次验证:', editingNode.node);
        return true;
    }

    const nodeList = [editingNode.node]; // 包装成数组，因为 itemsTabQuery 期望一个 VarNode 数组
    const isValidate = await itemsTabQuery(nodeList); // 调用批量查询接口进行验证

    if (isValidate) {
        console.log('当前物品数据验证成功。');
        // 验证成功后，将 editingNode.node (克隆体) 的最新数据同步回 selectedItems 中的原始节点
        const currentNode = selectedItems.value[currentItemIndex.value];
        if (currentNode) {
        // 使用 forceSetValue 确保所有字段（包括动态列表）都被完整复制
        currentNode.forceSetValue(editingNode.node.getValue());
        console.log('原始物品数据已更新:', currentNode.getValue());
        }
    } else {
        console.log('当前物品数据验证失败。');
        // 如果验证失败，editingNode.node.config.data.validation 会被 itemsTabQuery 设置为 false
    }
    return isValidate;
}

/**
 * @description quotation批量查询，向后端发送VarNode[]，返回Net Value: 和 Expect. Oral Val: 包括值和单位，还有每个item的详细信息
 * @description 该方法会更新入参VarNode[]中的数据
 * @param {Array<VarNode>} itemNodes 
 * 同时根据返回的badRecordIndices设置每个VarNode的config.data.validation
 */
async function itemsTabQuery(itemNodes: VarNode[]) {
    // 提取每个VarNode的值
    const itemValues = itemNodes.map(node => node.getValue())

    const data = await fetch(`${API_BASE_URL}/api/quotation/items-tab-query`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemValues)
    }).then(response => {
        console.log('正常返回', response)
        return response.json()
    }).catch(error => {
        console.error('批量查询失败:', error)
        return { success: false }
    })

    console.log('返回的数据', data)

    if (data.success) {
        // 更新总体数据
        quotationDataTree.findNodeByPath(['basicInfo','netValue'])?.setValue(data.data.generalData?.netValue)
        quotationDataTree.findNodeByPath(['basicInfo','netValueUnit'])?.setValue(data.data.generalData?.netValueUnit)
        quotationDataTree.findNodeByPath(['itemOverview','expectOralVal'])?.setValue(data.data.generalData?.expectOralVal)
        quotationDataTree.findNodeByPath(['itemOverview','expectOralValUnit'])?.setValue(data.data.generalData?.expectOralValUnit)

        // 更新每个item的详细信息，使用forceSetValue确保完整更新
        if (data.data.breakdowns && Array.isArray(data.data.breakdowns)) {
        data.data.breakdowns.forEach((breakdown: any, index: number) => {
            if (index < itemNodes.length) {
            // 调试：打印breakdown数据结构
            console.log('Breakdown data for item', index, ':', breakdown)
            if (breakdown.pricingElements) {
                console.log('PricingElements structure:', breakdown.pricingElements)
            }
            // 使用forceSetValue确保包括pricingElements在内的所有字段都被正确更新
            itemNodes[index].forceSetValue(breakdown)
            }
        })
        }

        // 根据badRecordIndices设置validation
        if (data.data.result && Array.isArray(data.data.result.badRecordIndices)) {
        // 先重置所有节点的validation
        itemNodes.forEach(node => {
            if (!node.config.data) {
            node.config.data = {}
            }
            node.config.data.validation = true
        })

        // 设置不合法节点的validation
        data.data.result.badRecordIndices.forEach((badIndex: number) => {
            if (badIndex < itemNodes.length) {
            if (!itemNodes[badIndex].config.data) {
                itemNodes[badIndex].config.data = {}
            }
            itemNodes[badIndex].config.data.validation = false
            }
        })
        }

        appContentRef.value.forceUpdate()
        return data.data.result.allDataLegal === 1
    }

    return false
}

/**
 * 处理用户输入事件，立即将维护的节点标记为未验证
 */
function handleInputFromNodeItemCondition(_node: VarNode, value: string, data: any) {
    if (!editingNode.node.config.data) {
        editingNode.node.config.data = {}
    }
    editingNode.node.config.data.validation = false
}

/**
 * 更新详情页面的树结构数据
 * @description 把editingNode.node设为正在编辑节点的一个拷贝，将itemCondition中的输入框指向这个拷贝中的节点
 */
function updateItemDetailTrees() {
    if (selectedItems.value.length === 0) return;

    const currentItem = selectedItems.value[currentItemIndex.value];
    // 核心：克隆原始节点，所有编辑都基于这个克隆
    editingNode.node = currentItem.clone();
    const nodeToDisplay = editingNode.node;

    // 辅助函数：将源节点替换到目标树的指定路径
    // 注意：这里使用 replaceNodeByPath 是为了替换整个子树（特别是动态列表），
    // 确保 VarBox 能够正确渲染新节点。
    const replaceNodeInTargetTree = (sourcePath: string[], targetPath: string[], targetTree: VarTree) => {
        const sourceNode = nodeToDisplay.findNodeByPath(sourcePath);
        if (sourceNode) {
        targetTree.replaceNodeByPath(sourceNode, targetPath);
        }
    };

    // Header数据
    replaceNodeInTargetTree(['item'], ['item'], itemDetailHeaderTree);
    replaceNodeInTargetTree(['material'], ['material'], itemDetailHeaderTree);

    // Sales数据
    replaceNodeInTargetTree(['orderQuantity'], ['orderQuantityAndDeliveryDate', 'orderQuantity'], itemDetailSalesTree);
    replaceNodeInTargetTree(['orderQuantityUnit'], ['orderQuantityAndDeliveryDate', 'orderQuantityUnit'], itemDetailSalesTree);
    replaceNodeInTargetTree(['reqDelivDate'], ['orderQuantityAndDeliveryDate', 'reqDelivDate'], itemDetailSalesTree);
    replaceNodeInTargetTree(['netValue'], ['generalSalesData', 'netValue'], itemDetailSalesTree);
    replaceNodeInTargetTree(['netValueUnit'], ['generalSalesData', 'netValueUnit'], itemDetailSalesTree);
    replaceNodeInTargetTree(['pricingDate'], ['generalSalesData', 'pricingDate'], itemDetailSalesTree);
    replaceNodeInTargetTree(['orderProbability'], ['generalSalesData', 'orderProbability'], itemDetailSalesTree);

    // Condition数据 - 也使用值拷贝
    replaceNodeInTargetTree(['orderQuantity'], ['orderQuantity'], itemDetailConditionTree);
    replaceNodeInTargetTree(['orderQuantityUnit'], ['orderQuantityUnit'], itemDetailConditionTree);
    replaceNodeInTargetTree(['netValue'], ['netValue'], itemDetailConditionTree);
    replaceNodeInTargetTree(['netValueUnit'], ['netValueUnit'], itemDetailConditionTree);
    replaceNodeInTargetTree(['taxValue'], ['taxValue'], itemDetailConditionTree);
    replaceNodeInTargetTree(['taxValueUnit'], ['taxValueUnit'], itemDetailConditionTree);
    // 特别注意：pricingElements 是一个动态列表，必须完整替换
    replaceNodeInTargetTree(['pricingElements'], ['pricingElements'], itemDetailConditionTree);

    // 强制更新界面显示
    // 由于我们替换了整个节点，VarBox 通常会自动响应。但为了确保万无一失，可以保留。
    if (appContentRef.value) {
        appContentRef.value.forceUpdate();
    }
}

/**
 * 保存itemCondition数据并返回stage1
 */
async function saveItemConditionData(): Promise<boolean> {
    const isValid = await validateCurrentItemConditionData(); // 保存前再次验证当前物品数据
    if (isValid) {
        // 验证成功，可以返回stage1
        appContentRef.value.goToStage(1);
        console.log('物品数据已验证并保存，返回信息主页。');
        return true;
    } else {
        console.log('物品数据验证失败，无法保存并返回。');
        // 可以在这里提供更具体的错误信息给用户
        return false;
    }
}

/**
 * 取消itemCondition编辑，返回stage1
 */
function cancelItemCondition() {
  // 重置当前选中items的validation状态，避免因为未完成的编辑导致下次无法进入
    if (selectedItems.value.length > 0) {
        selectedItems.value.forEach(item => {
        if (item.config.data?.validation === false) {
            // 将validation状态重置为undefined，表示需要重新验证
            item.config.data.validation = undefined
        }
        })
    }
    selectedItems.value = []
    // 不保存数据，直接返回stage1
    appContentRef.value.goToStage(1)
}

/**
 * @description 处理 Items Table 的按钮点击事件
 * @param selection 选中的行 (这个参数实际上没用，我们直接从 tree 中获取选中项)
 */
async function handleItemsTableClick() {
    const itemsNode = quotationDataTree.findNodeByPath(['itemOverview', 'items'])!;
    const selectedChildren = [...itemsNode.getSelectedChildren()]; // 获取所有选中的子节点

    if (selectedChildren && selectedChildren.length > 0) {
        // 1. 先检查所有选中的 item 是否有 validation 状态（即是否被修改过但未验证）
        const itemsToValidate = selectedChildren.filter(item =>
        item.config.data?.validation === undefined || item.config.data?.validation === false
        );

        // 如果有需要验证的 item，先进行验证
        if (itemsToValidate.length > 0) {
        console.log('发现未验证或验证失败的 item，进行验证...');
        // itemsTabQuery 会更新这些节点的 validation 状态
        const validationResult = await itemsTabQuery(itemsToValidate as VarNode[]);
        if (!validationResult) {
            console.log('验证失败，无法继续进入物品详情页。');
            return; // 验证失败，不继续执行
        }
        }

        // 2. 再次检查所有选中的 item 是否都验证通过
        const hasInvalidItems = selectedChildren.some(item =>
        item.config.data?.validation === false
        );

        if (hasInvalidItems) {
        console.log('存在验证未通过的 item，无法继续进入物品详情页。');
        // 如果 itemsTabQuery 已经执行过，这里会捕获到 validation: false 的节点
        return; // 有验证未通过的 item，不继续执行
        }

        // 3. 所有验证都通过，继续执行
        selectedItems.value = selectedChildren;
        currentItemIndex.value = 0; // 默认显示第一个选中项

        // 更新详情页面的数据
        updateItemDetailTrees();

        // 切换到详情页面
        appContentRef.value.goToStage(2);

        // 成功进入详情页面后，清空 items 表格的选中状态
        itemsNode.children.forEach(child => {
        child.setSelection(false);
        });
    } else {
        console.log('没有选中任何物品。');
        // 可以添加用户提示，例如： alert('请至少选择一个物品。');
    }
}

/**
 * 处理itemCondition页面的数据变更事件（回车或失去焦点）
 */
async function handleEnterFromNodeItemCondition(_node: VarNode, value: string, data: any) {
    // 关键操作：回车时验证数据
    // 只有当节点被修改（即 validation 为 false 或 undefined）时才执行验证
    if (_node.config.data?.validation !== true) {
        console.log('回车或失去焦点，触发当前物品数据验证...');
        await validateCurrentItemConditionData();
    }
}

/**
 * 切换到上一个/下一个选中的item
 * @description 安全的方法，会先验证当前数据
 */
async function switchToItem(index: number) {
    // 尝试验证当前编辑的物品数据
    const isValid = await validateCurrentItemConditionData();
    if (isValid) {
        // 验证成功，可以安全切换
        _switchToItemWhenValidate(index);
    } else {
        console.log('数据验证失败，无法切换到其他物品。');
        // 可以添加用户提示，例如： alert('当前物品数据有误，请修正后再切换。');
    }
}

/**
 * 内部函数，实际执行物品切换（在验证通过后调用）
 */
function _switchToItemWhenValidate(index: number) {
    if (index >= 0 && index < selectedItems.value.length) {
        currentItemIndex.value = index;
        updateItemDetailTrees(); // 更新 UI 显示新物品的数据
    }
}

/**
 * 切换到上一个item
 * @description 包装switchToItem方法
 */
async function switchToPreviousItem() {
    await switchToItem(currentItemIndex.value - 1);
}

/**
 * 切换到下一个item
 * @description 包装switchToItem方法
 */
async function switchToNextItem() {
    await switchToItem(currentItemIndex.value + 1);
}

/**
 * @description Pricing Element Rules
 * @description Deletion: 删除后传入后端，进行验证并返回规范化的数据/破坏的值则把validation设为false
 */
async function handlePricingElementsDeletion() {
    const pricingElementsNode = itemDetailConditionTree.findNodeByPath(['pricingElements'])!;
    const deletionNodes = pricingElementsNode.getSelectedChildren();

    // 从 VarTree 的 children 数组中移除选中的节点
    pricingElementsNode.children = pricingElementsNode.children.filter(child => !deletionNodes.includes(child));

    // 调用验证，将删除后的数据发送到后端，获取最新的（可能规范化后的）定价元素列表
    // 这一步会更新 editingNode.node 中的 pricingElements 数据，并重新标记 validation 状态
    await validateCurrentItemConditionData();

    // 强制更新界面显示，确保删除的行从 UI 上消失
    appContentRef.value.forceUpdate();
    }

    /**
     * @description 调用handlePricingElementsDeletion删除选中的记录并验证
     */
    async function handlePricingElementsRemoveButtonClick() {
    await handlePricingElementsDeletion();
}



// 定义组件对外暴露的属性和方法，允许父组件通过 ref 访问
defineExpose({
    appToState, // 允许外部调用以切换应用状态
});
</script>

<style scoped>
.manageSalesQuotations {
    height: 90vh;
    overflow-y: auto;
}

.item-nav-button {
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

.item-nav-button:hover {
    background-color: var(--btn-hover-bg); /* 悬停时改变背景色 */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 悬停时加深阴影 */
    transform: translateY(-2px); /* 悬停时轻微上浮 */
    color: var(--btn-hover-text); /* 悬停时改变文字颜色 */
}

.item-nav-button:active {
    background-color: var(--btn-active-bg); /* 点击时改变背景色 */
    box-shadow: 0 2px 4px var(--btn-active-shadow);
    transform: translateY(0); /* 点击时恢复位置 */
}

.item-nav-button:focus {
    border-color: var(--btn-focus-border); /* 获得焦点时显示蓝色边框 */
    box-shadow: 0 0 0 0.2rem var(--btn-focus-shadow); /* 焦点光晕 */
}

.item-counter{
    margin-left:10px;
    margin-right: 10px;
    font-weight: bold;
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
    transform: translateY(-2px); /* 轻微上浮 */
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

.view-details-btn:focus {
    border-color: var(--btn-focus-border);
    box-shadow: 0 0 0 0.2rem var(--btn-focus-shadow);
}

/* 调整 StatusBadge 的位置，让其在单元格内居中对齐 */
td .status-badge {
    display: flex;
    justify-content: left;
    align-items: center;
}

.no-data-message {
    text-align: center;
    padding: 20px;
    color: #6c757d;
    font-size: 1.1em;
}

.nav-button {
    padding: 8px 16px;
    margin-left: 10px;
    border: none;
    border-radius: 5px;
    background-color: #6c757d;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.nav-button:hover {
    background-color: #5a6268;
}

.table-extra-button {
    width: inherit;
    padding: 0 6px;
    min-width: 20px;
    height: 24px;
    cursor: pointer;
}

.table-extra-button:disabled {
    cursor: not-allowed;
}

:deep(.query--dict-leaf-section){
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    grid-template-rows: auto auto auto auto;
}

:deep(.query-salesQuotation--wrapper){
    grid-column: 1;
    grid-row: 1;
}

:deep(.quotationData-basicInfo--dict-leaf-section) {
    display: grid;
    grid-template-columns: 50% 35% 15%;
    grid-template-rows: auto auto auto auto;
}

:deep(.quotationData-basicInfo-quotation--wrapper) {
    grid-column: 1;
    grid-row: 1;
}
:deep(.quotationData-basicInfo-netValue--wrapper) {
    grid-column: 2;
    grid-row: 1;
}
:deep(.quotationData-basicInfo-netValueUnit--wrapper) {
    grid-column: 3;
    grid-row: 1;
}
:deep(.quotationData-basicInfo-soldToParty--wrapper) {
    grid-column: 1;
    grid-row: 2;
}
:deep(.quotationData-basicInfo-shipToParty--wrapper) {
    grid-column: 1;
    grid-row: 3;
}
:deep(.quotationData-basicInfo-customerReference--wrapper) {
    grid-column: 1;
    grid-row: 4;
}
:deep(.quotationData-basicInfo-customerReferenceDate--wrapper) {
    grid-column: 2;
    grid-row: 4;
}

:deep(.quotationData-itemOverview--dict-leaf-section) {
    display: grid;
    grid-template-columns: 50% 35% 15%;
    grid-template-rows: auto auto;
}
:deep(.quotationData-itemOverview-validTo--wrapper) {
    grid-column: 2;
    grid-row: 1;
}
:deep(.quotationData-itemOverview-reqDelivDate--wrapper) {
    grid-column: 1;
    grid-row: 2;
}
:deep(.quotationData-itemOverview-expectOralVal--wrapper) {
    grid-column: 2;
    grid-row: 2;
}
:deep(.quotationData-itemOverview-expectOralValUnit--wrapper) {
    grid-column: 3;
    grid-row: 2;
}
:deep(.itemDetailHeader--dict-leaf-section){
    display: grid;
    grid-template-columns: 50% 35%;
    grid-template-rows: auto auto;
}
:deep(.itemDetailSales-orderQuantityAndDeliveryDate--dict-leaf-section){
    display: grid;
    grid-template-columns: 50% 35%;
    grid-template-rows: auto auto;
}
:deep(.itemDetailSales-generalSalesData--dict-leaf-section){
    display: grid;
    grid-template-columns: 50% 35%;
    grid-template-rows: auto auto;
}
:deep(.itemDetailConditions--dict-leaf-section){
    display: grid;
    grid-template-columns: 50% 35%;
    grid-template-rows: auto auto;
}
</style>