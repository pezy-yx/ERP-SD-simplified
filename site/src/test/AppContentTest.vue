<template>
  <div class="page-content">
    <h1>AppContent组件测试</h1>
    
    <!-- 基本功能测试 -->
    <div class="test-section">
      <h2>基本Stage管理功能测试</h2>
      <div class="test-container">
        <AppContent
          ref="appContentRef"
          :stages="['参数输入', '数据处理', '结果确认']"
          :footer-config="[
            { nextText: '开始处理' },
            {},
            { prevText: '返回修改', showNext: false }
          ]"
          :before-next="beforeNextHook"
          :before-prev="beforePrevHook"
          @stage-change="onStageChange"
          @next="onNext"
          @prev="onPrev"
        >
          <template #stage-参数输入="{ currentStage, stageName, isFirstStage, isLastStage }">
            <div class="stage-content">
              <h3>{{ stageName }} (Stage {{ currentStage + 1 }})</h3>
              <p>这里是参数输入界面</p>
              <div class="form-group">
                <label>测试参数:</label>
                <input 
                  v-model="testInput" 
                  placeholder="请输入测试参数" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>处理类型:</label>
                <select v-model="processType" class="form-select">
                  <option value="fast">快速处理</option>
                  <option value="normal">标准处理</option>
                  <option value="detailed">详细处理</option>
                </select>
              </div>
              <div class="status-info">
                <p>当前输入: {{ testInput }}</p>
                <p>处理类型: {{ processType }}</p>
                <p>是否第一步: {{ isFirstStage }}</p>
                <p>是否最后一步: {{ isLastStage }}</p>
              </div>
            </div>
          </template>
          
          <template #stage-数据处理="{ currentStage, stageName }">
            <div class="stage-content">
              <h3>{{ stageName }} (Stage {{ currentStage + 1 }})</h3>
              <p>正在处理数据...</p>
              <div class="processing-display">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: processingProgress + '%' }"></div>
                </div>
                <p>处理进度: {{ processingProgress }}%</p>
                <div class="processing-details">
                  <p>输入参数: {{ testInput }}</p>
                  <p>处理类型: {{ processType }}</p>
                  <p>处理状态: {{ processingStatus }}</p>
                  <p>预计完成时间: {{ estimatedTime }}秒</p>
                </div>
              </div>
            </div>
          </template>
          
          <template #stage-结果确认="{ currentStage, stageName }">
            <div class="stage-content">
              <h3>{{ stageName }} (Stage {{ currentStage + 1 }})</h3>
              <p>处理完成，请确认结果</p>
              <div class="result-display">
                <div class="result-summary">
                  <h4>处理摘要</h4>
                  <p>输入参数: {{ testInput }}</p>
                  <p>处理类型: {{ processType }}</p>
                  <p>处理时长: {{ actualProcessTime }}秒</p>
                </div>
                <div class="result-data">
                  <h4>处理结果</h4>
                  <pre>{{ JSON.stringify(processResult, null, 2) }}</pre>
                </div>
                <div class="result-actions">
                  <label>
                    <input type="checkbox" v-model="resultConfirmed" />
                    我确认以上结果无误
                  </label>
                </div>
              </div>
            </div>
          </template>
          
          <template #footer-content-left="{ currentStage, totalStages }">
            <div class="footer-info">
              <span class="stage-indicator">
                步骤 {{ currentStage + 1 }} / {{ totalStages }}
              </span>
              <span class="stage-dots">
                <span 
                  v-for="(stage, index) in stages" 
                  :key="index"
                  class="stage-dot"
                  :class="{ 
                    active: index === currentStage,
                    completed: index < currentStage 
                  }"
                ></span>
              </span>
            </div>
          </template>
        </AppContent>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <h3>控制面板</h3>
      <div class="control-buttons">
        <button @click="resetToFirst" class="control-btn">重置到第一步</button>
        <button @click="goToStage(1)" class="control-btn">跳转到第二步</button>
        <button @click="goToStage(2)" class="control-btn">跳转到第三步</button>
        <button @click="toggleNavButtons" class="control-btn">
          {{ showNavButtons ? '隐藏' : '显示' }}导航按钮
        </button>
        <button @click="simulateProcessing" class="control-btn">模拟处理</button>
      </div>
      
      <div class="status-panel">
        <h4>组件状态</h4>
        <div class="status-grid">
          <div class="status-item">
            <label>当前Stage:</label>
            <span>{{ currentAppStage }}</span>
          </div>
          <div class="status-item">
            <label>导航按钮:</label>
            <span>{{ showNavButtons ? '显示' : '隐藏' }}</span>
          </div>
          <div class="status-item">
            <label>最后操作:</label>
            <span>{{ lastAction }}</span>
          </div>
          <div class="status-item">
            <label>钩子验证:</label>
            <span>{{ hookValidation ? '启用' : '禁用' }}</span>
          </div>
        </div>
        
        <div class="hook-controls">
          <label>
            <input type="checkbox" v-model="hookValidation" />
            启用钩子验证（需要确认才能切换）
          </label>
        </div>
      </div>
    </div>

    <!-- 事件日志 -->
    <div class="event-log">
      <h3>事件日志</h3>
      <div class="log-container">
        <div 
          v-for="(log, index) in eventLogs" 
          :key="index"
          class="log-entry"
          :class="log.type"
        >
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      <button @click="clearLogs" class="clear-logs-btn">清空日志</button>
    </div>
  </div>
