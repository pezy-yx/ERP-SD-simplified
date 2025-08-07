<template>
  <div class="material-document-overview">
    <div class="md-page-content" v-if="!showAppContent">
      <div class="material-document-search">
        <VarBox
          :tree="materialQueryTree"
          class="material-document-query-varbox"
        />
        <div class="go-button-container" @click="performMaterialDocumentSearch">
          <button class="search-enter-button go-button">Go</button>
        </div>
      </div>
      <div v-if="searchPerformed && materialDocumentResult && materialDocumentResult.length > 0" class="query-results-list" style="width: 100%;">
        <div class="material-document-rows-container">
          <div class="material-document-row-header">
              <div class="header-item material-document-id">Material Document</div>
              <div class="header-item plant">Plant</div>
              <div class="header-item posting-date">Posting Date</div>
              <div class="header-item document-date">Document Date</div>
              <div class="header-item"></div>
          </div>
          <div v-for="doc in materialDocumentResult" :key="doc.materialDocument" class="material-document-row" @click="viewMaterialDocumentDetail(doc.materialDocument)">
            <span class="row-item material-document-id">{{ doc.materialDocument }}</span>
            <span class="row-item plant">{{ doc.plant }}</span>
            <span class="row-item posting-date">{{ doc.postingDate }}</span>
            <span class="row-item document-date">{{ doc.documentDate }}</span>
            <span class="row-item arrow-icon">▶</span>
          </div>
        </div>
      </div>
      <div v-else-if="searchPerformed && materialDocumentResult && materialDocumentResult.length === 0" class="no-results">
        <p>No material documents found matching your criteria.</p>
      </div>
      <div v-else class="initial-output-message">
        <p>Enter query criteria and click "Go" to see results.</p>
      </div>
    </div>

    <AppContent
    v-if="showAppContent"
    :stages="['materialDocumentForm']"
    :before-next="handleExecute"
    :before-prev="handleCancel"
    :footer-config="[
      { prevText: materialDocumentFormPrevButtonLabel, nextText: materialDocumentFormNextButtonLabel }
    ]"
    ref="appContentRef"
  >
    <template #stage-materialDocumentForm>
      <div class="page-content">
        <div class="process-flow-container">
          <div class="process-flow-header">Process Flow</div>
          <div class="process-flow-diagram">
            <div class="flow-step">
              <div class="step-icon">
                <img src="@/assets/icons/create-outbound-deliveries.svg" alt="Delivery" class="icon-image" />
              </div>
              <span class="step-label">Delivery</span>
              <span class="step-id">{{ getProcessFlowValue('dlvId') }}</span>
              <div :class="['step-status', { 'ok-status-active': getProcessFlowValue('dlvId') }]">
                <input type="checkbox" :checked="!!getProcessFlowValue('dlvId')" disabled class="status-checkbox" />
                <span class="status-text">OK</span>
              </div>
            </div>

            <span :class="['flow-arrow', getArrowStatusClass('dlvId', 'materialDocument')]">▶</span>

            <div class="flow-item-details" v-if="getProcessFlowItemCount('dlvId')">
              {{ getProcessFlowItemCount('dlvId') }} Item(s)
            </div>

            <div class="flow-step">
              <div class="step-icon">
                <img src="@/assets/icons/material-documents-overview.svg" alt="Material Document" class="icon-image" />
              </div>
              <span class="step-label">Material Document</span>
              <span class="step-id">{{ getProcessFlowValue('materialDocument') }}</span>
              <div :class="['step-status', { 'ok-status-active': getProcessFlowValue('materialDocument') }]">
                <input type="checkbox" :checked="!!getProcessFlowValue('materialDocument')" disabled class="status-checkbox" />
                <span class="status-text">OK</span>
              </div>
              <div class="flow-item-details" v-if="getProcessFlowItemCount('materialDocument')">
                {{ getProcessFlowItemCount('materialDocument') }} Item(s)
              </div>
            </div>

            <span :class="['flow-arrow', getArrowStatusClass('materialDocument', 'billId')]">▶</span>

            <div class="flow-step">
              <div class="step-icon">
                <img src="@/assets/icons/manage-sales-quotations.svg" alt="Accounting Document" class="icon-image" />
              </div>
              <span class="step-label">Accounting Document</span>
              <span class="step-id">{{ getProcessFlowValue('billId') }}</span>
              <div :class="['step-status', { 'ok-status-active': getProcessFlowValue('billId') }]">
                <input type="checkbox" :checked="!!getProcessFlowValue('billId')" disabled class="status-checkbox" />
                <span class="status-text">OK</span>
              </div>
            </div>
          </div>
        </div>

        <VarBox
         :tree="materialDocumentDataTree"
         :class="{
           'material-document-detail-varbox': true
         }"
         :key="materialDocumentVarBoxKey"
         >
         </VarBox>
      </div>
    </template>
    </AppContent>
  </div>
