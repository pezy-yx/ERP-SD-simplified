<template>
  <div id="app">
    <test-page />
  </div>
</template>

<script>
import TestPage from './views/TestPage.vue'

export default {
  name: 'App',
  components: {
    TestPage
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
</style>
