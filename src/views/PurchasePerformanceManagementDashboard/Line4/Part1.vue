<template>
  <div class="part1-container">
    <!-- 新供应商开发情况 -->
    <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
      新供应商开发计划
      <span v-if="loading" class="loading-indicator">加载中...</span>
      <span v-if="error" class="error-indicator" :title="error">❌</span>
    </div>
    
    <!-- 月度数据 -->
    <div class="data-section">
      <div class="period-title">
        <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-sm">月度开发情况</span>
        <div class="action-buttons">
          <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showSupplierDetail">查看详情</button>
          <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showReasonDialog">填写原因/对策</button>
        </div>
      </div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">计划开发(家)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ supplierData.monthly.planned }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际开发(家)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ supplierData.monthly.actual }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(supplierData.monthly.achievement)">
            {{ supplierData.monthly.achievement }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 年度数据 -->
    <div class="data-section">
      <div class="period-title">
        <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">年度开发情况</span>
        <div class="action-buttons">
          <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showYearlySupplierDetail">查看详情</button>
          <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showYearlyReasonDialog">填写原因/对策</button>
        </div>
      </div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度计划(家)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ supplierData.yearly.planned }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度完成(家)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ supplierData.yearly.actual }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(supplierData.yearly.achievement)">
            {{ supplierData.yearly.achievement }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 开发分类明细 -->
    <div class="category-section">
      <div class="category-title text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">开发分类明细</div>
      <div class="category-items">
        <div 
          v-for="category in supplierData.categories" 
          :key="category.type"
          class="category-item"
        >
          <div class="category-name text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">{{ category.type }}</div>
          <div class="category-count text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">{{ category.count }}家</div>
          <div class="category-bar">
            <div class="category-fill" :style="{ width: `${category.progress}%` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 数据状态
const loading = ref(false)
const error = ref(null)

// 供应商开发数据
const supplierData = ref({
  monthly: {
    planned: 8,        // 月度计划开发(家)
    actual: 6,         // 月度实际开发(家)
    achievement: 75.0  // 月度达成率
  },
  yearly: {
    planned: 96,       // 年度计划(家)
    actual: 73,        // 年度完成(家)
    achievement: 76.0  // 年度达成率
  },
  categories: [
    { type: '原材料供应商', count: 3, progress: 50.0 },
    { type: '包装材料供应商', count: 2, progress: 33.3 },
    { type: '设备供应商', count: 1, progress: 16.7 }
  ]
})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 95) return 'achievement-excellent'
  if (value >= 85) return 'achievement-good'
  if (value >= 75) return 'achievement-normal'
  return 'achievement-warning'
}

// 查看月度详情
const showSupplierDetail = () => {
  console.log('查看月度供应商开发详情')
  // 后续可以添加弹窗显示详细数据
}

// 查看年度详情
const showYearlySupplierDetail = () => {
  console.log('查看年度供应商开发详情')
  // 后续可以添加弹窗显示详细数据
}

// 填写原因/对策
const showReasonDialog = () => {
  console.log('填写月度供应商开发原因/对策')
  // 后续可以添加原因对策填写弹窗
}

const showYearlyReasonDialog = () => {
  console.log('填写年度供应商开发原因/对策')
  // 后续可以添加原因对策填写弹窗
}
</script>

<style scoped>
.part1-container {
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

.data-section {
  flex: 1;
  margin-bottom: 6px;
}

.data-section:last-child {
  margin-bottom: 0;
}

.period-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  padding-bottom: 2px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
}

.period-title span {
  /* font-size: 11px; */
  color: #00d4ff;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.detail-btn,
.reason-btn {
  padding: 2px 4px;
  border: none;
  border-radius: 3px;
  /* font-size: 9px; */
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-btn {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.detail-btn:hover {
  background: rgba(0, 212, 255, 0.3);
  border-color: #00d4ff;
}

.reason-btn {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.reason-btn:hover {
  background: rgba(0, 255, 136, 0.3);
  border-color: #00ff88;
}

.metrics-row {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  align-items: center;
}

.metric-item {
  flex: 1;
  text-align: center;
  padding: 4px;
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 3px;
}

.metric-label {
  /* font-size: 9px; */
  color: #8cc8ff;
  margin-bottom: 2px;
}

.metric-value {
  /* font-size: 13px; */
  font-weight: bold;
  color: #fff;
}

.achievement-excellent {
  color: #00ff88;
}

.achievement-good {
  color: #00d4ff;
}

.achievement-normal {
  color: #fff;
}

.achievement-warning {
  color: #ff4444;
}

/* 分类明细样式 */
.category-section {
  margin-top: 8px;
}

.category-title {
  color: #93c5fd;
  margin-bottom: 6px;
  text-align: center;
}

.category-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-item {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 4px;
  padding: 4px;
}

.category-name {
  color: #cbd5e1;
  margin-bottom: 2px;
}

.category-count {
  color: #e2e8f0;
  margin-bottom: 4px;
  text-align: center;
}

.category-bar {
  height: 3px;
  background: rgba(71, 85, 105, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.category-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
  transition: width 0.3s ease;
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