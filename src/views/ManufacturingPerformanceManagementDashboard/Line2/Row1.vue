<template>
  <div class="row1-container flex-1">
    <!-- A类客户合计 -->
    <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">A类客户合计</div>
    
    <!-- 月度数据 -->
    <div class="data-section">
      <div class="period-title">
        <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-sm">月度总直通率</span>
        <div class="action-buttons">
          <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showMonthlyDetail">查看详情</button>
          <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showReasonDialog">填写原因/对策</button>
        </div>
      </div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ customerData.monthly.target }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ customerData.monthly.actual }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(customerData.monthly.achievement)">
            {{ customerData.monthly.achievement }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 年度数据 -->
    <div class="data-section">
      <div class="period-title">
        <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">年度总直通率</span>
        <div class="action-buttons">
          <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showYearlyDetail">查看详情</button>
          <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showYearlyReasonDialog">填写原因/对策</button>
        </div>
      </div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度目标</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ customerData.yearly.target }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度累计</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ customerData.yearly.cumulative }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(customerData.yearly.achievement)">
            {{ customerData.yearly.achievement }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock数据
const customerData = ref({
  monthly: {
    target: 95.0,
    actual: 92.5,
    achievement: 97.4
  },
  yearly: {
    target: 94.0,
    cumulative: 91.8,
    achievement: 97.7
  }
})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 100) return 'achievement-excellent'
  if (value >= 95) return 'achievement-good'
  if (value >= 90) return 'achievement-normal'
  return 'achievement-warning'
}

// 查看月度详情
const showMonthlyDetail = () => {
  console.log('查看月度详情')
  // 这里可以打开详情弹窗或跳转到详情页面
}

// 查看年度详情
const showYearlyDetail = () => {
  console.log('查看年度详情')
  // 这里可以打开详情弹窗或跳转到详情页面
}

// 填写月度原因/对策
const showReasonDialog = () => {
  console.log('填写月度原因/对策')
  // 这里可以打开原因/对策填写弹窗
}

// 填写年度原因/对策
const showYearlyReasonDialog = () => {
  console.log('填写年度原因/对策')
  // 这里可以打开原因/对策填写弹窗
}
</script>

<style scoped>
.row1-container {
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
  background: rgba(0, 0, 0, 0.1);
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
</style>