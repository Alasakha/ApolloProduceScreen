<template>
<div class="top w-full h-full">
    <div v-if="!isLoading" ref="chartRef" class="w-full h-[100%]"></div>
    <div v-else class="text-white"> 正在加载......</div>
</div>


</template>


<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { createChartOption1 } from './chartsNew'
import { useEcharts } from '@/utils/useEcharts'
import { getdeliveryTimelinessRate } from '@/api/getWMSinfo'

const chartRef = ref(null)
const isLoading = ref(true)
const OutboundData = ref([]) // 存储数据
const { initChart, setOption, resizeChart } = useEcharts(chartRef)

// 直接拉取后端接口数据
const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await getdeliveryTimelinessRate({warehouseType: 3})
    if (res.code === 200 && Array.isArray(res.data)) {
      OutboundData.value = res.data
    } else {
      OutboundData.value = []
    }
  } catch (e) {
    OutboundData.value = []
  } finally {
    isLoading.value = false
  }
}

// 监听数据变化渲染图表
watch(OutboundData, (newData) => {
  if (newData && newData.length > 0) {
    nextTick(() => {
      initChart()
      const processed = newData.map(item => ({
        ...item,
        warehouseKeeper: `${item.warehouseKeeper || ''} - ${item.warehouseName || ''}`
      }))
      const option = createChartOption1(processed, '当月出库及时率', ['rate', 'warehouseKeeper'])
      // 强制设置 x 轴标签旋转并全部显示，防止重叠（使用 any 断言以避免类型不匹配）
      const optAny: any = option
      if (optAny.xAxis) {
        if (Array.isArray(optAny.xAxis)) {
          optAny.xAxis.forEach((ax: any) => {
            ax.axisLabel = { ...(ax.axisLabel || {}), rotate: 30, interval: 0 }
          })
        } else {
          optAny.xAxis.axisLabel = { ...(optAny.xAxis.axisLabel || {}), rotate: 30, interval: 0 }
        }
      }
      setOption(option)
      resizeChart()
    })
  }
}, { deep: true, immediate: true })

onMounted(() => {
  fetchData()
  nextTick(() => {
    initChart()
    resizeChart()
  })
  eventBus.on('refreshData', fetchData)
})

</script>




<style scoped lang="scss">

</style>