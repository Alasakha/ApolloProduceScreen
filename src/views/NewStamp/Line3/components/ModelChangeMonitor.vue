<template>
  <div class="model-change-monitor">
    <div class="section-title">换型监控</div>
    <div ref="chartRef" class="chart-container"></div>
    <!-- <div class="section-footer">
      <button class="detail-btn" @click="handleDetailClick">点击看明细</button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { eventBus } from '@/utils/eventbus'
import { getAdjust } from '@/api/getStampWeldinfo'

const chartRef = ref<HTMLElement>()
let chartInstance: ECharts | null = null

interface ChartItem {
  date: string
  value: number
}

const chartData = ref<ChartItem[]>([])

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    const month = Number(parts[1]) || 0
    const day = Number(parts[2]) || 0
    return `${month}月${day}日`
  }
  return dateStr
}

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
      bottom: '0%',
      top: '20%',
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
    const res = await getAdjust()
    if (res.code === 200 && Array.isArray(res.data)) {
      chartData.value = res.data.map(item => ({
        date: formatDate(item.monthday),
        value: item.total ?? 0
      }))
      nextTick(() => {
        initChart()
      })
    }
  } catch (error) {
    console.error('获取换型监控数据失败:', error)
  }
}

const handleResize = () => {
  chartInstance?.resize()
}

// const handleDetailClick = () => {
//   // TODO: 打开详情弹窗
//   console.log('查看换型明细')
// }

onMounted(() => {
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

