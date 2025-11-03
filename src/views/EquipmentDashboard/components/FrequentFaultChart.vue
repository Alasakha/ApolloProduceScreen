<template>
  <div class="frequent-fault-chart">
    <div class="panel-header">
      <h3 class="panel-title">易发故障设备统计:</h3>
      <div class="panel-description">推移图</div>
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
  categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
  series: [
    {
      name: '设备A-001',
      type: 'line',
      data: [12, 15, 18, 14, 16, 19],
      itemStyle: { color: '#00d4ff' },
      lineStyle: { width: 2 }
    },
    {
      name: '设备B-002',
      type: 'line',
      data: [8, 10, 12, 9, 11, 13],
      itemStyle: { color: '#10b981' },
      lineStyle: { width: 2 }
    },
    {
      name: '设备C-003',
      type: 'line',
      data: [6, 8, 10, 7, 9, 11],
      itemStyle: { color: '#f59e0b' },
      lineStyle: { width: 2 }
    },
    {
      name: '设备D-004',
      type: 'line',
      data: [4, 6, 8, 5, 7, 9],
      itemStyle: { color: '#ef4444' },
      lineStyle: { width: 2 }
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
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      data: chartData.value.series.map(s => s.name),
      textStyle: {
        color: '#fff',
        fontSize: 11
      },
      top: '5%'
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.categories,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      axisLabel: {
        color: '#fff',
        fontSize: 11
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
      symbol: 'circle',
      symbolSize: 6,
      smooth: true,
      areaStyle: {
        opacity: 0.3,
        color: series.itemStyle.color
      },
      label: {
        show: false
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
.frequent-fault-chart {
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


