<template>
  <div class="row2-container flex-1">
    <div class="section-header">
      <div class="title-wrapper">
        <div class="glow-dot"></div>
        <div class="department-title text-sm font-bold">A类客户直通率监控</div>
      </div>
      <div v-if="manufacturingStore.loading" class="loading-indicator">
        <span class="pulse-text">数据同步中...</span>
      </div>
    </div>
    
    <div class="departments-grid-2x2">
      <div v-for="(dept, index) in deptDataList" :key="index" class="department-card">
        <div class="card-particles"></div>
        <div class="scan-line"></div>

        <div class="dept-info">
          <span class="dept-name">{{ dept.name }}</span>
          <span class="dept-tag">LIVE</span>
        </div>
        
        <div class="dept-content">
          <div class="data-group">
            <div class="data-item">
              <span class="label">TARGET</span>
              <span class="value">{{ dept.data.target }}<small>%</small></span>
            </div>
            <div class="data-item">
              <span class="label">ACTUAL</span>
              <span class="value">{{ dept.data.actual }}<small>%</small></span>
            </div>
          </div>

          <div class="data-item highlight-item" 
               :style="{ '--theme-color': getAchievementColor(dept.data.achievement).textColor }">
            <span class="label">ACHIEVEMENT</span>
            <span class="value main-value">
              {{ dept.data.achievement }}<small>%</small>
            </span>
            <div class="energy-bar">
              <div class="energy-fill" :style="{ width: Math.min(dept.data.achievement, 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useManufacturingStore } from '@/stores/manufacturing'

const manufacturingStore = useManufacturingStore()

const getDeptData = (namePrefix) => {
  const r = manufacturingStore.raw || {}
  return {
    target: r[`${namePrefix}A类目标`] ? (r[`${namePrefix}A类目标`] * 100).toFixed(1) : '--',
    actual: r[`${namePrefix}A类实际`] ? (r[`${namePrefix}A类实际`] * 100).toFixed(1) : '--',
    achievement: r[`${namePrefix}A类达成率`] ? (r[`${namePrefix}A类达成率`] * 100).toFixed(1) : '--'
  }
}

const deptDataList = computed(() => [
  { name: '金工一部', data: getDeptData('金工一部') },
  { name: '金工二部', data: getDeptData('金工二部') },
  { name: '总装一课', data: getDeptData('总装一课') },
  { name: '总装二课', data: getDeptData('总装二课') }
])

const getAchievementColor = (value) => {
  const val = parseFloat(value)
  if (isNaN(val)) return { textColor: '#ffffff' }
  if (val >= 100) return { textColor: '#00ffcc' } 
  if (val >= 98) return { textColor: '#00d4ff' }  
  return { textColor: '#ff4444' }                 
}
</script>

<style scoped>
/* 容器基础样式 */
.row2-container {
  background: radial-gradient(circle at center, rgba(0, 50, 100, 0.2) 0%, rgba(0, 20, 40, 0.5) 100%);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 头部发光点装饰 */
.glow-dot {
  width: 6px;
  height: 6px;
  background: #00d4ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff;
  margin-right: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  border-bottom: 1px dashed rgba(0, 150, 255, 0.2);
  padding-bottom: 8px;
}

.department-title {
  color: #00d4ff;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  letter-spacing: 2px;
}

/* 2x2 网格 */
.departments-grid-2x2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
  flex: 1;
}

/* 卡片特效：扫描线 + 粒子底纹 */
.department-card {
  background: rgba(0, 40, 80, 0.4);
  border: 1px solid rgba(0, 150, 255, 0.2);
  padding: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s;
}

.department-card:hover {
  border-color: rgba(0, 150, 255, 0.6);
  background: rgba(0, 60, 120, 0.5);
}

/* 粒子点阵背景 */
.card-particles {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px);
  background-size: 12px 12px;
  opacity: 0.5;
  pointer-events: none;
}

/* 动态扫描线 */
.scan-line {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 2px;
  background: linear-gradient(to right, transparent, rgba(0, 212, 255, 0.4), transparent);
  animation: scan 3s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  0% { top: -10%; }
  100% { top: 110%; }
}

.dept-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  z-index: 1;
}

.dept-name {
  color: #fff;
  font-weight: bold;
  font-size: 15px;
}

.dept-tag {
  font-size: 9px;
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  padding: 1px 4px;
  border: 1px solid #00d4ff;
  border-radius: 2px;
}

.dept-content {
  display: flex;
  gap: 10px;
  flex: 1;
  z-index: 1;
}

.data-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.highlight-item {
  flex: 1.2;
  border: 1px solid var(--theme-color);
  background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,150,255,0.1) 100%);
  box-shadow: inset 0 0 15px var(--theme-color);
}

.label {
  font-size: 10px;
  color: #8cc8ff;
  margin-bottom: 2px;
}

.value {
  font-size: 18px;
  font-weight: 800;
  font-family: 'DIN Alternate', sans-serif;
  color: #fff;
}

.main-value {
  font-size: 26px; /* 重点突出达成率 */
  line-height: 1;
  text-shadow: 0 0 10px var(--theme-color);
}

/* 能量条动画 */
.energy-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: auto;
  border-radius: 2px;
  overflow: hidden;
}

.energy-fill {
  height: 100%;
  background: var(--theme-color);
  box-shadow: 0 0 8px var(--theme-color);
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.pulse-text {
  animation: pulse 2s infinite;
  font-size: 12px;
  color: #ffd700;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>