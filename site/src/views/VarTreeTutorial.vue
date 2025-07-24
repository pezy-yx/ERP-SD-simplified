<template>
  <div>
    <!-- 固定左侧导航目录 -->
    <nav class="tutorial-nav show-side--away">
      <h2>教学目录</h2>
      <ul>
        <li><a href="#basic-usage">1. 基础用法</a></li>
        <li><a href="#simple-trees">2. 简单树结构</a></li>
        <li><a href="#complex-trees">3. 复杂树结构</a></li>
        <li><a href="#slots-usage">4. 插槽用法详解</a></li>
        <li><a href="#hooks-usage">5. 钩子用法详解</a></li>
        <li><a href="#css-deep">6. Deep CSS 属性用法</a></li>
        <li><a href="#grid-layout">7. Grid 布局控制</a></li>
        <li><a href="#advanced-examples">8. 高级应用示例</a></li>
      </ul>
    </nav>
    <AppContent :stages="['tutorial']" :hideBottomBar="true">
      <template #stage-tutorial>
        <div class="vartree-tutorial">

          <!-- 主要内容区域 -->
          <div class="tutorial-content">
            <!-- 1. 基础用法 -->
            <section id="basic-usage" class="tutorial-section">
              <h2>1. 基础用法</h2>
              <p>VarTree是一个用于管理复杂数据结构的工具类，VarInput是对应的渲染组件。</p>
              
              <div class="example-container">
                <h3>1.1 最简单的字符串输入</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const simpleString = createTreeFromConfig(
          cns('string', 'leaf', 'username', '张三', false, {}, [], '用户名')
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="simpleString" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 基础样式，无需额外定制 */
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="basicExamples.simpleString" />
                </div>
              </div>

              <div class="example-container">
                <h3>1.2 数字输入</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const simpleNumber = createTreeFromConfig(
          cns('number', 'leaf', 'age', 25, false, {}, [], '年龄')
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="simpleNumber" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 基础样式，无需额外定制 */
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="basicExamples.simpleNumber" />
                </div>
              </div>

              <div class="example-container">
                <h3>1.3 日期输入</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const simpleDate = createTreeFromConfig(
          cns('date', 'leaf', 'birthDate', '1995-01-01', false, {}, [], '出生日期')
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="simpleDate" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 基础样式，无需额外定制 */
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="basicExamples.simpleDate" />
                </div>
              </div>

              <div class="example-container">
                <h3>1.4 选择输入</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const simpleSelection = createTreeFromConfig(
          cns('selection', 'leaf', 'gender', '男', false, {
            options: ['男', '女', '其他']
          }, [], '性别')
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="simpleSelection" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 基础样式，无需额外定制 */
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="basicExamples.simpleSelection" />
                </div>
              </div>
            </section>

            <!-- 2. 简单树结构 -->
            <section id="simple-trees" class="tutorial-section">
              <h2>2. 简单树结构</h2>
              <p>展示如何构建包含多个字段的字典结构。</p>
              
              <div class="example-container">
                <h3>2.1 用户信息表单</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        // 使用 cns 快速构建结构
        const userInfo = createTreeFromConfig(
          cns('dict', 'dict', 'userInfo', {}, false, {}, [
            cns('string', 'leaf', 'username', '张三', false, {}, [], '用户名'),
            cns('number', 'leaf', 'age', 25, false, {}, [], '年龄'),
            cns('string', 'leaf', 'email', 'zhang@example.com', false, {}, [], '邮箱'),
            cns('selection', 'leaf', 'gender', '男', false, {
              options: ['男', '女', '其他']
            }, [], '性别')
          ])
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="userInfo" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 字典结构的基础样式 */
        :deep(.userInfo--dict-header) {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="simpleTreeExamples.userInfo" />
                </div>
              </div>

              <div class="example-container">
                <h3>2.2 简单列表结构</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const simpleList = createTreeFromConfig(
          cns('dynamiclist', 'list', 'hobbies', [], false, {}, [
            cns('string', 'leaf', '', '阅读', false),
            cns('string', 'leaf', '', '游泳', false),
            cns('string', 'leaf', '', '编程', false)
          ], '爱好列表')
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="simpleList" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 动态列表的样式 */
        :deep(.hobbies--list-header) {
          background: #e3f2fd;
          padding: 10px;
          border-radius: 6px;
        }

        :deep(.hobbies--list-item) {
          margin: 5px 0;
          padding: 8px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="simpleTreeExamples.simpleList" />
                </div>
              </div>
            </section>

            <!-- 3. 复杂树结构 -->
            <section id="complex-trees" class="tutorial-section">
              <h2>3. 复杂树结构</h2>
              <p>展示多层嵌套的复杂数据结构。</p>
              
              <div class="example-container">
                <h3>3.1 三层字典嵌套</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const threeLevelDict = createTreeFromConfig(
          cns('dict', 'dict', 'company', {}, false, {}, [
            cns('string', 'leaf', 'name', '科技公司', false, {}, [], '公司名称'),
            cns('dict', 'dict', 'address', {}, false, {}, [
              cns('string', 'leaf', 'country', '中国', false, {}, [], '国家'),
              cns('string', 'leaf', 'city', '北京', false, {}, [], '城市'),
              cns('dict', 'dict', 'detail', {}, false, {}, [
                cns('string', 'leaf', 'street', '中关村大街', false, {}, [], '街道'),
                cns('string', 'leaf', 'building', '科技大厦', false, {}, [], '建筑物'),
                cns('number', 'leaf', 'floor', 15, false, {}, [], '楼层')
              ], '详细地址')
            ], '地址信息')
          ])
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="threeLevelDict" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 多层嵌套的样式 */
        :deep(.company--dict-header) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        :deep(.company-address--dict-header) {
          background: #f0f8ff;
          border-left: 4px solid #4a90e2;
        }

        :deep(.company-address-detail--dict-header) {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="complexTreeExamples.threeLevelDict" />
                </div>
              </div>

              <div class="example-container">
                <h3>3.2 员工项目管理（复杂嵌套）</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const employeeProjects = createTreeFromConfig(
          cns('dict', 'dict', 'employee', {}, false, {}, [
            cns('string', 'leaf', 'name', '李四', false, {}, [], '员工姓名'),
            cns('dynamiclist', 'list', 'projects', [], false, {}, [
              cns('dict', 'dict', '', {}, false, {}, [
                cns('string', 'leaf', 'projectName', '项目A', false, {}, [], '项目名称'),
                cns('date', 'leaf', 'startDate', '2024-01-01', false, {}, [], '开始日期'),
                cns('date', 'leaf', 'endDate', '2024-06-30', false, {}, [], '结束日期'),
                cns('selection', 'leaf', 'status', '进行中', false, {
                  options: ['未开始', '进行中', '已完成', '已暂停']
                }, [], '状态')
              ])
            ], '项目列表')
          ])
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="employeeProjects" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 员工项目管理的样式 */
        :deep(.employee--dict-header) {
          background: #28a745;
          color: white;
          padding: 12px;
          border-radius: 8px;
        }

        :deep(.employee-projects--list-header) {
          background: #17a2b8;
          color: white;
          padding: 10px;
        }

        :deep(.employee-projects--list-item) {
          border: 2px solid #17a2b8;
          border-radius: 8px;
          margin: 10px 0;
          padding: 15px;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="complexTreeExamples.employeeProjects" />
                </div>
              </div>
            </section>

            <!-- 4. 插槽用法详解 -->
            <section id="slots-usage" class="tutorial-section">
              <h2>4. 插槽用法详解</h2>
              <p>VarInput组件提供了多种插槽，允许你完全自定义组件的外观和行为。</p>

              <div class="example-container">
                <h3>4.1 --extra 插槽：添加额外按钮</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const extraSlot = createTreeFromConfig(
          cns('string', 'leaf', '用户名', '张三', false, {}, [], '用户名')
        )

        const handleSearch = (slotProps: any) => {
          alert(`搜索: ${slotProps.allProps.modelValue}`)
        }

        const handleClear = (slotProps: any) => {
          if (slotProps.allProps.node) {
            slotProps.allProps.node.currentValue = ''
          }
        }
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="extraSlot"&gt;
            &lt;template #用户名--extra="slotProps"&gt;
              &lt;button
                class="search-btn"
                @click="handleSearch(slotProps)"
              &gt;
                🔍 搜索
              &lt;/button&gt;
              &lt;button
                class="clear-btn"
                @click="handleClear(slotProps)"
              &gt;
                ✖️ 清除
              &lt;/button&gt;
            &lt;/template&gt;
          &lt;/VarBox&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        .search-btn, .clear-btn {
          margin-left: 8px;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.3s ease;
        }

        .search-btn {
          background: #28a745;
          color: white;
        }

        .search-btn:hover {
          background: #218838;
        }

        .clear-btn {
          background: #dc3545;
          color: white;
        }

        .clear-btn:hover {
          background: #c82333;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="slotExamples.extraSlot">
                    <template #用户名--extra="slotProps">
                      <button class="search-btn" @click="handleSearch(slotProps)">🔍 搜索</button>
                      <button class="clear-btn" @click="handleClear(slotProps)">✖️ 清除</button>
                    </template>
                  </VarBox>
                </div>
              </div>

              <div class="example-container">
                <h3>4.2 --simple 插槽：完全自定义输入组件</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const simpleSlot = createTreeFromConfig(
          cns('number', 'leaf', '年龄', 25, false, {}, [], '年龄')
        )

        const increment = (slotProps: any) => {
          if (slotProps.allProps.node) {
            const currentValue = Number(slotProps.allProps.node.currentValue) || 0
            slotProps.allProps.node.currentValue = currentValue + 1
          }
        }

        const decrement = (slotProps: any) => {
          if (slotProps.allProps.node) {
            const currentValue = Number(slotProps.allProps.node.currentValue) || 0
            slotProps.allProps.node.currentValue = Math.max(0, currentValue - 1)
          }
        }

        const updateValue = (slotProps: any, event: Event) => {
          const target = event.target as HTMLInputElement
          if (slotProps.allProps.node) {
            slotProps.allProps.node.currentValue = Number(target.value)
          }
        }
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="simpleSlot"&gt;
            &lt;template #年龄--simple="slotProps"&gt;
              &lt;div class="custom-number-input"&gt;
                &lt;button @click="decrement(slotProps)"&gt;-&lt;/button&gt;
                &lt;input
                  :value="slotProps.allProps.modelValue"
                  @input="updateValue(slotProps, $event)"
                  type="number"
                  class="number-display"
                /&gt;
                &lt;button @click="increment(slotProps)"&gt;+&lt;/button&gt;
              &lt;/div&gt;
            &lt;/template&gt;
          &lt;/VarBox&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        .custom-number-input {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 4px;
        }

        .custom-number-input button {
          width: 30px;
          height: 30px;
          border: none;
          background: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .custom-number-input button:hover {
          background: #0056b3;
        }

        .number-display {
          width: 80px;
          text-align: center;
          border: none;
          outline: none;
          font-size: 16px;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="slotExamples.simpleSlot">
                    <template #年龄--simple="slotProps">
                      <div class="custom-number-input">
                        <button @click="decrement(slotProps)">-</button>
                        <input
                          :value="slotProps.allProps.modelValue"
                          @input="updateValue(slotProps, $event)"
                          type="number"
                          class="number-display"
                        />
                        <button @click="increment(slotProps)">+</button>
                      </div>
                    </template>
                  </VarBox>
                </div>
              </div>

              <div class="example-container">
                <h3>4.3 --wrapper 插槽：完全自定义容器</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const wrapperSlot = createTreeFromConfig(
          cns('selection', 'leaf', '性别', '男', false, {
            options: ['男', '女', '其他']
          }, [], '性别')
        )

        const updateSelectValue = (slotProps: any, event: Event) => {
          const target = event.target as HTMLSelectElement
          if (slotProps.allProps.node) {
            slotProps.allProps.node.currentValue = target.value
          }
        }
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="wrapperSlot"&gt;
            &lt;template #性别--wrapper="slotProps"&gt;
              &lt;div class="custom-wrapper"&gt;
                &lt;div class="custom-label"&gt;
                  &#123;&#123; slotProps.allProps.node?.nameDisplay &#125;&#125;
                &lt;/div&gt;
                &lt;div class="custom-content"&gt;
                  &lt;select
                    :value="slotProps.allProps.modelValue"
                    @change="updateSelectValue(slotProps, $event)"
                    class="custom-select"
                  &gt;
                    &lt;option value="男"&gt;👨 男&lt;/option&gt;
                    &lt;option value="女"&gt;👩 女&lt;/option&gt;
                    &lt;option value="其他"&gt;🤖 其他&lt;/option&gt;
                  &lt;/select&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/template&gt;
          &lt;/VarBox&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        .custom-wrapper {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .custom-label {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .custom-content {
          display: flex;
          align-items: center;
        }

        .custom-select {
          background: white;
          color: #333;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          width: 100%;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="slotExamples.wrapperSlot">
                    <template #性别--wrapper="slotProps">
                      <div class="custom-wrapper">
                        <div class="custom-label">{{ slotProps.allProps.node?.nameDisplay }}</div>
                        <div class="custom-content">
                          <select
                            :value="slotProps.allProps.modelValue"
                            @change="updateSelectValue(slotProps, $event)"
                            class="custom-select"
                          >
                            <option value="男">👨 男</option>
                            <option value="女">👩 女</option>
                            <option value="其他">🤖 其他</option>
                          </select>
                        </div>
                      </div>
                    </template>
                  </VarBox>
                </div>
              </div>

              <div class="example-container">
                <h3>4.4 --simple-input-group 插槽：日期输入自定义</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const dateSlot = createTreeFromConfig(
          cns('date', 'leaf', '生日', '1995-01-01', false, {}, [], '生日')
        )

        const updateDateValue = (slotProps: any, event: Event) => {
          const target = event.target as HTMLInputElement
          if (slotProps.allProps.node) {
            slotProps.allProps.node.currentValue = target.value
          }
        }

        const setToday = (slotProps: any) => {
          if (slotProps.allProps.node) {
            const today = new Date().toISOString().split('T')[0]
            slotProps.allProps.node.currentValue = today
          }
        }

        const clearDate = (slotProps: any) => {
          if (slotProps.allProps.node) {
            slotProps.allProps.node.currentValue = ''
          }
        }
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="dateSlot"&gt;
            &lt;template #生日--simple-input-group="slotProps"&gt;
              &lt;div class="custom-date-input"&gt;
                &lt;input
                  :value="slotProps.allProps.modelValue"
                  @input="updateDateValue(slotProps, $event)"
                  type="date"
                  class="date-picker"
                /&gt;
                &lt;button @click="setToday(slotProps)" class="today-btn"&gt;
                  今天
                &lt;/button&gt;
                &lt;button @click="clearDate(slotProps)" class="clear-btn"&gt;
                  清除
                &lt;/button&gt;
              &lt;/div&gt;
            &lt;/template&gt;
          &lt;/VarBox&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        .custom-date-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-picker {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .today-btn, .clear-btn {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .today-btn {
          background: #17a2b8;
          color: white;
        }

        .today-btn:hover {
          background: #138496;
        }

        .clear-btn {
          background: #dc3545;
          color: white;
        }

        .clear-btn:hover {
          background: #c82333;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="slotExamples.dateSlot">
                    <template #生日--simple-input-group="slotProps">
                      <div class="custom-date-input">
                        <input
                          :value="slotProps.allProps.modelValue"
                          @input="updateDateValue(slotProps, $event)"
                          type="date"
                          class="date-picker"
                        />
                        <button @click="setToday(slotProps)" class="today-btn">今天</button>
                        <button @click="clearDate(slotProps)" class="clear-btn">清除</button>
                      </div>
                    </template>
                  </VarBox>
                </div>
              </div>
            </section>

            <!-- 5. 钩子用法详解 -->
            <section id="hooks-usage" class="tutorial-section">
              <h2>5. 钩子用法详解</h2>
              <p>通过config.customComponent可以注册自定义组件作为钩子。</p>

              <div class="example-container">
                <h3>5.1 自定义组件钩子</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { markRaw } from 'vue'
        import { createTreeFromConfig, cns } from '@/utils/VarTree'
        import MyCustomInput from '@/test/varbox/MyCustomInput.vue'

        // 创建自定义组件
        const CustomInput = {
          props: ['modelValue', 'readonly', 'placeholder'],
          emits: ['update:modelValue'],
          template: `
            &lt;div class="custom-hook-input"&gt;
              &lt;span&gt;🎯 自定义钩子组件&lt;/span&gt;
              &lt;input
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                :readonly="readonly"
                :placeholder="placeholder"
              /&gt;
            &lt;/div&gt;
          `
        }

        // 在配置中使用
        const customComponent = createTreeFromConfig(
          cns('string', 'leaf', 'customField', '自定义值', false, {
            customComponent: markRaw(MyCustomInput)
          }, [], '自定义字段')
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="customComponent" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 自定义钩子组件的样式 */
        :deep(.custom-hook-input) {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #e8f5e8;
          border: 2px solid #28a745;
          border-radius: 6px;
        }

        :deep(.custom-hook-input span) {
          font-weight: bold;
          color: #28a745;
        }

        :deep(.custom-hook-input input) {
          flex: 1;
          padding: 8px;
          border: 1px solid #28a745;
          border-radius: 4px;
          outline: none;
        }

        :deep(.custom-hook-input input:focus) {
          box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25);
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="hookExamples.customComponent" />
                </div>
              </div>

              <div class="example-container">
                <h3>5.2 带验证的自定义钩子</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { markRaw } from 'vue'
        import { createTreeFromConfig, cns } from '@/utils/VarTree'
        import MyCustomInput from '@/test/varbox/MyCustomInput.vue'

        const validationHook = createTreeFromConfig(
          cns('string', 'leaf', 'email', 'test@example.com', false, {
            customComponent: markRaw(MyCustomInput),
            validators: [
              {
                creteria: (value: any) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  return emailRegex.test(value)
                },
                message: '请输入有效的邮箱地址'
              }
            ]
          }, [], '邮箱地址')
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="validationHook" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 验证钩子的样式 */
        :deep(.email--wrapper.error) {
          border: 2px solid #dc3545;
          background: #f8d7da;
        }

        :deep(.email--error-message) {
          color: #dc3545;
          font-size: 12px;
          margin-top: 5px;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area">
                  <VarBox :tree="hookExamples.validationHook" />
                </div>
              </div>
            </section>

            <!-- 6. Deep CSS 属性用法 -->
            <section id="css-deep" class="tutorial-section">
              <h2>6. Deep CSS 属性用法</h2>
              <p>使用:deep()选择器可以穿透作用域样式，精确控制VarInput组件的样式。</p>

              <div class="example-container">
                <h3>6.1 通过路径精确定位节点</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const pathTargeting = createTreeFromConfig(
          cns('dict', 'dict', 'userInfo', {}, false, {}, [
            cns('dict', 'dict', 'personalInfo', {}, false, {}, [
              cns('string', 'leaf', 'name', '李四', false, {}, [], '姓名'),
              cns('string', 'leaf', 'email', 'li@example.com', false, {}, [], '邮箱')
            ], '个人信息'),
            cns('dict', 'dict', 'workInfo', {}, false, {}, [
              cns('string', 'leaf', 'company', '科技公司', false, {}, [], '公司'),
              cns('string', 'leaf', 'position', '工程师', false, {}, [], '职位')
            ], '工作信息')
          ])
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="pathTargeting" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 通过路径字符串精确定位特定节点 */
        :deep(.userInfo-personalInfo-name--wrapper) {
          background: linear-gradient(45deg, #ff6b6b, #feca57);
          color: white;
          padding: 10px;
          border-radius: 6px;
        }

        :deep(.userInfo-personalInfo-email--leaf-input-container) {
          border: 2px solid #48cae4;
          border-radius: 20px;
          padding: 5px;
        }

        :deep(.userInfo-workInfo--wrapper) {
          background: #f0f8ff;
          border: 1px solid #4a90e2;
          border-radius: 8px;
          padding: 15px;
          margin: 10px 0;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area path-targeting-demo">
                  <VarBox :tree="cssExamples.pathTargeting" />
                </div>
              </div>
            </section>

            <!-- 7. Grid 布局控制 -->
            <section id="grid-layout" class="tutorial-section">
              <h2>7. Grid 布局控制</h2>
              <p>通过:deep()选择器控制字典节点的叶子部分使用Grid布局，实现复杂的表单布局。</p>

              <div class="example-container">
                <h3>7.1 基础Grid布局</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const basicGrid = createTreeFromConfig(
          cns('dict', 'dict', 'userInfo', {}, false, {}, [
            cns('string', 'leaf', 'name', '王五', false, {}, [], '姓名'),
            cns('string', 'leaf', 'email', 'wang@example.com', false, {}, [], '邮箱'),
            cns('number', 'leaf', 'age', 30, false, {}, [], '年龄'),
            cns('string', 'leaf', 'phone', '13800138000', false, {}, [], '电话'),
            cns('string', 'leaf', 'address', '北京市朝阳区', false, {}, [], '地址'),
            cns('selection', 'leaf', 'gender', '男', false, {
              options: ['男', '女', '其他']
            }, [], '性别')
          ])
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="basicGrid" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 设置Grid布局 - 通过路径定位 */
        :deep(.userInfo--dict-leaf-section) {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin: 10px 0;
        }

        /* 字段自动排列，无需指定位置 */
        :deep(.userInfo--dict-leaf-section > *) {
          background: white;
          padding: 10px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area grid-basic-demo">
                  <VarBox :tree="gridExamples.basicGrid" />
                </div>
              </div>

              <div class="example-container">
                <h3>7.2 复杂Grid布局 - 指定位置</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const complexGrid = createTreeFromConfig(
          cns('dict', 'dict', 'userInfo', {}, false, {}, [
            cns('string', 'leaf', 'name', '赵六', false, {}, [], '姓名'),
            cns('string', 'leaf', 'email', 'zhao@example.com', false, {}, [], '邮箱'),
            cns('string', 'leaf', 'phone', '13900139000', false, {}, [], '电话'),
            cns('number', 'leaf', 'age', 28, false, {}, [], '年龄'),
            cns('string', 'leaf', 'address', '上海市浦东新区', false, {}, [], '地址'),
            cns('selection', 'leaf', 'status', '在职', false, {
              options: ['在职', '离职', '休假']
            }, [], '状态')
          ])
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="complexGrid" /&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 复杂Grid布局，指定每个字段的位置 */
        :deep(.userInfo--dict-leaf-section) {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          padding: 20px;
          background: #fff3cd;
          border-radius: 8px;
        }

        /* 通过路径精确指定每个字段的位置 */
        :deep(.userInfo-name--wrapper) {
          grid-row: 1;
          grid-column: 1 / 3;
        }
        :deep(.userInfo-email--wrapper) {
          grid-row: 1;
          grid-column: 3 / 5;
        }
        :deep(.userInfo-phone--wrapper) {
          grid-row: 2;
          grid-column: 1;
        }
        :deep(.userInfo-age--wrapper) {
          grid-row: 2;
          grid-column: 2;
        }
        :deep(.userInfo-address--wrapper) {
          grid-row: 2;
          grid-column: 3;
        }
        :deep(.userInfo-status--wrapper) {
          grid-row: 2;
          grid-column: 4;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area grid-complex-demo">
                  <VarBox :tree="gridExamples.complexGrid" />
                </div>
              </div>

              <div class="example-container">
                <h3>7.3 使用插槽添加额外叶子节点</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        const gridWithSlots = createTreeFromConfig(
          cns('dict', 'dict', 'userInfo', {}, false, {}, [
            cns('string', 'leaf', 'name', '孙七', false, {}, [], '姓名'),
            cns('string', 'leaf', 'email', 'sun@example.com', false, {}, [], '邮箱')
          ])
        )
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="gridWithSlots"&gt;
            &lt;template #userInfo--leaf&gt;
              &lt;div class="extra-grid-item"&gt;
                &lt;label&gt;额外信息&lt;/label&gt;
                &lt;div class="extra-content"&gt;
                  这是通过插槽添加的额外内容
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/template&gt;
          &lt;/VarBox&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* CSS控制额外节点的位置 */
        :deep(.userInfo--dict-leaf-section) {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          padding: 20px;
          background: #e8f5e8;
          border-radius: 8px;
          margin: 10px 0;
        }

        .extra-grid-item {
          grid-column: 3;  /* 放在第3列 */
          grid-row: 1;
          background: #e3f2fd;
          padding: 15px;
          border-radius: 6px;
          border: 2px dashed #2196f3;
        }

        .extra-content {
          margin-top: 8px;
          font-style: italic;
          color: #1976d2;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area grid-slots-demo">
                  <VarBox :tree="gridExamples.gridWithSlots">
                    <template #userInfo--leaf>
                      <div class="extra-grid-item">
                        <label>额外信息</label>
                        <div class="extra-content">这是通过插槽添加的额外内容</div>
                      </div>
                    </template>
                  </VarBox>
                </div>
              </div>
            </section>

            <!-- 8. 高级应用示例 -->
            <section id="advanced-examples" class="tutorial-section">
              <h2>8. 高级应用示例</h2>
              <p>综合运用所有特性的实际应用场景。</p>

              <div class="example-container">
                <h3>8.1 员工管理表单 - 综合示例</h3>

                <div class="code-blocks-container">
                  <div class="code-block">
                    <h4>树定义 (Script)</h4>
                    <div class="code-example">
                      <pre><code>&lt;script lang="ts" setup&gt;
        import { createTreeFromConfig, cns } from '@/utils/VarTree'

        // 综合使用所有特性的员工管理表单
        const employeeForm = createTreeFromConfig(
          cns('dict', 'dict', 'employeeInfo', {}, false, {}, [
            cns('dict', 'dict', 'basicInfo', {}, false, {}, [
              cns('string', 'leaf', 'name', '张三', false, {}, [], '姓名'),
              cns('selection', 'leaf', 'gender', '男', false, {
                options: ['男', '女', '其他']
              }, [], '性别'),
              cns('date', 'leaf', 'birthDate', '1990-01-01', false, {}, [], '出生日期'),
              cns('string', 'leaf', 'phone', '13800138000', false, {}, [], '电话')
            ], '基本信息'),
            cns('dict', 'dict', 'workInfo', {}, false, {}, [
              cns('string', 'leaf', 'department', '技术部', false, {}, [], '部门'),
              cns('string', 'leaf', 'position', '高级工程师', false, {}, [], '职位'),
              cns('number', 'leaf', 'salary', 15000, false, {}, [], '薪资'),
              cns('date', 'leaf', 'hireDate', '2020-01-01', false, {}, [], '入职日期')
            ], '工作信息')
          ])
        )

        // 事件处理函数
        const searchEmployee = (slotProps: any) => {
          alert(`搜索员工: ${slotProps.allProps.modelValue}`)
        }

        const updateSalary = (slotProps: any, event: Event) => {
          const target = event.target as HTMLInputElement
          if (slotProps.allProps.node) {
            slotProps.allProps.node.currentValue = Number(target.value)
          }
        }

        const saveEmployee = () => {
          alert('员工信息已保存')
        }

        const resetEmployee = () => {
          alert('表单已重置')
        }

        const deleteEmployee = () => {
          if (confirm('确定要删除这个员工吗？')) {
            alert('员工已删除')
          }
        }
        &lt;/script&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>模板 (Template)</h4>
                    <div class="code-example">
                      <pre><code>&lt;template&gt;
          &lt;VarBox :tree="employeeForm"&gt;
            &lt;!-- 为姓名字段添加搜索功能 --&gt;
            &lt;template #employeeInfo-basicInfo-name--extra="slotProps"&gt;
              &lt;button
                class="search-employee-btn"
                @click="searchEmployee(slotProps)"
              &gt;
                🔍 搜索员工
              &lt;/button&gt;
            &lt;/template&gt;

            &lt;!-- 自定义薪资输入 --&gt;
            &lt;template #employeeInfo-workInfo-salary--simple="slotProps"&gt;
              &lt;div class="salary-input"&gt;
                &lt;span class="currency"&gt;¥&lt;/span&gt;
                &lt;input
                  :value="slotProps.allProps.modelValue"
                  @input="updateSalary(slotProps, $event)"
                  type="number"
                  class="salary-field"
                  placeholder="请输入薪资"
                /&gt;
                &lt;span class="unit"&gt;元/月&lt;/span&gt;
              &lt;/div&gt;
            &lt;/template&gt;

            &lt;!-- 添加操作按钮区域 --&gt;
            &lt;template #employeeInfo--leaf&gt;
              &lt;div class="action-buttons"&gt;
                &lt;button class="save-btn" @click="saveEmployee"&gt;
                  💾 保存
                &lt;/button&gt;
                &lt;button class="reset-btn" @click="resetEmployee"&gt;
                  🔄 重置
                &lt;/button&gt;
                &lt;button class="delete-btn" @click="deleteEmployee"&gt;
                  🗑️ 删除
                &lt;/button&gt;
              &lt;/div&gt;
            &lt;/template&gt;
          &lt;/VarBox&gt;
        &lt;/template&gt;</code></pre>
                    </div>
                  </div>

                  <div class="code-block">
                    <h4>样式 (Style)</h4>
                    <div class="code-example">
                      <pre><code>&lt;style scoped&gt;
        /* 高级示例样式 */
        :deep(.employeeInfo--dict-leaf-section) {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
          margin: 10px 0;
        }

        .salary-input {
          display: flex;
          align-items: center;
          gap: 5px;
          border: 1px solid #28a745;
          border-radius: 4px;
          padding: 4px 8px;
          background: #f8fff8;
        }

        .currency, .unit {
          font-weight: bold;
          color: #28a745;
        }

        .salary-field {
          border: none;
          outline: none;
          background: transparent;
          text-align: center;
          width: 100px;
          font-size: 16px;
        }

        .action-buttons {
          grid-column: 1 / -1;
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
          padding: 15px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .save-btn, .reset-btn, .delete-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .save-btn {
          background: #28a745;
          color: white;
        }

        .save-btn:hover {
          background: #218838;
          transform: translateY(-2px);
        }

        .reset-btn {
          background: #ffc107;
          color: #212529;
        }

        .reset-btn:hover {
          background: #e0a800;
          transform: translateY(-2px);
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }

        .delete-btn:hover {
          background: #c82333;
          transform: translateY(-2px);
        }

        .search-employee-btn {
          margin-left: 8px;
          padding: 6px 12px;
          background: #17a2b8;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.3s ease;
        }

        .search-employee-btn:hover {
          background: #138496;
        }
        &lt;/style&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div class="demo-area advanced-employee-demo">
                  <VarBox :tree="advancedExamples.employeeForm">
                    <!-- 为姓名字段添加搜索功能 -->
                    <template #employeeInfo-basicInfo-name--extra="slotProps">
                      <button class="search-employee-btn" @click="searchEmployee(slotProps)">
                        🔍 搜索员工
                      </button>
                    </template>

                    <!-- 自定义薪资输入 -->
                    <template #employeeInfo-workInfo-salary--simple="slotProps">
                      <div class="salary-input">
                        <span class="currency">¥</span>
                        <input
                          :value="slotProps.allProps.modelValue"
                          @input="updateSalary(slotProps, $event)"
                          type="number"
                          class="salary-field"
                          placeholder="请输入薪资"
                        />
                        <span class="unit">元/月</span>
                      </div>
                    </template>

                    <!-- 添加操作按钮区域 -->
                    <template #employeeInfo--leaf>
                      <div class="action-buttons">
                        <button class="save-btn" @click="saveEmployee">💾 保存</button>
                        <button class="reset-btn" @click="resetEmployee">🔄 重置</button>
                        <button class="delete-btn" @click="deleteEmployee">🗑️ 删除</button>
                      </div>
                    </template>
                  </VarBox>
                </div>
              </div>
            </section>
          </div>
        </div>
      </template>
    </AppContent>
  </div>
</template>

<script lang="ts" setup>
import { markRaw } from 'vue'
import VarBox from '@/components/varbox/VarBox.vue'
import MyCustomInput from '@/test/varbox/MyCustomInput.vue'
import AppContent from '@/components/applicationContent/AppContent.vue'
import { createTreeFromConfig, cns } from '@/utils/VarTree'

// 基础示例
const basicExamples = {
  simpleString: createTreeFromConfig(
    cns('string', 'leaf', 'username', '张三', false, {}, [], '用户名')
  ),
  simpleNumber: createTreeFromConfig(
    cns('number', 'leaf', 'age', 25, false, {}, [], '年龄')
  ),
  simpleDate: createTreeFromConfig(
    cns('date', 'leaf', 'birthDate', '1995-01-01', false, {}, [], '出生日期')
  ),
  simpleSelection: createTreeFromConfig(
    cns('selection', 'leaf', 'gender', '男', false, {
      options: ['男', '女', '其他']
    }, [], '性别')
  )
}

// 简单树结构示例
const simpleTreeExamples = {
  userInfo: createTreeFromConfig(
    cns('dict', 'dict', 'userInfo', {}, false, {}, [
      cns('string', 'leaf', 'username', '张三', false, {}, [], '用户名'),
      cns('number', 'leaf', 'age', 25, false, {}, [], '年龄'),
      cns('string', 'leaf', 'email', 'zhang@example.com', false, {}, [], '邮箱'),
      cns('selection', 'leaf', 'gender', '男', false, {
        options: ['男', '女', '其他']
      }, [], '性别')
    ])
  ),
  simpleList: createTreeFromConfig(
    cns('dynamiclist', 'list', 'hobbies', [], false, {}, [
      cns('string', 'leaf', '', '阅读', false),
      cns('string', 'leaf', '', '游泳', false),
      cns('string', 'leaf', '', '编程', false)
    ], '爱好列表')
  )
}

// 复杂树结构示例
const complexTreeExamples = {
  threeLevelDict: createTreeFromConfig(
    cns('dict', 'dict', 'company', {}, false, {}, [
      cns('string', 'leaf', 'name', '科技公司', false, {}, [], '公司名称'),
      cns('dict', 'dict', 'address', {}, false, {}, [
        cns('string', 'leaf', 'country', '中国', false, {}, [], '国家'),
        cns('string', 'leaf', 'city', '北京', false, {}, [], '城市'),
        cns('dict', 'dict', 'detail', {}, false, {}, [
          cns('string', 'leaf', 'street', '中关村大街', false, {}, [], '街道'),
          cns('string', 'leaf', 'building', '科技大厦', false, {}, [], '建筑物'),
          cns('number', 'leaf', 'floor', 15, false, {}, [], '楼层')
        ], '详细地址')
      ], '地址信息')
    ])
  ),
  employeeProjects: createTreeFromConfig(
    cns('dict', 'dict', 'employee', {}, false, {}, [
      cns('string', 'leaf', 'name', '李四', false, {}, [], '员工姓名'),
      cns('dynamiclist', 'list', 'projects', [], false, {}, [
        cns('dict', 'dict', '', {}, false, {}, [
          cns('string', 'leaf', 'projectName', '项目A', false, {}, [], '项目名称'),
          cns('date', 'leaf', 'startDate', '2024-01-01', false, {}, [], '开始日期'),
          cns('date', 'leaf', 'endDate', '2024-06-30', false, {}, [], '结束日期'),
          cns('selection', 'leaf', 'status', '进行中', false, {
            options: ['未开始', '进行中', '已完成', '已暂停']
          }, [], '状态')
        ])
      ], '项目列表')
    ])
  )
}

// 插槽示例
const slotExamples = {
  extraSlot: createTreeFromConfig(
    cns('string', 'leaf', '用户名', '张三', false, {}, [], '用户名')
  ),
  simpleSlot: createTreeFromConfig(
    cns('number', 'leaf', '年龄', 25, false, {}, [], '年龄')
  ),
  wrapperSlot: createTreeFromConfig(
    cns('selection', 'leaf', '性别', '男', false, {
      options: ['男', '女', '其他']
    }, [], '性别')
  ),
  dateSlot: createTreeFromConfig(
    cns('date', 'leaf', '生日', '1995-01-01', false, {}, [], '生日')
  )
}

// 钩子示例
const hookExamples = {
  customComponent: createTreeFromConfig(
    cns('string', 'leaf', 'customField', '自定义值', false, {
      customComponent: markRaw(MyCustomInput)
    }, [], '自定义字段')
  ),
  validationHook: createTreeFromConfig(
    cns('string', 'leaf', 'email', 'test@example.com', false, {
      customComponent: markRaw(MyCustomInput),
      validators: [
        {
          creteria: (value: any) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(value)
          },
          message: '请输入有效的邮箱地址'
        }
      ]
    }, [], '邮箱地址')
  )
}

// CSS示例
const cssExamples = {
  customForm: createTreeFromConfig(
    cns('dict', 'dict', 'userInfo', {}, false, {}, [
      cns('string', 'leaf', 'name', '张三', false, {}, [], '姓名'),
      cns('string', 'leaf', 'email', 'zhang@example.com', false, {}, [], '邮箱'),
      cns('number', 'leaf', 'age', 25, false, {}, [], '年龄')
    ])
  ),
  pathTargeting: createTreeFromConfig(
    cns('dict', 'dict', 'userInfo', {}, false, {}, [
      cns('dict', 'dict', 'personalInfo', {}, false, {}, [
        cns('string', 'leaf', 'name', '李四', false, {}, [], '姓名'),
        cns('string', 'leaf', 'email', 'li@example.com', false, {}, [], '邮箱')
      ], '个人信息'),
      cns('dict', 'dict', 'workInfo', {}, false, {}, [
        cns('string', 'leaf', 'company', '科技公司', false, {}, [], '公司'),
        cns('string', 'leaf', 'position', '工程师', false, {}, [], '职位')
      ], '工作信息')
    ])
  )
}

// Grid布局示例
const gridExamples = {
  basicGrid: createTreeFromConfig(
    cns('dict', 'dict', 'userInfo', {}, false, {}, [
      cns('string', 'leaf', 'name', '王五', false, {}, [], '姓名'),
      cns('string', 'leaf', 'email', 'wang@example.com', false, {}, [], '邮箱'),
      cns('number', 'leaf', 'age', 30, false, {}, [], '年龄'),
      cns('string', 'leaf', 'phone', '13800138000', false, {}, [], '电话'),
      cns('string', 'leaf', 'address', '北京市朝阳区', false, {}, [], '地址'),
      cns('selection', 'leaf', 'gender', '男', false, {
        options: ['男', '女', '其他']
      }, [], '性别')
    ])
  ),
  complexGrid: createTreeFromConfig(
    cns('dict', 'dict', 'userInfo', {}, false, {}, [
      cns('string', 'leaf', 'name', '赵六', false, {}, [], '姓名'),
      cns('string', 'leaf', 'email', 'zhao@example.com', false, {}, [], '邮箱'),
      cns('string', 'leaf', 'phone', '13900139000', false, {}, [], '电话'),
      cns('number', 'leaf', 'age', 28, false, {}, [], '年龄'),
      cns('string', 'leaf', 'address', '上海市浦东新区', false, {}, [], '地址'),
      cns('selection', 'leaf', 'status', '在职', false, {
        options: ['在职', '离职', '休假']
      }, [], '状态')
    ])
  ),
  gridWithSlots: createTreeFromConfig(
    cns('dict', 'dict', 'userInfo', {}, false, {}, [
      cns('string', 'leaf', 'name', '孙七', false, {}, [], '姓名'),
      cns('string', 'leaf', 'email', 'sun@example.com', false, {}, [], '邮箱')
    ])
  )
}

// 高级示例
const advancedExamples = {
  employeeForm: createTreeFromConfig(
    cns('dict', 'dict', 'employeeInfo', {}, false, {}, [
      cns('dict', 'dict', 'basicInfo', {}, false, {}, [
        cns('string', 'leaf', 'name', '张三', false, {}, [], '姓名'),
        cns('selection', 'leaf', 'gender', '男', false, {
          options: ['男', '女', '其他']
        }, [], '性别'),
        cns('date', 'leaf', 'birthDate', '1990-01-01', false, {}, [], '出生日期'),
        cns('string', 'leaf', 'phone', '13800138000', false, {}, [], '电话')
      ], '基本信息'),
      cns('dict', 'dict', 'workInfo', {}, false, {}, [
        cns('string', 'leaf', 'department', '技术部', false, {}, [], '部门'),
        cns('string', 'leaf', 'position', '高级工程师', false, {}, [], '职位'),
        cns('number', 'leaf', 'salary', 15000, false, {}, [], '薪资'),
        cns('date', 'leaf', 'hireDate', '2020-01-01', false, {}, [], '入职日期')
      ], '工作信息')
    ])
  )
}

// 事件处理函数
const handleSearch = (slotProps: any) => {
  alert(`搜索: ${slotProps.allProps.modelValue}`)
}

const handleClear = (slotProps: any) => {
  if (slotProps.allProps.node) {
    slotProps.allProps.node.currentValue = ''
  }
}

const increment = (slotProps: any) => {
  if (slotProps.allProps.node) {
    const currentValue = Number(slotProps.allProps.node.currentValue) || 0
    slotProps.allProps.node.currentValue = currentValue + 1
  }
}

const decrement = (slotProps: any) => {
  if (slotProps.allProps.node) {
    const currentValue = Number(slotProps.allProps.node.currentValue) || 0
    slotProps.allProps.node.currentValue = Math.max(0, currentValue - 1)
  }
}

const updateValue = (slotProps: any, event: Event) => {
  const target = event.target as HTMLInputElement
  if (slotProps.allProps.node) {
    slotProps.allProps.node.currentValue = Number(target.value)
  }
}

const updateSelectValue = (slotProps: any, event: Event) => {
  const target = event.target as HTMLSelectElement
  if (slotProps.allProps.node) {
    slotProps.allProps.node.currentValue = target.value
  }
}

const updateDateValue = (slotProps: any, event: Event) => {
  const target = event.target as HTMLInputElement
  if (slotProps.allProps.node) {
    slotProps.allProps.node.currentValue = target.value
  }
}

const setToday = (slotProps: any) => {
  if (slotProps.allProps.node) {
    const today = new Date().toISOString().split('T')[0]
    slotProps.allProps.node.currentValue = today
  }
}

const clearDate = (slotProps: any) => {
  if (slotProps.allProps.node) {
    slotProps.allProps.node.currentValue = ''
  }
}

const searchEmployee = (slotProps: any) => {
  alert(`搜索员工: ${slotProps.allProps.modelValue}`)
}

const updateSalary = (slotProps: any, event: Event) => {
  const target = event.target as HTMLInputElement
  if (slotProps.allProps.node) {
    slotProps.allProps.node.currentValue = Number(target.value)
  }
}

const saveEmployee = () => {
  alert('员工信息已保存')
}

const resetEmployee = () => {
  // 重置表单逻辑
  alert('表单已重置')
}

const deleteEmployee = () => {
  if (confirm('确定要删除这个员工吗？')) {
    alert('员工已删除')
  }
}
</script>

<style scoped>
.vartree-tutorial {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  min-height: 100vh;
}

.tutorial-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.tutorial-header h1 {
  margin: 0 0 15px 0;
  font-size: 2.5em;
  font-weight: 300;
}

.tutorial-description {
  font-size: 1.1em;
  opacity: 0.9;
  margin: 0;
}

.tutorial-nav {
  position: fixed;
  top: 50%;
  left: 0;
  width: 250px;
  height: 60vh;
  background: var(--theme-color-light-a);
  padding: 20px;
  border-right: 2px solid var(--theme-color-light-a);
  overflow-y: auto;
  z-index: 1000;
  transform: translateY(-50%);
}

.tutorial-nav h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.3em;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--theme-color-light-a);
}

.tutorial-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tutorial-nav li {
  margin: 0;
}

.tutorial-nav a {
  display: block;
  color: var(--theme-color);
  text-decoration: none;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-bottom: 5px;
}

.tutorial-nav a:hover {
  background: var(--theme-color-light-a);
  color: var(--theme-color-darker);
  transform: translateX(5px);
}

/* 主要内容区域 */
.tutorial-content {
  margin-left: 270px;
  padding: 20px;
  max-width: 1200px;
}

.tutorial-section {
  margin-bottom: 60px;
  scroll-margin-top: 20px;
}

.tutorial-section h2 {
  color: #333;
  padding-bottom: 10px;
  margin-bottom: 30px;
  font-size: 1.8em;
}

.tutorial-section > p {
  color: #666;
  font-size: 1.1em;
  margin-bottom: 25px;
  line-height: 1.6;
}

.example-container {
  margin-bottom: 40px;
  border: 2px solid var(--theme-color-light-a);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.example-container h3 {
  background: transparent;
  margin: 0;
  padding: 15px 20px;
  color: #495057;
  font-size: 1.2em;
}

.code-example {
  background: #2d3748;
  color: #e2e8f0;
  padding: 20px;
  margin: 0;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
}

/* 三列代码块布局 */
.code-blocks-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 20px;
  align-items: start;
  gap: 3px;
  margin: 3px;
}

.code-block {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.code-block h4 {
  margin: 0;
  padding: 10px 15px;
  background: var(--theme-color-light-a);
  color: #495057;
  font-size: 14px;
  font-weight: 600;
}

.code-block .code-example {
  margin: 0;
  border-radius: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 300px;
}

.code-block .code-example::-webkit-scrollbar {
  display: none;
}

.code-block .code-example pre {
  font-size: 12px;
  padding: 15px;
  margin: 0;
  flex: 1;
  display: flex;
  align-items: flex-start;
}

.demo-area {
  padding: 25px;
  background: transparent;
  border: var(--theme-color-light-a) 1px solid;
  border-radius: 8px;
}



/* 插槽示例样式 */
.search-btn, .clear-btn {
  margin-left: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.search-btn {
  background: #28a745;
  color: white;
}

.search-btn:hover {
  background: #218838;
}

.clear-btn {
  background: #dc3545;
  color: white;
}

.clear-btn:hover {
  background: #c82333;
}

.custom-number-input {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
}

.custom-number-input button {
  width: 30px;
  height: 30px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.custom-number-input button:hover {
  background: #0056b3;
}

.number-display {
  width: 80px;
  text-align: center;
  border: none;
  outline: none;
  font-size: 16px;
}

.custom-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.custom-label {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
}

.custom-content {
  display: flex;
  align-items: center;
}

.custom-select {
  background: white;
  color: #333;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
}

.custom-date-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-picker {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.today-btn, .clear-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.today-btn {
  background: #17a2b8;
  color: white;
}

.today-btn:hover {
  background: #138496;
}

/* CSS示例样式 */
:deep(.userInfo--wrapper) {
  background: #f0f8ff;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
}

:deep(.userInfo--var-label) {
  color: #2c5aa0;
  font-weight: bold;
}

:deep(.userInfo-personalInfo-name--wrapper) {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
  padding: 10px;
  border-radius: 6px;
  margin: 5px 0;
}

:deep(.userInfo-personalInfo-email--leaf-input-container) {
  border: 2px solid #48cae4;
  border-radius: 20px;
  padding: 5px;
}

/* Grid布局样式 */
:deep(.userInfo--dict-leaf-section) {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 10px 0;
}

:deep(.complexForm--dict-leaf-section) {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 20px;
  background: #fff3cd;
  border-radius: 8px;
  margin: 10px 0;
}

:deep(.userInfo-name--wrapper) {
  grid-row: 1;
  grid-column: 1 / 3;
}
:deep(.userInfo-email--wrapper) {
  grid-row: 1;
  grid-column: 3 / 5;
}
:deep(.userInfo-phone--wrapper) {
  grid-row: 2;
  grid-column: 1;
}
:deep(.userInfo-age--wrapper) {
  grid-row: 2;
  grid-column: 2;
}
:deep(.userInfo-address--wrapper) {
  grid-row: 2;
  grid-column: 3;
}
:deep(.userInfo-status--wrapper) {
  grid-row: 2;
  grid-column: 4;
}

:deep(.userInfo--dict-leaf-section) {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 20px;
  background: #e8f5e8;
  border-radius: 8px;
  margin: 10px 0;
}

.extra-grid-item {
  grid-column: 3;
  grid-row: 1;
  background: #e3f2fd;
  padding: 15px;
  border-radius: 6px;
  border: 2px dashed #2196f3;
}

.extra-content {
  margin-top: 8px;
  font-style: italic;
  color: #1976d2;
}

/* 高级示例样式 */
:deep(.employeeInfo--dict-leaf-section) {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 10px 0;
}

.salary-input {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #28a745;
  border-radius: 4px;
  padding: 4px 8px;
  background: #f8fff8;
}

.currency, .unit {
  font-weight: bold;
  color: #28a745;
}

.salary-field {
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  width: 100px;
  font-size: 16px;
}

.action-buttons {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.save-btn, .reset-btn, .delete-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.save-btn {
  background: #28a745;
  color: white;
}

.save-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

.reset-btn {
  background: #ffc107;
  color: #212529;
}

.reset-btn:hover {
  background: #e0a800;
  transform: translateY(-2px);
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.search-employee-btn {
  margin-left: 8px;
  padding: 6px 12px;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.search-employee-btn:hover {
  background: #138496;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .tutorial-nav {
    display: none;
  }

  .tutorial-content {
    margin-left: 0;
    padding: 20px;
  }
}

/* 滚动条样式 */
.tutorial-nav::-webkit-scrollbar {
  width: 6px;
}

.tutorial-nav::-webkit-scrollbar-track {
  background: transparent;
}

.tutorial-nav::-webkit-scrollbar-thumb {
  background: var(--theme-color-light-a);
  border-radius: 3px;
}

.tutorial-nav::-webkit-scrollbar-thumb:hover {
  background: #667eea;
}
</style>
