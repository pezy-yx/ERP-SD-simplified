<template>
    <AppContent
        :stages="['home']"
        :hideBottomBar="true"
    >
        <template #stage-home>
            <!-- 分类 + 用户自定义栏 -->
            <div class="app-categories" @click.self="exitDeleteMode" :class="{ 'scroll-mode': needsScroll }" ref="categoriesContainer">
              <!-- 默认四个栏（不可整体删除，内置应用不可删除，但可新增自定义应用） -->
              <div v-for="categoryNode in appCategories" :key="categoryNode.name" class="app-category">
                <div class="app-category-header">
                  <h3>{{ categoryNode.name }}</h3>
                </div>
                <div class="app-list">
                  <!-- 内置应用（不可删除、不可拖动，且默认四栏不允许添加APP与拖拽） -->
                  <div
                    v-for="(app, idx) in categoryNode.children"
                    :key="`builtin-${app.name}`"
                    class="single-app-wrapper"
                    :class="{ wiggle: isDeleteMode }"
                    @click="onAppClick($event, '', -1, $event)"
                    @mousedown="startLongPress()"
                    @mouseup="cancelLongPress()"
                    @mouseleave="cancelLongPress()"
                  >
                    <SingleApp
                      :pageName="app.name"
                      :pagePath="isDeleteMode ? '' : `/application/${app.name.toLowerCase().replace(/\s/g, '-')}`"
                      :iconPath="app.iconPath"
                    />
                  </div>
                </div>
              </div>

              <!-- 用户自定义栏（整体可删除） -->
              <div v-for="bar in customBars" :key="bar.id" class="app-category">
                <div class="app-category-header">
                  <!-- 编辑模式下可重命名，否则显示标题 -->
                  <div class="bar-name-input-box"
                    v-if="isEditMode && editingBarId === bar.id"
                  >
                    <input
                      v-model="editingBarName"
                      @blur="finishRenameBar(bar.id)"
                      @keyup.enter="finishRenameBar(bar.id)"
                      @keyup.escape="cancelRenameBar()"
                      class="bar-name-input"
                      :ref="el => { if (el) barNameInputRef = el as HTMLInputElement }"
                    />
                  </div>
                  <div v-else class="bar-name-box">
                    <h3
                      @click="isEditMode ? startRenameBar(bar.id, bar.name) : null"
                      :class="{ 'editable-title': isEditMode, 'app-list-title':true }"
                    >
                      {{ bar.name }}
                    </h3>
                  </div>
                  <!-- 编辑模式下显示操作按钮 -->
                  <div v-if="isEditMode" class="bar-actions">
                    <button class="rename-btn" @click="startRenameBar(bar.id, bar.name)" title="重命名">✏️</button>
                    <button class="delete-bar-btn" @click="deleteCustomBar(bar.id)" title="删除该栏">🗑️</button>
                  </div>
                </div>
                <draggable
                  class="app-list"
                  :list="bar.apps"
                  group="apps"
                  :animation="300"
                  item-key="name"
                  :ghost-class="'sortable-ghost-hidden'"
                  @change="onDragChange(getUserBarKey(bar.id), $event)"
                  @start="onDragStart"
                  @end="onDragEnd"
                >
                  <template #item="{ element: app, index: idx }">
                    <div
                      class="single-app-wrapper"
                      :class="{ wiggle: isDeleteMode && !isDragging }"
                      @click="onAppClick($event,getUserBarKey(bar.id), idx, $event)"
                      @mousedown="startLongPress()"
                      @mouseup="cancelLongPress()"
                      @mouseleave="cancelLongPress()"
                    >
                      <SingleApp
                        :pageName="app.name"
                        :pagePath="isDeleteMode ? '' : app.pagePath"
                        :iconPath="app.iconPath"
                        class="single-app-card"
                      />
                      <!-- 编辑模式下显示右上角删除按钮 -->
                      <button
                        v-if="isEditMode"
                        class="delete-btn"
                        @click="handleDeleteClick(getUserBarKey(bar.id), idx, $event)"
                        @mousedown.stop
                        @touchstart.stop
                        title="删除应用"
                      >
                        ×
                      </button>
                    </div>
                  </template>

                  <template #footer>
                    <!-- 添加APP按钮 -->
                    <div v-if="isEditMode" class="add-app-tile" @click="openAppPicker(getUserBarKey(bar.id))">
                      + 添加APP
                    </div>
                  </template>
                </draggable>
              </div>

            </div>

            <!-- 固定定位的新增列按钮 -->
            <Teleport to="body">
              <div
                v-if="isEditMode && !showAppPicker"
                class="fixed-add-bar-btn"
                @click="addNewBar"
              >
                <span class="add-icon">+</span>
                <span class="add-text">新增一列</span>
              </div>
            </Teleport>



            <!-- 选择工作流（应用）弹窗 -->
            <teleport to="body">
              <div v-if="showAppPicker" class="app-picker-modal">
                <div class="app-picker-panel" @click.stop>
                  <div class="app-picker-header">
                    <h4>选择应用</h4>
                    <button class="close" @click="closeAppPicker()">×</button>
                  </div>
                  <input class="search-input" v-model="appSearchQuery" placeholder="按名称搜索..."/>
                  <div class="app-picker-grid">
                    <div v-for="app in filteredAvailableApps" :key="app.pagePath" class="app-option" @click="chooseApp(app)">
                      <span class="app-name">{{ app.name }}</span>
                      <span class="app-route">{{ app.pagePath }}</span>
                    </div>
                  </div>
                </div>
                <div class="app-picker-mask" @click="closeAppPicker()"></div>
              </div>
            </teleport>
        </template>
    </AppContent>
