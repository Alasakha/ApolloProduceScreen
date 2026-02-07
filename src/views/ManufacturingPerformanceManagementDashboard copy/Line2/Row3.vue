<template>
  <div class="row3-container flex-1">
    <div v-if="monthData && monthData.A" class="departments-content">
      
      <div v-for="(item, key) in { A: monthData.A, regular: monthData.regular }" :key="key" class="tech-card">
        <div class="card-bg-decoration"></div>

        <div class="card-header">
          <div class="title-line">
            <span class="tech-dot"></span>
            <span class="title-text">{{ key === 'A' ? 'A类订单' : '常规类订单' }}准交监控</span>
          </div>
          <div class="live-tag">实时数据</div>
        </div>
        
        <div class="card-body">
          <div class="value-split-container">
            <div class="data-block">
              <div class="block-label">当前准交率</div>
              <div class="block-value actual" :class="key === 'A' ? 'blue-glow' : 'green-glow'">
                {{ item.rate !== null ? (item.rate * 100).toFixed(1) : '--' }}<small>%</small>
              </div>
            </div>

            <div class="v-line"></div>

            <div class="data-block">
              <div class="block-label">KPI 目标值</div>
              <div class="block-value target">
                {{ item.target ? (item.target * 100).toFixed(1) : '0.0' }}<small>%</small>
              </div>
            </div>
          </div>

          <div class="progress-wrap">
            <div class="progress-info">
              <span>达成进度</span>
              <span>{{ Math.min((item.rate || 0) * 100, 100).toFixed(0) }}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" 
                   :class="key === 'A' ? 'blue-fill' : 'green-fill'"
                   :style="{ width: Math.min((item.rate || 0) * 100, 100) + '%' }">
              </div>
              <div class="target-line" :style="{ left: (item.target * 100) + '%' }"></div>
            </div>
          </div>

          <div class="bottom-grid">
            <div class="grid-item">
              <span class="grid-label">本月已入库</span>
              <span class="grid-num">{{ item.total }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-label">本月准交数</span>
              <span class="grid-num">{{ item.ontime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading-box">
      <div class="sync-text">系统数据同步中...</div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useManufacturingStore } from '@/stores/manufacturing'

const m = useManufacturingStore()

/**
 * 月度准交监控计算属性
 * 增加默认值防止模板渲染时发生 undefined 错误
 */
const monthData = computed(() => {
  const d = m.onTimeMonthRaw || {}
  
  return {
    A: {
      target: d['A类订单准交目标'] ?? null,
      total: d['A类订单总数'] ?? 0,
      ontime: d['A类订单准交数'] ?? 0,
      rate: d['A类订单准交率实际'] ?? null
    },
    regular: {
      target: d['常规类订单准交目标'] ?? null,
      total: d['常规类订单总数'] ?? 0,
      ontime: d['常规类订单准交数'] ?? 0,
      rate: d['常规类订单准交率实际'] ?? null
    }
  }
})
</script>

<style scoped>
/* 容器适配 */
.row3-container {
  height: 100%;
  width: 100%;
  display: flex;
  box-sizing: border-box;
}

.departments-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  height: 100%;
}

/* 高冷科技感卡片主体 */
.tech-card {
  position: relative;
  background: rgba(10, 26, 47, 0.6);
  border: 1px solid rgba(0, 242, 255, 0.15);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  overflow: hidden; /* 防止溢出父组件 */
}

/* 标题样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tech-dot {
  width: 4px; height: 4px;
  background: #00f2ff;
  display: inline-block;
  margin-right: 8px;
  box-shadow: 0 0 5px #00f2ff;
}

.title-text {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
}

.live-tag {
  font-size: 10px;
  color: rgba(0, 242, 255, 0.5);
  border: 1px solid rgba(0, 242, 255, 0.2);
  padding: 1px 4px;
}

/* 数据对比区布局 */
.value-split-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.data-block { flex: 1; text-align: center; }

.v-line {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
}

.block-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
}

.block-value {
  font-family: 'DIN Alternate', sans-serif;
  font-size: 28px; /* 缩小了实际值，增大目标值感官 */
  font-weight: bold;
}

.block-value small { font-size: 12px; margin-left: 2px; }

/* 实际值配色 */
.blue-glow { color: #fff; text-shadow: 0 0 10px rgba(0, 242, 255, 0.3); }
.green-glow { color: #00ffcc; }

/* 目标值配色 - 此时与实际值字号一致，显得更大更重要 */
.target { color: rgba(255, 255, 255, 0.9); }

/* 进度条 */
.progress-wrap { margin: 10px 0; }

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
}

.progress-bar-bg {
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  transition: width 1s ease-in-out;
}
.blue-fill { background: #00f2ff; }
.green-fill { background: #00ffcc; }

.target-line {
  position: absolute;
  top: -4px;
  width: 2px;
  height: 12px;
  background: #fff;
  box-shadow: 0 0 5px #fff;
}

/* 底部网格数据 */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.grid-item { display: flex; flex-direction: column; }

.grid-label { font-size: 10px; color: rgba(255, 255, 255, 0.3); }
.grid-num { font-size: 16px; color: #fff; font-family: 'DIN'; }

/* 加载状态 */
.loading-box {
  width: 100%; height: 100%;
  display: flex; justify-content: center; align-items: center;
  color: #00f2ff;
}

.sync-text { animation: blink 2s infinite; font-size: 12px; }

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
</style>