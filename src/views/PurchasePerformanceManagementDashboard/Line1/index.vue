<template>
  <div class="line1-container">
    <!-- 月度降本目标管理 -->
    <div class="cost-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
        月度降本目标管理
        <span v-if="loading" class="loading-indicator">加载中...</span>
        <span v-if="error" class="error-indicator" :title="error">❌</span>
      </div>
      
      <!-- 月度降本数据 -->
      <div class="data-section">
        <div class="period-title">
          <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-sm">月度降本达成情况</span>
          <div class="action-buttons">
            <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showCostDetail">查看详情</button>
            <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showReasonDialog">填写原因/对策</button>
          </div>
        </div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标金额(万元)</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ costReductionData.monthly.target }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">累计达成金额(万元)</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAmountClass(costReductionData.monthly.actual, costReductionData.monthly.target)">
              {{ costReductionData.monthly.actual }}
            </div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">累计达成率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(costReductionData.monthly.achievement)">
              {{ costReductionData.monthly.achievement }}%
            </div>
          </div>
        </div>
        
        <!-- 按周分摊进度 -->
        <div class="weekly-progress">
          <div class="week-title text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">按周分摊进度</div>
          <div class="week-bars">
            <div 
              v-for="(week, index) in costReductionData.weeklyProgress" 
              :key="index"
              class="week-bar"
              :class="{ 'week-warning': week.isWarning }"
            >
              <div class="week-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">第{{ index + 1 }}周</div>
              <div class="week-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" :class="{ 'text-red-400': week.isWarning }">
                {{ week.actual }}/{{ week.target }}
              </div>
              <div class="week-progress-bar">
                <div class="week-progress-fill" :style="{ width: `${week.progress}%` }" :class="{ 'bg-red-500': week.isWarning, 'bg-green-500': !week.isWarning }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 年度降本累计
    <div class="cost-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">年度降本累计</div>
      
      <div class="data-section">
        <div class="period-title">
          <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">年度降本达成情况</span>
          <div class="action-buttons">
            <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showYearlyCostDetail">查看详情</button>
            <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showYearlyReasonDialog">填写原因/对策</button>
          </div>
        </div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度目标(万元)</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ costReductionData.yearly.target }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度累计(万元)</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ costReductionData.yearly.cumulative }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(costReductionData.yearly.achievement)">
              {{ costReductionData.yearly.achievement }}%
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 数据状态
const loading = ref(false)
const error = ref(null)

// 降本数据
const costReductionData = ref({
  monthly: {
    target: 50.0,      // 月度目标金额(万元)
    actual: 32.8,      // 月度累计达成金额(万元) - 人工核算
    achievement: 65.6  // 月度累计达成率
  },
  yearly: {
    target: 600.0,     // 年度目标(万元)
    cumulative: 425.6, // 年度累计(万元)
    achievement: 70.9   // 年度达成率
  },
  weeklyProgress: [
    { target: 12.5, actual: 8.2, progress: 65.6, isWarning: true },   // 第1周
    { target: 12.5, actual: 11.8, progress: 94.4, isWarning: false }, // 第2周
    { target: 12.5, actual: 6.9, progress: 55.2, isWarning: true },   // 第3周
    { target: 12.5, actual: 5.9, progress: 47.2, isWarning: true }    // 第4周
  ]
})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 100) return 'achievement-excellent'
  if (value >= 95) return 'achievement-good'
  if (value >= 90) return 'achievement-normal'
  return 'achievement-warning'
}

// 获取金额样式类
const getAmountClass = (actual, target) => {
  const rate = (actual / target) * 100
  if (rate >= 100) return 'achievement-excellent'
  if (rate >= 95) return 'achievement-good'
  if (rate >= 90) return 'achievement-normal'
  return 'achievement-warning'
}

// 查看月度详情
const showCostDetail = () => {
  console.log('查看月度降本详情')
  // 后续可以添加弹窗显示详细数据
}

// 查看年度详情
const showYearlyCostDetail = () => {
  console.log('查看年度降本详情')
  // 后续可以添加弹窗显示详细数据
}

// 填写原因/对策
const showReasonDialog = () => {
  console.log('填写月度原因/对策')
  // 后续可以添加原因对策填写弹窗
}

const showYearlyReasonDialog = () => {
  console.log('填写年度原因/对策')
  // 后续可以添加原因对策填写弹窗
}

// 组件挂载时启动数据获取
onMounted(() => {
  // 这里可以添加数据获取逻辑
})

// 组件卸载时清理
onUnmounted(() => {
  // 清理定时器等
})
</script>

<style scoped>
.line1-container {
  display: flex;
  gap: 8px;
  height: 100%;
  color: #fff;
}

.cost-section {
  flex: 1;
  height: 100%;
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  position: relative;
  backdrop-filter: blur(5px);
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
  gap: 8px;
  margin-bottom: 8px;
}

.metric-item {
  flex: 1;
  text-align: center;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 6px;
  padding: 8px 4px;
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

/* 按周分摊进度样式 */
.weekly-progress {
  margin-top: 12px;
}

.week-title {
  color: #93c5fd;
  margin-bottom: 6px;
  text-align: center;
}

.week-bars {
  display: flex;
  gap: 4px;
}

.week-bar {
  flex: 1;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 4px;
  padding: 4px;
  text-align: center;
}

.week-bar.week-warning {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.1);
}

.week-label {
  color: #cbd5e1;
  margin-bottom: 2px;
}

.week-value {
  color: #e2e8f0;
  margin-bottom: 4px;
}

.week-progress-bar {
  height: 4px;
  background: rgba(71, 85, 105, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.week-progress-fill {
  height: 100%;
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