</template>

<script lang="ts" setup>
import SingleApp from '@/components/SingleApp.vue'; // 导入 SingleApp 组件
import draggable from 'vuedraggable'

import { createTreeFromConfig, cns } from '@/utils/VarTree'; // 导入 VarTree 相关的工具函数
import AppContent from '@/components/applicationContent/AppContent.vue'; // 导入 AppContent 组件

// 定义 VarTree 结构来管理应用类别和每个类别下的应用列表
const appTree = createTreeFromConfig({
    varType: 'dict', // 根节点类型
    nodeType: 'dict', // 根节点类型
    name: 'appCategories', // 根节点名称
    children: [
        // 客户管理类别
        cns('dict', 'dict', 'Customers', null, true, {}, [
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Maintain Business Partner',
                readonly: true,
                iconPath: '@/assets/icons/maintain-BP.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Create BP Relationship',
                readonly: true,
                iconPath: '@/assets/icons/create-BP-relationship.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Display BP Relationship',
                readonly: true,
                iconPath: '@/assets/icons/create-BP-relationship.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Change BP Relationship',
                readonly: true,
                iconPath: '@/assets/icons/create-BP-relationship.svg',
            },
        ], 'Customer Management'),

        //订单管理
        cns('dict', 'dict', 'Orders', null, true, {}, [
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Create Inquiry',
                readonly: true,
                iconPath: '@/assets/icons/create-inquiry.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Display Inquiry',
                readonly: true,
                iconPath: '@/assets/icons/create-inquiry.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Change Inquiry',
                readonly: true,
                iconPath: '@/assets/icons/create-inquiry.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Manage Sales Quotations',
                readonly: true,
                iconPath: '@/assets/icons/manage-sales-quotations.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Manage Sales Orders',
                readonly: true,
                iconPath: '@/assets/icons/manage-sales-orders.svg',
            },
        ], 'order management'),

        //物流管理
        cns('dict', 'dict', 'Logistics', null, true, {}, [
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Create Outbound Delivery',
                readonly: true,
                iconPath: '@/assets/icons/create-outbound-deliveries.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Pick Outbound Delivery',
                readonly: true,
                iconPath: '@/assets/icons/create-outbound-deliveries.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Manage Outbound Deliveries',
                readonly: true,
                iconPath: '@/assets/icons/manage-outbound-deliveries.svg',
            }
        ], 'logistics management'),

        //财务管理
        cns('dict', 'dict', 'Finance', null, true, {}, [
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Create Billing Document',
                readonly: true,
                iconPath: '@/assets/icons/create-billing-documents.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Display Billing Document',
                readonly: true,
                iconPath: '@/assets/icons/create-billing-documents.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Change Billing Document',
                readonly: true,
                iconPath: '@/assets/icons/create-billing-documents.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Posting Incoming Payments',
                readonly: true,
                iconPath: '@/assets/icons/posting-incoming-payments.svg',
            },
            {
                varType: 'string',
                nodeType: "leaf",
                name: 'Material Documents Overview',
                readonly: true,
                iconPath: '@/assets/icons/material-documents-overview.svg',
            }
        ], 'finance management'),

        // //库存管理
        // cns('dict', 'dict', 'Stock', null, true, {}, [
        //     {
        //         varType: 'string',
        //         nodeType: "leaf",
        //         name: 'Display Stock',
        //         readonly: true,
        //         iconPath: '@/assets/icons/material-documents-overview.svg',
        //     }
        // ], 'stock management'),
    ]
});
console.log('应用树结构:', appTree.getRoot()?.children);
// 计算属性，用于在模板中方便地遍历所有类别节点
const appCategories = computed(() => appTree.getRoot()?.children);


