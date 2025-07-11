<template>
  <div class="example-application">
    <AppContent
      :stages="stages"
      :showNavButtons="true"
      :beforeNext="beforeNext"
      :beforePrev="beforePrev"
      :prevText="'上一步'"
      :nextText="'下一步'"
      @stage-change="handleStageChange"
      @next="handleNext"
      @prev="handlePrev"
      ref="appContentRef"
    >
      <!-- 阶段1: 员工基本信息录入 -->
      <template #stage-基本信息录入="{ currentStage, stageName, totalStages }">
        <div class="stage-content">
          <div class="stage-header">
            <div class="progress-indicator">
              <span class="progress-text">步骤 {{ currentStage + 1 }} / {{ totalStages }}</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${((currentStage + 1) / totalStages) * 100}%` }"></div>
              </div>
            </div>
            <h2>{{ stageName }}</h2>
            <p class="stage-description">请填写员工的基本信息，包括个人资料和联系方式</p>
          </div>
          
          <div class="form-container" :key="forceUpdateKey">
            <VarBox
              :tree="employeeBasicInfoTree"
              @update="handleBasicInfoUpdate"
            />
          </div>
          

        </div>
      </template>

      <!-- 阶段2: 部门与职位信息 -->
      <template #stage-部门职位="{ currentStage, stageName, totalStages }">
        <div class="stage-content">
          <div class="stage-header">
            <div class="progress-indicator">
              <span class="progress-text">步骤 {{ currentStage + 1 }} / {{ totalStages }}</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${((currentStage + 1) / totalStages) * 100}%` }"></div>
              </div>
            </div>
            <h2>{{ stageName }}</h2>
            <p class="stage-description">选择员工的部门和职位信息，支持搜索功能</p>
          </div>
          
          <div class="form-container">
            <VarBox
              :tree="employeeDepartmentTree"
              @update="handleDepartmentUpdate"
            />
          </div>
          

        </div>
      </template>

      <!-- 阶段3: 技能与经验 -->
      <template #stage-技能经验="{ currentStage, stageName, totalStages }">
        <div class="stage-content">
          <div class="stage-header">
            <div class="progress-indicator">
              <span class="progress-text">步骤 {{ currentStage + 1 }} / {{ totalStages }}</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${((currentStage + 1) / totalStages) * 100}%` }"></div>
              </div>
            </div>
            <h2>{{ stageName }}</h2>
            <p class="stage-description">添加员工的技能和工作经验，支持动态列表管理</p>
          </div>
          
          <div class="form-container">
            <VarBox
              :tree="employeeSkillsTree"
              @update="handleSkillsUpdate"
            />
          </div>
          

        </div>
      </template>

      <!-- 阶段4: 数据预览与确认 -->
      <template #stage-预览确认="{ currentStage, stageName, totalStages }">
        <div class="stage-content">
          <div class="stage-header">
            <div class="progress-indicator">
              <span class="progress-text">步骤 {{ currentStage + 1 }} / {{ totalStages }}</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${((currentStage + 1) / totalStages) * 100}%` }"></div>
              </div>
            </div>
            <h2>{{ stageName }}</h2>
            <p class="stage-description">请确认所有信息无误后提交</p>
          </div>
          
          <div class="preview-container">
            <div class="preview-section">
              <h3>基本信息</h3>
              <VarBox
                :tree="employeeBasicInfoTree"
                :readonly="true"
              />
            </div>
            
            <div class="preview-section">
              <h3>部门职位</h3>
              <VarBox
                :tree="employeeDepartmentTree"
                :readonly="true"
              />
            </div>
            
            <div class="preview-section">
              <h3>技能经验</h3>
              <VarBox
                :tree="employeeSkillsTree"
                :readonly="true"
              />
            </div>
          </div>
          

        </div>
      </template>

      <!-- 阶段5: 提交结果 -->
      <template #stage-提交结果="{ stageName }">
        <div class="stage-content">
          <div class="stage-header">
            <h2>{{ stageName }}</h2>
          </div>
          
          <div class="result-container">
            <div v-if="submitSuccess" class="success-message">
              <div class="success-icon">✓</div>
              <h3>员工信息提交成功！</h3>
              <p>员工ID: {{ submittedEmployeeId }}</p>
              <p>提交时间: {{ submitTime }}</p>
            </div>
            
            <div v-else class="error-message">
              <div class="error-icon">✗</div>
              <h3>提交失败</h3>
              <p>{{ submitError }}</p>
            </div>
          </div>
          

        </div>
      </template>

      <!-- Footer导航按钮 - 只在最后阶段显示自定义按钮 -->
      <template #footer-content-right="{ currentStage }">
        <!-- 阶段4: 提交结果 - 显示自定义按钮 -->
        <div v-if="currentStage === 4" class="stage-actions">
          <button class="btn btn-primary" @click="resetForm">
            重新开始
          </button>
          <button class="btn btn-secondary" @click="goToDirectory">
            返回应用目录
          </button>
        </div>
      </template>
    </AppContent>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppContent from '@/components/applicationContent/AppContent.vue'
