<template>
  <div class="w-full h-full flex flex-col">
    
    <dv-border-box8 :dur="5" class="w-full h-full flex">
      <h1 class="text-white text-2xl font-bold mt-4">{{dialogTitle}}</h1>
      <div class="w-full h-full flex flex-col mt-8">
            <h1 class="text-white text-sm font-bold flex justify-center">汽油车包装车间</h1>
          <div ref="chartRef1" class="w-full h-[30%]"></div>
          <h1 class="text-white text-sm font-bold flex justify-center">电动包装车间</h1>
          <div ref="chartRef2" class="w-full h-[30%]"></div>
      </div>

    </dv-border-box8>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useEcharts } from '@/utils/useEcharts'
import { createOption } from './jindu'
import { getCheckTotalDone } from '@/api/getQuiltyinfo'
const dialogTitle = ref('装配检验超时');
const chartRef1 = ref(null)
const chartRef2 = ref(null)
const chart1 = useEcharts(chartRef1)
const chart2 = useEcharts(chartRef2)
let cleanup = null

  // 响应式数据
const chartData1 = ref([])
const chartLabels1 = ref([])
const chartData2 = ref([])
const chartLabels2 = ref([])
const drawChart = () => {
const option1 = createOption(chartData1.value,chartLabels1.value)
const option2 = createOption(chartData2.value,chartLabels2.value)

nextTick(() => {
  chart1.setOption(option1)
  chart2.setOption(option2)
})
}

// 监听数据变化
watch([chartData1, chartLabels1], () => {
  drawChart()
}, { deep: true })
watch([chartData2, chartLabels2], () => {
  drawChart()
}, { deep: true })

const fetchData = async () => {
  const res = await getCheckTotalDone()
  if(res.code === 200 && Array.isArray(res.data)){
    const target = res.data.find(item => item.workCenterName === '汽油车包装车间')
    if(target){
      chartData1.value = [target.total, target.checkTotal]
      chartLabels1.value = ['总数', '检验数']
    const target2 = res.data.find(item => item.workCenterName === '电动包装车间')
    if(target2){
      chartData2.value = [target2.total, target2.checkTotal]
      chartLabels2.value = ['总数', '检验数']
    }
      drawChart()
    }
  }

}

onMounted(async () => {
  await chart1.initChart()
  await chart2.initChart()
  await fetchData()
  drawChart()
})

onBeforeUnmount(() => {
  if (cleanup) cleanup()
})
</script>