<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getTop5PurchaseBad } from '@/api/getScmInfo.js'

const rawData = ref({ performance: [], appearance: [] })
const chartPerformance = ref(null)
const chartAppearance = ref(null)

const performanceList = ref([])
const appearanceList = ref([])
const marqueeVisible = ref(true)
const scrollList = ref([])
const drawBarChart = (el, data, title) => {
  const myChart = echarts.init(el)

  myChart.setOption({
    title: {
      text: title,
      left: 'center',
      textStyle: { color: '#fff', fontSize: 16 }
    },
    tooltip: { trigger: 'axis' },
    grid: { left: '5%', right: '5%', top: 30, bottom: 60 },
    xAxis: {
      type: 'category',
      data: data.map(i => i.description || '未知'),
      axisLabel: { color: '#fff', rotate: 30 } // 可以加个旋转，避免文字重叠
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#fff' },
      splitLine: { show: false }
    },
    series: [
      {
        type: 'bar',
        data: data.map(i => +i.total),
        itemStyle: { color: '#3399FF' },
        label: {
          show: true,
          position: 'top',
          color: '#fff'
        }
      }
    ]
  })

  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

const fetchData = async () => {
  const res = await getTop5PurchaseBad()
  rawData.value = res.data

  performanceList.value = res.data.performance.filter(i => i.total !== '0')
  appearanceList.value = res.data.appearance.filter(i => i.total !== '0')

  // 合并：加上 type 字段，标识是性能还是外观
  scrollList.value = [
    ...performanceList.value.map(item => ({ ...item, type: '性能' })),
    ...appearanceList.value.map(item => ({ ...item, type: '外观' }))
  ]

  nextTick(() => {
    if (chartPerformance.value) drawBarChart(chartPerformance.value, performanceList.value, '性能异常 TOP10')
    if (chartAppearance.value) drawBarChart(chartAppearance.value, appearanceList.value, '外观异常 TOP10')
  })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="Nonconformance">
    <dv-border-box8 :dur="5">
      <div class="dv-bg">
        <div class="chart-row">
          <div ref="chartPerformance" class="chart-box"></div>
          <div ref="chartAppearance" class="chart-box"></div>
        </div>
        <div class="bottom-scroll pl-4 flex items-center justify-between">
          <div class="scroll-title ">异常类型：</div>
          <Vue3Marquee
  v-if="marqueeVisible"
  :speed="40"
  pauseOnHover
  gradient
  :gradient-color="[173, 216, 230]" 
  gradient-length="5%"
  class="h-full"
>
  <div
    v-for="(data, index) in scrollList"
    :key="index"
    class="scroll-item mr-6"
  >
    <span class="font-bold text-sm text-white">{{ index + 1 }}.</span>
    <span class="ml-2 text-white">[{{ data.type }}] {{ data.description }}：</span>
    <span class="text-white">{{ data.total }}</span>
  </div>
</Vue3Marquee>

        </div>
      </div>
    </dv-border-box8>
  </div>
</template>

<style scoped>
.Nonconformance {
  width: 100%;
  height: 100%; /* ⭐重点：确保父容器有高度 */
  box-sizing: border-box;
  overflow: hidden;
}

.dv-bg {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
}

.chart-row {
  display: flex;
  gap: 10px;
  flex: 1;
  min-height: 0; /* ⭐防止撑爆父容器 */
}

.chart-box {
  flex: 1;
  height: 100%;
  min-height: 200px;
}

.bottom-scroll {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid #00ffff;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
}

.scroll-title {
  font-weight: bold;
  margin-bottom: 5px;
  width: 3vw;
}

.scroll-item {
  padding: 4px 0;
  border-bottom: 1px dashed #444;
}
:deep(.vue3-marquee.horizontal) {
  height: 100% !important;
  align-items: center;
}

.scroll-item {
  white-space: nowrap;
}
</style>