// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Application from '@/views/Application.vue';
import ApplicationDirectory from '@/views/ApplicationDirectory.vue';
import MaintainBusinessPartnerView from '@/views/MaintainBusinessPartnerView.vue';
import MaintainBusinessPartnerContent from '@/views/MaintainBusinessPartnerView.vue';
import TestPageErp from "@/test/varbox/TestPageErp.vue";
import SearchModalTest from "@/test/SearchModalTest.vue";
import AppContentTest from "@/test/AppContentTest.vue";
import ExampleApplication from '@/views/example/ExampleApplication.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';
import CreateBp from '@/views/BPRelationship/Create.vue';
import getMyPassBack from '@/views/GetMyPassBack.vue'; // 引入主页组件

const routes = [
  // 保留原有的路径
  {
    path:'/',
    redirect: '/login' // 默认重定向到登录页面
  },
  {
    path: '/',
    name: 'Home',
    component: Home // 你的系统主页或默认页面
  },
  {
    path: '/maintain-bp',
    name: 'MaintainBusinessPartner',
    component: MaintainBusinessPartnerView // 实际的业务伙伴维护页面
  },
  {
    path: '/test/erppage', // 定义一个专门用于测试的路由路径
    name: 'MaintainBPTest',
    component: TestPageErp // 引入你的测试文件
  },
  {
    path: '/test/erppage/vake',
    name: 'Test-Page-Vake',
    component: CreateBp
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
        path: 'maintain-bp',
        name: 'ApplicationMaintainBusinessPartner',
        component: MaintainBusinessPartnerView,
        meta: { title: 'Maintain Business Partner' }
      },
      {
        path: 'test/erppage/vake',
        name: 'ApplicationTest-Page-Vake',
        component: CreateBp,
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
        path: 'example',
        name: 'ApplicationExample',
        component: ExampleApplication,
        meta: { title: 'Example Application' }
      },
      {
        path: 'home',
        name: 'ApplicationHome',
        component: Home,
        meta: { title: 'Home' }
      },



      {
        path: 'create-bp-relationship',
        name: 'CreateBPRelationship',
        component: CreateBp,
        meta: { title: 'Create BP Relationship' }
      }
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