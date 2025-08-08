<template>
  <div class="h-[25vh] w-full p-2">
    <dv-border-box-2>
      <div class="flex flex-col h-full">
        <!-- 标题 -->
        <div class="text-center py-2">
          <span class="text-[#00eeff] font-bold text-2xl 4xl:text-2xl 3xl:text-sm">82522504270042水表</span>
          <!-- <div class="text-gray-400 text-sm mt-1">
            数据时间：{{ currentDataTime }}
          </div> -->
        </div>

        <!-- 内容区域 -->
        <div class="flex flex-1 p-2">
          <!-- 总用水量 -->
          <div class="flex-1 flex flex-col items-center">
            <div class="text-[#00eeff] text-lg mb-3 
            2xl:text-sm 3xl:text-sm 4xl:text-lg">总用水量</div>
            <div class="flex items-center justify-between w-full mb-2">
              <div class="flex items-center flex-1">
                <span class="text-white  text-sm 2xl:text-[10px] 3xl:text-[10px] 4xl:text-lg">标准值：</span>
                <dv-digital-flop :config="standardTotalConfig" />
              </div>
              <div class="flex items-center flex-1">
                <span class="text-white  text-sm 2xl:text-[10px] 3xl:text-[10px] 4xl:text-lg">实际值：</span>
                <dv-digital-flop :config="actualTotalConfig" />
              </div>
            </div>

            <div class="flex w-full items-center justify-around">
                  <div class="text-white mt-2">
                  同比：<span :class="{
                    'text-red-500': dayDiff > 0,
                    'text-green-500': dayDiff < 0
                  }">{{dayDiff > 0 ? '↑' : '↓'}}{{Math.abs(dayDiff)}}m³</span>
                </div>
                <dv-water-level-pond :config="waterConfig1" style="width:80px;height:80px;margin-top:8px" />
            </div>
           
          </div>

          <!-- 月用水量 -->
          <div class="flex-1 flex flex-col items-center">
            <div class="text-[#00eeff] text-lg mb-3 2xl:text-sm 3xl:text-sm 4xl:text-lg">月用水量</div>
            <div class="flex items-center justify-between w-full mb-2">
              <div class="flex items-center flex-1">
                <span class="text-white text-sm 2xl:text-[10px] 3xl:text-[10px] 4xl:text-lg">标准值：</span>
                <dv-digital-flop :config="standardMonthConfig" />
              </div>
              <div class="flex items-center flex-1">
                <span class="text-white  text-sm 2xl:text-[10px] 3xl:text-[10px] 4xl:text-lg">实际值：</span>
                <dv-digital-flop :config="actualMonthConfig" />
              </div>
            </div>
            <div class="flex w-full items-center justify-around">
                  <div class="text-white mt-2">
                  同比：<span :class="{
                    'text-red-500': dayDiff > 0,
                    'text-green-500': dayDiff < 0
                  }">{{dayDiff > 0 ? '↑' : '↓'}}{{Math.abs(dayDiff)}}m³</span>
                </div>
                <dv-water-level-pond :config="waterConfig1" style="width:80px;height:80px;margin-top:8px" />
            </div>
          </div>

          <!-- 日用水量 -->
          <div class="flex-1 flex flex-col items-center">
            <div class="text-[#00eeff] text-lg mb-3 2xl:text-sm 3xl:text-sm 4xl:text-lg">日用水量</div>
            <div class="flex items-center justify-between w-full mb-2">
              <div class="flex items-center flex-1">
                <span class="text-white  text-sm 2xl:text-[10px] 3xl:text-[10px] 4xl:text-lg">标准值：</span>
                <dv-digital-flop :config="standardDayConfig" />
              </div>
              <div class="flex items-center flex-1">
                <span class="text-white  text-sm 2xl:text-[10px] 3xl:text-[10px] 4xl:text-lg">实际值：</span>
                <dv-digital-flop :config="actualDayConfig" />
              </div>
            </div>
            <div class="flex w-full items-center justify-around">
                  <div class="text-white mt-2">
                  同比：<span :class="{
                    'text-red-500': dayDiff > 0,
                    'text-green-500': dayDiff < 0
                  }">{{dayDiff > 0 ? '↑' : '↓'}}{{Math.abs(dayDiff)}}m³</span>
                </div>
                <dv-water-level-pond :config="waterConfig1" style="width:80px;height:80px;margin-top:8px" />
            </div>
          </div>
        </div>
      </div>
    </dv-border-box-2>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, watch, ref, onMounted, onUnmounted } from 'vue'
import { useEnergyStore } from '@/store/energy'

const energyStore = useEnergyStore()

// 响应式窗口宽度
const windowWidth = ref(window.innerWidth)

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

// 计算数字翻牌器的字体大小
const getFontSize = () => {
  if (windowWidth.value >= 2500) { // 4xl
    return 25
  } else if (windowWidth.value >= 1850) { // 3xl
    return 13
  } else if (windowWidth.value >= 1536) { // 2xl
    return 26
  } else if (windowWidth.value >= 1280) { // xl
    return 24
  } else if (windowWidth.value >= 1024) { // lg
    return 22
  } else if (windowWidth.value >= 768) { // md
    return 20
  } else if (windowWidth.value >= 640) { // sm
    return 18
  } else {
    return 16
  }
}
// 水表数据计算
const dailyWaterData = computed(() => {
  const waterData = energyStore.dailyWaterData
  return waterData.length > 0 ? waterData[0] : null
})

