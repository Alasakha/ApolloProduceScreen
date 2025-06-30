<template>
<div class="top w-full h-full">
    <div v-if="!isLoading" ref="chartRef" class="w-full h-[100%]"></div>
    <div v-else class="text-white"> 正在加载......</div>
</div>


</template>


<script setup lang="ts">
 import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
 import { eventBus } from '@/utils/eventbus'
 import { createChartOption } from './charts'
 import { useEcharts } from '@/utils/useEcharts'
 import { useAccountDataStore } from '@/store/getStoreData'
const chartRef = ref(null)
const isLoading = ref(true)
const OutboundData = ref([]) // 存储数据
const { initChart, setOption, resizeChart } = useEcharts(chartRef)

const store = useAccountDataStore() // 使用数据存储

const fetchData = async () => {
  await store.fetchOutboundData() // 等待数据加载
  isLoading.value = store.Outboundloading // 数据加载完成后隐藏加载动画
  OutboundData.value = store.OutboundData
    console.log('OutboundData.value:', OutboundData.value)

}

watch(OutboundData, () => {
    nextTick(() => {
        initChart()
        const option = createChartOption(OutboundData.value,'当月出库及时率')
        setOption(option)
        resizeChart() // 关键点：初始化后立即触发一次 resize
    })
}, { deep: true, immediate: true })


onMounted(() => {
  fetchData()
  nextTick(() => { // 确保 DOM 挂载后再初始化
      initChart();
      resizeChart();
  });
  eventBus.on('refreshData', fetchData)
})
  onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData)
  })

</script>




<style scoped lang="scss">

</style>