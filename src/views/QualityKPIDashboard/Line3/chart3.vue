<template>
    <div class="w-full h-full flex ">
        <dv-border-box13>
        <div ref="chartRef1" class="w-full h-full"></div>
    </dv-border-box13>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useEcharts } from '@/utils/useEcharts'
import { createOption } from './chart'

const chartRef1 = ref(null)

const chart1 = useEcharts(chartRef1)

let cleanup = null

    // 响应式数据
    const chartData = ref([
  { value: 335, name: 'Direct' },
  { value: 310, name: 'Email' },
  { value: 274, name: 'Union Ads' },
  { value: 235, name: 'Video Ads' },
  { value: 400, name: 'Search Engine' }
])
const chartLabels = ref('投诉客户占比')


const drawChart = () => {
  const option1 = createOption(
    chartLabels.value, // title
    chartData.value.sort((a, b) => a.value - b.value) // data
  )
  nextTick(() => {
    chart1.setOption(option1)
  })
}




// 监听数据变化
watch([chartData, chartLabels], () => {
  drawChart()
}, { deep: true })

onMounted(async () => {
    await chart1.initChart()
    // await chart2.initChart()
    drawChart()
})

onBeforeUnmount(() => {
    if (cleanup) cleanup()
})
</script>