<template>
  <div class="labor-productivity">
    <div class="component-header">
      <div class="header-icon">👥</div>
      <div class="header-title">劳动产出</div>
      <div class="header-status" :class="productivityLevel">
        <span class="status-dot"></span>
        {{ productivityLevelText }}
      </div>
    </div>
    
    <div class="content-area">
      <div class="scrollable-content">
        <div class="main-metrics">
          <div class="metric-card productivity-rate">
            <div class="metric-content">
              <div class="metric-circle">
                <svg viewBox="0 0 120 120" class="progress-ring">
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:var(--primary-blue);stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="rgba(0, 212, 255, 0.2)"
                    stroke-width="8"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#gradient2)"
                    stroke-width="8"
                    fill="transparent"
                    stroke-dasharray="314"
                    :stroke-dashoffset="132465"
                    stroke-linecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div class="metric-value">132465</div>
              </div>
              <div class="metric-info">
                <div class="metric-label">人均产值</div>
                <div class="metric-trend">
                  <!-- <span class="trend-arrow" :class="productivityTrend > 0 ? 'up' : 'down'">
                    {{ productivityTrend > 0 ? '↗' : '↘' }}
                  </span> -->
                  <span class="trend-value" :class="productivityTrend > 0 ? 'positive' : 'negative'">
                    ¥ 132465
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- <div class="metric-card efficiency-ratio">
            <div class="metric-value">{{ efficiencyRatio }}%</div>
            <div class="metric-label">效率比率</div>
            <div class="efficiency-breakdown">
              <div class="efficiency-item">
                <span class="efficiency-type">人数</span>
                <span class="efficiency-value">436 人</span>
              </div>
              <div class="efficiency-item">
                <span class="efficiency-type">收入</span>
                <span class="efficiency-value">¥57,754,681.7</span>
              </div> -->
              <!-- <div class="efficiency-item">
                <span class="efficiency-type">加班工时</span>
                <span class="efficiency-value">{{ overtimeHours }}h</span>
              </div> -->
            <!-- </div> -->
          <!-- </div> -->
        </div>
        
   
        
      
        </div>
      </div>
    </div>
    
    <!-- SVG渐变定义 -->
    <!-- <svg width="0" height="0">
      <defs>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--primary-blue);stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg> -->

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 劳动生产率数据
const productivityRate = ref(87.5)
const productivityTrend = ref(2.3)
const efficiencyRatio = ref(92.8)
const standardHours = ref(160)
const actualHours = ref(148)
const overtimeHours = ref(12)

// 劳动力统计
const totalEmployees = ref(1250)
const productionStaff = ref(850)
const technicalStaff = ref(280)
const managementStaff = ref(120)

// 月度生产率数据
const monthlyProductivity = ref([82.1, 84.3, 85.7, 86.2, 86.8, 87.5])

// 绩效预警
const performanceAlerts = ref([
  {
    id: 1,
    level: 'warning',
    icon: '⚠️',
    title: '生产效率下降',
    description: '2号线生产效率低于85%',
    time: '3小时前'
  },
  {
    id: 2,
    level: 'info',
    icon: 'ℹ️',
    title: '技能培训建议',
    description: '建议为生产人员安排技能提升培训',
    time: '1天前'
  },
  {
    id: 3,
    level: 'success',
    icon: '✅',
    title: '效率提升完成',
    description: '新工艺改进完成，效率提升3.2%',
    time: '2天前'
  }
])

// 计算生产率等级
const productivityLevel = computed(() => {
  if (productivityRate.value >= 90) return 'excellent'
  if (productivityRate.value >= 80) return 'good'
  if (productivityRate.value >= 70) return 'warning'
  return 'critical'
})

const productivityLevelText = computed(() => {
  const levelMap = {
    excellent: '优秀',
    good: '良好',
    warning: '注意',
    critical: '严重'
  }
  return levelMap[productivityLevel.value]
})

// 获取柱状图样式类
const getBarClass = (value) => {
  if (value >= 90) return 'excellent'
  if (value >= 80) return 'good'
  if (value >= 70) return 'warning'
  return 'critical'
}

// 模拟数据更新
onMounted(() => {
  setInterval(() => {
    // 模拟生产率变化
    productivityRate.value = Math.max(80, Math.min(95, productivityRate.value + (Math.random() - 0.5) * 0.6))
    productivityTrend.value = Math.max(-2, Math.min(3, productivityTrend.value + (Math.random() - 0.5) * 0.4))
    efficiencyRatio.value = Math.max(85, Math.min(98, efficiencyRatio.value + (Math.random() - 0.5) * 0.8))
    
    // 更新月度数据
    monthlyProductivity.value = monthlyProductivity.value.map(value => 
      Math.max(75, Math.min(95, value + (Math.random() - 0.5) * 2))
    )
  }, 18000)
})
</script>

<style scoped>
.labor-productivity {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.component-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 212, 255, 0.1);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.header-icon {
  font-size: 20px;
}

.header-title {
  color: var(--primary-blue);
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.3);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.header-status.excellent .status-dot {
  background: #00ff00;
}

