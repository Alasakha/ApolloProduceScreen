<template>

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
</template>




<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { getTop5PurchaseBad } from '@/api/getScmInfo.js'
import {formatPieChartData} from '@/utils/map'
const rawData = ref({ performance: [], appearance: [] })

const performanceList = ref([])
const appearanceList = ref([])
const marqueeVisible = ref(true)
const scrollList = ref([])
const showData = ref([])

const fetchData = async () => {
  const res = await getTop5PurchaseBad()
  rawData.value = res.data

  performanceList.value = res.data.performance.filter(i => i.total !== '0')
  appearanceList.value = res.data.appearance.filter(i => i.total !== '0')

  // 合并：加上 type 字段，标识是性能还是外观
  scrollList.value = [
    ...performanceList.value.map(item => ({ ...item, type: '性能' })),
    ...appearanceList.value.map(item => ({ ...item, type: '其他' }))
  ]

}

// 格式化数据放入饼图
 showData.value = formatPieChartData(rawData.value.performance, 'description', 'total')

onMounted(() => {
  fetchData()
})
</script>


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