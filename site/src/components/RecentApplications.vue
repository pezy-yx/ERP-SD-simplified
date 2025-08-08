<template>
  <div class="recent-applications">
    <div class="recent-header">
      <h3>最近访问</h3>
      <div class="header-buttons">
        <button
          v-if="recentApps.length > 0"
          @click="clearHistory"
          class="clear-btn"
          title="Clear"
        >
          Clear
        </button>
      </div>
    </div>
    
    <div v-if="recentApps.length === 0" class="empty-state">
      <p>暂无访问记录</p>
    </div>
    
    <div v-else class="recent-list">
      <div 
        v-for="app in recentApps" 
        :key="app.routePath"
        class="recent-item"
        @click="navigateToApplication(app)"
      >
        <div class="app-info">
          <div class="app-name">{{ app.applicationName }}</div>
          <div class="app-lore" v-if="app.lore">{{ app.lore }}</div>
          <div class="app-meta">
            <span class="visit-time">{{ formatVisitTime(app.visitTime) }}</span>
            <span class="visit-count" v-if="app.visitCount > 1">
              访问 {{ app.visitCount }} 次
            </span>
          </div>
        </div>
        <div class="app-actions">
          <button 
            @click.stop="removeFromHistory(app.routePath)"
            class="remove-btn"
            title="从历史记录中移除"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import applicationHistoryManager, { type VisitRecord } from '@/utils/ApplicationHistoryManager';

// 定义事件
const emit = defineEmits<{
  navigate: []
}>();

// 响应式数据
const recentApps = ref<VisitRecord[]>([]);

// 路由
const router = useRouter();

// 方法
const loadRecentApplications = (): void => {
  recentApps.value = applicationHistoryManager.getRecentApplications(8);
};

const navigateToApplication = (app: VisitRecord): void => {
  const fullPath = `/application${app.routePath}`;
  console.log(`从历史记录导航到应用: ${app.applicationName} -> ${fullPath}`);

  // 更新访问记录
  applicationHistoryManager.addVisitRecord(app);

  // 导航到应用
  router.push(fullPath);

  // 发出事件通知父组件关闭侧栏
  emit('navigate');
};

const removeFromHistory = (routePath: string): void => {
  applicationHistoryManager.removeHistoryRecord(routePath);
  loadRecentApplications(); // 重新加载列表
};

const clearHistory = (): void => {
  if (confirm('确定要清除所有历史记录吗？')) {
    applicationHistoryManager.clearHistory();
    loadRecentApplications(); // 重新加载列表
  }
};

const formatVisitTime = (visitTime: string): string => {
  const now = new Date();
  const visit = new Date(visitTime);
  const diffMs = now.getTime() - visit.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return '刚刚';
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return visit.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  }
};

// 生命周期
onMounted(() => {
  loadRecentApplications();

  // 监听路由变化，当路由变化时重新加载历史记录
  watch(router.currentRoute, () => {
    loadRecentApplications();
  });
});
</script>

<style scoped>
.recent-applications {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--theme-color-lighter-a);
}

.header-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.recent-header h3 {
  margin: 0;
  color: var(--theme-color-page);
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
}

.clear-btn {
  background: none;
  border: 1px solid var(--theme-color-page);
  color: var(--theme-color-page);
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.clear-btn:hover {
  color: var(--theme-color-darker);
  background-color: var(--theme-color-lighter);
  border-color: var(--theme-color);
  transform: translateY(-1px);
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-color);
  font-style: italic;
  white-space: nowrap;
}

.recent-list {
  flex: 1;
  overflow-y: auto;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: var(--theme-color-lighter-a);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.recent-item:hover {
  background-color: var(--theme-color-lighter);
  border-color: var(--theme-color);
  transform: translateY(-1px);
}

.recent-item:hover .remove-btn,
.recent-item:hover .app-name,
.recent-item:hover .app-lore,
.recent-item:hover .visit-time,
.recent-item:hover .visit-count {
  color: var(--theme-color-darker)
}

.recent-item:hover .app-name,
.recent-item:hover .app-lore  {
  opacity: 1;
}

.app-info {
  flex: 1;
  min-width: 0;
}

.app-name {
  font-weight: 600;
  color: var(--theme-color-page);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  line-height: 1.2;
  white-space: nowrap;
  opacity: 0.8;
}

.app-lore {
  color: var(--theme-color);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: nowrap;
  opacity: 0.8;
}

.app-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: var(--theme-color);
  white-space: nowrap;
}

.visit-time {
  opacity: 0.8;
  white-space: nowrap;
  color: var(--theme-color-page);
}

.visit-count {
  opacity: 0.6;
  white-space: nowrap;
  color: var(--theme-color-page);
}

.app-actions {
  margin-left: 0.5rem;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--theme-color-page);
  cursor: pointer;
  font-size: 1.2rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.remove-btn:hover {
  background-color: rgba(255, 0, 0, 0.1);
  color: #ff4444;
  opacity: 1;
}

/* 滚动条样式 */
.recent-list::-webkit-scrollbar {
  width: 4px;
}

.recent-list::-webkit-scrollbar-track {
  background: var(--theme-color-lighter-a);
  border-radius: 2px;
}

.recent-list::-webkit-scrollbar-thumb {
  background: var(--theme-color);
  border-radius: 2px;
}

.recent-list::-webkit-scrollbar-thumb:hover {
  background: var(--theme-color-darker);
}
</style>
