<template>
  <div class="app-picker-modal">
    <div class="app-picker-panel" @click.stop>
      <div class="app-picker-header">
        <h4>选择应用</h4>
        <button class="close" @click="$emit('close')">×</button>
      </div>
      <input 
        class="search-input" 
        v-model="searchQuery" 
        placeholder="按名称搜索..."
      />
      <div class="app-picker-grid">
        <div 
          v-for="app in filteredApps" 
          :key="app.pagePath" 
          class="app-option" 
          @click="$emit('choose', app)"
        >
          <span class="app-name">{{ app.name }}</span>
          <span class="app-route">{{ app.pagePath }}</span>
        </div>
      </div>
    </div>
    <div class="app-picker-mask" @click="$emit('close')"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

type CustomApp = { name: string; pagePath: string; iconPath?: string }

const props = defineProps<{
  availableApps?: CustomApp[]
}>()

const emit = defineEmits<{
  close: []
  choose: [app: CustomApp]
}>()

const searchQuery = ref('')

const filteredApps = computed(() => {
  const apps = props.availableApps || []
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return apps
  return apps.filter(a => 
    a.name.toLowerCase().includes(q) || 
    a.pagePath.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.app-picker-modal { 
  position: fixed; 
  inset: 0; 
  z-index: 1000; 
}

.app-picker-mask { 
  position: absolute; 
  inset: 0; 
  background: rgba(0,0,0,0.35); 
}

.app-picker-panel { 
  position: absolute; 
  right: 0; 
  top: var(--nav-height, 48px); 
  height: calc(100vh - var(--nav-height, 48px)); 
  width: 520px; 
  background: var(--theme-color-page); 
  box-shadow: -4px 0 16px rgba(0,0,0,0.25); 
  padding: 14px; 
  overflow: hidden; 
  z-index: 1001; 
}

.app-picker-header { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
}

.app-picker-header .close { 
  background: transparent; 
  border: none; 
  font-size: 22px; 
  color: var(--theme-color-dark); 
  cursor: pointer; 
}

.search-input { 
  width: 100%; 
  height: 32px; 
  padding: 0 8px; 
  margin: 10px 0; 
  border-radius: 6px; 
  border: 1px solid var(--theme-color-lighter); 
  background: #fff; 
  color: #333; 
}

.app-picker-grid { 
  height: calc(100% - 90px); 
  overflow: auto; 
  display: grid; 
  grid-template-columns: 1fr; 
  gap: 8px; 
}

.app-option { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 10px; 
  border: 1px solid var(--theme-color-lighter); 
  border-radius: 6px; 
  background: var(--theme-color-contrast); 
  cursor: pointer; 
}

.app-option:hover { 
  background: var(--theme-color-light-a); 
}

.app-name { 
  color: var(--theme-color-dark); 
  font-weight: 600; 
}

.app-route { 
  color: var(--theme-color-light); 
  font-size: 12px; 
}
</style>
