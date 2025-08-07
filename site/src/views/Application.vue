<template>
  <div class="application-layout" id="application-layout">
    <!-- 固定的导航栏 -->
    <NavigationBar
      :pageTitle="currentPageTitle"
      @search="handleGlobalSearch"
      @profile-click="handleProfileButtonClick"
    />
    
    <!-- 主要内容区域 - 这里会根据子路由显示不同的内容 -->
    <div
      :class="`application-content-container ${showProfileSideZone?'showingSideZone':''}`"
      id="application-content-container"
    >
      <router-view
        @update-title="updatePageTitle"
        class = "application-content"
        id = "application-content"
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
        <div class="side-zone-header">
          <a href="#" class="setting-button" :onclick="handleSettingButonClick">
            <img src="../assets/settings.png" alt="Home" class="nav-icon" />
          </a>
        </div>
        <RecentApplications
          @navigate="handleSideZoneNavigate"
          :key="sideZoneKey"
        />
        <div v-if="showSettingModalFlag">
          <Teleport to="body">
            <div class="settingModal" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--theme-color-page);padding:32px 24px;border-radius:8px;box-shadow:0 4px 24px rgba(0,0,0,0.18);z-index:999;">
              <h3 style="margin-bottom:16px;">自定义 API 地址</h3>
              <input
                type="text"
                v-model="customApiBaseUrl"
                placeholder="输入 API 地址"
                style="width:100%;padding:8px 12px;border:1px solid #ccc;border-radius:4px;margin-bottom:16px;"
              />
              <p>{{`(Template: http://ip:port)`}}</p>
              <div style="display:flex;justify-content:flex-end;gap:12px;">
                <button @click="hideSettingModal" style="padding:6px 18px;border:none;background:#eee;border-radius:4px;cursor:pointer;">取消</button>
                <button @click="saveCustomApiBaseUrl" style="padding:6px 18px;border:none;background:var(--theme-color-dark);color:#fff;border-radius:4px;cursor:pointer;">保存</button>
              </div>
            </div>
          </Teleport>
        </div>
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

const showSettingModalFlag = ref(false)
function handleSettingButonClick() {
  showSettingModal()
}
function showSettingModal() {
  showSettingModalFlag.value = true
}
function hideSettingModal() {
  showSettingModalFlag.value = false
}

const customApiBaseUrl = ref<string>('');

// 保存 API 地址到 localStorage
function saveCustomApiBaseUrl() {
  localStorage.setItem('CUSTOM_API_BASE_URL', customApiBaseUrl.value);
  hideSettingModal();
}

// 生命周期
onMounted(() => {
  const savedUrl = localStorage.getItem('CUSTOM_API_BASE_URL');
  if (savedUrl) {
    customApiBaseUrl.value = savedUrl;
  }
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
  --side-width: 28%;
  --side-zone-hard-bg-width-dark-ratio: 90;
  --side-zone-hard-bg-width-light-ratio: 130;
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
      var(--theme-color-dark) calc(var(--side-width) * var(--side-zone-hard-bg-width-dark-ratio) / 100), 
      var(--theme-color-light) calc(var(--side-width) * var(--side-zone-hard-bg-width-light-ratio) / 100), 
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
      var(--theme-color-dark) calc(var(--side-width) * var(--side-zone-hard-bg-width-ratio) / 100),
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


:deep(.application-content-container.showingSideZone .show-side--away) {
  opacity: 0;
}
:deep(.show-side--away) {
  opacity: 1;
}

:deep(.application-content-container.showingSideZone .show-side--away),
:deep(.application-content-container.showingSideZone .page-content > *) {
  transform: translateX( calc(var(--side-width) / 2) ) scale(0.73);  
}

:deep(.show-side--away),
:deep(.page-content > *) {
  transform: translateX(0);  
  transform-origin: 68% 43%; 
  transition: all 0.3s ease;
}

:deep(.application-content-container.showingSideZone ~ .bottom-bar) {
  transform: translate(100vw, 30vh) scale(0.73);  
}
:deep(.bottom-bar) {
  transform: translate(0 ,0);  
  transform-origin: 68% 43%; 
  transition: all 0.1s ease;
  z-index: 50;
}

.side-zone-content-container {
  width: calc(var(--side-width));
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.side-zone-header {
  padding-top: 20px;
}

.setting-button {
  display: inline-block;
  text-decoration: none;
  overflow: hidden;
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 50px;
  height: 50px;
}
.setting-button img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持图片比例并填充容器 */
  display: block; /* 移除图片底部的小空隙 */
  transition: filter 0.2s ease; /* 图片变色过渡效果 */
}

/* 悬浮效果：放大、阴影加深、图片变暗 */
.setting-button:hover {
  transform: translateY(-2px); /* 向上移动，增加悬浮感 */
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2); /* 阴影加深 */
}

.setting-button:hover img {
  filter: brightness(0.9); /* 鼠标悬浮时，图片亮度降低 */
}

/* 点击效果：收缩、阴影变小 */
.setting-button:active {
  transform: translateY(0); /* 恢复到原位 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影变小，模拟按下的效果 */
}

:deep(.page-content) {
 /* flex-grow: 1; */
 background-color: var(--theme-color-page);
 margin: 20px;
 padding: 0 20px;
 padding-top: 50px;
 border-radius: 4px;
 display: flex;
 flex-direction: column;
 overflow-y: auto;
 min-height: calc(100vh - var(--nav-height) - 40px);
 max-height: calc(100vh - var(--nav-height) - 40px);
}

:deep(.page-content::-webkit-scrollbar) {
  display: none;
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

/* 只显示一个灰色层，其他透明但是要接受鼠标事件 */
:deep(#application-layout > .gray-layer ~ .gray-layer) {
  opacity: 0;
  background-color: transparent;
}

:deep(.gray-layer) {
  z-index: 80;
}
:deep(.search-modal) {
  z-index: 90;
}
</style>