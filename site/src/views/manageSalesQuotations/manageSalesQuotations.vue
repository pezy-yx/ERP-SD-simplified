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
                <VarBox v-if="quotationDataTree.root" :tree="quotationDataTree" @enter-from-node="handleEnterFromNodeQuotationTree">
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
                <ItemConditionDetail
                    :kit="itemConditionKit"
                    :config="{
                        navigationLabels: {
                            cancel: 'Cancel',
                            save: 'Save',
                            previous: '← Previous',
                            next: 'Next →'
                        }
                    }"
                    @validation-success="handleItemConditionValidationSuccess"
                    @validation-failed="handleItemConditionValidationFailed"
                    @save="handleItemConditionSave"
                    @cancel="handleItemConditionCancel"
                >
                    <!-- teleport目标插槽 -->
                    <template #footer-content-right>
                        <slot name="footer-content-right"></slot>
                    </template>
                </ItemConditionDetail>
            </template>

            <template #footer-content-right>
                
                <template v-if="appContentRef?.currentStage === 0">
                    <button v-if="onSearchState" class="nav-button next-button" @click="initializeCreation()">Create New</button>
                </template>
                <template v-if="appContentRef?.currentStage == 2">
                    <!-- ItemConditionDetail 组件会自动处理 Cancel 和 Save 按钮 -->
                </template>
            </template>
        </AppContent>

        <div v-if="showInquiryModal" class="modal-overlay">
            <div class="modal-content">
                <div class="input-group">
                    <label for="inquiryIdInput">create quotation according inquiry:</label>
                    <input type="text" id="inquiryIdInput" v-model="inquiryIdInput" placeholder="inquiry id" />
                    <input type="text" id="customerIdInput" v-model="customerIdInput" placeholder="customer id" />
                </div>
                <div class="modal-actions">
                    <button @click="createQuotationFromInquiry" class="btn-primary">create</button>
                    <button @click="cancelInquiryCreation" class="btn-secondary">cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, onMounted } from 'vue';
import AppContent from '@/components/applicationContent/AppContent.vue';
import VarBox from '@/components/varbox/VarBox.vue';
import { bpSearch, materialUnitSearch, quotationIdSearch, soldToPartySearch } from '@/utils/searchMethods';
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
import { createItemConditionKit, type ItemConditionKit } from '@/utils/ItemConditionKit'
import ItemConditionDetail from '@/components/itemCondition/ItemConditionDetail.vue'

const customerIdInput = ref(''); // 用于存储用户输入的客户 ID

const cancelInquiryCreation = () => {
    showInquiryModal.value = false;
    inquiryIdInput.value = ''; // 清空输入
    appToState('search');
};

