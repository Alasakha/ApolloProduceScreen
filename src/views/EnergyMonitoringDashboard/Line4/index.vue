<template>
  <div class="h-[10vh] w-full">
    <div class="flex w-full h-full justify-between gap-2">
      <!-- 标准累计总电量 -->
      <dv-border-box-2 class="flex-1">
        <div class="flex flex-col items-center justify-center h-full">
          <div class="text-[#00eeff] text-xl mb-2 flex items-center">
            标准累计总电量
            <span class="text-sm text-gray-400 ml-2">(2024年同期实际值)</span>
          </div>
          <div class="flex  items-center">
            <div class="flex items-center ">
              <span class="text-white mr-2">标准值：</span>
              <dv-digital-flop :config="standardTotalConfig" />
            </div>
            <div class="flex items-center mt-1">
              <span class="text-white mr-2">实际值：</span>
              <dv-digital-flop :config="actualTotalConfig" />
            </div>
            <div class="text-white mt-1">
              同比：<span :class="{
                'text-red-500': totalDiff > 0,
                'text-green-500': totalDiff < 0
              }">{{totalDiff > 0 ? '↑' : '↓'}}{{Math.abs(totalDiff)}}kw</span>
            </div>
          </div>
        </div>
      </dv-border-box-2>

      <!-- 电流电压检测 -->
      <dv-border-box-2 class="flex-1">
        <div class="flex flex-col items-center justify-center h-full">
          <div class="text-[#00eeff] text-xl mb-2 flex items-center">
            电流、电压检测
            <span class="text-sm text-gray-400 ml-2">(标准、实际、超过多少报警)</span>
          </div>
          <div class="flex items-center">
            <div class="flex  items-center">
              <div class="flex items-center">
                <span class="text-white mr-2">标准值：</span>
                <dv-digital-flop :config="standardConfig" />
              </div>
              <div class="flex items-center mt-1">
                <span class="text-white mr-2">实际值：</span>
                <dv-digital-flop :config="actualConfig" />
              </div>
              <div class="mt-1">
                <span :class="{
                  'text-red-500': diffStatus.includes('报警'),
                  'text-green-500': !diffStatus.includes('报警')
                }">{{diffStatus}}</span>
              </div>
            </div>
          </div>
        </div>
      </dv-border-box-2>

      <!-- 峰谷用电 -->
      <dv-border-box-2 class="flex-1">
        <div class="flex flex-col items-center justify-center h-full">
          <div class="text-[#00eeff] text-xl mb-2 flex items-center">
            峰谷用电
            <span class="text-sm text-gray-400 ml-2">(高峰、平段、低谷分别使用率)</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-white text-center whitespace-nowrap">{{usageRatio}}</div>
            <div class="flex gap-2 mt-2">
              <dv-digital-flop :config="peakConfig" />
              <dv-digital-flop :config="valleyConfig" />
            </div>
          </div>
        </div>
      </dv-border-box-2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 标准累计总电量数据
const standardTotal = ref(0)
const actualTotal = ref(0)
const totalDiff = ref(0)

const standardTotalConfig = ref({
  number: [0],
  content: '{nt}kW',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualTotalConfig = ref({
  number: [0],
  content: '{nt}kW',
  style: { fontSize: 24, fill: '#00eeff' }
})

// 电流电压检测数据
const standardValue = ref(0)
const actualValue = ref(0)
const diffStatus = ref('=')

const standardConfig = ref({
  number: [0],
  content: '{nt}V',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualConfig = ref({
  number: [0],
  content: '{nt}V',
  style: { fontSize: 24, fill: '#00eeff' }
})

// 峰谷用电数据
const peakUsage = ref(0)
const normalUsage = ref(0)
const valleyUsage = ref(0)
const usageRatio = ref('')

const peakConfig = ref({
  number: [0],
  content: '{nt}kW/h',
  style: { fontSize: 20, fill: '#ff4d4f' }
})

const valleyConfig = ref({
  number: [0],
  content: '{nt}kW/h',
  style: { fontSize: 20, fill: '#52c41a' }
})

// 更新数据
const updateData = () => {
  // 更新标准累计总电量
  standardTotal.value = Math.floor(Math.random() * 10000)
  actualTotal.value = Math.floor(Math.random() * 10000)
  totalDiff.value = actualTotal.value - standardTotal.value
  standardTotalConfig.value.number = [standardTotal.value]
  actualTotalConfig.value.number = [actualTotal.value]

  // 更新电流电压检测
  standardValue.value = Math.floor(Math.random() * 500)
  actualValue.value = Math.floor(Math.random() * 500)
  const diff = actualValue.value - standardValue.value
  diffStatus.value = diff > 50 ? `↑${diff.toFixed(1)}(报警)` : 
                     diff < -50 ? `↓${Math.abs(diff).toFixed(1)}(报警)` : 
                     `=${diff.toFixed(1)}`
  standardConfig.value.number = [standardValue.value]
  actualConfig.value.number = [actualValue.value]

  // 更新峰谷用电
  peakUsage.value = Math.floor(Math.random() * 100)
  normalUsage.value = Math.floor(Math.random() * 100)
  valleyUsage.value = Math.floor(Math.random() * 100)
  const total = peakUsage.value + normalUsage.value + valleyUsage.value
  usageRatio.value = `峰${(peakUsage.value/total*100).toFixed(1)}% 平${(normalUsage.value/total*100).toFixed(1)}% 谷${(valleyUsage.value/total*100).toFixed(1)}%`
  peakConfig.value.number = [peakUsage.value]
  valleyConfig.value.number = [valleyUsage.value]
}

let timer: number | null = null

onMounted(() => {
  updateData()
  timer = window.setInterval(updateData, 3000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
:deep(.dv-digital-flop) {
  width: 120px;
  height: 30px;
}
</style>