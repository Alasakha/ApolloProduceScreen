<template>
  <div class="new-charts-page w-full h-full flex flex-col gap-4 p-4">
    <!-- 第一个图表（入库异常） -->
    <div class="chart-item flex-1">
      <dv-border-box8 :dur="5">
        <div class="chartsbox w-full h-full">
          <div v-if="!isLoading && !isDataEmpty1" ref="chartRef1" class="w-full h-full"></div>
          <div v-else-if="isLoading" class="w-full h-full flex items-center justify-center text-white text-xl">
            正在加载入库异常数据...
          </div>
          <div v-else class="w-full h-full flex items-center justify-center text-white text-3xl">
            暂无数据
          </div>
        </div>
      </dv-border-box8>
    </div>

    <!-- 第二个图表（出库异常） -->
    <div class="chart-item flex-1">
      <dv-border-box8 :dur="5">
        <div class="chartsbox w-full h-full">
          <div v-if="!isLoading && !isDataEmpty2" ref="chartRef2" class="w-full h-full"></div>
          <div v-else-if="isLoading" class="w-full h-full flex items-center justify-center text-white text-xl">
            正在加载出库异常数据...
          </div>
          <div v-else class="w-full h-full flex items-center justify-center text-white text-3xl">
            暂无数据
          </div>
        </div>
      </dv-border-box8>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { createChartOption1 } from './chartsNew'
import { getPmcKpiWithCk } from '@/api/getScmInfo.js'
import * as echarts from 'echarts'

const chartRef1 = ref(null)
const chartRef2 = ref(null)
const isLoading = ref(true)
const isDataEmpty1 = ref(false)
const isDataEmpty2 = ref(false)
const data1 = ref([]) // C入库异常
const data2 = ref([]) // D出库异常

let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null

const initChart = (ref: any, instance: any) => {
  if (!ref.value) return
  if (instance) {
    instance.dispose()
  }
  return echarts.init(ref.value)
}

const setChartOption = (instance: echarts.ECharts | null, option: any) => {
  if (!instance) return
  instance.setOption(option)
  window.addEventListener('resize', () => {
    instance && instance.resize()
  })
}

const fetchData = async () => {
  try {
    isLoading.value = true
    // 并行请求两个接口
    const [res1, res2] = await Promise.all([
      getPmcKpiWithCk('C', '总仓'), // 入库异常
      getPmcKpiWithCk('D', '总仓')  // 出库异常
    ])
    // 入库异常
    if (res1.code === 200 && res1.data && res1.data.length > 0) {
      data1.value = res1.data
      isDataEmpty1.value = false
    } else {
      data1.value = []
      isDataEmpty1.value = true
    }
    // 出库异常
    if (res2.code === 200 && res2.data && res2.data.length > 0) {
      data2.value = res2.data
      isDataEmpty2.value = false
    } else {
      data2.value = []
      isDataEmpty2.value = true
    }
    nextTick(() => {
      drawCharts()
    })
  } catch (error) {
    data1.value = []
    data2.value = []
    isDataEmpty1.value = true
    isDataEmpty2.value = true
  } finally {
    isLoading.value = false
  }
}

const drawCharts = () => {
  nextTick(() => {
    if (!isDataEmpty1.value && data1.value.length > 0) {
      chartInstance1 = initChart(chartRef1, chartInstance1)
      if (chartInstance1) {
        const option1 = createChartOption1(data1.value, '入库异常')
        setChartOption(chartInstance1, option1)
      }
    }
    if (!isDataEmpty2.value && data2.value.length > 0) {
      chartInstance2 = initChart(chartRef2, chartInstance2)
      if (chartInstance2) {
        const option2 = createChartOption1(data2.value, '出库异常')
        setChartOption(chartInstance2, option2)
      }
    }
  })
}

watch([data1, data2, isDataEmpty1, isDataEmpty2, isLoading], () => {
  if (!isLoading.value) {
    drawCharts()
  }
}, { deep: true, immediate: false })

onMounted(() => {
  fetchData()
  eventBus.on('refreshData', fetchData)
  eventBus.on('wms-carousel-change', onCarouselChange)
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData)
  eventBus.off('wms-carousel-change', onCarouselChange)
  if (chartInstance1) { chartInstance1.dispose(); chartInstance1 = null }
  if (chartInstance2) { chartInstance2.dispose(); chartInstance2 = null }
  window.removeEventListener('resize', () => {})
})

function onCarouselChange() {
  drawCharts()
}
</script>

<style scoped lang="scss">
.new-charts-page {
  .chartsbox {
    padding: 10px;
    min-height: 0;
  }
  .chart-item { height: 100%; min-height: 0; }
}
</style>
