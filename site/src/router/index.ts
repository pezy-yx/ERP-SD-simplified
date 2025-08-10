// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Application from '@/views/Application.vue';
import ApplicationDirectory from '@/views/ApplicationDirectory.vue';
import MaintainBusinessPartnerView from '@/views/MaintainBP/MaintainBusinessPartnerView.vue';
import TestPageErp from "@/test/varbox/TestPageErp.vue";
import SearchModalTest from "@/test/SearchModalTest.vue";
import AppContentTest from "@/test/AppContentTest.vue";
import BPRelationshipTest from "@/test/BPRelationshipTest.vue";
import ExampleApplication from '@/views/example/ExampleApplication.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';
import CreateBp from '@/views/BPRelationship/Create.vue';
import ManageSalesOrders from "@/views/ManageSO/ManageSalesOrders.vue";
import SearchMethodTest from '@/views/test/SearchMethodsTest.vue'

// 询价单
import CreateInquiry from "@/views/inquiry/Create.vue";
import ChangeInquiry from "@/views/inquiry/Change.vue";
import DisplayInquiry from "@/views/inquiry/Display.vue";

// BP关系
import CreateBPRelationship from '@/views/BPRelationship/Create.vue';
import DisplayBPRelationship from "@/views/BPRelationship/Display.vue";
import ChangeBPRelationship from "@/views/BPRelationship/Change.vue";

// 出库交货单
import CreateOutboundDelivery from '@/views/outboundDeliveries/Create.vue';
import PickOutboundDelivery from '@/views/outboundDeliveries/Pick.vue';
import ManageOutboundDeliveries from '@/views/outboundDeliveries/Manage.vue';

// 开票凭证
import CreateBillingDocument from '@/views/billDoc/Create.vue';
import DisplayBillingDocument from '@/views/billDoc/Display.vue';
import ChangeBillingDocument from '@/views/billDoc/Change.vue';

// 库存管理
import DisplayStock from '@/views/stock/Main.vue'

import getMyPassBack from '@/views/GetMyPassBack.vue'; // 引入主页组件
import { title } from "process";
import ManageSalesQuotations from '@/views/manageSalesQuotations/manageSalesQuotations.vue';
import VarTreeTutorial from '@/views/VarTreeTutorial.vue';
import ItemConditionKitTest from '@/views/test/ItemConditionKitTest.vue';

import MaterialDocumentOverview from '@/views/MaterialDocumentOverview/Overview.vue';
import path from "path";

