<template>
  <div class="h-[10vh] w-full ">
    <dv-border-box-2 >
        <div class="flex w-full h-full justify-between">
            <div v-for="item in data" class=" flex flex-col items-center justify-center h-full  ">
                  <div class="text-[#00eeff] flex items-center text-base sm:text-lg md:text-xl 3xl:text-sm 4xl:text-lg  ">
            {{item.category}}
            <span :class="{'text-red-500': item.ratio.startsWith('↑'), 'text-green-500': item.ratio.startsWith('↓')}" class="ml-2">
              {{item.ratio}}
            </span>
          </div>
        <!-- <div class="flex justify-center items-center gap-8 felx-col"> -->
          <div class="flex items-center">
            <span class="text-white  text-sm sm:text-base md:text-lg xl:text-sm 2xl:text-[10px] 3xl:text-[10px] 4xl:text-lg">标准耗电：</span>
            <dv-digital-flop :config="{
              number: [item.standardConsumption],
              content: '{nt}kW/h',
              style: {
                fontSize: getFontSize(),
                fill: '#00eeff'
              }
            }" />
          </div>
          <div class="flex items-center">
            <span class="text-white  text-sm sm:text-base md:text-lg xl:text-sm  2xl:text-[10px] 3xl:text-[10px] 4xl:text-lg">实际耗电：</span>
            <dv-digital-flop :config="{
              number: [item.actualConsumption],
              content: '{nt}kW/h',
              style: {
                fontSize: getFontSize(),
                fill: '#00eeff'
              }
            }" />
          </div>
      </div>
        </div>

    </dv-border-box-2>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useEnergyStore } from '@/store/energy'

const energyStore = useEnergyStore()

// 电表设备代码到显示名称的映射（按正确顺序）
const DEVICE_MAPPING = {
  '616506210001': '空压机',        // 序号1
  '616506210002': '注塑',          // 序号2
  '616506210007': '冲压',          // 序号3
  '616506210003': '焊接',          // 序号4
  '616506210010': '总装一课装配',   // 序号5
  '616506210009': '总装一课包装',   // 序号6
  '616506210005': '总装二课',       // 序号7
  '616506210004': '金工二部一楼',   // 序号8
  '616506210006': '金工二部四楼',   // 序号9
  '616506210008': '宿舍'           // 序号10
}

// 使用计算属性基于真实数据生成显示数据 - 使用当月数据，按正确顺序
const data = computed(() => {
  const electricData = energyStore.monthlyElectricData
  const standardData = energyStore.monthlyStandardData
  
  // 按照 MACHINE_CODES.ELECTRIC 的顺序处理数据，确保显示顺序正确
  return electricData.map((deviceData) => {
    const machCode = deviceData.machCode
    const category = DEVICE_MAPPING[machCode] || machCode
    const actualConsumption = Math.round(deviceData.numberPower) || 0
    
    // 从标准数据中查找对应的标准值
    const standardItem = standardData.find(item => item.machCode === machCode)
    const standardConsumption = standardItem ? Math.round(Number(standardItem.number)) : 0
    
    // 计算比率
    let ratio = ''
    if (standardConsumption > 0) {
      const diff = actualConsumption - standardConsumption
      if (diff > 0) {
        ratio = `↑${diff}`
      } else if (diff < 0) {
        ratio = `↓${Math.abs(diff)}`
      }
    }
    
    return {
      category,
      standardConsumption,
      actualConsumption,
      ratio,
      machCode
    }
  })
})

// 数据刷新相关
const updateInterval = ref<number | null>(null)

// Line3组件现在使用store中的当月数据，不再独立获取数据
// 数据由主组件统一管理

console.log('📊 Line3组件：使用store中的当月数据')

// 获取当前窗口宽度
const windowWidth = ref(window.innerWidth)

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

// 监听窗口大小变化
const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value)
    updateInterval.value = null
  }
  window.removeEventListener('resize', updateWidth)
})
</script>

<style scoped>
:deep(.dv-digital-flop) {
  width: 140px;
  height: 40px;
}

/* 响应式调整数字翻牌器尺寸 */
@media (min-width: 1850px) {
  :deep(.dv-digital-flop) {
    width: 160px;
    height: 45px;
  }
}

@media (min-width: 2500px) {
  :deep(.dv-digital-flop) {
    width: 180px;
    height: 50px;
  }
}
</style>