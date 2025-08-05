<template>
  <div class="h-[22vh] w-full p-2">
    <dv-border-box-2>
      <div class="flex flex-col h-full">
        <!-- 标题 -->
        <div class="text-[#00eeff] text-2xl font-bold px-8 py-2 flex justify-between items-center">
          <span>天然气排放监控</span>
          <span v-if="isLeaking" class="text-red-500 text-xl animate-pulse flex items-center">
            <i class="el-icon-warning mr-2"></i>
            检测到泄露！浓度：{{ leakageLevel }}ppm
          </span>
        </div>

        <!-- 内容区域 -->
        <div class="flex-1 flex justify-between px-20">
          <!-- 年度排放 -->
          <div class="w-[33%] flex flex-col">
            <div class="text-[#00eeff] text-xl mb-4">年度排放</div>
            <div class="flex gap-4 items-start h-full">
              <div class="flex flex-col gap-2">
                <div class="flex items-center">
                  <span class="text-[#00eeff] w-14">实际：</span>
                  <span class="text-[#00eeff] text-2xl">{{actualYear}}m³</span>
                </div>
                <div class="text-red-500 text-sm">同比：{{yearDiff}}m³</div>
              </div>
              <div class="relative">
                <dv-water-level-pond :config="waterConfig1" style="width:140px;height:140px" />
              </div>
            </div>
          </div>

          <!-- 月度排放 -->
          <div class="w-[33%] flex flex-col">
            <div class="text-[#00eeff] text-xl mb-4">月度排放</div>
            <div class="flex gap-4 items-start h-full">
              <div class="flex flex-col gap-2">
                <div class="flex items-center">
                  <span class="text-[#00eeff] w-14">实际：</span>
                  <span class="text-[#00eeff] text-2xl">{{actualMonth}}m³</span>
                </div>
                <div class="text-red-500 text-sm">同比：{{monthDiff}}m³</div>
              </div>
              <div class="relative">
                <dv-water-level-pond :config="waterConfig2" style="width:140px;height:140px" />
              </div>
            </div>
          </div>

          <!-- 日排放 -->
          <div class="w-[33%] flex flex-col">
            <div class="text-[#00eeff] text-xl mb-4">日排放</div>
            <div class="flex gap-4 items-start h-full">
              <div class="flex flex-col gap-2">
                <div class="flex items-center">
                  <span class="text-[#00eeff] w-14">实际：</span>
                  <span class="text-[#00eeff] text-2xl">{{actualDay}}m³</span>
                </div>
                <div class="text-red-500 text-sm">同比：{{dayDiff}}m³</div>
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
import { ref, onMounted, onUnmounted } from 'vue'

// 模拟数据
const standardYear = ref(1000)
const actualYear = ref(800)
const yearDiff = ref(-200)

const standardMonth = ref(100)
const actualMonth = ref(80)
const monthDiff = ref(-20)

const standardDay = ref(10)
const actualDay = ref(8)
const dayDiff = ref(-2)

// 泄露检测
const isLeaking = ref(false)
const leakageLevel = ref(0)

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
  // 年度数据
  actualYear.value = Math.floor(Math.random() * 500 + 500)
  yearDiff.value = actualYear.value - standardYear.value
  waterConfig1.value.data = [actualYear.value / standardYear.value * 100]

  // 月度数据
  actualMonth.value = Math.floor(Math.random() * 50 + 50)
  monthDiff.value = actualMonth.value - standardMonth.value
  waterConfig2.value.data = [actualMonth.value / standardMonth.value * 100]

  // 日数据
  actualDay.value = Math.floor(Math.random() * 5 + 5)
  dayDiff.value = actualDay.value - standardDay.value
  waterConfig3.value.data = [actualDay.value / standardDay.value * 100]

  // 模拟泄露检测
  if (Math.random() > 0.8) {
    isLeaking.value = true
    leakageLevel.value = Math.floor(Math.random() * 100 + 100)
  } else {
    isLeaking.value = false
    leakageLevel.value = 0
  }
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
