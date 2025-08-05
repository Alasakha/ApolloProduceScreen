<template>
  <div class="h-full w-full P-4">
    <div class="chart-container h-full w-full border border-[#00eeff] rounded-lg bg-[rgba(0,19,47,0.95)]">
      <v-chart class="chart" :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'
import * as echarts from 'echarts/core'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent
])

const props = defineProps<{
  chartData: [string, string, number, number][]
}>()

const processedData = computed(() => {
  if (!props.chartData || props.chartData.length === 0) {
    return {
      categories: [],
      planData: [],
      actualData: []
    }
  }

  const filteredData = props.chartData.filter(item => item[0] !== 'total')
  
  return {
    categories: filteredData.map(item => item[1]), // 汽油车/摩托车
    planData: filteredData.map(item => item[2]),   // 计划数据
    actualData: filteredData.map(item => item[3])  // 实际数据
  }
})

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['计划销售数量', '实际销售数量'],
    textStyle: {
      color: '#fff'
    },
    top: 10
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: processedData.value.categories,
    axisLabel: {
      color: '#fff'
    }
  },
  yAxis: {
    type: 'value',
    name: '数量',
    axisLabel: {
      color: '#fff',
      formatter: (value: number) => value.toLocaleString('en-US')
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)'
      }
    },
    nameTextStyle: {
      color: '#fff'
    }
  },
  series: [
    {
      name: '计划销售数量',
      type: 'bar',
      data: processedData.value.planData,
      barWidth: '25%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0,238,255,0.8)' },
          { offset: 1, color: 'rgba(0,238,255,0.1)' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: (params: any) => params.value.toLocaleString('en-US'),
        color: '#fff'
      }
    },
    {
      name: '实际销售数量',
      type: 'bar',
      data: processedData.value.actualData,
      barWidth: '25%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0,255,157,0.8)' },
          { offset: 1, color: 'rgba(0,255,157,0.1)' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: (params: any) => params.value.toLocaleString('en-US'),
        color: '#fff'
      }
    }
  ]
}))
</script>

<style scoped>
.chart-container {
  box-shadow: 0 0 20px rgba(0,238,255,0.3);
}

.chart {
  width: 100%;
  height: 100%;
}
</style>