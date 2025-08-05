<template>
  <div class="content w-full h-full p-4">
    <h1 class="text-2xl font-bold text-[#00eeff]">销售计划达成</h1>
    <div class="table-container overflow-auto rounded-lg border border-[#00eeff] shadow-[0_0_20px_rgba(0,238,255,0.3)]">
      <table class="w-full text-sm text-center border-collapse text-[#00eeff]">
        <thead>
          <tr class="border-b border-[#00eeff40] bg-[#001122]">
            <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">类型</th>
            <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">计划销售数量</th>
            <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">实际销售数量</th>
            <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">达成率</th>
          </tr>
        </thead>
        <tbody>
          <!-- 汽油车行 -->
          <tr class="border-b border-[#00eeff40] bg-[rgba(0,238,255,0.1)]">
            <td class="px-4 py-2 text-left border-x border-[#00eeff40]">汽油车</td>
            <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatNumber(gasData.plan) }}</td>
            <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatNumber(gasData.actual) }}</td>
            <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatPercent(gasData.percent) }}</td>
          </tr>
          <!-- 摩托车行 -->
          <tr class="border-b border-[#00eeff40] bg-[rgba(0,238,255,0.1)]">
            <td class="px-4 py-2 text-left border-x border-[#00eeff40]">摩托车</td>
            <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatNumber(motoData.plan) }}</td>
            <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatNumber(motoData.actual) }}</td>
            <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatPercent(motoData.percent) }}</td>
          </tr>
          <!-- 合计行 -->
          <tr class="bg-[rgba(0,238,255,0.15)] font-semibold border-b border-[#00eeff40]">
            <td class="px-4 py-2 text-left border-x border-[#00eeff40]">合计</td>
            <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatNumber(totalData.plan) }}</td>
            <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatNumber(totalData.actual) }}</td>
            <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatPercent(totalData.percent) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getSelectSalesIssueAmt } from '@/api/getStampWeldinfo'

// 定义emit
const emit = defineEmits(['update:chartData'])

interface SalesData {
  monthDay: string | null
  plant_code: number
  type: 'SHIJI' | 'JIHUA'
  qty: number
}

interface ProcessedData {
  plan: number
  actual: number
  percent: number
}

const rawData = ref<SalesData[]>([])

// 处理汽油车数据
const gasData = computed<ProcessedData>(() => {
  const plan = rawData.value.find(item => item.plant_code === 1 && item.type === 'JIHUA')?.qty || 0
  const actual = rawData.value.find(item => item.plant_code === 1 && item.type === 'SHIJI')?.qty || 0
  return {
    plan,
    actual,
    percent: plan ? (actual / plan) * 100 : 0
  }
})

// 处理摩托车数据
const motoData = computed<ProcessedData>(() => {
  const plan = rawData.value.find(item => item.plant_code === 2 && item.type === 'JIHUA')?.qty || 0
  const actual = rawData.value.find(item => item.plant_code === 2 && item.type === 'SHIJI')?.qty || 0
  return {
    plan,
    actual,
    percent: plan ? (actual / plan) * 100 : 0
  }
})

// 计算合计数据
const totalData = computed<ProcessedData>(() => {
  return {
    plan: gasData.value.plan + motoData.value.plan,
    actual: gasData.value.actual + motoData.value.actual,
    percent: (gasData.value.plan + motoData.value.plan) ? 
      ((gasData.value.actual + motoData.value.actual) / (gasData.value.plan + motoData.value.plan)) * 100 : 0
  }
})

// 准备图表数据
const chartData = computed(() => {
  const monthDay = rawData.value[0]?.monthDay || ''
  return [
    [monthDay, '汽油车', gasData.value.plan, gasData.value.actual],
    [monthDay, '摩托车', motoData.value.plan, motoData.value.actual],
    ['total', '合计', totalData.value.plan, totalData.value.actual]
  ]
})

// 监听图表数据变化并发送
watch(chartData, (newData) => {
  emit('update:chartData', newData)
}, { immediate: true })

// 格式化数字
const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US')
}

// 格式化百分比
const formatPercent = (value: number): string => {
  return value.toFixed(2) + '%'
}

// 获取数据
const fetchData = async () => {
  try {
    const res = await getSelectSalesIssueAmt()
    if (res.code === 200 && Array.isArray(res.data)) {
      rawData.value = res.data
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// 定时刷新数据
let timer: number | null = null

onMounted(() => {
  fetchData()
  timer = window.setInterval(fetchData, 180000) // 每3分钟刷新一次
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.table-container {
  position: relative;
  background: linear-gradient(180deg, rgba(0,19,47,0.95) 0%, rgba(0,19,47,0.85) 100%);
  box-shadow: 
    0 0 20px rgba(0,238,255,0.3),
    inset 0 0 20px rgba(0,238,255,0.1);
}

th {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Segoe UI', 'Arial', sans-serif;
  text-shadow: 0 0 10px rgba(0,225,255,0.5);
  font-size: 0.9rem;
  background: linear-gradient(180deg, #001122 0%, #001a33 100%);
}

td {
  color: #00eeff;
  text-shadow: none;
}

tr:hover {
  background: linear-gradient(
    90deg,
    rgba(0, 19, 47, 0.8) 0%,
    rgba(0, 238, 255, 0.2) 30%,
    rgba(0, 238, 255, 0.2) 70%,
    rgba(0, 19, 47, 0.8) 100%
  ) !important;
}
</style>