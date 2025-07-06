<template>
  <div class="application-layout">
    <!-- 固定的导航栏 -->
    <NavigationBar :pageTitle="currentPageTitle" @search="handleGlobalSearch"/>
    
    <!-- 主要内容区域 - 这里会根据子路由显示不同的内容 -->
    <div class="application-content">
      <router-view @update-title="updatePageTitle"/>
    </div>
  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';

export default {
  name: 'Application',
  components: {
    NavigationBar
  },
  data() {
    return {
      currentPageTitle: 'Application' // 默认标题
    };
  },
  methods: {
    handleGlobalSearch(query) {
      console.log('全局搜索:', query);
      // 处理全局搜索逻辑
      // 可以通过事件总线或状态管理传递给子组件
    },
    updatePageTitle(title) {
      this.currentPageTitle = title;
    }
  },
  mounted() {
    // 根据当前路由设置初始标题
    this.updateTitleFromRoute();
  },
  watch: {
    '$route'() {
      // 路由变化时更新标题
      this.updateTitleFromRoute();
    }
  },
  methods: {
    handleGlobalSearch(query) {
      console.log('全局搜索:', query);
    },
    updatePageTitle(title) {
      this.currentPageTitle = title;
    },
    updateTitleFromRoute() {
      // 根据路由meta信息或路由名称设置标题
      const routeMeta = this.$route.meta;
      if (routeMeta && routeMeta.title) {
        this.currentPageTitle = routeMeta.title;
      } else {
        // 根据路由名称设置默认标题
        switch (this.$route.name) {
          case 'MaintainBusinessPartner':
            this.currentPageTitle = 'Maintain Business Partner';
            break;
          case 'TestPageErp':
            this.currentPageTitle = 'Test Page';
            break;
          default:
            this.currentPageTitle = 'Application';
        }
      }
    }
  }
};
</script>

<style scoped>
.application-layout {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  background-color: var(--theme-color-dark); /* 应用的背景色 */
}

.application-content {
  flex-grow: 1;
  /* 子组件会在这个区域内显示 */
}

:deep(.page-content) {
 flex-grow: 1;
 background-color: var(--theme-color-page);
 padding: 20px;
 margin: 20px;
 border-radius: 8px;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
 display: flex;
 flex-direction: column;
 padding-top: 50px; /* 调整顶部内边距 */
 /* height: calc(100% - 50px - 40px - 40px); */
}

:deep(.bottom-bar) {
  position: fixed;
  bottom: 1%;
  left: 1%;
  height: 2vh;
  width: calc(100% - 2 * 1%);
  border-radius: 5px;
  background-color: rgba(47, 60, 72, 0.99);
  color: #EEEED4;
  padding: 5px;
  display: flex;
  flex-direction: row;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
}

:deep(.bottom-bar-spacer) {
  flex-grow: 1;
}

:deep(.execute-button) {
  background-color: var(--theme-color-execute-button);
  color: white;
  border: none;
  border-radius: 5px;
  height: 100%;
}
:deep(.execute-button:hover) {
  background-color: var(--theme-color-execute-button-hover);
  color: white;
}
:deep(.execute-button:active) {
  background-color: var(--theme-color-execute-button-active);
  color: black;
}
</style>