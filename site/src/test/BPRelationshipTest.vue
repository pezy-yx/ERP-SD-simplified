<template>
  <div class="bp-relationship-test">
    <h1>BP Relationship Test Page</h1>
    
    <div class="test-buttons">
      <button @click="testCreate" class="test-btn create">Test Create Mode</button>
      <button @click="testDisplay" class="test-btn display">Test Display Mode</button>
      <button @click="testChange" class="test-btn change">Test Change Mode</button>
      <button @click="testAPI" class="test-btn api">Test API Direct</button>
    </div>
    
    <div class="test-content">
      <h2>Current Mode: {{ currentMode }}</h2>
      <div v-if="showComponent">
        <CreateBP v-if="currentMode === 'create'" />
        <DisplayBP v-if="currentMode === 'display'" />
        <ChangeBP v-if="currentMode === 'change'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CreateBP from '@/views/BPRelationship/Create.vue'
import DisplayBP from '@/views/BPRelationship/Display.vue'
import ChangeBP from '@/views/BPRelationship/Change.vue'

const currentMode = ref('')
const showComponent = ref(false)

function testCreate() {
  currentMode.value = 'create'
  showComponent.value = true
}

function testDisplay() {
  currentMode.value = 'display'
  showComponent.value = true
}

function testChange() {
  currentMode.value = 'change'
  showComponent.value = true
}
</script>

<style scoped>
.bp-relationship-test {
  padding: 20px;
}

.test-buttons {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.test-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.test-btn.create {
  background-color: #4CAF50;
  color: white;
}

.test-btn.display {
  background-color: #2196F3;
  color: white;
}

.test-btn.change {
  background-color: #FF9800;
  color: white;
}

.test-btn:hover {
  opacity: 0.8;
}

.test-content {
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 4px;
}
</style>
