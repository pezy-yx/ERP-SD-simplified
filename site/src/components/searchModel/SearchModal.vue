<template>
  <div v-if="visible" class="search-modal-backdrop" @click="handleBackdropClick">
    <div class="search-modal" @click.stop>
      <!-- 弹窗头部 -->
      <div class="search-modal-header">
        <h3>{{ stage === 0 ? stage0Title : stage1Title }}</h3>
        <button class="close-button" @click="closeModal">
          <span>&times;</span>
        </button>
      </div>
      
      <!-- Stage 0: 搜索方式选择和参数输入 -->
      <div v-if="stage === 0" class="search-modal-body">
        <!-- 搜索方式选择顶栏 -->
        <div v-if="searchMethods.length > 1" class="search-method-selector">
          <div class="method-tabs">
            <div
              v-for="(method, index) in visibleMethods"
              :key="index"
              :class="['method-tab', { active: selectedMethodIndex === index }]"
              @click="selectedMethodIndex = index"
            >
              {{ method.name }}
            </div>
            <!-- 更多按钮 -->
            <div
              v-if="hasMoreMethods"
              class="method-tab more-tab"
              @click="showMoreMethods = !showMoreMethods"
            >
              ...
            </div>
          </div>

          <!-- 更多方法的下拉菜单 -->
          <div v-if="showMoreMethods && hasMoreMethods" class="more-methods-dropdown">
            <div
              v-for="(method, index) in hiddenMethods"
              :key="visibleMethodsCount + index"
              :class="['dropdown-item', { active: selectedMethodIndex === visibleMethodsCount + index }]"
              @click="selectHiddenMethod(visibleMethodsCount + index)"
            >
              {{ method.name }}
            </div>
          </div>
        </div>
        
        <!-- 参数输入区域 -->
        <div class="param-input-area">
          <ParamInput
            :varTree="currentMethod?.paramTree || null"
            @update="handleParamUpdate"
          />
        </div>
      </div>
      
      <!-- Stage 1: 搜索结果展示 -->
      <div v-if="stage === 1" class="search-modal-body">
        <div class="result-area">
          <VarBox
            v-if="resultTree"
            :tree="resultTree"
            :readonly="true"
          />
          <div v-else class="no-results">
            <p>暂无搜索结果</p>
          </div>
        </div>
      </div>
      
      <!-- 弹窗底部 -->
      <div class="search-modal-footer">
        <!-- Stage 0 底栏: Execute按钮 -->
        <template v-if="stage === 0">
          <button class="execute-button" @click="handleExecute">
            <svg class="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
            </svg>
            <!-- 执行搜索 -->
          </button>
        </template>
        
        <!-- Stage 1 底栏: 返回、取消、确认按钮 -->
        <template v-if="stage === 1">
          <button class="back-button" @click="handleBack">
            <svg class="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <!-- 返回 -->
          </button>
          <button class="cancel-button" @click="closeModal">
            <svg class="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <!-- 取消 -->
          </button>
          <button class="confirm-button" @click="handleConfirm">
            <svg class="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <!-- 确认 -->
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import VarBox from '@/components/varbox/VarBox.vue'
import ParamInput from './ParamInput.vue'
import { VarTree, createTreeFromConfig, cns, SearchMethod } from '@/utils/VarTree'
import { SearchService, SearchResponse } from '@/api/searchService'

// 定义props
const props = defineProps<{
  visible: boolean
  searchMethods: SearchMethod[]
}>()

// 定义emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', data: any): void
}>()

// 响应式数据
const stage = ref(0) // 0: 参数输入阶段, 1: 结果展示阶段
const selectedMethodIndex = ref(0)
const resultTree: VarTree = createTreeFromConfig(
      cns('dynamiclist', 'list', 'searchResults', [], false, {}, [], 'Results')
    )
const showMoreMethods = ref(false)
const visibleMethodsCount = ref(3) // 最多显示3个方法标签

// 计算属性
const currentMethod = computed(() => {
  return props.searchMethods[selectedMethodIndex.value] || null
})

// 可见的搜索方法
const visibleMethods = computed(() => {
  return props.searchMethods.slice(0, visibleMethodsCount.value)
})

// 隐藏的搜索方法
const hiddenMethods = computed(() => {
  return props.searchMethods.slice(visibleMethodsCount.value)
})

