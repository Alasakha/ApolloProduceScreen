<template>
  <div class="h-full w-full p-1 3xl:p-1 4xl:p-2">
    <!-- 修改容器样式 -->
    <div class="chart-container w-full" style="height: calc(100% - 1rem); max-height: 20vh;">
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
      color: '#fff',
      fontSize: 10  // 减小图例字体
    },
    top: 5,  // 减小顶部距离
    itemWidth: 15,  // 减小图例项宽度
    itemHeight: 10  // 减小图例项高度
  },
  grid: {
    left: '8%',       // 减小左边距
    right: '4%',      // 减小右边距
    top: '20%',       // 为图例留出空间
    bottom: '15%',    // 为X轴标签留出空间
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: chartData.value.categories,
    axisLabel: {
      color: '#fff',
      fontSize: 10  // 减小X轴标签字体
    }
  },
  yAxis: {
    type: 'value',
    max: function(value) {
      return Math.ceil(value.max * 1.2);  // 限制Y轴最大值，压缩图表高度
    },
    axisLabel: {
      color: '#fff',
      fontSize: 10,  // 减小Y轴标签字体
      formatter: (value: number) => `${value.toFixed(0)}万`
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
      symbolSize: 6,  // 减小点的大小
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
        color: '#fff',
        fontSize: 9  // 减小标签字体
      }
    },
    {
      name: '再次预算金额',
      type: 'line',
      data: chartData.value.ysAmtAgain,
      symbol: 'circle',
      symbolSize: 6,  // 减小点的大小
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
        color: '#fff',
        fontSize: 9  // 减小标签字体
      }
    },
    {
      name: '已下单金额',
      type: 'bar',
      data: chartData.value.xdTotal,
      barWidth: '10%',  // 进一步减小柱状图宽度
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00eeff' },
          { offset: 1, color: '#0088cc' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}',
        color: '#fff',
        fontSize: 9  // 减小标签字体
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  background: rgba(0,19,47,0.98);
  border: 1px solid #00eeff;
  border-radius: 8px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>