<template>
  <div class="chart-container">
    <div class="chart-title">直通率周度对比</div>
    <div ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

// 周直通率数据
const weeklyPassRateData = ref([
  {
    "a": {
      "completeNum": 74,
      "total": 74,
      "target": 0.95
    },
    "normal": {
      "completeNum": 31,
      "total": 31,
      "target": 0.9
    },
    "sunday": "2025-08-10",
    "monday": "2025-08-04"
  },
  {
    "a": {
      "completeNum": 99,
      "total": 99,
      "target": 0.95
    },
    "normal": {
      "completeNum": 56,
      "total": 56,
      "target": 0.9
    },
    "sunday": "2025-08-03",
    "monday": "2025-07-28"
  },
  {
    "a": {
      "completeNum": 73,
      "total": 75,
      "target": 0.95
    },
    "normal": {
      "completeNum": 62,
      "total": 65,
      "target": 0.9
    },
    "sunday": "2025-07-27",
    "monday": "2025-07-21"
  },
  {
    "a": {
      "completeNum": 54,
      "total": 54,
      "target": 0.95
    },
    "normal": {
      "completeNum": 16,
      "total": 16,
      "target": 0.9
    },
    "sunday": "2025-07-20",
    "monday": "2025-07-14"
  }
])

// 计算直通率
const calculatePassRate = (completeNum, total) => {
  if (total === 0) return 0
  return parseFloat((completeNum / total * 100).toFixed(1))
}

// 获取周标签
const getWeekLabel = (index) => {
  if (index === 0) return '本周'
  if (index === 1) return '上周'
  return `前${index + 1}周`
}

// 处理图表数据
const chartData = ref({
  categories: [],
  aClassData: [],
  normalData: []
})

// 更新图表数据
const updateChartData = () => {
  chartData.value.categories = weeklyPassRateData.value.map((_, index) => getWeekLabel(index))
  chartData.value.aClassData = weeklyPassRateData.value.map(week => calculatePassRate(week.a.completeNum, week.a.total))
  chartData.value.normalData = weeklyPassRateData.value.map(week => calculatePassRate(week.normal.completeNum, week.normal.total))
}

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
      left: '10%',
      right: '8%',
      top: '25%',
      bottom: '15%',
      containLabel: true
    },
    legend: {
      data: ['A类客户', '常规客户'],
      top: '5%',
      textStyle: {
        color: '#8cc8ff',
        fontSize: 11
      }
    },
    xAxis: {
      type: 'category',
      data: chartData.value.categories,
      axisLabel: {
        color: '#8cc8ff',
        fontSize: 11
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
    series: [
      {
        name: 'A类客户',
        type: 'bar',
        data: chartData.value.aClassData.map(value => ({
          value,
          itemStyle: {
            color: getBarColor(value, '#00d4ff') // 蓝色系
          }
        })),
        barWidth: '35%',
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 10,
          fontWeight: 'bold',
          formatter: '{c}%'
        }
      },
      {
        name: '常规客户',
        type: 'bar',
        data: chartData.value.normalData.map(value => ({
          value,
          itemStyle: {
            color: getBarColor(value, '#ffaa00') // 橙色系
          }
        })),
        barWidth: '35%',
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 10,
          fontWeight: 'bold',
          formatter: '{c}%'
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 根据数值获取柱状图颜色
const getBarColor = (value, baseColor = '#00d4ff') => {
  if (value >= 95) {
    return baseColor === '#ffaa00' ? '#00ff88' : '#00ff88'  // 优秀 - 绿色
  }
  if (value >= 85) {
    return baseColor === '#ffaa00' ? '#ffcc00' : '#00d4ff'  // 良好 - 根据基色调整
  }
  if (value >= 75) {
    return baseColor === '#ffaa00' ? '#ff8800' : '#ffaa00'  // 一般 - 根据基色调整
  }
  return '#ff4444'  // 较差 - 红色
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
    updateChartData()  // 先更新数据
    initChart()        // 再初始化图表
  })
})
</script>

<style scoped>
.chart-container {
  width: 100%;
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