import VarBox from '@/components/varbox/VarBox.vue'
import { VarTree, createTreeFromConfig, cns, SearchMethod } from '@/utils/VarTree'

const router = useRouter()
const appContentRef = ref()

// 阶段定义
const stages = ref(['基本信息录入', '部门职位', '技能经验', '预览确认', '提交结果'])

// 状态管理
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')
const submittedEmployeeId = ref('')
const submitTime = ref('')

// 数据验证状态
const isBasicInfoValid = computed(() => {
  // 触发强制更新以确保计算属性重新计算
  forceUpdateKey.value

  const basicInfo = employeeBasicInfoTree.root?.currentValue as any
  if (!basicInfo) return false

  // 检查核心必填字段
  const coreRequiredFields = ['name', 'email', 'phone']
  const hasCoreFields = coreRequiredFields.every(field => {
    const value = basicInfo[field]
    return value && String(value).trim().length > 0
  })

  console.log('基本信息验证:', {
    basicInfo,
    hasCoreFields,
    name: basicInfo.name,
    email: basicInfo.email,
    phone: basicInfo.phone,
    forceUpdateKey: forceUpdateKey.value
  })

  return hasCoreFields
})

const isDepartmentInfoValid = computed(() => {
  // 触发强制更新
  forceUpdateKey.value

  const deptInfo = employeeDepartmentTree.root?.currentValue as any
  if (!deptInfo) return false

  const isValid = deptInfo.department && String(deptInfo.department).trim().length > 0 &&
                  deptInfo.position && String(deptInfo.position).trim().length > 0

  console.log('部门信息验证:', {
    deptInfo,
    isValid,
    department: deptInfo?.department,
    position: deptInfo?.position,
    forceUpdateKey: forceUpdateKey.value
  })

  return isValid
})

// 员工基本信息数据树
const employeeBasicInfoTree = createTreeFromConfig(
  cns('dict', 'dict', 'basicInfo', {}, false, {}, [
    cns('string', 'leaf', 'name', '', false, {}, [], '姓名'),
    cns('string', 'leaf', 'email', '', false, {}, [], '邮箱'),
    cns('string', 'leaf', 'phone', '', false, {}, [], '电话'),
    cns('date', 'leaf', 'birthDate', null, false, {}, [], '出生日期'),
    cns('selection', 'leaf', 'gender', '', false, {
      options: ['男', '女', '其他']
    }, [], '性别'),
    cns('dict', 'dict', 'address', {}, false, {}, [
      cns('string', 'leaf', 'province', '', false, {}, [], '省份'),
      cns('string', 'leaf', 'city', '', false, {}, [], '城市'),
      cns('string', 'leaf', 'district', '', false, {}, [], '区县'),
      cns('string', 'leaf', 'street', '', false, {}, [], '详细地址'),
      cns('string', 'leaf', 'zipCode', '', false, {}, [], '邮政编码'),
    ], '地址信息'),
    cns('string', 'leaf', 'idCard', '', false, {}, [], '身份证号'),
    cns('dict', 'dict', 'emergencyContact', {}, false, {}, [
      cns('string', 'leaf', 'name', '', false, {}, [], '紧急联系人姓名'),
      cns('string', 'leaf', 'relationship', '', false, {}, [], '关系'),
      cns('string', 'leaf', 'phone', '', false, {}, [], '联系电话'),
    ], '紧急联系人'),
  ], '基本信息')
)

