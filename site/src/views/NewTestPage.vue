<template>
  <div class="test-page">
    <h1>VarTree组件测试 🐱</h1>

    <!-- 简单类型测试 -->
    <div class="test-section">
      <h2>1. 简单类型测试</h2>
      
      <div class="test-item">
        <h3>单个VarNode（字符串叶子节点）</h3>
        <var-input
          :varTree="simpleStringTree"
          :nodePath="[]"
          :contentValidator="validators.required"
          @update="handleUpdate('simpleString', $event)"
        />
        <div class="result-preview">
          <strong>当前值：</strong>{{ JSON.stringify(testResults.simpleString) }}
        </div>
      </div>

      <div class="test-item">
        <h3>数字类型节点</h3>
        <var-input
          :varTree="simpleNumberTree"
          :nodePath="[]"
          :contentValidator="validators.number"
          @update="handleUpdate('simpleNumber', $event)"
        />
        <div class="result-preview">
          <strong>当前值：</strong>{{ JSON.stringify(testResults.simpleNumber) }}
        </div>
      </div>

      <div class="test-item">
        <h3>日期类型节点</h3>
        <var-input
          :varTree="simpleDateTree"
          :nodePath="[]"
          :contentValidator="validators.date"
          :config="{ minDate: '2024-01-01', maxDate: '2025-12-31' }"
          @update="handleUpdate('simpleDate', $event)"
        />
        <div class="result-preview">
          <strong>当前值：</strong>{{ JSON.stringify(testResults.simpleDate) }}
        </div>
      </div>

      <div class="test-item">
        <h3>选择类型节点</h3>
        <var-input
          :varTree="simpleSelectionTree"
          :nodePath="[]"
          :config="{ options: ['选项1', '选项2', '选项3', '选项4'] }"
          @update="handleUpdate('simpleSelection', $event)"
        />
        <div class="result-preview">
          <strong>当前值：</strong>{{ JSON.stringify(testResults.simpleSelection) }}
        </div>
      </div>
    </div>

    <!-- 复杂类型测试 -->
    <div class="test-section">
      <h2>2. 复杂类型测试</h2>
      
      <div class="test-item">
        <h3>三层字典嵌套</h3>
        <var-input
          :varTree="threeLevelDictTree"
          :nodePath="[]"
          @update="handleUpdate('threeLevelDict', $event)"
        />
        <div class="result-preview">
          <strong>当前值：</strong>
          <pre>{{ JSON.stringify(testResults.threeLevelDict, null, 2) }}</pre>
        </div>
      </div>

      <div class="test-item">
        <h3>三层列表嵌套</h3>
        <var-input
          :varTree="threeLevelListTree"
          :nodePath="[]"
          :config="{
            itemType: 'fixlist',
            itemConfig: {
              itemType: 'fixlist',
              length: 2,
              itemConfig: {
                itemType: 'string'
              }
            }
          }"
          @update="handleUpdate('threeLevelList', $event)"
        />
        <div class="result-preview">
          <strong>当前值：</strong>
          <pre>{{ JSON.stringify(testResults.threeLevelList, null, 2) }}</pre>
        </div>
      </div>

      <div class="test-item">
        <h3>混合字典和列表</h3>
        <var-input
          :varTree="mixedTree"
          :nodePath="[]"
          @update="handleUpdate('mixed', $event)"
        />
        <div class="result-preview">
          <strong>当前值：</strong>
          <pre>{{ JSON.stringify(testResults.mixed, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- 功能特性测试 -->
    <div class="test-section">
      <h2>3. 功能特性测试</h2>
      
      <div class="test-item">
        <h3>只读模式</h3>
        <var-input
          :varTree="readonlyTree"
          :nodePath="[]"
          :readonly="true"
          @update="handleUpdate('readonly', $event)"
        />
      </div>

      <div class="test-item">
        <h3>动态列表（可添加删除）</h3>
        <var-input
          :varTree="dynamicListTree"
          :nodePath="[]"
          :config="{
            itemType: 'dict',
            maxLength: 5,
            itemConfig: {
              children: {
                name: 'string',
                score: 'number'
              }
            }
          }"
          @update="handleUpdate('dynamicList', $event)"
        />
        <div class="result-preview">
          <strong>当前值：</strong>
          <pre>{{ JSON.stringify(testResults.dynamicList, null, 2) }}</pre>
        </div>
      </div>

      <div class="test-item">
        <h3>表格显示测试（Dict作为列表项）</h3>
        <var-input
          :varTree="tableTestTree"
          :nodePath="[]"
          @update="handleUpdate('tableTest', $event)"
        />
        <div class="result-preview">
          <strong>当前值：</strong>
          <pre>{{ JSON.stringify(testResults.tableTest, null, 2) }}</pre>
        </div>
      </div>

      <div class="test-item">
        <h3>便捷构造方法测试</h3>
        <var-input
          :varTree="configBasedTree"
          :nodePath="[]"
          @update="handleUpdate('configBased', $event)"
        />
        <div class="result-preview">
          <strong>当前值：</strong>
          <pre>{{ JSON.stringify(testResults.configBased, null, 2) }}</pre>
        </div>
        <div class="config-preview">
          <strong>配置对象：</strong>
          <pre>{{ JSON.stringify(configObject, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- 全局数据预览 -->
    <div class="global-preview">
      <h2>全局数据预览</h2>
      <pre>{{ JSON.stringify(testResults, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import VarInput from '@/components/VarInput/VarInput.vue'
import { VarTree, VarNode, VarNodeFactory, validators, createVarTreeFromConfig } from '@/utils/VarTree'

export default {
  name: 'NewTestPage',

  components: {
    VarInput
  },

  data() {
    return {
      validators,
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
        configBased: {}
      },
      // 配置对象示例
      configObject: {
        type: 'dict',
        name: 'employee',
        children: {
          basicInfo: {
            type: 'dict',
            name: 'basic_info',
            children: {
              name: { type: 'string', defaultValue: '张三' },
              age: { type: 'number', defaultValue: 28 },
              gender: {
                type: 'selection',
                defaultValue: '男',
                config: {
                  options: ['男', '女', '其他']
                }
              },
              birthDate: { type: 'date', defaultValue: '1995-01-01' }
            }
          },
          workInfo: {
            type: 'dict',
            readonly: false,
            children: {
              department: { type: 'string', defaultValue: '技术部' },
              position: { type: 'string', defaultValue: '软件工程师' },
              salary: { type: 'number', defaultValue: 8000 },
              skills: {
                type: 'fixlist',
                children: [
                  { type: 'string', defaultValue: 'JavaScript' },
                  { type: 'string', defaultValue: 'Vue.js' , readonly: true},
                  { type: 'string', defaultValue: 'Python' },
                  { type: 'number', defaultValue: '123' }
                ]
              }
            }
          },
          projects: {
            type: 'dynamiclist',
            children: [
              { type: 'dict', name:"lan", children: {
                projectName: { type: 'string', defaultValue: '项目A' },
                role: { type: 'string', defaultValue: '开发' },
                startDate: { type: 'date', defaultValue: '2023-01-01' },
                endDate: { type: 'date', defaultValue: '2023-12-31' }
              }},
              { type: 'dict', name:"lan", children: {
                projectName: { type: 'string', defaultValue: '项目B' },
                role: { type: 'string', defaultValue: '测试' },
                startDate: { type: 'date', defaultValue: '2024-01-01' },
                endDate: { type: 'date', defaultValue: '2024-12-31' }
              }}
            ],
            config: {
              childTemplate: {
                type: 'dict',
                children: {
                  projectName: { type: 'string', name:"项目名称", defaultValue: '' },
                  role: { type: 'string', name:"", defaultValue: '' },
                  startDate: { type: 'date', name:"", defaultValue: '' },
                  endDate: { type: 'date', name:"", defaultValue: '' }
                }
              }
            }
          },
          projects2: {
            type: 'fixlist',
            children: [
              {},{}
            ]
          }
        }
      }
    }
  },

  computed: {
    // 简单字符串树
    simpleStringTree() {
      const root = VarNodeFactory.createStringNode('用户名', '', false)
      return new VarTree(root)
    },

    // 简单数字树
    simpleNumberTree() {
      const root = VarNodeFactory.createNumberNode('年龄', 0, false)
      return new VarTree(root)
    },

    // 简单日期树
    simpleDateTree() {
      const root = VarNodeFactory.createDateNode('生日', '', false)
      return new VarTree(root)
    },

    // 简单选择树
    simpleSelectionTree() {
      const root = VarNodeFactory.createSelectionNode('级别', '选项1', false)
      return new VarTree(root)
    },

    // 三层字典嵌套
    threeLevelDictTree() {
      // 第三层
      const address = VarNodeFactory.createDictNode('address', [
        VarNodeFactory.createStringNode('province', '广东省'),
        VarNodeFactory.createStringNode('city', '深圳市'),
        VarNodeFactory.createStringNode('district', '南山区')
      ])

      // 第二层
      const personal = VarNodeFactory.createDictNode('personal', [
        VarNodeFactory.createStringNode('name', '张三'),
        VarNodeFactory.createNumberNode('age', 25),
        address
      ])

      // 第一层（根）
      const root = VarNodeFactory.createDictNode('user', [
        VarNodeFactory.createStringNode('id', 'user_001'),
        personal,
        VarNodeFactory.createStringNode('email', 'test@example.com')
      ])

      return new VarTree(root)
    },

    // 三层列表嵌套
    threeLevelListTree() {
      // 第三层：字符串列表
      const level3_1 = VarNodeFactory.createListNode('', [
        VarNodeFactory.createStringNode('', 'item1'),
        VarNodeFactory.createStringNode('', 'item2')
      ], false, 'fixlist')

      const level3_2 = VarNodeFactory.createListNode('', [
        VarNodeFactory.createStringNode('', 'item3'),
        VarNodeFactory.createStringNode('', 'item4')
      ], false, 'fixlist')

      // 第二层：列表的列表
      const level2 = VarNodeFactory.createListNode('', [level3_1, level3_2], false, 'fixlist')

      // 第一层（根）：包含第二层的列表
      const root = VarNodeFactory.createListNode('matrix', [level2], false, 'fixlist')

      return new VarTree(root)
    },

    // 混合字典和列表
    mixedTree() {
      // 列表中的字典项
      const scoreDict1 = VarNodeFactory.createDictNode('', [
        VarNodeFactory.createStringNode('subject', '数学'),
        VarNodeFactory.createNumberNode('score', 95)
      ])

      const scoreDict2 = VarNodeFactory.createDictNode('', [
        VarNodeFactory.createStringNode('subject', '英语'),
        VarNodeFactory.createNumberNode('score', 88)
      ])

      // 成绩列表
      const scoresList = VarNodeFactory.createListNode('scores', [scoreDict1, scoreDict2], false, 'fixlist')

      // 根字典
      const root = VarNodeFactory.createDictNode('student', [
        VarNodeFactory.createStringNode('name', '李四'),
        VarNodeFactory.createStringNode('class', '三年级一班'),
        scoresList
      ])

      return new VarTree(root)
    },

    // 只读树
    readonlyTree() {
      const root = VarNodeFactory.createDictNode('readonly_data', [
        VarNodeFactory.createStringNode('系统版本', 'v1.0.0', true),
        VarNodeFactory.createStringNode('创建时间', '2024-01-01', true),
        VarNodeFactory.createNumberNode('用户数量', 1000, true)
      ], true)

      return new VarTree(root)
    },

    // 动态列表树
    dynamicListTree() {
      const root = VarNodeFactory.createListNode('students', [], false, 'dynamiclist')
      return new VarTree(root)
    },

    // 表格显示测试树
    tableTestTree() {
      // 创建几个预设的字典项用于表格显示
      const student1 = VarNodeFactory.createDictNode('', [
        VarNodeFactory.createStringNode('name', '张三'),
        VarNodeFactory.createNumberNode('age', 20),
        VarNodeFactory.createStringNode('major', '计算机科学')
      ])

      const student2 = VarNodeFactory.createDictNode('', [
        VarNodeFactory.createStringNode('name', '李四'),
        VarNodeFactory.createNumberNode('age', 21),
        VarNodeFactory.createStringNode('major', '软件工程')
      ])

      const student3 = VarNodeFactory.createDictNode('', [
        VarNodeFactory.createStringNode('name', '王五'),
        VarNodeFactory.createNumberNode('age', 19),
        VarNodeFactory.createStringNode('major', '数据科学')
      ])

      const root = VarNodeFactory.createListNode('student_table', [student1, student2, student3], false, 'fixlist')
      return new VarTree(root)
    },

    // 便捷构造方法测试树
    configBasedTree() {
      return createVarTreeFromConfig(this.configObject)
    }
  },

  mounted() {
    // 初始化所有复杂类型的数据预览
    this.initializeComplexData()
  },

  methods: {
    // 初始化复杂数据预览
    initializeComplexData() {
      const complexKeys = ['threeLevelDict', 'threeLevelList', 'mixed', 'readonly', 'dynamicList', 'tableTest', 'configBased']
      
      complexKeys.forEach(key => {
        const tree = this.getTreeByKey(key)
        if (tree && tree.root) {
          this.testResults[key] = this.extractNodeValue(tree.root)
        }
      })
    },
    handleUpdate(key, updateInfo) {
      console.log(`[${key}] Update:`, updateInfo)
      
      // 根据key获取对应的树
      const tree = this.getTreeByKey(key)
      if (!tree || !tree.root) return
      
      // 判断根节点类型来决定更新策略
      if (tree.root.isLeaf()) {
        // 如果根节点就是叶子节点，直接更新值
        this.testResults[key] = updateInfo.value
      } else {
        // 如果根节点是复杂类型，无论更新的是哪个子节点，都要提取完整结构
        this.testResults[key] = this.extractNodeValue(tree.root)
      }
    },

    // 根据key获取对应的树
    getTreeByKey(key) {
      const treeMap = {
        'simpleString': this.simpleStringTree,
        'simpleNumber': this.simpleNumberTree,
        'simpleDate': this.simpleDateTree,
        'simpleSelection': this.simpleSelectionTree,
        'threeLevelDict': this.threeLevelDictTree,
        'threeLevelList': this.threeLevelListTree,
        'mixed': this.mixedTree,
        'readonly': this.readonlyTree,
        'dynamicList': this.dynamicListTree,
        'tableTest': this.tableTestTree,
        'configBased': this.configBasedTree
      }
      return treeMap[key]
    },

    // 从节点提取值
    extractNodeValue(node) {
      if (!node) return null

      if (node.isLeaf()) {
        return node.defaultValue
      }

      if (node.nodeType === 'dict') {
        const result = {}
        for (let child of node.children) {
          result[child.name] = this.extractNodeValue(child)
        }
        return result
      }

      if (node.nodeType === 'list') {
        return node.children.map(child => this.extractNodeValue(child))
      }

      return null
    }
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

.global-preview pre {
  margin: 15px 0 0 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  line-height: 1.4;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
}

.config-preview {
  margin-top: 10px;
  padding: 15px;
  background-color: #FFF9E6;
  border-radius: 4px;
  border-left: 4px solid #E6A23C;
}

.config-preview pre {
  margin: 10px 0 0 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  line-height: 1.4;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  color: #E6A23C;
}
</style>