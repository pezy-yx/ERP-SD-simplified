<template>
  <div class="test-page">
    <h1>变量框组件测试 🐱</h1>

    <div class="test-section">
      <h2>基础类型测试</h2>
      
      <div class="test-item">
        <h3>String</h3>
        <var-input
          type="string"
          v-model="testData.string"
          :validator="validators.required"
          placeholder="请输入文本"
        />
      </div>

      <div class="test-item">
        <h3>String Array</h3>
        <var-input
          type="string[]"
          v-model="testData.stringArray"
          :configs="{ length: 3 }"
        />
      </div>

      <div class="test-item">
        <h3>Selection</h3>
        <var-input
          type="selection"
          v-model="testData.selection"
          :configs="{ options: ['选项1', '选项2', '选项3'] }"
        />
      </div>

      <div class="test-item">
        <h3>Date</h3>
        <var-input
          type="date"
          v-model="testData.date"
          :validator="validators.date"
          :configs="{ 
            minDate: '2024-01-01',
            maxDate: '2025-12-31'
          }"
        />
      </div>
    </div>

    <div class="test-section">
      <h2>复杂类型测试</h2>
      
      <div class="test-item">
        <h3>Dict</h3>
        <var-input
          type="dict"
          v-model="testData.dict"
          :configs="{
            children: {
              name: 'string',
              age: 'string',
              hobbies: 'string[]'
            },
            childConfigs: {
              hobbies: { length: 2 }
            }
          }"
        />
      </div>

      <div class="test-item">
        <h3>FixList</h3>
        <var-input
          type="fixlist"
          v-model="testData.fixList"
          :configs="{
            itemType: 'string',
            length: 3
          }"
        />
      </div>

      <div class="test-item">
        <h3>DynamicList</h3>
        <var-input
          type="dynamiclist"
          v-model="testData.dynamicList"
          :configs="{
            itemType: 'dict',
            maxLength: 3,
            itemConfig: {
              children: {
                name: 'string',
                score: 'string'
              }
            }
          }"
        />
      </div>

      <div class="test-item">
        <h3>NameTree</h3>
        <var-input
          type="nametree"
          v-model="testData.nameTree"
        />
      </div>
    </div>

    <div class="data-preview">
      <h2>数据预览</h2>
      <pre>{{ JSON.stringify(testData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import VarInput from '@/components/VarInput/index.vue'
import { validators } from '@/utils/NameTree'

export default {
  name: 'TestPage',

  components: {
    VarInput
  },

  data() {
    return {
      validators,
      testData: {
        string: '',
        stringArray: ['', '', ''],
        selection: '选项1',
        date: '',
        dict: {
          name: '',
          age: '',
          hobbies: ['', '']
        },
        fixList: ['', '', ''],
        dynamicList: [],
        nameTree: ['dict', 'dict', 'person', {
          name: ['leaf', 'string', 'username', ''],
          age: ['leaf', 'number', 'userage', 0],
          hobbies: ['list', 'list', 'hobby_list', [
            ['leaf', 'string', 'hobby1', ''],
            ['leaf', 'string', 'hobby2', '']
          ]]
        }]
      }
    }
  }
}
</script>

<style scoped>
.test-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #409EFF;
  margin-bottom: 40px;
}

.test-section {
  margin-bottom: 40px;
}

h2 {
  color: #606266;
  border-bottom: 2px solid #EBEEF5;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.test-item {
  margin-bottom: 30px;
}

h3 {
  color: #909399;
  margin-bottom: 10px;
}

.data-preview {
  background: #F5F7FA;
  padding: 20px;
  border-radius: 4px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>