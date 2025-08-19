<template>
  <div class="test-screen-scale">
    <!-- 配置切换器 -->
    <ConfigSwitcher />
    
    <div class="header">
      <h1>大屏适配测试页面</h1>
      <p>当前时间: {{ currentTime }}</p>
      <p>测试 v-scale-screen 组件是否正常工作</p>
    </div>
    
    <div class="content-grid">
      <div class="grid-item" v-for="i in 6" :key="i">
        <h3>测试卡片 {{ i }}</h3>
        <p>这是一个测试内容，用于验证大屏适配效果</p>
        <div class="metric">
          <span class="label">指标值:</span>
          <span class="value">{{ Math.floor(Math.random() * 100) }}%</span>
        </div>
      </div>
    </div>
    
    <div class="info-panel">
      <h3>屏幕信息</h3>
      <p>设计稿尺寸: 1920 x 1080</p>
      <p>当前屏幕: {{ screenInfo.width }} x {{ screenInfo.height }}</p>
      <p>缩放比例: {{ scaleRatio.toFixed(2) }}</p>
      <p>v-scale-screen 状态: {{ vScaleScreenStatus }}</p>
      <p>自适应模式: {{ adaptiveModeStatus }}</p>
    </div>
    
    <div class="test-buttons">
      <button @click="testResize" class="test-btn">测试窗口调整</button>
      <button @click="toggleFullscreen" class="test-btn">切换全屏</button>
      <button @click="refreshStatus" class="test-btn">刷新状态</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ConfigSwitcher from '@/components/ConfigSwitcher.vue'
import { getEnvironmentConfig } from '@/config/environment'

const currentTime = ref('')
const screenInfo = ref({ width: 0, height: 0 })
const scaleRatio = ref(1)
const vScaleScreenStatus = ref('检测中...')
const adaptiveModeStatus = ref('检测中...')

let timer: NodeJS.Timeout

const updateTime = () => {
  currentTime.value = new Date().toLocaleString()
}

const updateScreenInfo = () => {
  screenInfo.value = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  scaleRatio.value = Math.min(
    window.innerWidth / 1920,
    window.innerHeight / 1080
  )
  
  // 检测 v-scale-screen 是否正常工作
  const vScaleElement = document.querySelector('.v-scale-screen')
  if (vScaleElement) {
    vScaleScreenStatus.value = '✅ 正常工作'
  } else {
    vScaleScreenStatus.value = '❌ 未找到组件'
  }
  
  // 检测自适应模式状态
  const envConfig = getEnvironmentConfig()
  if (envConfig.scaleScreenConfig.enabled) {
    adaptiveModeStatus.value = '✅ 自适应模式已启用'
  } else {
    adaptiveModeStatus.value = '❌ 自适应模式已禁用'
  }
}

const testResize = () => {
  // 模拟窗口大小变化
  window.dispatchEvent(new Event('resize'))
  updateScreenInfo()
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const refreshStatus = () => {
  updateScreenInfo()
}

onMounted(() => {
  updateTime()
  updateScreenInfo()
  
  timer = setInterval(updateTime, 1000)
  window.addEventListener('resize', updateScreenInfo)
  
  // 延迟检测，确保组件已渲染
  setTimeout(updateScreenInfo, 100)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('resize', updateScreenInfo)
})
</script>

<style scoped>
.test-screen-scale {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  overflow: auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  color: #00d4ff;
}

.header p {
  margin: 0;
  font-size: 1.2rem;
  color: #8cc8ff;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.grid-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(0, 212, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 212, 255, 0.6);
}

.grid-item h3 {
  margin: 0 0 15px 0;
  color: #00d4ff;
  font-size: 1.3rem;
}

.grid-item p {
  margin: 0 0 15px 0;
  line-height: 1.6;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.label {
  color: #8cc8ff;
}

.value {
  font-weight: bold;
  color: #00ff88;
  font-size: 1.2rem;
}

.info-panel {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(0, 212, 255, 0.3);
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
}

.info-panel h3 {
  margin: 0 0 15px 0;
  color: #00d4ff;
}

.info-panel p {
  margin: 5px 0;
  color: #8cc8ff;
}

.test-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.test-btn {
  padding: 12px 24px;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 212, 255, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .test-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style> 