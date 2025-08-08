<template>
  <div class="h-[22vh] w-full p-2">
    <dv-border-box-2>
      <div class="flex flex-col h-full">
        <!-- 标题 -->
        <div class="text-[#00eeff] text-2xl font-bold px-8 py-2 flex justify-between items-center">
          <span>000025061899公司用气总表</span>
          <span class="text-gray-400 text-sm">
            数据时间：{{ new Date().toLocaleString() }}
          </span>
        </div>

        <!-- 内容区域 -->
        <div class="flex-1 flex justify-between px-20">
          <!-- 年度排放 -->
          <div class="w-[33%] flex flex-col">
            <div class="text-[#00eeff] text-xl mb-4">年度用气</div>
            <div class="flex gap-4 items-start h-full">
              <div class="flex flex-col gap-2">
                <div class="flex items-center">
                  <span class="text-[#00eeff] w-14">实际：</span>
                  <span class="text-[#00eeff] text-2xl">{{actualYear.toFixed(1)}}m³</span>
                </div>
                <div class="text-red-500 text-sm">同比：{{yearDiff.toFixed(1)}}m³</div>
              </div>
              <div class="relative">
                <dv-water-level-pond :config="waterConfig1" style="width:140px;height:140px" />
              </div>
            </div>
          </div>

          <!-- 月度排放 -->
          <div class="w-[33%] flex flex-col">
            <div class="text-[#00eeff] text-xl mb-4">月度用气</div>
            <div class="flex gap-4 items-start h-full">
              <div class="flex flex-col gap-2">
                <div class="flex items-center">
                  <span class="text-[#00eeff] w-14">实际：</span>
                  <span class="text-[#00eeff] text-2xl">{{actualMonth.toFixed(1)}}m³</span>
                </div>
                <div class="text-red-500 text-sm">同比：{{monthDiff.toFixed(1)}}m³</div>
              </div>
              <div class="relative">
                <dv-water-level-pond :config="waterConfig2" style="width:140px;height:140px" />
              </div>
            </div>
          </div>

          <!-- 日排放 -->
          <div class="w-[33%] flex flex-col">
            <div class="text-[#00eeff] text-xl mb-4">日用气</div>
            <div class="flex gap-4 items-start h-full">
              <div class="flex flex-col gap-2">
                <div class="flex items-center">
                  <span class="text-[#00eeff] w-14">实际：</span>
                  <span class="text-[#00eeff] text-2xl">{{actualDay.toFixed(1)}}m³</span>
                </div>
                <div class="text-red-500 text-sm">同比：{{dayDiff.toFixed(1)}}m³</div>
              </div>
              <div class="relative">
                <dv-water-level-pond :config="waterConfig3" style="width:140px;height:140px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </dv-border-box-2>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useEnergyStore } from '@/store/energy'

// 获取能源store
const energyStore = useEnergyStore()

// 用气数据标准值
const standardYear = ref(9000)
const standardMonth = ref(900)
const standardDay = ref(30)

// 从store中获取用气数据
const gasData = computed(() => energyStore.gasData)
const dailyGasData = computed(() => energyStore.dailyData.filter(item => item.machCode === '000025061899'))
const monthlyGasData = computed(() => energyStore.monthlyData.filter(item => item.machCode === '000025061899'))

// 计算实际用气量和差值
const actualYear = computed(() => {
  const data = gasData.value.find(item => item.machCode === '000025061899')
  return data ? parseFloat(String(data.numberPower)) || 0 : 0
})

const actualMonth = computed(() => {
  const data = monthlyGasData.value.find(item => item.machCode === '000025061899')
  return data ? parseFloat(String(data.numberPower)) || 0 : 0
})

const actualDay = computed(() => {
  const data = dailyGasData.value.find(item => item.machCode === '000025061899')
  return data ? parseFloat(String(data.numberPower)) || 0 : 0
})

const yearDiff = computed(() => actualYear.value - standardYear.value)
const monthDiff = computed(() => actualMonth.value - standardMonth.value)
const dayDiff = computed(() => actualDay.value - standardDay.value)

// 数据更新时间
const lastUpdateTime = ref(new Date())

// 水位图配置
const waterConfig1 = ref({
  data: [80],
  shape: 'round',
  waveHeight: 0.1,  // 降低波浪高度
  waveNum: 1,      // 减少波浪数量
  colors: ['rgba(0, 238, 255, 0.6)']  // 添加透明度
})

const waterConfig2 = ref({
  data: [80],
  shape: 'round',
  waveHeight: 0.1,
  waveNum: 1,
  colors: ['rgba(0, 238, 255, 0.6)']
})

const waterConfig3 = ref({
  data: [80],
  shape: 'round',
  waveHeight: 0.1,
  waveNum: 1,
  colors: ['rgba(0, 238, 255, 0.6)']
})

// 更新数据
const updateData = () => {
  // 更新水位图配置，使用computed值
  waterConfig1.value.data = [Math.min(actualYear.value / standardYear.value * 100, 100)]
  waterConfig2.value.data = [Math.min(actualMonth.value / standardMonth.value * 100, 100)]
  waterConfig3.value.data = [Math.min(actualDay.value / standardDay.value * 100, 100)]

  // 更新时间
  lastUpdateTime.value = new Date()
}

let timer: NodeJS.Timeout
onMounted(() => {
  updateData()
  timer = setInterval(updateData, 3000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

:deep(.dv-water-level-pond) {
  --svg-bg-color: transparent;
  --svg-border-color: #0066ff;
}
</style>
