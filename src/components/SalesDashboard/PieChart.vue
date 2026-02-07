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

    <!-- Legend -->
    <div class="flex-none px-4 py-2 border-t border-white/10">
      <div class="flex flex-wrap gap-3 justify-center">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="flex items-center space-x-2"
        >
          <div
            class="w-3 h-3 rounded-sm"
            :style="{ backgroundColor: item.color || colors[index % colors.length] }"
          ></div>
          <span class="text-xs text-gray-400">{{ item.name }}</span>
          <span class="text-xs text-white font-medium">{{ item.value }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import {
  TooltipComponent,
  LegendComponent,
  type TooltipComponentOption,
  type LegendComponentOption
} from 'echarts/components'
import { PieChart, type PieSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { ComposeOption, ECharts } from 'echarts/core'

// Register ECharts components
echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer
])

interface PieChartItem {
  name: string
  value: number
  color?: string
}

interface Props {
  data: PieChartItem[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '利润贡献分析'
})

const chartContainer = ref<HTMLElement>()
let chartInstance: ECharts | null = null

const colors = [
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#8b5cf6', // purple-500
  '#22c55e', // green-500
  '#6b7280', // gray-500
  '#ec4899', // pink-500
  '#eab308', // yellow-500
  '#3b82f6'  // blue-500
]

const hasData = computed(() => {
  return props.data && props.data.length > 0 && props.data.some(item => item.value > 0)
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

  const option: ComposeOption<TooltipComponentOption | LegendComponentOption | PieSeriesOption> = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}: ${params.value}%`
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    },
    legend: {
      show: false
    },
    series: [
      {
        name: props.title,
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff'
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: props.data.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.color || colors[index % colors.length]
          }
        }))
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