// —— 自定义栏与应用：状态、持久化与交互 ——
import { ref, onMounted, computed, nextTick, onUnmounted, watch } from 'vue'

type CustomApp = { name: string; pagePath: string; iconPath?: string }
type UserBar = { id: string; name: string; apps: CustomApp[] }

const isEditMode = ref(false)
const isDeleteMode = computed(() => isEditMode.value) // 删除模式与编辑模式绑定

// 重命名栏相关状态
const editingBarId = ref<string | null>(null)
const editingBarName = ref('')
const barNameInputRef = ref<HTMLInputElement | null>(null)
// 智能布局：判断是否需要滚动
const categoriesContainer = ref<HTMLElement | null>(null)
const needsScroll = ref(false)
const isDragging = ref(false)

// 计算是否需要滚动模式
function checkScrollNeeded() {
  if (!categoriesContainer.value) return

  const container = categoriesContainer.value
  const containerWidth = container.clientWidth

  // 计算所有栏的总宽度
  const totalBars = (appCategories.value?.length || 0) + customBars.value.length
  const barWidth = 280 // 每个栏的固定宽度
  const gap = 10 // 栏之间的间距
  const totalContentWidth = totalBars * barWidth + (totalBars - 1) * gap

  needsScroll.value = totalContentWidth > containerWidth
}

const STORAGE_KEY = 'HOME_CUSTOM_LAYOUT_V1'
const defaultCustomApps = ref<Record<string, CustomApp[]>>({}) // key: default:<CategoryName>
const customBars = ref<UserBar[]>([])

// 监听相关变化
watch([customBars, isEditMode], () => {
  nextTick(() => checkScrollNeeded())
}, { deep: true })

// ResizeObserver 监听容器尺寸变化
let resizeObserver: ResizeObserver | null = null

function getDefaultBarKey(name: string) { return `default:${name}` }
function getUserBarKey(id: string) { return `user:${id}` }


function saveLayout() {
  const payload = {
    defaultBars: defaultCustomApps.value,
    userBars: customBars.value,
    isEditMode: isEditMode.value
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

function loadLayout() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (parsed?.defaultBars) defaultCustomApps.value = parsed.defaultBars
    if (parsed?.userBars) customBars.value = parsed.userBars
    if (typeof parsed?.isEditMode === 'boolean') isEditMode.value = parsed.isEditMode
  } catch (e) {
    console.warn('加载自定义布局失败:', e)
  }
}

