<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ScaleScreenWrapper from '@/components/ScaleScreenWrapper.vue'
import { getEnvironmentConfig } from '@/config/environment'
import { eventBus } from '@/utils/eventbus'

// 获取环境配置
const envConfig = ref(getEnvironmentConfig())

// 更新环境配置
const updateEnvConfig = () => {
  envConfig.value = getEnvironmentConfig()
}

onMounted(() => {
  // 设置body样式
  document.body.style.overflow = 'hidden'
  
  // 初始化环境配置
  updateEnvConfig()
  
  // 监听窗口大小变化
  window.addEventListener('resize', updateEnvConfig)
  
  // 启动全局自动刷新 (30秒刷新一次)
  eventBus.startAutoRefresh(60000*3)
  
  console.log('🚀 应用启动，全局自动刷新已启用')
})

onUnmounted(() => {
  // 移除事件监听器
  window.removeEventListener('resize', updateEnvConfig)
  
  // 停止全局自动刷新
  eventBus.stopAutoRefresh()
  
  console.log('🛑 应用卸载，全局自动刷新已停止')
})
</script>

<template>
  <ScaleScreenWrapper>
    <router-view />
  </ScaleScreenWrapper>
</template>

<style>
/* 全局样式 */
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 确保body样式 */
body {
  overflow: hidden !important;
  margin: 0;
  padding: 0;
}
</style>
