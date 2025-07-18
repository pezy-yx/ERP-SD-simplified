<template>
  <div class="manage-sales-orders-view">
    <div class="so-page-content" v-if="!showAppContent">
      <div class="sales-order-search">
        <VarBox
          :tree="salesOrderQueryTree"
          class="sales-order-query-varbox"
        />
        <div class="go-button-container" @click="performSalesOrderSearch">
          <button class="search-enter-button go-button">Go</button>
        </div>
      </div>
      <div v-if="searchPerformed && salesOrdersResult && salesOrdersResult.length > 0" class="query-results-list" style="width: 100%;">
        <div class="sales-order-rows-container">
          <div class="sales-order-row-header">
              <div class="header-item sales-order-id">Sales Order</div>
              <div class="header-item sold-to-party">Sold-To Party</div>
              <div class="header-item customer-reference">Customer Reference</div>
              <div class="header-item req-delivery-date">Requested Delivery Date</div>
              <div class="header-item overall-status">Overall Status</div>
              <div class="header-item net-value">Net Value</div>
              <div class="header-item doc-date ">Document Date</div>
              <div class="header-item"></div> </div>
          <div v-for="order in salesOrdersResult" :key="order.so_id" class="sales-order-row" @click="viewSalesOrderDetail(order.so_id)">
            <span class="row-item sales-order-id">{{ order.so_id }}</span>
            <span class="row-item sold-to-party">{{ order.soldToPartyName }} ({{ order.customer_no }})</span>
            <span class="row-item customer-reference">{{ order.customer_reference }}</span>
            <span class="row-item req-delivery-date">{{ order.req_delivery_date }}</span>
            <span :class="['row-item overall-status', { 'status-open': order.status === 'Open', 'status-completed': order.status === 'Completed', 'status-in-progress': order.status === 'In Progress', 'status-new': order.status === 'New' }]">
              {{ order.status }}
            </span>
            <span class="row-item net-value">{{ order.net_value }} {{ order.currency }}</span>
            <span class="row-item doc-date">{{ order.doc_date }}</span>
            <span class="row-item arrow-icon">▶</span>
          </div>
        </div>
      </div>
      <div v-else-if="searchPerformed && salesOrdersResult && salesOrdersResult.length === 0" class="no-results">
        <p>No sales orders found matching your criteria.</p>
      </div>
      <div v-else class="initial-output-message">
        <p>Enter query criteria and click "Go" to see results.</p>
      </div>
    </div>
    <div class="bottom-actions" v-if="!showAppContent">
      <button class="search-enter-button create-sales-order-button" @click="createSalesOrder">Create Sales Order</button>
    </div>

    <!-- Quotation Input Modal -->
    <div v-if="showQuotationModal" class="modal-overlay">
      <div class="modal-content">
        <h4>Enter Quotation</h4>
        <VarBox :tree="quotationQueryTree" class="quotation-input-varbox" />
        <div class="modal-actions">
          <button @click="cancelQuotationInput" class="cancel-button">Cancel</button>
          <button @click="confirmQuotationInput" class="save-button">Confirm</button>
        </div>
        <p v-if="quotationModalMessage" class="modal-message">{{ quotationModalMessage }}</p>
      </div>
    </div>

    <AppContent
      v-if="showAppContent"
      :stages="['salesOrderForm', 'itemDetails']"
      :before-next="handleExecute"
      :before-prev="handleCancel"
      :footer-config="[
        { prevText: salesOrderFormPrevButtonLabel, nextText: salesOrderFormNextButtonLabel },
        { prevText: itemDetailsPrevButtonLabel, nextText: itemDetailsNextButtonLabel }
      ]"
      ref="appContentRef"
    >
      <template #stage-salesOrderForm>
        <div class="page-content">
          <VarBox
           :tree="salesOrderDataTree"
           :class="{
             'sales-order-detail-varbox': onDisplayState || onChangeState,
             'sales-order-creation-varbox': onCreateState
           }"
           :key="salesOrderVarBoxKey"
           @enter-from-node="handleEnterFromNodeSalesOrderTree"
           >
            <!-- Add the "..." button for ItemOverview table -->
            <template #SOData-itemOverview-items--extra-buttons>
              <button
                class = "execute-button table-extra-button"
                @click="handleItemsTableClick"
                :disabled="!salesOrderDataTree.findNodeByPath(['itemOverview','items'])?.getSelectedChildren().length"
              >
                ...
              </button>
            </template>
           </VarBox>
        </div>
      </template>

      <template #stage-itemDetails>
        <!-- Item switching navigation -->
        <div class="item-navigation" v-if="selectedItems.length > 1">
          <button
            class="item-nav-button item-prev-button"
            @click="switchToPreviousItem"
            :disabled="currentItemIndex === 0"
          >
            ← Previous
          </button>
          <span class="item-counter">
            Item {{ currentItemIndex + 1 }} of {{ selectedItems.length }}
          </span>
          <button
            class="item-nav-button item-next-button"
            @click="switchToNextItem"
            :disabled="currentItemIndex === selectedItems.length - 1"
          >
            Next →
          </button>
        </div>

        <VarBox
          :tree="itemDetailHeaderTree"
        ></VarBox>
        <!-- Optional tabs for Sales and Conditions -->
        <!-- tab bar -->
        <FilterTabs
          :tabs="[{label:'Sales',value:0},{label:'Conditions',value:1}]"
          @tab-selected="handleItemConditionTabClick" class="reverse middle hide-bottom-line"
          :initialActiveTab="0"
        />
        <!-- Sales -->
        <VarBox
          v-if="itemConditionTabBarStage==0"
          :tree="itemDetailSalesTree"
          @enter-from-node="handleEnterFromNodeItemCondition"
          @input-from-node="handleInputFromNodeItemCondition"
        ></VarBox>
        <!-- Conditions -->
        <VarBox
          v-else
          :tree="itemDetailConditionTree"
          @enter-from-node="handleEnterFromNodeItemCondition"
          @input-from-node="handleInputFromNodeItemCondition"
        >
          <template #itemDetailConditions-pricingElements--extra-buttons>
            <button
              class = "execute-button table-extra-button"
              @click="handlePricingElementsRemoveButtonClick"
              :disabled="itemDetailConditionTree.findNodeByPath(['pricingElements'])?.getSelectedChildren().length == 0"
            >
              Delete
            </button>
          </template>
        </VarBox>
      </template>

      <template #footer-content-right>
        <button
         v-if="currentAppStage === 0 && (onCreateState || onDisplayState)"
         @click="handleCancel(0, -1)"
         class="footer-cancel-button">
         Cancel
        </button>
        <button
          v-if="currentAppStage === 0 && onChangeState"
          @click="handleChangeToDisplayAndSave"
          class="footer-cancel-button">
          Save and Display
        </button>
        <template v-if="currentAppStage === 1">
          <button class="cancel-button" @click="cancelItemCondition">{{itemDetailStageCancelButtonLabel}}</button>
          <button class="save-button" @click="saveItemConditionData" v-if="itemDetailStageExecuteButtonVisible">Save</button>
        </template>
      </template>

    </AppContent>
  </div>
