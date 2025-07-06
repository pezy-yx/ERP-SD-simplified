// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import MaintainBusinessPartnerView from '@/views/MaintainBusinessPartnerView.vue'; 
import TestPageErp from "@/test/varbox/TestPageErp.vue";
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';
import getMyPassBack from '@/views/GetMyPassBack.vue'; // 引入主页组件

const routes = [
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