<template>
  <div class="row2-container flex-1">
    <div class="section-header">
      <div class="title-wrapper">
        <div class="glow-dot"></div>
        <div class="department-title font-bold">A类客户直通率监控</div>
      </div>
      <div v-if="manufacturingStore.loading" class="loading-indicator">
        <span class="pulse-text text-yellow-500 text-[8px]">数据同步中...</span>
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
              <span class="label">目标</span>
              <span class="value text-[10px] 2xl:text-lg 3xl:text-[9px] 4xl:text-2xl font-bold">{{ dept.data.target }}<small>%</small></span>
            </div>
            <div class="data-item">
              <span class="label">实际</span>
              <span class="value text-[10px] 2xl:text-lg 3xl:text-[9px] 4xl:text-2xl font-bold">{{ dept.data.actual }}<small>%</small></span>
            </div>
          </div>

          <div class="data-item highlight-item" 
               :style="{ '--theme-color': getAchievementColor(dept.data.achievement).textColor }">
            <span class="label">达成率</span>
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
.row2-container {
  background: radial-gradient(circle at center, rgba(0, 50, 100, 0.2) 0%, rgba(0, 20, 40, 0.5) 100%);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  /* 重点：减少固定内边距，使用 vh/vw 以在 1080p 自动收缩 */
  padding: 0.8vh 0.8vw; 
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed rgba(0, 150, 255, 0.2);
  /* padding-bottom: 0.5vh; */
  flex-shrink: 0;
}

.department-title {
  color: #00d4ff;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  letter-spacing: 2px;
  /* 标题字号自适应 */
  font-size: clamp(1px, 0.7vw, 12px);
}

.departments-grid-2x2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  /* 重点：间隔也使用响应式单位 */
  gap: 1vh 1vw;
  flex: 1;
  min-height: 0; /* 允许网格内部元素自由收缩 */
}

.department-card {
  background: rgba(0, 40, 80, 0.4);
  border: 1px solid rgba(0, 150, 255, 0.2);
  padding: 1vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

/* 所有的特效（粒子、扫描线等）样式完全保留 */
.card-particles {
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px);
  background-size: 12px 12px;
  opacity: 0.5;
  pointer-events: none;
}

.scan-line {
  position: absolute; top: 0; left: 0; width: 100%; height: 2px;
  background: linear-gradient(to right, transparent, rgba(0, 212, 255, 0.4), transparent);
  animation: scan 3s linear infinite;
}

@keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }

.dept-info {
  display: flex; justify-content: space-between; align-items: center;
  flex-shrink: 0;
  /* margin-bottom: 0.5vh; */
}

.dept-name {
  color: #fff; font-weight: bold;
  font-size: clamp(1px, 0.5vw, 11px);
}

.dept-content {
  display: flex; gap: 0.8vw; flex: 1; min-height: 0;
}

.data-group {
  flex: 1; display: flex; flex-direction: column; gap: 0.5vh;
}

.data-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5vh 0.6vw;
  border-radius: 4px;
  display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 4px;
}

.highlight-item {
  flex: 1.3;
  border: 1px solid var(--theme-color);
  background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,150,255,0.1) 100%);
  box-shadow: inset 0 0 10px var(--theme-color);
}

.label {
  font-size: clamp(8px, 0.6vw, 11px);
  color: #8cc8ff;
  line-height: 1.2;
}

.value {
  /* font-size: clamp(12px, 1.1vw, 20px); */
  font-weight: 800;
  font-family: 'DIN Alternate', sans-serif;
  color: #fff;
}

.main-value {
  /* 重点：达成率字号在 1080p 屏幕下会自动缩小到合适范围 */
  font-size: clamp(1px, 1.2vw, 18px);
  line-height: 1;
  text-shadow: 0 0 10px var(--theme-color);
}

.energy-bar {
  height: 3px; background: rgba(255, 255, 255, 0.1);
  margin-top: 0.5vh; border-radius: 2px; overflow: hidden;
}

.energy-fill {
  height: 100%; background: var(--theme-color);
  box-shadow: 0 0 8px var(--theme-color);
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.dept-tag {
  font-size: 8px; color: #00d4ff; border: 1px solid #00d4ff; padding: 0 3px; border-radius: 2px;
}
</style>