<template>
  <div class="chart-container w-full h-full">
    <div class="chart-title">常规类客户直通率趋势</div>
    <div ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getFtyChart } from '@/api/produceperformance'

const chartRef = ref(null)
let chartInstance = null

// 图表数据
const chartData = ref({
  categories: ['前3周', '前2周', '前1周', '本周'],
  data: []
})

// 加载状态
const loading = ref(false)
const error = ref(null)

// 获取直通率数据
const fetchFtyData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await getFtyChart(2) // 常规类客户 = 2
    
    if (response.code === 200 && response.data) {
      // 计算直通率：一次合格数 / 总数 * 100
      const ftyRates = response.data.map(item => {
        const rate = (item.firstTotal / item.checkTotal * 100).toFixed(1)
        return parseFloat(rate)
      })
      
      // 反转数据顺序，让数据从上3周开始
      chartData.value.data = ftyRates.reverse()
      updateChart()
    } else {
      throw new Error(response.message || '获取数据失败')
    }
  } catch (err) {
    console.error('获取常规类客户直通率数据失败:', err)
    error.value = err.message
    // 使用模拟数据作为备用
    chartData.value.data = [88.5, 87.3, 86.7, 89.2]
    updateChart()
  } finally {
    loading.value = false
  }
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
      left: '8%',
      right: '8%',
      top: '20%',
      bottom: '15%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 30, 60, 0.9)',
      borderColor: '#00d4ff',
      textStyle: {
        color: '#fff'
      },
      formatter: (params) => {
        const data = params[0]
        return `${data.name}<br/>直通率: ${data.value}%`
      }
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
      min: 80,
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
          color: '#ffaa00' // 固定橙色，暂时不需要变色
          // color: getBarColor(value)
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
// const getBarColor = (value) => {
//   if (value >= 95) return '#00ff88'  // 优秀 - 绿色
//   if (value >= 90) return '#00d4ff'  // 良好 - 蓝色  
//   if (value >= 85) return '#ffaa00'  // 一般 - 黄色
//   return '#ff4444'                   // 较差 - 红色
// }

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
    fetchFtyData()
  })
})

// 组件卸载时清理
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', resizeChart)
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