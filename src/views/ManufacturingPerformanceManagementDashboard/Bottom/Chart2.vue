<template>
  <div class="chart-container w-full h-full">
    <div class="chart-title">A类客户直通率趋势</div>
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
    
    const response = await getFtyChart(1) // A类客户 = 1
    
    if (response.code === 200 && response.data) {
      console.log('A类客户原始数据:', response.data)
      
      // 过滤出A类客户数据
      const aClassData = response.data.filter(item => item.customer === 'A')
      console.log('过滤后的A类客户数据:', aClassData)
      
      // 按周数从小到大排序
      const sortedData = aClassData.sort((a, b) => a.week_num - b.week_num)
      console.log('排序后的A类客户数据:', sortedData)
      
      // 直接使用接口返回的fty字段作为直通率
      const ftyRates = sortedData.map(item => {
        return parseFloat(item.fty.toFixed(1))
      })
      
      // 设置图表数据（按周数顺序）
      chartData.value.data = ftyRates
      chartData.value.categories = sortedData.map(item => item.week_num + '周')
      
      console.log('图表数据:', chartData.value)

      updateChart()
    } else {
      throw new Error(response.message || '获取数据失败')
    }
  } catch (err) {
    console.error('获取A类客户直通率数据失败:', err)
    error.value = err.message
    // 使用模拟数据作为备用
    chartData.value.data = [68.3, 70.8, 69.3, 73.5]
    chartData.value.categories = ['前3周', '前2周', '前1周', '本周']
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
      min: function(value) {
        // 动态设置最小值，确保数据可见
        const dataMin = Math.min(...chartData.value.data)
        return Math.max(0, Math.floor(dataMin - 5)) // 最小值比数据最小值小5%
      },
      max: function(value) {
        // 动态设置最大值
        const dataMax = Math.max(...chartData.value.data)
        return Math.min(100, Math.ceil(dataMax + 5)) // 最大值比数据最大值大5%
      },
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
          color: '#00d4ff' // 固定蓝色，暂时不需要变色
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