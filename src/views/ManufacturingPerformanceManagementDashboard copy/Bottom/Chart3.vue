<template>
  <div class="chart-container w-full h-full">
    <div class="chart-title">常规类客户直通率趋势</div>
    <div ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { useManufacturingStore } from '@/stores/manufacturing'

const chartRef = ref(null)
let chartInstance = null

const manufacturingStore = useManufacturingStore()

// 图表数据 - 使用store中的常规客户趋势数据（目标 vs 实际）
const chartData = computed(() => {
  const trendData = manufacturingStore.regularTrendData
  const categories = trendData.map(item => item.month)
  const target = trendData.map(item => item.target !== null && item.target !== undefined ? Number((item.target * 100).toFixed(1)) : null)
  const actual = trendData.map(item => item.actual !== null && item.actual !== undefined ? Number((item.actual * 100).toFixed(1)) : null)
  return { categories, target, actual }
})

// 加载状态
const loading = computed(() => manufacturingStore.trendLoading)
const error = ref(null)

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()

  // 监听窗口变化
  window.addEventListener('resize', resizeChart)
}

// 监听数据变化
watch(chartData, () => {
  updateChart()
}, { deep: true })

// 取代表性目标值用于 markLine
const chartTargetValue = computed(() => {
  const t = chartData.value.target.find(v => v !== null)
  return t !== undefined ? t : null
})

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
      textStyle: { color: '#fff' },
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        let name = params[0]?.name || ''
        let lines = params.map(p => {
          const val = p.value === 0 ? '--' : (p.value === null ? '--' : `${p.value}%`)
          return `${p.marker} ${p.seriesName}: ${val}`
        })
        return `${name}<br/>${lines.join('<br/>')}`
      }
    },
    legend: {
      data: ['实际'],
      right: '8%',
      textStyle: { color: '#8cc8ff' }
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
      min: function() {
        const all = [...chartData.value.target, ...chartData.value.actual].filter(v => v !== null)
        if (all.length === 0) return 0
        const dataMin = Math.min(...all)
        return Math.max(0, Math.floor(dataMin - 5))
      },
      max: function() {
        const all = [...chartData.value.target, ...chartData.value.actual].filter(v => v !== null)
        if (all.length === 0) return 100
        const dataMax = Math.max(...all)
        return Math.min(100, Math.ceil(dataMax + 5))
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
    series: [
      {
        name: '实际',
        type: 'bar',
        data: chartData.value.actual.map(v => v !== null ? v : 0),
        barWidth: '40%',
        itemStyle: { color: '#ffaa00' },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 11,
          formatter: (params) => params.value !== 0 ? `${params.value}%` : '--'
        },
        markLine: chartTargetValue.value !== null ? {
          silent: true,
          symbol: ['none','none'],
          data: [{ yAxis: chartTargetValue.value }],
          label: { formatter: `目标 ${chartTargetValue.value}%`, position: 'end', color: '#fff' },
          lineStyle: { type: 'dashed', color: '#ffea00', width: 2 }
        } : {}
      }
    ]
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