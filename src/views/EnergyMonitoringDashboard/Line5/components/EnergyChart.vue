<template>
  <div class="chart-section">
    <div class="chart-header">
      <h2 class="chart-title text-xl">{{ title }}</h2>
    </div>
    <div class="chart-content">
      <div ref="chartRef" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { createChart, destroyChart } from '@/utils/charts'
import type { ECharts } from 'echarts'

interface Props {
  title: string
  data: {
    standard?: number[]
    actual?: number[]
    weeklyIncrement?: number[]
  }
  monthLabels?: string[]
  weekLabels?: string[]
  color: string
  unit: string
  chartType: 'monthly' | 'weekly'
}

const props = defineProps<Props>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ECharts | null = null

// 图表配置
const chartOption = computed(() => {
  const isMonthly = props.chartType === 'monthly'
  const labels = isMonthly ? props.monthLabels : props.weekLabels
  
  return {
    backgroundColor: 'transparent',
    // title: {
    //   text: props.title,
    //   left: 'center',
    //   top: 10,
    //   textStyle: {
    //     color: '#ffffff',
    //     fontSize: 16,
    //     fontWeight: 'bold' as const
    //   }
    // },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'shadow' as const,
        shadowStyle: {
          color: 'rgba(0, 212, 255, 0.1)'
        }
      },
      backgroundColor: 'rgba(0, 20, 40, 0.95)',
      borderColor: '#00d4ff',
      borderWidth: 1,
      borderRadius: 8,
      textStyle: {
        color: '#ffffff',
        fontSize: 12
      },
      formatter: (params: any) => {
        if (isMonthly) {
          let result = `${params[0].name}<br/>`
          params.forEach((param: any) => {
            result += `${param.seriesName}: ${param.value} ${props.unit}<br/>`
          })
          return result
        } else {
          const data = params[0]
          return `${data.name}<br/>${data.seriesName}: ${data.value} ${props.unit}`
        }
      }
    },
    legend: {
      data: isMonthly ? ['标准用量', '实际用量'] : ['周增量'],
      top: 0,
      textStyle: {
        color: '#ffffff',
        fontSize: 12
      },
      itemGap: 20
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '20%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: labels,
      axisLine: {
        lineStyle: {
          color: '#00d4ff',
          width: 2
        }
      },
      axisLabel: {
        color: '#ffffff',
        fontSize: 11,
        margin: 8
      },
      axisTick: {
        lineStyle: {
          color: '#00d4ff'
        }
      }
    },
    yAxis: {
      type: 'value' as const,
      name: `用量(${props.unit})`,
      nameTextStyle: {
        color: '#00d4ff',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#00d4ff',
          width: 2
        }
      },
      axisLabel: {
        color: '#ffffff',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 212, 255, 0.15)',
          type: 'dashed' as const
        }
      },
      axisTick: {
        lineStyle: {
          color: '#00d4ff'
        }
      }
    },
    series: isMonthly ? [
      {
        name: '标准用量',
        type: 'bar' as const,
        data: props.data.standard,
        barWidth: '25%',
        label: {
          show: true,
          position: 'top' as const,
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 'bold' as const,
          formatter: (params: any) => {
            return `${params.value} ${props.unit}`
          }
        },
        itemStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#00d4ff' },
              { offset: 1, color: '#0099cc' }
            ]
          },
          borderRadius: [4, 4, 0, 0],
          shadowColor: 'rgba(0, 212, 255, 0.3)',
          shadowBlur: 8
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(0, 212, 255, 0.5)'
          }
        }
      },
      {
        name: '实际用量',
        type: 'bar' as const,
        data: props.data.actual,
        barWidth: '25%',
        label: {
          show: true,
          position: 'top' as const,
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 'bold' as const,
          formatter: (params: any) => {
            return `${params.value} ${props.unit}`
          }
        },
        itemStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#ff6b6b' },
              { offset: 1, color: '#e55353' }
            ]
          },
          borderRadius: [4, 4, 0, 0],
          shadowColor: 'rgba(255, 107, 107, 0.3)',
          shadowBlur: 8
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(255, 107, 107, 0.5)'
          }
        }
      }
    ] : [
      {
        name: '周增量',
        type: 'bar' as const,
        data: props.data.weeklyIncrement,
        barWidth: '50%',
        label: {
          show: true,
          position: 'top' as const,
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 'bold' as const,
          formatter: (params: any) => {
            return `${params.value} ${props.unit}`
          }
        },
        itemStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: props.color },
              { offset: 1, color: props.color + '80' } // 添加透明度
            ]
          },
          borderRadius: [4, 4, 0, 0],
          shadowColor: props.color + '30',
          shadowBlur: 8
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: props.color + '50'
          }
        }
      }
    ]
  }
})

// 初始化图表
const initChart = async () => {
  if (!chartRef.value) return
  
  await nextTick()
  
  try {
    chartInstance = createChart(chartRef.value, chartOption.value)
  } catch (error) {
    console.error(`初始化${props.title}图表失败:`, error)
  }
}

// 更新图表
const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(chartOption.value, true)
  }
}

// 监听数据变化
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chartInstance) {
    destroyChart(chartInstance)
    chartInstance = null
  }
})
</script>

<style scoped>
.chart-section {
  flex: 1;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 20, 40, 0.6) 100%);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 15px;
  margin: 0 10px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 8px 32px rgba(0, 212, 255, 0.15),
    inset 0 1px 0 rgba(0, 212, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chart-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: linear-gradient(45deg, transparent 30%, rgba(59, 166, 187, 0.03) 50%, transparent 70%); */
  pointer-events: none;
}

.chart-section:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 212, 255, 0.25),
    inset 0 1px 0 rgba(0, 212, 255, 0.3);
  border-color: rgba(0, 212, 255, 0.5);
}

.chart-header {
  text-align: center;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.chart-title {
  font-weight: 600;
  color: #00d4ff;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  letter-spacing: 1px;
}

.chart-content {
  height: 20vh;
  min-height: 180px;
  position: relative;
  z-index: 1;
}

.chart-container {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>