</template>

<script setup lang="ts">
import VarBox from '@/components/varbox/VarBox.vue';
import FilterTabs from '@/components/FilterTabs.vue'; // Import FilterTabs
import { ref, Ref, computed, nextTick } from 'vue';
import { createTreeFromConfig, cns, VarTree, VarNodeValue, VarNode, createNodeFromConfig } from '@/utils/VarTree';
import { bpSearch, quotationIdSearch, salesOrderIdSearch } from '@/utils/searchMethods';
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '';

import AppContent from '@/components/applicationContent/AppContent.vue';

const appContentRef = ref(null) as any;
const currentAppStage = computed(() => appContentRef.value?.currentStage || 0);
const showAppContent = ref(false);

// Quotation Modal related states
const showQuotationModal = ref(false);
const quotationModalMessage = ref('');

// Define the structure for the quotation input
const quotationQueryStructure = cns(
  "dict", "dict", "quotationQuery", null, false, { hideLabel: true },
  [
    cns("string", "leaf", "quotation_id", '', false, {searchMethods: quotationIdSearch}, [], "Quotation Number:"),
  ]
);
const quotationQueryTree = createTreeFromConfig(quotationQueryStructure);


type State = 'create' | 'change' | 'display';

const state: Ref<State> = ref('display');
const salesOrderVarBoxKey = ref(0);
const onCreateState = computed(() => state.value === 'create');
const onChangeState = computed(() => state.value === 'change');
const onDisplayState = computed(() => state.value === 'display');

function appToState(newState: State) {
  state.value = newState;
  let readonly = newState === 'display';
  writableTrees.forEach(tree => {
    if (tree.root) {
      tree.root.readonly = readonly;
    }
  });
}

const writableTrees: VarTree[] = [];

interface SalesOrderResult {
  so_id: string;
  soldToPartyName: string;
  customer_no: string;
  customer_reference: string;
  req_delivery_date: string;
  status: 'New' | 'Open' | 'In Progress' | 'Completed';
  net_value: string;
  currency: string;
  doc_date: string;
}

const salesOrderQueryStructure = cns(
  "dict", "dict", "salesOrderQuery", null, false, { hideLabel: true },
  [
    cns("string", "leaf", "so_id", '', false, { searchMethods: salesOrderIdSearch }, [], "Sales Order:"),
    cns("selection", "leaf", "status", '', false, {options:['New','Open','In progress','Completed']}, [], "Overall Status:"),
    cns("string", "leaf", "customer_no", '', false, { searchMethods: bpSearch }, [], "Sold-To Party:"),
    cns("string", "leaf", "customer_reference", '', false, {}, [], "Customer Reference:"),
  ]
);

