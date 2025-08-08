<template>
  <div class="chart-container">
    <div class="chart-title">质量管控状态</div>
    <div ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

// 模拟数据
const chartData = ref({
  categories: ['合格率', '返工率', '废品率', '客诉率', '检验率', '首检率'],
  data: [98.5, 1.2, 0.3, 0.05, 99.8, 99.2]
})

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
  
  // 监听窗口变化
  window.addEventListener('resize', resizeChart)
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return

  const option = {
    grid: {
      left: '8%',
      right: '8%',
      top: '20%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.value.categories,
      axisLabel: {
        color: '#8cc8ff',
        fontSize: 11,
        interval: 0,
        rotate: 0
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 150, 255, 0.3)'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        color: '#8cc8ff',
        fontSize: 11,
        formatter: '{value}%'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 150, 255, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 150, 255, 0.1)'
        }
      }
    },
    series: [{
      type: 'bar',
      data: chartData.value.data.map((value, index) => ({
        value,
        itemStyle: {
          color: getBarColor(value, index)
        }
      })),
      barWidth: '50%',
      label: {
        show: true,
        position: 'top',
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        formatter: (params) => {
          // 对于很小的数值，显示更多小数位
          if (params.value < 1) {
            return params.value.toFixed(2) + '%'
          }
          return params.value.toFixed(1) + '%'
        }
      }
    }]
  }

  chartInstance.setOption(option)
}

// 根据数值和指标类型获取柱状图颜色
const getBarColor = (value, index) => {
  const category = chartData.value.categories[index]
  
  // 对于负向指标（返工率、废品率、客诉率），数值越低越好
  if (['返工率', '废品率', '客诉率'].includes(category)) {
    if (value <= 0.1) return '#00ff88'  // 优秀 - 绿色
    if (value <= 0.5) return '#00d4ff'  // 良好 - 蓝色
    if (value <= 1.0) return '#ffaa00'  // 一般 - 黄色
    return '#ff4444'                    // 较差 - 红色
  }
  
  // 对于正向指标（合格率、检验率、首检率），数值越高越好
  if (value >= 99) return '#00ff88'     // 优秀 - 绿色
  if (value >= 95) return '#00d4ff'     // 良好 - 蓝色  
  if (value >= 90) return '#ffaa00'     // 一般 - 黄色
  return '#ff4444'                      // 较差 - 红色
}

// 图表自适应
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 组件挂载时初始化图表
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})
</script>

<style scoped>
.chart-container {
  height: 100%;
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 14px;
  font-weight: bold;
  color: #00d4ff;
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
}

.chart-content {
  flex: 1;
  min-height: 0;
}
</style>