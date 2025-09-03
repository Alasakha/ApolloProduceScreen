<template>
  <div class="w-full h-full p-3">
    <div class="text-xl font-bold text-white mb-3 text-center" style="letter-spacing: 2px;">
      设备监控
    </div>
    
    <div class="grid grid-cols-1 gap-3 h-[85%]">
      <!-- 喷塑线监控 -->
      <div class="  bg-opacity-20 rounded-lg p-2 border border-cyan-400 border-opacity-30">
        <div class="text-base font-semibold text-cyan-300 mb-2 text-center" style="letter-spacing: 1px;">
          喷塑线监控
        </div>
        <DataCard
          title1="标准烘烤温度"
          title2="实际温度"
          :data1="powderCoatingData.standardTemp"
          :data2="{
            data: powderCoatingData.actualTemp,
            max: powderCoatingData.standardTemp + 100
          }"
          @update-data="handleDataUpdate"
        />
      </div>
      
      <!-- 喷漆线监控 -->
      <div class="  bg-opacity-20 rounded-lg p-2 border border-cyan-400 border-opacity-30">
        <div class="text-base font-semibold text-cyan-300 mb-2 text-center" style="letter-spacing: 1px;">
          喷漆线监控
        </div>
        <DataCard
          title1="标准烘烤温度"
          title2="实际温度"
          :data1="paintLineData.standardTemp"
          :data2="{
            data: paintLineData.actualTemp,
            max: paintLineData.standardTemp + 100
          }"
          @update-data="handleDataUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DataCard from '../components/monitroCard.vue'

// 喷塑线数据
const powderCoatingData = ref({
  standardTemp: 180, // 标准烘烤温度
  actualTemp: 175,   // 实际温度
  alarmThreshold: 10 // 报警阈值
})

// 喷漆线数据
const paintLineData = ref({
  standardTemp: 160, // 标准烘烤温度
  actualTemp: 165,   // 实际温度
  alarmThreshold: 10 // 报警阈值
})

// 模拟数据更新
let dataTimer: NodeJS.Timeout | null = null

const updateTemperatureData = () => {

  
  // 检查是否需要报警
  checkAlarmConditions()
}

const checkAlarmConditions = () => {
  const powderDiff = Math.abs(powderCoatingData.value.actualTemp - powderCoatingData.value.standardTemp)
  const paintDiff = Math.abs(paintLineData.value.actualTemp - paintLineData.value.standardTemp)
  
  if (powderDiff > powderCoatingData.value.alarmThreshold) {
    console.warn('喷塑线温度异常！', {
      standard: powderCoatingData.value.standardTemp,
      actual: powderCoatingData.value.actualTemp,
      diff: powderDiff
    })
  }
  
  if (paintDiff > paintLineData.value.alarmThreshold) {
    console.warn('喷漆线温度异常！', {
      standard: paintLineData.value.standardTemp,
      actual: paintLineData.value.actualTemp,
      diff: paintDiff
    })
  }
}

const handleDataUpdate = (data: any) => {
  console.log('数据更新:', data)
  // 这里可以处理数据更新逻辑
}

// 组件挂载时启动数据更新
onMounted(() => {
  // 每5秒更新一次温度数据
  dataTimer = setInterval(updateTemperatureData, 5000)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (dataTimer) {
    clearInterval(dataTimer)
    dataTimer = null
  }
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>