// 是否有更多方法
const hasMoreMethods = computed(() => {
  return props.searchMethods.length > visibleMethodsCount.value
})

const stage0Title = computed(() => {
  return props.searchMethods.length === 1 ? currentMethod.value.name : 'Search'
})

const stage1Title = computed(() => {
  return 'Search Result'
})

// 监听visible变化，重置状态
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    stage.value = 0
    selectedMethodIndex.value = 0
    
    // 如果只有一个搜索方法且无需参数，直接进入stage 1并执行搜索
    if (props.searchMethods.length === 1 && !props.searchMethods[0].paramTree) {
      handleExecute()
    }
  }
})

// 处理参数更新
function handleParamUpdate(payload: any) {
  console.log(payload.value)
}

// 执行搜索
async function handleExecute() {
  if (!currentMethod.value) return

  try {
    // 获取搜索参数
    const searchParams = currentMethod.value.paramTree?.root?.currentValue || {}

    console.log('执行搜索:', {
      method: currentMethod.value.name,
      params: searchParams,
      url: currentMethod.value.serviceUrl
    })

    // 调用真实的后端API
    const response: SearchResponse = await SearchService.executeSearch(
      currentMethod.value,
      searchParams
    )

    if (response.success && response.data) {
      // 将后端返回的数据转换为VarTree格式
      const resultNodes = response.data.map((item, index) => {
        return cns('dict', 'dict', `result${index + 1}`, {}, false, { selected: false }, [
          cns('string', 'leaf', 'id', item.id, true, {}, [], 'ID'),
          cns('string', 'leaf', 'result', item.result, true, {}, [], '结果'),
          cns('string', 'leaf', 'description', item.description, true, {}, [], '描述'),
          // 添加其他字段
          ...Object.entries(item).filter(([key]) => !['id', 'result', 'description'].includes(key))
            .map(([key, value]) => cns('string', 'leaf', key, String(value), true, {}, [], key))
        ])
      })

      const searchResultTree = createTreeFromConfig(
        cns('dynamiclist', 'list', 'searchResults', [], false, {}, resultNodes,
          `搜索结果 (${response.total}条) - ${response.message || ''}`)
      )

      resultTree.setRoot(searchResultTree.root)
      stage.value = 1
    } else {
      // 处理搜索失败的情况
      console.error('搜索失败:', response.message || response.error)

      const errorResultTree = createTreeFromConfig(
        cns('dynamiclist', 'list', 'searchResults', [], false, {}, [
          cns('dict', 'dict', 'error', {}, false, {}, [
            cns('string', 'leaf', 'message', response.message || '搜索失败', true, {}, [], '错误信息'),
            cns('string', 'leaf', 'error', response.error || '未知错误', true, {}, [], '错误详情')
          ])
        ], '搜索失败')
      )

      resultTree.setRoot(errorResultTree.root)
      stage.value = 1
    }

  } catch (error) {
    console.error('搜索执行失败:', error)

    // 创建错误结果树
    const errorResultTree = createTreeFromConfig(
      cns('dynamiclist', 'list', 'searchResults', [], false, {}, [
        cns('dict', 'dict', 'error', {}, false, {}, [
          cns('string', 'leaf', 'message', '网络请求失败', true, {}, [], '错误信息'),
          cns('string', 'leaf', 'error', error instanceof Error ? error.message : '未知错误', true, {}, [], '错误详情')
        ])
      ], '搜索异常')
    )

    resultTree.setRoot(errorResultTree.root)
    stage.value = 1
  }
}

// 返回到参数输入阶段
function handleBack() {
  stage.value = 0
}

// 关闭弹窗
function closeModal() {
  emit('close')
}

// 确认操作
function handleConfirm() {
  const result = {
    method: currentMethod.value,
    params: currentMethod.value.paramTree?.root?.currentValue,
    results: resultTree.root?.currentValue,
    selectedResults: resultTree.root?.children.filter(child => child.config.selected).map(child => child.currentValue),
    firstSelectedResult: resultTree.root?.children.find(child => child.config.selected)?.currentValue,
  }
  emit('confirm', result)
  closeModal()
}

// 点击背景关闭弹窗
function handleBackdropClick() {
  closeModal()
}

