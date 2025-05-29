<template>
<div class="top w-full h-full">
    <div v-if="!isLoading" ref="chartRef" class="w-full h-[100%]"></div>
    <div v-else class="text-white"> 正在加载......</div>
</div>


</template>


<script setup lang="ts">
 import { ref, onMounted, nextTick, watch } from 'vue'
 import { eventBus } from '@/utils/eventbus'
 import { createChartOption } from './charts'
 import { useEcharts } from '@/utils/useEcharts'
 import { useAccountDataStore } from '@/store/getStoreData'
const chartRef = ref(null)
const isLoading = ref(true)
const InboundData = ref([]) // 存储数据
const { initChart, setOption, resizeChart } = useEcharts(chartRef)

const store = useAccountDataStore() // 使用数据存储

const fetchData = async () => {
  await store.fetchInboundData() // 等待数据加载
  isLoading.value = store.Inboundloading // 数据加载完成后隐藏加载动画
  InboundData.value = store.InboundData
}

watch(InboundData, () => {
    nextTick(() => {
        initChart()
        const option = createChartOption(InboundData.value,'当月入库及时率')
        setOption(option)
        resizeChart() // 关键点：初始化后立即触发一次 resize
    })
}, { deep: true, immediate: true })


onMounted(() => {
  fetchData()
  eventBus.on('refreshData', fetchData)
})
</script>




<style scoped lang="scss">

</style>