</template>

<script>
import AppContent from '@/components/applicationContent/AppContent.vue'

export default {
  name: 'AppContentTest',
  components: {
    AppContent
  },
  data() {
    return {
      // 测试数据
      testInput: '',
      processType: 'normal',
      resultConfirmed: false,
      
      // 处理状态
      processingProgress: 0,
      processingStatus: '等待开始',
      estimatedTime: 0,
      actualProcessTime: 0,
      processResult: null,
      
      // 组件状态
      currentAppStage: 0,
      showNavButtons: true,
      lastAction: '无',
      hookValidation: false,
      
      // 事件日志
      eventLogs: [],
      
      // Stage配置
      stages: ['参数输入', '数据处理', '结果确认']
    }
  },
  methods: {
    // 钩子函数
    async beforeNextHook(currentStage, targetStage) {
      this.addLog('info', `执行beforeNext钩子: ${currentStage} -> ${targetStage}`)
      
      if (!this.hookValidation) {
        return true
      }
      
      // 根据当前stage进行验证
      if (currentStage === 0) {
        // 参数输入验证
        if (!this.testInput.trim()) {
          this.addLog('error', '参数输入验证失败: 请输入测试参数')
          alert('请输入测试参数')
          return false
        }
      } else if (currentStage === 1) {
        // 数据处理验证
        if (this.processingProgress < 100) {
          this.addLog('error', '数据处理验证失败: 处理未完成')
          alert('请等待数据处理完成')
          return false
        }
      }
      
      return confirm(`确认从 "${this.stages[currentStage]}" 进入下一步 "${this.stages[targetStage]}" 吗？`)
    },
    
    async beforePrevHook(currentStage, targetStage) {
      this.addLog('info', `执行beforePrev钩子: ${currentStage} -> ${targetStage}`)
      
      if (!this.hookValidation) {
        return true
      }
      
      return confirm(`确认从 "${this.stages[currentStage]}" 返回到 "${this.stages[targetStage]}" 吗？`)
    },
    
    // 事件处理
    onStageChange(newStage, oldStage) {
      this.currentAppStage = newStage
      this.addLog('success', `Stage切换: ${oldStage} -> ${newStage} (${this.stages[newStage]})`)
      
      // 根据新stage执行相应逻辑
      if (newStage === 1) {
        this.startProcessing()
      }
    },
    
    onNext(currentStage) {
      this.lastAction = `下一步 (从Stage ${currentStage})`
      this.addLog('info', `点击下一步: Stage ${currentStage}`)
    },
    
    onPrev(currentStage) {
      this.lastAction = `上一步 (从Stage ${currentStage})`
      this.addLog('info', `点击上一步: Stage ${currentStage}`)
    },
    
    // 控制方法
    resetToFirst() {
      this.$refs.appContentRef.goToStage(0)
      this.resetProcessingState()
      this.addLog('info', '重置到第一步')
    },
    
    goToStage(index) {
      this.$refs.appContentRef.goToStage(index)
      this.addLog('info', `手动跳转到Stage ${index}`)
    },
    
    toggleNavButtons() {
      this.showNavButtons = !this.showNavButtons
      this.addLog('info', `导航按钮${this.showNavButtons ? '显示' : '隐藏'}`)
    },
    
    // 模拟处理逻辑
    async startProcessing() {
      this.processingProgress = 0
      this.processingStatus = '正在处理...'
      this.estimatedTime = this.getEstimatedTime()
      
      const startTime = Date.now()
      
      // 模拟处理进度
      const interval = setInterval(() => {
        this.processingProgress += Math.random() * 10
        if (this.processingProgress >= 100) {
          this.processingProgress = 100
          this.processingStatus = '处理完成'
          this.actualProcessTime = Math.round((Date.now() - startTime) / 1000)
          this.processResult = this.generateResult()
          clearInterval(interval)
          this.addLog('success', '数据处理完成')
        }
      }, 200)
    },
    
    simulateProcessing() {
      if (this.currentAppStage === 1) {
        this.startProcessing()
      } else {
        this.addLog('warning', '请先切换到数据处理阶段')
      }
    },
    
    resetProcessingState() {
      this.processingProgress = 0
      this.processingStatus = '等待开始'
      this.estimatedTime = 0
      this.actualProcessTime = 0
      this.processResult = null
      this.resultConfirmed = false
    },
    
    getEstimatedTime() {
      const timeMap = {
        'fast': 3,
        'normal': 5,
        'detailed': 8
      }
      return timeMap[this.processType] || 5
    },
    
    generateResult() {
      return {
        input: this.testInput,
        type: this.processType,
        processedAt: new Date().toISOString(),
        result: `处理结果: ${this.testInput.toUpperCase()}`,
        metadata: {
          processingTime: this.actualProcessTime,
          algorithm: this.processType,
          success: true
        }
      }
    },
    
    // 日志管理
    addLog(type, message) {
      this.eventLogs.unshift({
        type,
        message,
        time: new Date().toLocaleTimeString()
      })
      
      // 限制日志数量
      if (this.eventLogs.length > 50) {
        this.eventLogs = this.eventLogs.slice(0, 50)
      }
    },
    
    clearLogs() {
      this.eventLogs = []
      this.addLog('info', '日志已清空')
    }
  },
  
  mounted() {
    this.addLog('info', 'AppContent测试组件已加载')
    this.$emit('update-title', 'AppContent组件测试')
  }
}
</script>

