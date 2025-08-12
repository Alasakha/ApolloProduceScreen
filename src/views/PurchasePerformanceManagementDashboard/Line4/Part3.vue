<template>
  <div class="part3-container">
    <!-- E10系统数据状态 -->
    <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
      E10系统数据状态
      <span v-if="loading" class="loading-indicator">加载中...</span>
      <span v-if="error" class="error-indicator" :title="error">❌</span>
    </div>
    
    <!-- 系统连接状态 -->
    <div class="system-status">
      <div class="status-title text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">系统连接状态</div>
      <div class="status-info">
        <div class="status-item">
          <div class="status-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">E10系统</div>
          <div class="status-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" :class="e10Data.connection === '正常' ? 'text-green-400' : 'text-red-400'">
            {{ e10Data.connection }}
          </div>
        </div>
        <div class="status-item">
          <div class="status-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">数据更新</div>
          <div class="status-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">{{ e10Data.lastUpdate }}</div>
        </div>
        <div class="status-item">
          <div class="status-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">同步状态</div>
          <div class="status-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" :class="e10Data.syncStatus === '同步中' ? 'text-blue-400' : 'text-green-400'">
            {{ e10Data.syncStatus }}
          </div>
        </div>
      </div>
    </div>

    <!-- 数据质量监控 -->
    <div class="quality-monitor">
      <div class="monitor-title text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">数据质量监控</div>
      <div class="quality-items">
        <div 
          v-for="quality in e10Data.qualityMetrics" 
          :key="quality.metric"
          class="quality-item"
        >
          <div class="quality-name text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">{{ quality.metric }}</div>
          <div class="quality-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" :class="getQualityClass(quality.score)">
            {{ quality.score }}%
          </div>
          <div class="quality-bar">
            <div class="quality-fill" :style="{ width: `${quality.score}%` }" :class="getQualityBarClass(quality.score)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 供应商数据统计 -->
    <div class="supplier-stats">
      <div class="stats-title text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">供应商数据统计</div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">总供应商</div>
          <div class="stat-value text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">{{ e10Data.supplierStats.total }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">活跃供应商</div>
          <div class="stat-value text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">{{ e10Data.supplierStats.active }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">新增供应商</div>
          <div class="stat-value text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">{{ e10Data.supplierStats.newAdded }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">优化供应商</div>
          <div class="stat-value text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">{{ e10Data.supplierStats.optimized }}</div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-section">
      <div class="action-buttons">
        <button class="sync-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="syncE10Data">同步数据</button>
        <button class="export-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="exportData">导出报表</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 数据状态
const loading = ref(false)
const error = ref(null)

// E10系统数据
const e10Data = ref({
  connection: '正常',
  lastUpdate: '2024-08-09 15:45:00',
  syncStatus: '已完成',
  qualityMetrics: [
    { metric: '数据完整性', score: 98.5 },
    { metric: '数据准确性', score: 96.2 },
    { metric: '数据时效性', score: 94.8 }
  ],
  supplierStats: {
    total: 356,
    active: 298,
    newAdded: 73,
    optimized: 118
  }
})

// 获取质量评分样式类
const getQualityClass = (score) => {
  if (score >= 95) return 'quality-excellent'
  if (score >= 90) return 'quality-good'
  if (score >= 85) return 'quality-normal'
  return 'quality-warning'
}

// 获取质量条样式类
const getQualityBarClass = (score) => {
  if (score >= 95) return 'bar-excellent'
  if (score >= 90) return 'bar-good'
  if (score >= 85) return 'bar-normal'
  return 'bar-warning'
}

// 同步E10数据
const syncE10Data = () => {
  console.log('开始同步E10数据')
  loading.value = true
  e10Data.value.syncStatus = '同步中'
  
  // 模拟同步过程
  setTimeout(() => {
    loading.value = false
    e10Data.value.syncStatus = '已完成'
    e10Data.value.lastUpdate = new Date().toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
    console.log('E10数据同步完成')
  }, 2000)
}

// 导出数据
const exportData = () => {
  console.log('导出供应商数据报表')
  // 后续可以添加数据导出功能
}
</script>

<style scoped>
.part3-container {
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  backdrop-filter: blur(5px);
  color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-title {
  /* font-size: 12px; */
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 4px;
}

/* 系统状态样式 */
.system-status {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 3px;
  padding: 4px;
  margin-bottom: 6px;
}

.status-title {
  color: #00d4ff;
  margin-bottom: 4px;
  text-align: center;
  font-weight: bold;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  color: #8cc8ff;
}

.status-value {
  color: #fff;
}

/* 数据质量监控样式 */
.quality-monitor {
  background: rgba(0, 30, 60, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.4);
  border-radius: 4px;
  padding: 6px;
  margin-bottom: 8px;
  backdrop-filter: blur(3px);
}

.monitor-title {
  color: #00d4ff;
  margin-bottom: 4px;
  text-align: center;
  font-weight: bold;
}

.quality-items {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.quality-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.quality-name {
  width: 60px;
  color: #8cc8ff;
}

.quality-value {
  width: 30px;
  text-align: center;
}

.quality-bar {
  flex: 1;
  height: 3px;
  background: rgba(71, 85, 105, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.quality-fill {
  height: 100%;
  transition: width 0.3s ease;
}

/* 质量评分颜色样式 */
.quality-excellent {
  color: #22c55e;
}

.quality-good {
  color: #3b82f6;
}

.quality-normal {
  color: #f59e0b;
}

.quality-warning {
  color: #ef4444;
}

.bar-excellent {
  background: linear-gradient(90deg, #22c55e, #34d399);
}

.bar-good {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.bar-normal {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.bar-warning {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

/* 供应商统计样式 */
.supplier-stats {
  background: rgba(0, 30, 60, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.4);
  border-radius: 4px;
  padding: 6px;
  margin-bottom: 8px;
  flex: 1;
  backdrop-filter: blur(3px);
}

.stats-title {
  color: #00d4ff;
  margin-bottom: 4px;
  text-align: center;
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.stat-item {
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 3px;
  padding: 3px;
  text-align: center;
}

.stat-label {
  color: #8cc8ff;
  margin-bottom: 1px;
}

.stat-value {
  color: #fff;
  font-weight: bold;
}

/* 操作按钮样式 */
.action-section {
  margin-top: auto;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.sync-btn {
  flex: 1;
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid rgba(0, 255, 136, 0.3);
  color: #00ff88;
  padding: 2px 4px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sync-btn:hover {
  background: rgba(0, 255, 136, 0.3);
  border-color: #00ff88;
}

.export-btn {
  flex: 1;
  background: rgba(0, 212, 255, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
  padding: 2px 4px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn:hover {
  background: rgba(0, 212, 255, 0.3);
  border-color: #00d4ff;
}

.loading-indicator {
  color: #00d4ff;
  font-size: 10px;
  margin-left: 8px;
  animation: pulse 1.5s infinite;
}

.error-indicator {
  margin-left: 8px;
  cursor: pointer;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>