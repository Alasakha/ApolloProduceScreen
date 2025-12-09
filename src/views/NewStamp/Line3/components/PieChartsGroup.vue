<template>
  <div class="pie-charts-group">
    <div class="pie-chart-item">
      <div class="chart-title">月度问题责任人占比%</div>
      <div ref="chart1Ref" class="chart-container"></div>
    </div>
    <div class="pie-chart-item">
      <div class="chart-title">日问题责任人占比%</div>
      <div ref="chart2Ref" class="chart-container"></div>
    </div>
    <div class="pie-chart-item">
      <div class="chart-title">问题类型占比</div>
      <div ref="chart3Ref" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { eventBus } from '@/utils/eventbus'
import { GLOBAL_PIE_CHART_COLORS } from '@/utils/pieChartColors'
import { getCyQualityPiciPie, type CyQualityPiciPieItem } from '@/api/getStampWeldinfo'

const chart1Ref = ref<HTMLElement>()
const chart2Ref = ref<HTMLElement>()
const chart3Ref = ref<HTMLElement>()

let chart1Instance: ECharts | null = null
let chart2Instance: ECharts | null = null
let chart3Instance: ECharts | null = null

// 数据（接口驱动）
const monthlyData = ref<{ name: string; value: number }[]>([])
const dailyData = ref<{ name: string; value: number }[]>([])
// 问题类型占比暂无接口，暂时留空或后续接入
const typeData = ref<{ name: string; value: number }[]>([])

// 日期工具：格式化为 YYYY-MM-DD
const formatDate = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 月度：本月1号到今天
const getMonthRange = () => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  return {
    startTime: formatDate(firstDay),
    endTime: formatDate(today)
  }
}

// 日度：今天到今天
const getTodayRange = () => {
  const todayStr = formatDate(new Date())
  return {
    startTime: todayStr,
    endTime: todayStr
  }
}

const initChart = (chartRef: HTMLElement | undefined, data: any[], chartInstance: ECharts | null) => {
  if (!chartRef) return null

  // 如果当前容器宽高为 0，延迟一段时间再尝试初始化，避免 ECharts 报错
  const { clientWidth, clientHeight } = chartRef
  if (!clientWidth || !clientHeight) {
    setTimeout(() => {
      initChart(chartRef, data, chartInstance)
    }, 100)
    return chartInstance
  }

  if (chartInstance) {
    chartInstance.dispose()
  }

  const instance = echarts.init(chartRef)

  const option = {
    color: [...GLOBAL_PIE_CHART_COLORS],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(0, 150, 255, 0.5)',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: data,
        label: {
          show: true,
          position: 'outside',
          formatter: (params: any) => {
            return `${params.name}\n${params.value}%`
          },
          fontSize: 11,
          color: '#fff'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 5,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.5)'
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  instance.setOption(option)
  return instance
}

const initAllCharts = () => {
  chart1Instance = initChart(chart1Ref.value, monthlyData.value, chart1Instance)
  chart2Instance = initChart(chart2Ref.value, dailyData.value, chart2Instance)
  chart3Instance = initChart(chart3Ref.value, typeData.value, chart3Instance)
}

// 将接口返回的责任人数据转换为百分比
const transformToPercentData = (list: CyQualityPiciPieItem[]): { name: string; value: number }[] => {
  if (!Array.isArray(list) || list.length === 0) return []
  const total = list.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
  if (!total) return []

  return list.map(item => {
    const raw = Number(item.total) || 0
    const percent = Number(((raw / total) * 100).toFixed(2))
    return {
      name: item.dutyPeopleName || '未知',
      value: percent
    }
  })
}

const fetchData = async () => {
  try {
    // 月度：本月1号到今天
    const monthRange = getMonthRange()
    const monthRes = await getCyQualityPiciPie(monthRange.startTime, monthRange.endTime)
    if (monthRes && monthRes.code === 200 && Array.isArray(monthRes.data)) {
      monthlyData.value = transformToPercentData(monthRes.data)
    } else {
      monthlyData.value = []
    }

    // 日度：今天
    const dayRange = getTodayRange()
    const dayRes = await getCyQualityPiciPie(dayRange.startTime, dayRange.endTime)
    if (dayRes && dayRes.code === 200 && Array.isArray(dayRes.data)) {
      dailyData.value = transformToPercentData(dayRes.data)
    } else {
      dailyData.value = []
    }

    await nextTick()
    initAllCharts()
  } catch (error) {
    console.error('获取饼图数据失败:', error)
  }
}

const handleResize = () => {
  chart1Instance?.resize()
  chart2Instance?.resize()
  chart3Instance?.resize()
}

onMounted(() => {
  // 等布局和数据就绪后，在 fetchData 中统一初始化图表
  fetchData()
  eventBus.on('refreshData', fetchData)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData)
  window.removeEventListener('resize', handleResize)
  if (chart1Instance) chart1Instance.dispose()
  if (chart2Instance) chart2Instance.dispose()
  if (chart3Instance) chart3Instance.dispose()
})
</script>

<style scoped>
.pie-charts-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  height:100%;
}

.pie-chart-item {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.chart-title {
  color: #8cc8ff;
  font-size: 11px;
  text-align: center;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
}

.chart-container {
  width: 100%;
  /* 提高单个饼图区域的高度，方便 ECharts 正常渲染 */
  height: 180px;
  flex: 1;
}
</style>

