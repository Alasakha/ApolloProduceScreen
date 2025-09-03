<template>
  <div class="chart-container">
    <div class="chart-title">直通率周度对比</div>
    <div ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getOnTimeChart } from '@/api/produceperformance'

const chartRef = ref(null)
let chartInstance = null

// 周直通率数据
const weeklyPassRateData = ref([])

const fetchData = async () => {
  const res = await getOnTimeChart()
  weeklyPassRateData.value = res.data
  console.log(weeklyPassRateData.value)
  
  // 数据获取完成后，更新图表数据并重新渲染图表
  updateChartData()
  if (chartInstance) {
    updateChart()
  }
}
// 计算直通率
const calculatePassRate = (completeNum, total) => {
  if (total === 0) return 0
  return parseFloat((completeNum / total * 100).toFixed(1))
}

// 获取周标签
const getWeekLabel = (index) => {
  if (index === 0) return '前3周'
  if (index === 1) return '前2周'
  if (index === 2) return '前1周'
  return '本周'
}

// 处理图表数据
const chartData = ref({
  categories: [],
  aClassData: [],
  normalData: []
})

// 更新图表数据
const updateChartData = () => {
  // 反转数据顺序，让数据从上3周开始
  const reversedData = [...weeklyPassRateData.value].reverse()
  
  chartData.value.categories = reversedData.map((_, index) => getWeekLabel(index))
  chartData.value.aClassData = reversedData.map(week => calculatePassRate(week.a.completeNum, week.a.total))
  chartData.value.normalData = reversedData.map(week => calculatePassRate(week.normal.completeNum, week.normal.total))
  
  console.log('图表数据已更新:', chartData.value)
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  // 不在这里调用 updateChart()，因为数据还没有获取
  // 数据获取完成后会自动调用 updateChart()
  
  // 监听窗口变化
  window.addEventListener('resize', resizeChart)
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return
  
  console.log('开始更新图表，数据:', chartData.value)

  const option = {
    grid: {
      left: '10%',
      right: '8%',
      top: '25%',
      bottom: '0%',
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
        // 在顶层设置颜色，图例会使用这个颜色
        itemStyle: {
          color: '#00d4ff' // 蓝色
        },
        data: chartData.value.aClassData.map(value => ({
          value
          // 删除这里的 itemStyle，因为已经在顶层设置了
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
        // 在顶层设置颜色，图例会使用这个颜色
        itemStyle: {
          color: '#ffaa00' // 橙色
        },
        data: chartData.value.normalData.map(value => ({
          value
          // 删除这里的 itemStyle，因为已经在顶层设置了
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
    initChart()        // 先初始化图表
    fetchData()        // 再获取数据，数据获取完成后会自动更新图表
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
  padding: 5px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
}

.chart-content {
  flex: 1;
  min-height: 0;
}
</style>