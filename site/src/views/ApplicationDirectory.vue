<template>
  <div class="page-content">
    <div>
      <!-- 标签筛选器 -->
      <div class="tag-filter-section">
        <div class="tag-filter-container">
          <button 
            class="tag-filter-button"
            :class="{ active: selectedTag === null }"
            @click="selectTag(null)"
          >
            全部
          </button>
          <button 
            v-for="tag in availableTags" 
            :key="tag"
            class="tag-filter-button"
            :class="{ active: selectedTag === tag }"
            @click="selectTag(tag)"
          >
            {{ getTagDisplayName(tag) }}
          </button>
        </div>
      </div>

      <!-- 应用程序网格 -->
      <div class="applications-grid">
        <div 
          v-for="app in filteredApplications" 
          :key="app.applicationName"
          class="application-card"
          @click="navigateToApplication(app)"
        >
          <div class="application-header">
            <p class="application-name">{{ app.applicationName }}</p>
            <!-- <div class="application-tags">
              <span 
                v-for="tag in app.tags" 
                :key="tag"
                class="application-tag"
                :class="`tag-${tag.replace(/\s+/g, '-')}`"
              >
                {{ getTagDisplayName(tag) }}
              </span>
            </div> -->
          </div>
          <span class="spacer"></span>
          <div class="application-lore" v-if="app.lore">
            {{ app.lore }}
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="directory-stats">
        <span>显示 {{ filteredApplications.length }} / {{ applications.length }} 个应用程序</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import applicationHistoryManager, { type ApplicationInfo } from '@/utils/ApplicationHistoryManager';

// 定义事件
const emit = defineEmits<{
  'update-title': [title: string]
}>();

// 响应式数据
const selectedTag = ref<string | null>(null);
const applications = ref<ApplicationInfo[]>([
        {
          "applicationName": "Curricular Material PDF",
          "lore": "Download Curricula",
          "routePath": "/curricular-material-pdf",
          "tags": ["chore"]
        },
        {
          "applicationName": "Maintain Business Partner",
          "lore": "",
          "routePath": "/maintain-business-partner",
          "tags": ["customer management"]
        },
        {
          "applicationName": "Create BP relationship",
          "lore": "",
          "routePath": "/create-bp-relationship",
          "tags": ["customer management"]
        },
        {
          "applicationName": "Display BP relationship",
          "lore": "",
          "routePath": "/display-bp-relationship",
          "tags": ["customer management"]
        },
        {
          "applicationName": "Change BP relationship",
          "lore": "",
          "routePath": "/change-bp-relationship",
          "tags": ["customer management"]
        },
        {
          "applicationName": "Create Inquiry",
          "lore": "",
          "routePath": "/create-inquiry",
          "tags": ["order management"]
        },
        {
          "applicationName": "Change Inquiry",
          "lore": "",
          "routePath": "/change-inquiry",
          "tags": ["order management"]
        },
        {
          "applicationName": "Display Inquiry",
          "lore": "",
          "routePath": "/display-inquiry",
          "tags": ["order management"]
        },
        {
          "applicationName": "Manage Sales Quotations",
          "lore": "",
          "routePath": "/manage-sales-quotations",
          "tags": ["order management"]
        },
        {
          "applicationName": "Create Sales Order",
          "lore": "",
          "routePath": "/create-sales-order",
          "tags": ["order management"]
        },
        {
          "applicationName": "Sales Order Fulfillment",
          "lore": "All issues",
          "routePath": "/sales-order-fulfillment",
          "tags": ["order management", "delivery management"]
        },
        {
          "applicationName": "List Sales Orders",
          "lore": "",
          "routePath": "/list-sales-orders",
          "tags": ["order management"]
        },
        {
          "applicationName": "Manage Sales Orders",
          "lore": "",
          "routePath": "/manage-sales-orders",
          "tags": ["order management"]
        },
        {
          "applicationName": "Create Outbound Delivery",
          "lore": "Create deliveries from sales orders",
          "routePath": "/create-outbound-delivery",
          "tags": ["delivery management"]
        },
        {
          "applicationName": "Manage Outbound Deliveries",
          "lore": "Manage and process existing deliveries",
          "routePath": "/manage-outbound-deliveries",
          "tags": ["delivery management"]
        },
        {
          "applicationName": "Pick Outbound Delivery",
          "lore": "From Sales Orders",
          "routePath": "/pick-outbound-delivery",
          "tags": ["delivery management"]
        },
        {
          "applicationName": "Material Documents Overview",
          "lore": "",
          "routePath": "/material-documents-overview",
          "tags": ["chore"]
        },
        {
          "applicationName": "Manage Stock",
          "lore": "",
          "routePath": "/manage-stock",
          "tags": ["chore"]
        },
        {
          "applicationName": "Display Stock Overview",
          "lore": "",
          "routePath": "/display-stock-overview",
          "tags": ["chore"]
        },
        {
          "applicationName": "Create Billing Documents VRF11",
          "lore": "VRF11",
          "routePath": "/create-billing-document",
          "tags": ["financial management"]
        },
        {
          "applicationName": "Display Billing Documents",
          "lore": "76\nBilling Due List Items",
          "routePath": "/display-billing-document",
          "tags": ["financial management"]
        },
        {
          "applicationName": "Change Billing Document VR02",
          "lore": "VR02",
          "routePath": "/change-billing-document",
          "tags": ["financial management"]
        },
        {
          "applicationName": "Display Billing Document VR03",
          "lore": "VR03",
          "routePath": "/display-billing-document",
          "tags": ["financial management"]
        },
        {
          "applicationName": "Manage Billing Documents",
          "lore": "",
          "routePath": "/manage-billing-documents",
          "tags": ["financial management"]
        },
        {
          "applicationName": "Post Incoming Payments",
          "lore": "",
          "routePath": "/post-incoming-payments",
          "tags": ["financial management"]
        },
        {
          "applicationName": "AppContent Component Test",
          "lore": "测试AppContent组件的stage管理功能",
          "routePath": "/test/app-content",
          "tags": ["test"]
        },
        {
          "applicationName": "Example Application",
          "lore": "展示VarTree/VarBox、ApplicationContent和SearchModal的综合应用示例",
          "routePath": "/example",
          "tags": ["example"]
        },
        {
          "applicationName": "VarBox Tutorial",
          "lore": "VarBox的所有用法",
          "routePath": "/vartree-&-varinput-tutorial",
          "tags": ["example"]
        },
      ]
);