// 创建搜索方法
const createDepartmentSearchMethods = (): SearchMethod[] => [
  {
    name: '部门搜索',
    paramTree: createTreeFromConfig(
      cns('dict', 'dict', 'deptSearchParams', {}, false, {}, [
        cns('string', 'leaf', 'deptName', '', false, {}, [], '部门名称'),
        cns('selection', 'leaf', 'deptType', '', false, {
          options: ['技术部', '市场部', '人事部', '财务部', '运营部', '产品部']
        }, [], '部门类型'),
      ], '部门搜索参数')
    ) as VarTree,
    serviceUrl: '/api/search/mock/department',
    resultHeaderDisplay: {
      id: 'ID',
      result: '部门名称',
      description: '描述',
      deptType: '部门类型',
      headCount: '人数'
    }
  },
  {
    name: '职位搜索',
    paramTree: createTreeFromConfig(
      cns('dict', 'dict', 'positionSearchParams', {}, false, {}, [
        cns('string', 'leaf', 'positionName', '', false, {}, [], '职位名称'),
        cns('selection', 'leaf', 'level', '', false, {
          options: ['初级', '中级', '高级', '专家', '管理']
        }, [], '职位级别'),
        cns('number', 'leaf', 'minSalary', null, false, {}, [], '最低薪资'),
        cns('number', 'leaf', 'maxSalary', null, false, {}, [], '最高薪资'),
      ], '职位搜索参数')
    ) as VarTree,
    serviceUrl: '/api/search/mock/position',
    resultHeaderDisplay: {
      id: 'ID',
      result: '职位名称',
      description: '描述',
      level: '职位级别',
      department: '所属部门',
      suggestedSalary: '建议薪资',
      requirements: '任职要求'
    }
  }
]

const createManagerSearchMethods = (): SearchMethod[] => [
  {
    name: '员工搜索',
    paramTree: createTreeFromConfig(
      cns('dict', 'dict', 'managerSearchParams', {}, false, {}, [
        cns('string', 'leaf', 'employeeName', '', false, {}, [], '员工姓名'),
        cns('string', 'leaf', 'employeeId', '', false, {}, [], '员工ID'),
        cns('selection', 'leaf', 'department', '', false, {
          options: ['技术部', '市场部', '人事部', '财务部', '运营部', '产品部']
        }, [], '所在部门'),
      ], '员工搜索参数')
    ) as VarTree,
    serviceUrl: '/api/search/mock/employee',
    resultHeaderDisplay: {
      id: 'ID',
      result: '员工姓名',
      description: '描述',
      position: '职位',
      department: '所在部门',
      level: '职级'
    }
  }
]

// 自定义搜索结果处理函数
const customDepartmentHandler = (data: any, currentNode: any) => {
  console.log('部门搜索结果处理:', data)
  if (data.firstSelectedResult) {
    currentNode.currentValue = data.firstSelectedResult.result
  }
}

const customPositionHandler = (data: any, currentNode: any) => {
  console.log('职位搜索结果处理:', data)
  if (data.firstSelectedResult) {
    // 设置职位名称和建议薪资
    currentNode.currentValue = data.firstSelectedResult.result

    // 如果有薪资信息，自动填充薪资字段
    if (data.firstSelectedResult.suggestedSalary) {
      const salaryNode = employeeDepartmentTree.root?.children.find(child => child.name === 'salary')
      if (salaryNode) {
        salaryNode.currentValue = data.firstSelectedResult.suggestedSalary
      }
    }
  }
}

const customManagerHandler = (data: any, currentNode: any) => {
  console.log('上级搜索结果处理:', data)
  if (data.firstSelectedResult) {
    currentNode.currentValue = data.firstSelectedResult.result
  }
}

