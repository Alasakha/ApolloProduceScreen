<template>
<div class="top w-full h-full">
    <div v-if="!isLoading" ref="chartRef" class="w-full h-[100%]"></div>
    <div v-else class="text-white"> 正在加载......</div>
</div>
</template>


<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { createChartOption1 } from './chartsNew' // 修改为新option
import { useEcharts } from '@/utils/useEcharts'
import { gettimelyAccountingRate } from '@/api/getWMSinfo'

const chartRef = ref(null)
const isLoading = ref(true)
const chartData = ref([]) // 存储新接口数据
const { initChart, setOption, resizeChart } = useEcharts(chartRef)

// 拉取新接口数据
const fetchData = async () => {
  isLoading.value = true
  try {
    const params = { warehouseType: 3 }
    try { console.debug('[CALL] gettimelyAccountingRate params at call site:', params) } catch (e) {}
    const res = await gettimelyAccountingRate(params)
    if (res.code === 200 && Array.isArray(res.data)) {
      chartData.value = res.data
    } else {
      chartData.value = []
    }
  } catch (e) {
    chartData.value = []
  } finally {
    isLoading.value = false
  }
}

// 监听数据变化渲染图表
watch(chartData, (newData) => {
  if (newData && newData.length > 0) {
    nextTick(() => {
      initChart()
      // x轴 warehouseKeeper；两组柱 rate,pmcKpiCount
      // createChartOption1 支持第三参数用于双Y柱状图
      // 为避免 x 轴重复，合并 warehouseKeeper 与 warehouseName 作为显示标签
      const processed = newData.map(item => ({
        ...item,
        warehouseKeeper: `${item.warehouseKeeper || ''} - ${item.warehouse_name || ''}`
      }))

      const option = createChartOption1(processed, '当月入库及时率', ['rate', 'warehouseKeeper'])
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
      resizeChart() // 初始化后立即resize
    })
  }
}, { deep: true, immediate: true })

onMounted(() => {
  fetchData()
  eventBus.on('refreshData', fetchData)
})
</script>




<style scoped lang="scss">

</style>