// 选择隐藏的搜索方法
function selectHiddenMethod(index: number) {
  selectedMethodIndex.value = index
  showMoreMethods.value = false
}

// 设置搜索结果（供父组件调用）
function setSearchResults(results: VarTree) {
  resultTree.setRoot(results.root)
  stage.value = 1
}

// 暴露方法给父组件
defineExpose({
  setSearchResults
})
</script>

<style scoped>
.search-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.search-modal {
  width: 33vw;
  height: 42vh;
  background-color: var(--theme-color-page);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 400px;
  min-height: 300px;
  border: 2px solid var(--theme-color-dark);
}

.search-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 20px;
  border-bottom: 1px solid var(--theme-color-light);
  background-color: var(--theme-color-dark);
}

.search-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--theme-color-contrast);
  font-family: var(--theme-font-family);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--theme-color-contrast);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: var(--theme-color-lighter);
  color: var(--theme-color-dark);
}

.search-modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--theme-color-page);
  display: flex;
  flex-direction: column;
}

.search-method-selector {
  margin-bottom: 20px;
  position: relative;
}

.method-tabs {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--theme-color-light);
  gap: 0;
}

.method-tab {
  padding: 12px 20px;
  cursor: pointer;
  font-family: var(--theme-font-family);
  font-size: 14px;
  color: var(--color-text-primary);
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}

.method-tab:hover {
  color: var(--theme-color-dark);
  background-color: var(--theme-color-lighter);
}

.method-tab.active {
  color: var(--theme-color-dark);
  border-bottom-color: var(--theme-color-dark);
  border-bottom-width: 3px;
  font-weight: 600;
}

.more-tab {
  font-weight: bold;
  color: var(--theme-color-light);
}

.more-tab:hover {
  color: var(--theme-color-dark);
}

.more-methods-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--theme-color-page);
  border: 1px solid var(--theme-color-light);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 150px;
}

.dropdown-item {
  padding: 10px 16px;
  cursor: pointer;
  font-family: var(--theme-font-family);
  font-size: 14px;
  color: var(--color-text-primary);
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--theme-color-lighter);
}

.dropdown-item.active {
  background-color: var(--theme-color-light);
  color: var(--theme-color-contrast);
  font-weight: 600;
}

.param-input-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.result-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.no-results p {
  margin: 0;
  color: #666;
  font-size: 16px;
  font-family: var(--theme-font-family);
}

.search-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 8px;
  border-top: 1px solid var(--theme-color-light);
  background-color: var(--theme-color-lighter);
}

.execute-button,
.back-button,
.cancel-button,
.confirm-button {
  padding: 8px 12px;
  border: 1px solid var(--theme-color-dark);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-family: var(--theme-font-family);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.button-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.execute-button {
  background-color: var(--theme-color-execute-button);
  color: var(--theme-color-contrast);
  border-color: var(--theme-color-execute-button);
}

.execute-button:hover {
  background-color: var(--theme-color-execute-button-hover);
  border-color: var(--theme-color-execute-button-hover);
}

.execute-button:active {
  background-color: var(--theme-color-execute-button-active);
  border-color: var(--theme-color-execute-button-active);
}

.back-button {
  background-color: var(--btn-default-bg);
  color: var(--btn-default-text);
  border-color: var(--theme-color-dark);
}

.back-button:hover {
  background-color: var(--btn-hover-bg);
  color: var(--btn-hover-text);
  border-color: var(--theme-color-dark);
}

.cancel-button {
  background-color: var(--btn-default-bg);
  color: var(--btn-default-text);
  border-color: var(--theme-color-dark);
}

.cancel-button:hover {
  background-color: var(--btn-hover-bg);
  color: var(--btn-hover-text);
  border-color: var(--theme-color-dark);
}

.cancel-button:active {
  background-color: var(--btn-active-bg);
  color: var(--btn-active-text);
  border-color: var(--theme-color-dark);
}

.confirm-button {
  background-color: var(--theme-color-dark);
  color: var(--theme-color-contrast);
  border-color: var(--theme-color-dark);
}

.confirm-button:hover {
  background-color: var(--theme-color-light);
  border-color: var(--theme-color-darker);
}

.confirm-button:active {
  background-color: var(--theme-color-lighter);
  border-color: var(--theme-color-darker);
}
</style>