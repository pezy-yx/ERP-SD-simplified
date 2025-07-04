<template>
  <div class="test-container">
    <h2>业务伙伴维护页面测试模式</h2>
    <p>这个页面专门用于测试 `MaintainBusinessPartnerView` 的功能。</p>
    <MaintainBusinessPartnerView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MaintainBusinessPartnerView from '@/views/MaintainBusinessPartnerView.vue'; // 引入实际要测试的页面

export default defineComponent({
  name: 'MaintainBPTestView', // 遵循多单词命名约定
  components: {
    MaintainBusinessPartnerView
  }
});
</script>

<style scoped>
.test-container {
  /* 可以为测试页面添加一些测试专用的样式，比如边框或背景色 */
  border: 2px dashed #ccc;
  padding: 20px;
  margin: 20px;
  background-color: #f0f0f0;
  text-align: center;
  flex-grow: 1; /* 确保它能撑开 */
  display: flex;
  flex-direction: column;
}
</style>