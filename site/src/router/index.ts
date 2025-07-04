// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import MaintainBusinessPartnerView from '@/views/MaintainBusinessPartnerView.vue'; 
import TestPageErp from "@/test/varbox/TestPageErp.vue";
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MaintainBusinessPartnerView // 你的系统主页或默认页面
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
  }，
    { path: '/login', component: Login },
    { path: '/register', component: Register }
  // 你可以在这里添加其他页面路由
];

const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes
});

export default router;