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
    const res = await getdeliveryTimelinessRate({warehouseType: 2})
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
      const option = createChartOption1(newData, '当月出库及时率', ['rate', 'pmcKpiCount'])
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