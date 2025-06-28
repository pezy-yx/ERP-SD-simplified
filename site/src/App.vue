<template>
  <div id="app">
    <LoginPage />
  </div>
</template>

<script>
import LoginPage from './components/LoginPage.vue'; // 确保路径正确

export default {
  name: 'App',
  components: {
    LoginPage
  }
};
</script>

<style>
/* 你可能需要一些全局的 body/html 样式来确保全屏布局 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: auto; /* 防止页面内容溢出时出现滚动条 */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* 移除 App.vue 默认的 margin-top，让 LoginPage 控制整体布局 */
  /* margin-top: 60px; */
}
</style>