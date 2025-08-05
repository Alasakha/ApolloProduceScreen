<template>
  <div class="h-full w-full p-4">
    <div class="chart-container h-full w-full border border-[#00eeff] rounded-lg bg-[rgba(0,19,47,0.95)]">
      <v-chart class="chart" :option="chartOption"  autoresize />
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
import {  computed } from 'vue'
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
  tableData: any[]
}>()

const chartData = computed(() => {
  if (!props.tableData || props.tableData.length === 0) {
    return {
      categories: [],
      ysAmtYear: [],
      ysAmtAgain: [],
      xdTotal: []
    }
  }

  const filteredData = props.tableData.filter(item => 
    item.empCategory !== '合计' && item.empCategory !== '阶段性汇总'
  )

  return {
    categories: filteredData.map(item => item.empCategory),
    ysAmtYear: filteredData.map(item => parseFloat(item.ysAmtYear) || 0),
    ysAmtAgain: filteredData.map(item => parseFloat(item.ysAmtAgain) || 0),
    xdTotal: filteredData.map(item => parseFloat(item.xdTotal) || 0)
  }
})

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    },
    formatter: (params: any[]) => {
      let result = `${params[0].name}<br/>`;
      params.forEach(param => {
        result += `${param.seriesName}：${param.value.toFixed(2)}万<br/>`;
      });
      return result;
    }
  },
  legend: {
    data: ['年度预算金额', '再次预算金额', '已下单金额'],
    textStyle: {
      color: '#fff'
    },
    formatter: (name: string) => {
      const unitMap: Record<string, string> = {
        '年度预算金额': '万元',
        '再次预算金额': '万元',
        '已下单金额': '万元'
      };
      return `${name}（${unitMap[name] || '万'}）`;
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
    data: chartData.value.categories,
    axisLabel: {
      color: '#fff'
    }
  },
  yAxis: {
    type: 'value',
    name: '金额（万元）',
    nameTextStyle: {
      color: '#fff'
    },
    axisLabel: {
      color: '#fff',
      formatter: (value: number) => `${value.toFixed(2)}万`
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)'
      }
    }
  },
  series: [
    {
      name: '年度预算金额',
      type: 'line',
      data: chartData.value.ysAmtYear,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 2,
        color: '#00eeff'
      },
      itemStyle: {
        color: '#00eeff'
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}万',
        color: '#fff'
      }
    },
    {
      name: '再次预算金额',
      type: 'line',
      data: chartData.value.ysAmtAgain,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 2,
        color: '#00ff9d'
      },
      itemStyle: {
        color: '#00ff9d'
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}万',
        color: '#fff'
      }
    },
    {
      name: '已下单金额',
      type: 'bar',
      data: chartData.value.xdTotal,
      barWidth: '20%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0,238,255,0.8)' },
          { offset: 1, color: 'rgba(0,238,255,0.1)' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}万',
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
</style>
