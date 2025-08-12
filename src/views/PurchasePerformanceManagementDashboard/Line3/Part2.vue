<template>
  <div class="part2-container">
    <!-- 按采购工程师分类情况 -->
    <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
      采购工程师PLI占比
      <span v-if="loading" class="loading-indicator">加载中...</span>
      <span v-if="error" class="error-indicator" :title="error">❌</span>
    </div>
    
    <!-- 采购工程师列表 -->
    <div class="engineer-list">
      <div 
        v-for="engineer in engineersData" 
        :key="engineer.name"
        class="engineer-item"
      >
        <div class="engineer-header">
          <div class="engineer-name text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">{{ engineer.name }}</div>
          <div class="action-buttons">
            <button class="detail-btn text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]" @click="showEngineerDetail(engineer.name)">明细</button>
          </div>
        </div>
        
        <div class="engineer-metrics">
          <div class="metric-row">
            <div class="metric-small">
              <div class="metric-label-small text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">计划</div>
              <div class="metric-value-small text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">{{ engineer.planned }}</div>
            </div>
            <div class="metric-small">
              <div class="metric-label-small text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">完成</div>
              <div class="metric-value-small text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">{{ engineer.completed }}</div>
            </div>
            <div class="metric-small">
              <div class="metric-label-small text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">达成率</div>
              <div class="metric-value-small text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" :class="getAchievementClass(engineer.achievement)">
                {{ engineer.achievement }}%
              </div>
            </div>
            <div class="metric-small">
              <div class="metric-label-small text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">占比</div>
              <div class="metric-value-small text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">{{ engineer.percentage }}%</div>
            </div>
          </div>
          
          <!-- 进度条 -->
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${engineer.achievement}%` }" :class="getProgressClass(engineer.achievement)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计汇总 -->
    <div class="summary-section">
      <div class="summary-title text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">统计汇总</div>
      <div class="summary-metrics">
        <div class="summary-item">
          <div class="summary-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">总计划</div>
          <div class="summary-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">{{ summaryData.totalPlanned }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">总完成</div>
          <div class="summary-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">{{ summaryData.totalCompleted }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">总达成率</div>
          <div class="summary-value text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" :class="getAchievementClass(summaryData.totalAchievement)">
            {{ summaryData.totalAchievement }}%
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

// 采购工程师数据
const engineersData = ref([
  {
    name: '张工程师',
    planned: 5,
    completed: 4,
    achievement: 80.0,
    percentage: 33.3
  },
  {
    name: '李工程师',
    planned: 4,
    completed: 3,
    achievement: 75.0,
    percentage: 25.0
  },
  {
    name: '王工程师',
    planned: 3,
    completed: 3,
    achievement: 100.0,
    percentage: 25.0
  },
  {
    name: '赵工程师',
    planned: 3,
    completed: 2,
    achievement: 66.7,
    percentage: 16.7
  }
])

// 统计汇总数据
const summaryData = computed(() => {
  const totalPlanned = engineersData.value.reduce((sum, eng) => sum + eng.planned, 0)
  const totalCompleted = engineersData.value.reduce((sum, eng) => sum + eng.completed, 0)
  const totalAchievement = totalPlanned > 0 ? (totalCompleted / totalPlanned * 100).toFixed(1) : 0
  
  return {
    totalPlanned,
    totalCompleted,
    totalAchievement: parseFloat(totalAchievement)
  }
})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 95) return 'achievement-excellent'
  if (value >= 85) return 'achievement-good'
  if (value >= 75) return 'achievement-normal'
  return 'achievement-warning'
}

// 获取进度条样式类
const getProgressClass = (value) => {
  if (value >= 95) return 'progress-excellent'
  if (value >= 85) return 'progress-good'
  if (value >= 75) return 'progress-normal'
  return 'progress-warning'
}

// 查看工程师详情
const showEngineerDetail = (engineerName) => {
  console.log(`查看${engineerName}的PLI详情`)
  // 后续可以添加弹窗显示详细数据
}
</script>

<style scoped>
.part2-container {
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

.engineer-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
  max-height: 60%;
  overflow-y: auto;
}

.engineer-item {
  background: rgba(0, 30, 60, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.4);
  border-radius: 4px;
  padding: 6px;
  backdrop-filter: blur(3px);
}

.engineer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.engineer-name {
  color: #93c5fd;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 2px;
}

.detail-btn {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #93c5fd;
  padding: 1px 4px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s;
}

.detail-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.6);
}

.engineer-metrics {
  margin-bottom: 4px;
}

.metric-row {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.metric-small {
  flex: 1;
  text-align: center;
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 3px;
  padding: 3px 2px;
}

.metric-label-small {
  color: #cbd5e1;
  margin-bottom: 2px;
}

.metric-value-small {
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

/* 进度条样式 */
.progress-bar {
  height: 4px;
  background: rgba(71, 85, 105, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-excellent {
  background: linear-gradient(90deg, #22c55e, #34d399);
}

.progress-good {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.progress-normal {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.progress-warning {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

/* 统计汇总样式 */
.summary-section {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 6px;
  padding: 6px;
}

.summary-title {
  color: #93c5fd;
  margin-bottom: 4px;
  text-align: center;
}

.summary-metrics {
  display: flex;
  gap: 4px;
}

.summary-item {
  flex: 1;
  text-align: center;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 4px;
  padding: 3px 2px;
}

.summary-label {
  color: #cbd5e1;
  margin-bottom: 2px;
}

.summary-value {
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

/* 滚动条样式 */
.engineer-list::-webkit-scrollbar {
  width: 4px;
}

.engineer-list::-webkit-scrollbar-track {
  background: rgba(71, 85, 105, 0.2);
  border-radius: 2px;
}

.engineer-list::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 2px;
}

.engineer-list::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}
</style>