// 可选应用列表（来源于默认树的叶子）
const availableApps = computed<CustomApp[]>(() => {
  const arr: CustomApp[] = []
  const cats: any[] = (appTree.getRoot()?.children || []) as any[]
  cats.forEach((cat: any) => {
    ;(cat?.children || []).forEach((leaf: any) => {
      const nameStr = String(leaf?.name || '')
      arr.push({
        name: nameStr,
        pagePath: `/application/${nameStr.toLowerCase().replace(/\s/g, '-')}`,
        iconPath: leaf?.iconPath,
      })
    })
  })
  return arr
})

// 选择应用弹窗
const showAppPicker = ref(false)
const appSearchQuery = ref('')
const appPickerTargetKey = ref<string | null>(null)

const filteredAvailableApps = computed(() => {
  const q = appSearchQuery.value.trim().toLowerCase()
  if (!q) return availableApps.value
  return availableApps.value.filter(a => a.name.toLowerCase().includes(q) || a.pagePath.toLowerCase().includes(q))
})

function openAppPicker(targetKey: string) {
  appPickerTargetKey.value = targetKey
  showAppPicker.value = true
}
function closeAppPicker() {
  showAppPicker.value = false
  appSearchQuery.value = ''
  appPickerTargetKey.value = null
}
function chooseApp(app: CustomApp) {
  const key = appPickerTargetKey.value
  if (!key) return
  if (key.startsWith('default:')) {
    const list = defaultCustomApps.value[key] || []
    list.push(app)
    defaultCustomApps.value = { ...defaultCustomApps.value, [key]: list }
  } else {
    const id = key.split(':')[1]
    const bar = customBars.value.find(b => b.id === id)
    if (bar) bar.apps.push(app)
  }
  saveLayout()
  closeAppPicker()
}

// 删除 & 新建
function deleteCustomApp(listKey: string, idx: number) {
  // 默认分类栏（default:CategoryName）
  if (listKey.startsWith('default:')) {
    const original = defaultCustomApps.value[listKey] || []
    const next = original.filter((_, i) => i !== idx)
    defaultCustomApps.value = { ...defaultCustomApps.value, [listKey]: next }
  } else {
    // 用户自定义栏（user:<id>）
    const id = listKey.split(':')[1]
    const barIndex = customBars.value.findIndex(b => b.id === id)
    if (barIndex !== -1) {
      const bar = customBars.value[barIndex]
      const nextBar = { ...bar, apps: bar.apps.filter((_, i) => i !== idx) }
      customBars.value = [
        ...customBars.value.slice(0, barIndex),
        nextBar,
        ...customBars.value.slice(barIndex + 1)
      ]
    }
  }
  saveLayout()
}
function deleteCustomBar(barId: string) {
  customBars.value = customBars.value.filter(b => b.id !== barId)
  saveLayout()
}
function addNewBar() {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  const newBarName = `自定义栏 ${customBars.value.length + 1}`
  customBars.value.push({ id, name: newBarName, apps: [] })
  // 新增栏后自动进入重命名模式
  nextTick(() => {
    startRenameBar(id, newBarName)
  })
  saveLayout()
}
// 重命名栏功能
function startRenameBar(barId: string, currentName: string) {
  editingBarId.value = barId
  editingBarName.value = currentName
  // 下一帧聚焦输入框
  nextTick(() => {
    barNameInputRef.value?.focus()
    barNameInputRef.value?.select()
  })
}

function finishRenameBar(barId: string) {
  const newName = editingBarName.value.trim()
  if (newName && newName !== '') {
    const bar = customBars.value.find(b => b.id === barId)
    if (bar) {
      bar.name = newName
      saveLayout()
    }
  }
  editingBarId.value = null
  editingBarName.value = ''
}

function cancelRenameBar() {
  editingBarId.value = null
  editingBarName.value = ''
}



// vuedraggable 拖拽函数
function onDragStart() {
  isDragging.value = true
}

