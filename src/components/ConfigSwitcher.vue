<template>
  <div v-if="isDev" class="config-switcher">
    <div class="switcher-header">
      <h3>配置切换器</h3>
      <span class="env-badge" :class="currentMode">{{ currentMode }}</span>
    </div>
    
    <div class="switcher-content">
      <div class="config-item">
        <label>
          <input 
            type="checkbox" 
            v-model="localConfig.enableScaleScreen"
            @change="updateConfig"
          />
          启用大屏自适应
        </label>
        <span class="status" :class="{ active: localConfig.enableScaleScreen }">
          {{ localConfig.enableScaleScreen ? '已启用' : '已禁用' }}
        </span>
      </div>
      
      <div class="config-item">
        <label>
          <input 
            type="checkbox" 
            v-model="localConfig.enableFullScreen"
            @change="updateConfig"
          />
          启用全屏模式
        </label>
        <span class="status" :class="{ active: localConfig.enableFullScreen }">
          {{ localConfig.enableFullScreen ? '已启用' : '已禁用' }}
        </span>
      </div>
      
      <div class="config-info">
        <p><strong>当前环境:</strong> {{ envConfig.mode }}</p>
        <p><strong>设计稿尺寸:</strong> {{ envConfig.designWidth }} x {{ envConfig.designHeight }}</p>
        <p><strong>自适应状态:</strong> {{ localConfig.enableScaleScreen ? '运行中' : '未运行' }}</p>
      </div>
      
      <div class="actions">
        <button @click="resetConfig" class="btn-reset">重置配置</button>
        <button @click="toggleConfig" class="btn-toggle">
          {{ localConfig.enableScaleScreen ? '禁用' : '启用' }} 自适应
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getEnvironmentConfig } from '@/config/environment'

// 环境配置
const envConfig = ref(getEnvironmentConfig())

// 本地配置（可动态修改）
const localConfig = ref({
  enableScaleScreen: envConfig.value.enableScaleScreen,
  enableFullScreen: envConfig.value.enableFullScreen
})

// 是否开发模式
const isDev = computed(() => envConfig.value.isDev)

// 当前模式
const currentMode = computed(() => {
  if (localConfig.value.enableScaleScreen) {
    return 'adaptive'
  }
  return 'normal'
})

// 更新配置
const updateConfig = () => {
  // 这里可以添加配置持久化逻辑
  console.log('配置已更新:', localConfig.value)
  
  // 触发页面重新渲染
  window.dispatchEvent(new Event('resize'))
}

// 重置配置
const resetConfig = () => {
  localConfig.value = {
    enableScaleScreen: envConfig.value.enableScaleScreen,
    enableFullScreen: envConfig.value.enableFullScreen
  }
  updateConfig()
}

// 切换自适应配置
const toggleConfig = () => {
  localConfig.value.enableScaleScreen = !localConfig.value.enableScaleScreen
  updateConfig()
}

onMounted(() => {
  // 初始化本地配置
  localConfig.value = {
    enableScaleScreen: envConfig.value.enableScaleScreen,
    enableFullScreen: envConfig.value.enableFullScreen
  }
})
</script>

<style scoped>
.config-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #00d4ff;
  border-radius: 8px;
  color: white;
  z-index: 9999;
  font-family: 'Courier New', monospace;
}

.switcher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #333;
}

.switcher-header h3 {
  margin: 0;
  color: #00d4ff;
  font-size: 14px;
}

.env-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.env-badge.normal {
  background: #666;
}

.env-badge.adaptive {
  background: #00d4ff;
  color: #000;
}

.switcher-content {
  padding: 15px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.config-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.config-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  background: #666;
}

.status.active {
  background: #00ff88;
  color: #000;
}

.config-info {
  margin: 15px 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 12px;
}

.config-info p {
  margin: 5px 0;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-reset, .btn-toggle {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.btn-reset {
  background: #666;
  color: white;
}

.btn-toggle {
  background: #00d4ff;
  color: #000;
}

.btn-reset:hover {
  background: #888;
}

.btn-toggle:hover {
  background: #00b8e6;
}
</style> 