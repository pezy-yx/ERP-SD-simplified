<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts"> // 注意这里可能需要添加 lang="ts" 如果你的项目使用 TypeScript
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style>
/* 全局样式保持不变，确保html和body占据整个视口 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #25482C;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>