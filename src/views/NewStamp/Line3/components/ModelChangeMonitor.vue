<template>
  <div class="model-change-monitor">
    <div class="section-title">换型监控</div>
    <div ref="chartRef" class="chart-container"></div>
    <div class="section-footer">
      <button class="detail-btn" @click="handleDetailClick">点击看明细</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { eventBus } from '@/utils/eventbus'

const chartRef = ref<HTMLElement>()
let chartInstance: ECharts | null = null

// Mock数据
const chartData = ref([
  { date: '11月19日', value: 4 },
  { date: '11月20日', value: 5 },
  { date: '11月21日', value: 3 },
  { date: '11月22日', value: 0 },
  { date: '11月23日', value: 0 },
  { date: '11月24日', value: 0 }
])

const initChart = () => {
  if (!chartRef.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)

  const option = {
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.value.map(item => item.date),
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
      name: '次数',
      nameTextStyle: {
        color: '#8cc8ff',
        fontSize: 11
      },
      axisLabel: {
        color: '#8cc8ff',
        fontSize: 11
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
        type: 'bar',
        data: chartData.value.map(item => ({
          value: item.value,
          itemStyle: {
            color: item.value > 0
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#00d4ff' },
                  { offset: 1, color: '#0096ff' }
                ])
              : 'rgba(140, 200, 255, 0.1)'
          }
        })),
        barWidth: '40%',
        label: {
          show: true,
          position: 'top',
          color: '#00d4ff',
          fontSize: 11,
          formatter: (params: any) => {
            return params.value > 0 ? params.value : ''
          }
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(0, 150, 255, 0.5)',
      textStyle: {
        color: '#fff'
      },
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}<br/>换型次数: ${param.value}次`
      }
    }
  }

  chartInstance.setOption(option)
}

const fetchData = async () => {
  try {
    // TODO: 连接真实 API
    // const res = await getModelChangeData()
    // if (res.code === 200) {
    //   chartData.value = res.data
    //   nextTick(() => {
    //     initChart()
    //   })
    // }
  } catch (error) {
    console.error('获取换型监控数据失败:', error)
  }
}

const handleResize = () => {
  chartInstance?.resize()
}

const handleDetailClick = () => {
  // TODO: 打开详情弹窗
  console.log('查看换型明细')
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
  fetchData()
  eventBus.on('refreshData', fetchData)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData)
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
  }
})
</script>

<style scoped>
.model-change-monitor {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 10px;
}

.section-title {
  color: #00d4ff;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.chart-container {
  width: 100%;
  height: 150px;
}

.section-footer {
  display: flex;
  justify-content: center;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid rgba(0, 150, 255, 0.2);
}

.detail-btn {
  background: rgba(0, 150, 255, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.5);
  color: #00d4ff;
  padding: 4px 12px;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.detail-btn:hover {
  background: rgba(0, 150, 255, 0.3);
  border-color: rgba(0, 150, 255, 0.8);
  color: #fff;
  transform: translateY(-1px);
}
</style>

