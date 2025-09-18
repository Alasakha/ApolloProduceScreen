<template>
  <div class="w-full h-full p-1">
    <div class="text-xl font-bold text-white mb-3 text-center" style="letter-spacing: 2px;">
      设备监控
    </div>
    
    <div class="grid grid-cols-1 gap-3 h-[calc(100%-4rem)] overflow-y-auto">
      <!-- 粉体线PLC监控 -->
      <div class="bg-opacity-20 rounded-lg p-3 border border-cyan-400 border-opacity-30 flex flex-col h-full">
        <div class="text-base font-semibold text-cyan-300 mb-2 text-center" style="letter-spacing: 1px;">
          粉体线PLC (FX3G-24MR)
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm flex-1">
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>固化炉温度:</span>
            <span class="text-white font-semibold">{{ powderLineData.temperature }}°C</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>工作温度:</span>
            <span class="text-white font-semibold">{{ powderLineData.workTemp }}°C</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>超温状态:</span>
            <span :class="powderLineData.overTemp ? 'text-red-400' : 'text-green-400'" class="font-semibold">{{ powderLineData.overTemp ? '是' : '否' }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>低温状态:</span>
            <span :class="powderLineData.lowTemp ? 'text-yellow-400' : 'text-green-400'" class="font-semibold">{{ powderLineData.lowTemp ? '是' : '否' }}</span>
          </div>
        </div>
      </div>
      
      <!-- 贴标线PLC监控 -->
      <div class="bg-opacity-20 rounded-lg p-3 border border-cyan-400 border-opacity-30 flex flex-col h-full">
        <div class="text-base font-semibold text-cyan-300 mb-2 text-center" style="letter-spacing: 1px;">
          贴标线PLC (FX3G-24MR)
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm flex-1">
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>固化炉超温:</span>
            <span :class="labelLineData.overTemp ? 'text-red-400' : 'text-green-400'" class="font-semibold">{{ labelLineData.overTemp ? '是' : '否' }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>生产计量:</span>
            <span class="text-white font-semibold">{{ labelLineData.productionCount }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>工作温度:</span>
            <span class="text-white font-semibold">{{ labelLineData.workTemp }}°C</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>固化炉温度:</span>
            <span class="text-white font-semibold">{{ labelLineData.temperature }}°C</span>
          </div>
        </div>
      </div>
      
      <!-- 液体线PLC监控 -->
      <div class="bg-opacity-20 rounded-lg p-3 border border-cyan-400 border-opacity-30 flex flex-col h-full">
        <div class="text-base font-semibold text-cyan-300 mb-2 text-center" style="letter-spacing: 1px;">
          液体线PLC (FX3G-40MR)
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm flex-1">
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>固化炉超温:</span>
            <span :class="liquidLineData.overTemp ? 'text-red-400' : 'text-green-400'" class="font-semibold">{{ liquidLineData.overTemp ? '是' : '否' }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>生产计量:</span>
            <span class="text-white font-semibold">{{ liquidLineData.productionCount }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>工作温度:</span>
            <span class="text-white font-semibold">{{ liquidLineData.workTemp }}°C</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>超温写入:</span>
            <span :class="liquidLineData.overTempWrite ? 'text-red-400' : 'text-green-400'" class="font-semibold">{{ liquidLineData.overTempWrite ? '是' : '否' }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>低温写入:</span>
            <span :class="liquidLineData.lowTempWrite ? 'text-yellow-400' : 'text-green-400'" class="font-semibold">{{ liquidLineData.lowTempWrite ? '是' : '否' }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>固化炉温度:</span>
            <span class="text-white font-semibold">{{ liquidLineData.temperature }}°C</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 粉体线PLC数据
const powderLineData = ref({
  temperature: 185,    // 固化炉温度
  workTemp: 180,       // 固化炉工作温度写入
  overTemp: false,     // 固化炉超温写入
  lowTemp: false       // 固化炉低温写入
})

// 贴标线PLC数据
const labelLineData = ref({
  overTemp: false,     // 固化炉超温
  productionCount: 1250, // 生产计量信号
  workTemp: 175,       // 固化炉工作温度写入
  temperature: 180     // 固化炉温度
})

// 皮膜线PLC数据
const filmLineData = ref({
  productionCount: 980, // 生产计量信号
  workTemp: 170,       // 固化炉工作温度写入
  overTemp: false,     // 固化炉超温写入
  temperature: 175     // 固化炉温度
})

// 液体线PLC数据
const liquidLineData = ref({
  overTemp: false,     // 固化炉超温
  productionCount: 1100, // 生产计量信号
  workTemp: 165,       // 固化炉工作温度写入
  overTempWrite: false, // 固化炉超温写入
  lowTempWrite: false,  // 固化炉低温写入
  temperature: 170     // 固化炉温度
})

// T4炉PLC数据
const t4FurnaceData = ref({
  overTemp: false,     // 炉内超温
  tempReached: true,   // 炉内温度到达
  insulationTime: 45,  // 保温计时
  timerEnd: false      // 保温计时结束
})

// 模拟数据更新
let dataTimer: NodeJS.Timeout | null = null

const updatePLCData = () => {
  // 模拟温度数据变化
  powderLineData.value.temperature = 180 + Math.floor(Math.random() * 20)
  labelLineData.value.temperature = 175 + Math.floor(Math.random() * 15)
  filmLineData.value.temperature = 170 + Math.floor(Math.random() * 18)
  liquidLineData.value.temperature = 165 + Math.floor(Math.random() * 20)
  
  // 模拟工作温度
  powderLineData.value.workTemp = powderLineData.value.temperature - 5
  labelLineData.value.workTemp = labelLineData.value.temperature - 5
  filmLineData.value.workTemp = filmLineData.value.temperature - 5
  liquidLineData.value.workTemp = liquidLineData.value.temperature - 5
  
  // 模拟超温状态
  powderLineData.value.overTemp = powderLineData.value.temperature > 200
  labelLineData.value.overTemp = labelLineData.value.temperature > 195
  filmLineData.value.overTemp = filmLineData.value.temperature > 190
  liquidLineData.value.overTemp = liquidLineData.value.temperature > 185
  liquidLineData.value.overTempWrite = liquidLineData.value.overTemp
  
  // 模拟低温状态
  powderLineData.value.lowTemp = powderLineData.value.temperature < 160
  liquidLineData.value.lowTempWrite = liquidLineData.value.temperature < 150
  
  // 模拟生产计数
  labelLineData.value.productionCount += Math.floor(Math.random() * 3)
  filmLineData.value.productionCount += Math.floor(Math.random() * 2)
  liquidLineData.value.productionCount += Math.floor(Math.random() * 4)
  
  // 模拟T4炉数据
  t4FurnaceData.value.overTemp = Math.random() > 0.9
  t4FurnaceData.value.tempReached = Math.random() > 0.1
  t4FurnaceData.value.insulationTime = Math.max(0, t4FurnaceData.value.insulationTime - 1)
  t4FurnaceData.value.timerEnd = t4FurnaceData.value.insulationTime === 0
  
  // 检查报警条件
  checkAlarmConditions()
}

const checkAlarmConditions = () => {
  // 检查超温报警
  if (powderLineData.value.overTemp) {
    console.warn('粉体线固化炉超温！', powderLineData.value.temperature)
  }
  if (labelLineData.value.overTemp) {
    console.warn('贴标线固化炉超温！', labelLineData.value.temperature)
  }
  if (filmLineData.value.overTemp) {
    console.warn('皮膜线固化炉超温！', filmLineData.value.temperature)
  }
  if (liquidLineData.value.overTemp) {
    console.warn('液体线固化炉超温！', liquidLineData.value.temperature)
  }
  if (t4FurnaceData.value.overTemp) {
    console.warn('T4炉内超温！')
  }
}

// 组件挂载时启动数据更新
onMounted(() => {
  // 每3秒更新一次PLC数据
  dataTimer = setInterval(updatePLCData, 3000)
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
