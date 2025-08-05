<template>
  <div class="h-full w-full p-2 3xl:p-1 4xl:p-2">
    <!-- 修改容器样式 -->
    <div class="chart-container w-full" style="height: 100%;">
      <v-chart class="chart" :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import VChart from 'vue-echarts'
import {  computed, watch } from 'vue'
import * as echarts from 'echarts/core'  // 添加这行

// 使用渐变色时需要的组件
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'

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

// 从父组件接收数据
const props = defineProps<{
  tableData: any[]
}>()

// 处理图表数据
const chartData = computed(() => {


  // 确保有数据
  if (!props.tableData || props.tableData.length === 0) {
    return {
      categories: [],
      ysAmtYear: [],
      ysAmtAgain: [],
      xdTotal: []
    }
  }

  // 过滤掉合计和阶段性汇总
  const filteredData = props.tableData.filter(item => 
    item.empCategory !== '合计' && item.empCategory !== '阶段性汇总'
  )

  // 处理数据，确保转换为数字
  return {
    categories: filteredData.map(item => item.empCategory),
    ysAmtYear: filteredData.map(item => parseFloat(item.ysAmtYear) || 0),
    ysAmtAgain: filteredData.map(item => parseFloat(item.ysAmtAgain) || 0),
    xdTotal: filteredData.map(item => parseFloat(item.xdTotal) || 0)
  }
})

// 图表配置
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
        result += `${param.seriesName}：${param.value.toFixed(2)}$<br/>`;
      });
      return result;
    }
  },
  legend: {
    data: ['年度预算金额', '再次预算金额', '已下单金额'],
    textStyle: {
      color: '#fff'
    },
    top: 10
  },
  grid: {
    left: '10%',      // 增加左边距
    right: '5%',      // 增加右边距
    top: '15%',       // 增加顶部边距
    bottom: '10%',    // 增加底部边距
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
        formatter: '{c}$',
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
        formatter: '{c}$',
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
        formatter: '{c}',
        color: '#fff'
      }
    }
  ]
}))

// 监听数据变化更新图表
watch(() => props.tableData, (newVal) => {
  console.log('数据更新:', newVal)
}, { deep: true })
</script>

<style scoped>
.chart-container {
  box-shadow: 0 0 20px rgba(0,238,255,0.3);
  background: rgba(0,19,47,0.95);
  border: 1px solid #00eeff;
  border-radius: 8px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>