<style scoped>
.test-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.test-container {
  height: 500px;
  border: 2px solid #d0d0d0;
  border-radius: 8px;
  background: #fafafa;
}

.stage-content {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stage-content h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.status-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.status-info p {
  margin: 0.25rem 0;
  font-size: 14px;
}

.processing-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
}

.processing-details {
  background: #e8f4fd;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.result-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 100%;
}

.result-summary, .result-data {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.result-actions {
  grid-column: 1 / -1;
  padding: 1rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
}

.result-actions label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: bold;
  color: #155724;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 14px;
  color: #666;
}

.stage-indicator {
  font-weight: bold;
}

.stage-dots {
  display: flex;
  gap: 0.5rem;
}

.stage-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ddd;
  transition: background 0.2s ease;
}

.stage-dot.active {
  background: #007bff;
}

.stage-dot.completed {
  background: #28a745;
}

.control-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 2rem;
}

.control-buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.control-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #007bff;
  color: white;
}

.status-panel {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.status-item label {
  font-weight: bold;
  color: #495057;
}

.hook-controls {
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.hook-controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.event-log {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  background: #f8f9fa;
  margin-bottom: 1rem;
}

.log-entry {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e9ecef;
  font-family: monospace;
  font-size: 13px;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-entry.info {
  background: #d1ecf1;
  color: #0c5460;
}

.log-entry.success {
  background: #d4edda;
  color: #155724;
}

.log-entry.warning {
  background: #fff3cd;
  color: #856404;
}

.log-entry.error {
  background: #f8d7da;
  color: #721c24;
}

.log-time {
  font-weight: bold;
  min-width: 80px;
}

.log-message {
  flex: 1;
}

.clear-logs-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #dc3545;
  background: white;
  color: #dc3545;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.clear-logs-btn:hover {
  background: #dc3545;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .result-display {
    grid-template-columns: 1fr;
  }

  .control-buttons {
    flex-direction: column;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .footer-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
