<template>
  <div class="search-test-page">
    <h1>SearchModal 测试页面</h1>
    
    <div class="test-section">
      <h2>测试搜索功能</h2>
      
      <!-- 测试1: 带搜索功能的输入框 -->
      <div class="test-item">
        <h3>1. 带搜索功能的输入框</h3>
        <VarBox
          :tree="testTreeWithSearch"
          @update="handleUpdate"
        />
        <div class="result-preview" :key="forceUpdateKey">
          <strong>当前值：</strong>{{ JSON.stringify(testTreeWithSearch.root?.currentValue) }}
        </div>
      </div>
      
      <!-- 测试2: 不带搜索功能的输入框 -->
      <div class="test-item">
        <h3>2. 不带搜索功能的输入框（无searchMethods配置）</h3>
        <VarBox
          :tree="testTreeWithoutSearch"
          @update="handleUpdate"
        />
        <div class="result-preview" :key="forceUpdateKey">
          <strong>当前值：</strong>{{ JSON.stringify(testTreeWithoutSearch.root?.currentValue) }}
        </div>
      </div>
      
      <!-- 测试3: 多种搜索方式 -->
      <div class="test-item">
        <h3>3. 多种搜索方式的输入框</h3>
        <VarBox
          :tree="testTreeMultiSearch"
          @update="handleUpdate"
        />
        <div class="result-preview" :key="forceUpdateKey">
          <strong>当前值：</strong>{{ JSON.stringify(testTreeMultiSearch.root?.currentValue) }}
        </div>
      </div>

      <!-- 测试4: 自定义搜索结果处理 -->
      <div class="test-item">
        <h3>4. 自定义搜索结果处理的输入框</h3>
        <VarBox
          :tree="testTreeCustomHandler"
          @update="handleUpdate"
        />
        <div class="result-preview" :key="forceUpdateKey">
          <strong>当前值：</strong>{{ JSON.stringify(testTreeCustomHandler.root?.currentValue) }}
        </div>
        <div class="custom-handler-log">
          <strong>自定义处理日志：</strong>
          <div v-for="(log, index) in customHandlerLogs" :key="index" class="log-item">
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import VarBox from '@/components/varbox/VarBox.vue'
import { VarTree, createTreeFromConfig, cns, SearchMethod, SearchResultHandler } from '@/utils/VarTree'


const forceUpdateKey = ref(0)
const forceUpdate = () => {
  forceUpdateKey.value++
}

// 自定义处理日志
const customHandlerLogs = ref<string[]>([])

// 自定义搜索结果处理函数
const customSearchResultHandler: SearchResultHandler = (data, currentNode) => {
  const timestamp = new Date().toLocaleTimeString()
  customHandlerLogs.value.push(`[${timestamp}] 搜索方法: ${data.method.name}`)
  customHandlerLogs.value.push(`[${timestamp}] 参数: ${JSON.stringify(data.params)}`)
  customHandlerLogs.value.push(`[${timestamp}] 选中结果数量: ${data.selectedResults.length}`)

  if (data.firstSelectedResult) {
    customHandlerLogs.value.push(`[${timestamp}] 第一个选中结果: ${JSON.stringify(data.firstSelectedResult)}`)

    // 自定义逻辑：将结果的 name 字段设置为当前节点的值
    if (data.firstSelectedResult.name) {
      currentNode.currentValue = `自定义处理: ${data.firstSelectedResult.name}`
      customHandlerLogs.value.push(`[${timestamp}] 设置节点值为: ${currentNode.currentValue}`)
    }
  }

  // 限制日志数量
  if (customHandlerLogs.value.length > 10) {
    customHandlerLogs.value = customHandlerLogs.value.slice(-10)
  }
}