</template>

<script setup lang="ts">
import VarBox from '@/components/varbox/VarBox.vue';
import { ref, Ref, computed, nextTick, onMounted } from 'vue';
import { createTreeFromConfig, cns } from '@/utils/VarTree';
import { materialSearch, quotationIdSearch, materialDocumentSearch, plantSearch, materialUnitSearch } from '@/utils/searchMethods';
import AppContent from '@/components/applicationContent/AppContent.vue';
let API_BASE_URL = window.API_BASE_URL || '';
onMounted(() => {
  API_BASE_URL = window.API_BASE_URL || '';
});

const appContentRef = ref(null) as any;
const currentAppStage = computed(() => appContentRef.value?.currentStage || 0);
const showAppContent = ref(false);

const materialQueryStructure = cns(
  "dict", "dict", "materialQuery", null, false, { hideLabel: true },
  [
    cns("string", "leaf", "materialDocument", '', false, {searchMethods: materialDocumentSearch}, [], "Material Document:"),
    cns("string", "leaf", "plant", '', false, {searchMethods: plantSearch}, [], "Plant:"),
    cns("date", "leaf", "materialDocumentYear", '', false, {}, [], "Material Document Year:"),
    cns("string", "leaf", "material", '', false, {searchMethods: materialSearch}, [], "Material:"),
    cns("date", "leaf", "postingDate", '', false, {}, [], "Posting Date:"),
    cns("date", "leaf", "documentDate", '', false, {}, [], "Document Date:"),
  ]
);
const materialQueryTree = createTreeFromConfig(materialQueryStructure);

const materialDocumentDetailStrcutrue = cns(
"dict", "dict", "materialDocumentDetail", null, false, {hideLabel: true},
[
cns("string", "leaf", "materialDocument", '', true, {}, [], "Material Document:"),
cns("string", "leaf", "plant", '', true, {}, [], "Plant:"),
cns("date", "leaf", "postingDate", '', true, {}, [], "Posting Date:"),
cns("date", "leaf", "documentDate", '', true, {}, [], "Document Date:"),
cns("date", "leaf", "materialDocumentYear", '', true, {}, [], "Material Document Year:"),

cns('dynamiclist','list','items',null,false,{
hideList: ['netValue', 'netValueUnit', 'pricingDate', 'orderProbability','reqDelivDate','taxValue','taxValueUnit','pricingElements'],
childTemplate:cns('dict','dict','item',null,false,{},[
cns('string','leaf','item','',true,{},[],"Item"),
cns('string','leaf','material','',true,{},[],"Material"),
cns('string','leaf','orderQuantity','',true,{},[],"Order Quantity"),
cns('string','leaf','orderQuantityUnit','',true,{hideLabel:true,searchMethods:materialUnitSearch},[],"SU"),
]),
},[],"Items"),

cns('dynamiclist', 'list', 'processFlow', null, true, {
hideSelf: true,
childTemplate:
cns("dict", "dict", "flowItem", null, false, {}, [
cns("string", "leaf", "dlvId", '', true, {}, [], "Delivery ID:"),
cns("string", "leaf", "materialDocument", '', true, {}, [], "Material Document:"), // Reverted to original name
cns("string", "leaf", "billId", '', true, {}, [], "Billing Document:"),
]),
},
[],""),
])