// 路由
const router = useRouter();

// 计算属性
const availableTags = computed((): string[] => {
  const tags = new Set<string>();
  applications.value.forEach(app => {
    app.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
});

const filteredApplications = computed((): ApplicationInfo[] => {
  if (!selectedTag.value) {
    return applications.value;
  }
  return applications.value.filter(app =>
    app.tags?.includes(selectedTag.value!)
  );
});

// 方法
const selectTag = (tag: string | null): void => {
  selectedTag.value = tag;
};

const getTagDisplayName = (tag: string): string => {
  const tagNames: Record<string, string> = {
    'customer management': '客户管理',
    'order management': '订单管理',
    'delivery management': '交付管理',
    'financial management': '财务管理',
    'chore': '其他',
    'test': '测试',
    'example': '示例'
  };
  return tagNames[tag] || tag;
};

const navigateToApplication = (app: ApplicationInfo): void => {
  const fullPath = `/application${app.routePath}`;
  console.log(`导航到应用: ${app.applicationName} -> ${fullPath}`);

  // 记录应用程序访问历史
  applicationHistoryManager.addVisitRecord(app);

  router.push(fullPath);
};

// 生命周期
onMounted(() => {
  // 设置页面标题
  emit('update-title', '应用程序目录');
});
</script>

<style scoped>
.tag-filter-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--theme-color-lighter-a);
  border-radius: 8px;
}

.tag-filter-label {
  color: var(--theme-color-dark);
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.tag-filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-filter-button {
  padding: 0.5rem 1rem;
  border: 2px solid var(--theme-color-light);
  background-color: transparent;
  color: var(--theme-color-dark);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.tag-filter-button:hover {
  background-color: var(--theme-color-light-a);
}

.tag-filter-button.active {
  background-color: var(--theme-color-dark);
  color: var(--theme-color-contrast);
  border-color: var(--theme-color-dark);
}

.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 15vh;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.application-card {
  background-color: var(--theme-color-contrast);
  border: 1px solid var(--theme-color-lighter);
  border-radius: 8px;
  padding: 1.2rem;
  padding-bottom: 1rem;
  padding-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}
.application-card::-webkit-scrollbar {
  display: none;
}

.application-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--theme-color-light);
}

.application-header {
  margin-bottom: 1rem;
  text-align: left;
}

.application-name {
  color: var(--theme-color-dark);
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  font-weight: 600;
}

.application-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.application-tag {
  background-color: var(--theme-color-light-a);
  color: var(--theme-color-dark);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.application-lore {
  color: var(--theme-color-light);
  font-size: 0.95rem;
  line-height: 1.4;
  min-height: 1.4rem;
  text-align: right;
}

.application-route {
  color: var(--color-text-primary);
  font-size: 0.85rem;
  font-family: monospace;
  background-color: var(--theme-color-lighter-a);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  border-left: 3px solid var(--theme-color-light);
}

.directory-stats {
  text-align: center;
  color: var(--theme-color-light);
  font-size: 0.9rem;
  padding: 1rem;
  border-top: 1px solid var(--theme-color-lighter);
}

/* 标签特定颜色 */
.tag-customer-management {
  background-color: rgba(52, 152, 219, 0.2);
  color: #2980b9;
}

.tag-order-management {
  background-color: rgba(46, 204, 113, 0.2);
  color: #27ae60;
}

.tag-delivery-management {
  background-color: rgba(155, 89, 182, 0.2);
  color: #8e44ad;
}

.tag-financial-management {
  background-color: rgba(230, 126, 34, 0.2);
  color: #d35400;
}

.tag-chore {
  background-color: rgba(149, 165, 166, 0.2);
  color: #7f8c8d;
}

.spacer {
  flex-grow: 1;
}
</style>