// 创建搜索方法配置
const createSearchMethods = (): SearchMethod[] => [
  {
    name: '简单搜索',
    paramTree: null,
    serviceUrl: '/api/search/simple'
  },
  {
    name: '高级搜索',
    paramTree: createTreeFromConfig(
      cns('dict', 'dict', 'searchParams', {}, false, {}, [
        cns('string', 'leaf', 'keyword', '', false, {}, [], '关键词'),
        cns('string', 'leaf', 'category', '', false, {}, [], '分类'),
        cns('date', 'leaf', 'startDate', null, false, {}, [], '开始日期'),
        cns('date', 'leaf', 'endDate', null, false, {}, [], '结束日期'),
        cns('boolean', 'leaf', 'strict', null, false, {}, [], '完全匹配'),
      ], '搜索参数')
    ) as VarTree,
    serviceUrl: '/api/search/advanced'
  }
]

const createMultiSearchMethods = (): SearchMethod[] => [
  {
    name: '快速搜索',
    paramTree: null,
    serviceUrl: '/api/search/quick'
  },
  {
    name: '精确搜索',
    paramTree: createTreeFromConfig(
      cns('dict', 'dict', 'exactParams', {}, false, {}, [
        cns('string', 'leaf', 'id', '', false, {}, [], 'ID'),
        cns('string', 'leaf', 'code', '', false, {}, [], '编码')
      ], '精确搜索参数')
    ) as VarTree,
    serviceUrl: '/api/search/exact'
  },
  {
    name: '模糊搜索',
    paramTree: createTreeFromConfig(
      cns('dict', 'dict', 'fuzzyParams', {}, false, {}, [
        cns('string', 'leaf', 'text', '', false, {}, [], '搜索文本'),
        cns('number', 'leaf', 'similarity', 0.8, false, {}, [], '相似度阈值')
      ], '模糊搜索参数')
    ) as VarTree,
    serviceUrl: '/api/search/fuzzy'
  }
]

// 测试1: 带搜索功能的VarTree
const testTreeWithSearch = createTreeFromConfig(
  cns('dict', 'dict', 'testData', {}, false, {}, [
    cns('string', 'leaf', 'searchField', '', false, {
      searchMethods: createSearchMethods()
    }, [], '带搜索的字段')
  ], '测试数据')
)

// 测试2: 不带搜索功能的VarTree
const testTreeWithoutSearch = createTreeFromConfig(
  cns('dict', 'dict', 'testData', {}, false, {}, [
    cns('string', 'leaf', 'normalField', '', false, {}, [], '普通字段')
  ], '测试数据')
)

// 测试3: 多种搜索方式的VarTree
const testTreeMultiSearch = createTreeFromConfig(
  cns('dict', 'dict', 'testData', {}, false, {}, [
    cns('string', 'leaf', 'multiSearchField', '', false, {
      searchMethods: createMultiSearchMethods()
    }, [], '多搜索方式字段')
  ], '测试数据')
)

// 测试4: 自定义搜索结果处理的VarTree
const testTreeCustomHandler = createTreeFromConfig(
  cns('dict', 'dict', 'testData', {}, false, {}, [
    cns('string', 'leaf', 'customHandlerField', '', false, {
      searchMethods: createSearchMethods(),
      customSearchResultHandler: customSearchResultHandler
    }, [], '自定义处理字段')
  ], '测试数据')
)

// 处理VarBox更新
function handleUpdate(payload: any) {
  console.log('VarBox更新:', payload)
  forceUpdate()
}
</script>

<style scoped>
.search-test-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 40px;
}

.test-item {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.test-item h3 {
  margin-top: 0;
  color: #333;
}

.result-preview {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

h1 {
  color: var(--theme-color-dark);
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: var(--theme-color-light);
  border-bottom: 2px solid var(--theme-color-light);
  padding-bottom: 10px;
}

.custom-handler-log {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid var(--theme-color-dark);
}

.log-item {
  font-family: monospace;
  font-size: 12px;
  color: #666;
  margin: 2px 0;
  padding: 2px 0;
  border-bottom: 1px solid #eee;
}
</style>