const createQuotationFromInquiry = async () => {
    if (!inquiryIdInput.value.trim()) {
        alert('请输入 Inquiry ID！');
        return;
    }

    try {
        // 请确保这里的URL与您后端新增的接口路径完全一致
        const response = await fetch(`${window.getAPIBaseUrl()}/api/quotation/create-quotation-from-inquiry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inquiryId: inquiryIdInput.value, customerId: customerIdInput.value })
        });

        const result = await response.json();

        if (result.success) {
            // alert(`报价单创建成功！新报价单 ID: ${result.data.quotationData.basicInfo.quotation || '未知'}`);
            showInquiryModal.value = false;
            inquiryIdInput.value = ''; // 清空输入

            // 成功后跳转到新的报价单详情页，或者刷新列表
            // 假设后端返回了新报价单的完整数据或ID
            if (result.data && result.data.quotationData && result.data.quotationData.basicInfo) {
                // 如果后端返回了新报价单的完整数据
                quotationDataTree.forceSetValue(result.data.quotationData);

                appContentRef.value.goToStage(1); // 切换到详情页 (阶段 1)
                appToState('create'); // 设置应用状态为“创建”模式 (可编辑)
            } else {
                appToState('search');
                alert('可以尝试刷新一下')
            }

        } else {
            alert(`创建报价单失败: ${result.message || '未知错误'}`);
        }
    } catch (error) {
        console.error('创建报价单请求失败:', error);
        alert('创建报价单时发生网络错误或服务器异常。');
    }
};

// --- 新增的模态窗口相关状态和方法 ---
const showInquiryModal = ref(false);
const inquiryIdInput = ref(''); // 用于存储用户输入的 inquiry ID

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
    salesQuotation: string;    // 销售报价单号
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
            // items节点将通过ItemConditionKit动态创建
        ],'Item Overview'), // 'Item Overview' 结束
    ])
);

// 创建 ItemConditionKit 实例
const itemConditionKit = createItemConditionKit({
  validationEndpoint: '/api/quotation/items-tab-query',
  readonly: false,
  navigationLabels: {
    cancel: 'Cancel',
    save: 'Save',
    previous: '← Previous',
    next: 'Next →'
  }
})
// 复用 kit 的校验能力，并在校验成功后更新总计字段
itemConditionKit.updateConfig({
  onGeneralData: async (generalData: any) => {
    await fetch(`${window.getAPIBaseUrl()}/api/item/cal-value`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotationDataTree.findNodeByPath(['itemOverview','items'])?.getValue() ?? [])
    }).then(async (response) => {
      const data = await response.json()
      // 更新销售订单数据树
      quotationDataTree.findNodeByPath(['basicInfo','netValue'])?.forceSetValue(data?.data?.netValue)
      quotationDataTree.findNodeByPath(['basicInfo','netValueUnit'])?.forceSetValue(data?.data?.netValueUnit)
      quotationDataTree.findNodeByPath(['itemOverview','expectOralVal'])?.forceSetValue(data?.data?.netValue)
      quotationDataTree.findNodeByPath(['itemOverview','expectOralValUnit'])?.forceSetValue(data?.data?.netValueUnit)
      quotationDataTree.forceUpdate()
    })
  }
})

// 使用 ItemConditionKit 创建 items 节点（使用默认模板）
itemConditionKit.summonItemsNode(
  quotationDataTree,
  ['itemOverview', 'items']
)

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
        cns('string', 'leaf', 'soldToParty', '', false, {searchMethods: soldToPartySearch}, [], 'Sold-To Party:'),
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
            cns('string','leaf','soldToParty','',false,{searchMethods: soldToPartySearch},[],"Sold-To Party:"),
            cns('string','leaf','shipToParty','',false,{searchMethods: soldToPartySearch},[],"Ship-To Party:"),
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
            // items节点将通过ItemConditionKit动态创建
        ],'Item Overview'), // 'Item Overview' 结束
    ])
);

// 为 initialCreationTree 手动添加 items 节点（不使用 ItemConditionKit）
const initialCreationItemsNode = createNodeFromConfig(
  cns('dynamiclist','list','items',null,false,{
    hideLabel:true,
    hideList: ['netValue', 'netValueUnit', 'pricingDate', 'orderProbability','reqDelivDate','taxValue','taxValueUnit','pricingElements'],
    childTemplate: cns('dict','dict','item',null,false,{},[
      cns('string','leaf','item','',true,{},[],"Item"),
      cns('string','leaf','material','',false,{},[],"Material"),
      cns('string','leaf','orderQuantity','',false,{},[],"Order Quantity"),
      cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true, searchMethods:materialUnitSearch},[],"SU"),
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
        childTemplate: cns('dict','dict','condition',null,false,{},[
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
    ])
  },[],"Items")
)
const initialCreationItemOverviewNode = initialCreationTree.findNodeByPath(['itemOverview'])
if (initialCreationItemOverviewNode) {
  initialCreationItemsNode.name = 'items'
  initialCreationItemOverviewNode.addChild(initialCreationItemsNode)
}

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
async function fetchQuotationDetails(id: string) {
    try {
        const response = await fetch(`${window.getAPIBaseUrl()}/api/quotation/details`, {
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
        const response = await fetch(`${window.getAPIBaseUrl()}/api/quotation/search`, {
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

            // alert(`查询成功，共找到 ${results.length} 条报价单！`);
        } else {
            // alert('未找到报价单信息!');
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
    showInquiryModal.value = true;
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
            const res = await fetch(`${window.getAPIBaseUrl()}/api/quotation/update`, { // 假设这是更新 API
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
            const res = await fetch(`${window.getAPIBaseUrl()}/api/quotation/update`, { // 假设这是创建 API
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



// ItemConditionKit 自动处理所有 item detail 相关的逻辑

// ItemConditionKit 自动处理按钮标签和可见性

/**
 * @description 报价单变量树的enter-from-node事件处理（对齐 inquiry 行为：当 itemOverview/items 下字段回车时触发批量校验）
 */
async function handleEnterFromNodeQuotationTree(node: VarNode, value: string, data: any) {
  if (data.nodePath.length > 2 && data.nodePath[0] === 'itemOverview' && data.nodePath[1] === 'items') {
    await (itemConditionKit as any).validateItemsInTree(
      quotationDataTree,
      ['itemOverview','items'],
      { forceUpdateTree: quotationDataTree }
    )
  }
}

// ItemConditionKit 自动处理标签页切换

// ItemConditionKit 自动处理 item detail header

// ItemConditionKit 自动处理 item detail sales

// ItemConditionKit 自动处理 item detail conditions

/**
 * ItemConditionDetail 事件处理函数
 */
function handleItemConditionValidationSuccess(items: VarNode[]) {
  console.log('Item condition validation success:', items)
}

function handleItemConditionValidationFailed(items: VarNode[]) {
  console.log('Item condition validation failed:', items)
}

function handleItemConditionSave() {
  console.log('Item condition save')
  // 返回到主页面
  appContentRef.value.goToStage(1) // 返回到quotationDetail阶段
}

function handleItemConditionCancel() {
  console.log('Item condition cancel')
  // 返回到主页面
  appContentRef.value.goToStage(1) // 返回到quotationDetail阶段
}

// ItemConditionKit 自动处理数据验证和同步

/**
 * @description 复用统一校验逻辑，移除本地 itemsTabQuery
 */

// ItemConditionKit 自动处理输入事件

// ItemConditionKit 自动处理所有详情页面的数据更新和保存逻辑

// ItemConditionKit 自动处理取消逻辑

/**
 * @description 处理 Items Table 的按钮点击事件（使用ItemConditionKit）
 */
async function handleItemsTableClick() {
    const itemsNode = quotationDataTree.findNodeByPath(['itemOverview', 'items'])!;
    const selectedChildren = [...itemsNode.getSelectedChildren()]; // 获取所有选中的子节点

    if (selectedChildren && selectedChildren.length > 0) {
        // 检查是否有未验证的items
        const unvalidatedItems = selectedChildren.filter(item =>
            item.config.data?.validation !== true
        );

        if (unvalidatedItems.length > 0) {
            console.log('发现未验证的items，正在验证...');
            const isValid = await (itemConditionKit as any).validateItems(unvalidatedItems, { forceUpdateTree: quotationDataTree });
            if (!isValid) {
                console.log('数据验证失败，无法进入详情页面');
                return;
            }
        }

        // 所有验证都通过，切换到详情页面
        appContentRef.value.goToStage(2); // Stage 2 是itemCondition

        // 不清空选中状态，让ItemConditionDetail组件处理
    } else {
        console.log('没有选中任何物品。');
    }
}

// ItemConditionKit 自动处理所有 item detail 相关的事件和切换逻辑



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

/* 包裹表格的容器，增加一些空间和阴影 */
.search-results-table-container {
    margin-top: 20px;
    background-color: var(--theme-color-page);
    border-radius: 2px;
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
    background-color: var(--theme-color-dark); 
    color: var(--theme-color-text); 
    font-weight: 500;
    text-transform: uppercase; /* 字母大写 */
    letter-spacing: 0.5px;
}

th, td {
    padding: 12px 15px; /* 增加内边距 */
    text-align: left;
    border-bottom: 1px solid #ccc; /* 柔和的底部边框线 */
}

/* 斑马纹效果，让行更易读 */
tbody tr:nth-child(even) {
    background-color: var(--theme-color-page); /* 偶数行使用浅色背景 */
}

/* 行悬停效果 */
tbody tr:hover {
    background-color: #ccc; /* 悬停时使用更亮的蓝色背景 */
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

/* .nav-button {
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
} */

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
/* 模态窗口样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 确保在最上层 */
}

.modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    width: 400px;
    max-width: 90%;
    text-align: center;
}

.modal-content h3 {
    margin-top: 0;
    color: #333;
    font-size: 1.5em;
    margin-bottom: 20px;
}

.input-group {
    margin-bottom: 25px;
}

.input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555;
}

.input-group input[type="text"] {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
}

.modal-actions button {
    padding: 10px 20px;
    margin: 0 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
}

.modal-actions .btn-primary {
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

.modal-actions .btn-primary:hover {
    background-color: var(--btn-hover-bg); /* 悬停时改变背景色 */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 悬停时加深阴影 */
    transform: translateY(-2px); /* 轻微上浮 */
    color: var(--btn-hover-text); /* 悬停时改变文字颜色 */
}

.modal-actions .btn-secondary {
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
.modal-actions .btn-secondary:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 悬停时加深阴影 */
    transform: translateY(-2px); /* 轻微上浮 */
    background-color: #5a6268;
    color: var(--btn-hover-text); /* 悬停时改变文字颜色 */
}
</style>