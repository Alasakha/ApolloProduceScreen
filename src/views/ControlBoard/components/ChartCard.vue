<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-actions">
        <button class="action-btn" @click="refreshChart">🔄</button>
        <button class="action-btn" @click="toggleFullscreen">⛶</button>
      </div>
    </div>
    
    <div class="chart-content" ref="chartContainer">
      <!-- 模拟图表内容 -->
      <div class="mock-chart">
        <div v-if="type === 'line'" class="line-chart">
          <div class="chart-line" v-for="(point, index) in chartData" :key="index">
            <div class="line-point" :style="{ left: `${point.x}%`, bottom: `${point.y}%` }"></div>
          </div>
        </div>
        
        <div v-else-if="type === 'pie'" class="pie-chart">
          <div class="pie-segment" 
               v-for="(segment, index) in pieData" 
               :key="index"
               :style="{ 
                 transform: `rotate(${segment.start}deg)`,
                 background: segment.color 
               }">
          </div>
        </div>
        
        <div v-else class="bar-chart">
          <div class="chart-bar" 
               v-for="(bar, index) in barData" 
               :key="index"
               :style="{ height: `${bar.height}%`, background: bar.color }">
          </div>
        </div>
      </div>
      
      <!-- 图表图例 -->
      <div class="chart-legend">
        <div class="legend-item" v-for="(item, index) in legendData" :key="index">
          <div class="legend-color" :style="{ background: item.color }"></div>
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'line'
  }
})

const chartContainer = ref(null)

// 模拟图表数据
const chartData = ref([
  { x: 10, y: 20 },
  { x: 25, y: 40 },
  { x: 40, y: 30 },
  { x: 55, y: 60 },
  { x: 70, y: 50 },
  { x: 85, y: 80 },
  { x: 100, y: 70 }
])

const pieData = ref([
  { start: 0, end: 90, color: '#00ff96' },
  { start: 90, end: 180, color: '#0096ff' },
  { start: 180, end: 270, color: '#ff9600' },
  { start: 270, end: 360, color: '#ff0066' }
])

const barData = ref([
  { height: 60, color: '#00ff96' },
  { height: 80, color: '#0096ff' },
  { height: 45, color: '#ff9600' },
  { height: 90, color: '#ff0066' },
  { height: 70, color: '#9600ff' }
])

const legendData = computed(() => {
  if (props.type === 'line') {
    return [
      { label: '销售额', value: '¥1.2M', color: '#00ff96' },
      { label: '订单量', value: '156', color: '#0096ff' }
    ]
  } else if (props.type === 'pie') {
    return [
      { label: '亚洲市场', value: '45%', color: '#00ff96' },
      { label: '欧洲市场', value: '30%', color: '#0096ff' },
      { label: '美洲市场', value: '20%', color: '#ff9600' },
      { label: '其他', value: '5%', color: '#ff0066' }
    ]
  } else {
    return [
      { label: 'Q1', value: '¥300K', color: '#00ff96' },
      { label: 'Q2', value: '¥400K', color: '#0096ff' },
      { label: 'Q3', value: '¥225K', color: '#ff9600' },
      { label: 'Q4', value: '¥450K', color: '#ff0066' }
    ]
  }
})

// 刷新图表
const refreshChart = () => {
  // 模拟数据刷新
  if (props.type === 'line') {
    chartData.value = chartData.value.map(point => ({
      x: point.x,
      y: Math.random() * 80 + 20
    }))
  }
}

// 切换全屏
const toggleFullscreen = () => {
  if (chartContainer.value) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      chartContainer.value.requestFullscreen()
    }
  }
}

onMounted(() => {
  // 可以在这里初始化真实的图表库，如 ECharts 或 Chart.js
})
</script>

<style scoped>
.chart-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.chart-card:hover {
  border-color: rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.action-btn:hover {
  background: rgba(0, 255, 255, 0.2);
  border-color: #00ffff;
}

.chart-content {
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
}

.mock-chart {
  flex: 1;
  position: relative;
  margin-bottom: 20px;
  min-height: 200px;
}

/* 折线图样式 */
.line-chart {
  position: relative;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.line-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00ffff;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

/* 饼图样式 */
.pie-chart {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 20px auto;
  overflow: hidden;
}

.pie-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: polygon(50% 50%, 100% 0%, 100% 100%);
}

/* 柱状图样式 */
.bar-chart {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 100%;
  padding: 20px 0;
}

.chart-bar {
  width: 30px;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  position: relative;
}

.chart-bar::after {
  content: attr(data-value);
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
}

/* 图例样式 */
.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  color: rgba(255, 255, 255, 0.7);
}

.legend-value {
  color: #00ffff;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-card {
    padding: 15px;
  }
  
  .chart-title {
    font-size: 14px;
  }
  
  .mock-chart {
    min-height: 150px;
  }
}
</style> 