<template>
  <div class="control-board">
    <dv-full-screen-container>
        <div class="board-container">
          <div class="left-section">
            <ErrorBoundary>
              <SalesData />
            </ErrorBoundary>
            <ErrorBoundary>
              <RDModule />
            </ErrorBoundary>
            <ErrorBoundary>
              <QualityMetrics />
            </ErrorBoundary>
          </div>
          
          <div class="center-section">
            <div class="earth-model-container" v-if="isModelVisible">
              <ErrorBoundary>
                <FlyLineEarth />
              </ErrorBoundary>
            </div>
            <div class="model-placeholder" v-else>
              <h3>🌍 3D地球模型 - 飞线效果</h3>
              <p>点击"显示模型"按钮查看带飞线动画的3D地球</p>
            </div>
            <div class="model-controls">
              <button class="model-btn" @click="toggleModel">
                {{ isModelVisible ? '隐藏模型' : '显示模型' }}
              </button>
              <button class="model-btn" @click="resetModel" v-if="isModelVisible">重置视角</button>
            </div>
          </div>
          
          <div class="right-section">
            <ErrorBoundary>
              <EquipmentManagement />
            </ErrorBoundary>
            <ErrorBoundary>
              <EnergyConsumption />
            </ErrorBoundary>
            <ErrorBoundary>
              <LaborProductivity />
            </ErrorBoundary>
          </div>
          
          <div class="bottom-section">
            <!-- <div class="video-controls">
              <button class="camera-test-btn" @click="showCameraTest = !showCameraTest">
                {{ showCameraTest ? '返回监控' : '摄像头测试' }}
              </button>
            </div> -->
            <div class="video-monitors">
              <H5PlayerMonitor  ip="192.168.10.64"/>
            </div>
            <div class="video-monitors">
              <H5PlayerMonitor  ip="192.168.20.56"/>
            </div>
            <div class="video-monitors">
              <H5PlayerMonitor  ip="192.168.10.87"/>
            </div>
          </div>
        </div>

    </dv-full-screen-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BorderBox11 as DvBorderBox11 } from '@kjgl77/datav-vue3'
import FlyLineEarth from './components/FlyLineEarth.vue'
import H5PlayerMonitor from './components/H5PlayerMonitor.vue'

// import CameraTest from './components/CameraTest.vue'
import EquipmentManagement from './components/EquipmentManagement.vue'
import QualityMetrics from './components/QualityMetrics.vue'
import LaborProductivity from './components/LaborProductivity.vue'
import SalesData from './components/SalesData.vue'
import EnergyConsumption from './components/EnergyConsumption.vue'
import RDModule from './components/RDModule.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'

// 模型控制
const isModelVisible = ref(true)

// 摄像头测试控制
const showCameraTest = ref(false)





const toggleModel = () => {
  isModelVisible.value = !isModelVisible.value
}

const resetModel = () => {
  // 重置模型视角的逻辑
  console.log('重置模型视角')
}

// 响应式设计
const isMobile = ref(false)
const isTablet = ref(false)