const routes = [
  // 保留原有的路径
  {
    path:'/',
    redirect: '/login' // 默认重定向到登录页面
  },
  {
    path: '/home',
    name: 'Home',
    component: Home // 你的系统主页或默认页面
  },
  {
    path: '/test/erppage', // 定义一个专门用于测试的路由路径
    name: 'MaintainBPTest',
    component: TestPageErp // 引入你的测试文件
  },
  {
    path: '/test/erppage/vake',
    name: 'Test-Page-Vake',
    component: CreateBPRelationship
  },
  
  // 新增的Application父路由，包含导航栏和背景
  {
    path: '/application',
    component: Application,
    children: [
      {
        path: '',
        name: 'ApplicationDirectory',
        component: ApplicationDirectory,
        meta: { title: 'Applications: Development' }
      },
      {
        path: 'maintain-business-partner',
        name: 'ApplicationMaintainBusinessPartner',
        component: MaintainBusinessPartnerView,
        meta: { title: 'Maintain Business Partner' }
      },
      {
        path: 'test/erppage/vake',
        name: 'ApplicationTest-Page-Vake',
        component: CreateBPRelationship,
        meta: { title: 'Create BP Relationship' }
      },
      {
        path: 'test/erppage',
        name: 'ApplicationTestPageErp',
        component: TestPageErp,
        meta: { title: 'Test Page' }
      },
      {
        path: 'test/search-modal',
        name: 'ApplicationSearchModalTest',
        component: SearchModalTest,
        meta: { title: 'Search Modal Test' }
      },
      {
        path: 'test/app-content',
        name: 'ApplicationAppContentTest',
        component: AppContentTest,
        meta: { title: 'AppContent Component Test' }
      },
      {
        path: 'test/bp-relationship',
        name: 'ApplicationBPRelationshipTest',
        component: BPRelationshipTest,
        meta: { title: 'BP Relationship Test' }
      },
      {
        path: 'test/item-condition-kit',
        name: 'ApplicationItemConditionKitTest',
        component: ItemConditionKitTest,
        meta: { title: 'ItemConditionKit Test' }
      },
      {
        path: 'test/search',
        name: 'SearchMethods',
        component: SearchMethodTest,
        meta: { title: 'Search Methods' }
      },
      {
        path: 'example',
        name: 'ApplicationExample',
        component: ExampleApplication,
        meta: { title: 'Example Application' }
      },
      {
        path: 'home',
        name: 'ApplicationHome',
        component: Home,
        meta: { title: 'Sales and Distribution' }
      },
      {
        path: 'create-bp-relationship',
        name: 'CreateBPRelationship',
        component: CreateBPRelationship,
        meta: { title: 'Create BP Relationship' }
      },
      {
        path: 'manage-sales-orders',
        name: 'ManageSalesOrders',
        component: ManageSalesOrders,
        meta:{ title: 'Manage Sales Orders' }
      },
      {
        path: 'create-inquiry',
        name: 'CreateInquiry',
        component: CreateInquiry,
        meta: { title: 'Create Inquiry' }
      },
      {
        path: 'manage-sales-quotations',
        name: 'ManageSalesQuotations',
        component: ManageSalesQuotations,
        meta: { title: 'Manage Sales Quotations' }
      },
      {
        path: 'display-inquiry',
        name: 'DisplayInquiry',
        component: DisplayInquiry,
        meta: { title: 'Display Inquiry' }
      },
      {
        path: 'change-inquiry',
        name: 'ChangeInquiry',
        component: ChangeInquiry,
        meta: { title: 'Change Inquiry' }
      },
      {
        path: 'display-bp-relationship',
        name: 'DisplayBPRelationship',
        component: DisplayBPRelationship,
        meta: { title: 'Display BP Relationship' }
      },
      {
        path: 'change-bp-relationship',
        name: 'ChangeBPRelationship',
        component: ChangeBPRelationship,
        meta: { title: 'Change BP Relationship' }
      },
      {
        path: 'create-outbound-delivery',
        name: 'CreateOutboundDelivery',
        component: CreateOutboundDelivery,
        meta: { title: 'Create Outbound Delivery' }
      },
      {
        path: 'manage-outbound-deliveries',
        name: 'ManageOutboundDeliveries',
        component: ManageOutboundDeliveries,
        meta: { title: 'Manage Outbound Deliveries' }
      },
      {
        path: 'pick-outbound-delivery',
        name: 'PickOutboundDelivery',
        component: PickOutboundDelivery,
        meta: { title: 'Pick Outbound Delivery' }
      },
      {
        path: 'vartree-&-varinput-tutorial',
        name: 'VarTreeTutorial',
        component: VarTreeTutorial,
        meta: { title: 'VarBox Tutorial' }
      },
      {
        path: 'create-billing-document',
        name: 'CreateBillingDocument',
        component: CreateBillingDocument,
        meta: { title: 'Create Billing Document' }
      },
      {
        path: 'display-billing-document',
        name: 'DisplayBillingDocument',
        component: DisplayBillingDocument,
        meta: { title: 'Display Billing Document' }
      },
      {
        path: 'change-billing-document',
        name: 'ChangeBillingDocument',
        component: ChangeBillingDocument,
        meta: { title: 'Change Billing Document' }
      },
      {
        path: 'display-stock',
        name: 'DisplayStock',
        component: DisplayStock,
        meta: { title: 'Display Stock' }
      },
      {
        path: 'material-documents-overview',
        name: 'MaterialDocumentOverview',
        component: MaterialDocumentOverview,
        meta: { title: 'MaterialDocumentOverview' }
      },
      {
        path: 'kanban',
        name: 'DashboardKanban',
        component: () => import('@/views/kanban/Main.vue'),
        meta: { title: 'Business Dashboard' }
      },
      {
        path: 'posting-incoming-payments',
        name: 'PostingIncomingPayments',
        component: () => import('@/views/postingIncomingPayments/postingIncomingPayments.vue'),
        meta: { title: 'Posting Incoming Payments' }
      },
      {
        path: 'display-journal-entry/:id',
        name: 'DisplayJournalEntry',
        component: () => import('@/views/postingIncomingPayments/displayJournalEntry.vue'),
        meta: { title: 'Display Journal Entry' }
      },
    ]
  },
  { 
    path: '/login',
    name: 'Login',
    component: Login 
  },
  { 
    path: '/register', 
    name: 'Register',
    component: Register 
  },
  {
    path: '/getMyPassBack',
    name: 'GetMyPassBack',
    component: getMyPassBack // 主页组件
  }
  // 你可以在这里添加其他页面路由
];

const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes
});

export default router;