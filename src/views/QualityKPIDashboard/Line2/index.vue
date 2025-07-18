<template>
    <div class="w-full h-[10vh] flex ">
        <div ref="chartRef1" class="w-full h-full"></div>
        <div ref="chartRef2" class="w-full h-full"></div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useEcharts } from '@/utils/useEcharts'
import { createOption } from './charts'

const chartRef1 = ref(null)
const chartRef2 = ref(null)
const chart1 = useEcharts(chartRef1)
const chart2 = useEcharts(chartRef2)
let cleanup = null

    // 响应式数据
const chartData = ref([40, 56])
const chartLabels = ref(['客诉关闭率', '质量改善达标率'])

const drawChart = () => {
  const option1 = createOption([chartData.value[0]], [chartLabels.value[0]])
  const option2 = createOption([chartData.value[1]], [chartLabels.value[1]])

  nextTick(() => {
    chart1.setOption(option1)
    chart2.setOption(option2)
  })
}

// 监听数据变化
watch([chartData, chartLabels], () => {
    drawChart()
}, { deep: true })

onMounted(async () => {
    await chart1.initChart()
    await chart2.initChart()
    drawChart()
})

onBeforeUnmount(() => {
    if (cleanup) cleanup()
})
</script>