const monthlyWaterData = computed(() => {
  const waterData = energyStore.monthlyWaterData
  return waterData.length > 0 ? waterData[0] : null
})

// 计算用水量数据
const actualDay = computed(() => dailyWaterData.value?.numberPower || 0)
const actualMonth = computed(() => monthlyWaterData.value?.numberPower || 0)
const actualTotal = computed(() => actualMonth.value) // 目前以月用水量作为总用水量

// 标准值设为实际值的120%
const standardDay = computed(() => Math.round(actualDay.value * 1.2)) // 日标准用水量 = 实际值 * 120%
const standardMonth = computed(() => Math.round(actualMonth.value * 1.2)) // 月标准用水量 = 实际值 * 120%  
const standardTotal = computed(() => Math.round(actualTotal.value * 1.2)) // 总标准用水量 = 实际值 * 120%

// 差值计算
const dayDiff = computed(() => actualDay.value - standardDay.value)
// const monthDiff = computed(() => actualMonth.value - standardMonth.value)



// 配置对象
const standardTotalConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualTotalConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const standardMonthConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualMonthConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const standardDayConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualDayConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

// 水位图配置
const waterConfig1 = reactive({
  data: [0],
  shape: 'round',
  waveHeight: 0.3,
  waveNum: 2,
  colors: ['#00eeff', '#0066ff'],
  borderWidth: 2,
  borderColor: '#0066ff',
  borderRadius: 5
})

const waterConfig2 = reactive({
  data: [0],
  shape: 'round',
  waveHeight: 0.3,
  waveNum: 2,
  colors: ['#00eeff', '#0066ff'],
  borderWidth: 2,
  borderColor: '#0066ff',
  borderRadius: 5
})

const waterConfig3 = reactive({
  data: [0],
  shape: 'round',
  waveHeight: 0.3,
  waveNum: 2,
  colors: ['#00eeff', '#0066ff'],
  borderWidth: 2,
  borderColor: '#0066ff',
  borderRadius: 5
})

// 监听数据变化并更新配置
watch([actualTotal, actualMonth, actualDay, standardTotal, standardMonth, standardDay, windowWidth], () => {
  // 更新总用水量配置
  standardTotalConfig.number = [standardTotal.value]
  standardTotalConfig.style.fontSize = getFontSize()
  actualTotalConfig.number = [actualTotal.value]
  actualTotalConfig.style.fontSize = getFontSize()
  // 水位图显示：实际值/标准值(120%) = 实际值/(实际值*1.2) ≈ 83.33%，表示用水效率（保留2位小数避免精度问题）
  const totalRatio = standardTotal.value > 0 ? Math.min(actualTotal.value / standardTotal.value * 100, 100) : 0
  waterConfig1.data = [Math.round(totalRatio * 100) / 100]

  // 更新月用水量配置
  standardMonthConfig.number = [standardMonth.value]
  standardMonthConfig.style.fontSize = getFontSize()
  actualMonthConfig.number = [actualMonth.value]
  actualMonthConfig.style.fontSize = getFontSize()
  // 月用水效率：实际值相对于120%标准值的比例（保留2位小数避免精度问题）
  const monthRatio = standardMonth.value > 0 ? Math.min(actualMonth.value / standardMonth.value * 100, 100) : 0
  waterConfig2.data = [Math.round(monthRatio * 100) / 100]

  // 更新日用水量配置
  standardDayConfig.number = [standardDay.value]
  standardDayConfig.style.fontSize = getFontSize()
  actualDayConfig.number = [actualDay.value]
  actualDayConfig.style.fontSize = getFontSize()
  // 日用水效率：实际值相对于120%标准值的比例（保留2位小数避免精度问题）
  const dayRatio = standardDay.value > 0 ? Math.min(actualDay.value / standardDay.value * 100, 100) : 0
  waterConfig3.data = [Math.round(dayRatio * 100) / 100]
}, { immediate: true })

// 添加调试信息
watch([actualTotal, actualMonth, actualDay, standardTotal, standardMonth, standardDay], () => {
  const dayRatioRaw = actualDay.value / standardDay.value
  const monthRatioRaw = actualMonth.value / standardMonth.value
  const totalRatioRaw = actualTotal.value / standardTotal.value
  
  console.log('🔍 水表数据调试：', {
    actualDay: actualDay.value,
    standardDay: standardDay.value,
    dayRatio: dayRatioRaw,
    dayRatioFixed: Math.round(dayRatioRaw * 100 * 100) / 100,
    actualMonth: actualMonth.value,
    standardMonth: standardMonth.value,
    monthRatio: monthRatioRaw,
    monthRatioFixed: Math.round(monthRatioRaw * 100 * 100) / 100,
    actualTotal: actualTotal.value,
    standardTotal: standardTotal.value,
    totalRatio: totalRatioRaw,
    totalRatioFixed: Math.round(totalRatioRaw * 100 * 100) / 100
  })
}, { immediate: true })

console.log('💧 Line2水表组件：使用store中的真实API数据')
</script>

<style scoped>
:deep(.dv-digital-flop) {
  width: 120px;
  height: 30px;
}
</style>