<template>
  <div class="page-content" :key="forceUpdateKey">
    <!-- 只显示当前stage -->
    <div
      v-if="currentStage >= 0 && currentStage < stages.length"
      class="stage-container"
    >
      <slot
        :name="`stage-${stages[currentStage]}`"
        v-bind="allInterfaces"
      >
        <!-- 默认内容 -->
        <h2>{{ stages[currentStage] }}</h2>
      </slot>

      <!-- 底部导航栏 -->
      <div class="bottom-bar">
        <!-- 自定义插槽内容 -->
        <p>{{ footerMessage }}</p>
        <slot name="footer-content-left" v-bind="allInterfaces"></slot>

        <div class="bottom-bar-spacer"></div>

        <slot name="footer-content-right" v-bind="allInterfaces"></slot>

        <!-- 导航按钮 -->
        <button
          v-if="mergedFooterButtons.showPrev && mergedFooterButtons.prevText != hideMagicString"
          @click="handlePrev"
          class="nav-button prev-button"
          :disabled="isNavigating"
        >
          {{ mergedFooterButtons.prevText }}
        </button>

        <button
          v-if="mergedFooterButtons.showNext && mergedFooterButtons.nextText != hideMagicString"
          @click="handleNext"
          class="nav-button next-button"
          :disabled="isNavigating"
        >
          {{ mergedFooterButtons.nextText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, defineEmits, computed } from 'vue'

// 定义钩子函数类型
type NavigationHook = (currentStage: number, targetStage: number) => boolean | Promise<boolean>

const props = defineProps<{
  stages: string[]
  footerConfig?: any[]
  // 导航钩子函数
  beforeNext?: NavigationHook
  beforePrev?: NavigationHook
  // 按钮显示控制
  showNavButtons?: boolean
  // 自定义按钮文本
  prevText?: string
  nextText?: string
}>()

const emit = defineEmits<{
  (e: 'stage-change', newStage: number, oldStage: number): void
  (e: 'next', currentStage: number): void
  (e: 'prev', currentStage: number): void
}>()

const { stages } = toRefs(props)
const currentStage = ref(0)
const isNavigating = ref(false)
const footerMessage = ref("")

// 切换到指定stage
async function goToStage(index: number) {
  if (index >= 0 && index < stages.value.length && index !== currentStage.value) {
    const oldStage = currentStage.value
    currentStage.value = index
    emit('stage-change', index, oldStage)
  }
}

// 下一步处理函数
async function handleNext() {
  if (isNavigating.value) {
    return
  }
  isNavigating.value = true
  try {
    // 执行前置钩子
    if (props.beforeNext) {
      const canProceed = await props.beforeNext(currentStage.value, currentStage.value + 1)
      if (!canProceed) {
        isNavigating.value = false
        return
      }
    }
    if (currentStage.value >= stages.value.length - 1) {
      isNavigating.value = false
      return
    }

    emit('next', currentStage.value)
    await goToStage(currentStage.value + 1)
  } finally {
    isNavigating.value = false
  }
}

// 上一步处理函数
async function handlePrev() {
  if (isNavigating.value || currentStage.value <= 0) return

  isNavigating.value = true
  try {
    // 执行前置钩子
    if (props.beforePrev) {
      const canProceed = await props.beforePrev(currentStage.value, currentStage.value - 1)
      if (!canProceed) {
        return
      }
    }

    emit('prev', currentStage.value)
    await goToStage(currentStage.value - 1)
  } finally {
    isNavigating.value = false
  }
}

// 兼容旧的next/prev方法
function next() {
  handleNext()
}

function prev() {
  handlePrev()
}

// 控制按钮显示和自定义
const defaultFooterButtons = computed(() => ({
  showPrev: currentStage.value > 0,
  // showNext: currentStage.value < stages.value.length - 1,
  showNext: true,
  prevText: props.prevText || hideMagicString,
  nextText: props.nextText || 'Execute'
}))

const stageFooterConfig = computed(() => {
  // 支持每个stage自定义footer按钮显示与否和文本
  // 用法：<AppContent :footer-config="[{showPrev: false, nextText: '完成'}]"/>
  return props.footerConfig?.[currentStage.value] || {}
})

const mergedFooterButtons = computed(() => ({
  ...defaultFooterButtons.value,
  ...stageFooterConfig.value
}))

const hideMagicString = "/hide"

const forceUpdateKey = ref(0)
const forceUpdate = () => {
  forceUpdateKey.value++
}

// 暴露的方法和属性
defineExpose({
  forceUpdate,
  footerMessage,
  currentStage,
  goToStage,
  next,
  prev,
  handleNext,
  handlePrev,
  isNavigating,
  // 获取当前stage名称
  getCurrentStageName: () => stages.value[currentStage.value],
  // 获取总stage数量
  getTotalStages: () => stages.value.length,
  // 是否是第一个stage
  isFirstStage: () => currentStage.value === 0,
  // 是否是最后一个stage
  isLastStage: () => currentStage.value === stages.value.length - 1,
  // 重置到第一个stage
  reset: () => goToStage(0)
})

const allInterfaces = computed(() => ({
  allProps: props,
  currentStage: currentStage.value,
  stageName: stages.value[currentStage.value],
  isFirstStage: currentStage.value === 0,
  isLastStage: currentStage.value === stages.value.length - 1,
  totalStages: stages.value.length,
  goToStage,
  next: handleNext,
  prev: handlePrev,
  isNavigating: isNavigating.value
}))
</script>

<style scoped>
.page-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stage-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
}

.bottom-bar > :global(.nav-button) {
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.bottom-bar > :global(.nav-button:hover:not(:disabled)) {
  background: #f5f5f5;
  border-color: #b0b0b0;
}

.bottom-bar > :global(.nav-button:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

.bottom-bar > :global(.prev-button) {
  color: #666;
}

.bottom-bar > :global(.next-button) {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.bottom-bar > :global(.next-button:hover:not(:disabled)) {
  background: #0056b3;
  border-color: #0056b3;
}
</style>