// 部门职位信息数据树（集成搜索功能）
const employeeDepartmentTree = createTreeFromConfig(
  cns('dict', 'dict', 'departmentInfo', {}, false, {}, [
    cns('string', 'leaf', 'department', '', false, {
      searchMethods: createDepartmentSearchMethods(),
      customSearchResultHandler: customDepartmentHandler
    }, [], '部门'),
    cns('string', 'leaf', 'position', '', false, {
      searchMethods: createDepartmentSearchMethods().slice(1), // 只使用职位搜索
      customSearchResultHandler: customPositionHandler
    }, [], '职位'),
    cns('date', 'leaf', 'hireDate', null, false, {
      validators: [
        { creteria: (value: any) => {
          if (!value) return false
          const hireDate = new Date(value)
          const today = new Date()
          return hireDate <= today
        }, message: '入职日期不能晚于今天' }
      ]
    }, [], '入职日期'),
    cns('number', 'leaf', 'salary', null, false, {
      validators: [
        { creteria: (value: any) => !value || (value >= 3000 && value <= 100000), message: '薪资范围应在3000-100000之间' }
      ]
    }, [], '薪资'),
    cns('string', 'leaf', 'manager', '', false, {
      searchMethods: createManagerSearchMethods(),
      customSearchResultHandler: customManagerHandler
    }, [], '直属上级'),
  ], '部门职位信息')
)

// 创建技能搜索方法
const createSkillSearchMethods = (): SearchMethod[] => [
  {
    name: '技能库搜索',
    paramTree: createTreeFromConfig(
      cns('dict', 'dict', 'skillSearchParams', {}, false, {}, [
        cns('string', 'leaf', 'skillName', '', false, {}, [], '技能名称'),
        cns('selection', 'leaf', 'category', '', false, {
          options: ['编程语言', '框架技术', '数据库', '工具软件', '软技能', '认证证书']
        }, [], '技能分类'),
        cns('selection', 'leaf', 'level', '', false, {
          options: ['初级', '中级', '高级', '专家']
        }, [], '要求级别'),
      ], '技能搜索参数')
    ) as VarTree,
    serviceUrl: '/api/search/mock/skill',
    resultHeaderDisplay: {
      id: 'ID',
      result: '技能名称',
      description: '描述',
      category: '技能分类',
      suggestedLevel: '建议级别'
    }
  }
]

const createCompanySearchMethods = (): SearchMethod[] => [
  {
    name: '公司搜索',
    paramTree: createTreeFromConfig(
      cns('dict', 'dict', 'companySearchParams', {}, false, {}, [
        cns('string', 'leaf', 'companyName', '', false, {}, [], '公司名称'),
        cns('selection', 'leaf', 'industry', '', false, {
          options: ['互联网', '金融', '制造业', '教育', '医疗', '零售', '咨询']
        }, [], '行业'),
        cns('selection', 'leaf', 'scale', '', false, {
          options: ['创业公司', '中小企业', '大型企业', '跨国公司']
        }, [], '公司规模'),
      ], '公司搜索参数')
    ) as VarTree,
    serviceUrl: '/api/search/mock/company',
    resultHeaderDisplay: {
      id: 'ID',
      result: '公司名称',
      description: '描述',
      industry: '行业',
      scale: '规模'
    }
  }
]

// 技能搜索结果处理
const customSkillHandler = (data: any, currentNode: any) => {
  console.log('技能搜索结果处理:', data)
  if (data.firstSelectedResult) {
    currentNode.currentValue = data.firstSelectedResult.result

    // 如果有建议的熟练程度，自动填充
    if (data.firstSelectedResult.suggestedLevel) {
      const skillNode = currentNode.parent
      const levelNode = skillNode?.children.find((child: any) => child.name === 'level')
      if (levelNode) {
        levelNode.currentValue = data.firstSelectedResult.suggestedLevel
      }
    }
  }
}

// 公司搜索结果处理
const customCompanyHandler = (data: any, currentNode: any) => {
  console.log('公司搜索结果处理:', data)
  if (data.firstSelectedResult) {
    currentNode.currentValue = data.firstSelectedResult.result
  }
}

