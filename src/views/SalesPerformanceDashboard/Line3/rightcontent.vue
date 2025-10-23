<template>
    <div class="h-full w-full p-1 3xl:p-1 4xl:p-2">
      <div class="chart-container w-full border border-[#00eeff] rounded-lg bg-[rgba(0,19,47,0.95)]" style="height: calc(100% - 1rem); max-height: 20vh;">
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
        ysQuantityYear: [],
        ysQuantityAgain: [],
        xdTotal: []
      }
    }
  
    const filteredData = props.tableData.filter(item => 
      item.empCategory !== '合计' && item.empCategory !== '阶段性汇总'
    )
  
    return {
      categories: filteredData.map(item => item.empCategory),
      ysQuantityYear: filteredData.map(item => parseFloat(item.ysQuantityYear) || 0),
      ysQuantityAgain: filteredData.map(item => parseFloat(item.ysQuantityAgain) || 0),
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
        const unit = param.seriesName === '已下单金额' ? '$' : '';
        result += `${param.seriesName}：${param.value.toFixed(2)}${unit}<br/>`;
      });
      return result;
    }
    },
    legend: {
      data: ['年度预算数量', '再次预算数量', '已下单金额'],
      textStyle: {
        color: '#fff',
        fontSize: 10
      },
      top: 5,
      itemWidth: 15,
      itemHeight: 10,
      formatter: (name: string) => {
        return name + '$'
      }
    },
    grid: {
      left: '8%',
      right: '8%',
      top: '20%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.value.categories,
      axisLabel: {
        color: '#fff',
        fontSize: 10
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '金额',
        position: 'left',
        axisLabel: {
          color: '#fff',
          fontSize: 10,
          formatter: (value: number) => `${value.toFixed(0)}$`
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
      {
        type: 'value',
        name: '数量',
        position: 'right',
        axisLabel: {
          color: '#fff',
          fontSize: 10,
          formatter: (value: number) => `${value.toFixed(0)}个`
        },
        splitLine: {
          show: false
        },
        nameTextStyle: {
          color: '#fff'
        }
      }
    ],
    series: [
      {
        name: '年度预算数量',
        type: 'line',
        yAxisIndex: 1,
        data: chartData.value.ysQuantityYear,
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
        formatter: '{c}',
        color: '#fff'
      }
      },
      {
        name: '再次预算数量',
        type: 'line',
        yAxisIndex: 1,
        data: chartData.value.ysQuantityAgain,
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
        formatter: '{c}',
        color: '#fff'
      }
      },
      {
        name: '已下单金额',
        type: 'bar',
        yAxisIndex: 0,
        data: chartData.value.xdTotal,
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
        formatter: '{c}$',
        color: '#fff'
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
  </style>
  