const salesOrderDataTree = createTreeFromConfig(
   cns('dict','dict','SOData',{},false,{hideLabel:true},[
     cns('dict','dict','meta',{},false,{hideSelf:true},[
       cns('string','leaf','id','',false,{},[]),
     ]),
     cns('dict','dict','basicInfo',{},false,{hideLabel:true},[
       cns('string','leaf','quotation_id','',false,{searchMethods: quotationIdSearch},[],"Quotation:"),
       cns('string','leaf','so_id','',true,{},[],"Sales Order:"),
       cns('string','leaf','soldToParty','',false,{},[],"Sold-To Party:"),
       cns('string','leaf','shipToParty','',false,{},[],"Ship-To Party:"),
       cns('string','leaf','customerReference','',false,{},[],"Cust. Reference:"),
       cns('string','leaf','netValue','0.0',true,{},[],"Net Value:"),
       cns('string','leaf','netValueUnit','',true,{hideLabel:true},[],"Net Value Unit:"),
       cns('date','leaf','customerReferenceDate','',false,{},[],"Cust. Ref. Date:"),
     ]),
     cns('dict','dict','itemOverview',{},false,{},[
       cns('date','leaf','reqDelivDate','',false,{},[],"Req. Deliv Date:"),
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
     ],'Item Overview')
   ])
 );

  const salesOrderQueryTree = createTreeFromConfig(salesOrderQueryStructure);
  const salesOrdersResult: Ref<SalesOrderResult[]> = ref([]);
  const searchPerformed = ref(false);


  const performSalesOrderSearch = async () => {
    console.log('Executing sales order query...');
    const fullUrl = `${API_BASE_URL}/api/so/search`;
    console.log('Attempting to fetch from URL:', fullUrl);
    const queryData = salesOrderQueryTree.root?.getValue();
    console.log('Submitting query data:', JSON.stringify(queryData, null, 2));

    searchPerformed.value = true;
    salesOrdersResult.value = [];

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryData),
      });
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        salesOrdersResult.value = result.data;
      } else {
        console.error('API call failed or returned unexpected data:', result);
        salesOrdersResult.value = [];
      }
    } catch (error: any) {
      console.error('Error during sales order search:', error);
      salesOrdersResult.value = [];
    }
  };

  const salesOrderFormPrevButtonLabel = computed(() => {
    return 'Cancel';
  });

  const salesOrderFormNextButtonLabel = computed(() => {
    if (onCreateState.value) {
      return 'Create';
    }
    if (onChangeState.value) {
      return 'Save';
    }
    if (onDisplayState.value) {
      return 'Change';
    }
    return '/hide';
  });

  const itemDetailsPrevButtonLabel = computed(() => {
    return 'Back to Form';
  });

  const itemDetailsNextButtonLabel = computed(() => {
    if (onCreateState.value || onChangeState.value) {
      return 'Confirm Items';
    }
    return '/hide';
  });

  async function handleCancel(currentStage: number, targetStage: number) {
    console.log('AppContent handleCancel: currentStage', currentStage, 'targetStage', targetStage);

    // If currently in the first stage (sales order form)
    if (currentStage === 0) {
      // If in create or change mode, prompt for confirmation
      if (onCreateState.value || onChangeState.value) {
        // Using a custom modal/message box instead of confirm()
        if (!await showConfirmationModal('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
          return false; // User chose not to cancel, prevent navigation
        }
      }
      // For all modes (create, change, display) in stage 0, hide AppContent to return to query list
      showAppContent.value = false;
      appContentRef.value.goToStage(0); // Reset AppContent internal stage so it starts from 0 next time
      appContentRef.value.footerMessage = ''; // Clear footer message
      return false; // Prevent AppContent from trying internal navigation as we've handled external display logic
    }

    // If currently in the item details stage (stage 1)
    if (currentStage === 1) {
      // For create or change mode, prompt for confirmation before going back to the form
      if (onCreateState.value || onChangeState.value) {
        // Using a custom modal/message box instead of confirm()
        if (!await showConfirmationModal('Are you sure you want to go back? Unsaved item changes will be lost.')) {
          return false; // User chose not to go back, prevent navigation
        }
      }
      // If confirmed or in display mode, go back to the sales order form (stage 0)
      appContentRef.value.footerMessage = '';
      selectedItems.value = []; // Clear selected items
      currentItemIndex.value = 0; // Reset current item index
      return true; // Allow AppContent to navigate back to stage 0
    }
    appContentRef.value.footerMessage = '';
    return true;
  }

  async function handleExecute(currentStage: number, targetStage: number) {
    console.log('AppContent handleExecute: currentStage', currentStage, 'targetStage', targetStage);
    appContentRef.value.footerMessage = '';

    if (currentStage === 0) {
      if (onDisplayState.value) {
        console.log('Switching to change state...');
        appToState('change');
        salesOrderVarBoxKey.value++;
        appContentRef.value.footerMessage = 'Switched to Change mode.';
        return false;
      } else if (onCreateState.value || onChangeState.value) {
        console.log('Saving/Creating sales order...');
        const dataToSave = salesOrderDataTree.root?.getValue();

        let endpoint = onCreateState.value ? `${API_BASE_URL}/api/so/create` : `${API_BASE_URL}/api/so/edit`;
        let method = 'POST';

        if (onChangeState.value && !(dataToSave as { basicInfo?: { so_id?: string } })?.basicInfo?.so_id) {
         appContentRef.value.footerMessage = 'Sales Order ID is required for change operations.';
         return false;
       }

        try {
          const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave)
          });

          const result = await response.json();
          if (result.success) {
            appContentRef.value.footerMessage = result.message || (onCreateState.value ? 'Sales Order created successfully!' : 'Sales Order saved successfully!');
            // After successful creation/save, stay on stage 0 (sales order form)
            if (onCreateState.value && result.data?.so_id) {
              salesOrderDataTree.findNodeByPath(['basicInfo', 'so_id'])?.setValue(result.data.so_id);
              salesOrderDataTree.findNodeByPath(['meta', 'id'])?.setValue(result.data.so_id);
            }
            appToState('display'); // Switch to display mode after save/create
            // No automatic navigation to item details here. User will click "..."
            // showAppContent.value = false; // Stay on the form, don't go back to search list
            // performSalesOrderSearch(); // No need to refresh search list from here
            return false; // Prevent AppContent from navigating to next stage
          } else {
            appContentRef.value.footerMessage = result.message || 'Operation failed.';
            return false;
          }
        } catch (error: any) {
          console.error('Operation failed:', error);
          appContentRef.value.footerMessage = `Operation failed: ${error.message || 'Network error'}`;
          return false;
        }
      }
    }

    if (currentStage === 1) {
      console.log('Handling item details confirmation...');
      // Validate all items before confirming
      const allItemsValid = await itemsTabQueryAll();
      if (allItemsValid) {
        appContentRef.value.footerMessage = 'All item details confirmed and saved.';
        // After confirming items, switch to display mode and go back to sales order form (stage 0)
        appToState('display');
        appContentRef.value.goToStage(0); // Go back to sales order form
        // showAppContent.value = false; // Don't go back to search list
        // performSalesOrderSearch(); // No need to refresh search list from here
        return false; // Prevent AppContent from navigating, we've handled it
      } else {
        appContentRef.value.footerMessage = 'Some item details are invalid. Please correct them.';
        return false; // Prevent navigation if items are invalid
      }
    }

    return false;
  }

  const viewSalesOrderDetail = async (soId: string) => {
    console.log(`Navigating to sales order detail page for SO ID: ${soId}`);
    showAppContent.value = true;
    appToState('display');

   nextTick(async () => {
     if (appContentRef.value) {
       appContentRef.value.goToStage(0);

       appContentRef.value.footerMessage = 'Fetching sales order details...';
       try {
         const response = await fetch(`${API_BASE_URL}/api/so/get/${soId}`);
         const result = await response.json();
         if (result.success && result.data) {
           salesOrderDataTree.root?.forceSetValue(result.data);
           salesOrderVarBoxKey.value++;
           appContentRef.value.footerMessage = 'Sales order details loaded.';

           // No automatic navigation to item details here, user will click "..."
           // The items are loaded into salesOrderDataTree, ready for selection and detail view.

         } else {
           appContentRef.value.footerMessage = result.message || 'Failed to load sales order details.';
           showAppContent.value = false;
         }
       } catch (error: any) {
         appContentRef.value.footerMessage = `Error fetching details: ${error.message}`;
         showAppContent.value = false;
       }
     }
   });
 };

  const createSalesOrder = () => {
    console.log('Creating sales order - showing quotation input modal');
    showQuotationModal.value = true;
    quotationModalMessage.value = ''; // Clear previous messages
    quotationQueryTree.root?.forceSetValue({ quotation_id: '' }); // Reset input
  };

  const cancelQuotationInput = () => {
    showQuotationModal.value = false;
    quotationModalMessage.value = '';
  };

  const confirmQuotationInput = async () => {
    const quotationId = quotationQueryTree.root?.findNodeByPath(['quotation_id'])?.getValue();
    if (!quotationId) {
      quotationModalMessage.value = 'Please enter a Quotation Number.';
      return;
    }

    quotationModalMessage.value = 'Searching for quotation...';
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotation/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotation_id: quotationId }),
      });
      const result = await response.json();

      if (result.success && result.data?.quotationData) {
        const quotationData = result.data.quotationData;
        console.log('Quotation data fetched:', quotationData);

        showQuotationModal.value = false;
        showAppContent.value = true;
        appToState('create');
        salesOrderDataTree.root?.forceSetValue({}); // Clear existing data

        // Populate basicInfo
        const basicInfoNode = salesOrderDataTree.findNodeByPath(['basicInfo']);
        if (basicInfoNode && quotationData.basicInfo) {
          basicInfoNode.findNodeByPath(['quotation_id'])?.setValue(quotationData.basicInfo.quotation);
          basicInfoNode.findNodeByPath(['soldToParty'])?.setValue(quotationData.basicInfo.soldToParty);
          basicInfoNode.findNodeByPath(['shipToParty'])?.setValue(quotationData.basicInfo.shipToParty);
          basicInfoNode.findNodeByPath(['customerReference'])?.setValue(quotationData.basicInfo.customerReference);
          basicInfoNode.findNodeByPath(['netValue'])?.setValue(quotationData.basicInfo.netValue);
          basicInfoNode.findNodeByPath(['netValueUnit'])?.setValue(quotationData.basicInfo.netValueUnit);
          basicInfoNode.findNodeByPath(['customerReferenceDate'])?.setValue(quotationData.basicInfo.customerReferenceDate);
        }

        // Populate itemOverview and items
        const itemOverviewNode = salesOrderDataTree.findNodeByPath(['itemOverview']);
        if (itemOverviewNode && quotationData.itemOverview) {
          itemOverviewNode.findNodeByPath(['reqDelivDate'])?.setValue(quotationData.itemOverview.reqDelivDate);

          const itemsListNode = itemOverviewNode.findNodeByPath(['items']);
          if (itemsListNode && quotationData.itemOverview.items) {
            // Clear existing items and add new ones from quotation
            itemsListNode.children = [];
            quotationData.itemOverview.items.forEach((itemData: any, index: number) => {
              const newItemNode = createNodeFromConfig(itemsListNode.config.childTemplate!);
              newItemNode.forceSetValue({ ...itemData, item: (index + 1).toString() }); // Assign item number
              itemsListNode.addChild(newItemNode);
            });
          }
        }

        salesOrderVarBoxKey.value++; // Force VarBox re-render
        nextTick(() => {
          if (appContentRef.value) {
            appContentRef.value.goToStage(0);
            appContentRef.value.footerMessage = 'Quotation data loaded. Ready to create new Sales Order.';
          }
        });

      } else {
        quotationModalMessage.value = result.message || 'Quotation not found or API error.';
        console.error('Failed to fetch quotation details:', result);
      }
    } catch (error: any) {
      quotationModalMessage.value = `Error fetching quotation: ${error.message}`;
      console.error('Error during quotation fetch:', error);
    }
  };


  const handleChangeToDisplayAndSave = async () => {
    appToState('display');
    salesOrderVarBoxKey.value++; // Force VarBox re-render to apply readonly state change
    // The actual save logic is now handled by handleExecute when currentStage is 0 and onChangeState is true
    // This button just triggers the state change and re-render.
  };

  writableTrees.push(salesOrderDataTree);

  /**
   * Item Detail View Logic (Copied and adapted from Main.vue)
   */

  /**
   * @description Sales Order Item Detail Header
   */
  const itemDetailHeaderTree = createTreeFromConfig(
    cns('dict','dict','itemDetailHeader',{},true,{
      childNameDisplayTranslation: {
        item: 'Sales Document Item',
        material: 'Material'
      }
    },[
      cns('string','leaf','item','',false,{},[]),
      cns('string','leaf','material','',false,{},[]),
    ])
  );

  /**
   * @description Sales Order Item Detail Sales
   */
  const itemDetailSalesTree = createTreeFromConfig(
    cns('dict','dict','itemDetailSales',{},false,{hideLabel:true},[
      cns('dict','dict','orderQuantityAndDeliveryDate',{},false,{
        childNameDisplayTranslation: {
          orderQuantity: 'Quantity',
          reqDelivDate: 'First Delivery Date'
        }
      },[
        cns('string','leaf','orderQuantity','',false,{},[]),
        cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[]),
        cns('date','leaf','reqDelivDate','',false,{},[]),
      ],'Order Quantity and Delivery Date'),
      cns('dict','dict','generalSalesData',{},false,{
        childNameDisplayTranslation: {
          pricingDate: 'Pricing Date: ',
          orderProbability: 'Order Probability: '
        }
      },[
        cns('string','leaf','netValue','',true,{},[]),
        cns('string','leaf','netValueUnit','',true,{hideLabel:true},[]),
        cns('string','leaf','pricingDate','',false,{},[]),
        cns('string','leaf','orderProbability','1',false,{},[]),
      ])
    ])
  );

  /**
   * @description Sales Order Item Detail Conditions
   */
  const itemDetailConditionTree = createTreeFromConfig(
    cns('dict','dict','itemDetailConditions',{},false,{
      childNameDisplayTranslation: {
        orderQuantity: 'Quantity',
      }
    },[
      cns('string','leaf','orderQuantity','',false,{},[]),
      cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[]),
      cns('string','leaf','netValue','',true,{},[]),
      cns('string','leaf','netValueUnit','',true,{hideLabel:true},[]),
      cns('string','leaf','taxValue','',true,{},[]),
      cns('string','leaf','taxValueUnit','',true,{hideLabel:true},[]),
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
      },[],"Pricing Elements")
    ])
  );

  writableTrees.push(itemDetailSalesTree, itemDetailConditionTree); // Add item detail trees to writable trees

  const selectedItems = ref<VarNode[]>([]);
  const currentItemIndex = ref(0);
  const editingNode = {
    node: createNodeFromConfig(salesOrderDataTree.findNodeByPath(['itemOverview','items'])!.config.childTemplate!)
  };

  const itemConditionTabBarStage = ref(0);
  function handleItemConditionTabClick(index: number) {
    itemConditionTabBarStage.value = index;
  }

  const itemDetailStageCancelButtonLabel = computed(() => {
    if (onCreateState.value) {
      return 'Cancel';
    }
    if (onChangeState.value) {
      return 'Cancel';
    }
    if (onDisplayState.value) {
      return 'Back';
    }
    return 'Back';
  });

  const itemDetailStageExecuteButtonVisible = computed(() => {
    return onCreateState.value || onChangeState.value;
  });

  /**
   * Update the tree data for the detail page
   * @description Set editingNode.node to a copy of the current editing node, and point the input fields in itemCondition to this copy's nodes.
   */
  function updateItemDetailTrees() {
    if (selectedItems.value.length === 0) return;

    const currentItem = selectedItems.value[currentItemIndex.value];
    editingNode.node = currentItem.clone();
    const node = editingNode.node;

    // Use value copy instead of reference for setting
    const setValueFromItem = (sourcePath: string[], targetPath: string[], targetTree: VarTree) => {
      const sourceNode = node.findNodeByPath(sourcePath);
      if (sourceNode) {
        const targetNode = targetTree.findNodeByPath(targetPath);
        if (targetNode) {
          targetTree.replaceNodeByPath(sourceNode, targetPath);
        }
      }
    };

    // Header data
    setValueFromItem(['item'], ['item'], itemDetailHeaderTree);
    setValueFromItem(['material'], ['material'], itemDetailHeaderTree);

    // Sales data
    setValueFromItem(['orderQuantity'], ['orderQuantityAndDeliveryDate', 'orderQuantity'], itemDetailSalesTree);
    setValueFromItem(['orderQuantityUnit'], ['orderQuantityAndDeliveryDate', 'orderQuantityUnit'], itemDetailSalesTree);
    setValueFromItem(['reqDelivDate'], ['orderQuantityAndDeliveryDate', 'reqDelivDate'], itemDetailSalesTree);
    setValueFromItem(['netValue'], ['generalSalesData', 'netValue'], itemDetailSalesTree);
    setValueFromItem(['netValueUnit'], ['generalSalesData', 'netValueUnit'], itemDetailSalesTree);
    setValueFromItem(['pricingDate'], ['generalSalesData', 'pricingDate'], itemDetailSalesTree);
    setValueFromItem(['orderProbability'], ['generalSalesData', 'orderProbability'], itemDetailSalesTree);

    // Condition data - also use value copy
    setValueFromItem(['orderQuantity'], ['orderQuantity'], itemDetailConditionTree);
    setValueFromItem(['orderQuantityUnit'], ['orderQuantityUnit'], itemDetailConditionTree);
    setValueFromItem(['netValue'], ['netValue'], itemDetailConditionTree);
    setValueFromItem(['netValueUnit'], ['netValueUnit'], itemDetailConditionTree);
    setValueFromItem(['taxValue'], ['taxValue'], itemDetailConditionTree);
    setValueFromItem(['taxValueUnit'], ['taxValueUnit'], itemDetailConditionTree);
    setValueFromItem(['pricingElements'], ['pricingElements'], itemDetailConditionTree);

    // Force update UI display
    if (appContentRef.value) {
      appContentRef.value.forceUpdate();
    }
  }

  /**
   * @description Pricing Element Rules
   * @description Deletion: After deletion, pass to backend for validation and return normalized data / if value is corrupted, set validation to false
   */
  async function handlePricingElementsDeletion() {
    const pricingElementsNode = itemDetailConditionTree.findNodeByPath(['pricingElements'])!;
    const deletionNodes = pricingElementsNode.getSelectedChildren();
    pricingElementsNode.children = pricingElementsNode.children.filter(child => !deletionNodes.includes(child));
    await validateCurrentItemConditionData();
    appContentRef.value.forceUpdate();
  }
  /**
   * @description Call handlePricingElementsDeletion to delete selected records and validate
   */
  async function handlePricingElementsRemoveButtonClick() {
    await handlePricingElementsDeletion();
  }

  /**
   * @description Pricing Element Rules
   * @description Addition: Directly pass to backend for validation and return normalized data / if value is corrupted, set validation to false
   * @description No need to write, just follow the validation logic of handleEnterFromNodeItemCondition
   */

  /**
   * Validate current itemCondition data and sync to original item
   * @description Send data from editingNode.node to backend for validation, and if successful, update the original item's data
   * @description All use itemsTabQuery
   */
  async function validateCurrentItemConditionData() {
    // If not changed (config.data.validation is true), return directly
    if (editingNode.node.config.data?.validation) {
      console.log('Data not changed, no need to validate', editingNode.node);
      return true;
    }
    const nodeList = [editingNode.node];
    const isValidate = await itemsTabQuery(nodeList);
    if (isValidate) {
      console.log('Data validated successfully');
      // Sync data
      const currentNode = selectedItems.value[currentItemIndex.value];
      currentNode.forceSetValue(editingNode.node.getValue());
    } else {
      console.log('Data validation failed');
    }
    return isValidate;
  }

  /**
   * Handle user input events, immediately mark the maintained node as unvalidated
   */
  function handleInputFromNodeItemCondition(_node: VarNode, value: string, data: any) {
    if (!editingNode.node.config.data) {
      editingNode.node.config.data = {};
    }
    editingNode.node.config.data.validation = false;
  }

  /**
   * Switch to the previous/next selected item
   * @description Safe method, will validate current data first
   */
  async function switchToItem(index: number) {
    const isValid = await validateCurrentItemConditionData();
    if (isValid) {
      _switchToItemWhenValidate(index);
    } else {
      console.log('Data validation failed, cannot switch');
    }
  }
  function _switchToItemWhenValidate(index: number) {
    if (index >= 0 && index < selectedItems.value.length) {
      currentItemIndex.value = index;
      updateItemDetailTrees();
    }
  }

  /**
   * Switch to previous item
   * @description Wrapper for switchToItem method
   */
  async function switchToPreviousItem() {
    switchToItem(currentItemIndex.value - 1);
  }

  /**
   * Switch to next item
   * @description Wrapper for switchToItem method
   */
  async function switchToNextItem() {
    switchToItem(currentItemIndex.value + 1);
  }

  /**
   * Save itemCondition data and return to stage 0 (sales order form)
   */
  async function saveItemConditionData(): Promise<boolean> {
    const isValid = await validateCurrentItemConditionData();
    if (isValid) {
      // Validation successful, go back to stage 0 (sales order form)
      appContentRef.value.goToStage(0);
      console.log('Data validated and returned to stage 0');
      return true;
    } else {
      console.log('Data validation failed, cannot save');
      return false;
    }
  }

  /**
   * Cancel itemCondition editing, return to stage 0 (sales order form)
   */
  function cancelItemCondition() {
    // Reset validation status of currently selected items to avoid issues next time
    if (selectedItems.value.length > 0) {
      selectedItems.value.forEach(item => {
        if (item.config.data?.validation === false) {
          // Reset validation status to undefined, indicating re-validation is needed
          item.config.data.validation = undefined;
        }
      });
    }
    selectedItems.value = [];
    currentItemIndex.value = 0;
    // Do not save data, directly return to stage 0
    appContentRef.value.goToStage(0);
  }

  /**
   * Handle data change events on the itemCondition page (Enter or blur)
   */
  async function handleEnterFromNodeItemCondition(_node: VarNode, value: string, data: any) {
    // Key operation: validate data on Enter
    await validateCurrentItemConditionData();
  }

  /**
   * @description Sales order variable tree enter-from-node event handler
   * @param node Node object
   * @param value Value
   * @param data Other data
   */
  async function handleEnterFromNodeSalesOrderTree(node: VarNode, value: string, data: any) {
    // This function is for the main sales order form.
    // If an item field is changed, we might want to trigger a re-calculation of total values.
    // For now, we'll leave it simple, as item detail validation is handled separately.
    if (data.nodePath.length > 2 && data.nodePath[0] === 'itemOverview' && data.nodePath[1] === 'items') {
      // Trigger price query for all items in the main form if an item field is changed
      await itemsTabQueryAll();
    }
  }

  /**
   * @description Encapsulate itemsTabQuery - query all
   */
  async function itemsTabQueryAll() {
    const items = salesOrderDataTree.findNodeByPath(['itemOverview','items'])?.children || [];
    return await itemsTabQuery(items);
  }

  /**
   * @description Sales order batch query, send VarNode[] to backend, return Net Value: and Expect. Oral Val: including value and unit, and detailed information for each item
   * @description This method will update the data in the input VarNode[]
   * @param {Array<VarNode>} itemNodes
   * Also set config.data.validation for each VarNode based on returned badRecordIndices
   */
  async function itemsTabQuery(itemNodes: VarNode[]) {
    // Extract values from each VarNode
    const itemValues = itemNodes.map(node => node.getValue());

    const data = await fetch(`${API_BASE_URL}/api/app/inquiry/items-tab-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemValues)
    }).then(response => {
      console.log('Normal return', response);
      return response.json();
    }).catch(error => {
      console.error('Batch query failed:', error);
      return { success: false };
    });

    console.log('Returned data', data);

    if (data.success) {
      // Update overall data (if applicable, e.g., total net value for the sales order)
      // For sales orders, the total net value is typically calculated from items.
      // We might want to update salesOrderDataTree.basicInfo.netValue here if needed.

      // Update detailed information for each item, use forceSetValue to ensure full update
      if (data.data.breakdowns && Array.isArray(data.data.breakdowns)) {
        data.data.breakdowns.forEach((breakdown: any, index: number) => {
          if (index < itemNodes.length) {
            console.log('Breakdown data for item', index, ':', breakdown);
            if (breakdown.pricingElements) {
              console.log('PricingElements structure:', breakdown.pricingElements);
            }
            // Use forceSetValue to ensure all fields including pricingElements are correctly updated
            itemNodes[index].forceSetValue(breakdown);
          }
        });
      }

      // Set validation based on badRecordIndices
      if (data.data.result && Array.isArray(data.data.result.badRecordIndices)) {
        // First, reset validation for all nodes
        itemNodes.forEach(node => {
          if (!node.config.data) {
            node.config.data = {};
          }
          node.config.data.validation = true;
        });

        // Set validation for invalid nodes
        data.data.result.badRecordIndices.forEach((badIndex: number) => {
          if (badIndex < itemNodes.length) {
            if (!itemNodes[badIndex].config.data) {
              itemNodes[badIndex].config.data = {};
            }
            itemNodes[badIndex].config.data.validation = false;
          }
        });
      }

      appContentRef.value.forceUpdate();
      return data.data.result.allDataLegal === 1;
    }

    return false;
  }

  /**
   * @description Handle the click event for the Items Table button
   * @param selection Selected rows (not used directly, we get items from salesOrderDataTree)
   */
  async function handleItemsTableClick() {
    const items = salesOrderDataTree.findNodeByPath(['itemOverview','items'])!;
    const selectedChildren = [...items.getSelectedChildren()];

    if (selectedChildren && selectedChildren.length > 0) {
      // First, check if all selected items have a validation status
      const itemsWithoutValidation = selectedChildren.filter(item =>
        item.config.data?.validation === undefined
      );

      // If there are unvalidated items, validate them first
      if (itemsWithoutValidation.length > 0) {
        console.log('Found unvalidated items, validating...');
        const result = await itemsTabQuery(itemsWithoutValidation as VarNode[]);
        if (!result) {
          console.log('Validation failed, cannot proceed');
          return; // Validation failed, do not proceed
        }
      }

      // Re-check if all selected items passed validation
      const hasInvalidItems = selectedChildren.some(item =>
        item.config.data?.validation === false
      );

      if (hasInvalidItems) {
        console.log('There are invalid items, cannot proceed');
        return; // There are invalid items, do not proceed
      }

      // All validations passed, proceed
      selectedItems.value = selectedChildren;
      currentItemIndex.value = 0;

      // Update data for the detail page
      updateItemDetailTrees();

      // Switch to the detail page
      appContentRef.value.goToStage(1); // Stage 1 is itemDetails

      // After successfully entering the detail page, clear the selection status of the items table
      items.children.forEach(child => {
        child.setSelection(false);
      });
    } else {
      console.log('No items selected');
    }
  }

  // Custom Confirmation Modal Logic (replaces window.confirm)
  const showConfirm = ref(false);
  const confirmMessage = ref('');
  let confirmResolve: ((value: boolean | PromiseLike<boolean>) => void) | null = null;

  function showConfirmationModal(message: string): Promise<boolean> {
    confirmMessage.value = message;
    showConfirm.value = true;
    return new Promise((resolve) => {
      confirmResolve = resolve;
    });
  }

  function handleConfirm(response: boolean) {
    showConfirm.value = false;
    if (confirmResolve) {
      confirmResolve(response);
      confirmResolve = null;
    }
  }

</script>

<style scoped>
  /* Inherited general layout and colors from _base.css and MaintainBusinessPartnerView.vue */
  .manage-sales-orders-view {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--theme-color-dark);
    width: 100%;
  }

  .so-page-content {
    flex-grow: 1;
    background-color: var(--theme-color-page);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Sales order query area style, adjusted based on business-partner-search */
  .sales-order-search {
    display: flex;
    flex-direction: column;
    background-color: transparent;
    box-sizing: border-box;
    align-items: center;
    padding: 30px;
  }

  /* Reuse input-with-icon style from MaintainBusinessPartnerView */
  .input-with-icon {
    display: flex;
    width: 100%;
    align-items: center;
    border: 1px solid #dcdfe6;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .input-with-icon:focus-within {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }

  /* Reuse bp-input style, applied to the actual input inside VarBox */
  /* Relying on _base.css for font-family, font-size, line-height, color, border, background, outline */
  .sales-order-query-varbox :deep(.var-input--main input) {
    flex-grow: 1;
    padding: 12px 15px;
    box-sizing: border-box;
  }

  /* Reuse bp-search-button style, applied to the search button inside VarBox */
  .sales-order-query-varbox :deep(.bp-search-button) {
    background-color: transparent;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
  }

  .sales-order-query-varbox :deep(.bp-search-button:hover) {
    background-color: #f5f7fa;
  }

  .sales-order-query-varbox :deep(.search-icon) {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  /* Go button container */
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

  /* Output area style */
  .sales-order-output {
    min-height: 200px;
    display: flex;
    flex-direction: column;
    color: var(--theme-color-dark);
    font-size: 1.6em;
    font-weight: bold;
    overflow-y: auto;
  }

  .sales-order-output .query-results-list {
    width: 100%;
    font-size: 1em;
    color: var(--color-text-primary);
  }

  .sales-order-rows-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sales-order-row-header,
  .sales-order-row {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--theme-color-lighter);
  }

  .sales-order-row-header {
    background-color: var(--theme-color-table-header-bg);
    font-weight: bold;
    color: var(--theme-color-table-header-text);
  }

  .sales-order-row {
    background-color: transparent;
    transition: background-color 0.2s ease-in-out;
    cursor: pointer;
  }

  .sales-order-row:hover {
    background-color: var(--theme-color-lighter);
  }

  .sales-order-row:last-child {
    border-bottom: none;
  }

  .header-item, .row-item {
    align-self: center;
  }

  .sales-order-id { flex-basis: 10%; text-align: center;}
  .sold-to-party { flex-basis: 10%; text-align: center;}
  .customer-reference { flex-basis: 15%; text-align: center;}
  .req-delivery-date { flex-basis: 15%; text-align: center;}
  .overall-status { flex-basis: 10%; text-align: center;}
  .net-value { flex-basis: 15%; text-align: center;}
  .doc-date { flex-basis: 15%; text-align: center;}
  .arrow-icon { flex: 0 0 20px; text-align: right; }


  /* Status specific styling */
  .overall-status {
    padding: 4px 8px;
    font-weight: bold;
    font-size: 1em;
    color: #ffffff;
    display: inline-block;
    text-align: center;
  }
  :deep(.salesOrderQuery-so_id--wrapper) {
      grid-row: 1;
      max-width: 300px;
  }
  :deep(.salesOrderQuery-status--wrapper) {
      grid-row: 1;
      max-width: 300px;
  }
  :deep(.salesOrderQuery-customer_no--wrapper) {
      grid-row: 1;
      max-width: 300px;
  }
  :deep(.salesOrderQuery-customer_reference--wrapper) {
      grid-row: 1;
      max-width: 300px;
  }

  :deep(.SOData-basicInfo--dict-leaf-section) {
    display: grid;
    grid-template-columns: 50% 35% 15%;
    grid-template-rows: auto auto auto auto;
  }

  :deep(.SOData-basicInfo-so_id--wrapper) {
    grid-column: 1;
    grid-row: 1;
  }
  :deep(.SOData-basicInfo-netValue--wrapper) {
    grid-column: 2;
    grid-row: 1;
  }
  :deep(.SOData-basicInfo-netValueUnit--wrapper) {
    grid-column: 3;
    grid-row: 1;
  }
  :deep(.SOData-basicInfo-soldToParty--wrapper) {
    grid-column: 1;
    grid-row: 2;
  }
  :deep(.SOData-basicInfo-shipToParty--wrapper) {
    grid-column: 1;
    grid-row: 3;
  }
  :deep(.SOData-basicInfo-customerReference--wrapper) {
    grid-column: 1;
    grid-row: 4;
  }
  :deep(.SOData-basicInfo-customerReferenceDate--wrapper) {
    grid-column: 2;
    grid-row: 4;
  }

  :deep(.SOData-itemOverview--dict-leaf-section) {
    display: grid;
    grid-template-columns: 50% 35% 15%;
    grid-template-rows: auto auto;
  }
  :deep(.SOData-itemOverview-validTo--wrapper) {
    grid-column: 2;
    grid-row: 1;
  }
  :deep(.SOData-itemOverview-reqDelivDate--wrapper) {
    grid-column: 1;
    grid-row: 2;
  }
  :deep(.SOData-itemOverview-expectOralVal--wrapper) {
    grid-column: 2;
    grid-row: 2;
  }
  :deep(.SOData-itemOverview-expectOralValUnit--wrapper) {
    grid-column: 3;
    grid-row: 2;
  }
  .status-open {
    background-color: #f0ad4e;
  }

  .status-completed {
    background-color: var(--theme-color-dark);
  }

  .status-in-progress {
    background-color: #5bc0de;
  }

  .status-new {
    background-color: #409eff;
  }

  .arrow-icon {
    font-size: 0.8em;
    color: #666;
  }

  .sales-order-output .no-results,
  .sales-order-output .initial-output-message {
    font-size: 1em;
    color: #666;
    font-weight: normal;
    text-align: center;
    margin-top: 20px;
  }

  /* Bottom action buttons area, reusing MaintainBusinessPartnerView styles */
  .bottom-actions {
    display: flex;
    justify-content: flex-end;
    padding: 40px 20px;
    background-color: var(--theme-color-dark);
  }

  /* Bottom create button, reusing search-enter-button style */
  .create-sales-order-button {
    background-color: var(--btn-default-bg);
    color: var(--btn-default-text);
    font-weight: bold;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .create-sales-order-button:hover {
    background-color: var(--btn-hover-bg);
    color: var(--btn-hover-text);
  }

  .footer-cancel-button {
  background-color: var(--btn-default-bg); /* Or other color */
  color: var(--btn-default-text);
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 10px; /* Keep some spacing from other buttons */
}

.footer-cancel-button:hover {
  background-color: var(--btn-hover-bg); /* Or other hover color */
  color: var(--btn-hover-text);
}

/* Item navigation styles (copied from Main.vue) */
.item-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.item-counter {
  font-weight: bold;
  color: #333;
}

.item-nav-button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.item-nav-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.item-nav-button:disabled {
  background-color: #f9f9f9;
  color: #999;
  cursor: not-allowed;
}

.item-prev-button {
  margin-right: auto;
}

.item-next-button {
  margin-left: auto;
}

/* Save and Cancel button styles (copied from Main.vue) */
.save-button {
  padding: 4px 10px;
  margin-right: -10px;
  background-color: var(--theme-color-dark);
  color: var(--theme-color-page);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: var(--theme-color-execute-button-hover);
}

.cancel-button {
  padding: 4px 10px;
  margin-left: -10px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-button:hover {
  background-color: #5a6268;
}

/* Pricing conditions table styles (copied from Main.vue) */
:deep(.itemDetailConditions--dict-leaf-section) {
  display: grid;
  grid-template-columns: 30% 10% 10% 30% 10%;
  grid-template-rows: auto auto;
  gap: 0
}
:deep(.itemDetailConditions-orderQuantity--wrapper) {
  grid-column: 1;
  grid-row: 1;
}
:deep(.itemDetailConditions-orderQuantityUnit--wrapper) {
  grid-column: 2;
  grid-row: 1;
}
:deep(.itemDetailConditions-netValue--wrapper) {
  grid-column: 4;
  grid-row: 1;
}
:deep(.itemDetailConditions-netValueUnit--wrapper) {
  grid-column: 5;
  grid-row: 1;
}
:deep(.itemDetailConditions-taxValue--wrapper) {
  grid-column: 4;
  grid-row: 2;
}
:deep(.itemDetailConditions-taxValueUnit--wrapper) {
  grid-column: 5;
  grid-row: 2;
}

:deep(.itemDetailHeader--dict-leaf-section) {
  display: grid;
  grid-template-columns: 40%;
  grid-template-rows: auto auto;
  gap: 0
}
:deep(.itemDetailSales-orderQuantityAndDeliveryDate--dict-leaf-section),
:deep(.itemDetailSales-generalSalesData--dict-leaf-section) {
  display: grid;
  grid-template-columns: 30% 30% 100px;
  grid-template-rows: auto auto;
  gap: 0
}
:deep(.itemDetailSales-orderQuantityAndDeliveryDate-orderQuantity--wrapper) {
  grid-column: 2;
  grid-row: 1;
}
:deep(.itemDetailSales-orderQuantityAndDeliveryDate-orderQuantityUnit--wrapper) {
  grid-column: 3;
  grid-row: 1;
}
:deep(.itemDetailSales-orderQuantityAndDeliveryDate-reqDelivDate--wrapper) {
  grid-column: 2;
  grid-row: 2;
}

:deep(.itemDetailSales-generalSalesData-netValue--wrapper) {
  grid-column: 2;
  grid-row: 1;
}
:deep(.itemDetailSales-generalSalesData-netValueUnit--wrapper) {
  grid-column: 3;
  grid-row: 1;
}
:deep(.itemDetailSales-generalSalesData-pricingDate--wrapper) {
  grid-column: 2;
  grid-row: 2;
}
:deep(.itemDetailSales-generalSalesData-orderProbability--wrapper) {
  grid-column: 2;
  grid-row: 3;
}

:deep(.SOData-itemOverview-items--extra-table-buttons) {
  display: flex;
  padding-left: 10px;
  gap: 8px;
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

/* Modal styles */
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
  z-index: 1000;
}

.modal-content {
  background-color: var(--theme-color-page);
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-content h4 {
  margin-top: 0;
  color: var(--theme-color-dark);
  font-size: 1.5em;
}

.quotation-input-varbox {
  width: 100%;
}

.quotation-input-varbox :deep(.var-input--main input) {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.modal-message {
  color: red;
  margin-top: 10px;
  font-size: 0.9em;
}

</style>
