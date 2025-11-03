<template>
  <div class="fault-type-chart">
    <div class="panel-header">
      <h3 class="panel-title">设备故障类型统计:</h3>
      <div class="panel-description">柱状图</div>
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
  categories: ['机械故障', '电气故障', '液压故障', '软件故障', '其他'],
  series: [
    {
      name: '故障次数',
      type: 'bar',
      data: [35, 28, 22, 18, 15],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#00d4ff' },
            { offset: 1, color: '#0096c7' }
          ]
        }
      }
    }
  ]
})

const initChart = async () => {
  if (!chartRef.value) return
  
  try {
    const echarts = await import('echarts')
    chartInstance = echarts.init(chartRef.value)
    updateChart()
    
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
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.value.categories,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      axisLabel: {
        color: '#fff',
        fontSize: 11,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      axisLabel: {
        color: '#fff',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    series: chartData.value.series.map(series => ({
      ...series,
      barWidth: '50%',
      label: {
        show: true,
        position: 'top',
        color: '#fff',
        fontSize: 11
      }
    }))
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
.fault-type-chart {
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

