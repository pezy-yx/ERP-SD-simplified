// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Application from '@/views/Application.vue';
import ApplicationDirectory from '@/views/ApplicationDirectory.vue';
import MaintainBusinessPartnerView from '@/views/MaintainBusinessPartnerView.vue';
import TestPageErp from "@/test/varbox/TestPageErp.vue";
import SearchModalTest from "@/test/SearchModalTest.vue";
import AppContentTest from "@/test/AppContentTest.vue";
import BPRelationshipTest from "@/test/BPRelationshipTest.vue";
import ExampleApplication from '@/views/example/ExampleApplication.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';
import ManageSalesOrders from "@/views/ManageSalesOrders.vue";

// 询价单
import CreateInquiry from "@/views/inquiry/Create.vue";
import ChangeInquiry from "@/views/inquiry/Change.vue";
import DisplayInquiry from "@/views/inquiry/Display.vue";

// BP关系
import CreateBPRelationship from '@/views/BPRelationship/Create.vue';
import DisplayBPRelationship from "@/views/BPRelationship/Display.vue";
import ChangeBPRelationship from "@/views/BPRelationship/Change.vue";

import getMyPassBack from '@/views/GetMyPassBack.vue'; // 引入主页组件

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
        meta: { title: '应用程序目录' }
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