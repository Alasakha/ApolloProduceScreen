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
      <div class="bg-opacity-20 rounded-lg p-3 border border-orange-400 border-opacity-30 flex flex-col h-full">
        <div class="text-base font-semibold text-cyan-300 mb-2 flex items-center justify-center gap-2" style="letter-spacing: 1px;">
          <span>粉体线PLC (FX3G-24MR)</span>
          <span v-if="isTemperatureExceeded(powderLineData)" class="text-orange-300 text-sm font-semibold animate-pulse">
            ⚠️ 温度偏差超过±5°C
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm flex-1">
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>实时温度:</span>
            <span class="text-white font-semibold">{{ formatTemperature(powderLineData.temperature) }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>标准温度:</span>
            <span class="text-white font-semibold">{{ formatTemperature(powderLineData.standard) }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400 col-span-2">
            <span>运行状态:</span>
            <span :class="[getStatusClass(powderLineData.status), 'font-semibold']">{{ formatStatusText(powderLineData.status) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 贴标线PLC监控 -->
      <div class="bg-opacity-20 rounded-lg p-3 border border-orange-400 border-opacity-30 flex flex-col h-full">
        <div class="text-base font-semibold text-cyan-300 mb-2 flex items-center justify-center gap-2" style="letter-spacing: 1px;">
          <span>贴标线PLC (FX3G-24MR)</span>
          <span v-if="isTemperatureExceeded(labelLineData)" class="text-orange-300 text-sm font-semibold animate-pulse">
            ⚠️ 温度偏差超过±5°C
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm flex-1">
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>实时温度:</span>
            <span class="text-white font-semibold">{{ formatTemperature(labelLineData.temperature) }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>标准温度:</span>
            <span class="text-white font-semibold">{{ formatTemperature(labelLineData.standard) }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400 col-span-2">
            <span>运行状态:</span>
            <span :class="[getStatusClass(labelLineData.status), 'font-semibold']">{{ formatStatusText(labelLineData.status) }}</span>
          </div>
        </div>
      </div>


      
      <!-- 液体线PLC监控 -->
      <div class="bg-opacity-20 rounded-lg p-3 border border-orange-400 border-opacity-30 flex flex-col h-full">
        <div class="text-base font-semibold text-cyan-300 mb-2 flex items-center justify-center gap-2" style="letter-spacing: 1px;">
          <span>液体线PLC (FX3G-40MR)</span>
          <span v-if="isTemperatureExceeded(liquidLineData)" class="text-orange-300 text-sm font-semibold animate-pulse">
            ⚠️ 温度偏差超过±5°C
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm flex-1">
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>实时温度:</span>
            <span class="text-white font-semibold">{{ formatTemperature(liquidLineData.temperature) }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400">
            <span>标准温度:</span>
            <span class="text-white font-semibold">{{ formatTemperature(liquidLineData.standard) }}</span>
          </div>
          <div class="text-cyan-200 flex items-center justify-between p-2 bg-opacity-20 rounded border border-cyan-400 col-span-2">
            <span>运行状态:</span>
            <span :class="[getStatusClass(liquidLineData.status), 'font-semibold']">{{ formatStatusText(liquidLineData.status) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getTemperature4, type Temperature4 } from '@/api/getStampWeldinfo'
import { eventBus } from '@/utils/eventbus'

interface PlcLineState {
  temperature: number | null;
  standard: number | null;
  status: number | null;
}

const createLineState = (): PlcLineState => ({
  temperature: null,
  standard: null,
  status: null
})

const powderLineData = ref<PlcLineState>(createLineState())
const labelLineData = ref<PlcLineState>(createLineState())
const liquidLineData = ref<PlcLineState>(createLineState())

const isLoading = ref(false)
const apiError = ref('')

const normalizeTemperature = (value?: number | null): number | null => {
  return typeof value === 'number' && !Number.isNaN(value) ? value : null
}

const normalizeStatus = (status?: number | null): number | null => {
  if (status === null || status === undefined) return null
  return status > 0 ? 1 : 0
}

const deriveStatusFromTemp = (temperature: number | null): number | null => {
  if (temperature === null) return null
  return temperature === 0 ? 0 : 1
}

const formatTemperature = (value: number | null) => {
  if (value === null) return '暂无'
  return `${value.toFixed(1)}°C`
}

const formatStatusText = (status: number | null) => {
  if (status === null) return '未知'
  return status === 1 ? '运行' : '停机'
}

const getStatusClass = (status: number | null) => {
  if (status === null) return 'text-amber-300'
  return status === 1 ? 'text-green-400' : 'text-red-400'
}

// 判断温度偏差是否超过±5°C
const isTemperatureExceeded = (lineData: PlcLineState): boolean => {
  if (lineData.temperature === null || lineData.standard === null || lineData.temperature === 0) {
    return false
  }
  const diff = Math.abs(lineData.temperature - lineData.standard)
  return diff > 5
}

const updateLineState = (
  target: { value: PlcLineState },
  actual?: number | null,
  standard?: number | null,
  status?: number | null
) => {
  target.value.temperature = normalizeTemperature(actual)
  target.value.standard = normalizeTemperature(standard)

  if (status === null || status === undefined) {
    target.value.status = deriveStatusFromTemp(target.value.temperature)
  } else {
    target.value.status = normalizeStatus(status)
  }
}

const updatePLCData = async () => {
  try {
    isLoading.value = true
    apiError.value = ''

    const response = await getTemperature4()
    const tempData: Partial<Temperature4> = response.data ?? {}

    updateLineState(powderLineData, tempData.ftx ?? null, tempData.ftxStandard ?? null, tempData.ftxStatus ?? null)
    updateLineState(labelLineData, tempData.tbx ?? null, tempData.tbxStandard ?? null, tempData.tbxStatus ?? null)
    updateLineState(liquidLineData, tempData.ytx ?? null, tempData.ytxStandard ?? null, tempData.ytxStatus ?? null)
  } catch (error) {
    console.error('获取温度数据失败:', error)
    apiError.value = '数据获取失败，请检查网络连接'
    setDataToNull()
  } finally {
    isLoading.value = false
  }
}

const setDataToNull = () => {
  const targets = [powderLineData, labelLineData, liquidLineData]
  targets.forEach(line => {
    line.value.temperature = null
    line.value.standard = null
    line.value.status = null
  })
}

onMounted(async () => {
  await updatePLCData()
  eventBus.on('refreshData', updatePLCData)
  eventBus.on('globalRefresh', updatePLCData)
})

onUnmounted(() => {
  eventBus.off('refreshData', updatePLCData)
  eventBus.off('globalRefresh', updatePLCData)
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>
