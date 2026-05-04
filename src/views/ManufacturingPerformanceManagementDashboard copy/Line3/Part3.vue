<template>
  <div class="part3-container">
    <div class="delivery-section">
      <div class="section-header">
        <span class="title-icon"></span>
        <div class="section-title">A类订单准交 (日)</div>
      </div>
      
      <div class="delivery-grid">
        <div v-for="(item, key) in dayData.A" :key="key" class="unit-card" :class="{'total-card': key === 'total'}">
          <div class="unit-name">{{ getUnitLabel(key) }}</div>
          <div class="unit-stats">
            <div class="stat-row">
              <span class="stat-label">应入库</span>
              <span class="stat-value">{{ item.total }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">实际</span>
              <span class="stat-value on-time">{{ item.ontime }}</span>
            </div>
            <div class="stat-row rate-row">
              <span class="stat-label">准交率</span>
              <span class="stat-value rate" :class="getRateClass(item.rate)">
                {{ item.total === 0 ? '应入库为0' : (item.rate !== null ? (item.rate * 100).toFixed(1) + '%' : '--') }}
              </span>
            </div>
          </div>
          <div class="mini-progress-bg">
            <div class="mini-progress-fill" :style="{ width: (item.total > 0 ? (item.rate || 0) * 100 : 0) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="delivery-section">
      <div class="section-header">
        <span class="title-icon"></span>
        <div class="section-title">常规类订单准交 (日)</div>
      </div>
      <div class="delivery-grid">
        <div v-for="(item, key) in dayData.regular" :key="key" class="unit-card" :class="{'total-card': key === 'total'}">
          <div class="unit-name">{{ getUnitLabel(key) }}</div>
          <div class="unit-stats">
            <div class="stat-row">
              <span class="stat-label">应入库</span>
              <span class="stat-value">{{ item.total }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">实际</span>
              <span class="stat-value on-time">{{ item.ontime }}</span>
            </div>
            <div class="stat-row rate-row">
              <span class="stat-label">准交率</span>
              <span class="stat-value rate" :class="getRateClass(item.rate)">
                {{ item.total === 0 ? '应入库为0' : (item.rate !== null ? (item.rate * 100).toFixed(1) + '%' : '--') }}
              </span>
            </div>
          </div>
          <div class="mini-progress-bg">
            <div class="mini-progress-fill" :style="{ width: (item.total > 0 ? (item.rate || 0) * 100 : 0) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useManufacturingStore } from '@/stores/manufacturing'

const m = useManufacturingStore()

const getUnitLabel = (key) => {
  const labels = {
    one: '一课包装',
    two: '二课包装',
    scatter: '散件包装',
    total: '合计'
  }
  return labels[key] || key
}

const getRateClass = (rate) => {
  if (rate === null) return ''
  if (rate >= 0.98) return 'rate-good'
  if (rate >= 0.95) return 'rate-normal'
  return 'rate-warning'
}

const dayData = computed(() => {
  const d = m.onTimeDayRaw || {}
  
  const processData = (prefix) => {
    const one = {
      total: d[`一课包装${prefix}总数`] ?? 0,
      ontime: d[`一课包装${prefix}准交数`] ?? 0,
      rate: d[`一课包装${prefix}准交率`] ?? null
    }
    const two = {
      total: d[`二课包装${prefix}总数`] ?? 0,
      ontime: d[`二课包装${prefix}准交数`] ?? 0,
      rate: d[`二课包装${prefix}准交率`] ?? null
    }
    const scatter = {
      total: d[`散件包装${prefix}总数`] ?? 0,
      ontime: d[`散件包装${prefix}准交数`] ?? 0,
      rate: d[`散件包装${prefix}准交率`] ?? null
    }
    const total_total = one.total + two.total + scatter.total
    const total_ontime = one.ontime + two.ontime + scatter.ontime
    
    return {
      one, two, scatter,
      total: {
        total: total_total,
        ontime: total_ontime,
        rate: total_total === 0 ? null : (total_ontime / total_total)
      }
    }
  }

  return {
    A: processData('A类'),
    regular: processData('常规类')
  }
})
</script>


<style scoped>
.part3-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
  height: 100%;
}

@media (min-width: 1700px) and (max-width: 2100px) {
  .part3-container {
    gap: 0px;
}}

.delivery-section {
  flex: 1;
  background: rgba(0, 30, 60, 0.25);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.title-icon {
  width: 4px;
  height: 14px;
  background: #00d4ff;
  box-shadow: 0 0 8px #00d4ff;
}

.section-title {
  color: #00d4ff;
  font-weight: bold;
  font-size: 9px;
}

.delivery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  flex: 1;
}

.unit-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.unit-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 212, 255, 0.4);
}

.total-card {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.3);
}

.unit-name {
  color: #8cc8ff;
  font-size: 9px;
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
  font-weight: bold;
}

.unit-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
}

.stat-value {
  color: #fff;
  font-family: 'DIN', sans-serif;
}

.stat-value.on-time {
  color: #00ffcc;
}

.rate-row {
  margin-top: 2px;
  padding-top: 4px;
}

.rate {
  font-size: 10px;
  font-weight: bold;
}

/* 准交率颜色等级 */
.rate-good { color: #00ff88; }
.rate-normal { color: #fff; }
.rate-warning { color: #ff4444; }

/* 底部微型进度条 */
.mini-progress-bg {
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: 8px;
  border-radius: 1px;
}

.mini-progress-fill {
  height: 100%;
  background: #00d4ff;
  box-shadow: 0 0 5px #00d4ff;
  transition: width 0.5s ease;
}

/* 响应式适配 */
@media (max-width: 1400px) {
  .delivery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