function onDragEnd() {
  isDragging.value = false
}

function onDragChange(barKey: string, event: any) {
  // vuedraggable 会自动更新 list，我们只需要保存布局
  saveLayout()
}

function handleDeleteClick(listKey: string, idx: number, event: MouseEvent) {
  console.log('删除按钮被点击:', listKey, idx, event.target)
  event.stopPropagation()
  event.preventDefault()
  deleteCustomApp(listKey, idx)
}

function deleteCustomAppWithAnimation(listKey: string, idx: number) {
  deleteCustomApp(listKey, idx)
}

// 长按进入删除模式
let longPressTimer: number | null = null
function startLongPress() {
  cancelLongPress()
  longPressTimer = window.setTimeout(() => { isEditMode.value = true }, 600)
}
function cancelLongPress() { if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null } }

onMounted(() => {
  loadLayout()

  // 初始检查
  nextTick(() => checkScrollNeeded())

  // 设置 ResizeObserver 监听容器尺寸变化
  if (categoriesContainer.value && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      checkScrollNeeded()
    })
    resizeObserver.observe(categoriesContainer.value)
  }

  // 监听窗口尺寸变化（兜底方案）
  window.addEventListener('resize', checkScrollNeeded)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  window.removeEventListener('resize', checkScrollNeeded)
})

// 监听来自父容器的“打开编辑面板”事件
onMounted(() => {
  const c = document.getElementById('application-content')
  const handler = () => {
    isEditMode.value = !isEditMode.value
    saveLayout()
  }
  c?.addEventListener('home-edit-panel-open', handler as EventListener)
})




// 阻止删除模式或长按触发后的点击进入APP（用于捕获单击）
function onAppClick(e: MouseEvent, listKey: string, idx: number, event: MouseEvent) {
  console.log('应用被点击，目标元素:', e.target)

  // 如果点击的是删除按钮，不处理（删除按钮有自己的事件处理）
  const target = e.target as HTMLElement
  if (target?.classList.contains('delete-btn') || target?.closest('.delete-btn')) {
    console.log('点击了删除按钮，不处理应用点击')
    return
  }

  if ( isEditMode.value && target?.classList.contains('single-app-wrapper')) {
    handleDeleteClick(listKey, idx, event)
    return
  }

  // 如果有长按计时器，说明正在长按过程中，阻止点击
  if (longPressTimer !== null) {
    console.log('长按过程中，阻止点击')
    e.stopPropagation()
    e.preventDefault()
    return
  }

  // 正常情况下，允许点击进入应用（默认行为）
  // 删除模式下 SingleApp 没有 pagePath，所以不会触发路由跳转
  console.log('正常点击，允许进入应用')
}

// 点击空白处退出编辑模式（同时退出删除模式）
function exitDeleteMode() {
  if (isEditMode.value) {
    isEditMode.value = false
    saveLayout()
  }
}

// -- END NEW CONTENT --

// Home 页面现在作为 Application 的子路由，标题由 Application 组件管理


</script>

<style scoped>
.home-page-layout {
    width: 100%;
    min-height: 100vh;
    height: 100vh;
    max-height: 100vh;
    background-color: var(--theme-color-dark);
    display: flex; /* 让导航栏和内容区能够垂直排列 */
    flex-direction: column;
}

.home-content{
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* 让 home-content 占据除了导航栏外的所有可用垂直空间 */
    background-color: var(--theme-color-dark);
    width: 100%;
    padding: 20px; /* 为内容添加整体内边距 */
    box-sizing: border-box; /* 确保 padding 不会增加总宽度 */
    overflow-y: auto; /* 当内容超出时允许垂直滚动 */
}

.horizontal-line {
  height: 2px; /* 横线高度 */
  background-color: rgba(255, 255, 255, 0.3); /* 白色半透明横线 */
  margin: 0 0 20px 0; /* 仅在底部留白，因为 home-content 已经有左右 padding */
}

