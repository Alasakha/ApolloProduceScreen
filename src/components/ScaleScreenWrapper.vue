<template>
  <div v-if="!config.enabled" class="normal-container">
    <!-- 不使用插件时的正常渲染 -->
    <slot />
  </div>
  
  <v-scale-screen
    v-else
    :width="config.width"
    :height="config.height"
    :autoScale="config.autoScale"
    :fullScreen="config.fullScreen"
    :delay="config.delay"
    :bodyOverflowHidden="config.bodyOverflowHidden"
    class="scale-screen-container"
  >
    <slot />
  </v-scale-screen>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { getEnvironmentConfig } from '@/config/environment'

// 获取环境配置
const config = computed(() => getEnvironmentConfig().scaleScreenConfig)

// 动态导入组件
const VScaleScreen = ref<any>(null)
const isComponentLoaded = ref(false)

onMounted(async () => {
  if (config.value.enabled) {
    try {
      const module = await import('v-scale-screen')
      VScaleScreen.value = module.default
      isComponentLoaded.value = true
    } catch (error) {
      console.warn('v-scale-screen 组件加载失败:', error)
      // 如果组件加载失败，回退到正常模式
      config.value.enabled = false
    }
  }
})

// 监听配置变化
const updateConfig = () => {
  // 这里可以添加配置更新的逻辑
}
</script>

<style scoped>
.normal-container {
  width: 100%;
  height: 100%;
}

.scale-screen-container {
  /* 插件容器的样式 */
}
</style> 