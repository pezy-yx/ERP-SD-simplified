<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Main from './Main.vue'

const mainRef = ref(null) as any

onMounted(() => {
  if (mainRef.value) {
    mainRef.value.appToState('change')
  }
})
</script>

<template>
  <Main ref="mainRef" />
</template>