const state: Ref<'display'> = ref('display');
const materialDocumentVarBoxKey = ref(0);
const onDisplayState = computed(() => state.value === 'display');

function appToState(newState: 'display') {
  state.value = newState;
  if(materialDocumentDataTree.root)
  {
    materialDocumentDataTree.root.readonly = true;
  }
}

interface MaterialDocumentResult {
  materialDocument: string;
  plant: string;
  materialDocumentYear: string;
  material: string;
  postingDate: string;
  documentDate: string;
}

const materialDocumentDataTree = createTreeFromConfig(materialDocumentDetailStrcutrue);


const materialDocumentResult: Ref<MaterialDocumentResult[]> = ref([]);
const searchPerformed = ref(false);

const performMaterialDocumentSearch = async () => {
  const fullUrl = `${API_BASE_URL}/api/material/search`;
  const queryData = materialQueryTree.root?.getValue();

  searchPerformed.value = true;
  materialDocumentResult.value = [];

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryData),
    });
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      materialDocumentResult.value = result.data;
    } else {
      materialDocumentResult.value = [];
    }
  } catch (error: any) {
    materialDocumentResult.value = [];
  }
};

const materialDocumentFormPrevButtonLabel = computed(() => {
  return '/hide';
});

const materialDocumentFormNextButtonLabel = computed(() => {
  return 'Return';
});

async function handleCancel(currentStage: number, targetStage: number) {
  if (currentStage === 0) {
    showAppContent.value = false;
    appContentRef.value.goToStage(0);
    appContentRef.value.footerMessage = '';
    return false;
  }
  appContentRef.value.footerMessage = '';
  return true;
}

async function handleExecute(currentStage: number, targetStage: number) {
  appContentRef.value.footerMessage = '';
  showAppContent.value = false;
  return false;
}

const viewMaterialDocumentDetail = async (materialDocumentId: string) => {
  showAppContent.value = true;
  appToState('display');

  nextTick(async () => {
    if (appContentRef.value) {
      appContentRef.value.goToStage(0);

      appContentRef.value.footerMessage = 'Fetching material document details...';
      try {
        const response = await fetch(`${API_BASE_URL}/api/material/get/${materialDocumentId}`);
        const result = await response.json();
        if (result.success && result.data) {
          materialDocumentDataTree.root?.forceSetValue(result.data);
          materialDocumentVarBoxKey.value++;
          console.log("API original result.data:", JSON.stringify(result.data, null, 2));
          appContentRef.value.footerMessage = 'Material document details loaded.';
        } else {
          appContentRef.value.footerMessage = result.message || 'Failed to load material document details.';
          showAppContent.value = false;
        }
      } catch (error: any) {
        appContentRef.value.footerMessage = `Error fetching details: ${error.message}`;
        showAppContent.value = false;
      }
    }
  });
};

const getProcessFlowValue = (key: string) => {
  const processFlow = materialDocumentDataTree.root?.children.find(child => child.name === 'processFlow');
  if (processFlow && processFlow.children && processFlow.children.length > 0) {
    // Assuming the first item in processFlow is the relevant one for these IDs
    const flowItem = processFlow.children[0];
    const valueNode = flowItem.children.find((child: any) => child.name === key);
    return valueNode ? valueNode.getValue() : '';
  }
  return '';
};

// This function needs to determine the item count for each step.
// For "Material Document", it likely refers to the 'items' list.
// For "Delivery" and "Accounting Document", you'd need to define how to get their item counts.
// For now, I'll provide a placeholder or a common approach.
const getProcessFlowItemCount = (stepName: string) => {
  if (stepName === 'materialDocument') {
    const itemsNode = materialDocumentDataTree.root?.children.find(child => child.name === 'items');
    return itemsNode && Array.isArray(itemsNode.children) ? itemsNode.children.length : 0;
  }
  // You would need to add logic here to fetch item counts for Delivery and Accounting Document
  // This might involve looking into sub-structures of the processFlow or making additional API calls if necessary.
  // For demonstration, returning a fixed value or 0.
  // Example for delivery, if it had an item count in its data:
  // if (stepName === 'dlvId') {
  //   const dlvIdNode = materialDocumentDataTree.root?.children.find(child => child.name === 'processFlow')?.children[0]?.children.find((child:any) => child.name === 'dlvId');
  //   return dlvIdNode?.itemCount || 0; // Assuming itemCount exists
  // }
  return ''; // Or 0 if you prefer a number
};

