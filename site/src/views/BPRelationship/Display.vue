<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Main from './Main.vue';
const mainRef = ref(null) as any;
onMounted(() => {
  mainRef.value.appToState('display')
})
</script>

<template>
  <Main
    ref="mainRef"
  />
</template>
