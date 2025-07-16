<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Main from './Main.vue';
const mainRef = ref(null) as any;
onMounted(() => {
  mainRef.value.appToState('change')
})
</script>

<template>
  <Main
    ref="mainRef"
  />
</template>