const getMaterialDocumentYear = () => {
  const materialDocumentYearNode = materialDocumentDataTree.root?.children.find(child => child.name === 'materialDocumentYear');
  return materialDocumentYearNode ? materialDocumentYearNode.getValue() : '';
};

const getArrowStatusClass = (prevIdKey: string, nextIdKey: string) => {
  const prevId = getProcessFlowValue(prevIdKey);
  const nextId = getProcessFlowValue(nextIdKey);
  const dlvIdExists = !!getProcessFlowValue('dlvId'); // Check if Delivery ID exists

  if (prevId && nextId) {
    if (dlvIdExists) {
      return 'arrow-status-green'; // Green if both adjacent IDs exist and Delivery ID exists
    } else {
      return 'arrow-status-red'; // Red if both adjacent IDs exist but Delivery ID does NOT exist
    }
  }
  return 'arrow-status-grey'; // Grey by default or if conditions not met
};

</script>

<style scoped>
  .material-document-overview {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--theme-color-dark);
    width: 100%;
  }
  .materialQueryVarbox{
    flex-grow: 1;
    padding: 12px 15px;
    box-sizing: border-box;
  }
  :deep(.materialQuery-plant--wrapper){
    grid-row: 1;
    grid-column: 2;
    max-width: 300px;
  }
  :deep(.materialQuery-materialDocument--wrapper){
    grid-row: 1;
    grid-column: 1;
    max-width: 350px;
  }
  :deep(.materialQuery-materialDocumentYear--wrapper){
    grid-row: 1;
    grid-column: 3;
  }
  :deep(.materialQuery-material--wrapper){
    grid-row: 2;
    grid-column: 1;
    max-width: 300px;
  }
  :deep(.materialQuery-postingDate--wrapper){
    grid-row: 2;
    grid-column: 2;
  }
  :deep(.materialQuery-documentDate--wrapper){
    grid-row: 2;
    grid-column: 3;
  }

  /* Added styles based on ManageSalesOrders.vue */
  .md-page-content {
    flex-grow: 1;
    background-color: var(--theme-color-page);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 90%;
    padding: 20px;
    margin: 20px;
  }

  .material-document-search {
    display: flex;
    flex-direction: column;
    background-color: transparent;
    box-sizing: border-box;
    align-items: center;
    padding: 30px;
  }

  .material-document-query-varbox :deep(.var-input--main input) {
    flex-grow: 1;
    padding: 12px 15px;
    box-sizing: border-box;
  }

  .go-button-container {
    width: 80px;
    height: 40px;
    display: flex;
    align-self:flex-end;
    background-color: var(--theme-color-dark);
    margin-top: 10px;
    transition: background-color 0.3s ease;
    color: var(--theme-color-text);
    font-weight: bold;
    justify-content: center;
    font-size: 1em;
    cursor: pointer;
  }

  .go-button-container:hover {
      background-color: var(--theme-color-execute-button-hover);
  }

  .go-button {
    font-size: 1.0em;
    text-align: center;
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

  .material-document-row-header,
  .material-document-row {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--theme-color-lighter);
    padding: 8px 0; /* Add padding for better spacing */
  }

  .material-document-row-header {
    background-color: var(--theme-color-table-header-bg);
    font-weight: bold;
    color: var(--theme-color-table-header-text);
  }

  .material-document-row {
    background-color: transparent;
    transition: background-color 0.2s ease-in-out;
    cursor: pointer;
  }

  .material-document-row:hover {
    background-color: var(--theme-color-lighter);
  }

  .material-document-row:last-child {
    border-bottom: none;
  }

  .header-item, .row-item {
    align-self: center;
    padding: 0 10px; /* Add horizontal padding for text */
    box-sizing: border-box; /* Include padding in width calculation */
  }

  .material-document-id { flex-basis: 25%; text-align: center;}
  .plant { flex-basis: 20%; text-align: center;}
  .posting-date { flex-basis: 20%; text-align: center;}
  .document-date { flex-basis: 20%; text-align: center;}
  .arrow-icon { flex: 0 0 15%; text-align: right; padding-right: 20px;}


  .no-results, .initial-output-message {
    font-size: 1em;
    color: #666;
    font-weight: normal;
    text-align: center;
    margin-top: 20px;
  }

  .footer-cancel-button {
    background-color: var(--btn-default-bg);
    color: var(--btn-default-text);
    font-weight: bold;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-left: 10px;
  }

  .footer-cancel-button:hover {
    background-color: var(--btn-hover-bg);
    color: var(--btn-hover-text);
  }

  /* New styles for Process Flow */
  .process-flow-container {
    background-color: var(--theme-color-page); /* Adjust as needed */
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .process-flow-header {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--theme-color-dark);
    margin-bottom: 20px;
    align-self: flex-start; /* Aligns "Process Flow" to the left */
  }

  .process-flow-diagram {
    display: flex;
    align-items: top;
    justify-content: center;
    width: 80%;
    margin-bottom: 10px; /* Space between diagram and item count */
  }

  .flow-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: 20%; /* Ensure some minimum width for each step */
  }

  .step-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--theme-color-dark); /* Example background color */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    border: 2px solid var(--theme-color-dark);
  }

  .step-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--theme-color-dark); /* Example background color */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    border: 3px solid var(--theme-color-dark);
    /* 确保 SVG 背景颜色透明，否则可能会被 step-icon 的背景色覆盖 */
    background-color: white; /* 或者设置为你想要的背景色，如果 SVG 本身是透明的 */
  }

  .icon-image {
    max-width: 75%; /* 确保图片不会超出其容器 */
    max-height: 75%; /* 确保图片不会超出其容器 */
    width: auto; /* 保持图片原始宽高比 */
    height: auto; /* 保持图片原始宽高比 */
    display: block; /* 移除图片底部可能存在的额外空间 */
  }

  .step-label {
    font-weight: bold;
    color: var(--color-text-primary);
    margin-bottom: 4px;
  }

  .step-id {
    font-size: 0.9em;
    color: #555;
    word-break: break-all; /* Ensures long IDs wrap */
  }

  .step-status {
    margin-top: 5px;
  }

  .ok-status {
    color: green;
    font-weight: bold;
  }

 .flow-arrow {
  font-size: 2em;
  align-self: center;
  margin: 0 10px;
  font-weight: bold;
  color: #999999; /* Initial grey color for arrows */
  }

  .flow-arrow.arrow-status-green {
    color: green;
  }

  .flow-arrow.arrow-status-red {
    color: red;
  }

  .flow-arrow.arrow-status-grey {
    color: #999999;
  }

  .flow-item-details {
    width: 100%;
    text-align: center;
    margin-top: 10px;
    color: #666;
  }
.step-id {
  font-size: 0.9em;
  color: #555;
  word-break: break-all;
  min-height: 1.2em; /* Ensure it takes up at least one line height even if empty */
  display: block; /* Make it a block element to control its height */
  visibility: visible; /* Keep it visible even if content is empty to maintain layout */
}

/* New styles for the checkbox and text within step-status */
.step-status {
  display: flex;
  align-items: center;
  justify-content: center; /* Center the checkbox and OK text */
  color: #999999; /* Grey by default */
  font-weight: bold;
  min-height: 1.2em; /* Ensure consistent height for the status area */
}

.step-status.ok-status-active {
  color: green; /* Green when active */
}

.status-checkbox {
  width: 0%;
  height: 0%;
  /* This ensures the checkbox itself is colored green when checked */
  accent-color: green;
}

.status-checkbox:disabled {
  cursor: default;
}
</style>