<template>
  <div class="application-layout">
    <!-- 固定的导航栏 -->
    <NavigationBar
      :pageTitle="currentPageTitle"
      @search="handleGlobalSearch"
      @profile-click="handleProfileButtonClick"
    />
    
    <!-- 主要内容区域 - 这里会根据子路由显示不同的内容 -->
    <div
      :class="`application-content-container ${showProfileSideZone?'showingSideZone':''}`"
    >
      <router-view
        @update-title="updatePageTitle"
        class = "application-content"
      />
    </div>
    
    <!-- 侧栏 -->
    <span
      :class = "`side-zone-bg ${showProfileSideZone?'showing':''}` "
      @click="handleSideZoneClose"
    ></span>
    <div
      :class="`side-zone-container ${showProfileSideZone?'showing':''}`"
      @click="handleSideZoneClose"
    >
      <div
        class="side-zone-content-container"
        @click.stop
      >
        <RecentApplications
          @navigate="handleSideZoneNavigate"
          :key="sideZoneKey"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavigationBar from '@/components/NavigationBar.vue';
import RecentApplications from '@/components/RecentApplications.vue';

// 响应式数据
const currentPageTitle = ref<string>('Application');
const showProfileSideZone = ref<boolean>(false);
const sideZoneKey = ref<number>(0);

// 路由
const route = useRoute();

// 方法
const handleGlobalSearch = (query: string): void => {
  console.log('全局搜索:', query);
  // 处理全局搜索逻辑
  // 可以通过事件总线或状态管理传递给子组件
};

const updatePageTitle = (title: string): void => {
  currentPageTitle.value = title;
};

const updateTitleFromRoute = (): void => {
  // 根据路由meta信息或路由名称设置标题
  const routeMeta = route.meta;
  if (routeMeta && routeMeta.title) {
    currentPageTitle.value = routeMeta.title as string;
  } else {
    // 根据路由名称设置默认标题
    switch (route.name) {
      case 'MaintainBusinessPartner':
        currentPageTitle.value = 'Maintain Business Partner';
        break;
      case 'TestPageErp':
        currentPageTitle.value = 'Test Page';
        break;
      default:
        currentPageTitle.value = 'Application';
    }
  }
};

const handleProfileButtonClick = (): void => {
  showProfileSideZone.value = !showProfileSideZone.value;

  // 如果打开侧栏，刷新历史记录组件
  if (showProfileSideZone.value) {
    sideZoneKey.value += 1;
  }
};

const handleSideZoneNavigate = (): void => {
  // 当从侧栏导航到应用时，关闭侧栏
  showProfileSideZone.value = false;
};

const handleSideZoneClose = (): void => {
  // 关闭侧栏
  showProfileSideZone.value = false;
};

// ESC键监听
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && showProfileSideZone.value) {
    showProfileSideZone.value = false;
  }
};

// 生命周期
onMounted(() => {
  // 根据当前路由设置初始标题
  updateTitleFromRoute();

  // 添加键盘事件监听器
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  // 移除键盘事件监听器
  document.removeEventListener('keydown', handleKeyDown);
});

// 监听路由变化
watch(route, () => {
  // 路由变化时更新标题
  updateTitleFromRoute();
});
</script>

<style scoped>
.application-layout {
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  background-color: var(--theme-color-dark); /* 应用的背景色 */
  --nav-height: 4vh;
  --side-width: 25%;
}

.navigation-bar {
  min-height: var(--nav-height);
  max-height: var(--nav-height);
  height: var(--nav-height);
}

.application-content-container {
  flex-grow: 1;
  /* 子组件会在这个区域内显示 */
  max-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: row;
}

.application-content {
  flex-basis: 100%;
}

.side-zone-bg {
  position: fixed;
  left: 0;
  top: var(--nav-height);
  width: 0%;
  height: calc(100vh - var(--nav-height));
  transition: all 0.3s ease;
  z-index: 100;
  background: 
    linear-gradient(to right, 
      var(--theme-color-dark) 0%, 
      var(--theme-color-dark) calc(var(--side-width) * 90 / 100), 
      var(--theme-color-light) calc(var(--side-width) * 120 / 100), 
      var(--theme-color-light-a) 80%,
      rgba(0,0,0,0) 100%
    );
  mix-blend-mode: darken;
}

.side-zone-container {
  position: fixed;
  left: 0;
  top: var(--nav-height);
  width: 0%;
  height: calc(100vh - var(--nav-height));
  transition: all 0.3s ease;
  z-index: 120;
  background: 
    linear-gradient(to right, 
      var(--theme-color-dark) 0%, 
      var(--theme-color-dark) calc(var(--side-width) * 80 / 100),
      rgba(0,0,0,0)
    );
  overflow: hidden;
}

.side-zone-bg.showing {
  width: 100%;
  transform: translateX(0);
}
.side-zone-container.showing {
  width: 100%;
  transform: translateX(0);
}

:deep(.application-content-container.showingSideZone .page-content > *) {
  transform: translateX( calc(var(--side-width) / 2) ) scale(0.73);  
}
:deep(.page-content > *) {
  transform: translateX(0);  
  transform-origin: 68% 43%; 
  transition: all 0.3s ease;
}

:deep(.application-content-container.showingSideZone .page-content .bottom-bar) {
  transform: translateY(333vh) scale(0.73);  
}
:deep(.page-content .bottom-bar) {
  transform: translateY(0);  
  transform-origin: 68% 43%; 
  transition: all 0.3s ease;
}

.side-zone-content-container {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:deep(.page-content) {
 /* flex-grow: 1; */
 background-color: var(--theme-color-page);
 padding: 20px;
 margin: 20px;
 border-radius: 8px;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
 display: flex;
 flex-direction: column;
 padding-top: 50px; /* 调整顶部内边距 */
 overflow-y: auto;
 min-height: calc(100vh - var(--nav-height) - 40px);
 max-height: calc(100vh - var(--nav-height) - 40px);
}

:deep(.page-content::-webkit-scrollbar) {
  display: none;
}

:deep(.bottom-bar) {
  position: fixed;
  bottom: 1%;
  left: 1%;
  height: 3vh;
  width: calc(100% - 2 * 1%);
  border-radius: 5px;
  background-color: rgba(47, 60, 72, 0.99);
  color: #EEEED4;
  padding: 5px;
  display: flex;
  flex-direction: row;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
  gap: 5px;
}

:deep(.bottom-bar button) {
  padding: 0px 8px;
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