<template>
  <div class="row2-container flex-1">
    <div class="section-header">
      <div class="title-wrapper">
        <div class="glow-dot"></div>
        <div class="department-title text-sm font-bold">常规客户直通率监控</div>
        <div class="toggle-buttons ml-4">
          <button 
            class="mini-toggle-btn" 
            :class="{ active: currentPeriod === 'monthly' }"
            @click="currentPeriod = 'monthly'"
          >月度</button>
          <button 
            class="mini-toggle-btn" 
            :class="{ active: currentPeriod === 'yearly' }"
            @click="currentPeriod = 'yearly'"
          >年度</button>
        </div>
      </div>
      <div v-if="perfStore.loading" class="loading-indicator">
        <span class="pulse-text">数据同步中...</span>
      </div>
    </div>
    
    <div class="departments-grid-2x2">
      <div v-for="(dept, index) in regularDataList" :key="index" class="department-card">
        <div class="card-particles"></div>
        <div class="scan-line"></div>

        <div class="dept-info">
          <span class="dept-name">{{ dept.label }}</span>
          <span class="live-tag">REGULAR</span>
        </div>
        
        <div class="dept-content">
          <div class="data-group">
            <div class="data-item">
              <span class="label">目标</span>
              <span class="value">{{ dept.target }}<small>%</small></span>
            </div>
            <div class="data-item">
              <span class="label">实际</span>
              <span class="value">{{ dept.actual }}<small>%</small></span>
            </div>
          </div>

          <div class="data-item highlight-item" 
               :style="{ '--theme-color': getAchievementColor(dept.achievement).textColor }">
            <span class="label">达成率</span>
            <span class="value main-value">
              {{ dept.achievement }}<small>%</small>
            </span>
            <div class="energy-bar">
              <div class="energy-fill" :style="{ width: Math.min(parseFloat(dept.achievement), 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ReasonDialog
      :visible="reasonDialogVisible"
      :metric-info="currentMetricInfo"
      @close="reasonDialogVisible = false"
      @submit="handleReasonSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useManufacturingStore } from '@/stores/manufacturing'
import ReasonDialog from '@/components/ReasonDialog.vue'

const perfStore = useManufacturingStore()
const currentPeriod = ref('monthly')
const reasonDialogVisible = ref(false)
const currentMetricInfo = ref({})

// 核心数据映射：加入了金工二部
const regularDataList = computed(() => {
  const r = perfStore.raw || {}
  // 定义四个部门及其对应的 Key 前缀
  const departments = [
    { label: '金工一部', prefix: '金工一部常规类' },
    { label: '金工二部', prefix: '金工二部常规类' },
    { label: '总装一课', prefix: '总装一课常规类' },
    { label: '总装二课', prefix: '总装二课常规类' }
  ]

  return departments.map(dept => ({
    label: dept.label,
    target: r[`${dept.prefix}目标`] ? (r[`${dept.prefix}目标`] * 100).toFixed(1) : '--',
    actual: r[`${dept.prefix}实际`] ? (r[`${dept.prefix}实际`] * 100).toFixed(1) : '--',
    achievement: r[`${dept.prefix}达成率`] ? (r[`${dept.prefix}达成率`] * 100).toFixed(1) : '--'
  }))
})

// 根据达成率数值返回颜色
const getAchievementColor = (value) => {
  const val = parseFloat(value)
  if (isNaN(val)) return { textColor: '#ffffff' }
  if (val >= 100) return { textColor: '#00ffcc' } // 亮青色
  if (val >= 98) return { textColor: '#00d4ff' }  // 天蓝色
  if (val >= 95) return { textColor: '#ffffff' }  // 白色
  return { textColor: '#ff4444' }                 // 红色警告
}

const handleReasonSubmit = (data) => {
  console.log('提交原因:', data)
}
</script>

<style scoped>
.row2-container {
  background: radial-gradient(circle at center, rgba(0, 50, 100, 0.2) 0%, rgba(0, 10, 30, 0.5) 100%);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.title-wrapper {
  display: flex;
  align-items: center;
}

.glow-dot {
  width: 6px; height: 6px;
  background: #00d4ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00d4ff;
  margin-right: 8px;
}

.department-title {
  color: #00d4ff;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  letter-spacing: 1px;
}

.mini-toggle-btn {
  padding: 1px 10px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #8cc8ff;
  font-size: 10px;
  cursor: pointer;
  margin-left: 5px;
  border-radius: 2px;
  transition: all 0.2s;
}

.mini-toggle-btn.active {
  background: #00d4ff;
  color: #000;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.departments-grid-2x2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  flex: 1;
}

.department-card {
  background: rgba(0, 40, 80, 0.4);
  border: 1px solid rgba(0, 150, 255, 0.2);
  padding: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 炫酷粒子背景 */
.card-particles {
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px);
  background-size: 12px 12px;
  opacity: 0.6;
}

/* 动态扫描线 */
.scan-line {
  position: absolute; top: 0; left: 0; width: 100%; height: 2px;
  background: linear-gradient(to right, transparent, rgba(0, 212, 255, 0.4), transparent);
  animation: scan 4s linear infinite;
}

@keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }

.dept-info {
  display: flex; justify-content: space-between; margin-bottom: 8px; z-index: 1;
}

.dept-name { color: #fff; font-weight: bold; font-size: 14px; }
.live-tag { font-size: 8px; color: #00d4ff; border: 1px solid #00d4ff; padding: 0 3px; border-radius: 2px; }

.dept-content { display: flex; gap: 10px; flex: 1; z-index: 1; }
.data-group { flex: 1; display: flex; flex-direction: column; gap: 8px; }

.data-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 10px;
  border-radius: 4px;
  display: flex; flex-direction: column;
}

.highlight-item {
  flex: 1.2;
  border: 1px solid var(--theme-color);
  background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,150,255,0.05) 100%);
  box-shadow: inset 0 0 15px rgba(0, 150, 255, 0.1);
}

.label { font-size: 10px; color: #8cc8ff; margin-bottom: 2px; }
.value { font-size: 16px; font-weight: 800; font-family: 'DIN', sans-serif; color: #fff; }
.main-value { font-size: 24px; text-shadow: 0 0 10px var(--theme-color); }
.value small { font-size: 10px; margin-left: 2px; }

.energy-bar { height: 4px; background: rgba(255, 255, 255, 0.1); margin-top: auto; border-radius: 2px; overflow: hidden; }
.energy-fill { 
  height: 100%; 
  background: var(--theme-color); 
  box-shadow: 0 0 8px var(--theme-color);
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-indicator { color: #ffd700; font-size: 10px; }
.pulse-text { animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>