.header-status.good .status-dot {
  background: var(--primary-blue);
}

.header-status.warning .status-dot {
  background: #ffaa00;
}

.header-status.critical .status-dot {
  background: #ff0000;
}

.content-area {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  min-height: 0;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 4px;
}

/* 自定义滚动条样式 */
.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.4);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.6);
}

/* Firefox滚动条样式 */
.scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.4) rgba(0, 0, 0, 0.2);
}

.main-metrics {
  /* display: grid; */
  /* grid-template-columns: 1fr; */
  gap: 16px;
  display: flex;
  width: 100%;
}

.metric-card {
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  width: 100%;
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
}

.metric-circle {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.metric-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  text-align: left;
}

.progress-ring {
  width: 100%;
  height: 100%;
}

.metric-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-blue);
}

.metric-label {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.metric-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
}

.trend-arrow.up {
  color: #10B981;
}

.trend-arrow.down {
  color: #EF4444;
}

.trend-value.positive {
  color: #10B981;
}

.trend-value.negative {
  color: #EF4444;
}

.efficiency-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.efficiency-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.efficiency-type {
  font-size: 11px;
  color: var(--text-muted);
}

.efficiency-value {
  font-size: 12px;
  color: var(--primary-blue);
  font-weight: 600;
}

.workforce-stats {
  flex: 1;
}

.section-title {
  color: var(--primary-blue);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.stat-value {
  font-size: 14px;
  color: var(--primary-blue);
  font-weight: 600;
}

.productivity-trends {
  flex: 1;
}

.trend-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted);
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: end;
  height: 60px;
  gap: 4px;
}

.chart-bar {
  flex: 1;
  background: rgba(0, 212, 255, 0.3);
  border-radius: 2px;
  transition: height 0.3s ease;
  min-height: 4px;
}

.chart-bar.excellent {
  background: linear-gradient(to top, #10B981, #34D399);
}

.chart-bar.good {
  background: linear-gradient(to top, var(--primary-blue), var(--secondary-blue));
}

.chart-bar.warning {
  background: linear-gradient(to top, #F59E0B, #FBBF24);
}

.chart-bar.critical {
  background: linear-gradient(to top, #EF4444, #F87171);
}

.performance-alerts {
  flex: 1;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 3px solid transparent;
}

.alert-item.warning {
  border-left-color: #ffaa00;
}

.alert-item.info {
  border-left-color: var(--primary-blue);
}

.alert-item.success {
  border-left-color: #00ff00;
}

.alert-icon {
  font-size: 16px;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 2px;
}

.alert-desc {
  font-size: 10px;
  color: var(--text-muted);
}

.alert-time {
  font-size: 10px;
  color: #666;
}

/* 2000px断点响应式设计 */
@media (min-width: 2000px) {
  .labor-productivity {
    margin-left: 15px;
  }
  
  .component-header {
    /* padding: 12px 16px; */
    gap: 10px;
    padding: 0px;
  }
  
  .header-icon {
    font-size: 10px;
  }
  
  .header-title {
    font-size: 10px;
  }
  
  .header-status {
    padding: 4px 8px;
    font-size: 12px;
    gap: 6px;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
  }
  
  .content-area {
    padding: 20px;
    gap: 24px;
  }
  
  .scrollable-content {
    gap: 24px;
    padding-right: 6px;
  }
  
  .scrollable-content::-webkit-scrollbar {
    width: 8px;
  }
  
  .main-metrics {
    gap: 20px;
  }
  
  .metric-card {
    padding: 20px;
    border-radius: 10px;
  }
  
  .metric-content {
    gap: 24px;
  }
  
  .metric-circle {
    width: 140px;
    height: 140px;
  }
  
  .metric-value {
    font-size: 28px;
  }
  
  .metric-label {
    font-size: 16px;
  }
  
  .metric-info {
    gap: 10px;
  }
  
  .metric-trend {
    font-size: 14px;
    gap: 6px;
  }
  
  .efficiency-breakdown {
    gap: 10px;
    margin-top: 16px;
  }
  
  .efficiency-item {
    padding: 8px 12px;
    border-radius: 6px;
  }
  
  .efficiency-type {
    font-size: 13px;
  }
  
  .efficiency-value {
    font-size: 14px;
  }
  
  .section-title {
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .stats-grid {
    gap: 16px;
  }
  
  .stat-item {
    padding: 12px 16px;
    border-radius: 8px;
  }
  
  .stat-label {
    font-size: 14px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .trend-chart {
    gap: 12px;
  }
  
  .chart-labels {
    font-size: 12px;
  }
  
  .chart-bars {
    height: 80px;
    gap: 6px;
  }
  
  .chart-bar {
    border-radius: 3px;
    min-height: 6px;
  }
  
  .alert-list {
    gap: 12px;
  }
  
  .alert-item {
    padding: 12px 16px;
    border-radius: 8px;
    gap: 16px;
  }
  
  .alert-icon {
    font-size: 18px;
  }
  
  .alert-title {
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  .alert-desc {
    font-size: 12px;
  }
  
  .alert-time {
    font-size: 12px;
  }
}
</style> 