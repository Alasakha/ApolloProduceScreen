<template>
  <div class="w-full h-full p-1">
    <div class="text-xl font-bold text-white mb-3 text-center" style="letter-spacing: 2px;">
      设备监控
    </div>
    
    <!-- 加载状态和错误提示 -->
    <div v-if="isLoading" class="text-center text-cyan-300 mb-3">
      <div class="inline-flex items-center">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-300 mr-2"></div>
        正在获取数据...
      </div>
    </div>
    
    <div v-if="apiError" class="text-center text-red-400 mb-3 bg-red-900 bg-opacity-20 rounded p-2">
      {{ apiError }}
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
            <span class="text-white font-semibold">{{ powderLineData.temperature !== null ? powderLineData.temperature + '°C' : '暂无' }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>工作温度:</span>
            <span class="text-white font-semibold">{{ powderLineData.workTemp !== null ? powderLineData.workTemp + '°C' : '暂无' }}</span>
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
            <span class="text-white font-semibold">{{ labelLineData.workTemp !== null ? labelLineData.workTemp + '°C' : '暂无' }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>固化炉温度:</span>
            <span class="text-white font-semibold">{{ labelLineData.temperature !== null ? labelLineData.temperature + '°C' : '暂无' }}</span>
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
            <span class="text-white font-semibold">{{ liquidLineData.workTemp !== null ? liquidLineData.workTemp + '°C' : '暂无' }}</span>
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
            <span class="text-white font-semibold">{{ liquidLineData.temperature !== null ? liquidLineData.temperature + '°C' : '暂无' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getTemperature4 } from '@/api/getStampWeldinfo'
import { eventBus } from '@/utils/eventbus'

// 粉体线PLC数据
const powderLineData = ref({
  temperature: null,    // 固化炉温度
  workTemp: null,       // 固化炉工作温度写入
  overTemp: false,     // 固化炉超温写入
  lowTemp: false       // 固化炉低温写入
})

// 贴标线PLC数据
const labelLineData = ref({
  overTemp: false,     // 固化炉超温
  productionCount: 1250, // 生产计量信号
  workTemp: null,       // 固化炉工作温度写入
  temperature: null     // 固化炉温度
})

// 皮膜线PLC数据
const filmLineData = ref({
  productionCount: 980, // 生产计量信号
  workTemp: null,       // 固化炉工作温度写入
  overTemp: false,     // 固化炉超温写入
  temperature: null     // 固化炉温度
})

// 液体线PLC数据
const liquidLineData = ref({
  overTemp: false,     // 固化炉超温
  productionCount: 1100, // 生产计量信号
  workTemp: null,       // 固化炉工作温度写入
  overTempWrite: false, // 固化炉超温写入
  lowTempWrite: false,  // 固化炉低温写入
  temperature: null     // 固化炉温度
})

// T4炉PLC数据
const t4FurnaceData = ref({
  overTemp: false,     // 炉内超温
  tempReached: true,   // 炉内温度到达
  insulationTime: 45,  // 保温计时
  timerEnd: false      // 保温计时结束
})

// API数据更新
const isLoading = ref(false)
const apiError = ref('')
let lastUpdateTime = 0
const UPDATE_INTERVAL = 5000 // 最小更新间隔5秒

const updatePLCData = async () => {
  const now = Date.now()
  if (now - lastUpdateTime < UPDATE_INTERVAL) {
    console.log('⏳ 请求过于频繁，跳过本次更新')
    return
  }
  lastUpdateTime = now
  try {
    isLoading.value = true
    apiError.value = ''
    
    // 获取真实温度数据
    const response = await getTemperature4()
    const tempData = response.data
    
    // 更新粉体线数据 (pmx)
    powderLineData.value.temperature = tempData.pmx
    powderLineData.value.workTemp = tempData.pmx - 5
    powderLineData.value.overTemp = tempData.pmx > 200
    powderLineData.value.lowTemp = tempData.pmx < 160
    
    // 更新贴标线数据 (tbx) 
    labelLineData.value.temperature = tempData.tbx
    labelLineData.value.workTemp = tempData.tbx - 5
    labelLineData.value.overTemp = tempData.tbx > 195
    
    // 更新液体线数据 (ytx)
    liquidLineData.value.temperature = tempData.ytx
    liquidLineData.value.workTemp = tempData.ytx - 5
    liquidLineData.value.overTemp = tempData.ytx > 185
    liquidLineData.value.overTempWrite = liquidLineData.value.overTemp
    liquidLineData.value.lowTempWrite = tempData.ytx < 150
    
    // 保持生产计数的模拟更新（如果API没有提供）
    labelLineData.value.productionCount += Math.floor(Math.random() * 3)
    filmLineData.value.productionCount += Math.floor(Math.random() * 2)
    liquidLineData.value.productionCount += Math.floor(Math.random() * 4)
    
    // 检查报警条件
    checkAlarmConditions()
    
  } catch (error) {
    console.error('获取温度数据失败:', error)
    apiError.value = '数据获取失败，请检查网络连接'
    
    // 发生错误时设置数据为null，显示"暂无"
    setDataToNull()
  } finally {
    isLoading.value = false
  }
}

// 设置数据为null，显示"暂无"
const setDataToNull = () => {
  powderLineData.value.temperature = null
  powderLineData.value.workTemp = null
  powderLineData.value.overTemp = false
  powderLineData.value.lowTemp = false
  
  labelLineData.value.temperature = null
  labelLineData.value.workTemp = null
  labelLineData.value.overTemp = false
  
  liquidLineData.value.temperature = null
  liquidLineData.value.workTemp = null
  liquidLineData.value.overTemp = false
  liquidLineData.value.overTempWrite = false
  liquidLineData.value.lowTempWrite = false
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
onMounted(async () => {
  // 立即获取一次数据
  await updatePLCData()
  
  // 只监听全局刷新事件，移除3秒定时器
  eventBus.on('globalRefresh', updatePLCData)
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  // 移除EventBus监听
  eventBus.off('globalRefresh', updatePLCData)
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>
