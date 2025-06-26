<template>
  <div id="app">
    <div class="page-switcher">
      <button
        @click="currentPage = 'new'"
        :class="{ active: currentPage === 'new' }"
        class="switch-btn"
      >
        VarTree测试
      </button>
    </div>
    
    <test-page v-if="currentPage === 'new'" />
  </div>
</template>

<script>
import TestPage from './views/TestPage.vue'

export default {
  name: 'App',
  components: {
    TestPage
  },
  data() {
    return {
      currentPage: 'new' // 默认显示新版
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

/* 重置样式 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
}

/* 页面切换器样式 */
.page-switcher {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #EBEEF5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.switch-btn {
  padding: 10px 20px;
  border: 1px solid #DCDFE6;
  border-radius: 6px;
  background-color: white;
  color: #606266;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.switch-btn:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.switch-btn.active {
  background-color: #409EFF;
  border-color: #409EFF;
  color: white;
}

.switch-btn.active:hover {
  background-color: #337ECC;
  border-color: #337ECC;
}
</style>