.app-dashboard-container {
  padding-top: 20px; /* 与上方横线和页面标题的间距 */
  flex-grow: 1; /* 让仪表盘容器占据剩余空间 */
  background-color: var(--theme-color-page);
  border-radius: 10px;
}

h2 {
    font-size: 2em;
    margin-bottom: 30px;
    text-align: center;
    color: var(--theme-color-text); /* 主要文字颜色，假设已全局定义 */
}

.app-categories {
    padding: 0 50px;
    display: flex;
    flex-wrap: nowrap; /* 不允许换行，保持一行 */
    gap: 5px; /* 各个分类容器之间的间距 */
    align-items: flex-start; /* 确保所有分类从顶部对齐 */
    min-height: auto;
    justify-content: center; /* 默认居中 */
    overflow-x: visible; /* 默认不滚动 */
    overflow-y: auto;
    padding-bottom: 10px;
    transition: justify-content 0.3s ease; /* 平滑过渡 */
}
.app-categories::-webkit-scrollbar { display: none; }

/* 滚动模式：左对齐 + 水平滚动 */
.app-categories.scroll-mode {
    justify-content: flex-start; /* 左对齐 */
    overflow-x: auto; /* 开启水平滚动 */
}
/* 自定义滚动条样式（仅在滚动模式下显示） */
.app-categories.scroll-mode::-webkit-scrollbar {
  height: 8px;
}
.app-categories.scroll-mode::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.app-categories.scroll-mode::-webkit-scrollbar-thumb {
  background: var(--theme-color-light);
  border-radius: 4px;
}
.app-categories.scroll-mode::-webkit-scrollbar-thumb:hover {
  background: var(--theme-color-dark);
}

.app-category {
    padding-top: 25px;
    padding-bottom: 25px;
    display: flex;
    flex-direction: column; /* 分类内的应用 (SingleApp) 竖向排列 */
    gap: 15px; /* 分类内各个 SingleApp 之间的间距 */
    min-width: 280px; /* 确保每个分类有最小宽度 */
    width: 280px; /* 固定宽度，防止压缩 */
    flex-shrink: 0; /* 防止容器被压缩 */
    min-height: auto;
}

h3 {
    font-size: 1.5em;
    color: var(--theme-color-dark); /* 分类标题的颜色 */
    text-align: center;
    padding-bottom: 10px;
}

.app-list {
    display: flex;
    flex-direction: column; /* 应用列表（SingleApp 集合）竖向排列 */
    gap: 25px; /* 列表内各个 SingleApp 之间的间距 */
}

/* 默认图标样式，确保它在 SingleApp 内部的 icon 插槽中正确显示 */
.default-icon {
    width: 100%; /* 填充 SingleApp 的图标容器 */
    height: 100%;
    object-fit: contain; /* 保持图片比例 */
    filter: grayscale(100%) brightness(150%); /* 示例：默认图标可以灰度化并提亮 */
}

/* 自定义栏标题区域 */
.app-category-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; max-width: 80%; }

/* 栏名称输入框 */
.bar-name-input {
  background: var(--theme-color-page);
  border: 2px solid var(--theme-color-dark);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 1.2em;
  font-weight: bold;
  color: var(--theme-color-dark);
  outline: none;
  flex: 1;
  white-space: nowrap;
}

.bar-name-input-box {
  overflow-x: scroll;
  max-width: 50%;
}
.bar-name-box {
  overflow-x: scroll;
  max-width: 100%;
}
.bar-name-input-box::-webkit-scrollbar,
.bar-name-box::-webkit-scrollbar {
  display: none;
}

/* 可编辑标题样式 */
.app-list-title {
  white-space: nowrap;
}
.editable-title {
  cursor: pointer;
  transition: color 0.2s;
}
.editable-title:hover {
  color: var(--theme-color-light);
}

/* 栏操作按钮组 */
.bar-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.rename-btn, .delete-bar-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.rename-btn:hover {
  background: rgba(0, 123, 255, 0.1);
}

