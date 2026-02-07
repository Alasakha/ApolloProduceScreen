<template>
  <div class="h-full flex flex-col">
    <!-- Title -->
    <div class="flex-none px-4 py-3 border-b border-white/10">
      <h3 class="text-sm font-medium text-gray-300 uppercase tracking-wider">
        {{ title }}
      </h3>
    </div>

    <!-- Chart Container -->
    <div class="flex-1 relative" ref="chartContainer">
      <!-- Empty State -->
      <div
        v-if="!hasData"
        class="absolute inset-0 flex items-center justify-center"
      >
        <span class="text-gray-500 text-sm">暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  type TooltipComponentOption,
  type GridComponentOption,
  type LegendComponentOption
} from 'echarts/components'
import { BarChart, LineChart, type BarSeriesOption, type LineSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { ComposeOption, ECharts } from 'echarts/core'

// Register ECharts components
echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer
])

interface TrendData {
  months: string[]
  sales: number[]
  margin: number[]
}

interface Props {
  data: TrendData
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '销售额与利润率趋势'
})

const chartContainer = ref<HTMLElement>()
let chartInstance: ECharts | null = null

const hasData = computed(() => {
  return props.data &&
    props.data.months.length > 0 &&
    props.data.sales.length > 0 &&
    props.data.margin.length > 0
})

const initChart = () => {
  if (!chartContainer.value || !hasData.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartContainer.value)
  updateChart()

  window.addEventListener('resize', handleResize)
}

const updateChart = () => {
  if (!chartInstance || !hasData.value) return

  const option: ComposeOption<
    TooltipComponentOption |
    GridComponentOption |
    LegendComponentOption |
    BarSeriesOption |
    LineSeriesOption
  > = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    },
    legend: {
      data: ['销售额', '利润率'],
      right: 10,
      top: 10,
      textStyle: {
        color: '#9ca3af',
        fontSize: 11
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.data.months,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 10
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额',
        nameTextStyle: {
          color: '#9ca3af',
          fontSize: 10
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 10,
          formatter: (value: number) => value >= 1000 ? (value / 1000) + 'K' : value.toString()
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        }
      },
      {
        type: 'value',
        name: '利润率',
        min: 10,
        max: 25,
        nameTextStyle: {
          color: '#9ca3af',
          fontSize: 10
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 10,
          formatter: '{value}%'
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'bar',
        data: props.data.sales,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#06b6d4' },
            { offset: 1, color: 'rgba(6, 182, 212, 0.3)' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '40%',
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#22d3ee' },
              { offset: 1, color: 'rgba(34, 211, 238, 0.5)' }
            ])
          }
        }
      },
      {
        name: '利润率',
        type: 'line',
        yAxisIndex: 1,
        data: props.data.margin,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#f97316',
          width: 3
        },
        itemStyle: {
          color: '#f97316',
          borderColor: '#fff',
          borderWidth: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(249, 115, 22, 0.3)' },
            { offset: 1, color: 'rgba(249, 115, 22, 0)' }
          ])
        }
      }
    ]
  }

  chartInstance.setOption(option, true)
}

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

watch(() => props.data, () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

defineExpose({
  resize: handleResize
})
</script>
