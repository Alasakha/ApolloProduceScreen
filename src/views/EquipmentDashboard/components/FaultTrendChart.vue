<template>
  <div class="fault-trend-chart">
    <div class="title">{{Year}}年度易发生故障设备统计</div>
    <div class="chart-subtitle">推移图</div>
    <div class="chart-container">
      <div ref="chartRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { useEcharts } from '@/utils/useEcharts'
import { getFaultyEquipment, type FaultyEquipmentItem } from '@/api/equipment'
const Year = computed(() => new Date().getFullYear())
const chartRef = ref<HTMLElement | null>(null)
const { initChart, setOption } = useEcharts(chartRef)

// 设备故障数据
const equipmentData = ref<FaultyEquipmentItem[]>([])
const chartDataList = ref<Array<{ title: string; data: Array<{ name: string; value: number }> }>>([])

let currentIndex = 0
let carouselTimer: number | null = null

// 获取设备故障数据
const fetchData = async () => {
  try {
    const res = await getFaultyEquipment()
    if (res.code === 200 && res.data && res.data.length > 0) {
      equipmentData.value = res.data
      // 将数据转换为图表格式，按故障次数排序
      const sortedData = [...res.data].sort((a, b) => b.fault_count - a.fault_count)
      
      // 将数据分组，每组最多显示8个设备
      const groupSize = 8
      chartDataList.value = []
      
      for (let i = 0; i < sortedData.length; i += groupSize) {
        const group = sortedData.slice(i, i + groupSize)
        chartDataList.value.push({
          title: '易发生故障设备统计',
          data: group.map(item => ({
            name: item.machName || item.machCode,
            value: item.fault_count
          }))
        })
      }
      
      // 如果没有数据，使用空数组
      if (chartDataList.value.length === 0) {
        chartDataList.value = [{
          title: '易发生故障设备统计',
          data: []
        }]
      }
      
      // 更新图表
      currentIndex = 0
      updateChart()
    } else {
      // 如果没有数据，使用空数组
      chartDataList.value = [{
        title: '易发生故障设备统计',
        data: []
      }]
      updateChart()
    }
  } catch (error) {
    console.error('获取易发生故障设备数据失败:', error)
    // 使用空数据
    chartDataList.value = [{
      title: '易发生故障设备统计',
      data: []
    }]
    updateChart()
  }
}

const createChartOption = (data: any[]) => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: {
        color: '#fff',
        fontSize: 12,
        rotate: 30
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    series: [
      {
        type: 'line',
        data: data.map(item => item.value),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#00d4ff' },
              { offset: 1, color: '#0066ff' }
            ]
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 12
        }
      }
    ]
  }
}

const updateChart = () => {
  if (chartDataList.value.length === 0) return
  
  const currentData = chartDataList.value[currentIndex]
  if (!currentData || !currentData.data || currentData.data.length === 0) {
    // 如果没有数据，显示空图表
    const emptyOption = {
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      }
    }
    setOption(emptyOption)
    return
  }
  
  const option = createChartOption(currentData.data)
  setOption(option)
}

const startCarousel = () => {
  carouselTimer = window.setInterval(() => {
    currentIndex = (currentIndex + 1) % chartDataList.value.length
    updateChart()
  }, 5000) // 每5秒切换一次
}

onMounted(async () => {
  await nextTick()
    initChart()
  await fetchData()
  // 只有在有多组数据时才启动轮播
  if (chartDataList.value.length > 1) {
    startCarousel()
  }
})

onBeforeUnmount(() => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
})
</script>

<style scoped>
.fault-trend-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.title {
  color: #00d4ff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
}

.chart-subtitle {
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  margin-bottom: 12px;
}

.chart-container {
  flex: 1;
  min-height: 0;
}

.chart {
  width: 100%;
  height: 100%;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .title {
    font-size: 20px;
  }
  
  .chart-subtitle {
    font-size: 16px;
  }
}
</style>


