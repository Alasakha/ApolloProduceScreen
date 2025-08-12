<template>
  <div class="manager-container flex-1">
    <!-- 分管责任人1 -->
    <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
      采购经理A - 降本占比
      <span v-if="loading" class="loading-indicator">加载中...</span>
      <span v-if="error" class="error-indicator" :title="error">❌</span>
    </div>
    
    <!-- 月度数据 -->
    <div class="data-section">
      <div class="period-title">
        <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-sm">月度降本贡献</span>
        <div class="action-buttons">
          <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showManagerDetail">查看详情</button>
          <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showReasonDialog">填写原因/对策</button>
        </div>
      </div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标金额(万元)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ managerData.monthly.target }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际金额(万元)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ managerData.monthly.actual }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">占比</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getPercentageClass(managerData.monthly.percentage)">
            {{ managerData.monthly.percentage }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 年度数据 -->
    <div class="data-section">
      <div class="period-title">
        <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">年度降本贡献</span>
        <div class="action-buttons">
          <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showYearlyDetail">查看详情</button>
          <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showYearlyReasonDialog">填写原因/对策</button>
        </div>
      </div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度目标(万元)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ managerData.yearly.target }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度累计(万元)</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ managerData.yearly.cumulative }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度占比</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getPercentageClass(managerData.yearly.percentage)">
            {{ managerData.yearly.percentage }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 分类降本明细 -->
    <!-- <div class="category-section">
      <div class="category-title text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">分类降本明细</div>
      <div class="category-items">
        <div 
          v-for="category in managerData.categories" 
          :key="category.name"
          class="category-item"
        >
          <div class="category-name text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">{{ category.name }}</div>
          <div class="category-amount text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">{{ category.amount }}万元</div>
          <div class="category-bar">
            <div class="category-fill" :style="{ width: `${category.progress}%` }"></div>
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

// 采购经理数据
const managerData = ref({
  monthly: {
    target: 18.0,      // 月度目标金额(万元)
    actual: 12.5,      // 月度实际金额(万元)
    percentage: 38.1   // 月度占比
  },
  yearly: {
    target: 216.0,     // 年度目标(万元)
    cumulative: 162.8, // 年度累计(万元)
    percentage: 38.3   // 年度占比
  },
  categories: [
    { name: '原材料降本', amount: 8.2, progress: 65.6 },
    { name: '包装降本', amount: 2.8, progress: 22.4 },
    { name: '运输降本', amount: 1.5, progress: 12.0 }
  ]
})

// 获取占比样式类
const getPercentageClass = (value) => {
  if (value >= 40) return 'percentage-excellent'
  if (value >= 35) return 'percentage-good'
  if (value >= 30) return 'percentage-normal'
  return 'percentage-warning'
}

// 查看月度详情
const showManagerDetail = () => {
  console.log('查看采购经理A月度详情')
  // 后续可以添加弹窗显示详细数据
}

// 查看年度详情
const showYearlyDetail = () => {
  console.log('查看采购经理A年度详情')
  // 后续可以添加弹窗显示详细数据
}

// 填写原因/对策
const showReasonDialog = () => {
  console.log('填写采购经理A月度原因/对策')
  // 后续可以添加原因对策填写弹窗
}

const showYearlyReasonDialog = () => {
  console.log('填写采购经理A年度原因/对策')
  // 后续可以添加原因对策填写弹窗
}
</script>

<style scoped>
.manager-container {
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

/* 占比颜色样式 */
.percentage-excellent {
  color: #22c55e !important;
}

.percentage-good {
  color: #3b82f6 !important;
}

.percentage-normal {
  color: #f59e0b !important;
}

.percentage-warning {
  color: #ef4444 !important;
}

/* 分类降本明细样式 */
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
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 3px;
  padding: 4px;
}

.category-name {
  color: #cbd5e1;
  margin-bottom: 2px;
}

.category-amount {
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
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transition: width 0.3s ease;
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