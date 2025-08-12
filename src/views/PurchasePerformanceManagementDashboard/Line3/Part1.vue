<template>
  <div class="part1-container">
    <!-- PLI新产品采购计划总体情况 -->
    <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
      PLI新产品采购计划达成率
      <span v-if="loading" class="loading-indicator">加载中...</span>
      <span v-if="error" class="error-indicator" :title="error">❌</span>
    </div>
    
    <!-- 月度数据 -->
    <div class="data-section">
      <div class="period-title">
        <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-sm">月度PLI达成情况</span>
        <div class="action-buttons">
          <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showPLIDetail">查看详情</button>
          <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showReasonDialog">填写原因/对策</button>
        </div>
      </div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">计划数(项)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ pliData.monthly.planned }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">完成数(项)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ pliData.monthly.completed }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(pliData.monthly.achievement)">
            {{ pliData.monthly.achievement }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 年度数据 -->
    <div class="data-section">
      <div class="period-title">
        <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">年度PLI达成情况</span>
        <div class="action-buttons">
          <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showYearlyPLIDetail">查看详情</button>
          <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showYearlyReasonDialog">填写原因/对策</button>
        </div>
      </div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度计划(项)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ pliData.yearly.planned }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度完成(项)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ pliData.yearly.completed }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(pliData.yearly.achievement)">
            {{ pliData.yearly.achievement }}%
          </div>
        </div>
      </div>
    </div>

    <!-- PLM系统数据状态
    <div class="plm-status">
      <div class="status-title text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">PLM数据状态</div>
      <div class="status-info">
        <div class="status-item">
          <div class="status-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">数据来源</div>
          <div class="status-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">PLM系统</div>
        </div>
        <div class="status-item">
          <div class="status-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">更新时间</div>
          <div class="status-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">{{ pliData.lastUpdate }}</div>
        </div>
        <div class="status-item">
          <div class="status-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">连接状态</div>
          <div class="status-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" :class="pliData.connectionStatus === '正常' ? 'text-green-400' : 'text-red-400'">
            {{ pliData.connectionStatus }}
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 数据状态
const loading = ref(false)
const error = ref(null)

// PLI数据
const pliData = ref({
  monthly: {
    planned: 15,       // 月度计划数(项)
    completed: 12,     // 月度完成数(项)
    achievement: 80.0  // 月度达成率
  },
  yearly: {
    planned: 180,      // 年度计划(项)
    completed: 142,    // 年度完成(项)
    achievement: 78.9  // 年度达成率
  },
  lastUpdate: '2024-08-09 15:30:00',
  connectionStatus: '正常'
})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 95) return 'achievement-excellent'
  if (value >= 85) return 'achievement-good'
  if (value >= 75) return 'achievement-normal'
  return 'achievement-warning'
}

// 查看月度详情
const showPLIDetail = () => {
  console.log('查看月度PLI详情')
  // 后续可以添加弹窗显示详细数据
}

// 查看年度详情
const showYearlyPLIDetail = () => {
  console.log('查看年度PLI详情')
  // 后续可以添加弹窗显示详细数据
}

// 填写原因/对策
const showReasonDialog = () => {
  console.log('填写月度PLI原因/对策')
  // 后续可以添加原因对策填写弹窗
}

const showYearlyReasonDialog = () => {
  console.log('填写年度PLI原因/对策')
  // 后续可以添加原因对策填写弹窗
}
</script>

<style scoped>
.part1-container {
  height: 100%;
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  position: relative;
  backdrop-filter: blur(5px);
  color: #fff;
}

.section-title {
  color: #60a5fa;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  padding-bottom: 4px;
}

.data-section {
  margin-bottom: 12px;
}

.period-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #93c5fd;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.detail-btn {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #93c5fd;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.detail-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.6);
}

.reason-btn {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.reason-btn:hover {
  background: rgba(245, 158, 11, 0.3);
  border-color: rgba(245, 158, 11, 0.6);
}

.metrics-row {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.metric-item {
  flex: 1;
  text-align: center;
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 3px;
  padding: 6px 2px;
}

.metric-label {
  color: #cbd5e1;
  margin-bottom: 4px;
}

.metric-value {
  color: #e2e8f0;
}

/* 达成率颜色样式 */
.achievement-excellent {
  color: #22c55e !important;
}

.achievement-good {
  color: #3b82f6 !important;
}

.achievement-normal {
  color: #f59e0b !important;
}

.achievement-warning {
  color: #ef4444 !important;
}

/* PLM状态样式 */
.plm-status {
  margin-top: 8px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 6px;
  padding: 8px;
}

.status-title {
  color: #93c5fd;
  margin-bottom: 6px;
  text-align: center;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  color: #cbd5e1;
}

.status-value {
  color: #e2e8f0;
}

.loading-indicator {
  color: #fbbf24;
  font-size: 10px;
  margin-left: 8px;
}

.error-indicator {
  color: #ef4444;
  font-size: 12px;
  margin-left: 8px;
  cursor: help;
}
</style>