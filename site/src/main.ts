// createApp是Vue 3的API，负责初始化一个Vue应用实例
// 它会创建一个"虚拟环境"，管理页面的组件、数据、交互等
// 底层会初始化Vue的响应式系统、组件渲染器和事件系统
import { createApp } from 'vue'
// App.vue是Vue应用的根组件
// 导入时，Vue会通过构建工具把App.vue编译成JavaScript对象
// 包含渲染函数、数据、方法等
import App from './App.vue'
import router from './router'
import './assets/styles/_base.css'

// 现在可以在任何地方直接使用 window.API_BASE_URL
declare global {
  interface Window {
    API_BASE_URL: string;
  }
}

// 从环境变量读取并设置为全局变量
window.API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

// 创建Vue应用，把App.vue挂载到index.html的<div id="app">元素上
// 启动页面渲染
createApp(App).use(router).mount('#app')
