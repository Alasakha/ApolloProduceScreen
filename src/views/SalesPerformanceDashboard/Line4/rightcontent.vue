<template>
  <div class="h-full w-full p-1 3xl:p-1 4xl:p-2">
    <div class="chart-container w-full border border-[#00eeff] rounded-lg bg-[rgba(0,19,47,0.95)]" style="height: calc(100% - 1rem); max-height: 18vh;">
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
      color: '#fff',
      fontSize: 10
    },
    top: 5,
    itemWidth: 15,
    itemHeight: 10
  },
  grid: {
    left: '8%',
    right: '4%',
    top: '20%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: processedData.value.categories,
    axisLabel: {
      color: '#fff',
      fontSize: 10
    }
  },
  yAxis: {
    type: 'value',
    name: '数量',
    axisLabel: {
      color: '#fff',
      fontSize: 10,
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
      barWidth: '20%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00eeff' },
          { offset: 1, color: '#0088cc' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: (params: any) => params.value.toLocaleString('en-US'),
        color: '#fff',
        fontSize: 9
      }
    },
    {
      name: '实际销售数量',
      type: 'bar',
      data: processedData.value.actualData,
      barWidth: '25%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00ff9d' },
          { offset: 1, color: '#00cc7a' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: (params: any) => params.value.toLocaleString('en-US'),
        color: '#fff',
        fontSize: 9
      }
    }
  ]
}))
</script>

<style scoped>
.chart-container {
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  background: rgba(0,19,47,0.98);
}

.chart {
  width: 100%;
  height: 100%;
}
</style>