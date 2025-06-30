<template>
  <div>
    <!-- VarBoxCases全量测试区 -->
    <div class="testcase-demo-root">
      <nav class="testcase-nav">
        <div class="testcase-nav-title">VarBox TestCase目录</div>
        <ul>
          <li v-for="name in testcaseNames" :key="name">
            <a :href="'#testcase-'+name">{{ name }}</a>
          </li>
        </ul>
      </nav>
      <div class="testcase-list">
        <div
          v-for="name in testcaseNames"
          :key="name"
          class="testcase-item"
          :id="'testcase-'+name"
        >
          <h3>{{ name }}</h3>
          <var-box
            :tree="testCases[name].tree"
            :nodePath="[]"
          />
          <div class="result-preview">
            <strong>当前值：</strong>
            <pre>{{ JSON.stringify(testCases[name].tree.root?.currentValue, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.testcase-demo-root {
  display: flex;
  margin-top: 48px;
  min-height: 400px;
}
.testcase-nav {
  position: fixed;
  top: 80px;
  left: 0;
  width: 180px;
  background: #f8f8fc;
  border-right: 2px solid #eee;
  padding: 16px 8px 16px 16px;
  z-index: 10;
  font-size: 15px;
  border-radius: 0 12px 12px 0;
  box-shadow: 2px 0 8px #eee;
}
.testcase-nav-title {
  font-weight: bold;
  margin-bottom: 12px;
  color: #7c5fd4;
}
.testcase-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.testcase-nav li {
  margin-bottom: 8px;
}
.testcase-nav a {
  color: #5a4fcf;
  text-decoration: none;
  transition: color 0.2s;
}
.testcase-nav a:hover {
  color: #e67e22;
  text-decoration: underline;
}
.testcase-list {
  margin-left: 200px;
  flex: 1;
  padding: 8px 24px;
}
.testcase-item {
  margin-bottom: 36px;
  padding: 18px 16px 16px 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #f0f0f0;
  border: 1px solid #f3f3f3;
}
.testcase-item h3 {
  margin-top: 0;
  color: #6b4fcf;
}
</style>
 
<script lang = "ts">
import VarInput from '@/components/varbox/VarInput.vue'
import VarBox from '@/components/varbox/VarBox.vue'
import { VarTree, VarNode, validators, createTreeFromConfig, NodeStructure, VarTypeString } from '@/utils/VarTree'
import MyCustomInput from '@/test/varbox/MyCustomInput.vue'
import { testCases } from '@/test/varbox/VarInputCasesErp'
import { markRaw } from 'vue'

export default {
  name: 'NewTestPage',

  components: {
    VarInput,
    VarBox,
    MyCustomInput
  },

  data() {
    return {
      validators,
      testcaseNames: Object.keys(testCases),
      testCases,
      testResults: {
        simpleString: '',
        simpleNumber: 0,
        simpleDate: '',
        simpleSelection: '',
        threeLevelDict: {},
        threeLevelList: [],
        mixed: {},
        readonly: {},
        dynamicList: [],
        tableTest: [],
        configBased: {},
        // 新增的测试数据
        searchInput: '',
        numberInput: 0,
        fileInput: ''
      } as {
        [key: string]: any;
        simpleString: string;
        simpleNumber: number;
        simpleDate: string;
        simpleSelection: string;
        threeLevelDict: object;
        threeLevelList: any[];
        mixed: object;
        readonly: object;
        dynamicList: any[];
        tableTest: any[];
        configBased: object;
        // 新增字段的类型定义
        searchInput: string;
        numberInput: number;
        fileInput: string;
      },
      // 配置对象示例
      configObject: {
        varType: 'dict',
        name: 'employee',
        children: [
          {
            varType: 'dict',
            name: 'basicInfo',
            children: [
              { varType: 'string', name: 'name', defaultValue: '张三'},
              { varType: 'number', name: 'age', defaultValue: 28 },
              {
                varType: 'selection', name: 'gender', defaultValue: '男', config: {
                  options: ['男', '女', '其他']
                }
              },
              { varType: 'date', name: 'birthDate', defaultValue: '1995-01-01' }
            ]
          },
          {
            varType: 'dict',
            name: 'workInfo',
            children: [
              { varType: 'string', name: 'department', defaultValue: '技术部' },
              { varType: 'string', name: 'position', defaultValue: '软件工程师' },
              { varType: 'number', name: 'salary', defaultValue: 8000 },
              {
                varType: 'fixlist',
                name: 'skills',
                children: [
                  { varType: 'string', defaultValue: 'JavaScript' },
                  { varType: 'string', defaultValue: 'Vue.js' , readonly: true},
                  { varType: 'string', defaultValue: 'Python' },
                  { varType: 'number', defaultValue: 123 }
                ]
              }
            ]
          },
          {
            varType: 'dynamiclist',
            name: 'projects',
            children: [
              { varType: 'dict', name:"lan", children: [
                { varType: 'string', name: 'projectName', defaultValue: '项目A' },
                { varType: 'string', name: 'role', defaultValue: '开发', config: {customComponent: markRaw(MyCustomInput)} },
                { varType: 'date', name: 'startDate', defaultValue: '2023-01-01' },
                { varType: 'date', name: 'endDate', defaultValue: '2023-12-31' }
              ]},
              { varType: 'dict', name:"lan", children: [
                { varType: 'string', name: 'projectName', defaultValue: '项目B' },
                { varType: 'string', name: 'role', defaultValue: '测试' },
                { varType: 'date', name: 'startDate', defaultValue: '2024-01-01' },
                { varType: 'date', name: 'endDate', defaultValue: '2024-12-31' }
              ]}
            ],
            config: {
              childTemplate: {
                varType: 'dict',
                children: [
                  { varType: 'string', name: 'projectName', defaultValue: '' },
                  { varType: 'string', name: 'role', defaultValue: '' },
                  { varType: 'date', name: 'startDate', defaultValue: '' },
                  { varType: 'date', name: 'endDate', defaultValue: '' }
                ]
              }
            }
          }
        ]
      } as NodeStructure
    }
  },

  computed: {
    // 简单字符串树
    simpleStringTree(): VarTree {
      const config: NodeStructure = { varType: 'string', name: '用户名', defaultValue: '', nameDisplay:'用户名:', config: {
        validators: [
          {
            creteria:(val: any) => {
              const flag = val === '123'
              return flag
            },
            message: "值不是123"
          }
        ],
      }}
      return createTreeFromConfig(config)
    },

    // 简单数字树
    simpleNumberTree(): VarTree {
      const config: NodeStructure = { varType: 'number', name: '年龄', defaultValue: 0 }
      return createTreeFromConfig(config)
    },

    // 简单日期树
    simpleDateTree(): VarTree {
      const config: NodeStructure = { varType: 'date', name: 'birthday', defaultValue: '' }
      return createTreeFromConfig(config)
    },

    // 简单选择树
    simpleSelectionTree(): VarTree {
      const config: NodeStructure = { varType: 'selection', name: '级别', defaultValue: '选项1' }
      return createTreeFromConfig(config)
    },

    // 三层字典嵌套
    threeLevelDictTree(): VarTree {
      const config: NodeStructure = {
        varType: 'dict',
        name: 'user',
        children: [
          {
            varType: 'string',
            name: 'id',
            defaultValue: 'user_001'
          },
          {
            varType: 'dict',
            name: 'personal',
            children: [
              { varType: 'string', name: 'name', defaultValue: '张三' },
              { varType: 'number', name: 'age', defaultValue: 25 },
              {
                varType: 'dict',
                name: 'address',
                children: [
                  { varType: 'string', name: 'province', defaultValue: '广东省' },
                  { varType: 'string', name: 'city', defaultValue: '深圳市' },
                  { varType: 'string', name: 'district', defaultValue: '南山区' }
                ]
              }
            ]
          },
          {
            varType: 'string',
            name: 'email',
            defaultValue: 'test@example.com'
          }
        ]
      }
      return createTreeFromConfig(config)
    },

    // 三层列表嵌套
    threeLevelListTree(): VarTree {
      const config: NodeStructure = {
        varType: 'fixlist',
        name: 'matrix',
        children: [
          {
            varType: 'fixlist',
            children: [
              {
                varType: 'fixlist',
                children: [
                  { varType: 'string', defaultValue: 'item1' },
                  { varType: 'string', defaultValue: 'item2' }
                ]
              },
              {
                varType: 'fixlist',
                children: [
                  { varType: 'string', defaultValue: 'item3' },
                  { varType: 'string', defaultValue: 'item4' }
                ]
              }
            ]
          }
        ]
      }
      return createTreeFromConfig(config)
    },

    // 混合字典和列表
    mixedTree(): VarTree {
      const config: NodeStructure = {
        varType: 'dict',
        name: 'student',
        children: [
          { varType: 'string', name: 'name', defaultValue: '李四' },
          { varType: 'string', name: 'class', defaultValue: '三年级一班' },
          { varType: 'date', name: 'birthday', defaultValue: '2004/03/14' },
          { varType: 'dynamiclist', name: 'scores', 
            children: [
              { varType: 'dict', name: 'math', children: [
                { varType: 'string', name: 'subject', defaultValue: '数学' },
                { varType: 'number', name: 'score', defaultValue: 95 }
              ]},
              { varType: 'dict', name: 'english', children: [
                { varType: 'string', name: 'subject', defaultValue: '英语' },
                { varType: 'number', name: 'score', defaultValue: 88 }
              ]}
            ]
          }
        ]
      }
      return createTreeFromConfig(config)
    },

    // 只读树
    readonlyTree(): VarTree {
      const config: NodeStructure = {
        varType: 'dict',
        name: 'readonly_data',
        readonly: true,
        children: [
          { varType: 'string', name: '系统版本', defaultValue: 'v1.0.0', readonly: true },
          { varType: 'string', name: '创建时间', defaultValue: '2024-01-01', readonly: true },
          { varType: 'number', name: '用户数量', defaultValue: 1000, readonly: true }
        ]
      }
      return createTreeFromConfig(config)
    },

    // 动态列表树
    dynamicListTree(): VarTree {
      const config: NodeStructure = {
        varType: 'dynamiclist',
        nodeType: 'list',
        name: 'students',
        children: [{
            varType: 'dict',
            children: [
              { varType: 'string', name: 'name', defaultValue: '学生姓名' },
              { varType: 'number', name: 'score', defaultValue: 100 }
            ]
          }],
        config: {
          childTemplate: {
            varType: 'dict',
            children: [
              { varType: 'string', name: 'name'},
              { varType: 'number', name: 'score'}
            ]
          },
          maxLength: 10
        }
      }
      return createTreeFromConfig(config)
    },

    // 表格显示测试树
    tableTestTree(): VarTree {
      const config: NodeStructure = {
        varType: 'fixlist',
        name: 'student_table',
        children: [
          {
            varType: 'dict',
            children: [
              { varType: 'string', name: 'name', defaultValue: '张三' },
              { varType: 'number', name: 'age', defaultValue: 20 },
              { varType: 'string', name: 'major', defaultValue: '计算机科学' }
            ]
          },
          {
            varType: 'dict',
            children: [
              { varType: 'string', name: 'name', defaultValue: '李四' },
              { varType: 'number', name: 'age', defaultValue: 21 },
              { varType: 'string', name: 'major', defaultValue: '软件工程' }
            ]
          },
          {
            varType: 'dict',
            children: [
              { varType: 'string', name: 'name', defaultValue: '王五' },
              { varType: 'number', name: 'age', defaultValue: 19 },
              { varType: 'string', name: 'major', defaultValue: '数据科学' }
            ]
          }
        ]
      }
      return createTreeFromConfig(config)
    },

    // 便捷构造方法测试树
    configBasedTree(): VarTree {
      return createTreeFromConfig((this as any).configObject as NodeStructure)
    }
  },

  mounted() {
    // 初始化所有复杂类型的数据预览
    (this as any).initializeComplexData()
  },

  methods: {
    // 初始化复杂数据预览
    initializeComplexData() {
      const complexKeys = ['threeLevelDict', 'threeLevelList', 'mixed', 'readonly', 'dynamicList', 'tableTest', 'configBased']
      
      complexKeys.forEach(key => {
        const tree = (this as any).getTreeByKey(key)
        if (tree && tree.root) {
          (this as any).testResults[key] = tree.root.currentValue
        }
      })
    },
    handleUpdate(key: string, updateInfo: any) {
      const tree = (this as any).getTreeByKey(key)
      if (!tree || !tree.root) return
      if (tree.root.isLeaf()) {
        (this as any).testResults[key] = updateInfo.value
      } else {
        (this as any).testResults[key] = tree.root.currentValue
      }
    },

    // 根据key获取对应的树
    getTreeByKey(key: any): VarTree | undefined {
      const treeMap = {
        simpleString: (this as any).simpleStringTree,
        simpleNumber: (this as any).simpleNumberTree,
        simpleDate: (this as any).simpleDateTree,
        simpleSelection: (this as any).simpleSelectionTree,
        threeLevelDict: (this as any).threeLevelDictTree,
        threeLevelList: (this as any).threeLevelListTree,
        mixed: (this as any).mixedTree,
        readonly: (this as any).readonlyTree,
        dynamicList: (this as any).dynamicListTree,
        tableTest: (this as any).tableTestTree,
        configBased: (this as any).configBasedTree,
        searchInput: (this as any).simpleStringTree,
        numberInput: (this as any).simpleNumberTree,
      }
      return treeMap[key as keyof typeof treeMap] as VarTree | undefined
    },

    // 新增的额外组件功能方法
    handleSearch(varProps: any) {
      alert(`搜索内容: ${varProps.currentNode?.currentValue || '空'}`)
    },

    handleClear(varProps: any) {
      if (varProps.currentNode) {
        varProps.setNodeValue('')
      }
    },

    increment(varProps: any) {
      if (varProps.currentNode) {
        const value = varProps.getNodeValue()
        const newValue = Number(value) + 1
        varProps.setNodeValue(newValue)
      }
    },

    decrement(varProps: any) {
      if (varProps.currentNode) {
        const value = varProps.getNodeValue()
        const newValue = Number(value) - 1
        varProps.setNodeValue(newValue)
      }
    },
  }
}
</script>

<style scoped>
.test-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #409EFF;
  margin-bottom: 40px;
  font-size: 28px;
}

.test-section {
  margin-bottom: 50px;
  border: 1px solid #EBEEF5;
  border-radius: 8px;
  padding: 25px;
  background-color: #FAFAFA;
}

h2 {
  color: #606266;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 10px;
  margin-bottom: 25px;
  font-size: 20px;
}

.test-item {
  margin-bottom: 35px;
  padding: 20px;
  border: 1px solid #DCDFE6;
  border-radius: 6px;
  background-color: white;
}

h3 {
  color: #909399;
  margin-bottom: 15px;
  font-size: 16px;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

pre {
  max-height: 300px;
  overflow-y: scroll;
}

.result-preview {
  margin-top: 15px;
  padding: 15px;
  background-color: #F5F7FA;
  border-radius: 4px;
  border-left: 4px solid #409EFF;
}

.result-preview pre {
  margin: 10px 0 0 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  line-height: 1.4;
}

.global-preview {
  margin-top: 40px;
  padding: 25px;
  background: #F0F9FF;
  border-radius: 8px;
  border: 1px solid #409EFF;
}

.global-preview h2 {
  color: #409EFF;
  border-bottom-color: #409EFF;
}

/* 新增的额外组件布局样式 */

/* 搜索输入框 - 水平布局 */
:deep(.search-input--wrapper) {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  background-color: #fff;
}
:deep(.search-input--wrapper .search-btn) {
  scale: 1.2;
  transform: translateX(0, 50px);
}
:deep(.search-input--main) {
  display: flex;
  flex: 1;
}

:deep(.search-input--extra) {
  display: flex;
  gap: 4px;
}

:deep(.search-btn, .clear-btn) {
  padding: 4px 8px;
  border: 1px solid #409EFF;
  border-radius: 4px;
  background-color: #409EFF;
  color: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

:deep(.search-btn:hover, .clear-btn:hover) {
  background-color: #337ECC;
}

:deep(.clear-btn) {
  background-color: #F56C6C;
  border-color: #F56C6C;
}

:deep(.clear-btn:hover) {
  background-color: #DD6161;
}

/* 数值输入框 - 垂直布局 */
:deep(.number-input--wrapper) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #E4E7ED;
  border-radius: 6px;
  padding: 12px;
  background-color: #F9FAFC;
  width: 40%;

}

:deep(.number-input--main) {
  width: 100%;
}

:deep(.number-input--extra) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.number-controls) {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

:deep(.number-controls button) {
  padding: 6px 12px;
  border: 1px solid #67C23A;
  border-radius: 4px;
  background-color: #67C23A;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

:deep(.number-controls button:hover) {
  background-color: #5DAE34;
}

:deep(.number-info) {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

:deep(.all1-name--wrapper .dict-leaf-section) {
  /* grid-template-columns: repeat(auto-fit, minmax(30%, 1fr)) !important; */
  grid-template-columns: 1fr 1fr 1fr;
}
</style>