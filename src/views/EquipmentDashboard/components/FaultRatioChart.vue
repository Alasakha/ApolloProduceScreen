<template>
  <div class="fault-ratio-chart">
    <div class="panel-header">
      <h3 class="panel-title">设备故障占比:</h3>
      <div class="panel-description">饼状图</div>
    </div>
    <div class="chart-container">
      <div ref="chartRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const chartRef = ref<HTMLElement>()
let chartInstance: any = null

// 默认数据
const chartData = ref({
  series: [
    { name: '机械故障', value: 35, itemStyle: { color: '#ef4444' } },
    { name: '电气故障', value: 28, itemStyle: { color: '#f59e0b' } },
    { name: '液压故障', value: 22, itemStyle: { color: '#3b82f6' } },
    { name: '其他故障', value: 15, itemStyle: { color: '#10b981' } }
  ]
})

const initChart = async () => {
  if (!chartRef.value) return
  
  try {
    const echarts = await import('echarts')
    chartInstance = echarts.init(chartRef.value)
    updateChart()
    
    // 监听窗口大小变化
    window.addEventListener('resize', resizeChart)
  } catch (error) {
    console.error('Chart initialization failed:', error)
  }
}

const updateChart = () => {
  if (!chartInstance) return
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    },
    series: [
      {
        name: '设备故障占比',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 2
        },
        label: {
          show: true,
          color: '#fff',
          fontSize: 11,
          formatter: '{b}\n{d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: chartData.value.series
      }
    ]
  }
  
  chartInstance.setOption(option, true)
}

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  nextTick(() => {
    initChart()
    // TODO: 调用API获取真实数据
  })
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', resizeChart)
})

watch(() => chartData.value, updateChart, { deep: true })
</script>

<style scoped>
.fault-ratio-chart {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 4px;
  border: 1px solid rgba(0, 150, 255, 0.2);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 2px;
}

.panel-title {
  font-size: 13px;
  color: #00d4ff;
  margin: 0;
  font-weight: bold;
  text-align: center;
}

.panel-description {
  font-size: 10px;
  color: #8cc8ff;
  text-align: center;
  margin-top: 2px;
}

.chart-container {
  flex: 1;
  min-height: 0;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 0;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .panel-title {
    font-size: 16px;
  }

  .panel-description {
    font-size: 12px;
  }
}
</style>