const checkScreenSize = () => {
  const width = window.innerWidth
  isMobile.value = width < 768
  isTablet.value = width >= 768 && width < 1024
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.control-board {
  width: 100vw;
  height: 100vh;
  background: var(--gradient-bg);
  overflow-y: auto; /* 改为垂直滚动，允许内容超出时滚动 */
}

.board-container {
  display: grid;
  grid-template-areas:
    "left left center center center center center right right"
    "left left center center center center center right right"
    "left left center center center center center right right"
    "bottom bottom bottom bottom bottom bottom bottom bottom bottom";
  grid-template-rows: 1fr 1fr 1fr 400px;
  grid-template-columns: repeat(9, 1fr);
  gap: 20px;
  height: 100%;
}

.left-section {
  grid-area: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.center-section {
  grid-area: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.right-section {
  grid-area: right;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bottom-section {
  grid-area: bottom;
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.bottom-section > * {
  flex: 1;
}

.video-controls {
  position: relative;
  margin-bottom: 15px;
  z-index: 10;
  display: flex;
  justify-content: center;
}

.camera-test-btn {
  padding: 12px 24px;
  background: var(--gradient-primary);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px var(--shadow-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.camera-test-btn:hover {
  background: rgba(0, 212, 255, 0.3);
  border-color: var(--primary-blue);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--shadow-primary);
}

.video-monitors {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.camera-test-container {
  width: 100%;
  /* height: 2000px; */ /* 暂时注释掉高度限制，让内容自适应 */
  overflow-y: auto; /* 添加垂直滚动条 */
  max-height: 100vh; /* 设置最大高度为视口高度 */
}

.earth-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.center-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.company-title {
  color: var(--text-primary);
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-shadow: 0 0 20px var(--shadow-glow);
}

.company-slogan {
  color: var(--text-accent);
  font-size: 16px;
  margin: 0 0 15px 0;
  opacity: 0.8;
}

.real-time-data {
  display: flex;
  gap: 30px;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data-item .label {
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: 5px;
}

.data-item .value {
  color: var(--text-accent);
  font-size: 18px;
  font-weight: bold;
}

/* 模型控制按钮样式 */
.model-control {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  justify-content: center;
}

.model-btn {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: 2px solid var(--border-primary);
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.model-btn:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.model-btn.active {
  background: rgba(0, 212, 255, 0.3);
  border-color: var(--primary-blue);
  box-shadow: 0 0 20px var(--shadow-glow);
}

.model-btn:active {
  transform: translateY(0);
}

/* 摩托车占位符样式 */
.motorcycle-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-accent);
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 2px solid var(--border-primary);
}

.motorcycle-placeholder h3 {
  font-size: 32px;
  margin: 0 0 20px 0;
  text-shadow: 0 0 20px var(--shadow-glow);
}

.motorcycle-placeholder p {
  font-size: 18px;
  margin: 0;
  opacity: 0.8;
}

.earth-model-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.05);
  border: 2px dashed var(--border-primary);
  border-radius: 12px;
  color: var(--text-accent);
  text-align: center;
}

.model-placeholder h3 {
  font-size: 24px;
  margin-bottom: 12px;
  color: var(--text-accent);
}

.model-placeholder p {
  font-size: 14px;
  color: var(--text-muted);
}

.model-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.model-btn {
  padding: 8px 16px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  color: var(--text-accent);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.model-btn:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: var(--border-hover);
}

.model-btn:active {
  transform: scale(0.95);
}

/* 响应式设计 */
/* 1080p显示器优化 (1920x1080) */
@media (max-width: 1920px) and (min-width: 1601px) {
  .board-container {
    gap: 18px;
    padding: 18px;
    grid-template-rows: 1fr 1fr 1fr 350px; /* 调整底部视频区域高度 */
  }
  
  .company-title {
    font-size: 26px;
  }
  
  .company-slogan {
    font-size: 15px;
  }
  
  .model-btn {
    padding: 10px 18px;
    font-size: 13px;
  }
  
  .data-item .value {
    font-size: 16px;
  }
  
  .data-item .label {
    font-size: 11px;
  }
  
  /* 优化左右侧组件间距 */
  .left-section {
    gap: 12px;
    margin-top: 12px;
  }
  
  .right-section {
    gap: 18px;
  }
  
  /* 调整模型占位符样式 */
  .model-placeholder h3 {
    font-size: 22px;
  }
  
  .model-placeholder p {
    font-size: 13px;
  }
  
  /* 优化视频监控区域 */
  .video-monitors {
    gap: 18px;
  }
  
  /* 优化控制按钮样式 */
  .camera-test-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  /* 优化模型控制按钮 */
  .model-controls {
    bottom: 15px;
    gap: 10px;
  }
  
  /* 优化中心信息区域 */
  .center-info {
    bottom: 15px;
  }
  
  .real-time-data {
    gap: 25px;
  }
  
  /* 优化摩托车占位符 */
  .motorcycle-placeholder h3 {
    font-size: 28px;
    margin-bottom: 15px;
  }
  
  .motorcycle-placeholder p {
    font-size: 16px;
  }
}

/* 精确的1080p显示器优化 (1920x1080) */
@media (width: 1920px) and (height: 1080px) {
  .board-container {
    gap: 20px;
    padding: 20px;
    grid-template-rows: 1fr 1fr 1fr 320px; /* 为1080p优化底部高度 */
  }
  
  .left-section {
    gap: 15px;
    margin-top: 15px;
  }
  
  .right-section {
    gap: 20px;
  }
  
  .bottom-section {
    gap: 20px;
  }
  
  .video-monitors {
    gap: 20px;
  }
  
  .company-title {
    font-size: 28px;
  }
  
  .company-slogan {
    font-size: 16px;
  }
  
  .model-btn {
    padding: 12px 20px;
    font-size: 14px;
  }
  
  .data-item .value {
    font-size: 18px;
  }
  
  .data-item .label {
    font-size: 12px;
  }
  
  .real-time-data {
    gap: 30px;
  }
}

@media (max-width: 1600px) {
  .board-container {
    gap: 15px;
    padding: 15px;
  }
}

@media (max-width: 1400px) {
  .board-container {
    gap: 12px;
    padding: 12px;
  }
  
  .company-title {
    font-size: 24px;
  }
  
  .company-slogan {
    font-size: 14px;
  }
}

@media (max-width: 1200px) {
  .board-container {
    grid-template-areas:
      "left left left center center center right right right"
      "left left left center center center right right right"
      "left left left center center center right right right"
      "bottom bottom bottom bottom bottom bottom bottom bottom bottom";
    grid-template-columns: repeat(9, 1fr);
  }
}

@media (max-width: 768px) {
  .board-container {
    grid-template-areas:
      "left left left left left left left left left"
      "center center center center center center center center center"
      "right right right right right right right right right"
      "bottom bottom bottom bottom bottom bottom bottom bottom bottom";
    grid-template-rows: auto auto auto 150px;
    grid-template-columns: repeat(9, 1fr);
    gap: 15px;
  }
  
  .left-section,
  .right-section {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .left-section > *,
  .right-section > * {
    min-width: 300px;
    flex-shrink: 0;
  }
  
  .bottom-section {
    flex-direction: column;
  }
  
  .bottom-section > * {
    min-height: auto; /* 自适应高度 */
  }
  
  .model-controls {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    margin-top: 15px;
  }
}
</style>