// 技能经验数据树
const employeeSkillsTree = createTreeFromConfig(
  cns('dict', 'dict', 'skillsInfo', {}, false, {}, [
    cns('dynamiclist', 'list', 'skills', [], false, {}, [
      cns('dict', 'dict', 'skill', {}, false, {}, [
        cns('string', 'leaf', 'skillName', '', false, {
          searchMethods: createSkillSearchMethods(),
          customSearchResultHandler: customSkillHandler
        }, [], '技能名称'),
        cns('selection', 'leaf', 'level', '', false, {
          options: ['初级', '中级', '高级', '专家']
        }, [], '熟练程度'),
        cns('number', 'leaf', 'experience', null, false, {
          validators: [
            { creteria: (value: any) => !value || (value >= 0 && value <= 50), message: '经验年限应在0-50年之间' }
          ]
        }, [], '经验年限'),
      ])
    ], '技能列表'),
    cns('dynamiclist', 'list', 'workExperience', [], false, {}, [
      cns('dict', 'dict', 'experience', {}, false, {}, [
        cns('string', 'leaf', 'company', '', false, {
          searchMethods: createCompanySearchMethods(),
          customSearchResultHandler: customCompanyHandler
        }, [], '公司名称'),
        cns('string', 'leaf', 'position', '', false, {}, [], '职位'),
        cns('date', 'leaf', 'startDate', null, false, {
          validators: [
            { creteria: (value: any) => {
              if (!value) return false
              const startDate = new Date(value)
              const today = new Date()
              return startDate <= today
            }, message: '开始时间不能晚于今天' }
          ]
        }, [], '开始时间'),
        cns('date', 'leaf', 'endDate', null, false, {
          validators: [
            { creteria: (value: any) => {
              if (!value) return true // 结束时间可以为空（表示至今）
              const endDate = new Date(value)
              const today = new Date()
              return endDate <= today
            }, message: '结束时间不能晚于今天' }
          ]
        }, [], '结束时间'),
        cns('string', 'leaf', 'description', '', false, {}, [], '工作描述'),
      ])
    ], '工作经历'),
  ], '技能经验')
)

// 强制更新计数器
const forceUpdateKey = ref(0)
const forceUpdate = () => {
  forceUpdateKey.value++
}

// 事件处理函数
function handleBasicInfoUpdate(payload: any) {
  console.log('基本信息更新:', payload)
  // 强制更新以触发计算属性重新计算
  forceUpdate()
}

function handleDepartmentUpdate(payload: any) {
  console.log('部门信息更新:', payload)
  forceUpdate()
}

function handleSkillsUpdate(payload: any) {
  console.log('技能信息更新:', payload)
  forceUpdate()
}

function handleStageChange(newStage: number, oldStage: number) {
  console.log(`阶段变更: ${oldStage} -> ${newStage}`)
}

function handleNext(currentStage: number) {
  console.log('下一步:', currentStage)
}

function handlePrev(currentStage: number) {
  console.log('上一步:', currentStage)
}

// 导航钩子 - 专注于每个阶段的验证和业务逻辑
async function beforeNext(currentStage: number, targetStage: number): Promise<boolean> {
  console.log(`准备从阶段 ${currentStage} 前进到 ${targetStage}`)

  switch (currentStage) {
    case 0: // 基本信息录入 -> 部门职位
      if (!isBasicInfoValid.value) {
        alert('请完善基本信息（姓名、邮箱、电话）后再继续')
        return false
      }
      console.log('基本信息验证通过')
      break

    case 1: // 部门职位 -> 技能经验
      if (!isDepartmentInfoValid.value) {
        alert('请完善部门职位信息（部门、职位）后再继续')
        return false
      }
      console.log('部门职位信息验证通过')
      break

    case 2: // 技能经验 -> 预览确认
      // 可选验证：检查技能列表的完整性
      const skillsInfo = employeeSkillsTree.root?.currentValue as any
      if (skillsInfo?.skills && skillsInfo.skills.length > 0) {
        const incompleteSkills = skillsInfo.skills.some((skill: any) =>
          !skill.skillName || !skill.level
        )
        if (incompleteSkills) {
          const confirmed = confirm('技能列表中有未完成的项目，是否继续？')
          if (!confirmed) return false
        }
      }
      console.log('技能经验信息检查完成')
      break

    case 3: // 预览确认 -> 提交结果
      // 执行提交逻辑
      const submitResult = await submitEmployeeData()
      if (!submitResult) {
        console.log('提交失败，停留在当前阶段')
        return false
      }
      console.log('数据提交成功')
      break

    default:
      break
  }

  return true
}