.delete-bar-btn:hover {
  background: rgba(220, 53, 69, 0.1);
}
.delete-bar-btn { background: #b00020; color: #fff; border: none; border-radius: 4px; height: 26px; padding: 0 8px; cursor: pointer; }

/* 单个应用容器 + 删除遮罩 + 抖动动画 */
.single-app-wrapper { position: relative; width: 90%; display: flex; justify-content: start; margin: 0; padding: 0; }
/* 右上角删除按钮 */
.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
  opacity: 0.5;
}

.delete-btn:hover {
  opacity: 0.75;
  background: #ff3742;
  transform: scale(1.1);
  box-shadow: 0 4px 12px var(--theme-color-dark);
}

.delete-btn:active {
  background: #ff2f3a;
  transform: scale(0.95);
}
@keyframes wiggle { 0% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } 100% { transform: rotate(-1deg); } }
.wiggle { animation: wiggle 0.2s infinite; }
.wiggle > * { transition: all 0.2s;  }

.wiggle:hover .single-app-card { scale:1.05;}


/* 添加APP虚线框 */
.add-app-tile { width: 90%; height: 180px; border: 2px dashed var(--theme-color-light); color: var(--theme-color-light); border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0.3; transition: all 0.2s; }
.add-app-tile:hover { opacity: 1; }



/* 应用选择器 */
.app-picker-modal { position: fixed; inset: 0; z-index: 1000; }
.app-picker-mask { position: absolute; inset: 0; background: rgba(0,0,0,0.35); }
.app-picker-panel { position: absolute; right: 0; top: var(--nav-height, 48px); height: calc(100vh - var(--nav-height, 48px)); width: 520px; background: var(--theme-color-page); box-shadow: -4px 0 16px rgba(0,0,0,0.25); padding: 14px; overflow: hidden; z-index: 1001; }
.app-picker-header { display: flex; align-items: center; justify-content: space-between; }
.app-picker-header .close { background: transparent; border: none; font-size: 22px; color: var(--theme-color-dark); cursor: pointer; }
.search-input { width: 100%; height: 32px; padding: 0 8px; margin: 10px 0; border-radius: 6px; border: 1px solid var(--theme-color-lighter); background: #fff; color: #333; }
.app-picker-grid { height: calc(100% - 90px); overflow: auto; display: grid; grid-template-columns: 1fr; gap: 8px; }
.app-option { display: flex; align-items: center; justify-content: space-between; padding: 10px; border: 1px solid var(--theme-color-lighter); border-radius: 6px; background: var(--theme-color-contrast); cursor: pointer; }
.app-option:hover { background: var(--theme-color-light-a); }
.app-name { color: var(--theme-color-dark); font-weight: 600; }
.app-route { color: var(--theme-color-light); font-size: 12px; }

.page-content {
    padding: 0;
}
:deep(.bottom-bar-spacing-block) {
    display: none;
}

/* vuedraggable 拖拽样式 */
.sortable-ghost-hidden {
  opacity: 0 !important;
  visibility: hidden !important;
}

.sortable-chosen {
  cursor: grabbing !important;
  transform: rotate(2deg) scale(1.05);
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.sortable-drag {
  opacity: 0.8;
  transform: rotate(2deg) scale(1.05);
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* 拖拽时隐藏删除按钮 */
.single-app-wrapper.sortable-chosen .delete-btn {
  opacity: 0;
  pointer-events: none;
}

/* 固定定位的新增列按钮 */
.fixed-add-bar-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: var(--theme-color-dark);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.fixed-add-bar-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  background: var(--theme-color-light);
}

.fixed-add-bar-btn .add-icon {
  font-size: 24px;
  color: white;
  font-weight: bold;
  line-height: 1;
}

.fixed-add-bar-btn .add-text {
  font-size: 10px;
  color: white;
  margin-top: 2px;
  white-space: nowrap;
}
</style>