<template>
  <div class="chart-container">
    <div class="chart-title">生产效率监控</div>
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
  categories: ['冲压', '焊接', '涂装', '总装', '检验', '包装'],
  data: [92.5, 88.3, 85.7, 90.2, 94.1, 87.9]
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
      data: chartData.value.data.map(value => ({
        value,
        itemStyle: {
          color: getBarColor(value)
        }
      })),
      barWidth: '50%',
      label: {
        show: true,
        position: 'top',
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        formatter: '{c}%'
      }
    }]
  }

  chartInstance.setOption(option)
}

// 根据数值获取柱状图颜色
const getBarColor = (value) => {
  if (value >= 95) return '#00ff88'  // 优秀 - 绿色
  if (value >= 85) return '#00d4ff'  // 良好 - 蓝色  
  if (value >= 75) return '#ffaa00'  // 一般 - 黄色
  return '#ff4444'                   // 较差 - 红色
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