async function beforePrev(currentStage: number, targetStage: number): Promise<boolean> {
  console.log(`准备从阶段 ${currentStage} 返回到 ${targetStage}`)

  switch (currentStage) {
    case 4: // 从提交结果返回
      const confirmed = confirm('返回将丢失提交结果，是否确认？')
      if (!confirmed) return false
      break

    case 3: // 从预览确认返回
      console.log('返回编辑模式')
      break

    default:
      // 其他阶段直接允许返回
      break
  }

  return true
}

// 提交员工数据
async function submitEmployeeData(): Promise<boolean> {
  isSubmitting.value = true

  try {
    // 收集所有数据
    const employeeData = {
      basicInfo: employeeBasicInfoTree.root?.currentValue,
      departmentInfo: employeeDepartmentTree.root?.currentValue,
      skillsInfo: employeeSkillsTree.root?.currentValue,
    }

    console.log('提交员工数据:', employeeData)

    // 调用真实的后端API
    const response = await fetch('http://localhost:3000/api/employee/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData)
    })

    const result = await response.json()

    if (result.success) {
      submitSuccess.value = true
      submittedEmployeeId.value = result.data.employeeId
      submitTime.value = new Date().toLocaleString()
      console.log('员工创建成功:', result.data)
    } else {
      throw new Error(result.message || '提交失败')
    }

    return true
  } catch (error) {
    console.error('提交失败:', error)
    submitSuccess.value = false
    submitError.value = error instanceof Error ? error.message : '网络错误，请检查后端服务是否启动'
    return true // 仍然允许进入结果页面显示错误
  } finally {
    isSubmitting.value = false
  }
}

// 重置表单
function resetForm() {
  // 重置所有数据树
  if (employeeBasicInfoTree.root) {
    employeeBasicInfoTree.root.currentValue = {}
  }
  if (employeeDepartmentTree.root) {
    employeeDepartmentTree.root.currentValue = {}
  }
  if (employeeSkillsTree.root) {
    employeeSkillsTree.root.currentValue = {}
  }

  // 重置状态
  isSubmitting.value = false
  submitSuccess.value = false
  submitError.value = ''
  submittedEmployeeId.value = ''
  submitTime.value = ''

  // 返回第一个阶段
  appContentRef.value?.goToStage(0)
}

// 返回应用目录
function goToDirectory() {
  router.push('/application')
}

onMounted(() => {
  console.log('Example Application 已加载')
})
</script>

<style scoped>
.example-application {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stage-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.stage-header {
  margin-bottom: 20px;
}

.progress-indicator {
  margin-bottom: 16px;
}

.progress-text {
  display: block;
  font-size: 12px;
  color: var(--theme-color-text-secondary);
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: var(--theme-color-border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--theme-color-primary);
  transition: width 0.3s ease;
}

.stage-header h2 {
  margin: 0 0 8px 0;
  color: var(--theme-color-dark);
  font-size: 24px;
}

.stage-description {
  margin: 0;
  color: var(--theme-color-text-secondary);
  font-size: 14px;
}

.form-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.preview-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.preview-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid var(--theme-color-border);
  border-radius: 8px;
  background-color: var(--theme-color-lighter-a);
}

.preview-section h3 {
  margin: 0 0 15px 0;
  color: var(--theme-color-dark);
  font-size: 18px;
}

.stage-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--theme-color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--theme-color-primary-dark);
}

.btn-secondary {
  background-color: var(--theme-color-secondary);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--theme-color-secondary-dark);
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
}

.result-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-message, .error-message {
  text-align: center;
  padding: 40px;
  border-radius: 8px;
}

.success-message {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.error-message {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.success-icon, .error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.success-message h3, .error-message h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
}

.success-message p, .error-message p {
  margin: 4px 0;
  font-size: 14px;
}
</style>
